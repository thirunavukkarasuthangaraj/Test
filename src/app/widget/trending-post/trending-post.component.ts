import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-trending-post',
  templateUrl: './trending-post.component.html',
  styleUrls: ['./trending-post.component.scss']
})
export class TrendingPostComponent implements OnInit {
  @Output()  commonFunction = new EventEmitter<string>();
  commonDatahide:any={}
  @Input('title') title: string = 'Quick reference';
  modalRef: BsModalRef;
  headerTitle
  user: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  @Input() widgetDesc: string;
  titleforModel:any;
  modelType:string;
  constructor(private a_route: ActivatedRoute,private router: Router,private modalService: BsModalService) {
  }

  hide(flag){
    this.commonDatahide.widgetName="TrendingPostComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }
  
  modelopen(name) {
    let datas:any={};
    datas.menu=name;
    this.router.navigate(['help'], { queryParams: datas });
    // if(name=='job'){
    //   this.titleforModel="How to create your first Job?"
    //   this.modelType='job';
    // }  else if(name=='candidate'){
    //   this.titleforModel="How to create your first Candidate?"
    //   this.modelType='candidate';
    // }
    // this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.headerTitle = this.widgetDesc;
    this.hide(true)
    this.a_route.queryParams.subscribe((res) => {
      if (res.master && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }
    })
  }

}
