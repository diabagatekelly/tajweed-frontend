import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ActivityComponent } from './components/student-hub/activity/activity.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { StudentHubComponent } from './components/student-hub/student-hub.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomepageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'student-hub', component: StudentHubComponent },
  { path: 'student-activity', component: ActivityComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export const RoutingComponents = [
  HomepageComponent,
  AboutComponent,
  StudentHubComponent,
  ActivityComponent
];
