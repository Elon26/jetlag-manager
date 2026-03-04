import AVFoundation
import ExpoModulesCore
import UIKit

public class TickerModule: Module {
  let generator: UIImpactFeedbackGenerator = {
    let generator = UIImpactFeedbackGenerator(style: .rigid)
    generator.prepare()
    return generator
  }()
  public func definition() -> ModuleDefinition {
    Name("Ticker")
    AsyncFunction("tick") { (soundID: UInt32) in
      let systemSoundID: SystemSoundID = soundID as? SystemSoundID ?? 1104
      AudioServicesPlaySystemSound(systemSoundID)
      generator.impactOccurred()
    }

  }
}
