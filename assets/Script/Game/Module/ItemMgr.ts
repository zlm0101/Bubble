import ModuleBase from './ModuleBase'
import TiledMapCtrl from './TiledMapCtrl'
import ConfigMgr from '../../Config/ConfigMgr'
// import {Emitter} from '../../Emitter'
import ResMgr from './ResMgr'
import Item from '../Entities/Item'
const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemMgr extends ModuleBase {
    private _arrItem:Item [] = [];
    onInit(){
    }

    addItem(id, tile){
        let tileMapCtrl = this.getModule('TiledMapCtrl') as TiledMapCtrl;
        let prefab = ResMgr.getInstance().getPrefab('item');
        let itemN = cc.instantiate(prefab);
        itemN.parent = tileMapCtrl.node;
        let itemJs = itemN.getComponent('Item');
        let config = ConfigMgr.getInstance().getConfig('ItemDt').getDataByID(id);
        itemJs.init(config, tile);
        this._arrItem.push(itemJs);
    }

    getItemByTile(tile:cc.Vec2){
        for(let item of this._arrItem){
            if(tile.equals(item.tile)){
                return item;
            }
        }
        return null;
    }

    removeItem(item){
        let index = this._arrItem.indexOf(item);
        this._arrItem.splice(index,1);
        item.node.destroy();
    }
}
