namespace boxlayout {
    /**
     * 布局配置文件
     */
    export class LayoutConfig extends boxlayout_event.EventDispatcher {
        constructor() {
            super();
        }
        private _titleRenderFactory: ITitleRenderFactory = new DefaultTitleRenderFactory();
        /**标题呈现器*/
        public set titleRenderFactory(v: ITitleRenderFactory) {
            this._titleRenderFactory = v;
        }
        public get titleRenderFactory(): ITitleRenderFactory {
            return this._titleRenderFactory;
        }
        private _panelSerialize: IPanelSerialize = new DefaultPanelSerialize();
        /**面板序列化 */
        public get panelSerialize(): IPanelSerialize {
            return this._panelSerialize;
        }
        public set panelSerialize(v: IPanelSerialize) {
            this._panelSerialize = v;
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