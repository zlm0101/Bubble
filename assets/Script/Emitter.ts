class Listener{
    name:string = '';
    cb:Function = null;
    target:any = null;
    isOnce:boolean = false;

    constructor(name:string, cb:Function, target:any, isOnce:boolean = false){
        this.name = name;
        this.cb = cb;
        this.target = target;
        this.isOnce = isOnce;
    }    
}

//@ccclass("Emitter")
export class Emitter{
    static _instance:Emitter = null;
    private mapListener:Map<string, Listener []> = null;
    constructor(){
        this.mapListener = new Map();
    }
    static getInstance(){
        if (!this._instance) {
            this._instance = new Emitter();
        }
        return this._instance;
    }

    on(name:string, cb:Function, target:any, isOnce:boolean = false){
        let arrListener:Listener[] = this.mapListener.get(name);
        if (!arrListener) {
            arrListener = [];
            this.mapListener.set(name, arrListener);
        }
        let listener = new Listener(name, cb, target, isOnce);
        arrListener.push(listener);
    }
    once(name:string, cb:Function, target:any){
        this.on(name, cb, target, true);
    }

    off(){
        if (0 === arguments.length) {
            this.mapListener.clear();
            return;
        }
        if (1 === arguments.length) {
            let arg0 = arguments[0];
            if (typeof arg0[0] !== 'string') {
                return;
            }
            let name = arguments[0];
            delete this.mapListener[name];
            return;          
        }
        
        if (2 === arguments.length) {
            let arg0 = arguments[0];
            let arg1 = arguments[1];
            let arrListener = this.mapListener.get(arg0);
            let len = arrListener.length;
            for(let i = len-1; i >=0; i--){
                let listener = arrListener[i];
                if (listener.name === arg0 && arg1 === listener.cb) {
                    arrListener.splice(i, 1);
                }
            }
            if (arrListener.length <= 0) {
                delete this.mapListener[arg0];
            }
            return;
        }

        if (3 === arguments.length) {
            let arg0 = arguments[0];
            let arg1 = arguments[1];
            let arg2 = arguments[2];
            let arrListener = this.mapListener.get(arg0);
            let len = arrListener.length;
            for(let i = len-1; i >=0; i--){
                let listener = arrListener[i];
                if (listener.name === arg0 && arg1 === listener.cb
                    && arg2 === listener.target) {
                    arrListener.splice(i, 1);
                }
            }
            if (arrListener.length <= 0) {
                delete this.mapListener[arg0];
            }
            return;
        }
    }
    emit(name:string, ...rest){
        let arrListener = this.mapListener.get(name);
        if (!arrListener) {
            return;
        }
        let len = arrListener.length;
        for(let i = len-1; i >= 0; i--){
            let listener = arrListener[i];
            let cb = listener.cb;            
            if (cb) {
                let target = listener.target;
                //let args = [].slice.call(arguments, 1)
                cb.apply(target, rest);
            }
            if (listener.isOnce) {
                arrListener.splice(i, 1);
            }
        }
        if ( arrListener.length <= 0 ) {
            delete this.mapListener[name];
        }
    }
}
