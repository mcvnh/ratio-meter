import * as vscode from 'vscode';
import ConfigService, { PairItem } from './services/ConfigService';
import BinanceService from './services/BinanceService';
import StatusBarService from './services/StatusbarService';

let statusBarService = new StatusBarService();

export function activate(context: vscode.ExtensionContext) {
  reload();
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(reload));
}

async function reload() {
  await reloadStatusBarItems();
  setInterval(reloadStatusBarItems, ConfigService.refreshInterval());
  console.log('refresh interval set to', ConfigService.refreshInterval());
}

export function deactivate() {}

async function reloadStatusBarItems() {
  console.log('[RATIO-METER]: reloading status bar items');
  const tokenToPrice: { [key: string]: number } = {};
  const symbols = ConfigService.getSymbols();
  const pairs = ConfigService.getPairs();

  for (const symbol of symbols) {
    tokenToPrice[symbol] = await BinanceService.getPrice(symbol);
  }

  for (const pair of pairs) {
    const token1 = pair.symbol1;
    const token2 = pair.symbol2;

    let message = pair.format;

    const ratio = round(tokenToPrice[token1] / tokenToPrice[token2]);

    message = message.replace('[SYM1]', '' + round(tokenToPrice[token1]));
    message = message.replace('[SYM2]', '' + round(tokenToPrice[token2]));
    message = message.replace('[RATIO]', '' + ratio);

    const key = getPairName(pair);
    statusBarService.set(key, message);
    statusBarService.show(key);
  }
}

function round(value: number, decimals: number = 4) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function getPairName(pair: PairItem) {
  return pair.label;
}