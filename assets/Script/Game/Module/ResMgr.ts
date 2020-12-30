

export default class ResMgr{
    private allCache:any = {};
    private static instance = null;
    private constructor(){
        this.allCache = {
            spriteFrame:new Map(),
            prefab:new Map(),
            atlas:new Map(),
            tiledMap:new Map()
        }
    }
    static getInstance = ():ResMgr=>{
        if(!ResMgr.instance){
            ResMgr.instance = new ResMgr();
        }
        return ResMgr.instance;
    }
    addData(type:string, key:string, data:any){
        if (!type || typeof(type) !== 'string'|| !key || typeof(key) !== 'string' || !data) {
            return;
        }
        let cache = this.allCache[type];
        cache.set(key,data);
    }

    getData(type:string, key:string){
        if (!type || typeof(type) !== 'string'|| !key || typeof(key) !== 'string') {
            return null;
        }
        let cache = this.allCache[type];
        return cache.get(key);
    }
    //先找单图，如果没有找到去atlas中找
    getSpriteFrame(key:string, atlasName?:string){
        let spriteFrame = this.getData('spriteFrame',key);
        if (spriteFrame) {
            return spriteFrame;
        }
        if(atlasName && typeof(atlasName) === 'string'){
            let atlas = this.allCache.atlas.get(atlasName);
            if(!atlas){
                return null;
            }
            spriteFrame = atlas.getSpriteFrame(key);
            if (spriteFrame) {
                return spriteFrame;
            }
        }
        let arrAtlas = Array.from(this.allCache.atlas.values());
        for(let value of arrAtlas){
            let atlas = value as cc.SpriteAtlas;
            spriteFrame = atlas.getSpriteFrame(key);
            if (spriteFrame) {
                return spriteFrame;
            }          
        }
        return null;
    }
    getPrefab(key:string){
        return this.getData('prefab',key);
    }
    getTiledMap(key:string){
        return this.getData('tiledMap', key);
    }
}

