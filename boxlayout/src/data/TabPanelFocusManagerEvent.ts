/// <reference path="./EventDispatcher.ts" />
namespace boxlayout{
    export class TabPanelFocusManagerEvent extends boxlayout_event.Event{
        /**
         * 焦点改变
         * data:ITabPanel
         */
        public static FOCUSCHANGE:string='focuschange';
        constructor(type:string,data?:any){
            super(type,data);
        }
    }
}