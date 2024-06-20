import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-follow-careonline',
  templateUrl: './follow-careonline.component.html',
  styleUrls: ['./follow-careonline.component.scss']
})
export class FollowCareonlineComponent implements OnInit {

  @Input('title') title: any = 'Follow GigSumo ';

  headerTitle: any = 'Follow GigSumo ';

  constructor() {
    this.headerTitle = this.title;
  }

  ngOnInit() {
  }

}
