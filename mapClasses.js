class Tile{
    type;
    tags;
    xPos;
    yPos;
    walls=[0,0,0,0];//0 is closed, 1 is open,NSWE
    constructor(x,y,type, tag = [],walls=[0,0,0,0]) {
        this.type = type;
        this.xPos=x;
        this.yPos=y;
        this.tags = [...tag]; // create a new array for each instance
        this.walls=[...walls]
    }
    copy(){
        return new Tile(this.xPos,this.yPos,this.type,this.tags,this.walls);
    }
    matches(otherTile){
        return (this.xPos==otherTile.xPos && this.yPos==otherTile.yPos);
    }
}

class genParams{
    xSize;
    ySize;
    exitCount;
    constructor(x,y,eCnt){
        this.xSize=x;
        this.ySize=y;
        this.exitCount=eCnt;
    }
}


class GameMap{
    xSize;
    ySize;
    tiles;
    constructor(x,y){
        this.xSize=x;
        this.ySize=y;
    }
}
module.exports = {
    GameMap,
    Tile,
    genParams,
};