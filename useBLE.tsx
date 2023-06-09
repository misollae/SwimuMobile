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
    connectedDevice: Device | null;
    onStartTrain(device:Device): void;
}
export type { BluetoothLowEnergyApi };

export default function useBLE(): BluetoothLowEnergyApi {
    const [allDevices, setAllDevices]  = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device| null>(null);

    const requestPermissions = async (callback: PermissionCallback) => {
        if (Platform.OS === 'android') {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
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
            if (error) {console.log(error.reason);}
            if (device && device.name?.includes('Swimu')) {
                setAllDevices((prevState) => {
                    if (!isDuplicateDevice(prevState, device)) {return [...prevState, device];}
                    return prevState;
                });
            }
        });
    };

    const connectToDevice = async(device: Device, ) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            bleManager.stopDeviceScan();
            await deviceConnection.discoverAllServicesAndCharacteristics();
            console.log('ok');
        } catch (e) {
            console.log('Error when connecting: ', e);
        }
    };

    const onStartTrain = async (device: Device) => {
        if (device) {
            try {
                const now            = new Date();
                const timezoneOffset = now.getTimezoneOffset() / -60;
                const timeBytes      = new Uint8Array(10);

                timeBytes[0] = now.getUTCFullYear()  & 0xff;
                timeBytes[1] = (now.getUTCFullYear() >> 8) & 0xff;
                timeBytes[2] = now.getUTCMonth() + 1;
                timeBytes[3] = now.getUTCDate();
                timeBytes[4] = now.getUTCHours() + timezoneOffset;
                timeBytes[5] = now.getUTCMinutes();
                timeBytes[6] = now.getUTCSeconds();
                timeBytes[7] = now.getUTCDay();

                const base64Data = btoa(String.fromCharCode(...timeBytes));
                console.log(timeBytes);
                console.log(base64Data);

                await bleManager.writeCharacteristicWithResponseForDevice(
                    device.id,
                    TIME_SERVICE_UUID,
                    TIME_SERVICE_CHARATERISTIC_UUID,
                    base64Data
                );

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
        connectedDevice,
        onStartTrain,
    };
}
