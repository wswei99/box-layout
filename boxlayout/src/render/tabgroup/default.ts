namespace boxlayout {
    /**
     * 默认标题呈现器
     * @author 杨宁
     */
    export class DefaultTitleRender implements ITitleRender {
        private titleElement: HTMLSpanElement;
        private iconElement: HTMLImageElement;
        private closeBtn:HTMLElement;
        constructor() {
            this._root = document.createElement('div');
            this._root.className = 'title-item';

            this.iconElement = document.createElement('img');
            this.iconElement.className='title-icon';
            this._root.appendChild(this.iconElement);

            this.titleElement = document.createElement('span');
            this.titleElement.className = 'title-font';
            this._root.appendChild(this.titleElement);

            this.closeBtn = document.createElement('a');
            this.closeBtn.className='title-closebtn';
            this.root.appendChild(this.closeBtn);
            this.closeBtn.addEventListener('click',this.closeHandler)
        }
        public minHeight: number = 0;
        public minWidth: number = 0;
        private _root: HTMLElement;
        public get root(): HTMLElement {
            return this._root;
        }
        private _panel: TabPanel;
        public set panel(v: ITabPanel) {
            this._panel = v as TabPanel;
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
        private closeHandler=()=>{
            if(this._panel.onRemoving()){
                let group = this.panel.ownerGroup;
                //删除
                this.panel.ownerLayout.removePanel(this.panel);
                //重置焦点
                if (group.panels.length > 0) {
                    TabPanelFocusManager.getInstance().focus(group.selectedPanel);
                }
                else {
                    TabPanelFocusManager.getInstance().focus(null);
                }
            }
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