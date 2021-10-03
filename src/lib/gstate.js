import {creategridstate} from "$lib/grid.js";
import { Player } from "./player";

export class GState{
    constructor(size){
        this.grid = creategridstate(size);
        this.players = [new Player(), new Player()];
        this.current_player_i = 0;
    }

    sync_json(data){
        this.grid = data.grid;
        this.current_player_i = data.current_player_i;
    }
    to_json(){
        return {
            grid: this.grid,
            current_player_i: this.current_player_i,
        }
    }

    next_player(){
        this.current_player_i = (this.current_player_i+1)%this.players.length;
    }

    get current_player(){
        return this.players[this.current_player_i];
    }

    move([x, y], p){
        try{
            if(this.grid[y][x] == 0){
                this.grid[y][x] = p;
                return true;
            }else return false;
        }catch(err){
            return false;
        }
    }

    winner(){
        return 0;
    }
}