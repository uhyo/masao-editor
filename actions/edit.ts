//edit actions
import {
    Action,
    createAction,
} from '../scripts/reflux-util';

export {
    Action,
};

export type Mode = 'pen' | 'eraser' | 'hand' | 'spuit' | 'rect' | 'fill';

// ツールの使用中状態
export interface PenTool{
    type: 'pen';
}
export interface EraserTool{
    type: 'eraser';
}
export interface HandTool{
    type: 'hand';

    /**
     * マウスが押された場所x
     */
    mouse_sx: number;
    /**
     * マウスが押された場所y
     */
    mouse_sy: number;
    /**
     * マウスが押されたときのスクロール状態x
     */
    scroll_sx: number;
    /**
     * マウスが押されたときのスクロール状態y
     */
    scroll_sy: number;
}
export interface RectTool{
    type: 'rect';

    /**
     * 開始地点x
     */
    start_x: number;
    /**
     * 開始地点y
     */
    start_y: number;

    /**
     * 終了地点x
     */
    end_x: number;

    /**
     * 終了地点y
     */
    end_y: number;
}

export type ToolState = PenTool | EraserTool | HandTool | RectTool;

export interface MainCursor{
    type: 'main';
    x: number;
    y: number;
}
export interface ChipselectCursor{
    type: 'chipselect';
    id: number;
}

export type CursorState = MainCursor | ChipselectCursor;

export interface ChangeScreenAction {
    screen: 'map' | 'layer' | 'params' | 'project' | 'js';
}
export const changeScreen = createAction<ChangeScreenAction>();

export interface ChangeStageAction {
    stage: number;
}
export const changeStage = createAction<ChangeStageAction>();

export interface ChangeModeAction {
    mode: Mode;
}
export const changeMode = createAction<ChangeModeAction>();

export interface ChangeViewAction {
    width: number;
    height: number;
}
export const changeView = createAction<ChangeViewAction>();

export interface ChangePenAction {
    pen: number;
    mode?: boolean;
}
export const changePen = createAction<ChangePenAction>({
    preEmit: (obj: ChangePenAction)=>{
        if(obj==null){
            return {pen: 0};
        }else if(obj.pen==null){
            return {pen: 0};
        }
        return;
    },
});
export interface ChangePenLayerAction {
    pen: number;
    mode?: boolean;
}
export const changePenLayer = createAction<ChangePenLayerAction>({
    preEmit: (obj: ChangePenAction)=>{
        if(obj==null){
            return {
                pen: 0,
            };
        }else if(obj.pen==null){
            return {pen: 0};
        }
        return;
    },
});

export interface ChangeParamTypeAction {
    param_type: string;
}
export const changeParamType = createAction<ChangeParamTypeAction>();

export interface ChangeGridAction {
    grid: boolean;
}
export const changeGrid = createAction<ChangeGridAction>();

export interface ChangeRenderModeAction {
    render_map?: boolean;
    render_layer?: boolean;
}
export const changeRenderMode = createAction<ChangeRenderModeAction>();

export interface SetToolAction {
    tool: ToolState | null;
}
export const setTool = createAction<SetToolAction>();

export interface ScrollAction {
    x: number;
    y: number;
}
export const scroll = createAction<ScrollAction>();

export interface ChangeChipselectSizeAction {
    width: number;
    height: number;
}
export const changeChipselectSize = createAction<ChangeChipselectSizeAction>();

export interface ChangeChipselectScrollAction {
    y: number;
}
export const changeChipselectScroll = createAction<ChangeChipselectScrollAction>();

export interface SetCursorAction {
    cursor: CursorState | null;
}
export const setCursor = createAction<SetCursorAction>();

export interface JsConfirmAction {
    confirm: boolean;
}
export const jsConfirm = createAction<JsConfirmAction>();
