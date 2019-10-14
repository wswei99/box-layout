/// <reference path="../tabgroup/TabPanel.ts" />
namespace boxlayout {
    /**
     * 测试TabPanel
     * @author 杨宁
     *  */
    export class TestTabPanel extends TabPanel {
        private headerRender: HeaderRender;
        constructor() {
            super();
            this.id=('testPanel');
            this.title=('TEST');
            this.headerRender = new HeaderRender();
            this.headerRender.root.addEventListener('click', () => {
                this.element.innerText = this.element.innerText + "\nclick!";
            });
        }
        private element: HTMLDivElement;
        //重写 以实现自定义面板
        protected renderContent(container: HTMLElement): void {
            this.element = document.createElement('div');
            // this.element.style.background="#666666"
            this.element.style.color = "#ffffff";
            container.appendChild(this.element);
        }
        //重写 以实现选项卡头部自定义内容
        public getHeaderRender(): IRender {
            return this.headerRender;
        }
        //重写 做相关处理
        protected resize(newWidth: number, newHeight: number): void {
            if (this.element) {
                this.element.style.width = newWidth + 'px';
                this.element.style.height = newHeight + 'px';
            }
        }
    }
    /**测试选项卡头部渲染器 */
    export class HeaderRender implements IRender {
        public root: HTMLButtonElement;
        constructor() {
            this.root = document.createElement('button');
            this.root.textContent = "click me";
        }
        public minHeight:number=0;
        public minWidth:number=0;
        private container: HTMLElement;
        render(container: HTMLElement): void {
            this.container = container;
            this.container.appendChild(this.root);
        }
        removeFromParent(): void {
            if (this.container) {
                this.container.removeChild(this.root);
            }
        }
        setBounds(x: number, y: number, width: number, height: number): void {
            //选项卡头部渲染器不需要处理此函数
        }

    }
}