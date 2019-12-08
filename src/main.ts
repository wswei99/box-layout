import { Panel_Test } from "./testpanels/Panel_Test";
import { Panel } from "./testpanels/Panel";
import { Panel_LifeCircle } from "./testpanels/Panel_LifeCircle";
import { Panel_Doc } from "./testpanels/Panel_Doc";
onload = () => {
    new Main().start();
}
//测试代码
class Main {
    //布局配置
    private layoutConfig = { "type": "BoxLayoutContainer", "isVertical": false, "bounds": { "x": 0, "y": 0, "width": 1024, "height": 175 }, "firstElement": { "type": "BoxLayoutElement", "bounds": { "x": 0, "y": 0, "width": 255.5, "height": 175 }, "render": { "selectedIndex": 0, "panels": [{ "panelID": "Panel_Test" }] } }, "secondElement": { "type": "BoxLayoutContainer", "isVertical": true, "bounds": { "x": 256.5, "y": 0, "width": 767.5, "height": 175 }, "firstElement": { "type": "DocumentElement", "bounds": { "x": 256.5, "y": 0, "width": 767.5, "height": 49 } }, "secondElement": { "type": "BoxLayoutElement", "bounds": { "x": 256.5, "y": 50, "width": 767.5, "height": 200 }, "render": { "selectedIndex": 1, "panels": [{ "panelID": "Panel" }, { "panelID": "Panel_Three" }] } } } };
    private layoutConfig_Document = { "type": "BoxLayoutElement", "bounds": { "x": 0, "y": 0, "width": 770, "height": 338 }, "render": { "selectedIndex": 0, "panels": ["Panel_Doc"] } };
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
                //布局模式
                //* - NORMAL模式：有标题栏，可拖动，可改变尺寸。
                //* - FIXED模式：无标题栏，不可拖动，可改变尺寸。
                mode: boxlayout.LayoutMode.NORMAL,//正常布局
                // mode: boxlayout.LayoutMode.FIXED,//固定布局
                //布局间隙
                layoutGap: 1,
                //文档区配置
                documentConfig: {
                    titleRenderFactory: new CustomRenderFactory(),
                    panelSerialize: new CustomDocumentPanelSerialize(),
                    mode: boxlayout.LayoutMode.NORMAL,//正常布局
                    // mode: boxlayout.LayoutMode.FIXED,//固定布局
                    layoutGap: 1
                }
            }
        );
        //注册面板（注意：在应用布局配置或添加、打开面板时确保相关面板已经注册）
        this.layout.registPanel(new Panel_Test(
            this.testHandler,
            [
                { id: 'reset', label: '重置布局' },
                { id: 'console', label: '输出布局信息到控制台' },
                { id: 'add_doc', label: '在文档区添加一个面板' },
                { id: 'open', label: '在新位置打开 面板-周期测试' },
                { id: 'open-old', label: '在原始位置打开 面板-周期测试' },
                { id: 'close', label: '关闭 面板-周期测试 (模拟API调用)' },
                { id: 'close-operate', label: '关闭 面板-周期测试 (模拟关闭按钮)' },
            ]));
        this.layout.registPanel(new Panel());
        this.layout.registPanel(new Panel_LifeCircle());
        this.layout.registPanel(new Panel_Doc());

        //应用布局
        this.layout.applyLayoutConfig(this.layoutConfig);
        this.layout.getDocumentElement().layout.applyLayoutConfig(this.layoutConfig_Document);
        //--OR--//
        // //添加面板
        // this.layout.openPanelById(Panel.ID);
        // this.layout.openPanelById(Panel_Test.ID);
        // this.layout.openPanelById(Panel_LifeCircle.ID);
        // // //添加文元素
        // this.layout.createDocumentElement();
        // this.layout.getDocumentElement().layout.addPanel(new Panel_Doc());
    }
    //测试
    private testHandler = (type: string): any => {
        switch (type) {
            case 'reset':
                this.layout.applyLayoutConfig(this.layoutConfig);
                break;
            case 'add_doc':
                this.layout.getDocumentElement().layout.addPanel(new Panel_Doc());
                break;
            case 'open':
                this.layout.openPanelById(Panel_LifeCircle.ID, false)
                break;
            case 'open-old':
                this.layout.openPanelById(Panel_LifeCircle.ID)
                break;
            case 'close':
                this.layout.closePanelById(Panel_LifeCircle.ID)
                break;
            case 'close-operate':
                let panel = this.layout.getPanelById(Panel_LifeCircle.ID) as boxlayout.TabPanel;
                if (panel.onRemoving()) {
                    let group = panel.ownerGroup;
                    this.layout.removePanel(panel);
                    if (group.panels.length > 0) {
                        this.layout.focusManager.focus(group.selectedPanel);
                    }
                    else {
                        this.layout.focusManager.focus(null);
                    }
                }
                break;
            case 'console':
                console.log('布局配置:', JSON.stringify(this.layout.getLayoutConfig()));
                console.log('文档区布局配置:', JSON.stringify(this.layout.getDocumentElement().layout.getLayoutConfig()))
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
        return panel.id;
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