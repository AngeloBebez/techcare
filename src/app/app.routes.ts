import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { CadastroComponent } from './components/cadastro/cadastro';
import { esqueciSenhaComponent } from './components/esqueci-senha/esqueci-senha';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'esqueci-senha', component: esqueciSenhaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
