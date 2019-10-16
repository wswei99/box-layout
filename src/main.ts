import { Panel_One } from "./testpanels/Panel_One";
import { Panel_Two } from "./testpanels/Panel_Two";
import { Panel_Three } from "./testpanels/Panel_Three";
import { Panel_Doc } from "./testpanels/Panel_Doc";
onload = () => {
    new Main().start();
}
class Main {
    //默认布局配置信息
    private defaultConfig = { "type": "BoxLayoutContainer", "isVertical": false, "bounds": { "x": 0, "y": 0, "width": 1278, "height": 740 }, "firstElement": { "type": "BoxLayoutElement", "bounds": { "x": 0, "y": 0, "width": 251, "height": 740 }, "render": { "selectedIndex": 0, "panels": [{ "panelID": "Panel_One", "closeable": false }] } }, "secondElement": { "type": "BoxLayoutContainer", "isVertical": true, "bounds": { "x": 252, "y": 0, "width": 1026, "height": 740 }, "firstElement": { "type": "DocumentElement", "bounds": { "x": 252, "y": 0, "width": 1026, "height": 534 } }, "secondElement": { "type": "BoxLayoutElement", "bounds": { "x": 252, "y": 535, "width": 1026, "height": 205 }, "render": { "selectedIndex": 1, "panels": [{ "panelID": "Panel_Two", "closeable": true }, { "panelID": "Panel_Three", "closeable": true }] } } } }
    private layout: boxlayout.BoxLayout;
    public start() {
        //阻止选择
        document.onselectstart = function () { return false; };
        let container = document.getElementById('container');
        this.layout = new boxlayout.BoxLayout();
        //初始化布局
        this.layout.init(
            container,
            {
                //标题呈现器工厂
                titleRenderFactory: new boxlayout.DefaultTitleRenderFactory(),
                //面板序列化器
                panelSerialize: new boxlayout.DefaultPanelSerialize(),
                //文档区配置
                documentConfig: {
                    titleRenderFactory: new CustomRenderFactory(),
                    panelSerialize: new CustomDocumentPanelSerialize()
                }
            }
        );
        this.layout.registPanel(new Panel_One(this.testHandler));
        //注册面板（注意：在应用布局配置或添加、打开面板时确保相关面板已经注册）
        this.layout.registPanel(new Panel_Two());
        this.layout.registPanel(new Panel_Three());
        this.layout.registPanel(new Panel_Doc());

        //应用布局
        this.layout.applyLayoutConfig(this.defaultConfig);
        //--OR--//
        // //添加面板
        // this.layout.addPanelById(Panel_One.ID)
        // this.layout.addPanelById(Panel_Two.ID)
        // this.layout.addPanelById(Panel_Three.ID)
        // //添加文元素
        // this.layout.createDocumentElement();
        // this.layout.getDocumentElement().layout.addPanel(new Panel_Doc());
    }
    private testHandler=(type:string):any=>{
        switch (type) {
            case 'reset':
                this.layout.applyLayoutConfig(this.defaultConfig);
                break;
            case 'add_doc':
                this.layout.getDocumentElement().layout.addPanel(new Panel_Doc());
                break;
            case 'toggle':
                if(this.layout.checkPanelOpenedById(Panel_Three.ID))
                    this.layout.removePanelById(Panel_Three.ID)
                else
                    this.layout.addPanelById(Panel_Three.ID,true)
                break;
        }
    }
}
/**自定义面板序列化器 */
class CustomDocumentPanelSerialize implements boxlayout.IPanelSerialize {
    /**
     * 序列化 在调用布局的 getLayoutConfig 方法时调用
     * @param ownerLayout 面板所属的布局对象
     * @param panel 需要序列化的面板
     */
    public serialize(ownerLayout: boxlayout.BoxLayout, panel: boxlayout.ITabPanel): any {
        return panel.title;
    }
    /**
     * 反序列化 在调用布局的 applyLayoutConfig 方法时调用
     * @param ownerLayout 面板所属的布局对象
     * @param panelInfo 面板的序列化数据（此值就是serialize方法返回的值）
     */
    public unSerialize(ownerLayout: boxlayout.BoxLayout, panelInfo: any): boxlayout.ITabPanel {
        let panel = new Panel_Doc();
        return panel;
    }
}
/**自定义标题呈现器 */
class CustomRender extends boxlayout.DefaultTitleRender {
    constructor() {
        super();
        let div = document.createElement('div');
        div.style.marginRight = '0px';
        div.style.width = '10px';
        div.style.height = '15px';
        div.style.borderRadius = '10px';
        div.style.background = '#0000004d';
        // this.root.appendChild(div);
    }
}
/**自定义标题呈现器工厂 */
class CustomRenderFactory implements boxlayout.ITitleRenderFactory {
    createTitleRender(): boxlayout.ITitleRender {
        return new CustomRender();
    }
}