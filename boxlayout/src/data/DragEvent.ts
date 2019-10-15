/// <reference path="./EventDispatcher.ts" />
namespace boxlayout{
    /**
     * 拖拽事件
     * @author 杨宁
     */
    export class DragEvent extends boxlayout_event.Event{
        /**开始拖拽 */
        public static STARTDRAG:string='dragevent_startdrag';
        constructor(type:string,data?:any){
            super(type,data);
        }
    }
}