import Player from './Player'
export default class CtrlBase{
    owner:Player = null;
    constructor(owner:Player){
        this.owner = owner;
    }

    onUpdate(dt:number) : void{
    }
}