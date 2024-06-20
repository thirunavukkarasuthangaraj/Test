import { findIndex } from 'rxjs/operators';
import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, OnDestroy, ViewEncapsulation, ViewChildren, QueryList, OnChanges, SimpleChanges } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { ApiService } from '../../services/api.service';
import { AppSettings } from '../../services/AppSettings';
import { UtilService } from '../../services/util.service';
import { NgxSummernoteDirective } from 'ngx-summernote';
declare var $: any;
import { fromEvent } from 'rxjs';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/services/job.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { StreamService } from 'src/app/services/stream.service';
import { SocketServiceStream } from 'src/app/services/SocketServiceStream';


@Component({
  selector: 'app-message-widget',
  templateUrl: './message-widget.component.html',
  styleUrls: ['./message-widget.component.scss'],
})
export class MessageWidgetComponent implements OnInit, OnDestroy , OnChanges {
  @Input() messageDataPass: any;
  @Input() userData: any;
  @Output() closeMessageModel: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(NgxSummernoteDirective) summernote: NgxSummernoteDirective;
  sendMessageData: any = {};
  listerData
  config = {
    focus: true,
    placeholder: 'Enter message',
    toolbar: []
  };
  messageList: any = [];
  pagination = 10;
  currentIndex = 0;
  url = AppSettings.photoUrl;
  loaderstartstop = true;
  toptobotom = false;
  @ViewChild('container') chartDisc: ElementRef;
  @ViewChildren("messageContainer") messageContainers: QueryList<ElementRef>;
  @ViewChild('container') container: ElementRef;
  @ViewChild("autofocusSendmsg") autofocusSendmsg;
  @ViewChild('chartDiscussion', { static: true }) _div: ElementRef;
  exits = false;
  disableSendmsg = false;
  startCount = 0;
  pageCount = 7;
  currentPageCount = 0;
  userId = localStorage.getItem('userId');
  searchName: any;
  modalScrollDistance = 4;
  modalScrollThrottle = 100;
  searchAfterKeys = null;
  nodatafound = "No conversations yet"
  shownodatafound = false;
  editMessage: boolean = false
  editValue: any;
  FormData: any;
  scrollbarload: boolean = false;
  contactList: Array<any> = [];
  photo: any;
  authorPhoto: any;
  selectedUser;
  loginUserData;
  private subscription: Subscription = new Subscription();

  topicMessageSub: Subscription;
  topic_newcontacts_Subscribe: Subscription;
  topic_contacts_Subscribe: Subscription;
  streamsubscription: Subscription;

