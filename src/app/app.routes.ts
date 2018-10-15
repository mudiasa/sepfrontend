import { FinanceManagerComponent } from './components/finance-manager/finance-manager.component';
import { SubteamMemberComponent } from './components/subteam-member/subteam-member.component';
import { ServiceManagerComponent } from './components/service-manager/service-manager.component';
import { ProdmanagerComponent } from './components/prodmanager/prodmanager.component';
import { AdminmanagerComponent } from './components/adminmanager/adminmanager.component';
import { CsmanagerComponent } from './components/csmanager/csmanager.component';
import { CsemployeeComponent } from './components/csemployee/csemployee.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DashboardDemoComponent} from './demo/view/dashboarddemo.component';
import {SampleDemoComponent} from './demo/view/sampledemo.component';
import {FormsDemoComponent} from './demo/view/formsdemo.component';
import {DataDemoComponent} from './demo/view/datademo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MenusDemoComponent} from './demo/view/menusdemo.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {UtilsDemoComponent} from './demo/view/utilsdemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'sample', component: SampleDemoComponent},
    {path: 'forms', component: FormsDemoComponent},
    {path: 'data', component: DataDemoComponent},
    {path: 'panels', component: PanelsDemoComponent},
    {path: 'overlays', component: OverlaysDemoComponent},
    {path: 'menus', component: MenusDemoComponent},
    {path: 'messages', component: MessagesDemoComponent},
    {path: 'misc', component: MiscDemoComponent},
    {path: 'empty', component: EmptyDemoComponent},
    {path: 'charts', component: ChartsDemoComponent},
    {path: 'file', component: FileDemoComponent},
    {path: 'utils', component: UtilsDemoComponent},
    {path: 'documentation', component: DocumentationComponent},

    { path: 'register', component: RegisterComponent},
    { path: 'csemployee', component: CsemployeeComponent},
    { path: 'csmanager', component: CsmanagerComponent},
    { path: 'fmanager', component: FinanceManagerComponent},
    { path: 'adminmanager', component: AdminmanagerComponent},
    { path: 'prodmanager', component: ProdmanagerComponent},
    { path: 'servicemanager', component: ServiceManagerComponent},
    { path: 'stmember', component: SubteamMemberComponent},
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
