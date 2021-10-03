export const hexsize = 1;
export const hexagon = Array.from({length: 6}, 
    (_, i)=>`${hexsize*Math.cos(i/6*6.2868)} ${hexsize*Math.sin(i/6*6.2868)}`)
    .join(", ");

export function getcolor(type){
    const cols = ["gray", "#ee3333", "#7777ff"];
    if(type >= cols.length) return 'pink';
    return cols[type];
}

export function tocoords([x, y], [w, h]){
    return [x*2*hexsize*Math.cos(3.1415/6), y*2*hexsize + (w-x)*hexsize]
}

export function creategridstate(size, val=0){
    return Array.from({length:size}, 
        (_, i)=>Array.from({length: size}, (_, j)=>val));
}