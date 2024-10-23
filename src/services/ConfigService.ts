import * as vscode from 'vscode';

export interface PairItem {
  symbol1: string
  symbol2: string
  label: string
}

export default class ConfigService {
  static getSymbols() {
    const pairs = this.getPairs();

    const symbols = new Set<string>();

    for (const pair of pairs) {
      symbols.add(pair.symbol1);
      symbols.add(pair.symbol2);
    }

    return [...symbols];
  }

  static getPairs(): PairItem[] {
    const pairs = vscode.workspace.getConfiguration('ratioMeter').get('pairs') as PairItem[];
    return pairs;
  }
}