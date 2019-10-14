export class Panel_Three extends boxlayout.TabPanel {
    public static ID='Panel_Three';
    private headerRender: HeaderRender;
    constructor() {
        super();
        this.id=Panel_Three.ID;
        this.title=Panel_Three.ID;
        this.priorityLevel=1;
        // this.icon=require("../assets/icon.svg");
        this.headerRender = new HeaderRender();
        this.headerRender.root.addEventListener('click', () => {
            this.element.innerText = this.element.innerText + `\n${Panel_Three.ID}`;
        });
        
        this.minHeight=this.minWidth=150;
    }
    private element: HTMLDivElement;
    //重写 以实现自定义内容
    protected renderContent(container: HTMLElement): void {
        this.element = document.createElement('div');
        // this.element.style.background="#666666"
        this.element.style.color = "#ffffff";
        container.appendChild(this.element);
    }
    //重写 以实现选项卡头部自定义内容
    public getToolsRender(): boxlayout.IRender {
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
export class HeaderRender implements boxlayout.IRender {
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