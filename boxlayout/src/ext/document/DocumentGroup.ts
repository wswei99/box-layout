namespace boxlayout {
    /**
     * 文档区视图
     * @author 杨宁
     */
    export class DocumentGroup extends boxlayout_event.EventDispatcher implements IDragRender {
        private static instance:DocumentGroup;
        public static getInstance():DocumentGroup{
            if(!this.instance){
                this.instance=new DocumentGroup();
            }
            return this.instance;
        }
        constructor() {
            super();
            this._root = document.createElement('div');
            this._root.style.position = "absolute";
            this._root.style.boxSizing = 'border-box';
            this._root.style.overflow = 'hidden';
            this._root.style.zIndex = '0';
            this._layout = new BoxLayout();
        }
        public get minWidth():number{
            let size = 0;
            this.layout.getAllOpenPanels().forEach(panel => {
                size = Math.max(panel.minWidth,size);
            })
            return size;
        }
        public set minWidth(v:number){
        }
        public get minHeight():number{
            let size = 0;
            this.layout.getAllOpenPanels().forEach(panel => {
                size = Math.max(panel.minHeight,size);
            })
            return size;
        }
        public set minHeight(v:number){
        }
        private _layout: BoxLayout;
        public get layout(): BoxLayout {
            return this._layout;
        }
        private _root: HTMLElement;
        public get root(): HTMLElement {
            return this._root;
        }
        private _ownerElement: IBoxLayoutElement;
        public get ownerElement(): IBoxLayoutElement {
            return this._ownerElement;
        }
        public set ownerElement(v: IBoxLayoutElement) {
            this._ownerElement = v;
        }
        public adjustDragInfo(e: MouseEvent, info: DragInfo): boolean {
            this.adjustDragInfo_tabGroup(e, info);
            return true;
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
            let globalP: Point = MatrixUtil.localToGlobal(this.container, new Point(this.bx, this.by));
            if (obj['left'] && obj['top']) {
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
                    let targetElement: DocumentElement = v.otherData["targetElement"];
                    let dir: string = v.otherData["dir"];
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
                    (newElement.render as TabGroup).dispatchEvent(new TabGroupEvent(TabGroupEvent.PANEL_DRAG, startPanel));
                    break;
            }
        }
        private container: HTMLElement;
        public render(container: HTMLElement): void {
            this.container = container;
                this.container.appendChild(this.root);
        }
        public removeFromParent(): void {
            this.root.remove();
        }
        private bw: number;
        private bh: number;
        private bx: number;
        private by: number;
        public setBounds(x: number, y: number, width: number, height: number): void {
            if (this.bw !== width || this.bh !== height) {
                this.root.style.width = width + 'px';
                this.root.style.height = height + 'px';
                this.bw = width;
                this.bh = height;
            }
            this.bx = x;
            this.by = y;
            this.root.style.left = x + 'px';
            this.root.style.top = y + 'px';
        }
    }
}