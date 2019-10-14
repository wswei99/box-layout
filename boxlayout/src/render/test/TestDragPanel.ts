/// <reference path="../../data/DragInfo.ts" />
/// <reference path="../../data/EventDispatcher.ts" />
namespace boxlayout {
    //测试拖拽面板
    export class TestDragPanel extends boxlayout_event.EventDispatcher implements IDragRender {
        constructor() {
            super();
            this._root = document.createElement('div');
            this._root.style.position = 'absolute';
            this._root.style.border = '2px solid rgb(41, 50, 59)';
            this._root.style.background = '#232a32';
            this._root.innerText=Math.random().toString();
            this.mouseHandle = this.mouseHandle.bind(this);
        }
        public minHeight:number=0;
        public minWidth:number=0;
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
            let p: Point = MatrixUtil.globalToLocal(this._root, new Point(e.clientX, e.clientY));
            let margin: number = 50;
            let dir: string;
            let obj: any = {};
            obj['left'] = p.x < margin;
            obj['right'] = p.x > this.bw - margin;
            obj['top'] = p.y < margin;
            obj['bottom'] = p.y > this.bh - margin;
            obj['center'] = (!obj['left'] && !obj['right'] && !obj['bottom'] && !obj['top']);
            let globalP: Point = MatrixUtil.localToGlobal(this.root, new Point());
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
            info.otherData["dir"]=dir;
            info.otherData["target"]=this.ownerElement;

            return true;
        }
        public acceptDragInfo(v: DragInfo): void {
            if(v.otherData["dir"]!=="center"){
                this.ownerElement.ownerLayout.addBoxElement(v.otherData["target"],v.otherData["start"],v.otherData["dir"]);
            }
        }
        private container: HTMLElement;
        public render(container: HTMLElement): void {
            this.container = container;
            this.container.appendChild(this.root);
            this.root.addEventListener("mousedown", this.mouseHandle);
        }
        private mouseHandle(e: MouseEvent): void {
            if (e.button === 0){
                let info:DragInfo=new DragInfo();
                info.otherData["start"]=this.ownerElement;
                this.dispatchEvent(new DragEvent(DragEvent.STARTDRAG,info));
            }
        }
        public removeFromParent(): void {
            if (this.container) {
                this.container.removeChild(this.root);
                this.root.removeEventListener("mousedown", this.mouseHandle);
            }
        }
        private bx: number;
        private by: number;
        private bw: number;
        private bh: number;
        public setBounds(x: number, y: number, width: number, height: number): void {
            this.bx = x;
            this.by = y;
            this.bw = width;
            this.bh = height;
            this.root.style.left = x + 'px';
            this.root.style.top = y + 'px';
            this.root.style.width = (width - 4) + 'px';
            this.root.style.height = (height - 4) + 'px';
        }
    }
}