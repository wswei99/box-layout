declare namespace boxlayout_event {
    interface IEventDispatcher {
        addEventListener(type: string, fun: Function, thisObj: any): void;
        removeEventListener(type: string, fun: Function, thisObj: any): void;
        dispatchEvent(event: Event): void;
    }
    class EventDispatcher implements IEventDispatcher {
        listeners: any;
        constructor();
        addEventListener(type: string, fun: Function, thisObj: any, level?: number): void;
        removeEventListener(type: string, fun: Function, thisObj: any): void;
        dispatchEvent(event: Event): boolean;
    }
    class Event {
        $stopPropagation: boolean;
        stopPropagation(): void;
        type: string;
        data: any;
        constructor(type: string, data?: any);
    }
}
declare namespace boxlayout {
    type Position = "left" | "right" | "top" | "bottom";
    /**
     * 盒式布局
     * @author 杨宁
     */
    class BoxLayout extends boxlayout_event.EventDispatcher {
        private dragAreaElement;
        private maskElement;
        constructor();
        private _area;
        private _rootLayoutElement;
        readonly rootLayoutElement: IBoxLayoutElement;
        private _layoutConfig;
        /**配置 */
        readonly config: LayoutConfig;
        /**
         * 初始化盒式布局
         * @param container 布局区域
         */
        init(area: HTMLElement, config?: {
            /**标题呈现器工厂*/
            titleRenderFactory?: ITitleRenderFactory;
            /**面板序列化 */
            panelSerialize?: IPanelSerialize;
            /**布局间隙 */
            layoutGap?: number;
            /**文档区配置 */
            documentConfig?: {
                /**标题呈现器工厂*/
                titleRenderFactory?: ITitleRenderFactory;
                /**面板序列化 */
                panelSerialize?: IPanelSerialize;
                /**布局间隙 */
                layoutGap?: number;
            };
        }): void;
        /**
         * 获取激活的选项卡组
         */
        getActiveTabGroup(): TabGroup;
        /**
         * 获取激活的面板
         */
        getActivePanel(): ITabPanel;
        /**
         * 添加一个元素到跟节点
         * @param element 要添加的元素
         * @param position 位置
         */
        addBoxElementToRoot(element: IBoxLayoutElement, position?: Position): void;
        /**
         * 添加一个元素到另一个元素的旁边
         * @param target 目标元素
         * @param element 要添加的元素
         * @param position 位置
         */
        addBoxElement(target: IBoxLayoutElement, element: IBoxLayoutElement, position?: Position): void;
        /**
         * 删除一个元素
         * @param element 要删除的元素
         */
        removeBoxElement(element: IBoxLayoutElement): void;
        private addToArea;
        private removeFromArae;
        private _maxSizeElement;
        private cacheWidth;
        private cacheHeight;
        readonly maxSizeElement: IBoxLayoutElement;
        /**设置最大化元素
         * 设置为null取消最大化
         */
        setMaxSize(v: IBoxLayoutElement): void;
        private _setMaxSize;
        private updateBoxElement;
        private _updateBoxElement;
        private containerResizeHandle;
        private attachSeparatorOperateEvent;
        private detachSeparatorOperateEvent;
        private cursorLock;
        private startMouseP;
        private startSize;
        private targetContainer;
        private separatorHandle;
        private panelHandle;
        private closePanelInfoCache;
        private cachePanelInfo;
        private getOldSpace;
        private getDirLink;
        private getElementByLink;
        private dragInfo;
        private acceptTarget;
        private dragHandle;
        private attachDragEvent;
        private detachDragEvent;
        private dragEventHandle;
        private getOneDragRenderWithMouseEvent;
        private getAllChildElement;
        private documentElement;
        /**
         * 获取文档元素
         */
        getDocumentElement(): DocumentElement;
        /**
         * 创建一块文档区域，如果已经存在文档区域则直接返回该文档区
         * @param config 文档区的布局配置
         */
        createDocumentElement(): DocumentElement;
        private _createDocumentElement;
        private panelDic;
        /**注册面板(与面板ID相关的api会用到注册信息)*/
        registPanel(panel: ITabPanel): void;
        /**根据ID获取一个已注册的面板 */
        getRegistPanelById(id: string): ITabPanel | null;
        /**根据ID获取一个已经打开的面板 */
        getPanelById(id: string): ITabPanel | null;
        /**
         * 根据ID打开一个面板，如果面板已经打开则选中该面板并设置焦点
         * @param panelId 面板ID
         * @param oldSpace 是否尝试在原来的区域打开，如果布局发生较大的变化可能出现原始位置寻找错误的情况，默认true
         */
        openPanelById(panelId: string, oldSpace?: boolean): void;
        /**
         * 添加一个panel，如果面板已经打开则选中该面板并设置焦点
         * @param panel 面板
         * @param oldSpace 是否尝试在原来的区域打开，如果布局发生较大的变化可能出现原始位置寻找错误的情况，默认true
         */
        addPanel(panel: ITabPanel, oldSpace?: boolean): void;
        /**
         * 根据Id关闭一个面板
         * @param panelId 面板ID
         */
        closePanelById(panelId: string): void;
        /**
         * 删除一个面板
         * @param panel 要删除的面板
         */
        removePanel(panel: ITabPanel): void;
        /**获取所有已打开的面板 */
        getAllOpenPanels(): ITabPanel[];
        /**检查某个面板是否打开 */
        checkPanelOpenedById(panelId: string): boolean;
        /**获取所有的选项卡组 */
        getAllTabGroup(): TabGroup[];
        private getFirstElement;
        private getSecondElement;
        /**
         * 获取面板所在的布局元素
         * @param panelId 面板ID
         */
        getElementByPanelId(panelId: string): IBoxLayoutElement;
        /**获取焦点管理器*/
        readonly focusManager: TabPanelFocusManager;
        /**焦点处理*/
        private focusHandler;
        /**
         * 应用布局
         * @param config 布局数据
         */
        applyLayoutConfig(config: any): void;
        /**
         * 获取元素下所有的面板
         * @param element 布局元素
         * @param result 面板
         */
        private getAllPanelByElement;
        /**
         * 获取当前布局信息
         */
        getLayoutConfig(): any;
    }
}
declare namespace boxlayout {
    /**
     * 布局元素-叶子节点
     * @author 杨宁
     */
    class BoxLayoutElement implements IBoxLayoutElement {
        constructor();
        private _x;
        x: number;
        private _y;
        y: number;
        private _width;
        width: number;
        private _height;
        height: number;
        private _explicitWidth;
        readonly explicitWidth: number;
        private _explicitHeight;
        readonly explicitHeight: number;
        minWidth: number;
        minHeight: number;
        private _ownerLayout;
        ownerLayout: BoxLayout;
        protected onOwnerLayoutChange(): void;
        priorityLevel: number;
        private _parentContainer;
        parentContainer: IBoxLayoutContainer;
        protected _render: IDragRender;
        readonly render: IDragRender;
        private _maximized;
        setMaxSize(maxSize: boolean): void;
        setLayoutSize(width: number, height: number): void;
        updateRenderDisplay(): void;
    }
}
declare namespace boxlayout {
    /**
     * 布局元素-枝节点
     * @author 杨宁
     */
    class BoxLayoutContainer extends BoxLayoutElement implements IBoxLayoutContainer {
        constructor();
        protected onOwnerLayoutChange(): void;
        private _isVertical;
        isVertical: boolean;
        private _firstElement;
        firstElement: IBoxLayoutElement;
        private _secondElement;
        secondElement: IBoxLayoutElement;
        private _separator;
        readonly separator: IRender;
        readonly minHeight: number;
        readonly minWidth: number;
        readonly render: IDragRender;
        readonly priorityLevel: number;
        readonly lockElement: IBoxLayoutElement;
        readonly stretchElement: IBoxLayoutElement;
        private _separatorSize;
        private readonly separatorSize;
        private readonly gap;
        updateRenderDisplay(): void;
    }
}
declare namespace boxlayout {
    /**
     * @author 杨宁
     */
    class TabPanel extends boxlayout_event.EventDispatcher implements ITabPanel {
        constructor();
        private _minWidth;
        minWidth: number;
        private _minHeight;
        minHeight: number;
        private _id;
        id: string;
        private _title;
        title: string;
        private _icon;
        icon: string;
        private _closeable;
        closeable: boolean;
        private _ownerGroup;
        ownerGroup: TabGroup;
        readonly ownerLayout: BoxLayout;
        private _$visible;
        protected doSetVisible(v: boolean): void;
        private _priorityLevel;
        priorityLevel: number;
        private _root;
        readonly root: HTMLElement;
        getToolsRender(): IRender;
        private isFirst;
        private container;
        render(container: HTMLElement): void;
        removeFromParent(): void;
        private bw;
        private bh;
        setBounds(x: number, y: number, width: number, height: number): void;
        /**
         * 刷新
         */
        protected refresh(): void;
        /**
         * 首次创建时触发
         */
        onCreate(container: HTMLElement): void;
        /**
         * 当添加到视图时调用
         */
        onAdd(): void;
        /**
         * 当删除面板时调用,返回false可取消关闭
         * - 只有当用户行为下会触发，调用API删除并不会触发
         */
        onRemoving(): boolean;
        /**
         * 当面板已被删除时调用
         */
        onRemove(): void;
        /**
         * 当面板尺寸发生改变时调用
         */
        protected onResize(width: number, height: any): void;
    }
}
declare namespace boxlayout {
    /**
     * 默认面板序列化器
     * @author 杨宁
     */
    class DefaultPanelSerialize implements IPanelSerialize {
        serialize(ownerLayout: BoxLayout, panel: ITabPanel): any;
        unSerialize(ownerLayout: BoxLayout, panelInfo: {
            panelID: string;
            closeable: boolean;
        }): ITabPanel;
    }
    /**
     * 占位面板
     * - 解析布局文件时如果遇到无法解析的面板则会用此面板代替
     * @author 杨宁
     */
    class PlaceholderPanel extends TabPanel {
        constructor();
    }
}
declare namespace boxlayout {
    interface IRender {
        root: HTMLElement;
        minHeight: number;
        minWidth: number;
        render(container: HTMLElement): void;
        removeFromParent(): void;
        setBounds(x: number, y: number, width: number, height: number): void;
    }
    interface IDragRender extends IRender, boxlayout_event.IEventDispatcher {
        ownerElement: IBoxLayoutElement;
        adjustDragInfo(e: MouseEvent, info: DragInfo): boolean;
        acceptDragInfo(info: DragInfo): void;
    }
    interface IBoxLayoutElement {
        x: number;
        y: number;
        width: number;
        height: number;
        minWidth: number;
        minHeight: number;
        explicitWidth: number;
        explicitHeight: number;
        ownerLayout: BoxLayout;
        priorityLevel: number;
        setLayoutSize(width: number, height: number): void;
        parentContainer: IBoxLayoutContainer;
        render: IDragRender;
        setMaxSize(maxSize: boolean): void;
        updateRenderDisplay(): void;
    }
    interface IBoxLayoutContainer extends IBoxLayoutElement {
        isVertical: boolean;
        firstElement: IBoxLayoutElement;
        secondElement: IBoxLayoutElement;
        lockElement: IBoxLayoutElement;
        stretchElement: IBoxLayoutElement;
        separator: IRender;
    }
    interface IPanelSerialize {
        serialize(ownerLayout: BoxLayout, panel: ITabPanel): any;
        unSerialize(wnerLayout: BoxLayout, panelInfo: any): ITabPanel;
    }
}
declare namespace boxlayout {
    /**
     * 拖拽事件
     * @author 杨宁
     */
    class DragEvent extends boxlayout_event.Event {
        /**开始拖拽 */
        static STARTDRAG: string;
        constructor(type: string, data?: any);
    }
}
declare namespace boxlayout {
    class DragInfo {
        /**拖拽的区域 */
        dragRange: Rectangle;
        otherData: any;
    }
}
declare namespace boxlayout {
    /**
     * 布局配置文件
     */
    class LayoutConfig extends boxlayout_event.EventDispatcher {
        constructor();
        private _titleRenderFactory;
        /**标题呈现器（默认：DefaultTitleRenderFactory）**/
        titleRenderFactory: ITitleRenderFactory;
        private _panelSerialize;
        /**面板序列化（默认：DefaultPanelSerialize）*/
        panelSerialize: IPanelSerialize;
        private _layoutGap;
        /**布局间隙 （默认：1）*/
        layoutGap: number;
        private _documentConfig;
        /**文档区配置 */
        documentConfig: LayoutConfig;
    }
}
declare namespace boxlayout {
    class Matrix {
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        clone(): Matrix;
        concat(target: Matrix): void;
        /**
         * @private
         */
        $preConcat(target: Matrix): void;
        copyFrom(target: Matrix): void;
        identity(): void;
        invert(): void;
        private $invertInto;
        rotate(angle: number): void;
        scale(sx: number, sy: number): void;
        setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        transformPoint(pointX: number, pointY: number, resultPoint?: Point): Point;
        deltaTransformPoint(pointX: number, pointY: number, resultPoint?: Point): Point;
        translate(dx: number, dy: number): void;
        equals(target: Matrix): boolean;
        prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        append(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        toString(): string;
        createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
        /**
         * @private
         */
        $getDeterminant(): number;
        /**
         * @private
         */
        $getScaleX(): number;
        /**
         * @private
         */
        $getScaleY(): number;
        /**
         * @private
         */
        $getSkewX(): number;
        /**
         * @private
         */
        $getSkewY(): number;
        /**
         * @private
         */
        $getRotation(angle: number): number;
    }
}
declare namespace boxlayout {
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        setTo(x: number, y: number): void;
        clone(): Point;
        toString(): string;
    }
}
declare namespace boxlayout {
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        containsPoint(point: Point): boolean;
        containsRect(rect: any): boolean;
        clone(): Rectangle;
    }
}
declare namespace boxlayout {
    /**
     * @author 杨宁
     */
    class TabBarEvent extends boxlayout_event.Event {
        /**选择改变 */
        static CHANGE: string;
        /**开始拖拽 */
        static BEGINDRAG: string;
        /**双击 */
        static ITEMDOUBLECLICK: string;
        constructor(type: string, data?: any);
    }
}
declare namespace boxlayout {
    class TabGroupEvent extends boxlayout_event.Event {
        /**
         * data:TabGroup
         */
        static SELECTCHANGE: string;
        /**
         * data:ITabPanel
         */
        static PANEL_DRAG: string;
        constructor(type: string, data?: any);
    }
}
declare namespace boxlayout {
    class TabPanelEvent extends boxlayout_event.Event {
        constructor(type: string, data?: any);
    }
}
declare namespace boxlayout {
    /**
     * 文档区元素
     * - 文档区元素是一个特殊的区域，其中嵌套了另一个boxLayout
     * 一个layout里面只允许有一个文档区，如果想使用文档区请通过BoxLayout的createDocumentElement来添加
     * @author 杨宁
     */
    class DocumentElement extends BoxLayoutElement {
        constructor();
        readonly layout: BoxLayout;
        readonly priorityLevel: number;
        setMaxSize(maxSize: boolean): void;
    }
}
declare namespace boxlayout {
    /**
     * 文档区视图
     * @author 杨宁
     */
    class DocumentGroup extends boxlayout_event.EventDispatcher implements IDragRender {
        private static instance;
        static getInstance(): DocumentGroup;
        constructor();
        minWidth: number;
        minHeight: number;
        private _layout;
        readonly layout: BoxLayout;
        private _root;
        readonly root: HTMLElement;
        private _ownerElement;
        ownerElement: IBoxLayoutElement;
        adjustDragInfo(e: MouseEvent, info: DragInfo): boolean;
        private adjustDragInfo_tabGroup;
        acceptDragInfo(v: DragInfo): void;
        private container;
        render(container: HTMLElement): void;
        removeFromParent(): void;
        private bw;
        private bh;
        private bx;
        private by;
        setBounds(x: number, y: number, width: number, height: number): void;
    }
}
declare namespace boxlayout {
    /**
     * 拖拽区域标记
     * @author 杨宁
     */
    class DragArea implements IRender {
        constructor();
        minHeight: number;
        minWidth: number;
        private _root;
        readonly root: HTMLElement;
        private container;
        render(container: HTMLElement): void;
        removeFromParent(): void;
        setBounds(x: number, y: number, width: number, height: number): void;
    }
}
declare namespace boxlayout {
    /**
     * 蒙版对象
     * @author 杨宁
     */
    class Mask implements IRender {
        constructor();
        minHeight: number;
        minWidth: number;
        private _root;
        readonly root: HTMLElement;
        private container;
        render(container: HTMLElement): void;
        removeFromParent(): void;
        setBounds(x: number, y: number, width: number, height: number): void;
    }
}
declare namespace boxlayout {
    /**
     * 分割条
     * @author 杨宁
     * */
    class Separator implements IRender {
        constructor();
        minHeight: number;
        minWidth: number;
        private _root;
        readonly root: HTMLElement;
        private container;
        render(container: HTMLElement): void;
        removeFromParent(): void;
        setBounds(x: number, y: number, width: number, height: number): void;
    }
}
declare namespace boxlayout {
    /**
     * @author 杨宁
     */
    class TabBar extends boxlayout_event.EventDispatcher implements IRender {
        constructor();
        minHeight: number;
        minWidth: number;
        private _titleRenderFactory;
        titleRenderFactory: ITitleRenderFactory;
        private itemContainer;
        private appendContainer;
        private _root;
        readonly root: HTMLElement;
        _panels: ITabPanel[];
        panels: ITabPanel[];
        private _selectedIndex;
        selectedIndex: number;
        private setSelected;
        private container;
        render(container: HTMLElement): void;
        removeFromParent(): void;
        private bx;
        private by;
        private bw;
        private bh;
        getBounds(): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        setBounds(x: number, y: number, width: number, height?: number): void;
        currentItems: ITitleRender[];
        private reDeployItems;
        private startP;
        private cancelClick;
        private targetPanel;
        private itemEventHandle;
        private currentHeaderRender;
        private commitSelected;
        refresh(): void;
        private updateItemDisplay;
    }
}
declare namespace boxlayout {
    /**
     * @author 杨宁
     */
    class TabGroup extends boxlayout_event.EventDispatcher implements IDragRender {
        constructor();
        minWidth: number;
        minHeight: number;
        titleRenderFactory: ITitleRenderFactory;
        private _tabBar;
        readonly tabBar: TabBar;
        readonly root: HTMLElement;
        readonly ownerLayout: BoxLayout;
        private _ownerElement;
        ownerElement: IBoxLayoutElement;
        private _panels;
        panels: ITabPanel[];
        private _selectedIndex;
        selectedIndex: number;
        selectedPanel: ITabPanel;
        private _maximized;
        maximized: boolean;
        private updateDisplayIndex;
        /**
         * 移除一个面板，移除后会选中最近选中过的一个面板
         */
        removePanel(v: ITabPanel): void;
        /**
         * 添加并选中一个面板
         */
        addPanel(v: ITabPanel): void;
        /**
         * 添加并选中一个面板
         */
        addPanelTo(target: ITabPanel, panel: ITabPanel, dir?: string): void;
        private reDeployPanelTag;
        private currentPanels;
        private reDeployPanels;
        private selectedPath;
        private commitSelected;
        /**刷新所有视图 */
        refresh(): void;
        adjustDragInfo(e: MouseEvent, info: DragInfo): boolean;
        private adjustDragInfo_tabBox;
        private adjustDragInfo_tabGroup;
        acceptDragInfo(v: DragInfo): void;
        private container;
        render(container: HTMLElement): void;
        removeFromParent(): void;
        private tabBarEventHandle;
        private bx;
        private by;
        private bw;
        private bh;
        setBounds(x: number, y: number, width: number, height: number): void;
        private updatePanelDisplay;
        dispose(): void;
    }
}
declare namespace boxlayout {
    /**
     * TabPanel焦点管理器（单例模式）
     * @author 杨宁
     */
    class TabPanelFocusManager extends boxlayout_event.EventDispatcher {
        private static instance;
        static getInstance(): TabPanelFocusManager;
        private _foucsPanel;
        /**当前焦点面板 */
        readonly currentFocus: ITabPanel;
        /**设置焦点面板 */
        focus(panel: ITabPanel): void;
        private activeGroups;
        /**
         * 获取活动状态的面板组
         * - 焦点面板所在的组为活动组
         * @param layout 布局对象
         */
        getActiveGroup(layout: BoxLayout): TabGroup;
        private addActiveGroup;
        /**
         * 重置
         */
        reSet(): void;
    }
}
declare namespace boxlayout {
    /**
     * 默认标题呈现器
     * @author 杨宁
     */
    class DefaultTitleRender implements ITitleRender {
        private titleElement;
        private iconElement;
        private closeBtn;
        constructor();
        minHeight: number;
        minWidth: number;
        private _root;
        readonly root: HTMLElement;
        private _panel;
        panel: ITabPanel;
        private _selected;
        selected: boolean;
        private container;
        render(container: HTMLElement): void;
        removeFromParent(): void;
        private closeHandler;
        updateDisplay(): void;
        private commitSelected;
        private bx;
        private by;
        private bw;
        private bh;
        getBounds(): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        setBounds(x: number, y: number, width: number, height: number): void;
    }
    /**
     * 默认标题呈现器工厂
     * @author 杨宁
     */
    class DefaultTitleRenderFactory implements ITitleRenderFactory {
        createTitleRender(): ITitleRender;
    }
}
declare namespace boxlayout {
    /**
     * 面板接口
     * @author 杨宁
     */
    interface ITabPanel extends IRender, boxlayout_event.IEventDispatcher {
        /**面板id */
        id: string;
        /**面板标题 */
        title: string;
        /**所属的容器 */
        ownerGroup: TabGroup;
        /**所属的布局 */
        ownerLayout: BoxLayout;
        /**布局权重 值越大越优先调整尺寸 */
        priorityLevel: number;
        /**获取工具栏对象 */
        getToolsRender(): IRender;
    }
    /**
     * 标题呈现器接口
     * @author 杨宁
     */
    interface ITitleRender extends IRender {
        /**对应的面板 */
        panel: ITabPanel;
        /**是否选中 */
        selected: boolean;
        /**获取视图绑定信息 */
        getBounds(): {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        /**更新视图 */
        updateDisplay(): void;
    }
    /**
     * 标题呈现器工厂接口
     * @author 杨宁
     */
    interface ITitleRenderFactory {
        /**
         * 创建一个呈现器实例
         */
        createTitleRender(): ITitleRender;
    }
}
declare namespace boxlayout {
    /**
     * @author 杨宁
     */
    class HtmlElementResizeHelper {
        private static listenList;
        /**
         * 监视目标标签，如果尺寸发生变化目标标签将会抛出'resize'事件
         */
        static watch(target: HTMLElement): void;
        static unWatch(target: HTMLElement): void;
        private static checkTag;
        private static startListen;
        private static update;
        private static stopListen;
        static checkSize(): void;
    }
}
declare namespace boxlayout {
    /**
     * 矩阵工具类
     * @author 杨宁
     */
    class MatrixUtil {
        /**将一个标签的本地坐标转换为相对于body的坐标 */
        static localToGlobal(target: HTMLElement, p: Point): Point;
        /**将相对于窗口的坐标转换为目标标签的本地坐标*/
        static globalToLocal(target: HTMLElement, p: Point): Point;
        /**获取一个标签相对于窗口的变换矩阵 */
        static getMatrixToWindow(target: HTMLElement): Matrix;
        private static cssMatrixCache;
        /** 获取一个标签的矩阵信息*/
        static getMatrix(target: HTMLElement): Matrix;
        private static checkCssTransform;
        private static keyToTag;
        private static transformValues;
        private static makeMatrix;
    }
}
declare namespace boxlayout {
    /**
     * 弹出菜单
     * @author 杨宁
     */
    class PopupMenu {
        constructor();
        private static instance;
        /**
         * 弹出菜单
         * @param target 要弹出菜单的目标对象
         * @param menus 菜单数据
         * @param callback 回调
         */
        static popup(target: HTMLElement, menus: any[], callback: (id: string) => void): void;
        private menuContainer;
        private callback;
        /**
         * 弹出菜单
         * @param target 要弹出菜单的目标对象
         * @param menus 菜单数据
         * @param callback 回调
         */
        popup(target: HTMLElement, menus: any[], callback: (id: string) => void): void;
        private itemHandle;
        private removePopup;
        private mouseEventHandle;
    }
}
