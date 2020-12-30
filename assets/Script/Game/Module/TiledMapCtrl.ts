const {ccclass, property} = cc._decorator;
import ModuleBase from './ModuleBase'
import ConfigMgr from '../../Config/ConfigMgr'
import AnyDtMgr from '../../AnyDtMgr'
import ResMgr from './ResMgr'
import Utils from '../../Utils'
@ccclass
export default class TiledMapCtrl extends ModuleBase {
    private _arrLayer:cc.TiledLayer [] = [];
    //动态加载，地哥去处理。
    // @property([cc.TiledMapAsset])
    // arrMapAsset:cc.TiledMapAsset[] = [];
    //少量的通过公布属性方式可以，但是麻烦，一旦修改，要过来处理。最好通过cc.resources.load.... (最好) 老司机请看。
    //地图组件变量。
    private _tiledMap:cc.TiledMap = null;
    //存放出生点
    private _arrBirthPos:cc.Vec2 [] = [];
    //存放道具信息
    private _arrItemInfo:any [] = [];
    onInit(){
        //地图初始化的时候，获取地图组件
        this._tiledMap = this.node.getComponent(cc.TiledMap);
        //获取地图索引
        let index:number = AnyDtMgr.getInstance().getData('mapIndex')-1;
        let tileName = 'tileMap_' + (index + 1);
        //修改地图组件的资源。
        this._tiledMap.tmxAsset = ResMgr.getInstance().getTiledMap(tileName);//this.arrMapAsset[index];//获取资源数组的第几个？ 菜单关联。 页面索引。
        this._initBirthPos();
        this._initLayer();
        this._initItemInfo();
    }

    checkOutOf(tile){
        let mapSize = this._tiledMap.getMapSize();
        if (tile.x < 0 || tile.x > mapSize.width - 1 || tile.y  < 1 || tile.y > mapSize.height - 1) {
            return true;
        }
        return false;
    }

    getTiledByPos(pos:cc.Vec2):cc.Vec2{
        let mapSize = this._tiledMap.getMapSize();
        let tileSize = this._tiledMap.getTileSize();
        let mapHeight = mapSize.height*tileSize.height;
        let x = Math.floor(pos.x / tileSize.width);
        let y = Math.floor((mapHeight - pos.y) / tileSize.height);
        return cc.v2(x, y);
    }

    getTileInfo(tile){
        //判断该格子是否有障碍物，并返回障碍物到信息
        let layer = this._arrLayer[tile.y-1];
        let gid = layer.getTileGIDAt(tile);
        let props = this._tiledMap.getPropertiesForGID(gid);
        if (!props) {
            return null;
        }
        let ret = {
            blast:props['blast'],
            colli:props['colli'],
            push:props['push'],
            visible:props['visible']
        }
        return ret;
    }

    getPosByTile(tile:cc.Vec2){
        let mapSize = this._tiledMap.getMapSize();
        let tileSize = this._tiledMap.getTileSize();
        let mapHeight = mapSize.height*tileSize.height;
        let x = tileSize.width*tile.x + tileSize.width/2;
        let y = mapHeight - tileSize.height*tile.y - tileSize.height/2;
        return cc.v2(x, y);
    }

    getBirthPos(index:number):cc.Vec2{
        if(index < 0 || index > this._arrBirthPos.length - 1){
            return null;
        }
        return this._arrBirthPos[index];
    }

