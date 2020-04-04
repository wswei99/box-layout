/// <reference path="./EventDispatcher.ts" />
namespace boxlayout{
    /**
     * 拖拽事件
     * @author 杨宁
     */
    export class DragEvent extends Event{
        /**开始拖拽 */
        public static STARTDRAG:string='dragevent_startdrag';
        constructor(type:string,data?:any){
            super(type,data);
        }
    }
}