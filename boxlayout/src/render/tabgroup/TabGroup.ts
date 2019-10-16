/// <reference path="../../data/DragInfo.ts" />
/// <reference path="../../data/EventDispatcher.ts" />
namespace boxlayout {
    /**
     * @author 杨宁
     */
    export class TabGroup extends boxlayout_event.EventDispatcher implements IDragRender {
        constructor() {
            super();
            this._tabBar = new TabBar();
        }
        public get minWidth(): number {
            let size = 0;
            this.panels.forEach(panel => {
                size = Math.max(panel.minWidth, size);
            })
            return size;
        }
        public set minWidth(v: number) {
        }
        public get minHeight(): number {
            let size = 0;
            this.panels.forEach(panel => {
                size = Math.max(panel.minHeight, size);
            })
            return size;
        }
        public set minHeight(v: number) {
        }
        public set titleRenderFactory(v: ITitleRenderFactory) {
            this._tabBar.titleRenderFactory = v;
        }
        public get titleRenderFactory(): ITitleRenderFactory {
            return this._tabBar.titleRenderFactory;
        }
        private _tabBar: TabBar;
        public get tabBar(): TabBar {
            return this._tabBar;
        }
        public get root(): HTMLElement {
            return this.container;
        }
        public get ownerLayout(): BoxLayout {
            if (this.ownerElement)
                return this.ownerElement.ownerLayout;
            return null;
        }
        private _ownerElement: IBoxLayoutElement;
        public get ownerElement(): IBoxLayoutElement {
            return this._ownerElement;
        }
        public set ownerElement(v: IBoxLayoutElement) {
            this._ownerElement = v;
        }
        private _panels: ITabPanel[] = [];
        public set panels(v: ITabPanel[]) {
            this._panels = v;
            this._panels.forEach(panel => { panel.ownerGroup = this });
            this.tabBar.panels = v;
            this.reDeployPanels();
            this.commitSelected();
        }
        public get panels(): ITabPanel[] {
            return this._panels;
        }
        private _selectedIndex: number = NaN;
        public set selectedIndex(v: number) {
            this._selectedIndex = v;
            this.tabBar.selectedIndex = v;
            this.commitSelected();
        }
        public get selectedIndex(): number {
            return this._selectedIndex;
        }
        public set selectedPanel(panel: ITabPanel) {
            let index = this.panels.indexOf(panel);
            this.selectedIndex = index;
        }
        public get selectedPanel(): ITabPanel {
            return this.panels[this.selectedIndex];
        }
        private _maximized: boolean = false;
        public set maximized(v: boolean) {
            this._maximized = v;
            this.updateDisplayIndex();
        }
        public get maximized(): boolean {
            return this._maximized;
        }
        private updateDisplayIndex(): void {
            let tabBarZ: number = this._maximized ? 4 : 1;
            let panelZ: number = this._maximized ? 3 : 0;
            this.tabBar.root.style.zIndex = tabBarZ.toString();
            this.panels.forEach(panel => {
                panel.root.style.zIndex = panelZ.toString();
            });
        }
        /**
         * 移除一个面板，移除后会选中最近选中过的一个面板
         */
        public removePanel(v: ITabPanel): void {
            let targetIndex = NaN;
            for (let i: number = 0; i < this.panels.length; i++) {
                if (this.panels[i] === v) {
                    targetIndex = i;
                    break;
                }
            }
            if (!isNaN(targetIndex)) {
                this.panels.splice(targetIndex, 1);
                v.ownerGroup = null;
                this.tabBar.panels = this.panels;
                this.reDeployPanels();
                //设置新的选中索引
                let find: boolean = false;
                while (this.selectedPath.length > 0) {
                    let tmp = this.selectedPath.pop();
                    let index = this.panels.indexOf(tmp);
                    if (index !== -1) {
                        this.selectedIndex = index;
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    this.selectedIndex = this.panels.length - 1;
                }
            }
        }
        /**
         * 添加并选中一个面板
         */
        public addPanel(v: ITabPanel): void {
            for (let i: number = 0; i < this.panels.length; i++) {
                if (this.panels[i] === v) {
                    this.selectedIndex = (i);
                    return;
                }
            }
            this.panels.push(v);
            v.ownerGroup = this;
            this.tabBar.panels = this.panels;
            this.reDeployPanels();
            //设置新的选中索引
            this.selectedIndex = this.panels.length - 1;
        }
        /**
         * 添加并选中一个面板
         */
        public addPanelTo(target: ITabPanel, panel: ITabPanel, dir: string = "right"): void {
            let index = this.panels.indexOf(panel);
            if (index !== -1) {
                if (target === panel) {
                    return;
                }
                this.panels.splice(index, 1);
            }
            index = this.panels.indexOf(target);
            switch (dir) {
                case "right":
                    this.panels.splice(index + 1, 0, panel);
                    break;
                case "left":
                    this.panels.splice(index, 0, panel);
                    break;
            }
            panel.ownerGroup = this;
            this.tabBar.panels = this.panels;
            this.reDeployPanels();
            //设置新的选中索引
            index = this.panels.indexOf(panel);
            this.selectedIndex = index;
        }
        private reDeployPanelTag: boolean = false;
        private currentPanels: ITabPanel[] = [];
        private reDeployPanels(): void {
            if (!this.container) {
                this.reDeployPanelTag = true;
                return;
            }
            let deployList: ITabPanel[] = this.panels.concat();
            for (let cp of this.currentPanels) {
                let index = deployList.indexOf(cp);
                if (index === -1) {
                    cp.removeFromParent();
                }
                else {
                    deployList.splice(index, 1);
                }
            }
            deployList.forEach(panel => {
                panel.render(this.container);
                panel.$visible = false;
            });
            this.currentPanels = this.panels.concat();
            this.updateDisplayIndex();
        }
        //缓存的选中路径
        private selectedPath: ITabPanel[] = [];
        private commitSelected(): void {
            for (let i: number = 0; i < this.panels.length; i++) {
                if (i === this.selectedIndex) {
                    this.panels[i].$visible = true;
                    this.selectedPath.push(this.panels[i]);
                }
                else {
                    this.panels[i].$visible = false;
                }
            }
            this.updatePanelDisplay();
        }
        /**刷新所有视图 */
        public refresh() {
            this.tabBar.refresh();
            this.updatePanelDisplay();
        }
        public adjustDragInfo(e: MouseEvent, info: DragInfo): boolean {
            if (!this.adjustDragInfo_tabBox(e, info)) {
                this.adjustDragInfo_tabGroup(e, info);
            }
            return true;
        }
        private adjustDragInfo_tabBox(e: MouseEvent, info: DragInfo): boolean {
            let globalP = MatrixUtil.localToGlobal(this.tabBar.root, new Point());
            let bounds = this.tabBar.getBounds();
            let globalRange = new Rectangle(globalP.x, globalP.y, bounds.width, bounds.height);
            if (globalRange.containsPoint(new Point(e.clientX, e.clientY))) {
                let targetItem: ITitleRender;
                for (let i: number = 0; i < this.tabBar.currentItems.length; i++) {
                    let item = this.tabBar.currentItems[i];
                    globalP = MatrixUtil.localToGlobal(item.root, new Point());
                    bounds = item.getBounds();
                    globalRange.x = globalP.x;
                    globalRange.y = globalP.y;
                    globalRange.width = bounds.width;
                    globalRange.height = bounds.height;
                    if (globalRange.containsPoint(new Point(e.clientX, e.clientY))) {
                        targetItem = item;
                        break;
                    }
                }
                let dir: string;
                if (info.otherData["startElement"] === this.ownerElement) {
                    if (!targetItem) {
                        targetItem = this.tabBar.currentItems[this.tabBar.currentItems.length - 1];
                    }
                    if (this.panels.indexOf(targetItem.panel) <= this.panels.indexOf(info.otherData["startPanel"])) {
                        dir = "left";
                    }
                    else {
                        dir = "right";
                    }
                    let p = MatrixUtil.localToGlobal(targetItem.root, new Point());
                    let itemBound = targetItem.getBounds();
                    info.dragRange.x = p.x;
                    info.dragRange.y = p.y;
                    info.dragRange.width = itemBound.width;
                    info.dragRange.height = itemBound.height;
                }
                else {
                    if (targetItem) {
                        dir = "left";
                        let p = MatrixUtil.localToGlobal(targetItem.root, new Point());
                        let itemBound = targetItem.getBounds();
                        info.dragRange.x = p.x;
                        info.dragRange.y = p.y;
                        info.dragRange.width = itemBound.width;
                        info.dragRange.height = itemBound.height;
                    }
                    else {
                        targetItem = this.tabBar.currentItems[this.tabBar.currentItems.length - 1];
                        dir = "right";
                        let p = MatrixUtil.localToGlobal(targetItem.root, new Point());
                        let itemBound = targetItem.getBounds();
                        info.dragRange.x = p.x + bounds.width;
                        info.dragRange.y = p.y;
                        info.dragRange.width = info.dragRange.height = itemBound.height;
                    }
                }
                info.otherData["type"] = "panel";
                info.otherData["dir"] = dir;
                info.otherData["targetElement"] = this.ownerElement;
                info.otherData["targetPanel"] = targetItem.panel;
                return true;
            }
            return false;
        }
        private adjustDragInfo_tabGroup(e: MouseEvent, info: DragInfo): void {
            let p: Point = MatrixUtil.globalToLocal(this.container, new Point(e.clientX, e.clientY));
            p.x -= this.bx;
            p.y -= this.by;
            let marginHor: number = this.bw / 3;
            let marignVer: number = this.bh / 3;
            let dir: string;
            let obj: any = {};
            obj['left'] = p.x < marginHor;
            obj['right'] = p.x > this.bw - marginHor;
            obj['top'] = p.y < marignVer;
            obj['bottom'] = p.y > this.bh - marignVer;
            obj['center'] = (!obj['left'] && !obj['right'] && !obj['bottom'] && !obj['top']);
            let globalP: Point = MatrixUtil.localToGlobal(this.container, new Point(this.bx, this.by));
            if (obj['center']) {
                dir = 'center';
            }
            else if (obj['left'] && obj['top']) {
                if (p.x < p.y) dir = 'left'; else dir = 'top';
            }
            else if (obj['left'] && obj['bottom']) {
                if (p.x < this.bh - p.y) dir = 'left'; else dir = 'bottom';
            }
            else if (obj['right'] && obj['top']) {
                if (this.bw - p.x < p.y) dir = 'right'; else dir = 'top';
            }
            else if (obj['right'] && obj['bottom']) {
                if (this.bw - p.x < this.bh - p.y) dir = 'right'; else dir = 'bottom';
            }
            else {
                b: for (var key in obj) {
                    if (obj[key]) { dir = key; break b; }
                }
            }
            switch (dir) {
                case 'center':
                    info.dragRange.width = this.bw;
                    info.dragRange.height = this.bh;
                    info.dragRange.x = globalP.x;
                    info.dragRange.y = globalP.y;
                    break;
                case 'left':
                    info.dragRange.width = this.bw / 2;
                    info.dragRange.height = this.bh;
                    info.dragRange.x = globalP.x;
                    info.dragRange.y = globalP.y;
                    break;
                case 'right':
                    info.dragRange.width = this.bw / 2;
                    info.dragRange.height = this.bh;
                    info.dragRange.x = globalP.x + this.bw / 2;
                    info.dragRange.y = globalP.y;
                    break;
                case 'top':
                    info.dragRange.width = this.bw;
                    info.dragRange.height = this.bh / 2;
                    info.dragRange.x = globalP.x;
                    info.dragRange.y = globalP.y;
                    break
                case 'bottom':
                    info.dragRange.width = this.bw;
                    info.dragRange.height = this.bh / 2;
                    info.dragRange.x = globalP.x;
                    info.dragRange.y = globalP.y + this.bh / 2;
                    break;
            }
            //
            info.otherData["type"] = "box";
            info.otherData["dir"] = dir;
            info.otherData["targetElement"] = this.ownerElement;
        }
        public acceptDragInfo(v: DragInfo): void {
            switch (v.otherData["type"]) {
                case "box":
                    let startElement: IBoxLayoutElement = v.otherData["startElement"];
                    let startPanel: ITabPanel = v.otherData["startPanel"];
                    let targetElement: IBoxLayoutElement = v.otherData["targetElement"];
                    let dir: string = v.otherData["dir"];
                    if (dir === "center") {
                        if (startElement === targetElement) {
                            return;
                        }
                        (startElement.render as TabGroup).removePanel(startPanel);
                        if ((startElement.render as TabGroup).panels.length === 0) {
                            startElement.ownerLayout.removeBoxElement(startElement);
                        }
                        (targetElement.render as TabGroup).addPanel(startPanel);
                        this.dispatchEvent(new TabGroupEvent(TabGroupEvent.PANEL_DRAG, startPanel));
                    }
                    else {
                        if (startElement === targetElement && (startElement.render as TabGroup).panels.length === 1) {
                            return;
                        }
                        (startElement.render as TabGroup).removePanel(startPanel);
                        if ((startElement.render as TabGroup).panels.length === 0) {
                            startElement.ownerLayout.removeBoxElement(startElement);
                        }
                        let newElement: IBoxLayoutElement = new BoxLayoutElement();
                        targetElement.ownerLayout.addBoxElement(targetElement, newElement, dir as Position);
                        (newElement.render as TabGroup).addPanel(startPanel);
                        this.dispatchEvent(new TabGroupEvent(TabGroupEvent.PANEL_DRAG, startPanel));
                    }
                    break;
                case "panel":
                    startElement = v.otherData["startElement"];
                    startPanel = v.otherData["startPanel"];
                    targetElement = v.otherData["targetElement"];
                    let targetPanel = v.otherData["targetPanel"];
                    dir = v.otherData["dir"];
                    if (startElement !== targetElement) {
                        (startElement.render as TabGroup).removePanel(startPanel);
                        if ((startElement.render as TabGroup).panels.length === 0) {
                            startElement.ownerLayout.removeBoxElement(startElement);
                        }
                        (targetElement.render as TabGroup).addPanelTo(targetPanel, startPanel, dir);
                        this.dispatchEvent(new TabGroupEvent(TabGroupEvent.PANEL_DRAG, startPanel));
                    }
                    else {
                        (targetElement.render as TabGroup).addPanelTo(targetPanel, startPanel, dir);
                        this.dispatchEvent(new TabGroupEvent(TabGroupEvent.PANEL_DRAG, startPanel));
                    }
                    break;
            }
        }
        public $execCommand(command: string): void {
            switch (command) {
                case 'close':
                    let targetPanel: ITabPanel = this.panels[this.selectedIndex];
                    this.removePanelWithEvent(targetPanel);
                    if (this.panels.length === 0) {
                        this.ownerElement.ownerLayout.removeBoxElement(this.ownerElement);
                    }
                    break;
            }
        }
        private removePanelWithEvent(panel: ITabPanel): void {
            this.dispatchEvent(new TabGroupEvent(TabGroupEvent.PANEL_REMOVING, {panel:panel,group:this}));
            this.removePanel(panel);
            this.dispatchEvent(new TabGroupEvent(TabGroupEvent.PANEL_REMOVED, {panel:panel,group:this}));
        }

        private container: HTMLElement;
        public render(container: HTMLElement): void {
            this.container = container;
            this.tabBar.render(this.container);
            if (this.reDeployPanelTag) {
                this.reDeployPanelTag = false;
                this.reDeployPanels();
                this.commitSelected();
            }
            this.tabBar.addEventListener(TabBarEvent.CHANGE, this.tabBarEventHandle, this);
            this.tabBar.addEventListener(TabBarEvent.BEGINDRAG, this.tabBarEventHandle, this);
            this.tabBar.addEventListener(TabBarEvent.ITEMDOUBLECLICK, this.tabBarEventHandle, this);
        }
        public removeFromParent(): void {
            if (this.container) {
                this.tabBar.removeFromParent();
                this.currentPanels.forEach(panel => {
                    panel.removeFromParent();
                });
                this.tabBar.removeEventListener(TabBarEvent.CHANGE, this.tabBarEventHandle, this);
                this.tabBar.removeEventListener(TabBarEvent.BEGINDRAG, this.tabBarEventHandle, this);
                this.tabBar.removeEventListener(TabBarEvent.ITEMDOUBLECLICK, this.tabBarEventHandle, this);
            }
        }
        private tabBarEventHandle(e: TabBarEvent): void {
            switch (e.type) {
                case TabBarEvent.CHANGE:
                    this._selectedIndex = this.tabBar.selectedIndex;
                    this.commitSelected();
                    this.dispatchEvent(new TabGroupEvent(TabGroupEvent.SELECTCHANGE,this))
                    break;
                case TabBarEvent.BEGINDRAG:
                    if (!this.ownerElement.ownerLayout.maxSizeElement) {
                        let info: DragInfo = new DragInfo();
                        info.otherData["startElement"] = this.ownerElement;
                        info.otherData["startPanel"] = e.data as ITabPanel;
                        this.dispatchEvent(new DragEvent(DragEvent.STARTDRAG, info));
                    }
                    break;
                case TabBarEvent.ITEMDOUBLECLICK:
                    if (this.ownerElement.ownerLayout.maxSizeElement === this.ownerElement) {
                        this.ownerElement.ownerLayout.setMaxSize(null);
                    }
                    else {
                        this.ownerElement.ownerLayout.setMaxSize(this.ownerElement);
                    }
                    break;
            }
        }
        private tabBarHeight: number = 25;//选项卡区域的高度
        private bx: number;
        private by: number;
        private bw: number;
        private bh: number;
        public setBounds(x: number, y: number, width: number, height: number): void {
            this.bx = x;
            this.by = y;
            this.bw = width;
            this.bh = height;
            this.tabBar.setBounds(x, y, width, this.tabBarHeight);
            this.updatePanelDisplay();
        }
        private updatePanelDisplay(): void {
            for (let i: number = 0; i < this.panels.length; i++) {
                if (i === this.selectedIndex) {
                    this.panels[i].setBounds(this.bx, this.by + this.tabBarHeight, this.bw, this.bh - this.tabBarHeight);
                    break;
                }
            }
        }
        public dispose() {
            //
        }
    }
}