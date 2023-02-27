import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fixeddeposit',
  templateUrl: './fixeddeposit.component.html',
  styleUrls: ['./fixeddeposit.component.scss']
})
export class FixeddepositComponent implements OnInit {
  deposit_action = 1;
  constructor() { }

  ngOnInit(): void {
  }

  actionDeposit(action) {
    this.deposit_action = action;
  }
}
