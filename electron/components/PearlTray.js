const Electron = require('electron');
const { isMac, isLinux, isWindows, isDev } = require('../constants');
const { logger } = require('../logger');

// Used to resize the tray icon on macOS
const macTrayIconSize = { width: 16, height: 16 };

/** Status supported by tray icons.
 * @readonly
 * @enum {'logged-out' | 'low-gas' | 'paused' | 'running'}
 */
const TrayIconStatus = {
  LoggedOut: 'logged-out',
  LowGas: 'low-gas',
  Paused: 'paused',
  Running: 'running',
};

const appPath = Electron.app.getAppPath();

/** Paths to tray icons for different statuses.
 * @readonly
 * @type {Record<TrayIconStatus, string>}
 */
const trayIconPaths = {
  [TrayIconStatus.LoggedOut]: `${appPath}/electron/assets/icons/tray-logged-out.png`,
  [TrayIconStatus.LowGas]: `${appPath}/electron/assets/icons/tray-low-gas.png`,
  [TrayIconStatus.Paused]: `${appPath}/electron/assets/icons/tray-paused.png`,
  [TrayIconStatus.Running]: `${appPath}/electron/assets/icons/tray-running.png`,
};

/** Tray icons as native images
 * @note macOS icons are resized
 * @readonly
 * @type {Record<TrayIconStatus, Electron.NativeImage | string>} */
const trayIcons = Object.entries(trayIconPaths).reduce(
  (acc, [status, path]) => ({
    ...acc,
    [status]: (() => {
      // Linux does not support nativeImage
      if (isLinux) return path;

      // Windows and macOS support nativeImage
      let trayIcon = Electron.nativeImage.createFromPath(path);

      if (isMac) {
        // Resize icon for tray
        trayIcon = trayIcon.resize(macTrayIconSize);
        // Mark the image as a template image for MacOS to apply correct color
        trayIcon.setTemplateImage(true);
      }

      return trayIcon;
    })(),
  }),
  {},
);

/** Cross-platform Electron Tray for Pearl, with context menu, icon, events. */
class PearlTray extends Electron.Tray {
  /** @param {() => Electron.BrowserWindow | null} activeWindowCallback */
  constructor(activeWindowCallback) {
    // Set the tray icon to the logged-out state by default
    super(trayIcons[TrayIconStatus.LoggedOut]);

    // Store the callback to retrieve the active window
    this.activeWindowCallback = activeWindowCallback;

    this.setContextMenu(new PearlTrayContextMenu(activeWindowCallback));
    this.setToolTip('Pearl');

    this.#bindClickEvents();
    this.#bindIpcListener();
  }

  #bindClickEvents = () => {
    if (isWindows) {
      isDev && logger.electron('binding windows click events to tray');
      // Windows: Handle single and double-clicks to show the window
      this.on('click', () => this.activeWindowCallback()?.show());
      this.on('double-click', () => this.activeWindowCallback()?.show());
      this.on('right-click', () => this.popUpContextMenu());
    }
    isDev &&
      logger.electron('no click events bound to tray as not using win32');
    // macOS and Linux handle all clicks by displaying the context menu
    // can show window by selecting 'Show app' on dropdown
    // or clicking the app icon in the dock
  };

  #bindIpcListener = () => {
    isDev && logger.electron('binding ipc listener for tray icon status');
    Electron.ipcMain.on('tray', (_event, status) => {
      isDev && logger.electron('received tray icon status:', status);
      switch (status) {
        case TrayIconStatus.LoggedOut: {
          this.setImage(trayIcons[TrayIconStatus.LoggedOut]);
          break;
        }
        case TrayIconStatus.Running: {
          this.setImage(trayIcons[TrayIconStatus.Running]);
          break;
        }
        case TrayIconStatus.Paused: {
          this.setImage(trayIcons[TrayIconStatus.Paused]);
          break;
        }
        case TrayIconStatus.LowGas: {
          this.setImage(trayIcons[TrayIconStatus.LowGas]);
          break;
        }
        default: {
          logger.electron('Unknown tray icon status:', status);
        }
      }
    });
  };
}

/**
 * Builds the context menu for the tray.
 * @param {() => Electron.BrowserWindow | null} activeWindowCallback - A callback to retrieve the active window.
 * @returns {Electron.Menu} The context menu for the tray.
 */
class PearlTrayContextMenu {
  constructor(activeWindowCallback) {
    return Electron.Menu.buildFromTemplate([
      {
        label: 'Show app',
        click: () => activeWindowCallback()?.show(),
      },
      {
        label: 'Hide app',
        click: () => activeWindowCallback()?.hide(),
      },
      {
        label: 'Quit',
        click: async () => {
          Electron.app.quit();
        },
      },
    ]);
  }
}

module.exports = { PearlTray };
