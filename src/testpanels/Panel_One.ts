export class Panel_One extends boxlayout.TabPanel {
    public static ID='Panel_One';
    private headerRender: HeaderRender;
    constructor() {
        super();
        this.id=Panel_One.ID;
        this.title=Panel_One.ID;
        this.icon=require("../assets/icon.svg");
        this.headerRender = new HeaderRender();
        this.headerRender.root.addEventListener('click', () => {
            this.element.innerText = this.element.innerText + `\n${Panel_One.ID}`;
        });
        this.minHeight=this.minWidth=200;
    }
    private element: HTMLDivElement;
    //重写 以实现自定义面板
    protected renderContent(container: HTMLElement): void {
        // let div=document.createElement('div');
        // container.appendChild(div);
        // div.draggable=true;
        // div.ondragstart=(e)=>{
        // }
        // container.ondragover=(e)=>{
        //     e.dataTransfer.dropEffect='copy';
        //     e.preventDefault();
        // }
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
    
    public minHeight:number=0;
    public minWidth:number=0;
    constructor() {
        this.root = document.createElement('button');
        this.root.textContent = "click me";
    }
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