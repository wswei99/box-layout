namespace boxlayout {
    export class BoxLayoutElement implements IBoxLayoutElement {
        constructor() {
            this._render = new TabGroup();
            this._render.ownerElement = this;
        }
        private _x: number = 0;
        public get x(): number {
            return this._x;
        }
        public set x(v: number) {
            this._x = v;
        }
        private _y: number;
        public get y(): number {
            return this._y;
        }
        public set y(v: number) {
            this._y = v;
        }
        private _width: number = 0;
        public get width(): number {
            return this._width;
        }
        public set width(v: number) {
            this._width = v;
            this._explicitWidth = v;
        }
        private _height: number = 0;
        public get height(): number {
            return this._height;
        }
        public set height(v: number) {
            this._height = v;
            this._explicitHeight = v;
        }
        private _explicitWidth: number = 0;
        public get explicitWidth(): number {
            return this._explicitWidth;
        }
        private _explicitHeight: number = 0;
        public get explicitHeight(): number {
            return this._explicitHeight;
        }

        public get minWidth():number{
            return this.render.minWidth;
        }
        public set minWidth(v:number){
        }

        public get minHeight():number{
            return this.render.minHeight;
        }
        public set minHeight(v:number){

        }
        private _ownerLayout: BoxLayout;
        public get ownerLayout(): BoxLayout {
            return this._ownerLayout;
        }
        public set ownerLayout(v: BoxLayout) {
            if (this._ownerLayout !== v && v) {
                this._ownerLayout = v;
                this.onOwnerLayoutChange();
            }
        }
        protected onOwnerLayoutChange(): void {
            if (this._ownerLayout) {
                (this.render as TabGroup).titleRenderFactory = this._ownerLayout.config.titleRenderFactory;
            }
        }
        public get priorityLevel(): number {
            let level: number = 0;
            let panels = (this.render as TabGroup).panels;
            for (let i: number = 0; i < panels.length; i++) {
                level = Math.max(level, panels[i].priorityLevel);
            }
            return level;
        }
        public set priorityLevel(v: number) {
            //
        }
        private _parentContainer: IBoxLayoutContainer;
        public get parentContainer(): IBoxLayoutContainer {
            return this._parentContainer;
        }
        public set parentContainer(v: IBoxLayoutContainer) {
            this._parentContainer = v;
        }
        protected _render: IDragRender;
        public get render(): IDragRender {
            return this._render;
        }
        private _maximized: boolean = false;
        public setMaxSize(maxSize: boolean): void {
            this._maximized = maxSize;
            (this.render as TabGroup).maximized=this._maximized;
        }
        public setLayoutSize(width: number, height: number): void {
            this._width = width;
            this._height = height;
        }
        public updateRenderDisplay(): void {
            this.render.setBounds(this.x, this.y, this.width, this.height);
        }

    }
}