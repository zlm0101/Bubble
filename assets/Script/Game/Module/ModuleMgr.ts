import ModuleBase from '../Module/ModuleBase'
export default class ModuleMgr{
    private mapModule = null;
    private static instance = null;
    
    private constructor(){
        this.mapModule = new Map();
    }

    static getInstance =():ModuleMgr=>{
        if(!ModuleMgr.instance){
            ModuleMgr.instance = new ModuleMgr();
        }
        return ModuleMgr.instance;
    }
    
    onInit(){
        //console.log(this.mapModule.values());
        let arr = Array.from(this.mapModule.values());        
        for(let temp of arr){
            let myModule:ModuleBase = temp as ModuleBase;
            if (myModule &&myModule.onInit) {
                myModule.onInit();
            }
        }
    }
    onLateInit(){
        let arr = Array.from(this.mapModule.values());        
        for(let temp of arr){
            let myModule:ModuleBase = temp as ModuleBase;
            if (myModule &&myModule.onLateInit) {
                myModule.onLateInit();
            }
        }
    }
    onUpdate(dt){
        let arr = Array.from(this.mapModule.values());        
        for(let temp of arr){
            let myModule:ModuleBase = temp as ModuleBase;
            if (myModule &&myModule.onUpdate) {
                myModule.onUpdate(dt);
            }
        }
    }
    onLateUpdate(dt){
        let arr = Array.from(this.mapModule.values());        
        for(let temp of arr){
            let myModule:ModuleBase = temp as ModuleBase;
            if (myModule &&myModule.onLateUpdate) {
                myModule.onLateUpdate(dt);
            }
        }
    }
    onRelease(){
        let arr = Array.from(this.mapModule.values());        
        for(let temp of arr){
            let myModule:ModuleBase = temp as ModuleBase;
            if (myModule &&myModule.onRelease) {
                myModule.onRelease();
            }
        }
    }

    registerModule(key, module){
        if (!key || typeof(key) !== 'string' || !module) {
            return;
        }
        this.mapModule.set(key, module);
    }

    unregisterModule(key){
        if (!key || typeof(key) !== 'string') {
            return;
        }
        this.mapModule.delete(key);
    }

    getModule(key:string) : ModuleBase{
        if (!key || typeof(key) !== 'string') {
            return;
        }
        return this.mapModule.get(key);
    }

    onDestroy(){
        this.mapModule.clear();
    }

    sendMsg(moduleName, funcName){
        //arguments
        let params = [].slice.call(arguments, 2);
        let myModule = this.mapModule.get(moduleName);
        if (!myModule) {
            return;
        }
        let func = myModule[funcName];
        if (func) {
            //func.call(myModule, params);
            func.apply(myModule, params)
        }
    }
}

