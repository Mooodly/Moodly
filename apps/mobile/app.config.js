import 'dotenv/config';

import * as fs from 'fs';
import * as path from 'path';

const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV || process.env.APP_ENV || 'develop';
const isProd = APP_ENV === 'production';
const isStg = APP_ENV === 'staging';

const suffix = isProd ? '' : isStg ? ' 베타' : ' 개발';
const icon = isProd ? './assets/icon.png' : './assets/icon-dev.png';

const iosBundleId = isProd
  ? 'com.moodly.diary.emotion'
  : isStg
    ? 'com.moodlybeta'
    : 'com.moodlydev';
const androidPackage = isProd ? 'com.moodlyfrontend' : isStg ? 'com.moodlybeta' : 'com.moodlydev';
const scheme = isProd ? 'moodly' : isStg ? 'moodlybeta' : 'moodlydev';

const iosGoogleServiceFile = isProd
  ? './GoogleService-Info.prod.plist'
  : isStg
    ? './GoogleService-Info.stg.plist'
    : './GoogleService-Info.dev.plist';

const androidGoogleServiceFile = isProd
  ? './google-services.prod.json'
  : isStg
    ? './google-services.stg.json'
    : './google-services.dev.json';

const createFileFromSecret = (filename, secretBase64) => {
  if (!secretBase64) return;

  const filePath = path.resolve(__dirname, filename);
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, Buffer.from(secretBase64, 'base64'));
      console.log(`Created ${filename} from EAS Secret`);
    } catch (e) {
      console.error(`Failed to create ${filename}`, e);
    }
  }
};

if (isProd) {
  createFileFromSecret(androidGoogleServiceFile, process.env.ANDROID_GOOGLE_SERVICES_PROD_BASE64);
  createFileFromSecret(iosGoogleServiceFile, process.env.IOS_GOOGLE_SERVICES_PROD_BASE64);
} else if (isStg) {
  createFileFromSecret(androidGoogleServiceFile, process.env.ANDROID_GOOGLE_SERVICES_STG_BASE64);
  createFileFromSecret(iosGoogleServiceFile, process.env.IOS_GOOGLE_SERVICES_STG_BASE64);
} else {
  createFileFromSecret(androidGoogleServiceFile, process.env.ANDROID_GOOGLE_SERVICES_DEV_BASE64);
  createFileFromSecret(iosGoogleServiceFile, process.env.IOS_GOOGLE_SERVICES_DEV_BASE64);
}

const PROJECT_ID = process.env.EAS_PROJECT_ID ?? 'f8d839f5-d120-447f-a68e-97912852bbe3';

export default {
  name: `무들리${suffix}`,
  slug: 'moodly-monorepo',
  version: '1.2.1',
  owner: 'sunggyu_jeong',
  scheme,
  userInterfaceStyle: 'light',
  orientation: 'portrait',
  icon,

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },

  updates: {
    url: `https://u.expo.dev/${PROJECT_ID}`,
    fallbackToCacheTimeout: 0,
    checkAutomatically: 'ON_LOAD',
  },

  runtimeVersion: '1.2.1',
  assetBundlePatterns: ['**/*'],

  ios: {
    buildNumber: '5',
    bundleIdentifier: iosBundleId,
    googleServicesFile: iosGoogleServiceFile,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      CFBundleDevelopmentRegion: 'ko',
      CFBundleLocalizations: ['ko'],
    },
  },

  android: {
    package: androidPackage,
    googleServicesFile: androidGoogleServiceFile,
    versionCode: 10,
    adaptiveIcon: {
      foregroundImage: icon,
      backgroundColor: '#ffffff',
    },
    intentFilters: [{ action: 'VIEW', category: ['BROWSABLE', 'DEFAULT'], data: [{ scheme }] }],
  },

  plugins: [
    '@react-native-google-signin/google-signin',
    [
      'expo-build-properties',
      {
        android: { kotlinVersion: '2.1.20' },
        ios: { useFrameworks: 'static' },
      },
    ],
  ],

  extra: {
    APP_ENV,
    eas: { projectId: PROJECT_ID },
  },
};
