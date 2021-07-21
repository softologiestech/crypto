import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TradeComponent } from './trade/trade.component';

@NgModule({
  declarations: [ProfileComponent, LoginComponent, TradeComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [ProfileComponent, LoginComponent, TradeComponent],
})
export class SharedModule {}
