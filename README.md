## About the Project
Based on the low-cost wearable device called Swimu, this repository contains an application for mobile and/or Web devices that allows the recording of data of swimming sessions training. At the end of a workout, the mobile application collects the data read by the sensor and displays a dashboard that shows the training statistics, such as swimming styles, distances, etc.

## Setup
- **Download or clone** this source code into a new directory;

- **Setup React Native on your project**, follow [these](https://reactnative.dev/docs/environment-setup) instructions, based on your operating system - ***make sure to use the React Native CLI Quickstart rather than the Expo Go Quickstart***;

- **Install the necessary React modules** using the following command on the directory's terminal, this will install all necessary dependencies:
  ```
  npm install
  ```

## Running the Application on your Phone
- **Enable Developer Mode on your phone:** on your iOS go to Settings > Privacy & Security > Developer Mode to show the Developer Mode toggle switch, on your Android go to Settings > About Device/Phone > Software Information > Tap “Build number” seven times > Enter your pattern, PIN or password to enable the Developer options menu - ***make sure USB debugging is turned on on this menu***;

- **Connect your phone to your computer** via cable, run ```adb devices``` to see if your phone's been recognized - if you run into any issues, such as the devices being offline or unauthorized turn the USB debugging on your phone off, run ```abd kill-server```, turn USB debugging back on and run ```abd start-server```, this should bring up a prompt to accept debugging from the device;

- **Run the code**, and select the device you're running on:
  ```
  npx react-native start
  ``` 



