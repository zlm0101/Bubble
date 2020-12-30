export default class AnyDtMgr{
    private _mapDt : Map<string, any> = new Map();
    constructor(){

    }
    static _instance : AnyDtMgr = null;
    static getInstance(){
        if (!this._instance) {
            this._instance = new AnyDtMgr();
        }
        return this._instance;
    }
    //添加数据
    addData(key, config){
        if (!key  || !config || typeof(key) !== 'string') {
            return;
        }
        this._mapDt.set(key, config);
    }
    //删除数据
    removeData(key){
        if (!key || typeof(key) !== 'string') {
            return;
        }
        delete this._mapDt[key];
    }
    //获取数据
    getData(key) : any{
        if (!key || typeof(key) !== 'string') {
            return  null;
        }
        return this._mapDt.get(key);
    }
}