  constructor(private _socket: SocketService,private JobServicecolor: JobService, private util: UtilService, private api: ApiService,
    private streamService : SocketServiceStream
  ) {
    $.extend($.summernote.plugins, {
      'brenter': function (context) {
        this.events = {
          'summernote.enter': function (we, e) {
            if ((e.which === 13 || e.keyCode === 13) && e.altKey) {
            } else if (e.which === 13 || e.keycode === 13) {
              $('#sendmsg').click();
              e.preventDefault();
            }
          }
        };
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.messageDataPass){
      this.messageDataPass = changes.messageDataPass.currentValue;
      console.log("Sdusdstdftsuvdusg " , this.messageDataPass);
      this.messageDataPass.entityId=this.messageDataPass.jobReferenceId || this.messageDataPass.candidateReferenceId ;


      if(this.messageDataPass.removeConnection != undefined && this.messageDataPass.removeConnection){
        this.chatuserList();
      }
    }
  }

  Support:boolean=false
  ngOnInit() {
    this.currentIndex = 0;
    this.searchAfterKeys = null;
    // this.streamService.startStream();
    if (this.messageDataPass.owner) {
      this.chatuserList();
    } else {
      if(this.messageDataPass.onlySupport!=undefined && this.messageDataPass.onlySupport =="SUPPORT"){
        this.Support=true;
        this.loaderstartstop=false;
        if(this.messageDataPass.id){
           this.messageListget(this.messageDataPass);
        }

      }else{
        this.userDetails(null);
        this.messageListget(null);
      }

    }
    this.loginuser();

    setTimeout(() => {
      if (this.container && this.container.nativeElement) {
        const container: HTMLDivElement = this.container.nativeElement;
        fromEvent(container, 'scroll').subscribe((e: Event) => {
          if (e.target['scrollTop'] == 0) {
          }
        });
      } else {

      }
    }, 2000);


   this.streamsubscription =  this.streamService.onMessage('/topic/contacts/' + localStorage.getItem('userId')).subscribe(contact=>{

    if(this.contactList.length === 0)
    {

      if(this.exitData && contact.groupId === this.exitData.groupId){
          this.userData.online = contact.online ? "ONLINE" : "OFFLINE";
      }

    }
    else if(this.contactList.length > 0){

          this.contactList.forEach((element, i) => {
            if (element.groupId === contact.groupId) {

                if(element.online != contact.online){
                element.online = contact.online;
                if(this.selectedUser!=undefined){
                  this.userData.online = contact.online === true ? 'ONLINE' : 'OFFLINE';
                  console.log("USER_DATA " , this.userData);
                }
                }
              // this.previousEmit = contact;
            }
          });

    }


    });

  }



  loginuser() {
    this.api.query("user/" + localStorage.getItem('userId')).subscribe((res) => {
      if (res != undefined && res.code == "00000") {
        this.loginUserData = res;
      }
    });
  }
  getInitials(fullname: string): string {
    return this.JobServicecolor.getInitials(fullname);
  }

  getColor(fullname: string): string {
    return this.JobServicecolor.getColor(fullname);
  }
   // for first and last name
  getInitialName(firstname: string,lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname,lastname);
  }
   // for first and last name
   getColorName(firstname: string,lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname,lastname);
  }

  backchat(values) {

    this.messageDataPass.owner = true;
    this.messageList = [];
    this.pagination = 10;
    this.currentIndex = 0;
    this.searchAfterKeys = null;
    this.contactList.forEach((element, i) => {
      if (element.groupId == values.recipientId) {
        element.nonSeenCount = 0;
      }
    });
    this.topicMessageSub.unsubscribe();

  }

  specfiuser(item) {

    this.messageDataPass.owner = false;
    this.messageDataPass.recipientId = item.groupId;
    this.messageDataPass.id = item.refererId;
    this.messageDataPass.entityId = item.entityId;
    if(item.groupType=='SUPPORT'){
      this.messageDataPass.id = item.groupId;
    }

    this.messageDataPass.groupType = item.groupType;
    this.messageDataPass.messageType = item.groupType;
    this.userDetails(item);
    this.messageListget(item);
    item.id = item.refererId;
    this.selectedUser = item;
  }

