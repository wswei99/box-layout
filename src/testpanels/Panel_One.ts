export class Panel_One extends boxlayout.TabPanel {
    public static ID='Panel_One';
    private callback:Function;
    private testData:{id:string,label:string}[];
    constructor(callback:(type:string)=>{},testData:{id:string,label:string}[]) {
        super();
        this.testData=testData;
        this.callback=callback;
        this.id=Panel_One.ID;
        this.title='面板-测试';
        this.icon=require("../assets/icon.svg");
        this.minHeight=this.minWidth=200;
        this.closeable=false;
    }
    //重写
    public onCreate(container: HTMLElement): void {
        for(var {id,label} of this.testData){
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