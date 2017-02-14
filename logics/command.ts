// command
import editStore from '../stores/edit';
import * as editActions from '../actions/edit';
import * as editLogics from '../logics/edit';
import * as historyLogics from './history';

// 定義されたコマンド
export type Command =
    // mode change
    'mode:pen' | 'mode:eraser' | 'mode:hand' | 'mode:spuit' | 'mode:rect' | 'mode:fill' |
    // scroll command
    'scroll:up' | 'scroll:right' | 'scroll:down' | 'scroll:left' |
    // history command
    'back' | 'forward';

export const commandNames: Record<Command, string> = {
    'mode:pen': 'ペンツール',
    'mode:eraser': 'イレイサーツール',
    'mode:hand': 'ハンドツール',
    'mode:spuit': 'スポイトツール',
    'mode:rect': '四角形ツール',
    'mode:fill': '塗りつぶしツール',

    'scroll:up': '上にスクロール',
    'scroll:right': '右にスクロール',
    'scroll:down': '下にスクロール',
    'scroll:left': '左にスクロール',

    'back': '戻る',
    'forward': 'やり直す',
};

export function run(command: Command): void{
    switch(command){
        case 'mode:pen': {
            editActions.changeMode({
                mode: 'pen',
            });
            break;
        }
        case 'mode:eraser': {
            editActions.changeMode({
                mode: 'eraser',
            });
            break;
        }
        case 'mode:hand': {
            editActions.changeMode({
                mode: 'hand',
            });
            break;
        }
        case 'mode:spuit': {
            editActions.changeMode({
                mode: 'spuit',
            });
            break;
        }
        case 'mode:rect': {
            editActions.changeMode({
                mode: 'rect',
            });
            break;
        }
        case 'mode:fill': {
            editActions.changeMode({
                mode: 'fill',
            });
            break;
        }
        case 'scroll:up': {
            editLogics.scrollBy({
                x: 0,
                y: -1,
            });
            break;
        }
        case 'scroll:right': {
            editLogics.scrollBy({
                x: 1,
                y: 0,
            });
            break;
        }
        case 'scroll:down': {
            editLogics.scrollBy({
                x: 0,
                y: 1,
            });
            break;
        }
        case 'scroll:left': {
            editLogics.scrollBy({
                x: -1,
                y: 0,
            });
            break;
        }
        case 'back': {
            historyLogics.back(editStore.state.stage);
            break;
        }
        case 'forward': {
            historyLogics.forward(editStore.state.stage);
            break;
        }
    }
}
