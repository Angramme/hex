export class Player{
    constructor(id){
        this.id = id;
        this.solve = null;
    }
    async get_move(){
        return new Promise((res)=>{
            this.solve = ([x, y])=>{
                this.solve = null;
                res([x, y]);
            }
        })
    }
    on(type){
        if(type == "gridclick"){
            return ({detail: {cellX: x, cellY: y, peer_id: gid}})=>{
                if(this.id != gid) return;
                if(!this.solve) return;
                // resolve promise
                this.solve([x, y]);
            }
        }
    }
}