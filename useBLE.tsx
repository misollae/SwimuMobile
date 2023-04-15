/* eslint-disable no-bitwise */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react';
import { atob, btoa } from 'react-native-quick-base64';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleManager, Characteristic, Device } from 'react-native-ble-plx';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

type PermissionCallback = (result: boolean) => void;
const bleManager = new BleManager();

const SPORT_DEVICE_SERVICE_UUID       = '0000183E-0000-1000-8000-00805F9B34FB';
const SPORT_DEVICE_CHARATERISTIC_UUID = '00002B3C-0000-1000-8000-00805F9B34FB';

const TIME_SERVICE_UUID = '00001805-0000-1000-8000-00805F9B34FB';
const TIME_SERVICE_CHARATERISTIC_UUID = '00002A2B-0000-1000-8000-00805F9B34FB';

interface BluetoothLowEnergyApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
    scanForDevices(): void;
    connectToDevice(device: Device): Promise<void>;
    allDevices: Device[];
    onStartTrain: (error: BleError | null, characteristic: Characteristic | null) => Promise<void>;

}

export default function useBLE(): BluetoothLowEnergyApi {
    const [allDevices, setAllDevices]  = useState<Device[]>([]);
    const [device, setConnectedDevice] = useState<Device| null>(null);
    const [trainingInfo, setTrainingInfo] = useState<number>(0);

    const requestPermissions = async (callback: PermissionCallback) => {
        if (Platform.OS === 'android') {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              ];

              const grantedStatus = await PermissionsAndroid.requestMultiple(
                permissions
              );

            const granted = Object.values(grantedStatus).every(status => status === PermissionsAndroid.RESULTS.GRANTED);
            callback(granted);
          } else {
            callback(true);
        }
    };

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    const scanForDevices = () => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {console.log(error);}
            if (device && device.name?.includes('Swimu')) {
                setAllDevices((prevState) => {
                    if (!isDuplicateDevice(prevState, device)) {return [...prevState, device];}
                    return prevState;
                });
            }
        });
    };

    const connectToDevice = async(device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            bleManager.stopDeviceScan();
            await deviceConnection.discoverAllServicesAndCharacteristics();
            startStreamingData(device);
        } catch (e) {
            console.log('Error when connecting: ', e);
        }
    };

    const startStreamingData = async (device: Device) => {
        if (device) {
            device.monitorCharacteristicForService(
                SPORT_DEVICE_SERVICE_UUID,
                SPORT_DEVICE_CHARATERISTIC_UUID,
                onDataUpdate
            );
        } else {
            console.error('NO DEVICE');
        }
    };

    const onStartTrain = async (
        error: BleError | null,
        characteristic: Characteristic | null,
    ) => {
        if (error){
            console.error(error);
            return;
        } else if (!characteristic?.value){
            console.log('No charateristic');
            return;
        }
        // Get the current time in milliseconds since epoch
        const currentTimeMillis = new Date().getTime();
        const data = new Uint8Array(new Int32Array([currentTimeMillis]).buffer);
        // Encode the Uint8Array as a Base64 string
        const base64Data = btoa(String.fromCharCode(...data));

        try {
            await characteristic.writeWithResponse(base64Data);
            console.log('Data written successfully');
          } catch (error) {
            console.error('Error writing data: ', error);
          }

        //SEND DATA
    };


    const onDataUpdate = (
        error: BleError | null,
        characteristic: Characteristic | null,
    ) => {
        if (error){
            console.error(error);
            return;
        } else if (!characteristic?.value){
            console.log('No charateristic');
            return;
        }

        let rawData = atob(characteristic.value);
        const valueRoll   = (rawData.charCodeAt(1) << 8) | rawData.charCodeAt(0);
        const valuePitch  = (rawData.charCodeAt(9) << 8) | rawData.charCodeAt(8);

        console.log(characteristic.value);
        console.log('Roll: ' + valueRoll + ' Pitch: ' + valuePitch);
        setTrainingInfo(valueRoll);
    };

    return {
        requestPermissions,
        scanForDevices,
        connectToDevice,
        allDevices,
        onStartTrain,
    };
}
