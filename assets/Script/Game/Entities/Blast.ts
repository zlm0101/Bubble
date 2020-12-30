import ResMgr from '.././Module/ResMgr'
const {ccclass, property} = cc._decorator;

@ccclass
export default class Blast extends cc.Component {
    init(type){
        if (type === 'center') {
            let animCom = this.getComponent(cc.Animation);
            animCom.play();
        }
        else{
            let nameObj = {up:'blastU_0_0', down:'blastD_0_0', left:'blastL_0_0', right:'blastR_0_0'};
            let spriteCom = this.getComponent(cc.Sprite);
            spriteCom.spriteFrame = ResMgr.getInstance().getSpriteFrame(nameObj[type]);
        }
        this.scheduleOnce(()=>{
            this.node.destroy();
        },0.5)
    }
}
