export class Panel_Two extends boxlayout.TabPanel {
    public static ID='Panel_Two';
    constructor() {
        super();
        this.id=Panel_Two.ID;
        this.title='面板-2';
        this.icon=require("../assets/icon.svg");
        this.minHeight=this.minWidth=200;
    }
}
