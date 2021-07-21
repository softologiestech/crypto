import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'info',
    loadChildren: () =>
      import('./pages/info/info.module').then((m) => m.InfoPageModule),
  },
  {
    path: 'new-order',
    loadChildren: () =>
      import('./pages/new-order/new-order.module').then(
        (m) => m.NewOrderPageModule
      ),
  },
  {
    path: 'new-order1',
    loadChildren: () =>
      import('./pages/new-order1/new-order1.module').then(
        (m) => m.NewOrder1PageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
