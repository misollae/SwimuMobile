/* eslint-disable prettier/prettier */

import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

type PermissionCallback = (result: boolean) => void;
const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
    scanForDevices(): void;
    allDevices: Device[];
}

export default function useBLE(): BluetoothLowEnergyApi {
    const [allDevices, setAllDevices] = useState<Device[]>([]);

    const requestPermissions = async (callback: PermissionCallback) => {
        if (Platform.OS === 'android') {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              ];

              console.log('Requested permissions:', permissions);

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
        console.log('Going to scan');
        bleManager.startDeviceScan(null, null, (error, device) => {
            console.log("I'm scanning!");
            if (error) {console.log(error);}
            if (device) {
                console.log('ID: ' + device.id);
                setAllDevices((prevState) => {
                    console.log('No if');
                    if (!isDuplicateDevice(prevState, device)) {return [...prevState, device];}
                    return prevState;
                });
            }
        });
        console.log('After scanning');
    };

    return {
        requestPermissions,
        scanForDevices,
        allDevices,
    };
}
