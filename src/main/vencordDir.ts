/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2025 Vendicated and Vesktop contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { app } from "electron";
import { join } from "path";

import { State } from "./settings";

// [MEPHEDRONE]: the client is always our own build, shipped inside the app (or MEPH_CLIENT_DIR / the dev checkout).
// Nothing is ever downloaded at runtime.
function clientRoot() {
    if (process.env.MEPH_CLIENT_DIR) return process.env.MEPH_CLIENT_DIR;
    if (State.store.equicordDir) return State.store.equicordDir;
    if (app.isPackaged) return join(process.resourcesPath, "mephedrone-client");
    return join(__dirname, "../../../dist"); // dev: app/dist/js → ~/mephedrone_client/dist
}

export const VENCORD_DIR = join(clientRoot(), "equibop");
