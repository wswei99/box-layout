/// <reference path="./EventDispatcher.ts" />
namespace boxlayout{
    export class TabBarEvent extends boxlayout_event.Event{
        public static CHANGE:string='tabbarevent_change';
        public static BEGINDRAG:string='tabbarevent_begindrag';
        
        public static ITEMDOUBLECLICK:string='tabbarevent_itemdoubleclick';
        constructor(type:string,data?:any){
            super(type,data);
        }
    }
}