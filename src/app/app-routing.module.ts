import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AuthGuard } from './services/auth/auth.guard';
import { ActivityComponent } from './components/student-hub/activity/activity.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { StudentHubComponent } from './components/student-hub/student-hub.component';
import { StartComponent } from './components/start/start.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomepageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'student-hub', component: StudentHubComponent, canActivate: [ AuthGuard ] },
  { path: 'start', component: StartComponent }
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
  StudentHubComponent,
  StartComponent
];
