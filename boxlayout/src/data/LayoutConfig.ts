namespace boxlayout {
    export enum LayoutMode{
        NORMAL,
        FIXED
    }
    /**
     * 布局配置文件
     */
    export class LayoutConfig extends EventDispatcher {
        constructor() {
            super();
        }
        private _titleRenderFactory: ITitleRenderFactory = new DefaultTitleRenderFactory();
        /**标题呈现器（默认：DefaultTitleRenderFactory）**/
        public set titleRenderFactory(v: ITitleRenderFactory) {
            this._titleRenderFactory = v;
        }
        public get titleRenderFactory(): ITitleRenderFactory {
            return this._titleRenderFactory;
        }
        private _panelSerialize: IPanelSerialize = new DefaultPanelSerialize();
        /**面板序列化（默认：DefaultPanelSerialize）*/
        public get panelSerialize(): IPanelSerialize {
            return this._panelSerialize;
        }
        public set panelSerialize(v: IPanelSerialize) {
            this._panelSerialize = v;
        }
        private _layoutGap=1;
        /**布局间隙 （默认：1）*/
        public get layoutGap():number{
            return this._layoutGap;
        }
        public set layoutGap(v:number){
            this._layoutGap=v;
        }
        private _mode:LayoutMode=LayoutMode.NORMAL;
        /** 布局模式（默认：LayoutMode.NORMAL）*/
        public get mode():LayoutMode{
            return this._mode;
        }
        public set mode(v:LayoutMode){
            this._mode=v;
        }
        private _documentConfig: LayoutConfig;
        /**文档区配置 */
        public get documentConfig(): LayoutConfig {
            return this._documentConfig;
        }
        public set documentConfig(v: LayoutConfig) {
            this._documentConfig = v;
        }
    }
}