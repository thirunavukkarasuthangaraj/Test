import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe, formatDate } from '@angular/common';
import { fromEvent, merge, of, Observable, BehaviorSubject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { getFullYear } from 'ngx-bootstrap/chronos';

import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',

})


export class UtilService {

  online$: Observable<boolean>;
  networkValue: boolean = false;
  loaderValue: boolean = false;
  constructor(private spinner: NgxSpinnerService, private datePipe: DatePipe) {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    )
    this.networkStatus()
  }

  log(message: string) {
  }

  public networkStatus() {
    this.online$.subscribe(value => {

      this.networkValue = value;
    })
  }

  startLoader(val?: any) {
    if (this.networkValue) {
      if (val == undefined || val === null || val === '')
        this.spinner.show();
      else
        this.spinner.show(val);

    } else {


      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: 'Oops! No Internet',
        text: "It seems that you are not connected to the internet. Please, connect and try again.",
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
        reverseButtons: false
      })



    }

  }


  stopLoader(val?: any) {
    this.loaderValue = false;
    if (val == undefined || val === null || val === '')
      this.spinner.hide();
    else
      this.spinner.hide(val);
  }

   // min-hour-sec-day getfrom this method

   dataconvert(curr, prev) {
    var ms_Min = 60 * 1000;
    var ms_Hour = ms_Min * 60;
    var ms_Day = ms_Hour * 24;
    var ms_Mon = ms_Day * 30;
    var ms_Yr = ms_Day * 365;
    var diff = curr - prev;

    let current = new Date(prev);
    var d1 = new Date(prev);
    const monthName = current.toLocaleString("default", { month: "long" })
    var date = monthName.substr(0, 3) + " " + current.getMonth();
    //  date +"-"+current.getFullYear();
    if (diff < ms_Min) {

      if (Math.round(diff / 1000) == 0) {
        return 'Just now';
      } else {
        return Math.round(diff / 1000) + ' sec';
      }

    } else if (diff < ms_Hour) {
      return Math.round(diff / ms_Min) + ' min';
    } else if (diff < ms_Day) {
      return Math.round(diff / ms_Hour) + 'hr';
    } else {
      return d1.toLocaleString();

    }
  }

  // check date greater
  checkGreaterDate(formDate, serverdate) {
    let fdate1 = formatDate(new Date(formDate), 'yyyy-MM-dd', 'en_US');
    let sdatet2 = formatDate(serverdate, 'yyyy-MM-dd', 'en_US');


    if (fdate1 == sdatet2) {

      return false;
    } else {

      return true;
    }
  }

  dateFormatestring(date: string): Date {
    // convert param date do browser time zone date




    if (date.includes('T')) {
      const splitDate = date.split('T')[0];
      const final = splitDate.split('-');
      const datess: Date = new Date();
      datess.setDate(+final[2])
      datess.setMonth(+final[1] - 1)
      datess.setFullYear(+final[0]);
      datess.setHours(0, 0, 0, 0);
      return datess;
    }

    return new Date(date);
  }

  formatDateddd(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }



  dateInPast(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }


  validformate(date) {
    let dates = formatDate(new Date(date), 'yyyy-MM-dd', 'en_US');
    return dates;

  }


  encrypt(value) {
    var encrypt = encodeURIComponent(CryptoJS.AES.encrypt(value, "Gigsumo!@#$%^&*()").toString());
    return encrypt;
  }
  decrypt(value) {

    var tempdata: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(decodeURIComponent(value), "Gigsumo!@#$%^&*()");

    var decrypt: any = tempdata.toString(CryptoJS.enc.Utf8);

    return decrypt;
  }
  private resumeRequestedSubject = new BehaviorSubject<Map<string, boolean>>(new Map());
  resumeRequested$ = this.resumeRequestedSubject.asObservable();

  setResumeRequested(candidateId: string, value: boolean) {
    const currentMap = this.resumeRequestedSubject.value;
    currentMap.set(candidateId, value);
    this.resumeRequestedSubject.next(currentMap);
  }

}
