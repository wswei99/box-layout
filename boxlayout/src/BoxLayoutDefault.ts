/// <reference path="./render/tabgroup/TabPanel.ts" />
namespace boxlayout {
    /**
     * 默认面板序列化器
     * @author 杨宁
     */
    export class DefaultPanelSerialize implements IPanelSerialize {
        public serialize(ownerLayout: BoxLayout, panel: ITabPanel): any {
            return { panelID: panel.id, closeable: (panel as TabPanel).closeable };
        }
        public unSerialize(ownerLayout: BoxLayout, panelInfo: { panelID: string, closeable: boolean }): ITabPanel {
            let panel = ownerLayout.getRegistPanelById(panelInfo.panelID);
            if (!panel) {
                throw new Error("ID为 " + panelInfo.panelID + " 的面板未注册");
            }
            (panel as TabPanel).closeable=panelInfo.closeable;
            return panel;
        }
    }
    /**
     * 占位面板
     * - 解析布局文件时如果遇到无法解析的面板则会用此面板代替
     * @author 杨宁
     */
    export class PlaceholderPanel extends TabPanel {
        constructor() {
            super();
            this.id = 'PlaceholderPanel';
            this.title = 'PlaceholderPanel';
        }
    }
}