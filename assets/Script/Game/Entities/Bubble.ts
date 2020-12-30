import {Emitter} from '../../Emitter'
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bubble extends cc.Component {
    public power:number = 0;
    public ownerID:number = 0;
    public tile:cc.Vec2 = null;
    init(tile, power, ownerID){
        this.tile = tile.clone();
        this.power = power;
        this.ownerID = ownerID;
        this.scheduleOnce(this.bomb, 2);
    }

    bomb(){
        Emitter.getInstance().emit('toBomb', this);
    }
}
