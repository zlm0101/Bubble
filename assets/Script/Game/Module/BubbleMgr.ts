import ModuleBase from './ModuleBase'
import {Emitter} from '../../Emitter'
import ResMgr from './ResMgr'
import TiledMapCtrl from './TiledMapCtrl'
import Bubble from '../Entities/Bubble'
const {ccclass, property} = cc._decorator;

@ccclass
export default class BubbleMgr extends ModuleBase {
    private _arrBubble: Bubble [] = [];
    private _arrBlastInfo:any [] = [];
    private _arrCanBomb:any [] = [];
    onInit(){
        Emitter.getInstance().on('addBubble', this.addBubble, this);
        Emitter.getInstance().on('toBomb', this.toBomb, this);
    }

    addBubble(tile, power, bubbleNum, ownerID){
        //检测是否能放泡
        //已经放到泡数量是否最大
        if(this.getBubbleByOwnerCount(ownerID) >= bubbleNum){
            return;
        }
        //该格子上是否有泡泡
        if (this.getBubbleByTile(tile)) {
            return;
        }
        let tiledMapCtrl = this.getModule('TiledMapCtrl') as TiledMapCtrl;
        let prefab = ResMgr.getInstance().getPrefab('bubble');
        let bubbleN = cc.instantiate(prefab);
        bubbleN.parent = tiledMapCtrl.node;
        //设置坐标
        let pos = tiledMapCtrl.getPosByTile(tile);
        bubbleN.x = pos.x;
        bubbleN.y = pos.y;
        //
        let bubbleJs = bubbleN.getComponent('Bubble');
        bubbleJs.init(tile, power, ownerID);
        this._arrBubble.push(bubbleJs);
    }

    toBomb(bubble : Bubble){
        this._arrBlastInfo.length = 0;
        this._arrCanBomb.length = 0;
        this.bomb(bubble);
        Emitter.getInstance().emit('addBlast', this._arrBlastInfo);
        let tiledMapCtrl = this.getModule('TiledMapCtrl') as TiledMapCtrl;
        tiledMapCtrl.removeByTiles(this._arrCanBomb);
        //console.log(this._arrBlastInfo);
    }

    bomb(bubble){
        this._arrBlastInfo.push({
            tile:bubble.tile,
            dir:'center'
        });
        //
        let power = bubble.power;
        let tile = bubble.tile.clone();
        let index = this._arrBubble.indexOf(bubble);
        this._arrBubble.splice(index,1);
        bubble.node.destroy();
        let tiledMapCtrl = this.getModule('TiledMapCtrl') as TiledMapCtrl;
        let arrDir = [cc.v2(0,-1), cc.v2(0,1), cc.v2(-1,0), cc.v2(1,0)];
        let dirName = ['up', 'down','left','right']
        for(let i = 0; i <arrDir.length; i++){
            //每个方向
            let dir = arrDir[i];
            //power威力的格子
            for(let j = 0; j < power; j++){
                let nextTile = tile.add(dir.mul(j + 1));
                //是否越界
                if (tiledMapCtrl.checkOutOf(nextTile)) {
                    break;
                }
                let tileInfo = tiledMapCtrl.getTileInfo(nextTile);
                if (tileInfo) {
                    if (tileInfo.blast) {
                        this._arrBlastInfo.push({
                            tile:nextTile,
                            dir:dirName[i]
                        });
                        this._arrCanBomb.push(nextTile);
                    }
                    break;
                }
                //判断是否炸到其他炸弹
                let otherBubble = this.getBubbleByTile(nextTile);
                if (otherBubble) {
                    //引爆otherBubble
                    this.bomb(otherBubble);
                }
                //没炸到障碍物
                //保证不重复
                if (!this._getBlastInfoByTile(nextTile)) {
                    this._arrBlastInfo.push({
                        tile:nextTile,
                        dir:dirName[i]
                    })
                }
                
            }
            
        }
    }

    getBubbleByOwnerCount(ownerID) : number{
        let count = 0;
        for(let bubbleJs of this._arrBubble){
            if (bubbleJs.ownerID == ownerID) {
                count++;
            }
        }
        return count;
    }

    getBubbleByTile(tile:cc.Vec2){
        for(let bubbleJs of this._arrBubble){
            if (tile.equals(bubbleJs.tile)) {
                return bubbleJs;
            }
        }
        return null;
    }

    _getBlastInfoByTile(tile:cc.Vec2){
        for(let info of this._arrBlastInfo){
            if (tile.equals(info.tile)) {
                return info;
            }
        }
        return null;
    }
}