  previousEmit : any = {};
  public chatuserList() {
    this.loaderstartstop = true;
    let data: any = {}
    let combainedData = [];
    data.userId = localStorage.getItem('userId');
    data.groupType = "JOB,CANDIDATE,SUPPORT";

    if (this.messageDataPass.owner) {
      if (this.messageDataPass.groupType == "JOB" && this.messageDataPass.id != null) {
        data.groupType = "JOB";
      } else if (this.messageDataPass.groupType == "CANDIDATE" && this.messageDataPass.id != null) {
        data.groupType = "CANDIDATE";
      }
    }
    data.refererId = this.messageDataPass.id;

    let url = "findContactsByRefererId";
    // this.util.startLoader('msgspinner');
    this.api.messagePageService('POST', url, data).subscribe(res => {
       // this.util.stopLoader('msgspinner');


      // to get users
       let url = "message/new/contact/" + this.userId;
      // this.util.startLoader('msgspinner');
      this.api.messagePageService('GET', url).subscribe(userRes => {
        // this.util.stopLoader('msgspinner');
        this.loaderstartstop = false;
        if (userRes && userRes.length != 0) {
          combainedData = userRes;
          combainedData.forEach(elements => {
            elements.userId = elements.userId
            elements.groupType = "USER",
              elements.refererId = elements.refererId
            elements.groupId = elements.groupId
            elements.messageType = "USER"
          });


        }


        if (res.length == 0) {
          this.contactList = combainedData;
        }
        res.forEach(element => {
          if (element.lastMessageOn == null) {
            element.lastMessageOn = element.createdOn
          }
          this.contactList = res;
          if (this.contactList && this.contactList != null && this.contactList.length > 0) {
            this.contactList = this.sortBy(this.contactList, 'lastMessageOn');
            let datas = this.duplicate(this.contactList);
            this.contactList = datas;
            this.contactList = this.contactList.concat(combainedData);
          }

        });


      })




      this.topic_newcontacts_Subscribe = this._socket.onMessage('/topic/newcontacts/' + localStorage.getItem('userId')).subscribe((contact) => {
        //'topic/newcontacts', contact);

        var dateOne = new Date(contact.lastMessageOn); //Year, Month, Date
        var dateTwo = new Date(contact.lastModifiedOn); //Year, Month, Date


        if (dateOne > dateTwo) {
        } else { contact.lastMessageOn = contact.lastModifiedOn; }

        this.api.query("user/" + contact.createdBy).subscribe((ures) => {
          if (ures != undefined && ures.code == "00000") {
            contact.groupName = ures.firstName + " " + ures.lastName;

            contact.nonSeenCount = contact.nonSeenCount + 1;
            this.contactList.push(contact);
            this.contactList = this.sortBy(this.contactList, 'lastMessageOn');
            let data: any = {};
            data = this.duplicate(this.contactList);
            this.contactList = data;
          }
        });
      });

      this.topic_contacts_Subscribe = this._socket.onMessage('/topic/contacts/' + localStorage.getItem('userId')).subscribe((contact) => {


        this.contactList.forEach((element, i) => {

          if(this.previousEmit && this.isMatchable(this.previousEmit , contact)){

                if (element.groupId === contact.groupId) {
                  if(element.online != undefined && contact.online != undefined && (element.online != contact.online)){
                    element.online = contact.online;
                    if(this.selectedUser!=undefined){
                      this.userData.online = contact.online === true ? 'ONLINE' : 'OFFLINE';
                    }
                  }
                  else{
                        contact.groupName = element.groupName;
                        element.lastMessageOn = contact.lastMessageOn;
                        element.nonSeenCount = element.nonSeenCount + 1;
                        console.log("MESSAGE UPDATED " ,  element , contact);
                   }

                  this.previousEmit = contact;

                }

          }


        });

        this.contactList = this.sortBy(this.contactList, 'lastMessageOn');

      });
    });

  }

  isMatchable(previousEmit: any , data : any) : boolean{
    return (
      previousEmit.online != data.online ||
     previousEmit.lastMessageOn != data.lastMessageOn ||
     previousEmit.groupName != data.groupName );
  }


  duplicate(data) {
    var temp = [];
    var arr = data.filter(function (el) {
      // If it is not a duplicate, return true
      if (temp.indexOf(el.groupId) == -1) {
        temp.push(el.groupId);
        return true;
      }
      return false;
    });
    return arr;
  }

  sortBy(list: Array<any>, prop: string) {
    if (list != null && list.length > 0) {
      return list.sort((a, b) => {
        if (a.lastMessageOn == "null") {
          a[prop] = new Date();
          return <any>new Date(b[prop]) - <any>new Date(a[prop]);
        } else {
          return <any>new Date(b[prop]) - <any>new Date(a[prop]);
        }
      });
    }
  }






  private updateScoll() {
    setTimeout(() => {
      const container: HTMLDivElement = this.container.nativeElement;
      container.scrollTop = container.scrollHeight;

    }, 0)
  }


