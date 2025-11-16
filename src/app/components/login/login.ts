import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginCadastroComponent } from '../login-cadastro/login-cadastro';
import { UsuariosService } from '../../services/usuarios';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, LoginCadastroComponent],
  templateUrl: './login.html',
})
export class LoginComponent {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private auth: AuthService
  ) {}

  onSubmit(formData: any) {
    const { email, senha } = formData;

    console.log('Dados do formulário:', formData);

    this.usuariosService.autenticar(email, senha).subscribe((usuarios) => {
      if (usuarios.length > 0) {
        const usuario = usuarios[0];

        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

        this.auth.setLogado(true);

        alert(`Bem-vindo, ${usuario.nome}!`);
        this.router.navigate(['/dashboard']);
      } else {
        alert('E-mail ou senha incorretos!');
      }
    });
  }

  campos = [
    { type: 'email', model: 'email', name: 'email', placeholder: 'E-mail', required: true },
    { type: 'password', model: 'senha', name: 'senha', placeholder: 'Senha', required: true },
  ];
}
