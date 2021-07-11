import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { LoginComponent } from '../login/login.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfileComponent, LoginComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [ProfileComponent, LoginComponent],
})
export class SharedModule {}