  exitData !: any;
  messageListget(values) {
    this.loaderstartstop = true;

    let contact: any = {
      userId: localStorage.getItem('userId'),
      // groupId: this.messageDataPass.userId,
      groupType: this.messageDataPass.groupType,
      messageType: this.messageDataPass.messageType,
      refererId: this.messageDataPass.id
    };


    if (values != undefined && values.groupType != "USER") {
      contact.userId = values.createdBy
      contact.groupType = values.groupType
      contact.messageType = values.groupType
      contact.refererId = values.refererId

      if(contact.groupType=='SUPPORT'){
        contact.refererId = this.messageDataPass.id;
        contact.groupId = this.messageDataPass.id;
         contact.userId = values.userId;
      }

    } else if (values != undefined && values.groupType == "USER") {

      contact.userId = values.userId
      contact.groupType = values.groupType
      contact.messageType = values.groupType
      contact.groupId = values.groupId
      contact.refererId = values.groupId
    }
    // if(this.messageDataPass.groupType=="USER" && values == null){
    //   contact.groupId= this.messageDataPass.userId
    // }

    if(this.messageDataPass.onlyuser!=undefined &&this.messageDataPass.onlyuser=="USER"){
      contact.groupId= this.messageDataPass.userId
    }

    let url = "message/contact/exist";
    // this.util.startLoader('msgspinner');
    this.api.messagePageService('POST', url, contact).subscribe(res => {
      // this.util.stopLoader('msgspinner');

      this.loaderstartstop = false;
      this.exitData = res;

      this.exits = res['exist'];
      if (res['exist'] || res['groupType']=="SUPPORT" && res.groupId!=undefined &&  res.groupId!=null) {

        if (values != null && values.nonSeenCount > 9) {
          this.toptobotom = true;
        }
        this.messageListQuery(res.groupId, "firstTime", values);
        this.messageDataPass.recipientId = res.groupId;

        setTimeout(() => {
          this.updateScoll();
        }, 1000);

        if (res['status'] == 'GROUP_INACTIVE') {
          this.disableSendmsg = true;
        } else {
          this.disableSendmsg = false;
        }

      } else {
        if (this.messageDataPass.groupType != "USER") {
          this.messageDataPass.recipientId = null;

        }
      }
      if (this.messageDataPass.groupType == "USER") {
        this.topic_message_recive(res)
      } else {
        this.topic_message_recive(res)
      }

    });


  }

  topic_message_recive(res) {

    if (this.messageDataPass.groupType == "USER") {
      res.groupId = res.groupId + '-' + localStorage.getItem('userId')
    }


    if (res.groupId != null) {
      this.topicMessageSub = this._socket.onMessage('/topic/message/' + res.groupId).subscribe(res => {
        if (res.eventType == "ACTION") {
          if (res.actionType == "DEACTIVATED") {
            this.disableSendmsg = true;
          } else {
            this.disableSendmsg = false;
          }
        }

        this.api.query("user/" + res.authorId).subscribe((response) => {
          if (response != undefined && response.code == "00000") {
            res.authorName = response.firstName + " " + response.lastName;
            res.authorPhoto = this.loginUserData.photo;
            if (res.userType == 'USER') {
              res.authorPhoto = response.photo;
            }
            if (res.action == "UPDATE") {
              let index = this.messageList.findIndex(item => item.messageId === res.messageId)
              if (res.deleted) {
                this.messageList[index].message = "This message was deleted";
              } else {
                this.messageList[index].message = res.message;
              }
              console.log("MESSAGE UPDATED " , this.messageList[index] , res);

            } else {
              this.messageList.push(res);

              if (!this.messageDataPass.owner) {
                this.updateNonSeenMessage(this.messageList);
              }
              this.updateScoll();
            }

          }
        });

        this.updateScoll();

      });
    }
  }


