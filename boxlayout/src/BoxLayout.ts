/// <reference path="./data/EventDispatcher.ts" />
namespace boxlayout {
    ////
    ////布局框架显示对象层级关系：
    ////0:panel、document
    ////1:tabbar
    ////2:separator
    ////3:最大化 panel、document
    ////4:最大化 tabbar
    ////5:maskElement
    export type Position = "left" | "right" | "top" | "bottom";
    /**
     * 盒式布局
     * @author 杨宁
     */
    export class BoxLayout extends boxlayout_event.EventDispatcher {
        private dragAreaElement: DragArea;
        private maskElement: Mask;
        constructor() {
            super();
            this.dragAreaElement = new DragArea();
            this.maskElement = new Mask();
            this.containerResizeHandle = this.containerResizeHandle.bind(this);
            this.separatorHandle = this.separatorHandle.bind(this);
            this.dragEventHandle = this.dragEventHandle.bind(this);
            this.focusHandler = this.focusHandler.bind(this);
        }
        private _area: HTMLElement;
        private _rootLayoutElement: IBoxLayoutElement;
        //根布局元素
        public get rootLayoutElement(): IBoxLayoutElement {
            return this._rootLayoutElement;
        }
        private _layoutConfig: LayoutConfig;
        /**配置 */
        public get config(): LayoutConfig {
            return this._layoutConfig;
        }
        /**
         * 初始化盒式布局
         * @param container 布局区域
         */
        public init(area: HTMLElement, config?: {
            /**标题呈现器工厂*/
            titleRenderFactory?: ITitleRenderFactory
            /**面板序列化 */
            panelSerialize?: IPanelSerialize
            /**文档区配置 */
            documentConfig?: {
                /**标题呈现器工厂*/
                titleRenderFactory?: ITitleRenderFactory
                /**面板序列化 */
                panelSerialize?: IPanelSerialize
            }
        }): void {
            this._area = document.createElement('div');
            area.appendChild(this._area);
            this._area.className = 'split-line';
            this._area.style.position = 'relative';
            this._area.style.zIndex = '0';
            this._area.style.overflow = 'hidden';
            this._area.style.width = '100%';
            this._area.style.height = '100%';
            HtmlElementResizeHelper.watch(this._area);
            this._area.addEventListener("resize", this.containerResizeHandle);
            this._layoutConfig = new LayoutConfig();
            if (config) {
                for (let key in config) {
                    this._layoutConfig[key] = config[key];
                }
            }
            //焦点处理事件
            this._area.addEventListener('mousedown', this.focusHandler, true);
        }
        /**
         * 获取激活的选项卡组
         */
        public getActiveTabGroup(): TabGroup {
            let activeTabGroup: TabGroup = this.focusManager.getActiveGroup(this);
            if (!activeTabGroup || !activeTabGroup.ownerLayout) {
                activeTabGroup = this.getFirstElement(this.rootLayoutElement).render as TabGroup;
            }
            return activeTabGroup;
        }
        /**
         * 获取激活的面板
         */
        public getActivePanel(): ITabPanel {
            let panel = this.focusManager.currentFocus;
            if (panel && panel.ownerLayout) {
                return panel;
            }
            return null;
        }
        /**
         * 添加一个元素到跟节点
         * @param element 要添加的元素
         * @param position 位置
         */
        public addBoxElementToRoot(element: IBoxLayoutElement, position: Position = "right"): void {
            if (!this.rootLayoutElement) {
                this._setMaxSize(null);
                this._rootLayoutElement = element;
                this.addToArea(this.rootLayoutElement);
                this.updateBoxElement();
                return;
            }
            this.addBoxElement(this.rootLayoutElement, element, position);
        }
        /**
         * 添加一个元素到另一个元素的旁边
         * @param target 目标元素
         * @param element 要添加的元素
         * @param position 位置
         */
        public addBoxElement(target: IBoxLayoutElement, element: IBoxLayoutElement, position: Position = "right", ): void {
            if (target === element || element === this.rootLayoutElement) {
                return;
            }
            this._setMaxSize(null);
            //如果target为element的父级，那么在删除element的时候target的另一个子元素将占据target的位置，这里需要重新指定target
            if (element.parentContainer === target) {
                if (element === element.parentContainer.firstElement) {
                    target = element.parentContainer.secondElement;
                }
                else {
                    target = element.parentContainer.firstElement;
                }
            }
            this.removeBoxElement(element);
            let newBox: IBoxLayoutContainer = new BoxLayoutContainer();
            switch (position) {
                case "bottom": newBox.isVertical = true;
                case "right": newBox.secondElement = element; break;
                case "top": newBox.isVertical = true;
                case "left": newBox.firstElement = element; break;
            }
            element.parentContainer = newBox;
            this.addToArea(newBox);//这里只添加新创建的元素，此刻target并没有链接到newBox中
            if (target === this.rootLayoutElement) {
                this._rootLayoutElement = newBox;
            }
            else {
                if (target === target.parentContainer.firstElement) {
                    target.parentContainer.firstElement = newBox;
                }
                else {
                    target.parentContainer.secondElement = newBox;
                }
                newBox.parentContainer = target.parentContainer;
            }

            newBox.width = target.width;
            newBox.height = target.height;
            element.width = target.width / 2;
            element.height = target.height / 2;
            target.width = target.width / 2;
            target.height = target.height / 2;

            target.parentContainer = newBox;
            switch (position) {
                case "bottom":
                case "right": newBox.firstElement = target; break;
                case "top":
                case "left": newBox.secondElement = target; break;
            }
            this.updateBoxElement();
        }
        /**
         * 删除一个元素
         * @param element 要删除的元素 
         */
        public removeBoxElement(element: IBoxLayoutElement): void {
            if (!element.ownerLayout || element === this.rootLayoutElement) {
                return;
            }
            this._setMaxSize(null);
            //获取平级的另一个节点
            let parent = element.parentContainer;
            let anotherElement: IBoxLayoutElement;//此节点会被挂接到新的节点上面
            let needUpdateElement: IBoxLayoutElement;
            if (element === parent.firstElement) {
                anotherElement = parent.secondElement;
                parent.secondElement = null;//断开与anotherElement的链接
            }
            else {
                anotherElement = parent.firstElement;
                parent.firstElement = null;//断开与anotherElement的链接
            }
            if (parent === this.rootLayoutElement) {
                this._rootLayoutElement = anotherElement;
                anotherElement.parentContainer = null;
                needUpdateElement = anotherElement;

                this.rootLayoutElement.x = 0;
                this.rootLayoutElement.y = 0;
            }
            else {
                if (parent === parent.parentContainer.firstElement) {
                    parent.parentContainer.firstElement = anotherElement;
                }
                else {
                    parent.parentContainer.secondElement = anotherElement;
                }
                anotherElement.parentContainer = parent.parentContainer;
                needUpdateElement = anotherElement.parentContainer;
            }
            ////-----此段代码为了矫正尺寸增强交互体验，但不应该放在这里，应该融入布局机制中，暂时写在这
            anotherElement.width = parent.width;
            anotherElement.height = parent.height;
            ////----
            this.removeFromArae(parent);//此刻已断开与anotherElement的链接，所以anotherElement的render并没有被移除
            this._updateBoxElement(needUpdateElement);
        }

