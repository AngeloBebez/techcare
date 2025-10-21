import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCadastroComponent } from '../login-cadastro/login-cadastro';
import { UsuariosService } from '../../services/usuarios';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [LoginCadastroComponent],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class CadastroComponent {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  onSubmit(formData: any) {
    console.log('Tentando cadastrar:', formData);

    const { nome, email, senha } = formData;

    if (!nome || !email || !senha) {
      alert('Preencha todos os campos.');
      return;
    }

    if (this.usuariosService.usuarioExiste(email)) {
      alert('Já existe um usuário cadastrado com este e-mail.');
      return;
    }

    const novoUsuario = this.usuariosService.cadastrar({ nome, email, senha });
    console.log('Usuário cadastrado com sucesso:', novoUsuario);

    alert('Usuário cadastrado com sucesso!');
    this.router.navigate(['/login']);
  }

  titulo = 'Crie sua conta';
  subtitulo = 'Cadastre-se para acessar o TechCare';
  textoBotao = 'Cadastrar';
  linkDescricao = 'Já possui uma conta?';
  linkTexto = 'Login';
  linkRota = '/login';

  campos = [
    { type: 'text', model: 'nome', name: 'nome', placeholder: 'Nome', required: true },
    { type: 'email', model: 'email', name: 'email', placeholder: 'E-mail', required: true },
    { type: 'password', model: 'senha', name: 'senha', placeholder: 'Senha', required: true }
  ];
}
