/// <reference path="../../data/EventDispatcher.ts" />
namespace boxlayout {
    /**
     * @author 杨宁
     */
    export class TabBar extends EventDispatcher implements IRender {
        constructor() {
            super();
            this.itemEventHandle = this.itemEventHandle.bind(this);

            this._root = document.createElement('div');
            this._root.className='title';
            this._root.style.zIndex = '1';

            this.itemContainer = document.createElement('div');
            this.itemContainer.className='title-item-area';
            this._root.appendChild(this.itemContainer);

            this.appendContainer = document.createElement('div');
            this.appendContainer.className='title-tools-area';
            this._root.appendChild(this.appendContainer);
        }
        public minHeight:number=0;
        public minWidth:number=0;
        private _titleRenderFactory: ITitleRenderFactory;
        public set titleRenderFactory(v: ITitleRenderFactory) {
            if (this._titleRenderFactory != v) {
                this._titleRenderFactory = v;
                this.reDeployItems();
                this.commitSelected();
            }
        }
        public get titleRenderFactory(): ITitleRenderFactory {
            return this._titleRenderFactory;
        }
        private itemContainer: HTMLDivElement;
        private appendContainer: HTMLDivElement;
        private _root: HTMLElement;
        public get root(): HTMLElement {
            return this._root;
        }
        public _panels: ITabPanel[] = [];
        public set panels(v: ITabPanel[]) {
            this._panels = v;
            this.reDeployItems();
            this.commitSelected();
        }
        public get panels(): ITabPanel[] {
            return this._panels;
        }
        private _selectedIndex: number = NaN;
        public set selectedIndex(v: number) {
            if (this._selectedIndex != v) {
                this._selectedIndex = v;
                this.commitSelected();
            }
        }
        public get selectedIndex(): number {
            return this._selectedIndex;
        }
        private setSelected(v: number): void {
            this._selectedIndex = v;
            this.commitSelected();
            this.dispatchEvent(new TabBarEvent(TabBarEvent.CHANGE));
        }
        private container: HTMLElement;
        public render(container: HTMLElement): void {
            this.container = container;
            this.container.appendChild(this.root);
        }
        public removeFromParent(): void {
            this.root.remove();
        }
        private bx: number;
        private by: number
        private bw: number;
        private bh: number;
        public getBounds(): { x: number, y: number, width: number, height: number } {
            return { x: this.bx, y: this.by, width: this.bw, height: this.root.offsetHeight };
        }
        public setBounds(x: number, y: number, width: number, height?: number): void {
            this.root.style.width = width + 'px';
            //高度通过样式来控制
            // this.root.style.height = height + 'px';
            this.root.style.left = x + 'px';
            this.root.style.top = y + 'px';
            this.bx = x;
            this.by = y;
            if (this.bw !== width || this.bh !== height) {
                this.bw = width;
                this.bh = height;
                this.updateItemDisplay();
            }
        }
        public currentItems: ITitleRender[] = [];
        private reDeployItems(): void {
            this.currentItems.forEach((item) => {
                item.removeFromParent();
                item.root.removeEventListener("mousedown", this.itemEventHandle);
                item.root.removeEventListener("click", this.itemEventHandle);
                item.root.removeEventListener("dblclick", this.itemEventHandle);
            });
            this.currentItems = [];
            if (this.titleRenderFactory) {
                for (let i: number = 0; i < this._panels.length; i++) {
                    let item = this.titleRenderFactory.createTitleRender();
                    item.render(this.itemContainer);
                    item.panel = this._panels[i];
                    item.root.addEventListener("mousedown", this.itemEventHandle);
                    item.root.addEventListener("click", this.itemEventHandle);
                    item.root.addEventListener("dblclick", this.itemEventHandle);
                    this.currentItems.push(item);
                }
                this.updateItemDisplay();
            }
        }
        private startP: Point = new Point();
        private cancelClick: boolean = false;
        private targetPanel: ITabPanel;
        private itemEventHandle(e: MouseEvent): void {
            switch (e.type) {
                case "mousedown":
                    this.startP.x = e.clientX;
                    this.startP.y = e.clientY;
                    this.cancelClick = false;
                    let currentElement = e.currentTarget;
                    for (let i: number = 0; i < this.currentItems.length; i++) {
                        if (this.currentItems[i].root === currentElement) {
                            this.targetPanel = this.panels[i]
                            break;
                        }
                    }
                    if(this.targetPanel.draggable){
                        window.addEventListener("mousemove", this.itemEventHandle);
                        window.addEventListener("mouseup", this.itemEventHandle);
                    }
                    break;
                case "mousemove":
                    if (Math.abs(e.clientX - this.startP.x) > 3 || Math.abs(e.clientY - this.startP.y) > 3) {
                        window.removeEventListener("mousemove", this.itemEventHandle);
                        window.removeEventListener("mouseup", this.itemEventHandle);
                        this.cancelClick = true;
                        this.dispatchEvent(new TabBarEvent(TabBarEvent.BEGINDRAG, this.targetPanel));
                    }
                    break;
                case "mouseup":
                    window.removeEventListener("mousemove", this.itemEventHandle);
                    window.removeEventListener("mouseup", this.itemEventHandle);
                    break;
                case "click":
                    if (!this.cancelClick) {
                        let currentElement = e.currentTarget;
                        for (let i: number = 0; i < this.currentItems.length; i++) {
                            if (this.currentItems[i].root === currentElement){
                                if(this.selectedIndex !== i){
                                    this.setSelected(i);
                                }
                            }
                        }
                    }
                    break;
                case "dblclick":
                    if (!this.cancelClick) {
                        this.dispatchEvent(new TabBarEvent(TabBarEvent.ITEMDOUBLECLICK));
                    }
                    break;
            }
        }
        private currentHeaderRender: IRender;
        private commitSelected(): void {
            if (this.currentHeaderRender) {
                this.currentHeaderRender.removeFromParent();
            }
            for (let i: number = 0; i < this.currentItems.length; i++) {
                if (i === this._selectedIndex) {
                    this.currentItems[i].selected = true;
                    this.currentHeaderRender = this.panels[i].getToolsRender();
                }
                else {
                    this.currentItems[i].selected = false;
                }
            }
            if (this.currentHeaderRender) {
                this.currentHeaderRender.render(this.appendContainer);
            }
        }
        public refresh(): void {
            this.currentItems.forEach(item => {
                item.updateDisplay();
            });
        }
        private updateItemDisplay(): void {
            let size: number = Math.min(this.bw / this.currentItems.length, 100);
            for (let i: number = 0; i < this.currentItems.length; i++) {
                let item: ITitleRender = this.currentItems[i];
                item.setBounds(i * size, 0, size, this.root.clientHeight)
            }
        }
    }
}