import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/components/login/login.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { NotFoundComponent } from './core/layouts/not-found/not-found.component';

export const routes: Routes = [



  {
    path: '',
    component: LoginComponent,
    title:'loginnnn'
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./core/core.module').then(c => c.CoreModule)
  },
  {
    path: 'aliakbar',
    loadChildren: () => import('./modules/profile.module').then(m => m.ModulesModule),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },

];
