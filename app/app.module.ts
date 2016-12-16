import {NgModule}      from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule}    from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';
import {APP_BASE_HREF} from '@angular/common';

import { routing, appRouterProviders } from './app.routing';

import {AppComponent}  from './app.component';
import {CarService} from './cars/carservice';
import {DataService} from './data/dataservice';
import {InputTextModule,DataTableModule,ButtonModule,DialogModule, AutoCompleteModule, PaginatorModule, TooltipModule, OverlayPanelModule, DropdownModule} from 'primeng/primeng';
import {HomeComponent} from "./homecomponent/home.component";
import {AnalysisComponent} from "./analysiscomponent/analysis.component";
import {DropdownComponent} from "./dropdowncomponent/dropdown.component";
import {CustomDropdownComponent} from "./customdropdowncomponent/customdropdown.component";

@NgModule({
  imports:      [routing, BrowserModule,FormsModule,HttpModule,OverlayPanelModule,InputTextModule,DataTableModule,ButtonModule,DialogModule, AutoCompleteModule, PaginatorModule, TooltipModule, DropdownModule],
  declarations: [AppComponent , HomeComponent , AnalysisComponent,
    DropdownComponent,
    CustomDropdownComponent
  ],
  bootstrap:    [AppComponent],
  providers:    [CarService , DataService , {provide: APP_BASE_HREF, useValue : '/' }]
})
export class AppModule { }
