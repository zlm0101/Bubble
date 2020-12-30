import {ConfigDt} from './ConfigDt'
export default class ConfigMgr{
    private mapDt:Map<string, ConfigDt> = new Map();
    private static instance:ConfigMgr = null;
    private constructor(){
    }
    static getInstance = ():ConfigMgr=>{
        if(!ConfigMgr.instance){
            ConfigMgr.instance = new ConfigMgr();
        }
        return ConfigMgr.instance;
    }
    //添加数据
    addConfig(key, config){
        if (!key  || !config || typeof(key) !== 'string') {
            return;
        }
        this.mapDt.set(key, config);
    }
    //删除数据
    removeConfig(key){
        if (!key || typeof(key) !== 'string') {
            return;
        }
        delete this.mapDt[key];
    }
    //获取数据
    getConfig(key) : ConfigDt{
        if (!key || typeof(key) !== 'string') {
            return  null;
        }
        return this.mapDt.get(key);
    }
}
