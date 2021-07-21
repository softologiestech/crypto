import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewOrder1PageRoutingModule } from './new-order1-routing.module';

import { NewOrder1Page } from './new-order1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewOrder1PageRoutingModule
  ],
  declarations: [NewOrder1Page]
})
export class NewOrder1PageModule {}
