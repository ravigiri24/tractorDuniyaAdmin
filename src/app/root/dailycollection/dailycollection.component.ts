import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dailycollection',
  templateUrl: './dailycollection.component.html',
  styleUrls: ['./dailycollection.component.scss']
})
export class DailycollectionComponent implements OnInit {
  loanassign_action=0;
  constructor() { }

  ngOnInit(): void {
  }
  
  loanAssignMember(action) {
    this.loanassign_action = action;
  }
}