    removeByTiles(arrTile:cc.Vec2 []){
        for(let tile of arrTile){
            let layer = this._arrLayer[tile.y - 1];
            layer.setTileGIDAt(0, tile.x, tile.y);
            //判断该tile是否有道具信息
            for(let i = 0; i < this._arrItemInfo.length;){
                let info = this._arrItemInfo[i];
                if(tile.equals(info.tile)){
                    this.sendMsg('ItemMgr', 'addItem', info.id, info.tile);
                    this._arrItemInfo.splice(i, 1);
                }
                else{
                     i++;
                }
            }
        }
    }
    //推箱子
    pushBox(tile:cc.Vec2, dir:cc.Vec2){
        let tileSize = this._tiledMap.getTileSize();
        let layer = this._arrLayer[tile.y - 1];
        let gid = layer.getTileGIDAt(tile);
        let tileTile = layer.getTiledTileAt(tile.x, tile.y, true);
        let newTile = cc.v2(tile.x + dir.x, tile.y -  dir.y);
        cc.tween(tileTile.node)
        .by(0.5,{position:cc.v2(dir.x * tileSize.width, dir.y * tileSize.height)})
        .call(()=>{
            layer.setTileGIDAt(0, tile.x, tile.y);
            //目的地所在层的gid要设置为箱子到GID
            let nextLayer = this._arrLayer[tile.y - dir.y - 1];
            nextLayer.setTileGIDAt(gid, newTile.x, newTile.y);
        })
        .start();
        this._refreshItemInfo(tile, newTile);
        //tileTile
    }
    //刷新道具信息
    _refreshItemInfo(tile:cc.Vec2, newTile:cc.Vec2){
        for(let info of this._arrItemInfo){
            if(tile.equals(info.tile)){
                info.tile.x = newTile.x;
                info.tile.y = newTile.y;
            }
        }
    }

    _initBirthPos(){
        let objLayer = this._tiledMap.getObjectGroup('initPos');
        let arrObj = objLayer.getObjects();
        for(let obj of arrObj){
            let pos = cc.v2(0,0);
            pos.x = obj['x'];
            pos.y = obj['y'];
            this._arrBirthPos.push(pos);
        }
    }

    _initLayer(){
        for(let i = 1; i < 14; i++){
            let layerName = 'obstacle'  + i;
            let layer = this._tiledMap.getLayer(layerName);
            this._arrLayer.push(layer);
            layer.node.zIndex = 2*(i - 1);
        }
    }

    _initItemInfo(){
        //获取地图上的所有可以炸的格子
        let arrBlastTile = [];
        let mapSize = this._tiledMap.getMapSize();
        for(let i = 0; i < this._arrLayer.length; i++){
            //x轴
            for(let j = 0; j < mapSize.width; j++){
                let tile = cc.v2(j, i+1);
                let info = this.getTileInfo(tile);
                if(info&&info.blast){
                    arrBlastTile.push(tile);
                }
            }
        }

        let index:number = AnyDtMgr.getInstance().getData('mapIndex')-1;
        let levelID = 4001+index;
        let levelDt = ConfigMgr.getInstance().getConfig('LevelDt').getDataByID(levelID);
        for(let key in levelDt.item){
            let count = levelDt.item[key];
            let itemID = parseInt(key);
            for(let i = 0; i < count; i++){
                //创建count个道具信息
                let blastIndex = Utils.randomRangeInt(0, arrBlastTile.length);
                let tile = arrBlastTile[blastIndex];
                let itemInfo = {
                    id:itemID,
                    tile:tile
                }
                this._arrItemInfo.push(itemInfo);
                //保证一个格子最多只有一个道具
                arrBlastTile.splice(blastIndex,1);
            }
        }
        //再创建10个随机id的item
        let arrKey = Object.keys(levelDt.item);
        for(let i = 0; i < 10; i++){
            //随机一个id
            let keyIndex = Utils.randomRangeInt(0, arrKey.length);
            let itemID = parseInt(arrKey[keyIndex]);
            //cc.randomRangeInt();
            let blastIndex = Utils.randomRangeInt(0, arrBlastTile.length);
            let tile = arrBlastTile[blastIndex];
            let itemInfo = {
                    id:itemID,
                    tile:tile
            }
            this._arrItemInfo.push(itemInfo);
            //保证一个格子最多只有一个道具
            arrBlastTile.splice(blastIndex,1);
        }
    }
}
