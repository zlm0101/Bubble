import CtrlBase from './CtrlBase'
import Player from './Player'
import TiledMapCtrl from '../../Module/TiledMapCtrl'
import BubbleMgr from '../../Module/BubbleMgr'
import PlayerMgr from '../../Module/PlayerMgr'
import ModuleMgr from '../../Module/ModuleMgr'
import ItemMgr from '../../Module/ItemMgr'
export default class MoveCtrl extends CtrlBase{
    public velocity:cc.Vec2 = cc.v2(0,0);
    constructor(owner:Player){
        super(owner);
    }

    onUpdate(dt:number) : void{
        if (this.velocity.x ===0 &&this.velocity.y === 0) {
            return;
        }
        if (this._checkCollic()) {
            return;
        }
        this.owner.node.x += this.velocity.x*dt;
        this.owner.node.y += this.velocity.y*dt;
        this.owner.refreshZIndex();
    }

    _checkCollic(){
        let tiledMapCtrl = ModuleMgr.getInstance().getModule('TiledMapCtrl') as TiledMapCtrl;
        let playerTile = tiledMapCtrl.getTiledByPos(cc.v2(this.owner.node.x, this.owner.node.y));
        //获取碰撞点
        let colliPos = this.owner.getCollicPos();
        //获取碰撞点到格子
        let tile = tiledMapCtrl.getTiledByPos(colliPos);
        //判断是否越界
        if (tiledMapCtrl.checkOutOf(tile)) {
            return true;
        }
        let playerTileInfo = tiledMapCtrl.getTileInfo(playerTile);
        if (!playerTileInfo && !this.owner.node.active) {
            this.owner.node.active = true;
        }
        //获取碰撞格子的信息
        let info = tiledMapCtrl.getTileInfo(tile);
        if (!info) {
            //检测跟泡泡到碰撞
            //玩家中心所在的格子没有泡泡，碰撞点所在到格子有泡泡时，不能走动(防止玩家放完泡泡卡住)
            // if (!this._collicBubble()) {
            //     return false;
            // }
            //是否吃到道具
            this._collicItem();
            return this._collicBubble();
        }
        //
        if (info.colli) {
            //如果是箱子
            if (info.push) {
                let dir = this.velocity.normalize();
                if (this._canPushBox(tile, dir)) {
                    tiledMapCtrl.pushBox(tile, dir);
                }
            }
            return true;
        }
        if (info.visible) {  
            let playerTileInfo = tiledMapCtrl.getTileInfo(playerTile);
            if(playerTileInfo&&playerTileInfo.visible && this.owner.node.active){
                //隐藏玩家
                this.owner.node.active = false;
            }
            
            return false;
        }
        
        return true;
    }

    _collicBubble(){
        //玩家中心所在的格子没有泡泡，碰撞点所在到格子有泡泡时，不能走动(防止玩家放完泡泡卡住)
        let tiledMapCtrl = ModuleMgr.getInstance().getModule('TiledMapCtrl') as TiledMapCtrl;
        let bubbleMgr = ModuleMgr.getInstance().getModule('BubbleMgr') as BubbleMgr;
        let playerTile = tiledMapCtrl.getTiledByPos(cc.v2(this.owner.node.x, this.owner.node.y));
        let collicPos = this.owner.getCollicPos();
        let collicTile = tiledMapCtrl.getTiledByPos(collicPos);
        let colliBubble = bubbleMgr.getBubbleByTile(collicTile);
        let playerBubble = bubbleMgr.getBubbleByTile(playerTile);
        if (colliBubble && !playerBubble) {
            return true;
        }
        //碰撞点到泡泡和玩家所在点到泡泡不能是同一个
        if(colliBubble && playerBubble&& (colliBubble != playerBubble)){
            return true;
        }
        return false;
        //return bubbleMgr.getBubbleByTile(collicTile) && (!bubbleMgr.getBubbleByTile(playerTile));
    }

    _canPushBox(tile, dir){
        let tiledMapCtrl = ModuleMgr.getInstance().getModule('TiledMapCtrl') as TiledMapCtrl;
        let bubbleMgr = ModuleMgr.getInstance().getModule('BubbleMgr') as BubbleMgr;
        let playerMgr = ModuleMgr.getInstance().getModule('PlayerMgr') as PlayerMgr;
        //取到下一个格子
        let nextTile = cc.v2(tile.x + dir.x, tile.y - dir.y);
        //越界
        if (tiledMapCtrl.checkOutOf(nextTile)) {
            return false;
        }
        //有障碍物
        let info = tiledMapCtrl.getTileInfo(nextTile);
        if (info&&info.colli) {
            return false;
        }
        //有泡泡
        if (bubbleMgr.getBubbleByTile(nextTile)) {
            return false;
        }
        //有人

        if (playerMgr.getPlayerByTile(nextTile)) {
            return false;
        }
        return true;
    }

    _collicItem(){
        let tiledMapCtrl = ModuleMgr.getInstance().getModule('TiledMapCtrl') as TiledMapCtrl;
        let itemMgr = ModuleMgr.getInstance().getModule('ItemMgr') as ItemMgr;
        let playerTile = tiledMapCtrl.getTiledByPos(cc.v2(this.owner.node.x, this.owner.node.y));
        let item = itemMgr.getItemByTile(playerTile);
        if (item) {
            this.owner.addItem(item);
            itemMgr.removeItem(item);
        }
    }
}