        private addToArea(element: IBoxLayoutElement): void {
            if (element) {
                element.ownerLayout = this;
                if (element instanceof BoxLayoutContainer) {
                    (element as IBoxLayoutContainer).separator.render(this._area);
                    this.attachSeparatorOperateEvent((element as IBoxLayoutContainer).separator.root);
                    this.addToArea((element as IBoxLayoutContainer).firstElement);
                    this.addToArea((element as IBoxLayoutContainer).secondElement);
                }
                else {
                    element.render.render(this._area);
                    element.render.addEventListener(DragEvent.STARTDRAG, this.dragHandle, this);
                    element.render.addEventListener(TabGroupEvent.SELECTCHANGE, this.panelHandle, this);
                    element.render.addEventListener(TabGroupEvent.PANEL_DRAG, this.panelHandle, this);
                }
            }
        }
        private removeFromArae(element: IBoxLayoutElement): void {
            if (element) {
                if (element instanceof BoxLayoutContainer) {
                    (element as IBoxLayoutContainer).separator.removeFromParent();
                    this.detachSeparatorOperateEvent((element as IBoxLayoutContainer).separator.root);
                    this.removeFromArae((element as IBoxLayoutContainer).firstElement);
                    this.removeFromArae((element as IBoxLayoutContainer).secondElement);
                }
                else {
                    element.render.removeFromParent();
                    element.render.removeEventListener(DragEvent.STARTDRAG, this.dragHandle, this);
                    element.render.removeEventListener(TabGroupEvent.SELECTCHANGE, this.panelHandle, this);
                    element.render.removeEventListener(TabGroupEvent.PANEL_DRAG, this.panelHandle, this);
                }
                element.ownerLayout = null;
            }
        }
        private _maxSizeElement: IBoxLayoutElement;
        private cacheWidth: number;
        private cacheHeight: number;
        public get maxSizeElement(): IBoxLayoutElement {
            return this._maxSizeElement;
        }
        /**设置最大化元素
         * 设置为null取消最大化
         */
        public setMaxSize(v: IBoxLayoutElement): void {
            this._setMaxSize(v);
            this.updateBoxElement();
        }
        private _setMaxSize(v: IBoxLayoutElement): void {
            if (this._maxSizeElement) {
                this._maxSizeElement.setMaxSize(false);
                this._maxSizeElement.width = this.cacheWidth;
                this._maxSizeElement.height = this.cacheHeight;
            }
            this._maxSizeElement = v;
            if (this._maxSizeElement) {
                this._maxSizeElement.setMaxSize(true);
                this.cacheWidth = this._maxSizeElement.width;
                this.cacheHeight = this._maxSizeElement.height;
            }
        }
        private updateBoxElement(): void {
            let element: IBoxLayoutElement = this.maxSizeElement ? this.maxSizeElement : this.rootLayoutElement;
            element.x = 0;
            element.y = 0;
            element.width = this._area.offsetWidth;
            element.height = this._area.offsetHeight;
            this._updateBoxElement(element);
        }
        private _updateBoxElement(element: IBoxLayoutElement): void {
            element.updateRenderDisplay();
        }
        private containerResizeHandle(e): void {
            if (this.rootLayoutElement) {
                this.updateBoxElement();
            }
        }

