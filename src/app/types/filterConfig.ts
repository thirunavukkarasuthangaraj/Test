export class filterConfig {
  clickHandler: Function;
  canShow: Function;
  show: boolean;
  source: any;

  constructor(clickHandler : Function , show: boolean = true){
      this.clickHandler = clickHandler;
      this.show = show;
  }

}
