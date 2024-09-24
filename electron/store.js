const Store = require('electron-store');

const { logger } = require('./logger');

/**
 * The schema for the Electron store.
 * Uses JSON Schema format to define the types and defaults for the store.
 * @type {Store.Schema<{[key: string]: unknown}>}
 */
const schema = {
  isInitialFunded: { type: ['boolean', 'null'], default: null },
  firstStakingRewardAchieved: { type: 'boolean', default: false },
  firstRewardNotificationShown: { type: 'boolean', default: false },
  agentEvictionAlertShown: { type: 'boolean', default: false },
};

/**
 * Migrations for the Electron store.
 * Each migration function should take the store as an argument and update it in place.
 * Migrations are run in order, starting from the oldest version and updating to the latest.
 * @note The migration function should be named after the version it
 * migrates to, e.g. '0.1.0-rc143' for version 0.1.0-rc143.
 * @note All versions prior will be migrated to the latest version.
 * @type {Record<string, (store: Store<{[key: string]: unknown}>) => void>} */
const migrations = {
  '0.1.0-rc143': (store) => {
    // Environment name and current staking program are no longer stored
    if (store.has('environmentName')) {
      logger.electron('Removing environmentName from store');
      store.delete('environmentName');
    }
    // Remove the current staking program, was never implemented
    if (store.has('currentStakingProgram')) {
      logger.electron('Removing currentStakingProgram from store');
      store.delete('currentStakingProgram');
    }
  },
};

/**
 * Sets up the IPC communication and initializes the Electron store with default values and schema.
 * @param {Electron.IpcMain} ipcMain - The IPC channel for communication.
 * @param {Electron.BrowserWindow} mainWindow - The main Electron browser window.
 * @returns {Promise<void>} - A promise that resolves once the store is set up.
 */
const setupStore = async (ipcMain, mainWindow) => {
  const store = new Store({
    schema,
    migrations,
    beforeEachMigration: (_, context) => {
      // Log the migration version before it runs
      logger.electron(
        `Migrating store from ${context.fromVersion} to ${context.toVersion}`,
      );
    },
  });

  store.onDidAnyChange((data) => {
    if (mainWindow?.webContents)
      mainWindow.webContents.send('store-changed', data);
  });

  // exposed to electron browser window
  ipcMain.handle('store', () => store.store);
  ipcMain.handle('store-get', (_, key) => store.get(key));
  ipcMain.handle('store-set', (_, key, value) => store.set(key, value));
  ipcMain.handle('store-delete', (_, key) => store.delete(key));
  ipcMain.handle('store-clear', (_) => store.clear());
};

module.exports = { setupStore };
