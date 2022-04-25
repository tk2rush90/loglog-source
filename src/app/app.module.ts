import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {ToastModule} from '@tk-ui/components/toast/toast.module';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {HomeModule} from '@tk2blog90/pages/home/home.module';
import {BlogModule} from '@tk2blog90/pages/blog/blog.module';
import {NotFoundModule} from '@tk2blog90/pages/not-found/not-found.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    TransferHttpCacheModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastModule,
    BlogModule,
    HomeModule,
    NotFoundModule,
  ],
  providers: [SubscriptionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
