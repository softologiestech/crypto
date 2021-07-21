import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewOrder1Page } from './new-order1.page';

const routes: Routes = [
  {
    path: '',
    component: NewOrder1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewOrder1PageRoutingModule {}
