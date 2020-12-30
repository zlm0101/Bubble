import ModuleBase from './ModuleBase'
import TiledMapCtrl from './TiledMapCtrl'
import Player from '../Entities/Player/Player'
import ResMgr from './ResMgr'
import AnyDtMgr from '../../AnyDtMgr'
import ConfigMgr from '../../Config/ConfigMgr'
const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerMgr extends ModuleBase {
    private _arrPlayer : Player [] = [];
    
    //private _arrKeyConfig : any []= null;

    onInit(){
        this._initPlayer();
        this._addKeyEvent();
    }

    getPlayerByTile(tile:cc.Vec2){
        let tiledMapCtrl = <TiledMapCtrl>this.getModule('TiledMapCtrl');
        for(let player of this._arrPlayer){
            let playerTile = tiledMapCtrl.getTiledByPos(cc.v2(player.node.x, player.node.y));
            if (tile.equals(playerTile)) {
                return player;
            }
        }
        return null;
    }

    _initPlayer(){
        let tiledMapCtrl = <TiledMapCtrl>this.getModule('TiledMapCtrl');
        let arrIndex = AnyDtMgr.getInstance().getData('playerIndex');//playerIndex
        let arrBirthIndex = [0,1,2,3,4,5,6,7];

        //创建两个角色
        for(let i = 0; i < arrIndex.length; i++){
            let name = 'role' + (arrIndex[i] + 1);
            let prefab = ResMgr.getInstance().getPrefab(name);
            let playerN = cc.instantiate(prefab);
            playerN.parent = tiledMapCtrl.node;
            let playerJs = playerN.getComponent('Player');

            //配置表数据获取
            let keyConfig = ConfigMgr.getInstance().getConfig('KeyCode').getDataByID(1001 + i);
            let roleConfig = ConfigMgr.getInstance().getConfig('RoleDt').getDataByID(2001 + i);
            playerJs.init(keyConfig, roleConfig);
            this._arrPlayer.push(playerJs);
            //获取出生点坐标
            let birthIndex = Math.floor(Math.random() * arrBirthIndex.length);
            let birthPos = tiledMapCtrl.getBirthPos(arrBirthIndex[birthIndex]);
            playerN.x = birthPos.x;
            playerN.y = birthPos.y;
            //保证出生点不一样
            arrBirthIndex.splice(birthIndex, 1);
        }
    }

    _addKeyEvent(){
        //this._arrKeyConfig = ConfigMgr.getInstance().getConfig('KeyCode');
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }

    onRelease(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }

    onUpdate(dt){
        for(let player of this._arrPlayer){
            if (player&&player.onUpdate) {
                player.onUpdate(dt);
            }
        }
    }

    _onKeyDown(event){
        for(let playerJs of this._arrPlayer){
            playerJs.onKeyDown(event.keyCode);
        }
    }

    _onKeyUp(event){
        for(let playerJs of this._arrPlayer){
            playerJs.onKeyUp(event.keyCode);
        }
    }
}