  messageListQuery(gpid, scrollLoad, values) {
    this.loaderstartstop = true;
    this.scrollbarload = true;
    let url = "messages";
    let msg: any = {
      authorId: localStorage.getItem('userId'),
      recipientId: gpid,
      refererId: this.messageDataPass.id,
      groupId: this.messageDataPass.userId,
      groupType: this.messageDataPass.groupType,
      messageType: this.messageDataPass.messageType,
      page: this.currentIndex,
      limit: this.pagination,
      searchAfterKey: this.searchAfterKeys,
    };

    if (this.toptobotom) {
      msg.page = 0,
        msg.limit = values.nonSeenCount

    }
    this.editMessage = false;
    // this.util.startLoader('msgspinner');
    this.api.messagePageService('POST', url, msg).subscribe(res => {
      // this.util.stopLoader('msgspinner');

      if (res) {
        this.loaderstartstop = false;
        if (res.data.messagesList != null) {
          let msgList = res.data.messagesList;
          this.searchAfterKeys = res.data.searchAfterKey;
          this.updateNonSeenMessage(msgList);
          if (msgList && msgList != null && msgList.length > 0) {
            msgList.forEach(element => {
              element.justSendmsg = false;
              if (element.deleted == true) {
                element.message = 'This message was deleted';
              }
              this.messageList.push(element);

              if (scrollLoad == "firstTime") {
                this.updateScoll();
              }

              if (this.toptobotom) {
                this.toptobotom = false;
                setTimeout(() => {
                  this.chartDisc.nativeElement.scroll({
                    behavior: "smooth", block: "top", inline: "nearest"
                  });
                  // const id = res.data.messagesList[0].messageId;
                  //     const element = document.getElementById(id);



                }, 400);

              }


            });
          }
        }

        if (this.messageList.length == 0) {
          this.shownodatafound = true
        } else {
          this.shownodatafound = false
        }

      }
    });
  }

  delete(item) {
    var url = "deleteMessages";
    var temp = [];
    temp.push(item);

    // this.util.startLoader('msgspinner');
    this.api.messagePageService('POST', url, temp).subscribe(res => {
      // this.util.stopLoader('msgspinner');

      this.messageList.forEach(element => {
        if (element.messageId == item.messageId) {
          element.message = "This message was deleted";
          element.enableDelete = false;
          element.attachments = null;
        }
      });
    }, err => {
      this.util.stopLoader();
    })
  }

  edit(item) {
    this.editMessage = true;
    this.editValue = item;
    this.sendMessageData['message'] = item.message;

  }

  updateMsg() {
    var url = "updateEditedMessage";
    // this.util.startLoader('msgspinner');
    this.editValue.message = this.sendMessageData['message'];
    this.FormData = new FormData();

    this.FormData.append('message', new Blob([JSON.stringify(this.editValue)],
      {
        type: "application/json"
      }));
    this.api.messagePageService('POST', url, this.FormData).subscribe(res => {
      // this.util.stopLoader('msgspinner');

      this.editMessage = false;
      this.messageList.forEach(element => {
        if (element.messageId == this.editValue.messageId) {
          element.message = this.editValue.message;;
          this.summernote.writeValue('');
          this.editValue = "";
          element.enableDelete = true;
        }
      });
    }, err => {
      this.util.stopLoader();

    })
  }


  sortByMsg(list: Array<any>, prop: string) {
    if (list != null && list.length > 0) {
      return list.sort((a, b) => {
        return <any>new Date(a[prop]) - <any>new Date(b[prop]);
      });
    }
  }

  onModalScrollDown() {
    this.currentPageCount += 1;
    this.startCount = this.currentPageCount;
    this.currentIndex = this.currentPageCount;
    if (this.startCount != 0) {
      this.messageListQuery(this.messageDataPass.recipientId, "", '');
    }
  }

  userDetails(value) {
    if (value != null) {
      var id: any;
      if (value.createdBy !=null && value.createdBy  != this.loginUserData.userId) {
        id = value.createdBy;
      }if (value.jobPostedBy  !=null && value.jobPostedBy != this.loginUserData.userId) {
        id = value.jobPostedBy;
      } else if( value.groupOwner != null) {
        id = value.groupOwner;
      }else{
        id = value.groupId;
      }


      this.api.query("user/" + id).subscribe((ress) => {
        if (ress != undefined && ress.code == "00000") {
          this.photo = ress.photo;
          if (ress.photo != null && ress.photo != null) {
            ress.photo = AppSettings.photoUrl + ress.photo;
          } else if (ress.photo != null && ress.photo == null) {
            ress.photo = "assets/images/userAvatar.png";
          }
          this.userData = ress;
        }
      });
    } else {
      this.api.query("user/" + this.messageDataPass.userId).subscribe((res) => {
        if (res != undefined && res.code == "00000") {
          this.photo = res.photo;
          if (res.photo != null && res.photo != null) {
            res.photo = AppSettings.photoUrl + res.photo;
          } else if (res.photo != null && res.photo == null) {
            res.photo = "assets/images/userAvatar.png"
          }
          this.userData = res;
        }
      });
    }

  }

