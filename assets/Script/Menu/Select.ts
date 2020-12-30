const {ccclass, property} = cc._decorator;
import ConfigMgr from '../Config/ConfigMgr'
import AnyDtMgr from '../AnyDtMgr'
@ccclass
export default class Select extends cc.Component {

    @property([cc.Node])
    arrRole:cc.Node[] = [];
    @property([cc.Node])
    arrArrow:cc.Node[] = [];
    @property(cc.PageView)
    mapPageView:cc.PageView = null;
    private _arrIndex:number[] = [0,3];
    private _arrkeyObj = [];
    private _arrSelect:boolean[] = [false,false];
    // onLoad () {}

    start () {
        this._addKeyBoardEvent();
        this._arrkeyObj =[
            {
                '65':'left',
                '68':'right',
                '74':'select'
            },
            {
                '37':'left',
                '39':'right',
                '97':'select'
            },
        ]
    }
    _addKeyBoardEvent(){ 
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
    }
    _removeKeyBoardEvent(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
    }
    onKeyDown(event){
        //判断向左还是向右，如果向左，索引要-1，如果向右，索引要加1，  选中是为了后续判断是否要让角色能够继续选择。
        let obj = {
            'left':-1,
            'right':1,
            'select':0
        }
        for(let i = 0;i <  this._arrkeyObj.length;i++){
            let state = this._arrkeyObj[i][event.keyCode];//"left","right","select"
            if(!state){
                continue;
            }
            if(this._arrSelect[i]){
               continue; 
            }
            if(0 === obj[state]){
                this._arrSelect[i] = true;
            }
            this._arrIndex[i]+=obj[state];
           
            this._arrIndex[i] = this._arrIndex[i] < 0?3:this._arrIndex[i];
            this._arrIndex[i] = this._arrIndex[i] > 3?0:this._arrIndex[i];
            //处理两个角色选择不一样。
            if(this._arrIndex[i] === this._arrIndex[this._arrIndex.length-1-i]){
                this._arrIndex[i]+=obj[state];
            }
            this.arrArrow[i].x = this.arrRole[this._arrIndex[i]].x;
        }
        // switch(event.keyCode){
        //     case cc.macro.KEY.a:  
        //         this._index1--;              
        //         if(this._index1 <0){
        //             this._index1 = 3;
        //         }
        //         break;
        //     case cc.macro.KEY.d:     
        //         this._index1++;              
        //         if(this._index1 >3){
        //             this._index1 = 0;
        //         }      
        //         break;
        //     case cc.macro.KEY.left:   
        //         this._index2--;              
        //         if(this._index2 <0){
        //             this._index2 = 3;
        //         }              
        //         break;
        //     case cc.macro.KEY.right:
        //         this._index2++;              
        //         if(this._index2 >3){
        //             this._index2 = 0;
        //         }                 
        //         break;        
        // }

        //处理两个箭头的位置
        // this.arrArrow[0].x = this.arrRole[this._index1].x;
        // this.arrArrow[1].x = this.arrRole[this._index2].x;

        for(let value of this._arrSelect){//这个数组是两个玩家的选择，如果两个都为真，循环不会return，直接切换场景，如果当中有一个为假，一定会return 按键这个函数执行结束，切换场景逻辑不会执行。
            if(!value){
                return;;
            }            
        }
        //获取当前页面索引
        let index:number = this.mapPageView.getCurrentPageIndex()+1;
        //存储两个玩家索引
        AnyDtMgr.getInstance().addData('playerIndex',this._arrIndex);
        AnyDtMgr.getInstance().addData('mapIndex',index);
        cc.director.loadScene('Game');
    }
    onKeyUp(event:Event){

    }
    onDestroy(){
        this._removeKeyBoardEvent();
    }
    // update (dt) {}
}
