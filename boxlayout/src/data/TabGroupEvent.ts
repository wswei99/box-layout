/// <reference path="./EventDispatcher.ts" />
namespace boxlayout{
    export class TabGroupEvent extends Event{
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