namespace boxlayout{
    /**
     * 拖拽区域标记
     * @author 杨宁
     */
    export class DragArea implements IRender{
        constructor(){
            this._root=document.createElement('div');
            this._root.className='drag-element';
        }
        public minHeight:number=0;
        public minWidth:number=0;
        private _root:HTMLElement;
        public get root():HTMLElement{
            return this._root;
        }
        private container:HTMLElement;
        public render(container:HTMLElement):void{
            this.container=container;
            this.container.appendChild(this.root);
        }
        public removeFromParent():void{
            if(this.container){
                this.container.removeChild(this.root);
            }
        }
        public setBounds(x:number,y:number,width:number,height:number):void{
            this.root.style.width=width+'px';
            this.root.style.height=height+'px';
            this.root.style.left=x+'px';
            this.root.style.top=y+'px';
        }
    }
}