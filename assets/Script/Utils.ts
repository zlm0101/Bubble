export default class Utils{
    /**
	Returns a random integer between min (inclusive) and max (exclusive).
	@param min min
	@param max max 
	*/
    static randomRangeInt(min:number, max:number){
        return Math.floor(Math.random()* (max - min) + min);
    }
}