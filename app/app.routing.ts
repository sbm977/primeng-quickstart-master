/**
 * Created by smishra2 on 11/18/2016.
 */
/**
 * Created by smishra2 on 11/7/2016.
 */
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './homecomponent/home.component';
import { AnalysisComponent } from './analysiscomponent/analysis.component'
import {DropdownComponent} from "./dropdowncomponent/dropdown.component";

export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'dropdown', component: DropdownComponent},
    {path: 'analysis', component: AnalysisComponent}
];

export const appRouterProviders: any[] = [];

export const routing: ModuleWithProviders =
    RouterModule.forRoot(appRoutes);