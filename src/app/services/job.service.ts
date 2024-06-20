import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from './AppSettings';
import { GigsumoConstants } from './GigsumoConstants';
import { responseObject } from './UserService';
import { ApiService } from './api.service';
import { UtilService } from './util.service';

export type widgetData = Pick<responseObject, "userId" | "limit" | "searchAfterKey">;
export type InteractionwidgetData = Pick<responseObject, "userId" | "limit" | "searchAfterKey" | "interactionType">;

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private isSliderOpenSubject = new Subject<{ value: boolean, panel: string, filterData: any }>();
  private dataForFilterSubject = new BehaviorSubject<any>(null);
  private confirmationResultSubject = new Subject<void>(); // No need for any specific value here

  confirmationResult$ = this.confirmationResultSubject.asObservable();
  private reloadSubject = new BehaviorSubject<boolean>(false);


  private dataForReset = new Subject<boolean>();
  colorMap: Map<string, string> = new Map();

  private searchAfterKey: [string] = null;
  stopScroll: boolean = false;
  previousKey: string = null;
  userId: string = localStorage.getItem('userId');
  constructor(private API: ApiService, private util: UtilService) { }
  reloadComponent() {
    this.reloadSubject.next(true);
  }

  getReloadSignal() {
    return this.reloadSubject.asObservable();
  }
  getSearchAfterKey(): [string] {
    return this.searchAfterKey;
  }


  confirmResult() {
    this.confirmationResultSubject.next(); // Emit the confirmation signal
  }

  findActieJobs(data: widgetData): Observable<any> {

    return this.API.create("jobs/findActiveJobs", data).pipe(
      map(response => {
        this.util.stopLoader();

        if (response.code && response.code !== "00000") {
          throw new Error("There is some issue with Server");
        }
        if (response.data && response.data.jobList) {

          response.data.jobList.forEach(ele => {
            if (ele.user) {
              if (ele.user.photo != null) {
                ele.user.photo = AppSettings.photoUrl + ele.user.photo;
              } else {

                ele.user.photo = null;
              }
            }
          });

          response.data.jobList = [...response.data.jobList];
        }
        return response.data;
      })
    );
  }


  findJobAppliedByTheUser(data: widgetData): Observable<any> {
    return this.API.create("jobs/findJobAppliedByTheUser", data).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  responseBody = {
    userId: this.userId,
    limit: 4,
    searchAfterKey: null
  };


  findByJobId(jobId: string): Observable<any> {
    return this.API.query("jobs/findJobById/" + jobId).pipe(
      map(response => {
        if (response != null) {
          if (response.code && response.code != GigsumoConstants.SUCESSCODE) {
            throw new Error("There is some issue with Server");
          }
          return response.data;
        }
      })
    );
  }

  findUserInteractionsForThePlan(data: InteractionwidgetData): Observable<any> {

    return this.API.create("jobs/findUserInteractionsForThePlan", data).pipe(
      map(response => {
        this.util.stopLoader();
        if (response != null) {

          if (response.code && response.code != GigsumoConstants.SUCESSCODE) {
            throw new Error("There is some issue with Server");
          }

          if (response.data && response.data.jobsApplied) {

            response.data.jobsApplied.forEach(ele => {
              if (ele.user) {
                if (ele.user.photo != null) {
                  ele.user.photo = AppSettings.photoUrl + ele.user.photo;
                } else {

                  ele.user.photo = null;
                }
              }
            });
            response.data.jobsApplied = [...response.data.jobsApplied];
          }
          if (response.data && response.data.resumesDownloaded) {

            response.data.resumesDownloaded.forEach(ele => {
              if (ele.user) {
                if (ele.user.photo != null) {
                  ele.user.photo = AppSettings.photoUrl + ele.user.photo;
                } else {

                  ele.user.photo = null;
                }
              }
            });
            response.data.resumesDownloaded = [...response.data.resumesDownloaded];
          }
          return response.data;
        }
      })
    )
  }

  setSliderToggle(value: boolean, panel: string, filterData: any): void {
    this.isSliderOpenSubject.next({ value, panel, filterData });
  }

  getSliderToggle(): Observable<any> {
    return this.isSliderOpenSubject.asObservable();
  }

  setDataForFilter(data: any): void {
    this.dataForFilterSubject.next(data);
  }

  getDataForFilter(): Observable<any> {
    return this.dataForFilterSubject.asObservable();
  }

  setReset(data: boolean): void {
    this.dataForReset.next(data);
  }

  getReset(): Observable<boolean> {
    return this.dataForReset.asObservable();
  }

  getInitials(fullname: string): string {
    if (!fullname || typeof fullname !== 'string') {
      return '';
    }

    // Check if the full name has spaces
    if (fullname.includes(' ')) {
      // if (words.length > 2) {
      //   const firstTwoWords = words.slice(0, 2);
      //   const initials = firstTwoWords.map(word => word.charAt(0)).join('');
      //   return initials.toUpperCase();
      // } else {
      //   const initials = words.map(word => word.charAt(0)).join('');
      //   return initials.toUpperCase();
      // }
      const words = fullname.split(' ');
      let initials = '';
      initials += words[0].charAt(0);
      const lastname = words[words.length - 1];
      initials += lastname.charAt(0);
      return initials.toUpperCase();
    } else {
      const initials = fullname.substr(0, 2);
      return initials.toUpperCase();
    }
  }

  getColor(username: string): string {
    if (!username) {
      return '';
    }

    // Generate a hash based on the username
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash to a hexadecimal color code
    const color = '#' + ((hash & 0x00FFFFFF).toString(16)).toUpperCase().padStart(6, '0');

    if (!this.colorMap.has(username)) {
      this.colorMap.set(username, color);
    }

    return this.colorMap.get(username) || '';
  }

  getInitialsparam(firstname: string, lastname: string): string {
    if (!firstname || !lastname) {
      return '';
    }

    if (firstname.includes(' ') || lastname.includes(' ')) {
      const fullname = firstname + ' ' + lastname;
      const words = fullname.split(' ');
      let initials = '';
      initials += words[0].charAt(0);
      const endingName = words[words.length - 1];
      initials += endingName.charAt(0);
      return initials.toUpperCase();
    } else {
      const initials = `${firstname.charAt(0)}${lastname.charAt(0)}`;
      return initials.toUpperCase();
    }
  }

  getColorparam(firstname: string, lastname: string): string {
    const fullName = `${firstname} ${lastname}`;

    // Generate a hash based on the full name
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash to a hexadecimal color code
    const color = '#' + ((hash & 0x00FFFFFF).toString(16)).toUpperCase().padStart(6, '0');

    if (!this.colorMap.has(fullName)) {
      this.colorMap.set(fullName, color);
    }

    return this.colorMap.get(fullName) || '';
  }



}
