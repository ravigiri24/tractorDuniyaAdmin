import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SharedataService } from '../../services/sharedata.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MultiDataSet, Label } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Routes, RouterModule, Router, Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
// import 'datatables.net';
// import { AdmItem } from 'src/app/data-access/entities/admitem.entity';
// import { AdmFile } from 'src/app/data-access/entities/admfile.entity';
// import { DatabaseService } from 'src/app/data-access/database.service';
// import { ConfirmationDialogService } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.service';
// import { Epg } from 'src/app/data-access/entities/epg.entity';
// import { Subnet } from 'src/app/data-access/entities/subnet.entity';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  title = 'Online Loan Management';
  public records: any[] = [];
  public fileName = 'Select file';
  public uploadProgress = '';
  public alert_show = '';
  public uploading: boolean = false;
  public isViewFileRecords: boolean = false;
  @ViewChild('csvReader', { static: false }) csvReader: any;
  public tableWidget: any;
  // admItemsList: AdmItem[] = [];
  // admFilesList: AdmFile[] = [];
  insertedId: number = 0;
  epgData: any[] = [];
  epgsubnetData: any[] = [];
  bridgeDomianData: any[] = [];
  subnetData: any[] = [];
  staff_rfid: any;
  fromdate: any = '';
  todate: any = '';
  kot_list: any;
  dash_detail: any = {};

  report_dates: FormGroup
  bill_list: any;
  kot_search: any;
  bill_search: any;
  m_order_code: any;
  shownotification: any;
  staff_name: any;
  notificationdetails;
  // constructor(private translate: TranslateService, private appservice: AppService,private router: Router) {
  //   translate.setDefaultLang('en');
  // }
  constructor(
    private http: HttpClient,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private share: SharedataService,
    private routes: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }
  top1_qty: any = 0
  top2_qty: any = 0
  top3_qty: any = 0
  top4_qty: any = 0
  top5_qty: any = 0
  top1_prd: any = "Top1"
  top2_prd: any = "Top2"
  top3_prd: any = "Top3"
  top4_prd: any = "Top4"
  top5_prd: any = "Top5"
  public doughnutChartLabels: Label[] = [[this.top1_prd], [this.top2_prd], [this.top3_prd], [this.top4_prd], [this.top5_prd]];
  public doughnutChartData: MultiDataSet = [
    [this.top1_qty, this.top2_qty, this.top3_qty, this.top4_qty, this.top4_qty]
  ];
  public doughnutChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', 'rgba(94,114,228,1)', 'rgba(251,99,64, 1)'],
    },
  ];
  public doughnutChartType: ChartType = 'doughnut';

  // Money Received by orders
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  dinein: any = 0
  takeaway: any = 0
  online_sales: any = 0

  public pieChartLabels: Label[] = [['Dine In - 500'], ['Takeaway - 200'], ['Online Order - 50']];
  public pieChartData: number[] = [this.dinein, this.takeaway, this.online_sales];


  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.7)', 'rgba(0,255,0,0.7)', 'rgba(0,0,255,0.7)'],
    },
  ];
  // Last 6 Month Sales Chart
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['Not-Available', 'Not-Available', 'Not-Available', 'Not-Available', 'Not-Available', 'Not-Available'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  // public barChartColors = [
  //   {
  //     backgroundColor: ['rgba(45,206,137,1)']
  //   },
  // ];
  public barChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0], label: 'Month Sales :' }
  ];

  ngOnInit(): void {
    console.log('component initialized');
    this.staff_rfid = sessionStorage.getItem('Staff_rfid');
    this.get_recent_birthdays();
    this.get_today_kot();
    this.get_bill_of_order();
    this.check_authentication()
    this.report_dates = this.formBuilder.group({
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
    });

    this.current_date_check_table();
    this.current_date_check_room();
    this.dash_info();
    // let chart = new CanvasJS.Chart("chartContainer", {
    //   animationEnabled: true,
    //   exportEnabled: true,
    //   title: {
    //     text: "Basic Column Chart in Angular"
    //   },
    //   data: [{
    //     type: "column",
    //     dataPoints: [
    //       { y: 71, label: "Apple" },
    //       { y: 55, label: "Mango" },
    //       { y: 50, label: "Orange" },
    //       { y: 65, label: "Banana" },
    //       { y: 95, label: "Pineapple" },
    //       { y: 68, label: "Pears" },
    //       { y: 28, label: "Grapes" },
    //       { y: 34, label: "Lychee" },
    //       { y: 14, label: "Jackfruit" }
    //     ]
    //   }]
    // });      
    // chart.render();
  }

  check_authentication() {
    var sendObjecttran = {
      staff_rfid: this.staff_rfid,
    };
    this.api.postapi("check_auhtorization", sendObjecttran).subscribe((res: any) => {
    })
  }

  current_date_check_table() {
    var sendObjecttran = {
      staff_rfid: this.staff_rfid,
    };
    this.api
      .postapi('Closing_auto_automatically_table', sendObjecttran)
      .subscribe((res: any) => { });
  }

  current_date_check_room() {
    var sendObjecttran = {
      staff_rfid: this.staff_rfid,
    };
    this.api
      .postapi('Closing_auto_automatically_room', sendObjecttran)
      .subscribe((res: any) => { });
  }

  birthdaylist;
  message_type;
  get_recent_birthdays() {
    this.api.getapi('members_birthday').subscribe((res: any) => {
      if (res.status == 1) {
        this.message_type = res.message_type
        this.birthdaylist = res.data;
      }
    })
  }

  selectedbirthdayusers;
  selectforbirthday(data, index) {
    console.log(data, index);
    this.birthdaylist[index].ischecked = data;
    let users = this.birthdaylist.filter(res => res.ischecked == true);
    if (users.length > 0) {
      this.selectedbirthdayusers = users;
    }
    else {
      this.selectedbirthdayusers = null;
    }
  }

  getmessagetype(x) {
    let msg = this.message_type.filter(res => res.id == x);
    if (msg.length > 0) {
      this.typeid = msg[0].id;
      this.birthdaymessage = msg[0].message;
    }
    else {
      this.typeid = null;
      this.birthdaymessage = null;
    }
  }

  typeid;
  birthdaymessage;
  submitmessage() {
    let sendobj = {
      "member_id": this.selectedbirthdayusers.map(res => res.member_id),
      "message": this.birthdaymessage,
      "message_type": this.typeid
    }
    this.api.postapi('sendSMSToMemeber', sendobj).subscribe((res: any) => {
      if (res.status == 1) {
        this.showNotification('snackbar-sccuss', res.msg, 'bottom', 'center');
        this.get_recent_birthdays()
      }
    })
  }

  branch_details: any;
  kot_list_show: any = 0;
  get_today_kot() {
    let staff_detail = {
      todate: this.todate,
      fromdate: this.fromdate,
      staff_rfid: this.staff_rfid,
    };
    this.api.postapi('kot_list_new', staff_detail).subscribe((res: any) => {
      if (res.status == 1) {
        this.kot_list = res.orders_prd;
        this.branch_details = res.main_details;
        this.kot_list_show = 1
      } else {
        this.kot_list_show = 0
        this.kot_list = res.orders_prd;
        this.branch_details = res.main_details;
      }
    });
  }

  refresh_pie() {
    this.pieChartData = [this.dinein, this.takeaway, this.online_sales];
    this.pieChartLabels = [['Dine In - ' + this.dinein], ['Takeaway -' + this.takeaway], ['Online Order -' + this.online_sales]];
    this.doughnutChartData = [
      [this.top1_qty, this.top2_qty, this.top3_qty, this.top4_qty, this.top5_qty]
    ];
    this.doughnutChartLabels = [[this.top1_prd], [this.top2_prd], [this.top3_prd], [this.top4_prd], [this.top5_prd]];
    //  this.barChartLabels= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    //  this.barChartData = [
    //   { data: [165000, 150000, 180000, 200000, 140000, 175000], label: 'Month Sales :' }
    // ];
  }

  dash_info() {
    let staff_detail = {
      staff_rfid: this.staff_rfid,
      start_date: this.report_dates.get('start_date').value,
      end_date: this.report_dates.get('end_date').value
    };
    this.api.postapi('dash_info', staff_detail).subscribe((res: any) => {
      if (res.status == 1) {
        this.dash_detail = res;
        this.dinein = res.today_dinein_sale;
        this.takeaway = res.today_takeAway_sale;
        this.online_sales = res.online_sales;
        this.top1_qty = res.product_detail[0].dorder_qty;
        this.top2_qty = res.product_detail[1].dorder_qty;
        this.top3_qty = res.product_detail[2].dorder_qty;
        this.top4_qty = res.product_detail[3].dorder_qty;
        this.top5_qty = res.product_detail[4].dorder_qty;
        this.top1_prd = res.product_detail[0].dorder_name
        this.top2_prd = res.product_detail[1].dorder_name
        this.top3_prd = res.product_detail[2].dorder_name
        this.top4_prd = res.product_detail[3].dorder_name
        this.top5_prd = res.product_detail[4].dorder_name
        for (let index = 0; index < res.six_monthly_total_sale.length; index++) {
          this.barChartLabels[index] = res.six_monthly_total_sale[index].monthName
          this.barChartData[0].data[index] = res.six_monthly_total_sale[index].tran_total;
        }
        this.refresh_pie();
      } else {
      }
    });
  }

  no_of_kot: any = 0;
  no_of_bill: any = 0;
  count_kot(i) {
    this.no_of_kot = i;
  }

  count_bill(i) {
    this.no_of_bill = i;
  }
  bill_list_show: any = 0;

  get_bill_of_order() {
    let staff_detail = {
      todate: this.todate,
      fromdate: this.fromdate,
      staff_rfid: this.staff_rfid,
    };
    this.api
      .postapi('get_bill_of_order', staff_detail)
      .subscribe((res: any) => {
        if (res.status == 1) {
          this.bill_list = res.bill_detail;
          this.bill_list_show = 1
        } else {
        }
      });
  }
  m_order_detail: any;
  m_table_no: any;
  m_dorder_date: any;
  m_dorder_time: any;
  m_waiter_name: any;
  checkprint: any = 1;
  order_wise_kotDetail(kot) {
    this.m_order_detail = kot.order_details;
    this.m_order_code = kot.order_code;
    this.m_table_no = kot.table_no;
    this.m_dorder_date = kot.dorder_date;
    this.m_dorder_time = kot.dorder_time;
    this.m_waiter_name = kot.waiter_name;
    console.log('ord', this.m_order_detail);
  }

  print_kot_direct(kot) {
    this.m_order_detail = kot.order_details;
    this.m_order_code = kot.order_code;
    this.m_table_no = kot.table_no;
    this.m_dorder_date = kot.dorder_date;
    this.m_dorder_time = kot.dorder_time;
    this.m_waiter_name = kot.waiter_name;
    this.getPrintDataaa(1);
  }

  print_kot() {
    document.getElementById('close_kot_modal').click();
    this.getPrintDataaa(1);
  }

  billwise_detail: any;
  b_order_detail: any;
  b_table_no: any;
  b_dorder_date: any;
  b_dorder_time: any;
  b_waiter_name: any;
  b_order_code: any;
  branch_nameB: any;
  b_mobileB: any;
  b_emailB: any;
  b_gstinB: any;
  b_addressB: any;
  final_bill_cash_bill: any;
  previous_total: any = '';
  cash_detail_bill: any;
  bill_order: any;

  bill_detail(bill) {
    console.log(bill);
    this.billwise_detail = bill;

    this.b_order_code = bill.order_code;
    this.b_table_no = bill.order_type_no;
    this.b_dorder_date = bill.order_datetime;

    this.final_bill_cash_bill = {
      amount: this.previous_total,
      table_no: bill.order_type_no,

      name: 'cashpay',
      staff_rfid: this.staff_rfid,
    };
    this.api
      .postapi('finalbill_table', this.final_bill_cash_bill)
      .subscribe((res: any) => {
        if (res.status == 1) {
          this.cash_detail_bill = res;
          this.branch_nameB = res.branch_name;
          this.b_mobileB = res.b_mobile;
          this.b_emailB = res.b_email;
          this.b_gstinB = res.b_gstin;
          this.b_addressB = res.b_address;
          this.bill_order = res.result11;
        } else {
        }
      });
  }
  sgst: any;
  cgst: any;
  totalgst: any;
  
  print_bill(table_no) {
    document.getElementById('close_bill_modal').click();
    this.final_bill_cash_bill = {
      amount: this.previous_total,
      table_no: table_no,
      name: 'cashpay',
      staff_rfid: this.staff_rfid,
    };
    this.api
      .postapi('finalbill_table', this.final_bill_cash_bill)
      .subscribe((res: any) => {
        if (res.status == 1) {
          this.cash_detail_bill = res;
          this.branch_nameB = res.branch_name;
          this.b_mobileB = res.b_mobile;
          this.b_emailB = res.b_email;
          this.b_gstinB = res.b_gstin;
          this.b_addressB = res.b_address;
          this.sgst = res.sgst;
          this.cgst = res.cgst;
          this.totalgst = Number(this.sgst) + Number(this.cgst);
          this.getPrintDataaa(2);
        } else {
        }
      });
  }

  rechargeRecieptData: any;
  getPrintDataaa(x) {
    if (x == 1) {
      this.checkprint = 2;
      this.share.setLogoTitle(1);
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          this.checkprint = 1;
          this.rechargeRecieptData = null;

          this.share.setLogoTitle(0);
        }, 20);
      }, 20);
    }
    if (x == 2) {
      this.checkprint = 3;
      this.rechargeRecieptData = this.cash_detail_bill;
      this.share.setLogoTitle(1);

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          this.checkprint = 1;
          this.rechargeRecieptData = null;

          this.share.setLogoTitle(0);
        }, 20);
      }, 20);
    }
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
