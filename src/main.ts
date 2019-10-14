import { LiSi } from "./testpanels/LiSi";
import { WangWu } from "./testpanels/WangWu";
import { ZhaoLiu } from "./testpanels/ZhaoLiu";
import { ZhangSan } from "./testpanels/ZhangSan";

class DocumentPanelSerialize implements boxlayout.IPanelSerialize {
    public serialize(ownerLayout: boxlayout.BoxLayout, panel: boxlayout.ITabPanel): string {
        console.log(panel.title);
        return panel.title;
    }
    public unSerialize(ownerLayout: boxlayout.BoxLayout, panelInfo: string): boxlayout.ITabPanel {
        console.log(panelInfo);
        let panel = new LiSi();
        panel.id = ('adsasdfaf');
        return panel;
    }
}
class Render extends boxlayout.DefaultTitleRender implements boxlayout.ITitleRenderFactory {
    constructor() {
        super();
        let div = document.createElement('div');
        div.innerHTML = 'aaaa';
        div.style.marginRight = '0px';
        this.root.appendChild(div);
    }
    createTitleRender(): boxlayout.ITitleRender {
        return new Render();
    }
}
onload = () => {
    document.onselectstart = function () { return false; };

    //默认布局配置信息
    let defaultConfig = {
        "type": "BoxLayoutContainer",
        "isVertical": false,
        "bounds": { "x": 0, "y": 0, "width": 1108, "height": 669 },
        "firstElement":
            { "type": "BoxLayoutContainer", "isVertical": false, "bounds": { "x": 0, "y": 0, "width": 910.5, "height": 669 }, "firstElement": { "type": "BoxLayoutElement", "bounds": { "x": 0, "y": 0, "width": 195.75, "height": 669 }, "render": { "selectedIndex": 0, "panels": [{ panelID: "wangwu", closeable: true }] } }, "secondElement": { "type": "BoxLayoutContainer", "isVertical": true, "bounds": { "x": 196.75, "y": 0, "width": 713.75, "height": 669 }, "firstElement": { "type": "DocumentElement", "bounds": { "x": 196.75, "y": 0, "width": 713.75, "height": 386.5 } }, "secondElement": { "type": "BoxLayoutElement", "bounds": { "x": 196.75, "y": 387.5, "width": 713.75, "height": 281.5 }, "render": { "selectedIndex": 0, "panels": [{ panelID: "lisi", closeable: true }] } } } }, "secondElement": { "type": "BoxLayoutElement", "bounds": { "x": 911.5, "y": 0, "width": 196.5, "height": 669 }, "render": { "selectedIndex": 0, "panels": [{ panelID: "zhaoliu", closeable: true }] } }
    }
    let layout: boxlayout.BoxLayout = new boxlayout.BoxLayout();
    let container = document.getElementById('container');

    layout.init(container);
    //注册面板
    layout.registPanel(new ZhangSan());
    layout.registPanel(new LiSi());
    layout.registPanel(new WangWu());
    layout.registPanel(new ZhaoLiu());

    layout.addPanelById('lisi')
    layout.addPanelById('wangwu')
    layout.addPanelById('zhaoliu')

    // layout.createDocumentElement();
    // layout.getDocumentElement().layout.addPanel(new WangWu());

    container.addEventListener('mousedown', (e: MouseEvent) => {
        switch (e.button) {
            case 2:
                let wangwu = new WangWu();
                wangwu.closeable = false;
                layout.getDocumentElement().layout.addPanel(wangwu);
                break
            case 1:
                layout.applyLayoutConfig(defaultConfig);
                break;
        }
    });
}