import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-members-directory',
  templateUrl: './members-directory.component.html',
  styleUrls: ['./members-directory.component.scss']
})
export class MembersDirectoryComponent implements OnInit {
  form:UntypedFormGroup
  constructor() { }

  ngOnInit() {
  }

}
