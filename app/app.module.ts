import {NgModule}      from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule}    from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';

import {AppComponent}  from './app.component';
import {CarService} from './cars/carservice';
import {DataService} from './data/dataservice';
import {InputTextModule,DataTableModule,ButtonModule,DialogModule, AutoCompleteModule, PaginatorModule} from 'primeng/primeng';

@NgModule({
  imports:      [BrowserModule,FormsModule,HttpModule,InputTextModule,DataTableModule,ButtonModule,DialogModule, AutoCompleteModule, PaginatorModule],
  declarations: [AppComponent],
  bootstrap:    [AppComponent],
  providers:    [CarService , DataService]
})
export class AppModule { }