        ////
        ////分割条操作逻辑
        ////
        private attachSeparatorOperateEvent(element: HTMLElement): void {
            element.addEventListener("mouseenter", this.separatorHandle);
            element.addEventListener("mouseleave", this.separatorHandle);
            element.addEventListener("mousedown", this.separatorHandle);
        }
        private detachSeparatorOperateEvent(element: HTMLElement): void {
            element.removeEventListener("mouseenter", this.separatorHandle);
            element.removeEventListener("mouseleave", this.separatorHandle);
            element.removeEventListener("mousedown", this.separatorHandle);
        }
        private cursorLock: boolean = false;
        private startMouseP: Point = new Point();
        private startSize: Point = new Point();
        private targetContainer: IBoxLayoutContainer;
        private separatorHandle(e: MouseEvent): void {
            let container: IBoxLayoutContainer = e.currentTarget["__owner"];
            switch (e.type) {
                case "mouseenter":
                    if (!this.cursorLock) {
                        if (container.isVertical) { this._area.style.cursor = "row-resize"; }
                        else { this._area.style.cursor = "col-resize"; }
                    }
                    break;
                case "mouseleave":
                    if (!this.cursorLock) {
                        this._area.style.cursor = "default";
                    }
                    break;
                case "mousedown":
                    this.cursorLock = true;
                    this.startMouseP.x = e.clientX;
                    this.startMouseP.y = e.clientY;
                    this.startSize.x = container.lockElement.width;
                    this.startSize.y = container.lockElement.height;
                    this.targetContainer = container;
                    this.maskElement.render(this._area);
                    this.maskElement.setBounds(
                        this.rootLayoutElement.x,
                        this.rootLayoutElement.y,
                        this.rootLayoutElement.width,
                        this.rootLayoutElement.height);
                    window.addEventListener("mouseup", this.separatorHandle, true);
                    window.addEventListener("mousemove", this.separatorHandle, true);
                    break;
                case "mousemove":
                    e.stopPropagation();
                    e.preventDefault();
                    let vx: number = e.clientX - this.startMouseP.x;
                    let vy: number = e.clientY - this.startMouseP.y;
                    if (this.targetContainer.isVertical) {
                        if (this.targetContainer.lockElement === this.targetContainer.firstElement)
                            this.targetContainer.lockElement.height = this.startSize.y + vy;
                        else
                            this.targetContainer.lockElement.height = this.startSize.y - vy;

                        this._updateBoxElement(this.targetContainer);
                        this.targetContainer.lockElement.height = this.targetContainer.lockElement.height;
                    }
                    else {
                        if (this.targetContainer.lockElement === this.targetContainer.firstElement)
                            this.targetContainer.lockElement.width = this.startSize.x + vx;
                        else
                            this.targetContainer.lockElement.width = this.startSize.x - vx;

                        this._updateBoxElement(this.targetContainer);
                        this.targetContainer.lockElement.width = this.targetContainer.lockElement.width;
                    }
                    break;
                case "mouseup":
                    e.stopPropagation();
                    e.preventDefault();
                    this.cursorLock = false;
                    this._area.style.cursor = "default";
                    this.maskElement.removeFromParent();
                    window.removeEventListener("mousemove", this.separatorHandle, true);
                    window.removeEventListener("mouseup", this.separatorHandle, true);
                    break;
            }
        }
        private panelHandle(e: TabGroupEvent): void {
            switch (e.type) {
                case TabGroupEvent.SELECTCHANGE:
                    let group = e.data as TabGroup;
                    this.focusManager.focus(group.selectedPanel);
                    break;
                case TabGroupEvent.PANEL_DRAG:
                    let panel = e.data as ITabPanel;
                    this.focusManager.focus(panel);
                    break;
            }
        }
        ////
        ////面板信息缓存相关
        ////
        ////
        private closePanelInfoCache: any = {};
        private cachePanelInfo(panel: ITabPanel): void {
            if(panel.ownerGroup&&panel.ownerGroup.ownerLayout){
                let link: Position[] = [];
                this.getDirLink(panel.ownerGroup.ownerElement, link);
                this.closePanelInfoCache[panel.id] = link;
            }
        }
        private getOldSpace(panelId: string): TabGroup {
            let link: Position[] = this.closePanelInfoCache[panelId];
            if (link) {
                let element = this.getElementByLink(link);
                if (element && !(element instanceof DocumentElement)) {
                    return (element.render as TabGroup);
                }
                let dir: Position = link.pop();
                element = this.getElementByLink(link);
                if (!element && link.length === 0) {
                    element = this.rootLayoutElement;
                }
                if (element) {
                    let newElement = new BoxLayoutElement();
                    this.addBoxElement(element, newElement, dir);
                    return (newElement.render as TabGroup);
                }
            }
            return null;
        }
        private getDirLink(element: IBoxLayoutElement, result: Position[]): void {
            let parent: IBoxLayoutContainer = element.parentContainer;
            if (parent) {
                let isFirst: boolean = parent.firstElement === element;
                let isVertical: boolean = parent.isVertical;
                if (isFirst && isVertical) { result.splice(0, 0, "top"); }
                else if (!isFirst && isVertical) { result.splice(0, 0, "bottom"); }
                else if (isFirst && !isVertical) { result.splice(0, 0, "left"); }
                else if (!isFirst && !isVertical) { result.splice(0, 0, "right"); }
                this.getDirLink(parent, result);
            }
        }
        private getElementByLink(link: Position[]): IBoxLayoutElement {
            if (link.length === 0)
                return null;
            let currentElement: IBoxLayoutElement = this.rootLayoutElement;
            for (let i: number = 0; i < link.length; i++) {
                switch (link[i]) {
                    case "top":
                        if (currentElement instanceof BoxLayoutContainer && (currentElement as BoxLayoutContainer).isVertical === true) {
                            currentElement = currentElement.firstElement;
                        }
                        else { return null; }
                        break;
                    case "bottom":
                        if (currentElement instanceof BoxLayoutContainer && (currentElement as BoxLayoutContainer).isVertical === true) {
                            currentElement = currentElement.secondElement;
                        }
                        else { return null; }
                        break;
                    case "left":
                        if (currentElement instanceof BoxLayoutContainer && (currentElement as BoxLayoutContainer).isVertical === false) {
                            currentElement = currentElement.firstElement;
                        }
                        else { return null; }
                        break;
                    case "right":
                        if (currentElement instanceof BoxLayoutContainer && (currentElement as BoxLayoutContainer).isVertical === false) {
                            currentElement = currentElement.secondElement;
                        }
                        else { return null; }
                        break;
                }
            }
            if (currentElement === this.rootLayoutElement) {
                return null;
            }
            return currentElement;
        }
        ////
        ////拖拽逻辑
        ////
        private dragInfo: DragInfo;
        private acceptTarget: IDragRender;
        private dragHandle(e: DragEvent): void {
            switch (e.type) {
                case DragEvent.STARTDRAG:
                    this.dragInfo = e.data as DragInfo;
                    this.acceptTarget = null;
                    this.attachDragEvent();
                    this.maskElement.render(this._area);
                    this.maskElement.setBounds(
                        this.rootLayoutElement.x,
                        this.rootLayoutElement.y,
                        this.rootLayoutElement.width,
                        this.rootLayoutElement.height);
                    break;
            }
        }
        private attachDragEvent(): void {
            window.addEventListener("mousemove", this.dragEventHandle, false);
            window.addEventListener("mouseup", this.dragEventHandle, true);
        }
        private detachDragEvent(): void {
            window.removeEventListener("mousemove", this.dragEventHandle, false);
            window.removeEventListener("mouseup", this.dragEventHandle, true);
        }
        private dragEventHandle(e: MouseEvent): void {
            e.stopPropagation();
            e.preventDefault();
            switch (e.type) {
                case "mousemove":
                    if (!this.dragAreaElement.root.parentElement) {
                        this.dragAreaElement.render(document.body);
                    }
                    let dragRender: IDragRender = this.getOneDragRenderWithMouseEvent(e);
                    if (dragRender) {
                        this.acceptTarget = dragRender.adjustDragInfo(e, this.dragInfo) ? dragRender : null;
                    }
                    else {
                        //如果没有dragRender则可能鼠标超出布局范围
                    }
                    this.dragAreaElement.setBounds(
                        this.dragInfo.dragRange.x,
                        this.dragInfo.dragRange.y,
                        this.dragInfo.dragRange.width,
                        this.dragInfo.dragRange.height
                    );
                    break;
                case "mouseup":
                    this.detachDragEvent();
                    this.dragAreaElement.removeFromParent();
                    this.maskElement.removeFromParent();
                    if (this.acceptTarget) {
                        this.acceptTarget.acceptDragInfo(this.dragInfo);
                    }
                    break;
            }
        }
        private getOneDragRenderWithMouseEvent(e: MouseEvent): IDragRender {
            function getAllElementRange(element: IBoxLayoutElement, result: Array<{ range: Rectangle, target: IBoxLayoutElement }>): void {
                if (element) {
                    if (element instanceof BoxLayoutContainer) {
                        getAllElementRange((element as IBoxLayoutContainer).firstElement, result);
                        getAllElementRange((element as IBoxLayoutContainer).secondElement, result);
                    }
                    else {
                        result.push({ range: new Rectangle(element.x, element.y, element.width, element.height), target: element });
                    }
                }
            }
            let localP: Point = MatrixUtil.globalToLocal(this._area, new Point(e.clientX, e.clientY));
            let allRange = new Array<{ range: Rectangle, target: IBoxLayoutElement }>();
            getAllElementRange(this.rootLayoutElement, allRange);
            for (let i: number = 0; i < allRange.length; i++) {
                if (allRange[i].range.containsPoint(localP)) {
                    return allRange[i].target.render;
                }
            }
            return null;
        }
        private getAllChildElement(element, result: IBoxLayoutElement[]): void {
            if (element) {
                if (element instanceof BoxLayoutContainer) {
                    this.getAllChildElement((element as IBoxLayoutContainer).firstElement, result);
                    this.getAllChildElement((element as IBoxLayoutContainer).secondElement, result);
                }
                else {
                    result.push(element);
                }
            }
        }

