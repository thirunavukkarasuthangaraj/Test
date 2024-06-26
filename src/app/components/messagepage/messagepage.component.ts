import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewEncapsulation, TemplateRef, ElementRef, ViewChild, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { DOCUMENT } from '@angular/common';
import { MessagescrollDirective } from 'src/app/directives/messagescroll.directive';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var $: any;

export enum MESSAGESTATUS {
  EMPTY, MESSAGE
}

@Component({
  selector: 'app-messagepage',
  templateUrl: './messagepage.component.html',
  styleUrls: ['./messagepage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessagepageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoPlayer') videoplayer: ElementRef;
  @ViewChild('chartDiscussion') chartDisc: ElementRef;
  @ViewChild('UploadFileInput') UploadFileInput: ElementRef;
  @ViewChild(MessagescrollDirective) scrollDir: MessagescrollDirective;
  @ViewChild(NgxSummernoteDirective) summernote: NgxSummernoteDirective;

  config = {
    focus: true,
    placeholder: 'Enter message',
    toolbar: []
  };

  modalRef: BsModalRef;
  selectMessage = MESSAGESTATUS;
  messageStatus = MESSAGESTATUS.EMPTY;
  newContactList: Array<any> = [];
  searchMessage: Array<any> = [];
  messageList = [];
  existContactList = [];
  imgUrl = '';
  sendMessageData = {};
  uploadFiles: Array<any> = [];

  SelectedContact: object = {};
  userId = '';
  FormData: any;
  attachment = false;
  userData: any = {};
  intervalExistContact = false;
  intervalExistSeen = false;
  intervalUnread = true;

  msgPagnination = {
    page: 0,
    limit: 30,
    order: 'desc'
  };

  emptyMsgOpt = {
    opt: 'empty'
  };

  name = '';

  searchData = {
    value: ''
  };
  unreadUserMsgCount = 0;
  fancyList: Array<any> = [];
  slideIndex = 1;
  selectedNewList: Array<any> = [];
  group: any = {
    groupName: null,
    contacts: []
  };
  groupList: Array<any> = [];

  constructor(private modalService: BsModalService, private _api: ApiService, private _http: HttpClient,
    private aroute: ActivatedRoute, private route: Router) {
    this.imgUrl = AppSettings.photoUrl;
    this.userId = localStorage.getItem('userId');
    this.getUserData(this.userId);
    // const userId = this.aroute.snapshot.queryParamMap.get('userid');
    // if (userId && userId != null && userId !== '') {
    //   this.selectExistMessageContact({ contactId: userId });
    // }
    // this.checkConnectedUserExist(userId);
    this.getQueryParamBasedContact();
    this.getAllMessageContact();
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
    this.getUnreadMessageUserCount();
  }

  ngOnInit() {
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngAfterViewInit(): void {
    setInterval(() => {
      if (Object.keys(this.SelectedContact).length > 0 && this.intervalExistContact) {
        this.getNonSeenMessage();
      }
    }, 2 * 1000);
    setInterval(() => {
      if (this.intervalExistSeen) {
        this.getExistMessageContact();
      }
    }, 2 * 1000);
    setInterval(() => {
      if (this.intervalUnread) {
        this.getUnreadMessageUserCount();
      }
    }, 2 * 1000);
  }

  ngOnDestroy(): void {
    this.SelectedContact = {};
    this.intervalExistContact = false;
    this.intervalExistSeen = false;
    this.intervalUnread = false;

    $.extend($.summernote.plugins, {
      'brenter': function (context) {
        this.events = {
          'summernote.enter': function (we, e) {
            if (e.which === 13 || e.keycode === 13) {
            }
          }
        };
      }
    });

  }

  sortBy(list: Array<any>, prop: string) {
    return list.sort((a, b) => {
      return <any>new Date(b[prop]) - <any>new Date(a[prop]);
    });
  }

  sortByMsg(list: Array<any>, prop: string) {
    return list.sort((a, b) => {
      return <any>new Date(a[prop]) - <any>new Date(b[prop]);
    });
  }

  getUserExistingMessageHistory() {
    this.messageStatus = MESSAGESTATUS.MESSAGE;
  }

  checkConnectedUserExist(userId: string) {

  }

  getAllMessageContact() {
    let userId = localStorage.getItem('userId');
    this._api.messagePageService('GET', 'v1/message/user/all/' + userId).subscribe(res => {
      if (res && res['code'] === '00000') {
        this.existContactList = res['data']['contact'];
        this.groupList = res['data']['group'];
      } else {
        this.existContactList = [];
        this.groupList = [];
      }
    })
  }

  getNewMesage(template?: TemplateRef<any>) {
    const url = 'v1/message/user/new/' + localStorage.getItem('userId');
    this._api.messagePageService('GET', url).subscribe(res => {
      if (res) {
        if (res.code === '00000') {
          this.newContactList = res.data.contact;
          this.emptyMsgOpt.opt = 'newmsg';
        } else {
          //alert(res.message);
        }
      }
    });
  }

  getQueryParamBasedContact(): void {
    let userId = this.aroute.snapshot.queryParamMap.get('userid');
    if (userId == undefined || userId == null || userId == '') {
      userId = this.aroute.snapshot.queryParamMap.get('userId');
    }
    let type = this.aroute.snapshot.queryParamMap.get('type');
    if (type == undefined || type == null || type == '') {
      type = 'user';
    }
    if (type == 'user') {
      this.getQueryParamNewContact(userId);
    } else if (type == 'group') {
      this.getQueryParamGroupContact(userId);
    } else if (type == 'business') {

    } else if (type == 'community') {

    } else if (type == 'network') {

    } else if (type == 'team') {

    }
  }

  getQueryParamNewContact(userId: any) {
    const url = 'v1/message/user/new/' + localStorage.getItem('userId');
    this._api.messagePageService('GET', url).subscribe(res => {
      if (res) {
        if (res.code === '00000') {
          const newContactList = res.data.contact;
          if (userId && userId != null && userId !== '') {
            for (let i = 0; i < newContactList.length; i++) {
              const d = newContactList[i];
              if (d.connectorid === userId) {
                this.selectExistMessageContact(d);
                break;
              }
            }
          }
          this._api.stopLoader();
        }
      }
    });
  }

  getQueryParamGroupContact(userId: any) {
    let contact = {
      contactId: userId,
      connectorid: userId
    };

    this.msgPagnination = {
      page: 0,
      limit: 30,
      order: 'desc'
    };
    if (contact['contactId']) {
      contact['connectorid'] = contact['contactId'];
    } else {
      contact['contactId'] = contact['connectorid'];
    }
    const message = {
      authorId: localStorage.getItem('userId'),
      recipientId: contact['contactId']
    };
    //contact['connectorid'] = contact['contactId'];
    this.getGroupMessageDetails(message, contact);
  }

  getExistMessageContact() {
    const url = 'v1/message/user/exist/' + localStorage.getItem('userId');
    this._api.messagePageService('GET', url).subscribe(res => {
      if (res) {
        if (res.code === '00000') {
          const contactList: Array<any> = res.data.contact;
          if (this.existContactList && this.existContactList.length > 0) {
            contactList.forEach(e => {
              let index = this.existContactList.findIndex((item) => item.contactId === e.contactId);
              if (index < 0) {
                this.existContactList.push(e);
              } else {
                if (e.notSeenCount == undefined || e.notSeenCount == null || e.notSeenCount == "") {
                  e.notSeenCount = null;
                }
                Object.assign(this.existContactList[index], e);
              }
            });
          } else {
            this.existContactList = contactList;
          }
          this._api.stopLoader();
        } else {
          this._api.stopLoader();
        }
      } else {
        this._api.stopLoader();
      }
    });
  }

  redirectUrl(userid: any, item?: any, type?: any) {
    //console.log(userid);
    //console.log(item);
    let query = {};
    query['userid'] = userid;
    if (type && type != null && type != '') {
      query['type'] = type;
    } else {
      type = 'user';
    }
    this._api.startLoader();
    this.route.navigate(['/message'], { relativeTo: this.aroute, queryParams: query, queryParamsHandling: 'merge' });
    this._api.stopLoader();
  }


  selectExistMessageContact(contact: object) {
    if (Object.keys(this.SelectedContact).length > 0) {
      if (this.SelectedContact['contactId'] === contact['contactId']) {
        return;
      }
    }
    this.msgPagnination = {
      page: 0,
      limit: 30,
      order: 'desc'
    };
    if (contact['contactId']) {
      contact['connectorid'] = contact['contactId'];
    } else {
      contact['contactId'] = contact['connectorid'];
    }
    const message = {
      authorId: localStorage.getItem('userId'),
      recipientId: contact['contactId']
    };
    //contact['connectorid'] = contact['contactId'];
    this.getMessageDetails(message, contact);
  }

  selectNewMessageContact(contact: object) {
    //console.log("Check new user")
    //console.log(contact);
    this.msgPagnination = {
      page: 0,
      limit: 30,
      order: 'desc'
    };
    const message = {
      authorId: localStorage.getItem('userId'),
      recipientId: contact['connectorid']
    };
    this.getMessageDetails(message, contact, 'new');
  }

  private getMessageDetails(message: any, contact: any, status?: any) {
    //console.log(message);
    const url = 'v1/message/details';
    message.order = this.msgPagnination.order;
    message.limit = this.msgPagnination.limit;
    message.page = this.msgPagnination.page;
    this._api.messagePageService('POST', url, message).subscribe(res => {
      if (res) {
        if (res.code === 'NOT_CONNECTED_USER') {
          Swal.fire('Not a connected user');
          this.route.navigate(['/message']);
        } else if (res.code === '00000') {
          this.selectedNewList = [];
          this.SelectedContact = contact;
          this.messageStatus = MESSAGESTATUS.MESSAGE;
          this.messageList = [];
          if (res.data && res.data.messages) {
            setTimeout(() => { this.scrollDir.prepareFor('up'); }, 100);
            setTimeout(() => { this.summernote.writeValue(''); }, 100);
            this.messageList = res.data.messages;
            setTimeout(() => { this.scrollDir.restore(); }, 100);
            setTimeout(() => {
              this.chartDisc.nativeElement.scroll({
                top: this.chartDisc.nativeElement.scrollHeight,
                left: 0
              });
            }, 100);
            //, behavior: 'smooth'
          } else {
            if (contact['contactId']) {
              contact['connectorid'] = contact['contactId'];
            } else {
              contact['contactId'] = contact['connectorid'];
            }
            this.selectedNewList.push(contact);
          }
          setTimeout(() => { this.summernote.writeValue(''); }, 100);
        } else {
          this.messageList = [];
          this.selectedNewList = [];
        }
        this.intervalExistContact = true;
        this.intervalExistSeen = true;
      }
    });
  }

  sendMessage() {
    let type = this.aroute.snapshot.queryParamMap.get('type');
    if (type == undefined || type == null || type == '')
      type = 'user';
    if (this.sendMessageData['message'] === undefined || this.sendMessageData['message'] == null ||
      this.sendMessageData['message'].replace(/\s/g, "") === "") {
      return;
    }
    this.sendMessageData['authorId'] = this.userId;
    this.sendMessageData['recipientId'] = this.SelectedContact['connectorid'];
    this.sendMessageData['userType'] = type.toUpperCase();
    const url = 'v1/message/send';
    this._api.messagePageService('POST', url, this.sendMessageData).subscribe(res => {
      if (res) {
        if (res.code === "00000") {
          this.sendMessageData = {};
          this.summernote.writeValue('');
          this.messageList.push(res.data.message);
          this.selectedNewList = [];
          this.getAllMessageContact();
          setTimeout(() => {
            this.chartDisc.nativeElement.scroll({
              top: this.chartDisc.nativeElement.scrollHeight,
              left: 0
            });
          }, 200);
          //, behavior: 'smooth'
        }
      }
    });
  }

  toggleVideo(event?: any) {
    this.videoplayer.nativeElement.play();
  }

  fileUpload(event: any, template?: TemplateRef<any>, option?: any) {
    if (option && option === 'update') {

    } else {
      this.FormData = new FormData();
    }
    if (event.target.files && event.target.files[0]) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const reader = new FileReader();
        reader.onload = (event1: any) => {
          const type = event.target.files[i].type;
          let type1 = 'image';
          if (type.includes('image')) {
            type1 = 'image';
          } else if (type.includes('video')) {
            type1 = 'video';
          } else if (type.includes('application')) {
            type1 = 'application';
          } else if (type.includes('audio')) {
            type1 = 'audio';
          } else {
            type1 = 'others';
          }
          const data = {
            t: type1,
            ft: type,
            src: event1.target.result
          };
          this.uploadFiles.push(data);
          //console.log(this.uploadFiles)
        };
        reader.readAsDataURL(event.target.files[i]);
        this.FormData.append('file', event.target.files[i]);
        if (!this.attachment) {
          this.attachment = true;
          setTimeout(() => { this.summernote.writeValue(''); }, 100);
        }
      }
    }
  }

  sendMessageWithAttachment() {
    let type = this.aroute.snapshot.queryParamMap.get('type');
    if (type == undefined || type == null || type == '')
      type = 'user';
    this.sendMessageData['authorId'] = this.userId;
    this.sendMessageData['recipientId'] = this.SelectedContact['contactId'];
    this.sendMessageData['userType'] = type.toUpperCase();
    this.FormData.append('message', new Blob([JSON.stringify(this.sendMessageData)],
      {
        type: "application/json"
      }));
    const url = 'v1/message/upload';
    this._api.messagePageService('POST', url, this.FormData).subscribe(res => {
      if (res) {
        if (res['code'] === '00000') {
          this.attachment = false;
          this.sendMessageData = {};
          this.uploadFiles = [];
          this.messageList.push(res['data'].message);
          setTimeout(() => { this.summernote.writeValue(''); }, 100);
          this.selectedNewList = [];
          this.getAllMessageContact();
          setTimeout(() => {
            this.chartDisc.nativeElement.scroll({
              top: this.chartDisc.nativeElement.scrollHeight,
              left: 0
            });
          }, 200);
        }
      }
    });
  }

  getUserData(userId: any) {
    this._api.messagePageService('GET', 'user/' + userId).subscribe(res => {
      if (res && res.code === '00000') {
        this.userData = res;
      }
    });
  }

  removeAttachMent(item: any, i: any) {
    this.uploadFiles.splice(i, 1);
    if (this.uploadFiles.length === 0) {
      this.attachment = false;
    }
  }

  // Here we get the non seen message list
  getNonSeenMessage() {
    const message = {
      authorId: this.userId,
      recipientId: this.SelectedContact['connectorid'],
      seen: false
    };
    this._api.messagePageService('POST', 'v1/message/nonseendetails', message).subscribe(res => {
      if (res) {
        if (res.code === '00000' && res.data && res.data.messages) {
          const list = res.data.messages;
          if (list.length > 0) {
            list.forEach((e: any) => {
              this.messageList.push(e);
            });
            this._api.messagePageService('PUT', 'v1/message/updateseen', list).subscribe();
            setTimeout(() => {
              this.chartDisc.nativeElement.scroll({
                top: this.chartDisc.nativeElement.scrollHeight,
                left: 0
              });
            }, 100);
          }
        }
      }
    });
  }

  onScrollUp() {
    let type = this.aroute.snapshot.queryParamMap.get('type');
    if (type == undefined || type == null || type == '') {
      type = 'user';
    }
    this.msgPagnination.page = this.msgPagnination.page + this.msgPagnination.limit;
    this.msgPagnination.limit = 30;
    const message = {
      authorId: localStorage.getItem('userId'),
      recipientId: this.SelectedContact['contactId'],
      order: this.msgPagnination.order,
      limit: this.msgPagnination.limit,
      page: this.msgPagnination.page,
      userType: type.toUpperCase()
    };
    let url = 'v1/message/details';
    if (type == 'group') {
      url = 'v1/message/groupmsg/details';
    }
    this._api.messagePageService('POST', url, message).subscribe(res => {
      if (res) {
        if (res.code === '00000') {
          if (res.data && res.data.messages) {
            this.scrollDir.prepareFor('up');
            const messageList = res.data.messages;
            if (messageList.length > 0) {
              //this.messageList = this.messageList;
              this.messageList = messageList.concat(this.messageList);
            } else {
              this.msgPagnination.page = this.msgPagnination.page - this.msgPagnination.limit;
            }
            this.scrollDir.restore();
          }
        }
      }
    });
  }

  onScrollDown() {
    let type = this.aroute.snapshot.queryParamMap.get('type');
    if (type == undefined || type == null || type == '') {
      type = 'user';
    }
    if (this.msgPagnination.page <= 0) {
      this.intervalExistContact = true;
      return;
    }
    this.msgPagnination.page = this.msgPagnination.page - this.msgPagnination.limit;
    if (this.msgPagnination.page < 0) {
      this.msgPagnination.page = 0;
    }
    this.msgPagnination.limit = 30;
    const message = {
      authorId: localStorage.getItem('userId'),
      recipientId: this.SelectedContact['contactId'],
      order: this.msgPagnination.order,
      limit: this.msgPagnination.limit,
      page: this.msgPagnination.page,
      userType: type.toUpperCase()
    };
    let url = 'v1/message/details';
    if (type == 'group') {
      url = 'v1/message/groupmsg/details';
    }
    this._api.messagePageService('POST', url, message).subscribe(res => {
      if (res) {
        if (res.code === '00000') {
          if (res.data && res.data.messages) {
            this.scrollDir.prepareFor('down');
            const messageList = res.data.messages;
            if (messageList.length > 0) {
              this.messageList = messageList.concat(this.messageList);
            }
            this.scrollDir.restore();
          }
        }
      }
      if (this.msgPagnination.page === 0) {
        this.intervalExistContact = true;
      }
    });
  }

  closeOpenedMsg() {
    this.selectedNewList = [];
    this.SelectedContact = {};
    this.searchData.value = '';
    this.name = '';
    this.emptyMsgOpt.opt = 'empty';
    this.messageStatus = this.selectMessage.EMPTY;
    this.route.navigate(['/message']);
  }

  onSearchChange(e) {
    let type = this.aroute.snapshot.queryParamMap.get('type');
    if (type == undefined || type == null || type == '') {
      type = 'user';
    }
    const message = {
      authorId: this.userId,
      recipientId: this.SelectedContact['contactId'],
      message: this.searchData.value,
      userType: type.toUpperCase()
    };
    this._api.messagePageService('POST', 'v1/message/search', message).subscribe(res => {
      if (res) {
        if (res.code === '00000') {
          this.searchMessage = res.data.messages;
        }
      }
    });
  }

  getUnreadMessageUserCount() {
    this._api.messagePageService('GET', 'v1/message/unreaduser/count/' + this.userId).subscribe(res => {
      if (res) {
        if (res.code === '00000') {
          const d = res.data.count;
          this.unreadUserMsgCount = d.count;
        }
      }
    });
  }

  getSearchMessageDetails(item: any) {
    const message = {
      authorId: item['authorId'],
      recipientId: item['recipientId'],
      messageId: item['messageId'],
      limit: 30
    };
    this._api.messagePageService('POST', 'v1/message/searchbyid', message).subscribe(res => {
      if (res) {
        if (res.code === '00000') {
          this.msgPagnination = {
            page: res['data']['page']['pageSize'],
            limit: res['data']['page']['limit'],
            order: 'desc'
          };
          this.messageList = res['data']['message'];
          this.intervalExistContact = false;
          setTimeout(() => {
            const id = item['messageId'];
            const element = document.getElementById(id);
            //element.scrollIntoView({ behavior: 'smooth'});
            this.scrollDir.restore();
          }, 100);
        }
      }
    });
  }

  showImageAndVideoPreview(item: any, i: any) {
    document.getElementById('myModal').style.display = 'block';
    this.fancyList = item['attachments'];
    setTimeout(() => {
      this.showSlides(i + 1);
    }, 100);
  }
  closeFancyModal() {
    let slides = document.getElementsByClassName("mySlidess");
    for (let i = 0; i < slides.length; i++) {
      slides[i]['style'].display = "none";
    }
    document.getElementById("myModal").style.display = "none";
    this.slideIndex = 1;
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }
  showSlides(n) {
    this.slideIndex = n;
    let slides = document.getElementsByClassName("mySlidess");
    if (n > slides.length) { this.slideIndex = 1; }
    if (n < 1) { this.slideIndex = slides.length; }
    for (let i = 0; i < slides.length; i++) {
      slides[i]['style'].display = "none";
    }
    slides[this.slideIndex - 1]['style'].display = "block";
  }

  // Group message implementation are done here
  gropuMessage(template?: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'group-msg-modal modal-sm' }));
  }

  addUserToGroup(event: any, userId: any) {
    let index = this.group.contacts.indexOf(userId);
    if (index == -1) {
      this.group.contacts.push(userId);
    } else {
      this.group.contacts.splice(index, 1);
    }
  }

  createGroup() {
    if (this.group.groupName == null || this.group.groupName == '') {
      Swal.fire('', 'Enter group name', 'error');
      return;
    }
    if (this.group.contacts == null || this.group.contacts.length == 0
      || this.group.contacts.length == 1) {
      Swal.fire('', 'Please add user into the group', 'error');
      return;
    }
    let userId = localStorage.getItem("userId");
    this.group['createdBy'] = userId;
    this.group['groupType'] = 'GROUP';
    const url = 'v1/message/group/' + userId;
    this._api.messagePageService('POST', url, this.group).subscribe(res => {
      if (res && res != null && res != '') {
        if (res['code'] === '00000') {
          let list = res['data']['group'];
          if (list && list != null && list != '') {
            this.groupList.push(list);
            let query = {
              userId: list['id'],
              type: 'group'
            };
            this.route.navigate(['/message'], { queryParams: query });
            this.modalRef.hide();
          }
        } else {
          Swal.fire('', res['message'], 'error');
          this.groupList = [];
        }
      }
    });
  }

  getGroupMessageDetails(message: any, contact: any, status?: any) {
    //console.log(message);
    const url = 'v1/message/groupmsg/details';
    message.order = this.msgPagnination.order;
    message.limit = this.msgPagnination.limit;
    message.page = this.msgPagnination.page;
    message.userType = 'GROUP';
    this._api.messagePageService('POST', url, message).subscribe(res => {
     // console.log(res);
      if (res) {
        if (res.code === '00000') {
          this.selectedNewList = [];
          this.SelectedContact = contact;
          this.messageStatus = MESSAGESTATUS.MESSAGE;
          this.messageList = [];
          if (res.data && res.data.messages) {
            setTimeout(() => { this.scrollDir.prepareFor('up'); }, 100);
            setTimeout(() => { this.summernote.writeValue(''); }, 100);
            this.messageList = res.data.messages;
            setTimeout(() => { this.scrollDir.restore(); }, 100);
            setTimeout(() => {
              this.chartDisc.nativeElement.scroll({
                top: this.chartDisc.nativeElement.scrollHeight,
                left: 0
              });
            }, 100);
            //, behavior: 'smooth'
          } else {
            if (contact['contactId']) {
              contact['connectorid'] = contact['contactId'];
            } else {
              contact['contactId'] = contact['connectorid'];
            }
            this.selectedNewList.push(contact);
          }
          setTimeout(() => { this.summernote.writeValue(''); }, 100);
        } else {
          this.messageList = [];
          this.selectedNewList = [];
        }
        this.intervalExistContact = true;
        this.intervalExistSeen = true;
      }
    });
  }
}
