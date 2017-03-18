import * as React from 'react';

import * as util from '../../scripts/util';
import * as chip from '../../scripts/chip';

import MousePad, {
    MousePadEvent,
} from './util/mousepad';

import * as editActions from '../../actions/edit';
import { EditState } from '../../stores/edit';
import { ParamsState } from '../../stores/params';
import {
    MapState,
    StageData,
} from '../../stores/map';

import * as editLogics from '../../logics/edit';

//色の対応
const colors: Record<string, string> = {
    masao: "#ff0000",
    block: "#800000",
    enemy: "#00ee00",
    athletic: "#aadddd",
    bg: "#eeeeee",
    water: "#0000ff",
    item: "#ffff00"
};

export interface IPropMiniMap{
    params: ParamsState;
    edit: EditState;
    stage: StageData;
}
interface IStateMiniMap{
    mouse_down: boolean;
}
export default class MiniMap extends React.Component<IPropMiniMap, IStateMiniMap>{
    private drawing: boolean;
    constructor(props: IPropMiniMap){
        super(props);

        this.state = {
            mouse_down: false,
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }
    componentDidMount(){
        this.drawing=false;
        this.draw();
    }
    componentDidUpdate(){
        this.draw();
    }
    draw(){
        if(this.drawing===true){
            return;
        }
        this.drawing=true;
        requestAnimationFrame(()=>{
            const canvas=this.refs['canvas'] as HTMLCanvasElement;
            const ctx = canvas.getContext('2d');
            if (ctx == null){
                return;
            }
            const {
                params,
                edit,
                stage,
            } = this.props;
            const mapdata = stage.map;
            //bg
            const bgc = util.cssColor(util.stageBackColor(params, edit));
            ctx.fillStyle=bgc;
            ctx.fillRect(0,0,canvas.width,canvas.height);

            //draw
            for(let y=0; y < stage.size.y; y++){
                const a = mapdata[y];
                for(let x=0; x < stage.size.x; x++){
                    const c = a[x];
                    // const t = chip.chipTable[c];
                    const t = chip.chipFor(params, c);
                    if(t){
                        const {
                            category,
                        } = t;
                        const cl = category && colors[category];
                        if(cl){
                            ctx.fillStyle = cl;
                            ctx.fillRect(x*2, y*2, 2, 2);
                        }
                    }
                }
            }
            //グリッド
            if(edit.grid===true){
                ctx.strokeStyle="rgba(0,0,0,.15)";
                ctx.lineWidth=1;
                for(let y=edit.view_height;y < stage.size.y; y+=edit.view_height){
                    ctx.beginPath();
                    ctx.moveTo(0,y*2);
                    ctx.lineTo(canvas.width,y*2);
                    ctx.stroke();
                }
                for(let x=edit.view_width;x < stage.size.x; x+=edit.view_width){
                    ctx.beginPath();
                    ctx.moveTo(x*2,0);
                    ctx.lineTo(x*2,canvas.height);
                    ctx.stroke();
                }
            }
            //スクロールビュー
            const wkc = util.cssColor(util.complementColor(util.stageBackColor(params, edit)));
            ctx.strokeStyle=wkc;
            ctx.lineWidth=1;
            ctx.strokeRect(edit.scroll_x*2+0.5, edit.scroll_y*2+0.5, edit.view_width*2-1, edit.view_height*2-1);
            this.drawing=false;
        });
    }
    render(){
        const {
            props: {
                stage: {
                    size,
                },
            },
            state: {
                mouse_down,
            },
            handleMouseMove,
            handleMouseDown,
        } = this;
        const mousemove = mouse_down ? handleMouseMove : void 0;
        return <div>
            <MousePad
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
                >
                <canvas ref="canvas" width={size.x*2} height={size.y*2}/>
            </MousePad>
        </div>;
    }
    handleMouseDown(ev: MousePadEvent){
        const {
            target,
            elementX,
            elementY,
            button,
            preventDefault,
        } = ev;
        const can = this.refs['canvas'] as HTMLCanvasElement;

        if (target !== can || (button !== 0 && button != null)){
            preventDefault();
            return;
        }
        this.setState({
            mouse_down: true,
        });
        this.handleMouseMove(ev);
    }
    handleMouseMove({elementX, elementY}: MousePadEvent){
        const {
            edit,
            stage,
        } = this.props;

        //そこを中心に
        const sx = Math.floor((elementX-edit.view_width)/2);
        const sy=Math.floor((elementY-edit.view_height)/2);

        editLogics.scroll({
            x: sx,
            y: sy,
        });
    }
    handleMouseUp(){
        this.setState({
            mouse_down: false,
        });
    }
}
