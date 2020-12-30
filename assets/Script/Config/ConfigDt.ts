export class ConfigDt{
    private arrData =[];
    constructor(arrData){
        this.arrData = arrData;
    }
    getDataByID(id){
        for(let data of this.arrData){
            if (data.id === id) {
                return data;
            }
        }
        return null;
    }
    getDataByIndex(index){
        if (!index || typeof(index) !== 'number' || index < 0 || index > this.arrData.length - 1) {
            return null;
        }
        return this.arrData[index];
    }
    getSize(){
        return this.arrData.length;
    }
}
//module.exports = ConfigDt;