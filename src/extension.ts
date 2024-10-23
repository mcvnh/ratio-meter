import * as vscode from 'vscode';
import ConfigService, { PairItem } from './services/ConfigService';
import BinanceService from './services/BinanceService';

let statusBarPairItems: Map<string, vscode.StatusBarItem>;

export async function activate(context: vscode.ExtensionContext) {

	initStatusBarItems();
	await reloadStatusBarItems();

	setInterval(reloadStatusBarItems, 1000 * 60);

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(reloadStatusBarItems));
}

export function deactivate() {}

function initStatusBarItems() {
	statusBarPairItems = new Map();

	const symbols = ConfigService.getSymbols();
	const pairs = ConfigService.getPairs();

	symbols.forEach((symbol) => {
		const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
		statusBarPairItems.set(symbol, item);
	});

	pairs.forEach((pair) => {
		const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
		statusBarPairItems.set(getPairName(pair), item);
	});
}

async function reloadStatusBarItems() {
	console.log('[RATIO-METER]: reloading status bar items');
	const tokenToPrice: { [key: string]: number } = {};
	const symbols = ConfigService.getSymbols();
	const pairs = ConfigService.getPairs();

	for (const symbol of symbols) {
		tokenToPrice[symbol] = await BinanceService.getPrice(symbol);

		if (statusBarPairItems.has(symbol)) {
			statusBarPairItems.get(symbol)!.text = `${symbol.replace('USDT', '')}: ${round(tokenToPrice[symbol])}`;
			statusBarPairItems.get(symbol)!.show();
		}
	}

	for (const pair of pairs) {
		const token1 = pair.symbol1;
		const token2 = pair.symbol2;

		const name = getPairName(pair);
		if (statusBarPairItems.has(name)) {
			statusBarPairItems.get(name)!.text = `${name}: ${round(tokenToPrice[token1] / tokenToPrice[token2])}`;
			statusBarPairItems.get(name)!.show();
		}
	}
}

function round(value: number, decimals: number = 4) {
	return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function getPairName(pair: PairItem) {
	return pair.label;
}