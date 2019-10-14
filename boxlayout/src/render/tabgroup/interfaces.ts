namespace boxlayout {
    /**
     * 面板接口
     * @author 杨宁
     */
    export interface ITabPanel extends IRender, boxlayout_event.IEventDispatcher {
        /**面板id */
        id: string;
        /**面板标题 */
        title: string;
        /**面板图标 */
        icon: string;
        /**是否可关闭 */
        closeable:boolean;
        /**所属的容器 */
        ownerGroup:TabGroup;
        /**所属的布局 */
        ownerLayout:BoxLayout;
        /**布局权重 值越大越优先调整尺寸 */
        priorityLevel:number;
        /**获取工具栏对象 */
        getToolsRender(): IRender;
        /**
         * 是否可见
         * @internal
         * */
        $visible: boolean;
    }

    /**
     * 标题呈现器接口
     * @author 杨宁
     */
    export interface ITitleRender extends IRender{
        /**对应的面板 */
        panel:ITabPanel;
        /**是否选中 */
        selected:boolean;
        /**获取视图绑定信息 */    
        getBounds(): { x: number, y: number, width: number, height: number }
        /**更新视图 */
        updateDisplay():void
    }
    
    /**
     * 标题呈现器工厂接口
     * @author 杨宁
     */
    export interface ITitleRenderFactory{
        /**
         * 创建一个呈现器实例
         */
        createTitleRender():ITitleRender;
    }
}