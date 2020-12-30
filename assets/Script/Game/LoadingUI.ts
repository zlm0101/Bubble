const {ccclass, property} = cc._decorator;
import ResMgr from './Module/ResMgr'
import ConfigMgr from '../Config/ConfigMgr'
import {ConfigDt} from '../Config/ConfigDt'

@ccclass
export default class LoadingUI extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //let self:LoadingUI = this;
        cc.resources.loadDir('./',this.onProgress.bind(this),//(finishCount:number, totalCount:number, item:cc.AssetManager.RequestItem)=>void{
            //self.progressBar.progress = finishCount/totalCount;
        //},
        (err, assets)=>{
            for(let i = 0; i < assets.length; i++){
                let asset = assets[i];
                if (asset instanceof cc.Prefab) {
                    ResMgr.getInstance().addData('prefab', asset.name, asset);
                }
                else if (asset instanceof cc.JsonAsset) {
                    let configDt = new ConfigDt(asset.json);
                    ConfigMgr.getInstance().addConfig(asset.name, configDt);
                }
                else if (asset instanceof cc.SpriteAtlas) {
                    ResMgr.getInstance().addData('atlas', asset.name, asset);
                }
                else if (asset instanceof cc.SpriteFrame) {
                    ResMgr.getInstance().addData('spriteFrame', asset.name, asset);
                }
                else if (asset instanceof cc.TiledMapAsset) {
                    ResMgr.getInstance().addData('tiledMap', asset.name, asset);
                }
            }
            let prefabGame = ResMgr.getInstance().getPrefab('Game');
            let gameN = cc.instantiate(prefabGame);
            gameN.parent = cc.director.getScene();
            this.node.destroy();
        });
    }

    public onProgress(finishCount:number, totalCount:number, item:cc.AssetManager.RequestItem){
        this.progressBar.progress = finishCount/totalCount;;
    }

    // update (dt) {}
}
