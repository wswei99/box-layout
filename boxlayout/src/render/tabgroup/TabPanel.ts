/// <reference path="../../data/EventDispatcher.ts" />
namespace boxlayout {
    /**
     * @author 杨宁
     */
    export class TabPanel extends EventDispatcher implements ITabPanel {
        constructor() {
            super();
            this._root = document.createElement('div');
            this._root.className = 'panel';
            this._root.style.zIndex = '0';
            this._root.style.display = 'none';
            this._root.tabIndex = 0;
        }
        private _minWidth: number = 50;
        public get minWidth(): number {
            return this._minWidth;
        }
        public set minWidth(v: number) {
            this._minWidth = v;
        }
        private _minHeight: number = 50;
        public get minHeight(): number {
            return this._minHeight;
        }
        public set minHeight(v: number) {
            this._minHeight = v;
        }
        private _id: string;
        public get id(): string {
            return this._id;
        }
        public set id(v: string) {
            this._id = v;
        }
        private _title: string;
        public get title(): string {
            return this._title;
        }
        public set title(v: string) {
            if (this._title !== v) {
                this._title = v;
                this.refresh();
            }
        }
        private _draggable:boolean=true;
        public get draggable():boolean{
            return this._draggable;
        }
        public set draggable(v:boolean){
            this._draggable=v;
        }
        private _icon: string = "";
        public get icon(): string {
            return this._icon;
        }
        public set icon(v: string) {
            if (this._icon !== v) {
                this._icon = v;
                this.refresh();
            }
        }
        private _closeable:boolean=true;
        public set closeable(v:boolean){
            if(this._closeable!==v){
                this._closeable=v;
                this.refresh();
            }
        }
        public get closeable():boolean{
            return this._closeable;
        }
        private _ownerGroup: TabGroup;
        public get ownerGroup(): TabGroup {
            return this._ownerGroup;
        }
        public set ownerGroup(v: TabGroup) {
            this._ownerGroup = v;
        }
        public get ownerLayout(): BoxLayout {
            if (this._ownerGroup)
                return this._ownerGroup.ownerLayout;
            return null;
        }
        private _$visible: boolean = false;
        /**
         * @internal
         */
        public get $visible(): boolean {
            return this._$visible;
        }
        public set $visible(v: boolean) {
            if (this._$visible !== v) {
                this.doSetVisible(v);
            }
        }
        protected doSetVisible(v: boolean) {
            this._$visible = v;
            this.root.style.display = v ? '' : 'none';
        }
        private _priorityLevel: number = 0;
        public get priorityLevel(): number {
            return this._priorityLevel;
        }
        public set priorityLevel(v: number) {
            this._priorityLevel = v;
        }
        private _root: HTMLElement;
        public get root(): HTMLElement {
            return this._root;
        }
        public getToolsRender(): IRender {
            return null;
        }
        private isFirst: boolean = true;
        private container: HTMLElement;
        public render(container: HTMLElement): void {
            this.container = container;
            this.container.appendChild(this.root);
            if (this.isFirst) {
                this.isFirst = false;
                this.onCreate(this._root);
            }
            this.onAdd();
        }
        public removeFromParent(): void {
            this.root.remove();
            this.onRemove();
        }
        private bw: number;
        private bh: number;
        public setBounds(x: number, y: number, width: number, height: number): void {
            if (this.bw !== width || this.bh !== height) {
                this.root.style.width = width + 'px';
                this.root.style.height = height + 'px';
                this.bw = width;
                this.bh = height;
                this.onResize(width, height);
            }
            this.root.style.left = x + 'px';
            this.root.style.top = y + 'px';
        }
        /**
         * 刷新
         */
        protected refresh(): void {
            if (this.ownerGroup)
                this.ownerGroup.refresh();
        }
        /**
         * 首次创建时触发
         */
        public onCreate(container: HTMLElement){
            //子代重写
        }
        /**
         * 当添加到视图时调用
         */
        public onAdd():void {
            //子代重写
        }
        /**
         * 当删除面板时调用,返回false可取消关闭
         * - 只有当用户行为下会触发，调用API删除并不会触发
         */
        public onRemoving():boolean{
            return true;
            //子代重写
        }
        /**
         * 当面板已被删除时调用
         */
        public onRemove():void{
            //子代重写
        }
        /**
         * 当面板尺寸发生改变时调用
         */
        protected onResize(width: number, height): void {
            //子代重写
        }
    }
}