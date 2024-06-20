import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AppSettings } from 'src/app/services/AppSettings';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JobService } from 'src/app/services/job.service';
import { countProvider } from 'src/app/components/suggestions/suggestions.component';
import { BehaviorSubject } from 'rxjs';
declare var $: any
@Component({
  selector: 'app-resume-request',
  templateUrl: './resume-request.component.html',
  styleUrls: ['./resume-request.component.scss']
})
export class ResumeRequestComponent implements OnInit {

  @Input('title') title: string = 'Resume Request';
  @Input() widgetDesc: string;
  userType = localStorage.getItem('userType');
  headerTitle: string = 'Resume Request';
  user: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
  response = new BehaviorSubject<any[]>([]);
  stopScroll : boolean = false;
  prevAfterKey : string = '';
  loadAPIcall:boolean=false;
  filterjob;
  some : boolean = false;
  totalCount: any;
  @Input() inputData: string;
  @Input() page: any;
  configlist = {
    itemsPerPage: 5,
    currentPage: 1
  }
  url = AppSettings.photoUrl;
  pathdata: any;
  userId = localStorage.getItem('userId')
  @Input() maxMin: any = {};
  viewType: string = "MIN";
  obj: any = {
    limit: 10,
    searchAfterKey: null,
    userId: localStorage.getItem('userId')
  }

  candidateId: any;
  jobId: any;
  searchConfig: any = { pageNumber: 0 }
  FormData: any;
  resumeupload;
  fileDragdrop: any;
  viewedList: any = [];
  object: any;
  modalRef: BsModalRef;
  resumeuploaduserId: any;
  fileSize = AppSettings.FILE_SIZE;
  tempFile: File;
  loaddata:boolean=false

  constructor(private a_route: ActivatedRoute,  private JobServicecolor:JobService,private modalService: BsModalService, private router: Router,
    private provider:countProvider, private apiService: ApiService, private util: UtilService) { }



  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    this.headerTitle = this.widgetDesc;
    this.a_route.queryParams.subscribe((res) => {
      this.filterjob = res.candidatefilter;
      if (res.master != "NETWORK" && res.master != "TEAM" && res.menu != null && res.menu != undefined) {
        this.headerTitle = res.menu;
      }
    })

    this.object = null;


    this.jobsApi();

  }

  getInitialstwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getInitialsparam(firstname,lastname);
  }

  getColortwo(firstname: string,lastname: string): string {
    return this.JobServicecolor.getColorparam(firstname,lastname);
  }

  jobsApi() {
    if(this.stopScroll){
      return;
    }
    this.loadAPIcall=true
    this.apiService.create("candidates/findMyCandidatesResumeRequests", this.obj).subscribe((res) => {
      this.loaddata=true
      this.loadAPIcall=false
      this.util.stopLoader();
      if (res.data != null && res.data.resumeRequests) {
        const afterKey = res.data.searchAfterKey;
        const resData = res.data.resumeRequests;

        if(this.prevAfterKey === afterKey || resData.length  === 0){
          this.stopScroll = true;
          this.util.stopLoader();
          return;
        }

        if(res.data.totalCount!=undefined){
          this.totalCount = res.data.totalCount;
          this.provider.setCount(this.totalCount);
        }

        const data = resData.map(ele => {
          if (ele.user != null) {
            if (ele.user.photo != null) {
              ele.user.photo = AppSettings.photoUrl + ele.user.photo
            } else if (ele.user.photo == null) {
              ele.user.photo = null
            }
          }
          return ele;
        });

        const combined = [...this.response.getValue() , ...data];
        this.response.next(combined);
        this.prevAfterKey = afterKey;
      }else{
        this.loaddata=false
      }

    })
  }

  modelopen(data) {
    let dataPass: any = {};
    dataPass.data = data;
    dataPass.menu = this.widgetDesc;
    dataPass.master = this.page;
    dataPass.masterMenu = this.inputData;
    dataPass.widgetName = "ResumeRequestComponent";
    dataPass.count = this.totalCount;
    this.router.navigate(['suggestions'], { queryParams: dataPass })
  }

  pagecount(event) {
    this.configlist.currentPage = event;
    this.page = event;
    this.obj.pageNumber = this.page - 1;
    this.jobsApi();

  }

  removeFiles() {
    $("#fileDropRef")[0].value = '';
    if (this.fileDragdrop != null && this.resumeupload != null) {
      this.fileDragdrop = null
      this.resumeupload = null
    }

  }
  onFileDropped($event) {

    this.prepareFilesList($event);
  }

  onDownload() {
    const file: File = this.tempFile;
    this.downloadFile(new Blob([file]), file.name);
  }

  downloadFile(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.append(link);
    link.click();
    link.remove();
    // in case the Blob uses a lot of memory
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  }

  fileBrowseHandler(files) {
    this.tempFile = files[0];
    this.prepareFilesList(files);

  }



  prepareFilesList(files: File) {
    // this.resumeupload = undefined;
    this.fileDragdrop = files[0];
    this.resumeupload = files[0];
    var fromate = ['application/pdf', 'application/docx', 'application/doc', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    if (files[0].size > this.fileSize) {
      this.fileDragdrop = null;
      Swal.fire({
        icon: "info",
        title: "Please upload file lesser than 10 MB",
        showDenyButton: false,
        timer: 3000,
      })
      $("#fileDropRef")[0].value = '';
      this.resumeupload = null
    }
    else if (fromate.includes(files[0].type)) {
      this.fileDragdrop = files[0];
      this.resumeupload = files[0];

    } else {
      this.fileDragdrop = "";
      this.resumeupload = undefined;
      Swal.fire({
        icon: "info",
        title: "Please upload valid formate.",
        showDenyButton: false,
        timer: 3000,
      })
    }
  }


  open(data, path) {

  }

  model(items, template: TemplateRef<any>, index) {
    this.util.startLoader();
    this.object = null;
    this.resumeupload = undefined;
    this.object = index;
    this.fileDragdrop = null;
    this.resumeuploaduserId = items.user.userId;
    this.candidateId = items.candidateEntity.candidateId;
    if (items.jobDetails != null) {
      this.jobId = items.jobDetails.jobId;
    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    let resume: Array<any> = items.candidateEntity.resumes
    if (resume == null || undefined) {
      this.util.stopLoader();
      this.modalRef = this.modalService.show(template, ngbModalOptions);
      this.util.stopLoader();
    }
    // else if (resume.length >= 3) {
    //   this.util.stopLoader();
    //   Swal.fire(
    //     "You Already have 3 resumes , please delete and add another resume"
    //   )
    // }
  }

  onScrollDown(){
    if(!this.stopScroll&&this.obj.searchAfterKey != this.prevAfterKey){
      this.obj.searchAfterKey = this.prevAfterKey;
      this.jobsApi();
    }
  }


}
