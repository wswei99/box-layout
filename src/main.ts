import { Panel_One } from "./testpanels/Panel_One";
import { Panel_Two } from "./testpanels/Panel_Two";
import { Panel_Three } from "./testpanels/Panel_Three";
import { Panel_Doc } from "./testpanels/Panel_Doc";
onload = () => {
    //阻止选择
    document.onselectstart = function () { return false; };
    let container = document.getElementById('container');
    //默认布局配置信息
    let defaultConfig = {
        "type": "BoxLayoutContainer",
        "isVertical": false,
        "bounds": { "x": 0, "y": 0, "width": 1108, "height": 669 },
        "firstElement":
            { "type": "BoxLayoutContainer", "isVertical": false, "bounds": { "x": 0, "y": 0, "width": 910.5, "height": 669 }, "firstElement": { "type": "BoxLayoutElement", "bounds": { "x": 0, "y": 0, "width": 195.75, "height": 669 }, "render": { "selectedIndex": 0, "panels": [{ panelID: "wangwu", closeable: true }] } }, "secondElement": { "type": "BoxLayoutContainer", "isVertical": true, "bounds": { "x": 196.75, "y": 0, "width": 713.75, "height": 669 }, "firstElement": { "type": "DocumentElement", "bounds": { "x": 196.75, "y": 0, "width": 713.75, "height": 386.5 } }, "secondElement": { "type": "BoxLayoutElement", "bounds": { "x": 196.75, "y": 387.5, "width": 713.75, "height": 281.5 }, "render": { "selectedIndex": 0, "panels": [{ panelID: "lisi", closeable: true }] } } } }, "secondElement": { "type": "BoxLayoutElement", "bounds": { "x": 911.5, "y": 0, "width": 196.5, "height": 669 }, "render": { "selectedIndex": 0, "panels": [{ panelID: "zhaoliu", closeable: true }] } }
    }

    let layout: boxlayout.BoxLayout = new boxlayout.BoxLayout();
    //初始化布局
    layout.init(
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
    //注册面板（注意：在应用布局配置或添加、打开面板时确保相关面板已经注册）
    layout.registPanel(new Panel_One());
    layout.registPanel(new Panel_Two());
    layout.registPanel(new Panel_Three());
    layout.registPanel(new Panel_Doc());

    //应用布局
    // layout.applyLayoutConfig(defaultConfig);
    //--OR--//
    //添加面板
    layout.addPanelById(Panel_One.ID)
    layout.addPanelById(Panel_Two.ID)
    layout.addPanelById(Panel_Three.ID)
    //添加文元素
    layout.createDocumentElement();
    layout.getDocumentElement().layout.addPanel(new Panel_Doc());

    container.addEventListener('mousedown', (e: MouseEvent) => {
        switch (e.button) {
            case 2:
                let wangwu = new Panel_Doc();
                layout.getDocumentElement().layout.addPanel(wangwu);
                break
            case 1:
                layout.getLayoutConfig()
                layout.applyLayoutConfig(defaultConfig);
                break;
        }
    });
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
        div.style.width='10px';
        div.style.height='15px';
        div.style.borderRadius='10px';
        div.style.background='#0000004d';
        // this.root.appendChild(div);
    }
}
/**自定义标题呈现器工厂 */
class CustomRenderFactory implements boxlayout.ITitleRenderFactory {
    createTitleRender(): boxlayout.ITitleRender {
        return new CustomRender();
    }
}