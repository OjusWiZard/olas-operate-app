const dotenv = require('dotenv');
const build = require('electron-builder').build;
const publishOptions = require('./electron/constants/publishOptions');

dotenv.config();

const main = async () => {
  console.log('Building...');

  /** @type import {CliOptions} from "electron-builder" */
  await build({
    publish: 'onTag',
    config: {
      appId: 'xyz.valory.olas-operate-app',
      artifactName: '${productName}-${version}-${platform}-${arch}.${ext}',
      productName: 'Olas Operate',
      files: ['electron/**/*', 'package.json'],
      directories: {
        output: 'dist',
      },
      cscKeyPassword: process.env.CSC_KEY_PASSWORD,
      cscLink: process.env.CSC_LINK,
      mac: {
        target: [
          {
            target: 'dmg',
            arch: ['arm64'],
          },
        ],
        publish: publishOptions,
        category: 'public.app-category.utilities',
        icon: 'electron/assets/icons/splash-robot-head.png',
        hardenedRuntime: true,
        gatekeeperAssess: false,
        entitlements: 'electron/entitlements.mac.plist',
        entitlementsInherit: 'electron/entitlements.mac.plist',
        notarize: {
          teamId: process.env.APPLETEAMID
        },
      },
    },
  });
};

main().then((response) => { console.log('Build & Notarize complete'); }).catch((e) => console.error(e));