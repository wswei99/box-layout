export class Panel_Test extends boxlayout.TabPanel {
    public static ID='Panel_Test';
    private callback:Function;
    private testData:{id:string,label:string}[];
    constructor(callback:(type:string)=>{},testData:{id:string,label:string}[]) {
        super();
        this.testData=testData;
        this.callback=callback;
        this.id=Panel_Test.ID;
        this.title='面板-测试';
        this.icon=require("../assets/icon.svg");
        this.minHeight=this.minWidth=200;
        this.closeable=false;
        this.draggable=false;
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