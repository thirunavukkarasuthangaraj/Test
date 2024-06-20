import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ProfilePhoto {
    constructor(){}
    subject = new Subject<any>();
    bannerPhoto = new Subject<any>();
    businessBannerPhoto = new Subject<any>();

    setPhoto(value){
        this.subject.next(value)
    }

    getPhoto(): Observable<any>{
        return this.subject.asObservable()
    }

    setBannerPhoto(value){
        this.bannerPhoto.next(value)
    }

    getBannerPhoto(): Observable<any>{
        return this.bannerPhoto.asObservable()
    }

    setBusinessBannerPhoto(value){
        this.businessBannerPhoto.next(value)
    }

    getBusinessBannerPhoto(): Observable<any>{
        return this.businessBannerPhoto.asObservable()
    }
}