        private documentElement: DocumentElement;
        /**
         * 获取文档元素
         */
        public getDocumentElement(): DocumentElement {
            return this.documentElement;
        }
        /**
         * 创建一块文档区域，如果已经存在文档区域则直接返回该文档区
         * @param config 文档区的布局配置
         */
        public createDocumentElement(): DocumentElement {
            if (!this.documentElement) {
                this.documentElement = this._createDocumentElement();
                this.addBoxElementToRoot(this.documentElement, 'left');
            }
            return this.documentElement;
        }
        private _createDocumentElement(): DocumentElement {
            let element = new DocumentElement();
            let layout = (element.render as DocumentGroup).layout;
            layout.init(element.render.root, this.config.documentConfig);
            layout.addBoxElementToRoot(new BoxLayoutElement());
            return element
        }
        ////
        ////
        ////
        ////
        private panelDic: {[key:string]:ITabPanel} = {};
        /**注册面板(与面板ID相关的api会用到注册信息)*/
        public registPanel(panel: ITabPanel): void {
            this.panelDic[panel.id] = panel;
        }
        /**根据ID获取一个已注册的面板 */
        public getRegistPanelById(id: string): ITabPanel|null {
            return this.panelDic[id];
        }
        /**根据ID获取一个已经打开的面板 */
        public getPanelById(id:string):ITabPanel|null{
            let all=this.getAllOpenPanels();
            for(let panel of all)
                if(panel.id===id)
                    return panel;
            return null;
        }
        /**
         * 根据ID打开一个面板，如果面板已经打开则选中该面板并设置焦点
         * @param panelId 面板ID
         * @param oldSpace 是否尝试在原来的区域打开，如果布局发生较大的变化可能出现原始位置寻找错误的情况，默认true
         */
        public openPanelById(panelId: string, oldSpace: boolean = true): void {
            let panel = this.getRegistPanelById(panelId);
            if (!panel) {
                throw new Error("ID为 " + panelId + " 的面板未注册");
            }
            this.addPanel(panel,oldSpace);
        }
        /**
         * 添加一个panel，如果面板已经打开则选中该面板并设置焦点
         * @param panel 面板
         * @param oldSpace 是否尝试在原来的区域打开，如果布局发生较大的变化可能出现原始位置寻找错误的情况，默认true
         */
        public addPanel(panel: ITabPanel, oldSpace: boolean = true): void {
            if (!this.rootLayoutElement) {
                this.addBoxElementToRoot(new BoxLayoutElement());
            }
            let all: IBoxLayoutElement[] = [];
            this.getAllChildElement(this.rootLayoutElement, all);
            for (let i: number = 0; i < all.length; i++) {
                if (!(all[i] instanceof DocumentElement)) {
                    let group = (all[i].render as TabGroup);
                    for (let k: number = 0; k < group.panels.length; k++) {
                        if (group.panels[k] === panel) {
                            group.selectedIndex = k;
                            return;
                        }
                    }
                }
            }
            if (oldSpace) {
                //寻找原始位置添加面板
                let oldSpaceGroup: TabGroup = this.getOldSpace(panel.id);
                if (oldSpaceGroup) {
                    oldSpaceGroup.addPanel(panel);
                    if (oldSpaceGroup.ownerElement !== this.maxSizeElement) {
                        this.setMaxSize(null);
                    }
                    return;
                }
            }
            //未发现原始位置则在当前激活组打开
            let activeTabGroup = this.getActiveTabGroup();
            if (activeTabGroup) {
                activeTabGroup.addPanel(panel);
                return;
            }
            //未发现原始位置则选择一个合适的元素添加面板
            if (this.rootLayoutElement instanceof DocumentElement) {
                this.addBoxElementToRoot(new BoxLayoutElement());
            }
            let element = this.getFirstElement(this.rootLayoutElement);
            if (!element || element instanceof DocumentElement) {
                element = this.getSecondElement(this.rootLayoutElement);
            }
            if (element) {
                (element.render as TabGroup).addPanel(panel);
            }
        }
        /**
         * 根据Id关闭一个面板
         * @param panelId 面板ID
         */
        public closePanelById(panelId: string): void {
            let panel = this.getRegistPanelById(panelId);
            if (!panel) {
                throw new Error("ID为 " + panelId + " 的面板未注册");
            }
            this.removePanel(panel);
        }
        /**
         * 删除一个面板
         * @param panel 要删除的面板
         */
        public removePanel(panel: ITabPanel): void {
            let group=panel.ownerGroup;
            if(group){
                //缓存面板信息
                this.cachePanelInfo(panel);
                group.removePanel(panel);
                //移除区域
                if (group.panels.length === 0) {
                    this.removeBoxElement(group.ownerElement);
                }
            }
        }
        /**获取所有已打开的面板 */
        public getAllOpenPanels(): ITabPanel[] {
            let result: IBoxLayoutElement[] = [];
            this.getAllChildElement(this.rootLayoutElement, result);
            let panels: ITabPanel[] = [];
            result.forEach(element => {
                if (!(element instanceof DocumentElement)) {
                    panels = panels.concat((element.render as TabGroup).panels);
                }
            });
            return panels;
        }
        /**检查某个面板是否打开 */
        public checkPanelOpenedById(panelId: string): boolean {
            let panels = this.getAllOpenPanels();
            for (let i: number = 0; i < panels.length; i++) {
                if (panels[i].id === panelId) {
                    return true;
                }
            }
            return false;
        }
        /**获取所有的选项卡组 */
        public getAllTabGroup(): TabGroup[] {
            let all: IBoxLayoutElement[] = [];
            this.getAllChildElement(this.rootLayoutElement, all);
            let result: TabGroup[] = [];
            for (let i: number = 0; i < all.length; i++) {
                if (!(all[i] instanceof DocumentElement)) {
                    result.push(all[i].render as TabGroup);
                }
            }
            return result;
        }
        private getFirstElement(element: IBoxLayoutElement): IBoxLayoutElement {
            if (element instanceof BoxLayoutContainer) {
                return this.getFirstElement((element as BoxLayoutContainer).firstElement);
            }
            return element;
        }
        private getSecondElement(element: IBoxLayoutElement): IBoxLayoutElement {
            if (element instanceof BoxLayoutContainer) {
                return this.getFirstElement((element as BoxLayoutContainer).secondElement);
            }
            return element;
        }
        /**
         * 获取面板所在的布局元素
         * @param panelId 面板ID
         */
        public getElementByPanelId(panelId: string): IBoxLayoutElement {
            if (!this.rootLayoutElement) {
                return null;
            }
            let all: IBoxLayoutElement[] = [];
            this.getAllChildElement(this.rootLayoutElement, all);
            for (let i: number = 0; i < all.length; i++) {
                let group = (all[i].render as TabGroup);
                for (let k: number = 0; k < group.panels.length; k++) {
                    if (group.panels[k].id === panelId) {
                        return all[i];
                    }
                }
            }
            return null;
        }
        /**获取焦点管理器*/
        public get focusManager(): TabPanelFocusManager {
            return TabPanelFocusManager.getInstance();
        }
        /**焦点处理*/
        private focusHandler(e: MouseEvent): void {
            let panels = this.getAllOpenPanels();
            if (this.getDocumentElement()) {
                panels = panels.concat(this.getDocumentElement().layout.getAllOpenPanels());
            }
            for (let panel of panels) {
                if (panel.ownerGroup.selectedPanel == panel) {
                    let p = MatrixUtil.globalToLocal(panel.root, new Point(e.clientX, e.clientY));
                    if (this.focusManager.currentFocus != panel && p.x > 0 && p.y > 0 && p.x < panel.root.offsetWidth && p.y < panel.root.offsetHeight) {
                        this.focusManager.focus(panel);
                        return;
                    }
                }
            }
            let titleItems: ITitleRender[] = [];
            this.getAllTabGroup().forEach(group => {
                titleItems = titleItems.concat(group.tabBar.currentItems);
            })
            if (this.getDocumentElement()) {
                this.getDocumentElement().layout.getAllTabGroup().forEach(group => {
                    titleItems = titleItems.concat(group.tabBar.currentItems);
                });
            }
            for (let item of titleItems) {
                if (item.panel.ownerGroup.selectedPanel == item.panel) {
                    let p = MatrixUtil.globalToLocal(item.root, new Point(e.clientX, e.clientY));
                    if (this.focusManager.currentFocus != item.panel && p.x > 0 && p.y > 0 && p.x < item.root.offsetWidth && p.y < item.root.offsetHeight) {

                        this.focusManager.focus(item.panel);
                        return;
                    }
                }
            }
        }
        /**
         * 应用布局
         * @param config 布局数据
         */
        public applyLayoutConfig(config: any): void {
            let needRemoveList: ITabPanel[] = [];
            let praseConfig = (node): IBoxLayoutElement => {
                let element: IBoxLayoutElement;
                switch (node["type"]) {
                    case "BoxLayoutContainer":
                        element = new BoxLayoutContainer();
                        (element as BoxLayoutContainer).isVertical = node["isVertical"];
                        element.x = node["bounds"].x;
                        element.y = node["bounds"].y;
                        element.width = node["bounds"].width;
                        element.height = node["bounds"].height;
                        (element as BoxLayoutContainer).firstElement = praseConfig(node["firstElement"]);
                        (element as BoxLayoutContainer).firstElement.parentContainer = (element as BoxLayoutContainer);
                        (element as BoxLayoutContainer).secondElement = praseConfig(node["secondElement"]);
                        (element as BoxLayoutContainer).secondElement.parentContainer = (element as BoxLayoutContainer);
                        break;
                    case 'DocumentElement':
                        element = this.getDocumentElement();
                        if (!element) {
                            element = this._createDocumentElement();
                            this.documentElement = element as DocumentElement;
                        }
                        element.x = node["bounds"].x;
                        element.y = node["bounds"].y;
                        element.width = node["bounds"].width;
                        element.height = node["bounds"].height;
                        break;
                    case "BoxLayoutElement":
                        element = new BoxLayoutElement();
                        element.x = node["bounds"].x;
                        element.y = node["bounds"].y;
                        element.width = node["bounds"].width;
                        element.height = node["bounds"].height;
                        let panels: ITabPanel[] = [];
                        for (var i: number = 0; i < node["render"]["panels"].length; i++) {
                            let panelInfo = node["render"]["panels"][i];
                            let panel = this.config.panelSerialize.unSerialize(this, panelInfo);
                            //如果没有panel则用占位面板填充原来的位置，稍后删除
                            if (!panel) {
                                panel = new PlaceholderPanel();
                                needRemoveList.push(panel);
                            }
                            panels.push(panel);
                        }
                        (element.render as TabGroup).panels = panels;
                        (element.render as TabGroup).selectedIndex = node["render"]["selectedIndex"];
                        break;
                }
                return element;
            }
            if (this.rootLayoutElement) {
                //清理对panel的事件监听
                this.getAllTabGroup().forEach(group => {
                    group.dispose();
                });
                this.removeFromArae(this.rootLayoutElement);
                this._rootLayoutElement = null;
            }
            //重置焦点管理
            this.focusManager.reSet();
            let element = praseConfig(config);
            //删除丢失的panel
            needRemoveList.forEach(panel => { panel.ownerGroup.removePanel(panel) });
            this.addBoxElementToRoot(element);
        }
        /**
         * 获取元素下所有的面板
         * @param element 布局元素
         * @param result 面板
         */
        private getAllPanelByElement(element: IBoxLayoutElement): ITabPanel[] {
            let resultList:ITabPanel[]=[];
            if (element instanceof BoxLayoutContainer) {
                resultList=resultList.concat(this.getAllPanelByElement((element as BoxLayoutContainer).firstElement));
                resultList=resultList.concat(this.getAllPanelByElement((element as BoxLayoutContainer).secondElement));
            }
            else if (!(element instanceof DocumentElement)) {
                let panels = (element.render as TabGroup).panels;
                panels.forEach(panel => {
                    resultList.push(panel);
                });
            }
            return resultList;
        }
        /**
         * 获取当前布局信息
         */
        public getLayoutConfig(): any {
            let getConfig = (element: IBoxLayoutElement): any => {
                let config = {};
                if (element instanceof BoxLayoutContainer) {
                    config["type"] = "BoxLayoutContainer";
                    config["isVertical"] = (element as IBoxLayoutContainer).isVertical;
                    config["bounds"] = { x: element.x, y: element.y, width: element.width, height: element.height };
                    config["firstElement"] = getConfig((element as BoxLayoutContainer).firstElement);
                    config["secondElement"] = getConfig((element as BoxLayoutContainer).secondElement);
                }
                else if (element instanceof DocumentElement) {
                    config["type"] = "DocumentElement";
                    config["bounds"] = { x: element.x, y: element.y, width: element.width, height: element.height };
                }
                else {
                    config["type"] = "BoxLayoutElement";
                    config["bounds"] = { x: element.x, y: element.y, width: element.width, height: element.height };
                    let renderConfig: any = {};
                    let group: TabGroup = element.render as TabGroup;
                    renderConfig["selectedIndex"] = group.selectedIndex;
                    renderConfig["panels"] = [];
                    for (var i: number = 0; i < group.panels.length; i++) {
                        let panelInfo = this.config.panelSerialize.serialize(this, group.panels[i]);
                        renderConfig["panels"].push(panelInfo);
                    }
                    config["render"] = renderConfig;
                }
                return config;
            }
            if (this.rootLayoutElement) {
                return getConfig(this.rootLayoutElement);
            }
            return null;
        }
    }
}