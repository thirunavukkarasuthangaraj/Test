import { Component, OnInit, TemplateRef, Input, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CropperOption } from 'ngx-cropper';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ApiService } from 'src/app/services/api.service';
import { AppSettings } from 'src/app/services/AppSettings';
import { Subscription } from 'rxjs';
import { CommonValues } from 'src/app/services/commonValues';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommunityBannerComponent } from '../community-banner/community-banner.component';
import { UtilService } from 'src/app/services/util.service';
import { PlatformLocation } from '@angular/common';
import { values } from 'lodash';
import Swal from 'sweetalert2';
import { CustomValidator } from '../../Helper/custom-validator';

declare var $: any;
@Component({
  selector: 'app-community-profile',
  templateUrl: './community-profile.component.html',
  styleUrls: ['./community-profile.component.scss']
})
export class CommunityProfileComponent implements OnInit {
  @ViewChild("myFileInput") myFileInput;
  @ViewChild("myFileInput1") myFileInput1;
  @ViewChild("lgModal") lgModal;
  @ViewChild("lgModal1") lgModal1;

  tagSelectedItems: any = [];
  viewadmin
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  basicForm: UntypedFormGroup
  communityId: any;
  businessId: any;
  placeholder: any = "Add more";
  secondaryPlaceholder: any = "Option to add 3 #Tags"
  aboutForm: UntypedFormGroup
  aboutCommunity: any;
  tagLine: any;
  communityType: any;
  banner: any;
  industryClass: any;
  facilityFlag: boolean = false;
  facilityPracticeType: any;
  companyType: any;
  yearStarted: any;
  members: any;
  tags: any;
  communityName: any;
  guidelineForm: UntypedFormGroup
  guidelines: any;
  submit: boolean
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true
  }
  fileUploadName: any = '';
  fileUploadNamebanner: any = '';
  croppedImage: any = '';
  photoWindow = true;
  public cropperConfig: CropperOption;
  fileToUpload: File;
  fileToUploadbanner: File;
  photoIdbanner: any
  photoId: any;
  img: any;
  data: any;
  information: any;
  clickEventsubscription: Subscription;
  loadAPIcall:boolean=false;
  values: any = {}
  items: any = [];
  imageChangedEvent: any = '';
  imageChangedEventbanner: any = '';
  isAdmin
  isSuperAdmin
  config = {
    placeholder: 'Brief about your Community',
    tabsize: 2,
    height: '100px',
    //uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      // ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: {
      onKeydown(e) {
        const limiteCaracteres = 1000;
        const caracteres = e.currentTarget.innerText;
        const totalCaracteres = caracteres.length;
        if (totalCaracteres >= limiteCaracteres) {
          if (e.keyCode !== 8 && e.keyCode !== 37
            && e.keyCode !== 38 && e.keyCode !== 39
            && e.keyCode !== 40 && e.keyCode !== 65) { e.preventDefault(); }
        }
      },
      onKeyup(e) {
        const t = e.currentTarget.innerText;
     //   //// console.log(t.length);
      },
      onPaste(e) {
        const buffertext = ((e.originalEvent || e).clipboardData).getData('text');
        e.preventDefault();
        const all = buffertext.trim();
        document.execCommand('insertText', false, all.substring(0, 1000));
        //$('#maxcontentpost').text(400 - t.length);
      }
    }
  }

  guidelinesConfig = {
    placeholder: 'Community Guidelines',
    tabsize: 2,
    height: '100px',
    //uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      // ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: {
      onKeydown(e) {
        const limiteCaracteres = 4000;
        const caracteres = e.currentTarget.innerText;
        const totalCaracteres = caracteres.length;
        if (totalCaracteres >= limiteCaracteres) {
          if (e.keyCode !== 8 && e.keyCode !== 37
            && e.keyCode !== 38 && e.keyCode !== 39
            && e.keyCode !== 40 && e.keyCode !== 65) { e.preventDefault(); }
        }
      },
      onKeyup(e) {
        const t = e.currentTarget.innerText;
     //   //// console.log(t.length);
      },
      onPaste(e) {
        const buffertext = ((e.originalEvent || e).clipboardData).getData('text');
        e.preventDefault();
        const all = buffertext.trim();
        document.execCommand('insertText', false, all.substring(0, 1000));
        //$('#maxcontentpost').text(400 - t.length);
      }
    }
  }
  memberslength
  communitydetails
  object: any = []
  communityhome
  patchurldata
  modelhide = false
  charCountEmitter: Subscription;


  remainingCount: any;
  remainingGuidelinesCount: any;
  @Input() commonemit
  changeName: any;

  constructor(private modalService: BsModalService,
    private fb: UntypedFormBuilder,
    private commonvalues: CommonValues,
    private router: Router,
     private api: ApiService,
    private route: ActivatedRoute,
    private util: UtilService,
    private platform: PlatformLocation) {
    this.items = Array(15).fill(0);

    this.clickEventsubscription = this.commonvalues.getbusinessid().subscribe((res) => {
     //// //// console.log("dfgdfgdffd", res)
      this.values = res;
      this.isAdmin = localStorage.getItem('isAdmin');
      this.isSuperAdmin = localStorage.getItem('isSuperAdmin');

      if (this.isSuperAdmin) {
        this.isAdmin = this.isSuperAdmin
      }

    })




    platform.onPopState(() => this.modalRef.hide());
    platform.onPopState(() => this.modalRef2.hide());


    this.charCountEmitter = this.commonvalues.getCharCount().subscribe(res=>{
      this.remainingCount = res.value
      this.remainingGuidelinesCount = res.guidelinesCountValue
    })
  }

  ngOnInit() {

    this.values = this.commonemit;
    this.route.queryParams.subscribe((res) => {
      this.patchurldata = res;

      this.communityId = res.communityId;
      this.communityId = localStorage.getItem('communityId')
      this.companydetailsapicall()
      this.validate()


    });


    // this.grabData();
    this.tagSelectedItems = [];

    // $.extend($.summernote.plugins, {
    //   brenter: function (context) {
    //     this.events = {
    //       'summernote.enter': function (we, e) {
    //         if ((e.which === 13 || e.keyCode === 13) && e.altKey) {
    //         } else if (e.which === 13 || e.keycode === 13) {
    //           $('#update').click();
    //            e.preventDefault();
    //         }
    //       }
    //     };
    //   }
    // });

  }




  companydetailsapicall() {

    var data = this.communityId
    if (this.communityId) {
      data = this.communityId
    }

    this.api.query('community/details/' + data).subscribe(res => {

      this.util.stopLoader()
      this.memberslength = res.data.communityDetails.members.length
      if(res.data.communityDetails.tagLine==null){
        res.data.communityDetails.tagLine=""
      }
      this.communitydetails = res.data.communityDetails;
      this.commun()
      let data: any = {}
      data.communityId = res.data.communityDetails.communityId;
      data.userId = localStorage.getItem('userId')
      this.api.create('community/home', data).subscribe(res1 => {
        this.communityhome = res1.data;

      });

    },err => {
      this.util.stopLoader();
    })


  }

  commun() {
    this.yearStarted = this.communitydetails.yearStarted
  }
  grabData() {
    this.route.queryParams.subscribe((data) => {
      this.communityId = data.communityId
    })
  }

  acquireData() {
    if (this.information.industryClassification == "MEDICAL_HEALTHCARE_PRACTICE") {
      this.industryClass = "Medical/ Healthcare Practice"
    }
    this.facilityPracticeType = this.information.facilityPracticeType
    this.companyType = this.information.companyType
    this.yearStarted = this.information.yearStarted
    this.members = this.information.yearStarted

  }

  validate() {
   this.loadAPIcall=true
    this.api.query('community/details/' + this.communityId).subscribe(response => {
      this.loadAPIcall=false
      this.util.stopLoader()

      this.data = response.data.communityDetails;


      this.fetchData();
    },err => {
      this.util.stopLoader();
    })


    if (this.businessId != undefined || this.businessId != null) {
      this.api.query('business/details/' + this.businessId).subscribe(response => {

        this.information = response.data.businessModelList[0];

        this.acquireData()
      },err => {
        this.util.stopLoader();
      })

    }

    this.basicForm = this.fb.group({
      communityName: [null, [Validators.required, Validators.maxLength(100)]],
      tagLine: [null, [Validators.maxLength(140)]],
      communityType: [false],
      banner: [null],
      bannerimg: [null],
      tags: [null],
    })

    this.aboutForm = this.fb.group({
      aboutCommunity: ['', [Validators.maxLength(1000)]]
    },
    {validators: CustomValidator.checkCharCount("aboutCommunity", this.commonvalues)})


    this.guidelineForm = this.fb.group({
      communityGuidelines: ['', Validators.maxLength(4000)]
    },
    {validators: CustomValidator.checkCharCount4000("communityGuidelines", this.commonvalues)})
  }

  decline1(){
    this.lgModal.hide()
  }

  fetchData() {
    this.aboutCommunity = this.data.aboutCommunity
    //// //// console.log('this.aboutCommunity', this.aboutCommunity)
    //// //// console.log('this.data.communityGuidelines', this.data)
    if (this.data.communityType == true) {
      this.communityType = "Private"
    } else if (this.data.communityType == false) {
      this.communityType = "Public"
    }
    this.communityName = this.data.communityName
    this.tagLine = this.data.tagLine
    this.banner = this.data.banner
    this.guidelines = this.data.communityGuidelines
 //   //// console.log('this.guidelines', this.guidelines)
    this.tags = this.data.tags
    this.communityName = this.data.communityName
  }


  changetype(value: any, $event) {
 //   //// console.log($event.target.checked)
    this.changeName = value;
    // if(value=="Private"){
    //    this.changeName="Public"
    //   }else if(value=="Public"){
    //  this.changeName="Private"

    // }





  }
  editBasic(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.backdropConfig);

    this.basicForm.patchValue(this.data);

    this.tagSelectedItems = []
    if (this.data.tags != undefined &&
      this.data.tags != null &&
      this.data.tags != '') {
      this.data.tags.forEach(ele => {
        this.tagSelectedItems.push(ele)
      })
   //   //// console.log("this.tagSelectedItems",this.tagSelectedItems)
    }

    if (this.data.logo != undefined && this.data.logo != null && this.data.logo != "") {
      this.photoId = this.data.logo
      // this.imageLoaded()
    }
    if (this.data.banner != undefined && this.data.banner != null && this.data.banner != "") {
      this.photoIdbanner = this.data.banner
      this.imageLoadedbanner()
    }


    // this.basicForm.patchValue({
    //   tags: this.data.tags
    // })

  }
  reloadpage() {

    let data: any = {}
    data.communityId = this.patchurldata.communityId
    data.communityName = this.basicForm.value.communityName
    data.menu = "communityabout"
 //   //// console.log(JSON.stringify(data))
    this.router.navigate(['community'], { queryParams: data })

    setTimeout(() => {
      this.router.navigate(['community'], { queryParams: data })
      const queryParams: Params = {};
      this.router.navigate([],{
         relativeTo: this.route,
         queryParams: queryParams,
         queryParamsHandling: 'merge',
       });

    }, 400);




  }
  cancel() {

    this.modalRef.hide();

  }

  updateBasic() {


    if (this.basicForm.valid) {
      if (this.communityType == "Private" && this.changeName == undefined || this.communityType == "Public" && this.changeName == undefined) {

        this.modalRef.hide();
        //  this.reloadpage()
        this.communitydetails.communityName = this.basicForm.value.communityName
        this.communitydetails.tagLine = this.basicForm.value.tagLine
        this.communitydetails.communityType = this.basicForm.value.communityType
        this.communitydetails.yearStarted = this.yearStarted
        this.communitydetails.tags = this.basicForm.value.tags
        this.communitydetails.aboutCommunity = this.data.aboutCommunity

        //// //// console.log("This is tag value")
        //// //// console.log(this.basicForm.value.tags)
        if (this.photoId != undefined && this.photoId != null && this.photoId != "") {
          this.communitydetails.logo = this.photoId
        } else {
          this.communitydetails.logo = this.communitydetails.logo
        }
        if (this.photoIdbanner != undefined) {
          this.communitydetails.banner = this.photoIdbanner
        } else {
          this.communitydetails.banner = this.communitydetails.banner
        }
        this.object = []
        this.basicForm.value.tags.forEach(ele => {
          if (ele['label']) {
            this.object.push(ele['label'])
          } else {
            this.object.push(ele)
          }
        })

        this.communitydetails.tags = this.object;
        if (this.basicForm.valid) {
          this.util.startLoader()

          this.api.updatePut('community/update', this.communitydetails).subscribe(res => {
            this.util.stopLoader()
            if (res.code == "00000") {
              var obj: any = {}
              obj.boolean = true
              this.commonvalues.setCommuityBoolean(obj)
              this.photoId = undefined;
              this.photoIdbanner = undefined;


              this.communityName = this.communitydetails.communityName
              this.tagLine = this.communitydetails.tagLine
              if(this.communitydetails.communityType == true){
                this.communityType = 'Private'
              }else if(this.communitydetails.communityType == false){
                this.communityType = 'Public'
              }
              this.yearStarted = this.communitydetails.yearStarted
              this.tags = this.communitydetails.tags






              var obj: any = {}
              obj.boolean = true
              this.commonvalues.setCommuityBoolean(obj)
              this.validate()
            } else if (res.code == "99999") {
              Swal.fire('Community Name Already Exits', 'info');
              // this.reloadpage();
            } else if (res.code == 'null') {
              this.photoId = undefined;
              this.photoIdbanner = undefined;
              this.communityName = this.basicForm.value.communityName;
              this.tagLine = this.basicForm.value.tagLine;
              this.communityType = this.basicForm.value.communityType;
              this.banner = this.basicForm.value.banner;
              this.tags = this.basicForm.value.tags;
              this.reloadpage();
            }
          },err => {
            this.util.stopLoader();
          });

        }
      }
      else if (this.communityType == "Private" && this.changeName == "Private" || this.communityType == "Public" && this.changeName == "Public") {
        this.modalRef.hide();

        this.communitydetails.communityName = this.basicForm.value.communityName
        this.communitydetails.tagLine = this.basicForm.value.tagLine
        this.communitydetails.communityType = this.basicForm.value.communityType
        this.communitydetails.yearStarted = this.yearStarted
        this.communitydetails.tags = this.basicForm.value.tags

        if (this.photoId != undefined && this.photoId != null && this.photoId != "") {
          this.communitydetails.logo = this.photoId
        } else {
          this.communitydetails.logo = this.communitydetails.logo
        }
        if (this.photoIdbanner != undefined) {
          this.communitydetails.banner = this.photoIdbanner
        } else {
          this.communitydetails.banner = this.communitydetails.banner
        }
        this.object = []
        this.basicForm.value.tags.forEach(ele => {
          if (ele['label']) {
            this.object.push(ele['label'])
          } else {
            this.object.push(ele)
          }
        })

        this.communitydetails.tags = this.object;
        if (this.basicForm.valid) {
          this.util.startLoader()
          this.api.updatePut('community/update', this.communitydetails).subscribe(res => {
            this.util.stopLoader()
            if (res.code == "00000") {
              var obj: any = {}
              obj.boolean = true
              this.commonvalues.setCommuityBoolean(obj)
              this.photoId = undefined;
              this.photoIdbanner = undefined;
              this.reloadpage();
            } else if (res.code == "99999") {
              Swal.fire(res.message, '', 'info');
              this.reloadpage();
            } else if (res.code == 'null') {
              this.photoId = undefined;
              this.photoIdbanner = undefined;
              this.communityName = this.basicForm.value.communityName;
              this.tagLine = this.basicForm.value.tagLine;
              this.communityType = this.basicForm.value.communityType;
              this.banner = this.basicForm.value.banner;
              this.tags = this.basicForm.value.tags;
              this.reloadpage();
            }
          },err => {
            this.util.stopLoader();
          });

        }
      } else if (this.communityType == "Public" && this.changeName == "Private") {
        this.modalRef.hide();

        this.communitydetails.communityName = this.basicForm.value.communityName
        this.communitydetails.tagLine = this.basicForm.value.tagLine
        this.communitydetails.communityType = this.basicForm.value.communityType
        this.communitydetails.yearStarted = this.yearStarted
        this.communitydetails.tags = this.basicForm.value.tags

        if (this.photoId != undefined && this.photoId != null && this.photoId != "") {
          this.communitydetails.logo = this.photoId
        } else {
          this.communitydetails.logo = this.communitydetails.logo
        }
        if (this.photoIdbanner != undefined) {
          this.communitydetails.banner = this.photoIdbanner
        } else {
          this.communitydetails.banner = this.communitydetails.banner
        }
        this.object = []
        this.basicForm.value.tags.forEach(ele => {
          if (ele['label']) {
            this.object.push(ele['label'])
          } else {
            this.object.push(ele)
          }
        })

        this.communitydetails.tags = this.object;
        if (this.basicForm.valid) {
          this.util.startLoader()
          this.api.updatePut('community/update', this.communitydetails).subscribe(res => {
            this.util.stopLoader()
            if (res.code == "00000") {
              var obj: any = {}
                obj.boolean = true
                this.commonvalues.setCommuityBoolean(obj)
              this.photoId = undefined;
              this.photoIdbanner = undefined;
              this.reloadpage();
            } else if (res.code == "99999") {
              Swal.fire('Community Name Already exits');

            } else if (res.code == 'null') {
              this.photoId = undefined;
              this.photoIdbanner = undefined;
              this.communityName = this.basicForm.value.communityName;
              this.tagLine = this.basicForm.value.tagLine;
              this.communityType = this.basicForm.value.communityType;
              this.banner = this.basicForm.value.banner;
              this.tags = this.basicForm.value.tags;
              this.reloadpage();
            }
          },err => {
            this.util.stopLoader();
          });

        }
      } else if (this.communityType == "Private" && this.changeName == "Public") {
        Swal.fire({
          title: 'Do you want to save the changes?',
          showDenyButton: true,
          allowEscapeKey: false,
          text: "Changing community type from private to public .\n All the pending member requests will be added to community members.",
          allowOutsideClick: false,
          confirmButtonText: `Yes`,
          denyButtonText: `No`,
        }).then((result) => {
          if (result.isConfirmed) {

            this.modalRef.hide();
            this.communitydetails.communityName = this.basicForm.value.communityName
            this.communitydetails.tagLine = this.basicForm.value.tagLine
            this.communitydetails.communityType = false
            this.communitydetails.yearStarted = this.yearStarted
            this.communitydetails.tags = this.basicForm.value.tags

            if (this.photoId != undefined && this.photoId != null && this.photoId != "") {
              this.communitydetails.logo = this.photoId
            } else {
              this.communitydetails.logo = this.communitydetails.logo
            }
            if (this.photoIdbanner != undefined) {
              this.communitydetails.banner = this.photoIdbanner
            } else {
              this.communitydetails.banner = this.communitydetails.banner
            }
            this.object = []
            this.basicForm.value.tags.forEach(ele => {
              if (ele['label']) {
                this.object.push(ele['label'])
              } else {
                this.object.push(ele)
              }
            })

            this.communitydetails.tags = this.object;
            if (this.basicForm.valid) {
              this.util.startLoader()
              this.api.updatePut('community/update', this.communitydetails).subscribe(res => {
                this.util.stopLoader()
                if (res.code == "00000") {
                  var obj: any = {}
                obj.boolean = true
                this.commonvalues.setCommuityBoolean(obj)
                  this.photoId = undefined
                  this.photoIdbanner = undefined
                  this.reloadpage();
                } else if (res.code == "99999") {
                  Swal.fire(res.message, '', 'info');
                  this.reloadpage()

                } else if (res.code == 'null') {
                  this.photoId = undefined
                  this.photoIdbanner = undefined
                  this.communityName = this.basicForm.value.communityName
                  this.tagLine = this.basicForm.value.tagLine
                  this.communityType = this.basicForm.value.communityType
                  this.banner = this.basicForm.value.banner
                  this.tags = this.basicForm.value.tags

                  this.reloadpage();
                }
              },err => {
                this.util.stopLoader();
              });

            }

          } else if (result.isDenied) {

            this.modalRef.hide();

            this.communitydetails.communityName = this.basicForm.value.communityName
            this.communitydetails.tagLine = this.basicForm.value.tagLine
            this.communitydetails.communityType = true
            this.communitydetails.yearStarted = this.yearStarted
            this.communitydetails.tags = this.basicForm.value.tags

            if (this.photoId != undefined && this.photoId != null && this.photoId != "") {
              this.communitydetails.logo = this.photoId
            } else {
              this.communitydetails.logo = this.communitydetails.logo
            }
            if (this.photoIdbanner != undefined) {
              this.communitydetails.banner = this.photoIdbanner
            } else {
              this.communitydetails.banner = this.communitydetails.banner
            }
            this.object = []
            this.basicForm.value.tags.forEach(ele => {
              if (ele['label']) {
                this.object.push(ele['label'])
              } else {
                this.object.push(ele)
              }
            })

            this.communitydetails.tags = this.object;
            if (this.basicForm.valid) {
              this.util.startLoader()
              this.api.updatePut('community/update', this.communitydetails).subscribe(res => {
                this.util.stopLoader()
                if (res.code == "00000") {
                  var obj: any = {}
                obj.boolean = true
                this.commonvalues.setCommuityBoolean(obj)
                  this.photoId = undefined;
                  this.photoIdbanner = undefined;
                  this.reloadpage();
                } else if (res.code == "99999") {
                  Swal.fire(res.message, '', 'info');
                  this.reloadpage();
                } else if (res.code == 'null') {
                  this.photoId = undefined;
                  this.photoIdbanner = undefined;
                  this.communityName = this.basicForm.value.communityName;
                  this.tagLine = this.basicForm.value.tagLine;

                  this.communityType = this.basicForm.value.communityType;
                  this.banner = this.basicForm.value.banner;
                  this.tags = this.basicForm.value.tags;
                  this.reloadpage();
                }
              },err => {
                this.util.stopLoader();
              });

            }
          }
        })
      }
    }
  }




  editAbout(template: TemplateRef<any>) {

   // this.lgModal.show()
     this.modalRef = this.modalService.show(template, this.backdropConfig)
    this.aboutForm.patchValue({
      aboutCommunity: this.data.aboutCommunity
    })
  }

  updateAbout() {
    var value1;
    var value2;
    value1 = this.aboutForm.value.aboutCommunity
    value2 = value1.replace('<p><br></p>', '')
    this.data.aboutCommunity = value2

    this.util.startLoader()
    this.api.updatePut('community/update', this.data).subscribe(res => {
      this.util.stopLoader()
      if (res.code == "00000") {
        var obj: any = {}
        obj.boolean = true
        this.commonvalues.setCommuityBoolean(obj)
        this.aboutCommunity = res.data.community.aboutCommunity
        this.communityId = res.data.community.communityId
        this.aboutForm.patchValue({
          aboutCommunity: res.data.community.aboutCommunity
        })
        // this.companydetailsapicall();
        this.validate()
      } else if (res.code == "99999") {

      }
    },err => {
      this.util.stopLoader();
    });
     this.modalRef.hide();
    //this.lgModal.hide()
  }

  updateGuidelines() {
    var value1 = this.guidelineForm.value.communityGuidelines
    var value2 = value1.replace('<p><br></p>', '')
    this.data.communityGuidelines = value2
    this.util.startLoader()
    this.api.updatePut('community/update', this.data).subscribe(res => {
      this.util.stopLoader()
      if (res.code == "00000") {
        var obj: any = {}
        obj.boolean = true
        this.commonvalues.setCommuityBoolean(obj)
        this.guidelines = value1
        // this.companydetailsapicall();
        this.validate()
      } else if (res.code == "99999") {

      }
    },err => {
      this.util.stopLoader();
    });
    this.modalRef.hide();
    //this.lgModal1.hide()
  }

  editGuidelined(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.backdropConfig)
    this.lgModal1.show()
    this.guidelineForm.patchValue({
      communityGuidelines: this.data.communityGuidelines
    })
  }


  get aboutControl() {
    return this.aboutForm.controls
  }

  get guidelineControls() {
    return this.guidelineForm.controls
  }

  get basicControls() {
    return this.basicForm.controls
  }

  fileChangeEvent(event, popupName): void {
    this.imageChangedEvent = event;
    if (event.target.files && event.target.files[0]) {
      this.fileUploadName = event.target.files[0].name;
      $("#communityLogo").val
       const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (!acceptedImageTypes.includes(event.target.files[0].type)) {
        Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
        this.myFileInput1.nativeElement.value = "";
        this.modalRef.hide();
      } else {
        this.PopupServicevlaues(popupName);
      }

    } else {
      $("#communityLogo").val("");
    }
  }

  fileChangeEventbanner(event, popupName): void {
    this.imageChangedEventbanner = event;
    if (event.target.files && event.target.files[0]) {
      this.fileUploadNamebanner = event.target.files[0].name;
      $("#communityBanner").val
       const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      if (!acceptedImageTypes.includes(event.target.files[0].type)) {
        Swal.fire('', 'Please upload the correct file type   (Only .jpg, .png, .jpeg)', 'info');
        this.modalRef.hide();
      } else {
        this.PopupServicevlaues(popupName);
      }
    } else {
      $("#communityBanner").val("");
    }
  }

  PopupServicevlaues(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, {
      animated: true,
      backdrop: 'static'
    });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //// //// console.log("this.v-- "+this.croppedImage.name);
    //// //// console.log("this.croppedImage-- "+this.croppedImage);

    const byteString = window.atob(event.base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    // const byteString = window.atob(event.base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });

    this.fileToUpload = new File([blob], this.fileUploadName, { type: 'image/jpeg' });

  }


  imageCroppedBanner(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //// //// console.log("this.v-- "+this.croppedImage.name);
    //// //// console.log("this.croppedImage-- "+this.croppedImage);

    const byteString = window.atob(event.base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });

    this.fileToUploadbanner = new File([blob], this.fileUploadNamebanner, { type: 'image/jpeg' });

  }

  modalclose() {
    // for (let i = 1; i <= this.modalService.getModalsCount(); i++) {
    //   this.modalService.hide(i);
    // }
    this.modalRef.hide()
  }

  closeImage() {
    this.fileUploadName = undefined;
    this.modalRef2.hide();
    this.img.src = AppSettings.ServerUrl + 'download/' + this.photoId;
    $("#communityLogo").val("")
  }

  closeBannerImage() {
    this.fileUploadName = undefined;
    this.modalRef2.hide();
    // this.img.src = AppSettings.ServerUrl + 'download/' + this.photoId;
    $("#communityBanner").val("")
  }

  imageLoaded() {
    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileUploadName);
    this.util.startLoader()
    this.api.create('upload/image', formData).subscribe(res => {
      this.util.stopLoader()
      this.photoId = res.fileId;
      this.modalRef2.hide()
      //$("#communityLogo").val("")
      this.img = {
        src: AppSettings.ServerUrl + 'download/' + this.photoId
      }
    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while uploading image. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  });
  }

  imageLoadedbanner() {
    const formData: FormData = new FormData();
    formData.append('file', this.fileToUploadbanner, this.fileUploadNamebanner);
    this.util.startLoader()
    this.api.create('upload/image', formData).subscribe(res => {
      this.util.stopLoader()
      this.photoIdbanner = res.fileId;
      // this.modalclose();
      this.modalRef2.hide()
      //$("#communityBanner").val("")
    },err => {
      this.util.stopLoader();
      if(err.status==500){
      this.util.stopLoader();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Something went wrong while uploading image. Please, try again later.',
        showDenyButton: false,
        confirmButtonText: `ok`,
      })
    }
  });
  }

  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  // getCommunityId(communityId,admin){

  ////   //// console.log(communityId,admin)
  //   this.values.communityId=communityId;
  //   this.values.admin=admin;
  //   this.communityId=communityId;
  //   if(this.values.adminviewnavigation){
  //    this.values.viewadmin=true
  //  }
  //   this.commonvalues.businessid(this.values)
  // }


  getbussinessId(communityId, admin) {

 //   //// console.log(communityId, admin)
    this.values.communityId = communityId;
    this.values.admin = admin;
    this.communityId = communityId;
    if (this.values.adminviewnavigation) {
      this.values.viewadmin = true
      this.viewadmin = true
    }
 //   //// console.log("businessId---admin", this.values)
    this.commonvalues.businessid(this.values)



  }



}
