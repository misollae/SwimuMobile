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

const TIME_SERVICE_UUID               = '00001805-0000-1000-8000-00805F9B34FB';
const TIME_SERVICE_CHARATERISTIC_UUID = '00002A2B-0000-1000-8000-00805F9B34FB';

interface BluetoothLowEnergyApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
    scanForDevices(): void;
    connectToDevice(device: Device): Promise<void>;
    allDevices: Device[];
    onStartTrain(): void;
}
export type { BluetoothLowEnergyApi };

export default function useBLE(): BluetoothLowEnergyApi {
    const [allDevices, setAllDevices]  = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device| null>(null);

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
            //onStartTrain(device);
        } catch (e) {
            console.log('Error when connecting: ', e);
        }
    };

        const onStartTrain = async () => {
        if (connectedDevice) {
            console.log('Olá');
            try {
                const currentTimeMillis = new Date().getTime();
                const data = new Uint8Array(new Int32Array([currentTimeMillis]).buffer);
                const base64Data = btoa(String.fromCharCode(...data));

                await bleManager.writeCharacteristicWithResponseForDevice(
                        connectedDevice.id,
                        TIME_SERVICE_UUID,
                        TIME_SERVICE_CHARATERISTIC_UUID,
                        base64Data);

                console.log('Data written successfully');
              } catch (error) {
                console.error('Error writing data: ', error);
              }
        }
    };

    return {
        requestPermissions,
        scanForDevices,
        connectToDevice,
        allDevices,
        onStartTrain,
    };
}