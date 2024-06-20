import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';
@Component({
    selector: 'app-message',
    templateUrl: 'message.component.html'
})

export class MessageComponent {
    subscription: Subscription;
    constructor(public message: MessageService) {
    }
    sendMessage(message, type): void {
        this.message.sendMessage(message, type);
    }
    clear(): void {
        this.message.clear();
    }

};
