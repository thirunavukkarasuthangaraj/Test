import { PeopleComponent } from './../Search-list-UI/people/people.component';
import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit {

  name = 'Angular';

   @ViewChild('filterData') filterdataRef: ElementRef;

   @Output() filterScarch = new EventEmitter<string>();


  searchmenustick: boolean = false;
  menuData;
  menuData1;
  data
  searchName
  navbarSearchData
  searchText


  constructor(
    // private publicpage: PeopleComponent
    private router: Router ,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
   this.queryParamsData();
  }


  handleScroll(){
    const windowScroll = window.pageYOffset;
    if(windowScroll >= 362){
      this.searchmenustick = true;
    } else {
      this.searchmenustick = false;
    }
  }

  queryParamsData(){
    this.route.queryParams.subscribe(data =>{
       this.menuData1 = data
      this.navbarSearchData = this.menuData1;
      this.searchText = data.searchData;
      this.menuData = data.data;
     })
  }

  // tslint:disable-next-line: member-ordering



  // ngAfterViewInit() {
  //   console.log('Hello ', this.name);
  // };
  navigation(menuSelected){
     this.menuData = menuSelected ;
    let datas:any={}
    datas.data=menuSelected;
    datas.searchData=this.searchText;
    this.router.navigate(['Search-list'],{queryParams : datas});
  }

  // businessUserData(data){
  //   this.data=

  // }

  onkeypressEvent(event){

  }

  filter(){
    const filterInputData = this.filterdataRef.nativeElement.value;
    this.filterScarch.emit(filterInputData);
  }

}
