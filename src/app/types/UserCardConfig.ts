export class UserCardConfig {
    buttonName?: String;
    clickHandler?: Function;
    canShow?: Function;
    show?: boolean;
    source?: any;

    constructor(buttonName: String, clickHandler : Function, canShow: Function, show: boolean){
        this.buttonName = buttonName;
        this.clickHandler = clickHandler;
        this.canShow = canShow;
        this.show = show;
    }

}
