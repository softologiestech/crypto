import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InrPageRoutingModule } from './inr-routing.module';

import { InrPage } from './inr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InrPageRoutingModule
  ],
  declarations: [InrPage]
})
export class InrPageModule {}
