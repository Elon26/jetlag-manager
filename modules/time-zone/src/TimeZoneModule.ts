import { NativeModule, requireNativeModule } from 'expo';

declare class TimeZoneModule extends NativeModule {
  localTimeZoneIdentifier(): string;
  localTimeZoneDisplayName(): string;
  abbreviationDictionary(): Record<string, string>;
  abbreviationForIdentifier(identifier: string): string;
  identifierForAbbreviation(abbreviation: string): string;
  knownTimeZoneIdentifiers(): string[];
}

export default requireNativeModule<TimeZoneModule>('TimeZone');
