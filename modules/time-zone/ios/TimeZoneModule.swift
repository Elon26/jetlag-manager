import ExpoModulesCore

public class TimeZoneModule: Module {
  public func definition() -> ModuleDefinition {
    Name("TimeZone")

    Function("localTimeZoneIdentifier") {
      return TimeZone.current.identifier
    }

    Function("localTimeZoneDisplayName") {
      return TimeZone.current.localizedName(for: .standard, locale: Locale.current)
    }

    Function("abbreviationDictionary") {
      return TimeZone.abbreviationDictionary
    }

    Function("abbreviationForIdentifier") { (identifier: String) -> String? in
      return TimeZone(identifier: identifier)?.abbreviation()
    }

    Function("identifierForAbbreviation") { (abbreviation: String) -> String? in
      return TimeZone.abbreviationDictionary.first(where: { $0.value == abbreviation })?.key
    }

    Function("knownTimeZoneIdentifiers") {
      return TimeZone.knownTimeZoneIdentifiers
    }
  }
}
