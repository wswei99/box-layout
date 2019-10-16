export class Panel_One extends boxlayout.TabPanel {
    public static ID='Panel_One';
    private callback:Function;
    constructor(callback:(type:string)=>{}) {
        super();
        this.callback=callback;
        this.id=Panel_One.ID;
        this.title='面板-测试';
        this.icon=require("../assets/icon.svg");
        this.minHeight=this.minWidth=200;
        this.closeable=false;
    }
    //重写 以实现自定义面板
    protected renderContent(container: HTMLElement): void {
        let testData=[
            {id:'reset',label:'重置布局'},
            {id:'add_doc',label:'在文档区添加一个面板'},
            {id:'toggle',label:'打开/关闭 面板-3'},
        ]
        for(var {id,label} of testData){
            let btn=document.createElement('button');
            btn.id=id;
            btn.innerText=label;
            container.appendChild(btn);
            btn.onclick=(e:MouseEvent)=>{
                this.callback((e.currentTarget as HTMLButtonElement).id);
            }
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
        this.root.textContent = "toolbar";
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