import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AboutComponent } from './components/about/about.component';
import { FooterComponent } from './shared/footer/footer.component';
import { StudentHubComponent } from './components/student-hub/student-hub.component';
import { ActivityComponent } from './components/student-hub/activity/activity.component';
import { ActivityFormComponent } from './components/student-hub/activity/activity-form/activity-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AudioRecordingService } from './services/audio-recording.service';
import { AudioService } from './services/audio.service';
import { TajweedService } from './services/tajweed.service';
import { StartComponent } from './components/start/start.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    RoutingComponents,
    NavbarComponent,
    AboutComponent,
    FooterComponent,
    StudentHubComponent,
    ActivityComponent,
    ActivityFormComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [AudioRecordingService, AudioService, TajweedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
