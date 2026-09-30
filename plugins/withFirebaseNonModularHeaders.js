const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const PRE_INSTALL_HOOK = `
  pre_install do |installer|
    installer.pod_targets.each do |pod|
      if ['RNFBApp', 'RNFBCrashlytics'].include?(pod.name)
        def pod.build_type
          Pod::BuildType.static_library
        end
      end
    end
  end
`;

const POST_INSTALL_HOOK = `
    installer.pods_project.targets.each do |target|
      next unless target.name.start_with?('RNFB')

      target.build_configurations.each do |build_config|
        build_config.build_settings['DEFINES_MODULE'] = 'NO'
      end
    end
`;

function withFirebaseNonModularHeaders(config) {
  return withDangerousMod(config, [
    "ios",
    async (modConfig) => {
      const podfilePath = path.join(modConfig.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");

      if (!contents.includes("$RNFirebaseAsStaticFramework")) {
        contents = contents.replace(
          "prepare_react_native_project!",
          "$RNFirebaseAsStaticFramework = true\n\nprepare_react_native_project!"
        );
      }

      if (!contents.includes("Pod::BuildType.static_library")) {
        contents = contents.replace(
          /use_react_native!\([\s\S]*?\)\n/,
          (match) => `${match}\n${PRE_INSTALL_HOOK}`
        );
      }

      if (!contents.includes("DEFINES_MODULE")) {
        contents = contents.replace(
          /react_native_post_install\([\s\S]*?\)\n/,
          (match) => `${match}${POST_INSTALL_HOOK}`
        );
      }

      fs.writeFileSync(podfilePath, contents);
      return modConfig;
    },
  ]);
}

module.exports = withFirebaseNonModularHeaders;
