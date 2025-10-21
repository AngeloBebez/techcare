import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginCadastroComponent } from '../login-cadastro/login-cadastro';
import { UsuariosService } from '../../services/usuarios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, LoginCadastroComponent],
  templateUrl: './login.html'
})
export class LoginComponent {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  onSubmit(formData: any) {
    const { email, senha } = formData;

    console.log('Dados do formulário:', formData);

    const usuario = this.usuariosService.autenticar(email, senha);

    if (usuario) {
      alert(`Bem-vindo, ${usuario.nome}!`);
      // this.router.navigate(['/fazer depois']);
    } else {
      alert('E-mail ou senha incorretos!');
    }
  }

  titulo = 'Bem-vindo de volta!';
  subtitulo = 'Entre com suas credenciais';
  textoBotao = 'Entrar';
  textoAlternativo = 'Não tem uma conta?';
  linkTexto = 'Cadastre-se';
  linkRota = '/cadastro';
  mostrarEsqueciSenha = true;

  campos = [
  {
    type: 'email',
    model: 'email',
    name: 'email',
    placeholder: 'E-mail',
    required: true
  },
  {
    type: 'password',
    model: 'senha',
    name: 'senha',
    placeholder: 'Senha',
    required: true
  }
];
}
