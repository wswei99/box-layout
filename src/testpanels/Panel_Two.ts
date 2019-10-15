export class Panel_Two extends boxlayout.TabPanel {
    public static ID='Panel_Two';
    private headerRender: HeaderRender;
    constructor() {
        super();
        this.id=Panel_Two.ID;
        this.title=Panel_Two.ID;
        this.icon=require("../assets/icon.svg");
        this.headerRender = new HeaderRender();
        this.headerRender.root.addEventListener('click', () => {
            this.element.innerText = this.element.innerText + `\n${Panel_Two}`;
        });
        
        this.minHeight=this.minWidth=200;
        this.closeable=false;
    }
    private element: HTMLIFrameElement;
    //重写 以实现自定义内容
    protected renderContent(container: HTMLElement): void {
        // this.element = document.createElement('iframe');
        // this.element.src = "http://gc.hgame.com/home/game/appid/100389/gameid/100416/sr/2/pt/179";
        // this.element.style.background="#666666"
        // this.element.style.color="#ffffff";
        // container.appendChild(this.element);
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