  private updateNonSeenMessage(message: any) {
    let id = localStorage.getItem('userId');
    let url = "message/seen/" + id;
    //this._socket.send(url, message);
    this.api.messagePageService('PUT', url, message).subscribe(res => {
      if (res) { }
    });
  }



  closemodel() {
    this.closeMessageModel.emit(this.messageDataPass);
    if (this.topicMessageSub) {
      this.topicMessageSub.unsubscribe();
    }

    if (this.topic_newcontacts_Subscribe) {
      this.topic_newcontacts_Subscribe.unsubscribe();
    }
  }
  minimize() {
    this.closeMessageModel.emit(this.messageDataPass);
    this.topicMessageSub.unsubscribe();
    if (this.topic_newcontacts_Subscribe) {
        this.topic_newcontacts_Subscribe.unsubscribe();
    }
}



  sendmessage() {
    this.util.startLoader();
    if (typeof this.sendMessageData['message'] === 'string') {
      this.sendMessageData['message'] = this.sendMessageData['message'].replace(/&nbsp;|<\/?[^>]+(>|$)/g, "").trim();
      if (this.sendMessageData['message'] === undefined || this.sendMessageData['message'] == null || this.sendMessageData['message'].replace(/\s/g, "") === "") {
        return;
      }
    }

    this.loaderstartstop=true;
    this.disableSendmsg=true;
    this.sendMessageData['authorId'] = localStorage.getItem('userId');
    this.sendMessageData['recipientId'] = this.messageDataPass.recipientId;
    this.sendMessageData['userType'] = this.messageDataPass.groupType;
    this.sendMessageData['enableDelete'] = true;
    this.sendMessageData['messageType'] = this.messageDataPass.messageType;
    this.sendMessageData['refererId'] = this.messageDataPass.id;
    if (this.messageDataPass.groupType == "USER") {
      this.sendMessageData.recipientId = this.messageDataPass.recipientId;
      delete this.sendMessageData.refererId;

      if(this.messageDataPass.onlyuser!=undefined &&this.messageDataPass.onlyuser=="USER"){
        this.sendMessageData.recipientId= this.messageDataPass.userId;
        this.sendMessageData.refererId= this.messageDataPass.userId;
      }

    }
    const url = 'message/send';
    this.api.messagePageService('POST', url, this.sendMessageData).pipe(
      catchError((error) => {
        // Handle the error here
        console.error('An error occurred:', error);
        this.util.stopLoader();
        this.loaderstartstop = false;
        this.disableSendmsg = false;
        // Optionally, return a fallback value or an observable to recover
        return of(null); // You can replace null with a more meaningful fallback if necessary
      })
    ).subscribe(res => {
      if (!res) {
        // If catchError returned null, there might not be a response to process.
        // Handle this scenario appropriately.
        return;
      }
      this.util.stopLoader();
      this.loaderstartstop=false;
      this.disableSendmsg=false;

      if (this.exits == false) {
        res.groupId = res.recipientId;
        this.topic_message_recive(res);
        this.exits = true;
      }
      this.sendMessageData = {};
      this.sendMessageData['message'] = {};
      this.messageDataPass.recipientId = res.recipientId;
      res.authorName = this.loginUserData.firstName + " " + this.loginUserData.lastName;
      res.authorPhoto = this.loginUserData.photo;
      this.messageList.push(res);
      this.updateScoll();
      // this.autofocusSendmsg.nativeElement.click();
    });



  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.topic_contacts_Subscribe) {
      this.topic_contacts_Subscribe.unsubscribe();
    }
    if (this.topic_newcontacts_Subscribe) {
      this.topic_newcontacts_Subscribe.unsubscribe();
    }
    if (this.topicMessageSub) {
      this.topicMessageSub.unsubscribe();
    }
    if (this.streamsubscription) {
      this.streamsubscription.unsubscribe();
    }
  }
}


