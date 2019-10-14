namespace boxlayout {
    export class BoxLayoutEvent extends boxlayout_event.Event {
        /**
         * 添加了一个Panel
         * data:{panel:ITabPanel,tabGroup:TabGroup}
         */
        public static PANEL_ADDED: string = "tabgroupevent_paneladded";
        /**
        * 正在移除Panel
        * data:{panel:ITabPanel,group:TabGroup}
        */
        public static PANEL_REMOVING: string = "tabgroupevent_panelremoving";
        /**
        * 移除了一个Panel
        * data:{panel:ITabPanel,group:TabGroup}
        */
        public static PANEL_REMOVED: string = "tabgroupevent_panelremoved";
        /**
         * 拖拽了一个Panel
         * data:panel
         */
        public static PANEL_DRAG: string = 'tabgroupevent_paneldrag';
        /**
         * 焦点发生变化
         * data:焦点panel
         */
        public static FOCUS_CHANGED: string = 'focuschanged';
        constructor(type: string, data?: any) {
            super(type, data);
        }
    }
}