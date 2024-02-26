/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {expose} from './lib/webview/comlink-endpoint-to-vscode.js';
import type {IgnitionUi} from './lib/webview/ignition-ui.js';
import './lib/webview/ignition-ui.js';

// acquireVsCodeApi is automatically injected when running in a VS Code webview
const vscode = acquireVsCodeApi();

/**
 * This represents the API that's accessible from the ignition extension in
 * vscode.
 */
class ApiToExtension {
  readonly #ui = document.querySelector('ignition-ui') as IgnitionUi;

  /**
   * Sets the URL of the story module to edit. Returns once the story UI has
   * been created and is ready to be interacted with.
   */
  setStoryUrl(storyUrl: string | undefined) {
    this.#ui.storyUrl = storyUrl;
  }
}

export type ApiExposedToExtension = ApiToExtension;
expose(vscode, new ApiToExtension());