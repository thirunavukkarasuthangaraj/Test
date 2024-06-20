import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  constructor(private _api: ApiService, private util: UtilService) { }

  connectService(userId: any): Observable<any> {
    let datas: any = {}
    datas.userId = userId;
    datas.requestedBy = localStorage.getItem("userId");
    this.util.startLoader()
    return this._api.create('user/connect', datas);
  }

  removeUserConnectionSuggesion(id: any): Observable<any> {
    let datas: any = {}
    datas.suggestedUserId = id;
    datas.userId = localStorage.getItem('userId');
    return this._api.create("widget/remove/connection/suggestion", datas);
  }

}
