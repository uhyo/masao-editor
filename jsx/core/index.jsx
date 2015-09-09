var React=require('react'),
    Reflux=require('reflux');
var extend=require('extend');


var paramActions=require('../../actions/params');

var mapStore=require('../../stores/map'),
    paramStore=require('../../stores/params'),
    editStore=require('../../stores/edit');

var MapEdit=require('./map-edit.jsx'),
    ChipSelect=require('./chip-select.jsx'),
    EditMode=require('./edit-mode.jsx'),
    MiniMap=require('./mini-map.jsx'),
    ScreenSelect=require('./screen-select.jsx'),
    ParamEdit=require('./param-edit.jsx'),
    Button=require('./util/button.jsx');


var MasaoEditorCore = React.createClass({
    displayName: "MasaoEditorCore",
    mixins:[Reflux.connect(mapStore,"map"), Reflux.connect(paramStore,"params"), Reflux.connect(editStore,"edit")],
    propTypes:{
        filename_pattern: React.PropTypes.string.isRequired,
        filename_chips: React.PropTypes.string.isRequired,

        defaultParams: React.PropTypes.object,

        text_save: React.PropTypes.string,
        text_testplay: React.PropTypes.string,
        requestSave: React.PropTypes.func,
        requestTestplay: React.PropTypes.func
    },
    getDefaultProps(){
        return {
            text_save: "保存",
            text_testplay: "テストプレイ"
        };
    },
    componentWillMount(){
        if(this.props.defaultParams){
            //default
            paramActions.changeParams(this.props.defaultParams);
        }
    },
    componentWillReceiveProps(newProps){
        if(this.props.defaultParams!==newProps.defaultParams && newProps.defaultParams != null){
            paramActions.changeParams(newProps.defaultParams);
        }
    },
    render(){
        var map=this.state.map, params=this.state.params, edit=this.state.edit;

        var screen=null;
        if(edit.screen==="map"){
            screen=<MapScreen pattern={this.props.filename_pattern} chips={this.props.filename_chips} map={map} params={params} edit={edit}/>;
        }else if(edit.screen==="params"){
            screen=<ParamScreen params={params} edit={edit}/>;
        }
        var button_save=null;
        if(this.props.requestSave!=null){
            button_save=<div>
                <Button label={this.props.text_save} onClick={this.handleSaveClick}/>
            </div>;
        }
        var button_testplay=null;
        if(this.props.requestTestplay!=null){
            button_testplay=<div>
                <Button label={this.props.text_testplay} onClick={this.handleTestplayClick}/>
            </div>;
        }
        return <div className="me-core">
            <div className="me-core-info">
                <div>
                    <ScreenSelect edit={edit}/>
                </div>
                {button_save}
                {button_testplay}
            </div>
            {screen}
        </div>;
    },
    handleSaveClick(){
        //paramにmapの内容を突っ込む
        let mp=mapToParam(this.state.map);
        let allParams = extend({},this.state.params, mp);
        this.props.requestSave(allParams);
    },
    handleTestplayClick(){
        let mp=mapToParam(this.state.map);
        let allParams = extend({},this.state.params, mp);
        this.props.requestTestplay(allParams);
    },
});
//exports stores
MasaoEditorCore.mapStore = mapStore;
MasaoEditorCore.paramStore = paramStore;
MasaoEditorCore.editStore = editStore;
module.exports = MasaoEditorCore;

//各screen
var MapScreen = React.createClass({
    displayName: "MapScreen",
    propTypes: {
        pattern: React.PropTypes.string.isRequired,
        chips: React.PropTypes.string.isRequired,

        edit: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired,
        map: React.PropTypes.array.isRequired
    },
    render(){
        var map=this.props.map, params=this.props.params, edit=this.props.edit, pattern=this.props.pattern, chips=this.props.chips;
        return <div>
            <div className="me-core-map-info">
                <EditMode edit={edit} map={map}/>
            </div>
            <MiniMap params={params} edit={edit} map={map}/>
            <div className="me-core-main">
                <ChipSelect pattern={pattern} chips={chips} params={params} edit={edit}/>
                <MapEdit pattern={pattern} chips={chips} map={map} params={params} edit={edit}/>
            </div>
        </div>;
    }
});

var ParamScreen = React.createClass({
    displayName: "ParamScreen",
    propTypes: {
        edit: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired
    },
    render(){
        var params=this.props.params, edit=this.props.edit;
        return <div>
            <ParamEdit params={params} edit={edit} />
        </div>;
    }
});


//map to param
function mapToParam(map){
    let result={};
    for(let stage=0;stage<4;stage++){
        let stagechar="";
        if(stage===1){
            stagechar="-s";
        }else if(stage===2){
            stagechar="-t";
        }else if(stage===3){
            stagechar="-f";
        }
        for(let y=0;y < 30; y++){
            let j=map[stage][y].join("");
            result[`map0-${y}${stagechar}`]=j.slice(0,60);
            result[`map1-${y}${stagechar}`]=j.slice(60,120);
            result[`map2-${y}${stagechar}`]=j.slice(120,180);
        }
    }
    return result;
}
