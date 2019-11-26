/// <reference path="./BoxLayoutElement.ts" />
namespace boxlayout {
    /**
     * 布局元素-枝节点
     * @author 杨宁
     */
    export class BoxLayoutContainer extends BoxLayoutElement implements IBoxLayoutContainer {
        constructor() {
            super();
            this._separator = new Separator();
            this._separator.root['__owner'] = this;
        }
        protected onOwnerLayoutChange(): void {
            //
        }
        private _isVertical: boolean = false;
        public get isVertical(): boolean {
            return this._isVertical;
        }
        public set isVertical(v: boolean) {
            this._isVertical = v;
        }
        private _firstElement: IBoxLayoutElement;
        public get firstElement(): IBoxLayoutElement {
            return this._firstElement;
        }
        public set firstElement(v: IBoxLayoutElement) {
            this._firstElement = v;
        }
        private _secondElement: IBoxLayoutElement;
        public get secondElement(): IBoxLayoutElement {
            return this._secondElement;
        }
        public set secondElement(v: IBoxLayoutElement) {
            this._secondElement = v;
        }
        private _separator: IRender;
        public get separator(): IRender {
            return this._separator;
        }
        //重写
        public get minHeight(): number {
            if (this.isVertical)
                return this.firstElement.minHeight + this.secondElement.minHeight + this.gap;
            else
                return Math.max(this.firstElement.minHeight, this.secondElement.minHeight);
        }
        //重写
        public get minWidth(): number {
            if (this.isVertical)
                return Math.max(this.firstElement.minWidth, this.secondElement.minWidth);
            else
                return this.firstElement.minWidth + this.secondElement.minWidth + this.gap;
        }
        //重写
        public get render(): IDragRender {
            return null;
        }
        //重写
        public get priorityLevel(): number {
            return Math.max(this.firstElement.priorityLevel || this.secondElement.priorityLevel);
        }
        public get lockElement(): IBoxLayoutElement {
            if (this.firstElement.priorityLevel > this.secondElement.priorityLevel) {
                return this.secondElement;
            }
            return this.firstElement;
        }
        public get stretchElement(): IBoxLayoutElement {
            if (this.firstElement.priorityLevel > this.secondElement.priorityLevel) {
                return this.firstElement;
            }
            return this.secondElement;
        }
        private _separatorSize = undefined;
        private get separatorSize(): number {
            if (this._separatorSize === undefined)
                this._separatorSize = Math.max(6, this.gap);
            return this._separatorSize;
        }
        private get gap():number{
            return this.ownerLayout.config.layoutGap;
        }
        //重写
        public updateRenderDisplay(): void {
            //如果初始化时为根节点则两个子节点都不存在
            if (!this.firstElement || !this.secondElement) {
                return;
            }
            //保持lockElement的尺寸，伸缩stretchElement的尺寸
            //纵向排列firstElement处于上方，横向排列firstElement处于左方
            let lockElement = this.lockElement;
            let stretchElement = this.stretchElement;
            if (this.isVertical) {
                lockElement.setLayoutSize(this.width, Math.max(lockElement.minHeight, Math.min(this.height - stretchElement.minHeight, lockElement.explicitHeight)));
                stretchElement.setLayoutSize(this.width, Math.max(stretchElement.minHeight - this.gap, this.height - lockElement.height - this.gap));

                this.firstElement.x = this.x;
                this.firstElement.y = this.y;
                this.secondElement.x = this.x;
                this.secondElement.y = this.y + this.firstElement.height + this.gap;

                this.separator.setBounds(this.x, this.firstElement.y + this.firstElement.height + (this.gap - this.separatorSize) / 2, this.width, this.separatorSize);
            }
            else {
                lockElement.setLayoutSize(Math.max(lockElement.minWidth, Math.min(this.width - stretchElement.minWidth, lockElement.explicitWidth)), this.height);
                stretchElement.setLayoutSize(Math.max(stretchElement.minWidth - this.gap, this.width - lockElement.width - this.gap), this.height);

                this.firstElement.x = this.x;
                this.firstElement.y = this.y;
                this.secondElement.y = this.y;
                this.secondElement.x = this.x + this.firstElement.width + this.gap;

                this.separator.setBounds(this.firstElement.x + this.firstElement.width + (this.gap - this.separatorSize) / 2, this.y, this.separatorSize, this.height);
            }
            this.firstElement.updateRenderDisplay();
            this.secondElement.updateRenderDisplay();
        }
    }
}