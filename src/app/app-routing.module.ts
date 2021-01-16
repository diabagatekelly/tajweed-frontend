import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AuthGuard } from './services/auth/auth.guard';
import { HomepageComponent } from './components/homepage/homepage.component';
import { StudentComponent } from './components/student/student.component';
import { StartComponent } from './components/start/start.component';
import { AccountComponent } from './components/student/account/account.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomepageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'start', component: StartComponent },
  { path: 'student-hub', component: StudentComponent, canActivate: [ AuthGuard ] },
  { path: 'account', component: AccountComponent, canActivate: [ AuthGuard ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
  providers: [ AuthGuard ]
})

export class AppRoutingModule { }

export const RoutingComponents = [
  HomepageComponent,
  AboutComponent,
  StudentComponent,
  StartComponent,
  AccountComponent
];
