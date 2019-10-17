export class Panel_Doc extends boxlayout.TabPanel {
    public static ID='Panel_Doc'
    private headerRender: HeaderRender;
    constructor() {
        super();
        this.id=Panel_Doc.ID;
        this.title='面板-文档';
        this.icon=require("../assets/icon.svg");
        this.headerRender = new HeaderRender();
        this.headerRender.root.addEventListener('click', () => {
            let input=document.createElement('input');
            this.element.appendChild(input);
        });
    }
    private element: HTMLElement;
    //重写
    public onCreate(container: HTMLElement): void {
        super.onCreate(container);
        this.element = document.createElement('div');
        this.element.style.background="#2b2b2b"
        this.element.style.color = "#ffffff";
        container.appendChild(this.element);

        ////test
        // this.element = document.createElement('iframe');
        // this.element['src'] = "https://activetheory.net/home";
        // this.element.style.background="#666666"
        // this.element.style.color="#ffffff";
        // container.appendChild(this.element);
    }
    //重写
    public getToolsRender(): boxlayout.IRender {
        return this.headerRender;
    }
    //重写
    public onResize(width: number, height: number): void {
        super.onResize(width,height);
        if (this.element) {
            this.element.style.width = width + 'px';
            this.element.style.height = height + 'px';
        }
    }
}
/**测试选项卡头部渲染器 */
export class HeaderRender implements boxlayout.IRender {
    public root: HTMLButtonElement;
    constructor() {
        this.root = document.createElement('button');
        this.root.textContent = "toolbar";
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