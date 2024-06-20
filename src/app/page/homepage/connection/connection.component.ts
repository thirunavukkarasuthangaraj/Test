import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { UserCardConfig } from 'src/app/types/UserCardConfig';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  connectionData: any = "CONNECTED"
  connectionlistuserdata: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  // recivedListUserData:any;
  //InvitationListUserData:any;
  listConnection: any;
  noDatafound: Array<string>;
  showNoDatafound: boolean = false;
  @ViewChild('landingside1') menuElement: ElementRef;
  landingsidesticky1: boolean = false;
  landingsidesticky2: boolean = false;
  elementPosition: any;
  allData: boolean = true;
  stopScroll : boolean = false;
  recivedData: boolean = false;
  InvitationData: boolean = false;
  prevAfterkey : Array<any> = [];
  btnnameshow: any;
  connectallshow: boolean = false;
  allConnectallshow: boolean = false;
  Requestshow: boolean = false
  Invitationsshow: boolean = false;
  connect: boolean = true;
  allConnect: boolean = true;
  requestsent: boolean = false;
  requestrecived: boolean = false;
  isEnabled: boolean = false;
  userCardConfig: UserCardConfig[] = []
  Search = "";
  loadAPIcall:boolean=false
  status = "all";
  filterame;
  count: number = 0;
  searchKey
  searchSubject = new Subject<string>();

  constructor(
    private util: UtilService,
    private api: ApiService,
    private searchData : SearchData) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.apicall(this.status);
    //this.recivedConnection();
    //this.Invitation_Sent();

    this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
      .subscribe(
        res => {
          this.updateSearch();
        }
      )

  }
  @HostListener('window:scroll')
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= 24) {
      this.landingsidesticky1 = true;
      this.landingsidesticky2 = true;
    } else {
      this.landingsidesticky1 = false;
      this.landingsidesticky2 = false;
    }
  }

  onsearch(val) {
    this.Search = val;
    this.apicall(this.status);
  }

  searchContent:string="";
  obj: any = {
    limit: 12,
    userId: localStorage.getItem('userId'),
    searchAfterKey: null,
    status:this.status,
    searchContent:this.searchContent
  }


  keyupdata(value : string) {
      this.searchSubject.next(value);
  }

  updateSearch(){
    if (this.searchContent.trim() !== "") {
      this.obj.searchContent = this.searchContent.trim();
    } else {
      this.obj.searchContent = null; // or an empty string, depending on your API requirements
    }
    this.obj.searchAfterKey = null;
    this.count = 0;
    this.stopScroll = false;
    this.connectionlistuserdata.next([]); // Clearing old data
    this.apicall(this.status); // Fetching new data
  }



  onScrollDown() {
    if(this.obj.searchAfterKey!=this.prevAfterkey){
      this.obj.searchAfterKey = (this.prevAfterkey && this.prevAfterkey.length === 0) ? null : this.prevAfterkey;
      this.apicall(this.status);
    }

  }
  filterstatus(filter, status?: string){
    this.obj.searchAfterKey=null;
    this.count=0
    this.stopScroll=false
    this.connectionlistuserdata.next([]);
    this.apicall(filter);
  }

  apicall(filter, status?: string) {
if(this.stopScroll){
  return
}

    this.loadAPIcall = true;
    let noData: Array<string> = [];
    this.obj.status = filter;
    this.status = filter;
    if (this.status === 'CONNECTED') {
      noData = [
        'No Active  Connection'
      ]
      this.btnnameshow = 'Active Connections'
      this.connectallshow = false;
      this.Requestshow = true;
      this.Invitationsshow = true;
      this.connect = true;
      this.requestsent = false;
      this.requestrecived = false;
      // this.obj.searchAfterKey=null;
      // this.prevAfterkey=null
      this.allConnect = false;
      this.allConnectallshow = false;
    } else if (this.status === 'Invitation_Received') {
      noData = [
        'No Connection Requests Received'
      ]
      this.btnnameshow = 'Requests Received'
      this.connectallshow = true;
      this.Requestshow = false;
      this.Invitationsshow = true;
      this.connect = false;
      this.requestsent = false;
      // this.obj.searchAfterKey=null;
      // this.prevAfterkey=null
      this.requestrecived = true;
      this.allConnect = false;
      this.allConnectallshow = false;
    } else if (this.status === 'Invitation_Sent') {
      noData = [
        'No Connection Requests Sent'
      ]
      this.btnnameshow = 'Requests Sent'
      this.connectallshow = true;
      this.Requestshow = true;
      this.Invitationsshow = false;
      this.allConnect = false;
      this.connect = false;
      this.requestsent = true;
      // this.obj.searchAfterKey=null;
      // this.prevAfterkey=null
      this.requestrecived = false;
      this.allConnectallshow = false;
    } else if (this.status === 'all') {
      noData = ['b Please do one of the below, for Connections to be listed in the page',
        '1 . Update your profile with your company business email ID.',
        '2 . Complete your current work experience section in your profile.',
        '3 . Search for your colleagues by name.',
        '4 . click "Connect" on user profile.']
      this.btnnameshow = 'All'
      this.allConnect = true;
      this.connect = false;
      this.requestsent = false;
      this.requestrecived = false;
      // this.obj.searchAfterKey=null;
      // this.prevAfterkey=null
      this.allConnectallshow = true;
    }

    this.isEnabled = true;
    this.api.create("user/connection/info", this.obj).subscribe(res => {
      this.loadAPIcall = false;
      this.isEnabled = false;

      let data = res.data.response;

      data.forEach(element => {
        element.userName = element.firstName + " " + element.lastName;
        if (filter === "CONNECTED") {
          element.connectionStatus = "CONNECTED";
          element.page = "connectionList";
        } else if (filter === "Invitation_Sent") {
          element.page = "connectionList";
          element.connectionStatus = "REQUEST_SENT";
        } else if (filter === "Invitation_Received") {
          element.page = "connectionList";
          element.connectionStatus = "REQUEST_PENDING";
        } else if (filter === "all") {
          if (element.connectionStatus === "CONNECTED") {
            element.page = "connectionList";
            element.connectionStatus = "CONNECTED";
          } else if (element.connectionStatus === "REQUEST_SENT") {
            element.page = "connectionList";
            element.connectionStatus = "REQUEST_SENT";
          } else if (element.connectionStatus === "REQUEST_PENDING") {
            element.page = "connectionList";
            element.connectionStatus = "REQUEST_PENDING";
          }
        }
      });

      if (data != null) {
        const resData = data;
        const afterKey = res.data && res.data.searchAfterKey;
        if (resData) {

          if (JSON.stringify(this.prevAfterkey) === JSON.stringify(afterKey) || resData.length === 0) {
            this.stopScroll = true;
          }


          this.prevAfterkey = afterKey;
          const combined = [...this.connectionlistuserdata.getValue() , ...resData];
          this.connectionlistuserdata.next(combined);


          if (res.data.total!=undefined) {
            this.count = res.data.total;
          }


          if (this.connectionlistuserdata.getValue().length == 0) {
            this.showNoDatafound = true;
            this.noDatafound = noData;
          } else {
            this.showNoDatafound = false;
          }

        }

        if (status === "ACCEPTCONNECT") {
          this.searchData.setContactCount(1);
        }
        else if (status === "REMOVE_CONNECTION") {
          this.searchData.setContactCount(-1);
        }

      }

    }, err => {
      this.util.stopLoader();

    });
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      if (sortOrder == -1) {
        return b[property].localeCompare(a[property]);
      } else {
        return a[property].localeCompare(b[property]);
      }
    }
  }



  recivedConnection() {
    let recived = " Invitation_Received "
    let datas: any = {};
    datas.status = recived;
    datas.userId = localStorage.getItem('userId');
    this.isEnabled=true;
    this.api.create("user/connection/info", datas).subscribe(res => {
      this.isEnabled=false;
      res.data.response.forEach(element => {
        element.userName = element.firstName + " " + element.lastName;
      });

      this.connectionlistuserdata = res.data.response;
      this.allData = false;
      this.recivedData = true;
      this.InvitationData = false;
    });
  }

  Invitation_Sent() {
    let Invitation = " Invitation_Sent"
    let datas: any = {};
    datas.status = Invitation;
    datas.userId = localStorage.getItem('userId');
    this.isEnabled=true;
    this.api.create("user/connection/info", datas).subscribe(res => {
      this.isEnabled=false;
      // //// console.log('Invitation Connected Data List',res);
      res.data.response.forEach(element => {
        element.userName = element.firstName + " " + element.lastName;
      });
      this.connectionlistuserdata = res.data.response;
      this.allData = false;
      this.recivedData = false;
      this.InvitationData = true;
    });
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);

  }


  incomingStatus : string = "";
  // handleUserCardEvent(data: any): void {
  //   if (data.event != undefined && data.event != null && data.event != 'ACCEPTCONNECT') {
  //     this.connectionlistuserdata = this.connectionlistuserdata.filter(element => element.userId != data.data.userId);
  //   } else if (data.event == 'ACCEPTCONNECT' && this.status == 'Invitation_Received') {
  //     this.connectionlistuserdata = this.connectionlistuserdata.filter(element => element.userId != data.data.userId);
  //   } else if (data.event == 'REJECTEDCONNECT') {
  //     this.connectionlistuserdata = this.connectionlistuserdata.filter(element => element.userId != data.data.userId);
  //   }

  //     this.apicall(this.status , data.event);

  // }


  handleUserCardEvent(data: any): void {
    if (data.event != undefined && data.event != null && data.event != 'ACCEPTCONNECT') {
      this.updateConnectionList(data.data.userId);
    } else if (data.event == 'ACCEPTCONNECT' && this.status == 'Invitation_Received') {
      this.updateConnectionList(data.data.userId);
    } else if (data.event == 'REJECTEDCONNECT') {
      this.updateConnectionList(data.data.userId);
    }

    this.apicall(this.status, data.event);
  }

  private updateConnectionList(userId: any): void {
    const currentValue = this.connectionlistuserdata.getValue();
    const updatedValue = currentValue.filter((element: any) => element.userId != userId);
    this.connectionlistuserdata.next(updatedValue);
  }

}
