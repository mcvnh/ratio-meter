import * as vscode from 'vscode';

export default class StatusBarService {
  _items: Map<string, vscode.StatusBarItem>;

  constructor() {
    this._items = new Map();
  }

  set(key: string, text: string, priority = 100) {
    let item = this._items.get(key);

    if (!item) {
      item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, priority);
    }

    item.text = text;
    this._items.set(key, item);
  }

  update(key: string, text: string) {
    const item = this._items.get(key);
    if (item) {
      item.text = text;
    }
  }

  show(key: string) {
    const item = this._items.get(key);
    if (item) {
      item.show();
    }
  }

  hide(key: string) {
    const item = this._items.get(key);
    if (item) {
      item.hide();
    }
  }

  showAll() {
    this._items.forEach((item) => item.show());
  }

  hideAll() {
    this._items.forEach((item) => item.hide());
  }
}