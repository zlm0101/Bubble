import ResMgr from '../Module/ResMgr'
import ModuleMgr from '../Module/ModuleMgr';
import TiledMapCtrl from '../Module/TiledMapCtrl';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {
    public tile:cc.Vec2 = cc.v2(0,0);
    public config:any = null;
    init(config, tile){
        this.tile.x = tile.x;
        this.tile.y = tile.y;
        this.config = config;
        //设置坐标
        let tiledMapCtrl = ModuleMgr.getInstance().getModule('TiledMapCtrl') as TiledMapCtrl;
        let pos = tiledMapCtrl.getPosByTile(tile);
        this.node.x = pos.x;
        this.node.y = pos.y;
        //设置图片
        let SpriteCom = this.getComponent(cc.Sprite);
        SpriteCom.spriteFrame = ResMgr.getInstance().getSpriteFrame(config.img);
    }
}
