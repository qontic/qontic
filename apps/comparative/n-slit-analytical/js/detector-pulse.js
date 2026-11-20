// A short geometric cue that follows the user's sensor color.
export const DETECTOR_PULSE_SECONDS = .225;
export function binPulseRect(x,y,width,height,strength){
 const amount=Math.max(0,Math.min(1,strength)),extra=Math.max(2,width*.35)*amount,grow=Math.max(1,height*.2)*amount;
 return {x:x,y:y-grow/2,width:width+extra,height:height+grow};
}
export function drawBinPulse(context,{x,y,width,height,color,strength}){
 if(strength<=0)return;
 const r=binPulseRect(x,y,width,height,strength);
 context.save();context.fillStyle=color;context.fillRect(r.x,r.y,r.width,r.height);
 // Neutral contrasting outlines keep the size cue legible for any band color.
 context.lineWidth=2;context.strokeStyle='#13232d';context.strokeRect(r.x,r.y,r.width,r.height);
 context.lineWidth=.75;context.strokeStyle='#f1f5f7';context.strokeRect(r.x,r.y,r.width,r.height);context.restore();
}
