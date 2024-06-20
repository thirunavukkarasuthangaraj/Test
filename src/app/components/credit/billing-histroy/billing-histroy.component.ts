import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ElementRef, ViewChild, Input } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
// import * as ExcelJS from 'exceljs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-billing-histroy',
  templateUrl: './billing-histroy.component.html',
  styleUrls: ['./billing-histroy.component.scss']
})
export class BillingHistroyComponent implements OnInit {
  @ViewChild('content') content: ElementRef;
  @ViewChild('billInvoice') billInvoice: ElementRef;
  billhistroy: any = [];
  tempbillhistroy : any = [];
  pageId = 0;
  index: any;
  id = "1";
  today: any = new Date()
  loaddata:boolean=true;
  userId = localStorage.getItem('userId');
  configlist = {
    itemsPerPage: 10,
    currentPage: 1
  }
  formattedRemark: string = '';
  modalRef?: BsModalRef;
  invoiceData: any = {};

  userData: any;
  totalcount: any = 10;
  public lamdaurl: any = environment.LAMDA_URL;

  constructor(private http: HttpClient, private datePipe: DatePipe, private modalService: BsModalService, private route: ActivatedRoute, private api: ApiService, private fb: UntypedFormBuilder, private util: UtilService) { }





  // public SavePDF(): void {
  //   let DATA: any = document.getElementById('billInvoice');
  //   html2canvas(DATA).then((canvas) => {
  //     let fileWidth = 208;
  //     let fileHeight = (canvas.height * fileWidth) / canvas.width;

  //     const FILEURI = canvas.toDataURL('image/png');
  //     let PDF = new jsPDF('p', 'mm', 'a4');

  //     let position = 0;
  //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  //     PDF.save('Invoice.pdf');
  //   });

  // }



  Refresh(){
    this.loaddata=true;

     this.historyAPIcall(this.selectedYear);
  }

  ngOnInit() {
    this.selectedYear = new Date().getFullYear();
    this.historyAPIcall(this.selectedYear);
    this.generateYears();
    this.userdetails();
  }
  activeTab(id) {
    this.id = id;

  }
  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'CANCELLED':
        return 'red';
      case 'PENDING':
        return '#ffb606';
      case 'FAILED':
        return 'red';
      case 'COMPLETED':
        return 'green';
      default:
        return '';
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status) {
      case 'CANCELLED':
        return 'Cancelled';
      case 'PENDING':
        return 'Pending';
      case 'FAILED':
        return 'Failed';
      case 'COMPLETED':
        return 'Successful';
      default:
        return '';
    }
  }


  filedownload() {
    //  let data: any[] = [
    //     { Date: 'John', Invice: "INV-12345678", Description:" Sep' 2023 - Team Plan - Monthly Subscription -Seats ",Amount:20,Status:"success" },
    //     { Date: 'John', Invice: "INV-12345678", Description:" Sep' 2023 - Team Plan - Monthly Subscription -Seats ",Amount:20,Status:"success" },
    //     { Date: 'John', Invice: "INV-12345678", Description:" Sep' 2023 - Team Plan - Monthly Subscription -Seats ",Amount:20,Status:"success" },
    //     { Date: 'John', Invice: "INV-12345678", Description:" Sep' 2023 - Team Plan - Monthly Subscription -Seats ",Amount:20,Status:"success" },
    //     { Date: 'John', Invice: "INV-12345678", Description:" Sep' 2023 - Team Plan - Monthly Subscription -Seats ",Amount:20,Status:"success" },
    //    ];

    this.generateExcelFile(this.billhistroy, 'example');
  }

  generateExcelFile(data: any[], fileName: string) {



    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheetData = [];

    // Define header row and data rows
    const headerRow = ['S.No', 'Date', 'MembershipType', 'Invoice Id', 'Payment Status','Remarks', 'Subscription Amount'];
    worksheetData.push(headerRow);

    this.billhistroy.forEach((item, i) => {
      const formattedDate = this.datePipe.transform(new Date(item.createdOn), 'MM-dd-yyyy');
      const remarks = item.remarks ? item.remarks.split('-')[1] : '-';
      const dataRow = [i + 1, formattedDate, item.membershipType, item.invoiceId, item.paymentStatus,remarks, '$' + item.subcriptionAmount / 100];
      worksheetData.push(dataRow);
    });

    // Create a worksheet from the data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate a blob from the workbook
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } }, // White text color
      alignment: { horizontal: 'center' },
      fill: { fgColor: { rgb: '63CFBE' } }, // Background color
    };

    // Apply header styles to the header row
    worksheetData[0].forEach((cellValue, index) => {
      const cellAddress = XLSX.utils.encode_cell({ c: index, r: 0 });
      worksheet[cellAddress].s = headerStyle;
    });


    // Generate the XLSX file
    const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create a Blob
    const blob = new Blob([new Uint8Array(xlsxData)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'History.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);



  }



  userdetails() {
    const userId = localStorage.getItem("userId");
   // this.util.startLoader();
    this.api.query("user/" + userId).subscribe((res) => {
      this.userData = res;

    }, err => {
      //this.util.stopLoader();
    });
  }

  close() {
    this.modalRef.hide();
  }

  modelopen(template: TemplateRef<any>, item) {
    this.invoiceData = item;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  billingaddress: any;
  extendedprice: number = 0;

  async historyAPIcall(year) {


    let response: any = await this.api.lamdaFunctionsget(
      `planPurchaseHistory?userId=${this.userId}&page=${this.pageId}&size=100&year=${year}`
    );

    this.loaddata=false;
    this.tempbillhistroy =  this.billhistroy = response.data.history;

     response.data.history.forEach((ele, i) => {
      if (ele.remarks) {
        const parts = ele.remarks.split('-');
        this.billhistroy[i].formattedRemark = parts.length > 1 ? parts.slice(1).join('-') : ele.remarks;
      } else {
        this.billhistroy[i].formattedRemark = '-'; // Handle the case when remarks is null
      }
      this.extendedprice = (response.data.history[i].subcriptionAmount - response.data.history[i].discountedAmount) / 100;

    });
  this.util.stopLoader();
    this.loaddata=false;
  }



  pagecount(event) {
    this.index = event;
    this.pageId = event - 1;

  }


  years: any = []
  date: any = []
  selectedYear: number | null = null; // Initialize selectedYear

  generateYears() {
    this.years = [];
    this.date = [];
    for (let i = new Date().getFullYear(); i >= new Date().getFullYear() - 5; i--) {
      this.years.push(i);
    }
  }

  onYearChange() {
    this.loaddata=true;
      let yearToSend = this.selectedYear !== null ? this.selectedYear : new Date().getFullYear();
      this.historyAPIcall(yearToSend);
  }
}
