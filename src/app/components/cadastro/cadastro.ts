import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCadastroComponent } from '../login-cadastro/login-cadastro';
import { UsuariosService } from '../../services/usuarios';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoginCadastroComponent],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class CadastroComponent {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  onSubmit(formValue: any) {
    const { nome, email, senha } = formValue;

    console.log('Tentando cadastrar:', formValue);

    this.usuariosService.usuarioExiste(email).subscribe({
      next: (usuarios) => {
        if (usuarios.length > 0) {
          alert('Já existe um usuário cadastrado com este e-mail.');
          return;
        }

        this.usuariosService.cadastrar({ nome, email, senha }).subscribe({
          next: (novoUsuario) => {
            console.log('Usuário cadastrado:', novoUsuario);
            alert('Usuário cadastrado com sucesso!');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Erro ao cadastrar usuário:', error);
            alert('Erro ao cadastrar usuário. Tente novamente.');
          }
        });
      },
      error: (error) => {
        console.error('Erro ao verificar usuário:', error);
        alert('Erro ao verificar usuário. Tente novamente.');
      }
    });
  }

  campos = [
    { type: 'text', model: 'nome', name: 'nome', placeholder: 'Nome', required: true, validators: ['required'] },
    { type: 'email', model: 'email', name: 'email', placeholder: 'E-mail', required: true, validators: ['required', 'email'] },
    { type: 'password', model: 'senha', name: 'senha', placeholder: 'Senha', required: true, validators: ['required'] }
  ];
}
