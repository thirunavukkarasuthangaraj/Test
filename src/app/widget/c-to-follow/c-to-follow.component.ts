import { Component, OnInit, Output, TemplateRef, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppSettings } from 'src/app/services/AppSettings';
import { GlobalCommunity } from 'src/app/components/bussiness-post/bussiness-post.component';
import { CommunityListComponent } from 'src/app/page/homepage/community-list/community-list.component';
import { SearchData } from 'src/app/services/searchData';
@Component({
  selector: 'app-c-to-follow',
  templateUrl: './c-to-follow.component.html',
  styleUrls: ['./c-to-follow.component.scss']
})
export class CToFollowComponent implements OnInit {

  viewType: string = "MIN";
  headerTitle: "Community To Follow";
  user: any = [];
  commonDatahide: any = {}
  // @Output()  commonFunction = new EventEmitter<string>();
  // @Input() maxMin: any = {};
  // @Input() inputData: string;
  modalRef: BsModalRef;
  communitySuggestion: any;
  page: any = 1;
  // @Input() widgetDesc: string;
  pathdata: any;
  limit: number = 4;
  totalCount: any;
  selectedEntities: any = []
  checkedList: any = [];
  followers: any = [];
  searchName: any;
  imgUrl: any = AppSettings.photoUrl

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false,
  };
  beingTyped: boolean;
  theChecker: boolean;


  @Output() commonFunction = new EventEmitter<string>();
  @Input('title') title: string = 'Community to Follow ';
  @Input() inputData: string;

  // get min max from view more click from sugg component
  @Input() maxMin: any = {};
  @Input() widgetDesc: string;

  communitydata: any;


  constructor(private auth: ApiService, private searchData: SearchData, public globalCommunity: GlobalCommunity, private router: Router, private util: UtilService, private modalService: BsModalService) {
  }


  ngOnInit() {
    this.getSuggestions();

  }
  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.menu = this.widgetDesc;
    dataPass.widgetName = "CToFollowComponent";
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }
  getSuggestions() {
    let data: any = {};
    data.userId = localStorage.getItem('userId'),
      data.limit = String(this.limit),
      data.page = this.page - 1;

    this.util.startLoader();
    this.auth.create('widget/community/suggestion', data).subscribe((res) => {
      this.util.stopLoader();

      if (res.data != null && res.data.communitysuggestion != null && res.data.communitysuggestion.length !== 0) {
        this.communitySuggestion = res.data.communitysuggestion;
        this.communitySuggestion.forEach(com => {

          if (this.checkedList.includes(com.communityId)) {
            com.checked = true;
          }
          else {
            com.checked = false;
          }

        });


        if (res.data.totalCount != null) {
          this.totalCount = res.data.totalCount;
        }
      } else {
        this.hide(true);
      }

    }, err => {
      this.util.stopLoader();

      this.hide(true);


    });

  }


  openModal(postTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(postTemplate, this.backdropConfig);
    this.limit = 8;
    this.getSuggestions();
    this.viewType = "MAX";
  }

  closeModal() {

    setTimeout(() => {
      this.page = 1;
      this.searchName = ''
      this.theChecker = false
      this.selectedEntities = []
      this.checkedList = []
    }, 1000);
    this.limit = 4;

    this.getSuggestions();
    this.viewType = "MIN"
    if(this.modalRef){
      this.modalRef.hide();
    }
  }

  onCheckboxChange(data, event) {

    if (event.target.checked) {
      if (!this.selectedEntities.includes(data.communityId)) {
        this.selectedEntities.push(String(data.communityId))
        this.checkedList.push(String(data.communityId))
      }

    }
    else {
      for (var i = 0; i < this.selectedEntities.length; i++) {

        if (this.selectedEntities[i] == data.communityId) {
          this.checkedList.splice(i, 1);
          this.selectedEntities.splice(i, 1);
        }
      }
      this.theChecker = false
    }
  }

  checkAll(event) {
    if (event.target.checked == true) {
      this.theChecker = true;
      this.communitySuggestion.forEach(ele => {
        if (!this.selectedEntities.includes(ele.communityId)) {
          ele.checked = true
          this.selectedEntities.push(String(ele.communityId))
          this.checkedList.push(String(ele.communityId))
        }

      })
    }
    else if (event.target.checked == false) {
      this.selectedEntities = []
      this.checkedList = []
      this.communitySuggestion.forEach(ele => {
        ele.checked = false
      })

      this.theChecker = false;
    }
  }

  onSearch(event: any) {
    if (event.target.value != '') {
      this.beingTyped = true
    } else if (event.target.value == '') {
      this.beingTyped = false
    }
  }

   join(communityData) {

    this.util.startLoader();
    let userId = localStorage.getItem('userId')
    let data: any = {};
    let apiName: string;

    if (communityData.globalCommunity) {
      data.userId = localStorage.getItem('userId');
      data.userType = localStorage.getItem('userType');
      apiName = 'community/addToGigsumoCommunity';
    }
    else {
      data.communityId = communityData.communityId;
      data.userId = userId;
      apiName = 'community/join';
    }

    this.auth.create(apiName, data).subscribe((res) => {
      this.util.stopLoader();
      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Community Member Request",
          text: communityData.communityType ? "Requested Successfully." : "Joined Successfully.",
          showConfirmButton: false,
          timer: 2000,
        });
        this.globalCommunity.joined = communityData.globalCommunity;
        this.globalCommunity.communityData = res.data.community;
        this.searchData.setBooleanValue({boolean : true});
        this.ngOnInit();
      }

    }, err => {
      this.util.stopLoader();
    });
    this.closeModal();
  }


  joinAll() {
    this.util.startLoader();
    let userId = localStorage.getItem('userId')
    this.selectedEntities.forEach(bus => {
      let data: any = {};
      data.communityId = bus;
      data.userId = userId;
      this.followers.push(data);
    });


    this.auth.create('community/joinAll', this.followers).subscribe((res) => {
      this.util.stopLoader();
      if (res.code === "00000") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Requested Successfully.",
          text: "Requested Successfully.",
          showConfirmButton: false,
          timer: 2000,
        })
        this.ngOnInit();
      }

    }, err => {
      this.util.stopLoader();
    });
    this.closeModal();
  }

  route(data) {
    this.router.navigate(['community'], { queryParams: data, replaceUrl: true });
    this.closeModal();
  }

  movePage(event) {
    this.page = event;
    this.getSuggestions();
  }

  hide(flag) {
    this.commonDatahide.widgetName = "CToFollowComponent";
    this.commonDatahide.hide = flag;
    this.commonFunction.emit(this.commonDatahide);
  }
}
