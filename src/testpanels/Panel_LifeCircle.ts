export class Panel_LifeCircle extends boxlayout.TabPanel {
    public static ID = 'Panel_Three';
    private headerRender: HeaderRender;
    constructor() {
        super();
        this.id = Panel_LifeCircle.ID;
        this.title = '面板-周期测试';
        this.priorityLevel = 1;
        this.icon = require("../assets/icon.svg");
        this.headerRender = new HeaderRender();
        this.headerRender.root.addEventListener('click', () => {
            this.element.innerText = '';
        });
        this.minHeight = this.minWidth = 150;
    }
    //重写
    public getToolsRender(): boxlayout.IRender {
        return this.headerRender;
    }
    private element: HTMLDivElement;
    //重写 
    public onCreate(container: HTMLElement): void {
        this.element = document.createElement('div');
        this.element.style.color = "#aaaaaa";
        this.element.style.fontSize = "12px";
        this.element.style.lineHeight = "12px";
        container.appendChild(this.element);
        this.element.innerText = 'create -> ';
    }
    //重写
    public onAdd(): void {
        this.element.innerText += 'add -> ';
    }
    //重写
    public onRemoving(): boolean {
        this.element.innerText += 'removing -> ';
        // return true;
        return true;
    }
    public onRemove(): void {
        this.element.innerText += 'remove -> ';
    }
    //重写
    public onResize(width: number, height: number): void {
        if (this.element) {
            this.element.style.width = width + 'px';
            this.element.style.height = height + 'px';
        }
    }
}

/**测试选项卡头部渲染器 */
class HeaderRender implements boxlayout.IRender {
    public root: HTMLButtonElement;
    constructor() {
        this.root = document.createElement('button');
        this.root.textContent = "清除";
    }

    public minHeight: number = 0;
    public minWidth: number = 0;
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