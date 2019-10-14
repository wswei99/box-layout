namespace boxlayout {
    /**
     * 弹出菜单
     * @author 杨宁
     */
    export class PopupMenu {
        constructor() {
            this.mouseEventHandle = this.mouseEventHandle.bind(this);
            this.itemHandle = this.itemHandle.bind(this);
        }
        private static instance: PopupMenu;
        /**
         * 弹出菜单
         * @param target 要弹出菜单的目标对象
         * @param menus 菜单数据
         * @param callback 回调
         */
        public static popup(target: HTMLElement, menus: any[], callback: (id: string) => void): void {
            if (!this.instance) {
                this.instance = new PopupMenu();
            }
            this.instance.popup(target, menus, callback);
        }
        private menuContainer: HTMLElement;
        private callback: (id: string) => void;
        /**
         * 弹出菜单
         * @param target 要弹出菜单的目标对象
         * @param menus 菜单数据
         * @param callback 回调
         */
        public popup(target: HTMLElement, menus: any[], callback: (id: string) => void): void {
            this.removePopup();
            if (menus && menus.length > 0) {
                this.callback = callback;
                this.menuContainer = document.createElement('div');
                this.menuContainer.style.position = 'absolute';
                this.menuContainer.style.minWidth = '80px';
                this.menuContainer.style.padding = '3px 0px';
                this.menuContainer.style.borderRadius = '5px';
                this.menuContainer.style.background = '#f3f3f3';
                this.menuContainer.style.boxShadow = '2px 2px 10px #111111';
                window.addEventListener('mousedown', this.mouseEventHandle, true);
                document.body.appendChild(this.menuContainer);
                for (let i: number = 0; i < menus.length; i++) {
                    let item: HTMLDivElement = document.createElement('div');
                    item.innerText = menus[i]['label'];
                    item.style.fontSize = '13px';
                    item.style.padding = '0px 8px';
                    item.style.color='#000000';
                    item['__popupid'] = menus[i]['id'];
                    this.menuContainer.appendChild(item);
                    item.addEventListener('mouseenter', this.itemHandle, true);
                    item.addEventListener('mouseleave', this.itemHandle, true);
                    item.addEventListener('click', this.itemHandle, true);
                    if (i !== menus.length - 1) {
                        let separator: HTMLElement = document.createElement('div');
                        separator.style.height = '1px';
                        separator.style.margin = '3px 0px';
                        separator.style.background = 'rgb(216, 216, 216)';
                        this.menuContainer.appendChild(separator);
                    }
                }
                let globalP = MatrixUtil.localToGlobal(target, new Point(target.offsetWidth / 2 / target.offsetHeight / 2));
                let offset:number=10;
                let w:number=this.menuContainer.offsetWidth;
                let h:number=this.menuContainer.offsetHeight;
                let outW:number=document.body.offsetWidth;
                let outH:number=document.body.offsetHeight;
                let x:number=globalP.x+offset;
                let y:number=globalP.y+offset;
                if(w+globalP.x+offset>outW){
                    x=globalP.x-offset-w;
                }
                if(h+globalP.y+offset>outH){
                    y=globalP.y-offset-h;
                }
                this.menuContainer.style.left = x + 'px';
                this.menuContainer.style.top = y + 'px';
            }
        }
        private itemHandle(e: MouseEvent): void {
            switch (e.type) {
                case 'mouseenter':
                    (e.currentTarget as HTMLElement).style.background = '#4698fb';
                    break;
                case 'mouseleave':
                    (e.currentTarget as HTMLElement).style.background = null;
                    break;
                case 'click':
                    this.removePopup();
                    this.callback(e.currentTarget['__popupid']);
                    break;
            }
        }
        private removePopup(): void {
            if (this.menuContainer && this.menuContainer.parentElement) {
                window.removeEventListener('mousedown', this.mouseEventHandle, true);
                document.body.removeChild(this.menuContainer);
            }
        }
        private mouseEventHandle(e: MouseEvent): void {
            switch (e.type) {
                case 'mousedown':
                    let p = MatrixUtil.globalToLocal(this.menuContainer, new Point(e.clientX, e.clientY));
                    if (p.x < 0 || p.y < 0 || p.x > this.menuContainer.offsetWidth || p.y > this.menuContainer.offsetHeight) {
                        this.removePopup();
                    }
                    break;
            }
        }
    }
}