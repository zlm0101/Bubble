const {ccclass, property} = cc._decorator;
import CtrlBase from './CtrlBase';
import MoveCtrl from './MoveCtrl';
import StateCtrl from './StateCtrl';
import ModuleMgr from '../../Module/ModuleMgr'
import TiledMapCtrl from '../../Module/TiledMapCtrl'
import {Emitter} from '../../../Emitter'

@ccclass
export default class Player extends cc.Component {
    private keyConfig:any = null;
    public roleConfig:any = null;
    private curKeyCode:any = null;
    private moveCtrl:MoveCtrl = null;
    private stateCtrl:StateCtrl = null;
    private speed:number = 0;
    private power:number = 0;
    private bubbleNum : number = 0;
    private allColliPos:any = null;
    //private _mapCtrl : Map<string, CtrlBase> = new Map();
    init(keyConfig, roleConfig){
        this.keyConfig = keyConfig;
        this.curKeyCode = this.keyConfig.codes;
        this.roleConfig = roleConfig;
        this.speed = roleConfig.speed;
        this.power = this.roleConfig.power;
        this.bubbleNum = this.roleConfig.bubbleNum;
        this._initCtrls();
        this._initColliPos();
        this.refreshZIndex();
    }

    onKeyDown(keyCode){
        let strComand = this.curKeyCode[keyCode];
        if (!strComand) {
            return;
        }
        if(strComand !== 'addBubble'){
            let objTmp = {runUp:cc.v2(0,1), runDown:cc.v2(0,-1), runLeft:cc.v2(-1,0), runRight:cc.v2(1,0)};
            let dir = objTmp[strComand] as cc.Vec2;
            this.moveCtrl.velocity = dir.mulSelf(this.speed);
            //切换状态
            this.stateCtrl.changeState(strComand);
        }
        else
        {
            let tiledMapCtrl = ModuleMgr.getInstance().getModule('TiledMapCtrl') as TiledMapCtrl;
            let tile = tiledMapCtrl.getTiledByPos(cc.v2(this.node.x, this.node.y));
            Emitter.getInstance().emit('addBubble', tile, this.power, this.bubbleNum, this.roleConfig.id);
        }
    }
    onKeyUp(keyCode){
        let strComand = this.curKeyCode[keyCode];
        if (!strComand) {
            return;
        }
        if(strComand !== 'addBubble'){
            this.stopMove();
        }    
    }

    stopMove(){
        this.moveCtrl.velocity = cc.v2(0,0);
        this.stateCtrl.changeState('idle');
    }

    getCollicPos(){
        let pos = cc.v2(this.node.x, this.node.y);
        let temp = {runUp:'collicUp', runDown:'collicDown', runLeft:'collicLeft', runRight:'collicRight'};
        let name = temp[this.stateCtrl.state];
        let offsetPos = this.allColliPos[name];
        let colliPos = pos.add(offsetPos);
        return colliPos;
    }

    _initColliPos(){
        this.allColliPos = {};
        //let pos = cc.v2(this.node.x, this.node.y);
        let arrName = ['collicUp', 'collicDown', 'collicLeft','collicRight'];
        for(let name of arrName){
            let childN = this.node.getChildByName(name);
            //let colliPos = cc.v2(this.node.x + childN.x, this.node.y + childN.y);
            this.allColliPos[name] = cc.v2(childN.x, childN.y);
        }
    }
    _initCtrls(){
        this.moveCtrl = new MoveCtrl(this);
        this.stateCtrl = new StateCtrl(this);
    }

    reverseDir(){
        this.curKeyCode = this.keyConfig.reverseCodes;
        this.unschedule(this.resumeDir);
        this.scheduleOnce(this.resumeDir, 2);
    }
    resumeDir(){
        this.curKeyCode = this.keyConfig.codes;
    }

    refreshZIndex(){
        let tiledMapCtrl = ModuleMgr.getInstance().getModule('TiledMapCtrl') as TiledMapCtrl;
        let tile = tiledMapCtrl.getTiledByPos(cc.v2(this.node.x, this.node.y));
        this.node.zIndex = 2*(tile.y - 1) + 1;
    }
    
    addItem(item){
        if(item.config.type === 'addAttr'){
            let attrKey = item.config.attrKey;
            let maxAttrName = attrKey + 'Max';
            let maxValue = this.roleConfig[maxAttrName];
            
            if (item.config.value) {
                this[attrKey] += item.config.value;
                if(this[attrKey] > maxValue){
                    this[attrKey] = maxValue;
                }
            }
            else{
                this[attrKey] = maxValue;
            }
        }
        else if(item.config.type === 'reverseDir'){
            this.reverseDir();
        }
    }

    onUpdate (dt) {
        this.moveCtrl.onUpdate(dt);
        this.stateCtrl.onUpdate(dt);
        // this._mapCtrl.forEach((state, key) => {
        //     state.onUpdate(dt);
        // })
    }
}
