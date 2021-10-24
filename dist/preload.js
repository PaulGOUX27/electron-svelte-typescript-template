"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_2 = require("electron");
const electron_updater_1 = require("electron-updater");
electron_updater_1.autoUpdater.checkForUpdates();
electron_updater_1.autoUpdater.on("update-available", () => {
    let notification = new electron_2.Notification({
        title: "Svelte App",
        body: "Updates are available. Click to download.",
        silent: true,
    });
    notification.show();
    notification.on("click", () => {
        electron_updater_1.autoUpdater.downloadUpdate();
    });
});
electron_updater_1.autoUpdater.on("update-downloaded", () => {
    let notification = new electron_2.Notification({
        title: "Svelte App",
        body: "The updates are ready. Click to quit and install.",
        silent: true,
    });
    notification.show();
    notification.on("click", () => {
        electron_updater_1.autoUpdater.quitAndInstall();
    });
});
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => {
        // whitelist channels
        let validChannels = ["toMain", "requestSystemInfo"];
        if (validChannels.includes(channel)) {
            electron_1.ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["fromMain", "getSystemInfo"];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            // @ts-ignore
            electron_1.ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});
