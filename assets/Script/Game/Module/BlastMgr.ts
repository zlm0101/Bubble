import ModuleBase from './ModuleBase'
import TiledMapCtrl from './TiledMapCtrl'
import {Emitter} from '../../Emitter'
import ResMgr from './ResMgr'
const {ccclass, property} = cc._decorator;

@ccclass
export default class BlastMgr extends ModuleBase {
    onInit(){
        Emitter.getInstance().on('addBlast', this._addBlast, this);
    }
    _addBlast(arrBlastInfo:any []){
        let tiledMapCtrl = this.getModule('TiledMapCtrl') as TiledMapCtrl;
        let prefab = ResMgr.getInstance().getPrefab('blast');
        for(let info of arrBlastInfo){
            let blastN = cc.instantiate(prefab);
            blastN.parent = tiledMapCtrl.node;
            let pos = tiledMapCtrl.getPosByTile(info.tile);
            blastN.x = pos.x;
            blastN.y = pos.y;
            let blastJs = blastN.getComponent('Blast');
            blastJs.init(info.dir);
        }
    }
}
