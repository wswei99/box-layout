/// <reference path="./EventDispatcher.ts" />
namespace boxlayout{
    export class TabGroupEvent extends boxlayout_event.Event{
        /**
         * data:TabGroup
         */
        public static SELECTCHANGE:string='selectchange';
        /**
         * data:ITabPanel
         */
        public static PANEL_DRAG:string='paneldrag';
        constructor(type:string,data?:any){
            super(type,data);
        }
    }
}