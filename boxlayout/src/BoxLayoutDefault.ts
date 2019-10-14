/// <reference path="./render/tabgroup/TabPanel.ts" />
namespace boxlayout {
    export class DefaultPanelSerialize implements IPanelSerialize {
        public serialize(ownerLayout: BoxLayout, panel: ITabPanel): any {
            return { panelID: panel.id, closeable: panel.closeable };
        }
        public unSerialize(ownerLayout: BoxLayout, panelInfo: { panelID: string, closeable: boolean }): ITabPanel {
            let panel = ownerLayout.getRegistPanelById(panelInfo.panelID);
            if (!panel) {
                throw new Error("ID为 " + panelInfo.panelID + " 的面板未注册");
            }
            panel.closeable=panelInfo.closeable;
            return panel;
        }
    }

    export class PlaceholderPanel extends TabPanel {
        constructor() {
            super();
            this.id = 'PlaceholderPanel';
            this.title = 'PlaceholderPanel';
        }
    }
}