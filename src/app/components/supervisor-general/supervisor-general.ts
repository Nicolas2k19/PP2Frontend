import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-supervisor-general',
  templateUrl: './supervisor-general.html',
  styleUrls: ['./supervisor-general.css'],

})

export class SupervisorGeneralComponent implements OnInit {

  hayError: boolean;

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
  }
  
}





