import { element } from 'protractor';
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appQueryDOM]'
})
export class QueryDOMDirective implements OnInit{

  @Input() response : String;
  @Input() netWorkName:String;


  constructor(private el:ElementRef , private render :Renderer2) {

  }

  ngOnInit(): void {

    const img : HTMLElement = this.el.nativeElement.firstChild;
    const text : HTMLElement = this.el.nativeElement.lastChild;

    setTimeout(() => {
      if(this.response === "NULL"){
        text.innerHTML ="There's no Suggestion for you.";
        this.render.setStyle(img,'display','block');
      }
    }, 2000);

    if(this.netWorkName){

      const text : HTMLElement = this.el.nativeElement.firstChild;
         setTimeout(() => {
          text.innerHTML ="No members available in this network. Please connect with " +this.netWorkName +" for them to appear here.";
         }, 2000);
     }

  }

}
