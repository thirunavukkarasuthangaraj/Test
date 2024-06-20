import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-templates',
  templateUrl: './svg-templates.component.html',
  styleUrls: ['./svg-templates.component.scss'],
  inputs: ['svgType']
})
export class SvgTemplatesComponent implements OnInit {
  constructor() {}

  svgType: string;
  ngOnInit() {
  }

}
