import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  public BaseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  login(u, data): Observable<any> {

    // tslint:disable-next-line: prefer-const
    let credentials = btoa(data.email + ':' + data.password);
    const httpOptionslogin = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        channel: 'WEB', Authorization: 'Basic ' + credentials
      })
    };
    return this.http.get<any>(this.BaseUrl, httpOptionslogin);
  }

  create(u, data): Observable<any> {
    return this.http.post(this.BaseUrl, data);
  }

  public getBarearHeader(): Headers {
    return new Headers({
      'Content-Type': 'application/json',
      channel: 'WEB',
      Authorization: 'Barear token',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    });
  }

  convertToServerFormat(date: any): any {
    if (date == '' || date == null || date == undefined) {
      return ''
    } else {
      var num = date.day;
      var mon = date.month;
      if (num < 10) {
        num = "0" + num;
      }
      if (mon < 10) {
        mon = "0" + mon
      }
      let format = [date.year, mon, num].join('-');
      return format;
    }
  }

  public convertToDateFormat(date) {
    if (date != null) {
      var d = new Date(date)
      return d
    } else {
      return null
    }
  }
}
