import { NativeModule, requireNativeModule } from 'expo';

declare class TickerModule extends NativeModule {
  tick(soundID?: number): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<TickerModule>('Ticker');
