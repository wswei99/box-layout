namespace boxlayout {
    export interface ITabPanel extends IRender, boxlayout_event.IEventDispatcher {
        id: string;
        title: string;
        icon: string;
        closeable:boolean;
        ownerGroup:TabGroup;
        ownerLayout:BoxLayout;
        priorityLevel:number;
        getToolsRender(): IRender;
        /**@internal */
        $visible: boolean;
    }
    export interface ITitleRender extends IRender{
        panel:ITabPanel;
        selected:boolean;    
        getBounds(): { x: number, y: number, width: number, height: number }
        updateDisplay():void
    }
    export interface ITitleRenderFactory{
        createTitleRender():ITitleRender;
    }
}