import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import HotUpdaterReactNative

@main
class AppDelegate: RCTAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    self.moduleName = "MoodlyFrontend"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func application(
    _ application: UIApplication,
    supportedInterfaceOrientationsFor window: UIWindow?
  ) -> UIInterfaceOrientationMask {
    return .portrait
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings()
        .jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
    #else
      return HotUpdater.bundleURL()
    #endif
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings()
        .jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
    #else
      return HotUpdater.bundleURL()
    #endif
  }
}