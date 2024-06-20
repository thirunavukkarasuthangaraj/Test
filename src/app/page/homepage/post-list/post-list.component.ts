import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  @ViewChild('landingside1') menuElement: ElementRef;

  landingsidesticky1: boolean = false;
  landingsidesticky2: boolean = false;
  elementPosition: any;
  searchKey
  passdata
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    window.scrollTo(0, 0);
   // this.elementPosition = this.menuElement.nativeElement.offsetTop;
   // //// console.log(this.elementPosition);
  }

  @HostListener('window:scroll')
    handleScroll(){
      const windowScroll = window.pageYOffset;
      if(windowScroll >= 24){
        this.landingsidesticky1 = true;
        this.landingsidesticky2 = true;
      } else {
        this.landingsidesticky1 = false;
        this.landingsidesticky2 = false;
      }
    }

}
