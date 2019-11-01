export class Panel extends boxlayout.TabPanel {
    public static ID='Panel';
    constructor() {
        super();
        this.id=Panel.ID;
        this.title='面板';
        this.icon=require("../assets/icon.svg");
        this.minHeight=this.minWidth=200;
    }
}
