import { environment } from 'src/environments/environment';
import { SearchData } from './../../../services/searchData';
import { AppSettings } from './../../../services/AppSettings';
import { StreamService } from './../../../services/stream.service';
import { UtilService } from './../../../services/util.service';
import { ApiService } from './../../../services/api.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PageType } from './../../../services/pageTypes';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, interval, Observable, Subject, Subscription, timer } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-credit-model',
  templateUrl: './credit-model.component.html',
  styleUrls: ['./credit-model.component.scss']
})
export class CreditModelComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  creditform: UntypedFormGroup;
  submited: boolean = false;
  points: any = [];
  availableredim: any = [];
  redeimform: UntypedFormGroup;
  messageShow = false;
  rxjsTimer = timer(AppSettings.timerSocket);
  showmodel = false;
  streamData: any = [];
  destroy = new Subject();
  clickEventsubscription: Subscription;
  subscription: Subscription;
  public envName: any = environment.name;
  constructor(
    private modalService: BsModalService, private bsModalRef: BsModalRef, private activateRoute: ActivatedRoute,
    private api: ApiService, private fb: UntypedFormBuilder, private util: UtilService, private router: Router, private searchdata: SearchData, private pageType: PageType, private stremService: StreamService) {
    this.clickEventsubscription = this.stremService.getstreamResponse().subscribe(streamData => {
      this.streamData = streamData;
    })
  }

  ngOnInit() {

    this.creditform = this.fb.group({
      point: [null, Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])]
    });


  }


  modelhide() {

    for (let i = 1; i <= this.modalService.getModalsCount(); i++) {

      this.modalService.hide(i);

    }
  }

  creditModelHide() {
    this.bsModalRef.hide()
    this.modalRef.hide();
  }
  //purchesCredit(){
  // this.modelhide()
  // this.router.navigate(["/personalProfile"], { queryParams: {'userId':localStorage.getItem('userId')} });
  // setTimeout(() => {
  //   var data: any = {}
  //   data.pages = 'credits'
  //   this.pageType.setPageName(data)
  // }, 2000);

  //}


  get candidateControls() {
    return this.creditform.controls
  }

  purchesCredit() {
    //this.showmodel = true
    // this.modalRef = this.modalService.show(template);
    // this.closeAll();
    this.modelhide();
    setTimeout(() => {
      let config: any = this.modalService;
      let data: any = {};

      if (config.config.initialState.size != null) {
        data.sufficient = true;
        data.routingBack = config.config.initialState.size;
      }

      var a = this.activateRoute.pathFromRoot[0]['_routerState']['snapshot'].url
      data.path = a;
      this.router.navigate(['checkout'], { queryParams: data });

    }, 500);
    this.ngOnDestroy()

  }
  ngOnDestroy() {
    // console.log('Items destroyed');
  }



}
