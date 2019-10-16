namespace boxlayout {
	/**
	 * @author 杨宁
	 */
	export class HtmlElementResizeHelper {
		private static listenList: any[] = [];
		/**
		 * 监视目标标签，如果尺寸发生变化目标标签将会抛出'resize'事件
		 */
		public static watch(target: HTMLElement): void {
			this.listenList.push({ w: target.offsetWidth, h: target.offsetHeight, target: target });
			this.startListen();
		}
		public static unWatch(target: HTMLElement): void {
			for (let i: number = this.listenList.length - 1; i >= 0; i--) {
				if (this.listenList[i]['target'] === target) {
					this.listenList.splice(i, 1);
				}
			}
			if (this.listenList.length === 0) {
				this.stopListen();
			}
		}
		private static checkTag=false;
		private static startListen(): void {
			this.checkTag=true;
			this.update()
		}
		private static update=()=>{
			HtmlElementResizeHelper.checkSize();
			if(HtmlElementResizeHelper.checkTag)
				requestAnimationFrame(HtmlElementResizeHelper.update);
		}
		private static stopListen(): void {
			this.checkTag=false;
		}
		public static checkSize(): void {
			this.listenList.forEach(element => {
				let target: HTMLElement = element['target'];
				if (target.offsetWidth !== element['w'] || target.offsetHeight !== element['h']) {
					element['w'] = target.offsetWidth;
					element['h'] = target.offsetHeight;
					target.dispatchEvent(new Event('resize'));

				}
			});
		}
	}
}
