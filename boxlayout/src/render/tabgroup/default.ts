namespace boxlayout {
    /**
     * 默认标题呈现器
     * @author 杨宁
     */
    export class DefaultTitleRender implements ITitleRender {
        private titleElement: HTMLDivElement;
        private iconElement: HTMLImageElement;
        private closeBtn:HTMLElement;
        constructor() {
            this._root = document.createElement('div');
            this._root.className = 'title-item';
            this._root.style.overflow = "hidden";
            this._root.style.display = "flex";
            this._root.style.paddingLeft=this._root.style.paddingRight='6px';
            this.iconElement = document.createElement('img');
            this.iconElement.style.marginRight = "6px";
            this.iconElement.style.flexGrow = "1";
            this.iconElement.style.pointerEvents = "none";
            this.iconElement.style.alignSelf = 'center';
            this._root.appendChild(this.iconElement);
            this.titleElement = document.createElement('div');
            this.titleElement.className = 'title-font';
            this.titleElement.style.whiteSpace = "nowrap";
            this.titleElement.style.textOverflow = "ellipsis";
            this.titleElement.style.overflow = "hidden";
            this._root.appendChild(this.titleElement);
            this.closeBtn = document.createElement('a');
            this.closeBtn.style.width = '20px';
            this.closeBtn.style.height = '100%';
            this.closeBtn.style.cursor = 'pointer';
            this.closeBtn.style.background = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='3 3 16 16'%3E%3Cpath fill='%23c0c0c0' d='M12.597 11.042l2.803 2.803-1.556 1.555-2.802-2.802L8.239 15.4l-1.556-1.555 2.802-2.803-2.802-2.803 1.555-1.556 2.804 2.803 2.803-2.803L15.4 8.239z'/%3E%3C/svg%3E") 50% no-repeat`;
            this.root.appendChild(this.closeBtn);
            this.closeBtn.addEventListener('click', () => {
                this.panel.ownerGroup.$execCommand('close');
            })
        }
        public minHeight: number = 0;
        public minWidth: number = 0;
        private _root: HTMLElement;
        public get root(): HTMLElement {
            return this._root;
        }
        private _panel: ITabPanel;
        public set panel(v: ITabPanel) {
            this._panel = v;
            this.updateDisplay();
        }
        public get panel(): ITabPanel {
            return this._panel;
        }
        private _selected: boolean = false;
        public get selected(): boolean {
            return this._selected;
        }
        public set selected(v: boolean) {
            this._selected = v;
            this.commitSelected();
        }
        private container: HTMLElement;
        public render(container: HTMLElement): void {
            this.container = container;
            this.container.appendChild(this.root);
        }
        public removeFromParent(): void {
            this.root.remove();
        }
        public updateDisplay(): void {
            this.titleElement.textContent = this._panel.title;
            var iconUrl = this._panel.icon;
            this.iconElement.src = iconUrl;
            var retinaIconUrl = '';
            var lastpointIndex = iconUrl.lastIndexOf('.');
            if (lastpointIndex != -1) {
                var ext = iconUrl.slice(lastpointIndex + 1);
                if (ext.toLocaleLowerCase() == 'png') {
                    retinaIconUrl = iconUrl.slice(0, lastpointIndex) + '@2x.png 2x';
                }
            }
            if (retinaIconUrl) {
                this.iconElement.srcset = retinaIconUrl;
            }
            this.closeBtn.hidden=!this._panel.closeable;
        }
        private commitSelected():void{
            if (this._selected) {
                this.root.className = 'title-item selected';
                this.titleElement.className = 'title-font selected';
            }
            else {
                this.root.className = 'title-item';
                this.titleElement.className = 'title-font';
            }
        }
        private bx: number;
        private by: number;
        private bw: number;
        private bh: number;
        public getBounds(): { x: number, y: number, width: number, height: number } {
            return { x: this.bx, y: this.by, width: this.root.offsetWidth, height: this.root.offsetHeight };
        }
        public setBounds(x: number, y: number, width: number, height: number): void {
            this.bx = x;
            this.by = y;
            this.bw = width;
            this.bh = height;
            this.root.style.height=height+"px";
        }
    }
    /**
     * 默认标题呈现器工厂
     * @author 杨宁
     */
    export class DefaultTitleRenderFactory implements ITitleRenderFactory {
        createTitleRender(): ITitleRender {
            return new DefaultTitleRender();
        }
    }

}