import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-price-back-buttonenable',
  templateUrl: './price-back-buttonenable.component.html',
  styleUrls: ['./price-back-buttonenable.component.scss']
})
export class PriceBackButtonenableComponent implements OnInit {
  trustedUrl: SafeResourceUrl;
  safeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://buy.stripe.com/test_aEUeWNaAde8gclG003');
  }

  ngOnInit() {

  }

  onError(event: any) {
    console.error('Failed to load the iframe:', event);
  }

}
