// import { Injectable, OnInit } from "@angular/core";
// import { Router, RoutesRecognized } from "@angular/router";
// import { Subject } from "rxjs";
// import { filter, pairwise } from "rxjs/operators";

// @Injectable({
//     providedIn: 'root'
// })
// export class StreamRouter implements OnInit {

//       previousUrl$ = new Subject();

//     constructor(private router: Router) {


//     }

//     ngOnInit(): void {
//         this.router.events
//         .pipe(filter((e: any) => e instanceof RoutesRecognized),
//             pairwise()
//         ).subscribe(([previousEvent, currentEvent]: [RoutesRecognized, RoutesRecognized]) => {
//             console.log('stream emittings',previousEvent.urlAfterRedirects , currentEvent);
//             this.setPrevious(previousEvent.urlAfterRedirects);
//          });
//     }

//     setPrevious(value : any){
//         this.previousUrl$.next(value);
//     }

//     getpreviouseUrl() {
//         return this.previousUrl$.asObservable();
//     }


// }

