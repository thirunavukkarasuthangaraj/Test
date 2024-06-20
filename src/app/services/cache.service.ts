import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor(private cookieService: CookieService) { }

  setValue(key,value){
    this.cookieService.set(key, value);
  }

  getValue(key){
   return this.cookieService.get(key);
  }

  setLocalStorage(key,value){
    localStorage.setItem(key, value);
  }

  getLocalStorage(key){
   return localStorage.getItem(key);
  }

}
