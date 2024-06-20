import { ApiService } from "./services/api.service";
import { Injectable } from "@angular/core";
import {
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Resolve,
} from "@angular/router";
import { Observable } from "rxjs";
import { AppSettings } from "./services/AppSettings";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ValidateTokenGuard implements Resolve<any> {

  constructor(private API:ApiService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> {
      let data : any = {};
      data.token = route.queryParams.jsr;
      const resetPassword = route.queryParams.resetPassword;
      if(route.queryParams.candidateInvitation){
        data.candidateInvitation = route.queryParams.candidateInvitation;
      }
      return this.API.AuthValidation("user/validateToken",data).pipe(map(x =>{
        const userCredentials = x;
        userCredentials.resetPassword = resetPassword;
        return userCredentials;
      }));
   }
}
