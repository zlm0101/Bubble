
const {ccclass, property} = cc._decorator;
import ModuleMgr from './ModuleMgr'
@ccclass
export default class ModuleBase extends cc.Component {

    onInit(){
    }
    onLateInit(){
    }
    onUpdate(dt){
    }
    onLateUpdate(dt){
    }
    onRelease(){
    }


    sendMsg(moduleName, funcName, ...rest){
        ModuleMgr.getInstance().sendMsg.apply(ModuleMgr.getInstance(), arguments);
        //cc.moduleMgr.sendMsg(moduleName, funcName, rest);
    }

    getModule(key:string){
        return ModuleMgr.getInstance().getModule(key);
    }
}

