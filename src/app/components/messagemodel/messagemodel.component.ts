import { BsModalService } from 'ngx-bootstrap/modal';
import { PageType } from './../../services/pageTypes';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messagemodel',
  templateUrl: './messagemodel.component.html',
  styleUrls: ['./messagemodel.component.scss']
})
export class MessagemodelComponent implements OnInit {
  modalRef: BsModalRef;
    constructor(private router: Router,private pageType: PageType,private modalService: BsModalService) { }

  ngOnInit() {
  }

  modelhide() {
    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
      this.modalService.hide(i);
    }
    // this.PopupServicevlaues(null)
    // this.modalRef.hide()
  }

}
