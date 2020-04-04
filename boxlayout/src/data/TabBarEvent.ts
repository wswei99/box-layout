/// <reference path="./EventDispatcher.ts" />
namespace boxlayout{
    /**
     * @author 杨宁
     */
    export class TabBarEvent extends Event{
        /**选择改变 */
        public static CHANGE:string='tabbarevent_change';
        /**开始拖拽 */
        public static BEGINDRAG:string='tabbarevent_begindrag';
        /**双击 */
        public static ITEMDOUBLECLICK:string='tabbarevent_itemdoubleclick';
        constructor(type:string,data?:any){
            super(type,data);
        }
    }
}