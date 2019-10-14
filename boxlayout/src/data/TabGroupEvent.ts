/// <reference path="./EventDispatcher.ts" />
namespace boxlayout{
    export class TabGroupEvent extends boxlayout_event.Event{
        /**
         * data:TabGroup
         */
        public static SELECTCHANGE:string='selectchange';
        /**
         * data:{panel:ITabPanel,group:TabGroup}
         */
        public static PANEL_REMOVING:string="panelremoving";
        /**
         * data:{panel:ITabPanel,group:TabGroup}
         */
        public static PANEL_REMOVED:string="panelremoved";
        /**
         * data:ITabPanel
         */
        public static PANEL_DRAG:string='paneldrag';
        constructor(type:string,data?:any){
            super(type,data);
        }
    }
}