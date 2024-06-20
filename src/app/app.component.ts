import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
 import { ActivatedRoute } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { ConnectionService } from 'ng-connection-service';
import { environment } from 'src/environments/environment';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';

 @Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  queryParams: any
  title = 'Gigsumo';
  status = 'Online';
  isConnected = true;

  constructor(
    private _api: ApiService,
    private activateRoute: ActivatedRoute,
    private connectionservices: ConnectionService,
    private util: UtilService,
    private swUpdate: SwUpdate) {
    this.connectionservices.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
      } else {
        this.status = "OFFLINE";
        this.util.stopLoader();
      }
    });

    this.checkForUpdates();
  }

 
  ngOnInit(): void {
     if (environment.production) {
      this.loadGTM(environment.gtmId);
    }
  }

  private loadGTM(id: string): void {
    // Load the GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
 
    // Inject the inline script once the GTM script is loaded
    script.onload = () => {
      window['dataLayer'] = window['dataLayer'] || [];
      const gtagScript = document.createElement('script');
      const inlineCode = document.createTextNode(`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');
      `);
      gtagScript.appendChild(inlineCode);
      document.head.appendChild(gtagScript);
    };
  }
 

  ngAfterViewInit(): void {
    window.addEventListener('beforeunload', (event) => {
      // this.updateUserOnlineOrOffline('OFFLINE');
      // event.returnValue = `Are you sure you want to leave?`;
    });
  }

  ngOnDestroy() {
    // this.updateUserOnlineOrOffline('OFFLINE');
  }

  @HostListener('window:unload', ['$event'])
  unload($event: Event): void {
    // this.updateUserOnlineOrOffline('OFFLINE');
  }

  @HostListener('window:beforeunload', ['$event']) beforeunloadHandler(event) {
    // this.updateUserOnlineOrOffline('OFFLINE');
  }


  public doBeforeUnload(): void {

  }

  public doUnload(): void {
    //this.updateUserOnlineOrOffline('OFFLINE');
  }


  checkForUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("New version available. Load the new version?")) {
          window.location.reload();
        }
      });
    }
  }




  private updateUserOnlineOrOffline(status: any) {
    var path = this.activateRoute.pathFromRoot[0]['_routerState']['snapshot'].url
    var b = path.substring(0, 8)
    if (b != 'undefined' && b != "" && b != '/success') {
      let url = 'user/onlineoroffline';
      let user = {
        userId: localStorage.getItem('userId'),
        online: status.toUpperCase()
      };
      this.util.startLoader()
      this._api.create(url, user).subscribe(res => {
        this.util.stopLoader()
      }, err => {
        this.util.stopLoader();

      });
    }


  }

}
