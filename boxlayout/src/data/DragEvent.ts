/// <reference path="./EventDispatcher.ts" />
namespace boxlayout{
    export class DragEvent extends boxlayout_event.Event{
        public static STARTDRAG:string='dragevent_startdrag';
        constructor(type:string,data?:any){
            super(type,data);
        }
    }
}