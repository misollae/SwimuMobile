/* eslint-disable prettier/prettier */
declare module 'react-native-waveview' {
    import { Component } from 'react';
    import { StyleProp, ViewStyle } from 'react-native';
  
    interface WaveParams {
      A: number;
      T: number;
      fill: string;
    }
  
    interface WaveProps {
      H: number;
      waveParams: WaveParams[];
      animated?: boolean;
      style?: StyleProp<ViewStyle>;
      speed?: number;
      speedIncreasePerWave?: number;
      easing?: string;
    }
  
    class Wave extends Component<WaveProps> {
      setWaveParams(waveParams: WaveParams[]): void;
      setWaterHeight(H: number): void;
      startAnim(): void;
      stopAnim(): void;
    }
  
    export default Wave;
  }
  