import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoyrideService } from 'ngx-joyride';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  constructor(
    private joyrideService: JoyrideService,
    private http: HttpClient,
    private router: Router,
  ) {}

  getTourSteps(): Observable<any[]> {
    return this.http.get<any[]>('assets/tour-steps.json');
  }

  startTour(fromStep?: string): void {
    this.getTourSteps().subscribe(steps => {
      const initialStep = fromStep || this.getLastTourStep() || steps[0].stepId;  
 
      document.body.classList.add("noscroll");
      this.joyrideService.startTour({
        steps: steps.map(step => step.stepId),
        stepDefaultPosition: 'bottom',
        showCounter: true,
        logsEnabled: true,
         startWith: initialStep
      }).subscribe({
        next: (step:any) => {
           localStorage.setItem('lastTourStep', step.name);
           this.navigateToStep(step.name, steps);
           this.adjustTourModalPosition(step);

        },
        complete: () => {
          console.log('Tour completed');
          // localStorage.removeItem('lastTourStep');
          document.body.classList.remove("noscroll");

        },
        error: (error) => {
          document.body.classList.remove("noscroll");

          console.error('Tour error:', error);
        }
      });
    });
  }

  resumeTour(): void {
     const lastStep = localStorage.getItem('lastTourStep');
    if (lastStep) {
      this.startTour(lastStep);
    } else {
      
      console.log('No step to resume from, starting tour from the beginning.');
      this.startTour(); // Optionally start from the beginning if no step is stored
    }
  }

  private getLastTourStep(): string | null {
    return localStorage.getItem('lastTourStep');
  }

  private navigateToStep(stepId: string, steps: any[]): void {
    const step = steps.find(s => s.stepId === stepId);
    if (step && step.route) {
      this.router.navigateByUrl(step.route).then(success => {
        if (!success) {
          console.error('Navigation failed to:', step.route);
        }
      });
    }
  }

  adjustTourModalPosition(step: any) {
    // Delay execution to ensure DOM updates have settled
    setTimeout(() => {
      const targetElement = document.querySelector(`#${step.anchorId}`);
      if (targetElement) {
        const modalElement = document.querySelector('.joyride-tooltip__container');
        if (modalElement) {
          modalElement.setAttribute('style', `top: ${targetElement.getBoundingClientRect().bottom + 10}px; left: ${targetElement.getBoundingClientRect().left}px;`);
        }
      }
    }, 200);
  }
  
}
