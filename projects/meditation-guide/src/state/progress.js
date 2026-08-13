export const STORAGE_KEY="guanxin-progress-v1";
export const initialProgress={version:1,completed:[],totalSeconds:0,notes:{},preferences:{duration:180,eyesOpen:false,reducedMotion:false}};
export function loadProgress(storage){
  try { const value=JSON.parse(storage.getItem(STORAGE_KEY)); return value?.version===1?{...initialProgress,...value}:initialProgress; }
  catch { return initialProgress; }
}
export function saveProgress(storage,state){ try{storage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;} }
export function completeSession(state,{day,duration,note}){
  const first=!state.completed.includes(day);
  return {...state,completed:first?[...state.completed,day]:state.completed,totalSeconds:state.totalSeconds+(first?duration:0),notes:note?{...state.notes,[day]:note}:state.notes};
}
export function recommendNext(state){return Math.min(7,Math.max(1,...state.completed,0)+1);}
