import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormatNumberPipe } from 'src/pipes/format-time.pipe';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FormatNumberPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
