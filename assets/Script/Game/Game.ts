
const {ccclass, property} = cc._decorator;
import ModuleMgr from './Module/ModuleMgr'


@ccclass
export default class Game extends cc.Component {  
    onLoad () {
        this._registerModule();
        // 地图.onInit();
        // 地图.onInit();
        // 地图.onInit();
        // 地图.onInit();
        // 地图.onInit();
        // 地图.onInit();
        // 地图.onInit();
        
        ModuleMgr.getInstance().onInit();
    }

    start () {
         ModuleMgr.getInstance().onLateInit();
    }

    update (dt) {
         ModuleMgr.getInstance().onUpdate(dt);
    }

    lateUpdate(dt){
         ModuleMgr.getInstance().onLateUpdate(dt);
    }

    onDestroy(){
         ModuleMgr.getInstance().onRelease();
    }

    private _registerModule(){
        let arrNameN = ['TiledMap', 'PlayerMgr', 'BubbleMgr', 'BlastMgr', 'ItemMgr'];
        let arrNameCom = ['TiledMapCtrl', 'PlayerMgr', 'BubbleMgr', 'BlastMgr', 'ItemMgr'];
        for(let i = 0; i < arrNameN.length; i++){
            let node = this.node.getChildByName(arrNameN[i]);
            let comp = node.getComponent(arrNameCom[i]);
             ModuleMgr.getInstance().registerModule(arrNameCom[i], comp);
        }  
    }
}
