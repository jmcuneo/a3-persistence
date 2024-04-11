//given 2 positions, calculate distance
function distXY(from,to){
    let dist=Math.sqrt(Math.pow(to[0]-from[0],2)+Math.pow(to[1]-from[1],2));
    return dist;
}
function dirXY(from,to){//given 2 positions, return x,y direction ray
    return [to[0]-from[0],to[1]-from[1]];
}
function wait(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
module.exports= { distXY,dirXY,wait};