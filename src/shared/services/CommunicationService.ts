// shared/communication.service.ts
import { Injectable } from '@angular/core';
import { Callback } from '../interfaces/Callback';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private callback: Callback;

  setCallback(callback: Callback) {
    this.callback = callback;
  }

  triggerMethod(data: string) {
    if (this.callback) {
      this.callback.executeMethod(data);
    }
  }
}
