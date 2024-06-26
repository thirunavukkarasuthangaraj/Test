import { Injectable, Input } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class PageType {
  constructor(private router: Router) {}
  pageName = new Subject<any>();
  widgetsugg = new Subject<any>();

  setPageName(value) {
    this.pageName.next(value);
  }

  getPageName(): Observable<any> {
    return this.pageName.asObservable();
  }

  setsuggjob(value) {
    this.widgetsugg.next(value);
  }

  getsuggjob(): Observable<any> {
    return this.widgetsugg.asObservable();
  }



  redirect(data, path) {
    setTimeout(() => {
      this.router.navigate([path], { queryParams: data, replaceUrl: true });
    }, 400);
  }
}
