/// <reference path="../../data/EventDispatcher.ts" />
namespace boxlayout {
    /**
     * TabPanel焦点管理器（单例模式）
     * @author 杨宁
     */
    export class TabPanelFocusManager extends boxlayout_event.EventDispatcher {
        private static instance: TabPanelFocusManager;
        public static getInstance(): TabPanelFocusManager {
            if (!this.instance) {
                this.instance = new TabPanelFocusManager();
            }
            return this.instance;
        }
        private _foucsPanel: ITabPanel;
        /**当前焦点面板 */
        public get currentFocus(): ITabPanel {
            return this._foucsPanel;
        }
        /**设置焦点面板 */
        public focus(panel: ITabPanel): void {
            // if (this._foucsPanel === panel) {
            //     return;
            // }
            if (this._foucsPanel&&this._foucsPanel.ownerLayout) {
                this._foucsPanel.root.className = 'panel';
                this._foucsPanel.ownerGroup.tabBar.currentItems.forEach(item => {
                    if (item.panel === this._foucsPanel) {
                        item.root.className = item.selected ? 'title-item selected' : 'title-item';
                    }
                })
            }
            this._foucsPanel = panel;
            if (this._foucsPanel) {
                this._foucsPanel.root.focus();
                this._foucsPanel.ownerGroup.selectedPanel=this._foucsPanel
                this._foucsPanel.root.className = 'panel focus';
                this._foucsPanel.ownerGroup.tabBar.currentItems.forEach(item => {
                    if (item.panel === this._foucsPanel) {
                        item.root.className = 'title-item focus'
                    }
                })
                this.addActiveGroup(this._foucsPanel);
            }
        }
        private activeGroups: { layout: BoxLayout, group: TabGroup }[] = [];
        /**
         * 获取活动状态的面板组
         * - 焦点面板所在的组为活动组
         * @param layout 布局对象
         */
        public getActiveGroup(layout: BoxLayout): TabGroup {
            for (let i: number = 0; i < this.activeGroups.length; i++) {
                if (this.activeGroups[i].layout === layout && this.activeGroups[i].group.panels.length != 0) {
                    return this.activeGroups[i].group;
                }
            }
            return null;
        }
        private addActiveGroup(panel: ITabPanel): void {
            for (let i: number = 0; i < this.activeGroups.length; i++) {
                if (this.activeGroups[i].layout === panel.ownerGroup.ownerElement.ownerLayout) {
                    this.activeGroups[i].group = panel.ownerGroup;
                    return;
                }
            }
            this.activeGroups.push({ layout: panel.ownerGroup.ownerElement.ownerLayout, group: panel.ownerGroup });
        }

        /**
         * 重置
         */
        public reSet(): void {
            if (this._foucsPanel) {
                this._foucsPanel.root.className = 'panel';
                this._foucsPanel.ownerGroup.tabBar.currentItems.forEach(item => {
                    if (item.panel === this._foucsPanel) {
                        item.root.className = item.selected ? 'title-item selected' : 'title-item';
                    }
                })
            }
            this._foucsPanel = null;
            this.activeGroups = [];
        }
    }
}
