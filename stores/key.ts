// key-command binding
import { Store } from '../scripts/reflux-util';
import { Command } from '../logics/command';

const defaultBinding: Record<string, Command> = {
  // モード変更
  q: 'mode:pen',
  w: 'mode:eraser',
  e: 'mode:hand',
  r: 'mode:spuit',
  t: 'mode:rect',
  y: 'mode:fill',
  u: 'mode:select',

  // スクロール
  'Alt:arrowup': 'scroll:up',
  'Alt:arrowright': 'scroll:right',
  'Alt:arrowdown': 'scroll:down',
  'Alt:arrowleft': 'scroll:left',
  'Alt:k': 'scroll:up',
  'Alt:l': 'scroll:right',
  'Alt:j': 'scroll:down',
  'Alt:h': 'scroll:left',

  // 進む-戻る
  'Ctrl:z': 'back',
  'Ctrl:Shift:z': 'forward',
  'Ctrl:r': 'forward',

  // カーソル
  arrowup: 'cursor:up',
  arrowright: 'cursor:right',
  arrowdown: 'cursor:down',
  arrowleft: 'cursor:left',
  k: 'cursor:up',
  l: 'cursor:right',
  j: 'cursor:down',
  h: 'cursor:left',
  // 'tab': 'cursor:jump',
  escape: 'cursor:vanish',
  z: 'cursor:button',

  // 削除
  backspace: 'delete',
  delete: 'delete',

  // Files
  'Ctrl:m': 'file:new',
  'Ctrl:o': 'external:open',
  'Ctrl:s': 'external:save',
  'Ctrl:j': 'external:json',
  'Ctrl:h': 'external:html',
  'Ctrl:p': 'external:testplay',
};

export interface KeyState {
  binding: Record<string, Command>;
}

export class KeyStore extends Store<KeyState> {
  constructor() {
    super();
    this.listenables = [];

    this.state = {
      binding: defaultBinding,
    };
  }
}

export default new KeyStore();
