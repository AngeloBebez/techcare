import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { CadastroComponent } from './components/cadastro/cadastro';
import { EsqueciSenhaComponent } from './components/esqueci-senha/esqueci-senha';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'esqueci-senha', component: EsqueciSenhaComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'dispositivos/novo', loadComponent: () => import('./components/dispositivos-forms/dispositivos-forms').then(c => c.DispositivosFormsComponent)}
];
