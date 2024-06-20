import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomAccordionService {
  private isAccordionOpenSubject = new BehaviorSubject<boolean>(false);
  isAccordionOpen$: Observable<boolean> = this.isAccordionOpenSubject.asObservable();
  constructor() { }

  toggleAction(isOpen: boolean) {
    this.isAccordionOpenSubject.next(isOpen);
  }
}
