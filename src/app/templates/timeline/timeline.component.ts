import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', animate(500)),
    ]),
    trigger('drawLine', [
      state('inactive', style({
        strokeDashoffset: 100,
        strokeDasharray: 100
      })),
      state('active', style({
        strokeDashoffset: 0,
        strokeDasharray: 100
      })),
      transition('inactive => active', animate('0.3s ease-in')),
    ])
  ]
})
export class TimelineComponent implements OnInit, OnChanges {
  constructor(private api: ApiService) { }
  filterStatusData: Array<any>;
  @Input() events: any;

  ngOnInit() {
    this.getAppliedFilter()
    this.events.forEach(ele => {
      if (ele) {
        const timestamp = ele.createdOn.split(",");
        ele.createdOn = timestamp[0]
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.events.length > 0 && changes.events.currentValue != changes.events.previousValue)
      this.getAppliedFilter()
  }

  getFilterValue(key: string) {
    if (Array.isArray(this.filterStatusData)) {
      const arrs: Array<any> = [...this.filterStatusData];
      if (arrs) {
        const find = arrs.find(c => c.itemId === key);
        return find ? find.value : null;
      }
    }
  }


  jobApplicationListValues: any[] = []
  jobApplicationFutureListValues: any[] = []
  blockingListValues: any[] = []
  activityEnded: boolean = false;
  getAppliedFilter() {
    this.api.create('listvalue/findbyList', { domain: "TIMELINE_ACTIVITY_VALUES,JOB_APPLICATION_ACTIVITY,BLOCKING_ACTIVITY_LIST" }).subscribe(res => {
      const sorted: Array<any> = res.data.TIMELINE_ACTIVITY_VALUES && res.data.TIMELINE_ACTIVITY_VALUES.listItems;
      this.blockingListValues = res.data.BLOCKING_ACTIVITY_LIST.listItems
      this.filterStatusData = res.data;
      if (sorted) {
        this.filterStatusData = sorted.map(x => {
          return { itemId: x.itemId, value: x.value };
        });
      }

      let jobApplicationListValues: any[] = []
      jobApplicationListValues = res.data.JOB_APPLICATION_ACTIVITY.listItems
      if (Array.isArray(jobApplicationListValues) && jobApplicationListValues.length > 0) {
        let recentActivity: any;
        let recentActivityOrder: any;
        if (this.events) {
          recentActivity = this.events[0]
        }

        if (recentActivity) {
          recentActivityOrder = jobApplicationListValues.find(ele => ele.itemId === recentActivity.activityType)
        }

        if (recentActivityOrder) {
          this.jobApplicationFutureListValues = []
          jobApplicationListValues.forEach(ele => {
            if (ele.order > recentActivityOrder.order) {
              this.jobApplicationFutureListValues.push(ele);
            }
          })
        }

        const filteredData: any = [];
        const encounteredData = new Set<number>();

        for (const item of this.jobApplicationFutureListValues) {
          if (!encounteredData.has(item.order)) {
            filteredData.push(item);
            encounteredData.add(item.order);
          }
        }
        this.jobApplicationListValues = filteredData.map(x => {
          return { itemId: x.itemId, value: x.value, item: x.item, order: x.order }
        })

        for (const item of this.events) {
          const exists = this.blockingListValues.find((listItem) => (listItem.itemId === item.activityType));
          if (exists) {
            item.notion = "negative"
          } else {
            item.notion = "positive"
          }
        }

        if (this.events[0] && this.events[0].activityType == "ONBOARDED") {
          this.events[0].notion = "positive"
          this.activityEnded = true
        } else {
          if (this.events[0] && this.events[0].notion != "negative") {
            this.events[0].notion = "progress"
            this.activityEnded = false
          } else if (this.events[0] && this.events[0].notion == "negative") {
            this.activityEnded = true
          }
        }
      }
    });
  }
}
