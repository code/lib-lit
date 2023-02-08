import * as vscode from 'vscode';
import type * as wds from '@web/dev-server';
import type * as wdsCore from '@web/dev-server-core';
import * as path from 'path';
import {createRequire} from 'module';

export function activate(context: vscode.ExtensionContext) {
  const command = 'google.litespeed.startWebDevServer';

  const commandHandler = async () => {
    process.chdir('/Users/rictic/open/lit/packages/labs/hot-elements');

    const require = createRequire(
      '/Users/rictic/open/lit/packages/labs/hot-elements'
    );
    //     if (1 + 1 == 2) {
    //       vscode.window.showInformationMessage(`
    // Hello!

    // WDS path: ${require.resolve('@web/dev-server-core')}
    // `);
    //       return;
    //     }

    const wdsCoreLib: typeof wdsCore = require(require.resolve(
      '@web/dev-server-core'
    ));
    const wdsLib: typeof wds = require(require.resolve('@web/dev-server'));

    const disposables: vscode.Disposable[] = [];

    class MyPlugin implements wdsCore.Plugin {
      name: 'litespeed web dev server plugin';
      private count = 0;
      private config: wdsCore.DevServerCoreConfig;
      private inMemoryFiles = new Map<string, vscode.TextDocument>();

      serverStart({config, fileWatcher}: wdsCore.ServerStartParams) {
        this.config = config;
        console.log(path.resolve('./src/test/demo.ts'));
        setInterval(() => {
          fileWatcher.emit(
            'change',
            path.resolve(
              '/Users/rictic/open/lit/packages/labs/hot-elements/src/test/demo.ts'
            )
          );
        }, 1000);
        disposables.push(
          vscode.workspace.onDidChangeTextDocument((e) => {
            const {document} = e;
            if (document.fileName.endsWith('demo.ts')) {
              fileWatcher.emit('change', document.fileName);
              this.inMemoryFiles.set(document.fileName, document);
            }
          })
        );
      }

      transform(context: wdsCore.Context) {
        const path = wdsCoreLib.getRequestFilePath(
          context.url,
          this.config.rootDir
        );
        if (!path.endsWith('demo.ts')) {
          return;
        }
        const document = this.inMemoryFiles.get(path);
        if (!document) {
          return;
        }
        return document.getText();
      }
    }

    async function getConfig(): Promise<Partial<wds.DevServerConfig>> {
      return require(path.resolve(
        '/Users/rictic/open/lit/packages/labs/hot-elements/web-dev-server.config.cjs'
      ));
      return config;
    }

    //     if (1 + 1 == 2) {
    //       vscode.window.showInformationMessage(`
    // ${JSON.stringify(process.versions, null, 2)}
    // `);
    //       return;
    //     }

    const config = await getConfig();
    config.plugins ??= [];
    config.plugins.unshift(new MyPlugin());
    config.port = 54792;
    await wdsLib.startDevServer({
      config,
      readCliArgs: false,
      readFileConfig: false,
    });

    // console.log(`Hello ${name}!!!`);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(command, commandHandler)
  );
}
