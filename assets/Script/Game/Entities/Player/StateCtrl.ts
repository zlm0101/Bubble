import CtrlBase from './CtrlBase'
import Player from './Player'
import ResMgr from '../../Module/ResMgr'
export default class MoveCtrl extends CtrlBase{
    public velocity:cc.Vec2 = cc.v2(0,0);
    public state:string = '';
    private animCom:cc.Animation = null;
    constructor(owner:Player){
        super(owner);
        let modelN = this.owner.node.getChildByName('model');
        this.animCom = modelN.getComponent(cc.Animation);
    }

    changeState(state){
        if (this.state === state) {
            return;
        }
        let preState = this.state;
        this.state = state;

        //停止动画
        this.animCom.stop();
        let roleIndex = (this.owner.roleConfig.id - 2000);
        if (this.state === 'idle') {
            let spriteCom = this.animCom.getComponent(cc.Sprite);
            preState = ((preState === 'runLeft')?'runRight':preState);
            let spriteFrameName = preState + roleIndex + '_0';
            spriteCom.spriteFrame = ResMgr.getInstance().getSpriteFrame(spriteFrameName);
            return;
        }
        //翻转
        let scaleX = 1;
        //处理动画名字
        let animName = state;
        if(animName ==='runLeft'){
            animName = 'runRight';
            scaleX = -1;
        }
        animName = animName + roleIndex;
        this.animCom.play(animName);
        this.owner.node.scaleX = scaleX;
    }
}