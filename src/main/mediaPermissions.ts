/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { session, systemPreferences } from "electron";

import { isDiscordUrl } from "./utils/isDiscordUrl";

// Electron grants every permission by default. Only allow them for Discord, not for other sites
// (e.g. opened via openLinksWithElectron) or our own views
// [MEPHEDRONE] security: real location is never handed out (the client answers with the spoofed one), and
// anything that touches your devices or data is only for Discord itself, not for embeds inside it (YouTube etc.).
// Embeds still get harmless ones like fullscreen.
const NEVER = new Set(["geolocation"]);
const DISCORD_ONLY = new Set(["media", "display-capture", "clipboard-read", "clipboard-sanitized-write", "notifications", "midi",
    "midiSysex", "hid", "serial", "usb", "idle-detection", "speaker-selection", "window-management", "openExternal",
    "keyboardLock", "storage-access", "top-level-storage-access", "persistent-storage", "background-sync"]);

function allowed(permission: string, topUrl: string, requester: string) {
    if (NEVER.has(permission) || !isDiscordUrl(topUrl)) return false;
    return !DISCORD_ONLY.has(permission) || isDiscordUrl(requester);
}

export function registerMediaPermissionsHandler() {
    // webContents is null for some checks (e.g. notifications and cross-origin subframes), so go by origin
    session.defaultSession.setPermissionCheckHandler((_webContents, permission, requestingOrigin, details) =>
        allowed(permission, details.embeddingOrigin ?? requestingOrigin, requestingOrigin)
    );

    session.defaultSession.setPermissionRequestHandler(async (webContents, permission, callback, details) => {
        // the top level must be Discord; device/data permissions must also be requested by Discord's own frame
        if (!allowed(permission, webContents.getURL(), details.requestingUrl ?? "")) return callback(false);

        let granted = true;

        if (process.platform === "darwin" && "mediaTypes" in details) {
            if (details.mediaTypes?.includes("audio")) {
                granted &&= await systemPreferences.askForMediaAccess("microphone");
            }
            if (details.mediaTypes?.includes("video")) {
                granted &&= await systemPreferences.askForMediaAccess("camera");
            }
        }

        callback(granted);
    });
}
