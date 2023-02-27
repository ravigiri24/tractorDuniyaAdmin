import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loanlist',
  templateUrl: './loanlist.component.html',
  styleUrls: ['./loanlist.component.scss']
})
export class LoanlistComponent implements OnInit {
  loanassign_action=0;
  constructor() { }

  ngOnInit(): void {
  }

  loanAssignMember(action) {
    this.loanassign_action = action;
  }

  // addLoan(action) {
  //   this.loan_action = action;
  // }
}
