namespace boxlayout {
    /**
     * 文档区元素
     * - 文档区元素是一个特殊的区域，其中嵌套了另一个boxLayout
     * 一个layout里面只允许有一个文档区，如果想使用文档区请通过BoxLayout的createDocumentElement来添加
     */
    export class DocumentElement extends BoxLayoutElement {
        constructor() {
            super();
            this._render = DocumentGroup.getInstance();
            this._render.ownerElement = this;
        }
        public get layout(): BoxLayout {
            return (this._render as DocumentGroup).layout;
        }
        public get priorityLevel(): number {
            return Number.MAX_VALUE;
        }
        public setMaxSize(maxSize: boolean): void {
            let panelZ: number = maxSize ? 3 : 0;
            (this.render as DocumentGroup).root.style.zIndex = panelZ.toString();
        }
    }
}