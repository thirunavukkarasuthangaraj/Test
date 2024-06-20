
import {Directive} from "@angular/core"
import { candidateModel } from "../services/candidateModel"

@Directive({
    selector : "value-template",
    exportAs : "handleValue"
})
export class HandlingValue {


  getValue({payTypefortheJob , payType } : candidateModel) {
     return  payTypefortheJob ||  payType;
  }

  getValues({payTypefortheJob , payType } : candidateModel) : string {
     return   this.getPayType(payTypefortheJob || payType);
  }


  private getPayType(value : string) : string {
    switch(value){
      case "Hourly" :
        return "Hr"
        break;
      case "Daily" :
        return "Day"
        break;
      case "Weekly" :
        return "Week"
        break;
      case "Monthly" :
        return "Month"
        break;
      case "Yearly" :
        return "Year"
        break;
    }
  }






}
