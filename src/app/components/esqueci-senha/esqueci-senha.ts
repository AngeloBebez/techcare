import { Component } from '@angular/core';
import { LoginCadastroComponent } from '../login-cadastro/login-cadastro';
import { UsuariosService } from '../../services/usuarios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [LoginCadastroComponent],
  templateUrl: './esqueci-senha.html',
  styleUrls: ['./esqueci-senha.css']
})
export class EsqueciSenhaComponent {

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  campos = [
    {
      type: 'email',
      model: 'email',
      name: 'email',
      placeholder: 'E-mail',
      required: true,
      validators: ['required', 'email']
    },
    {
      type: 'password',
      model: 'novaSenha',
      name: 'novaSenha',
      placeholder: 'Nova senha',
      required: true,
      validators: ['required']
    }
  ];

  onSubmit(formData: any) {
    const { email, novaSenha } = formData;

    console.log('Tentando atualizar senha para:', email);

    this.usuariosService.usuarioExiste(email).subscribe({
      next: (lista) => {
        if (lista.length === 0) {
          alert('Usuário não encontrado. Verifique o e-mail digitado.');
          return;
        }

        const usuario = lista[0];
        console.log('Usuário encontrado:', usuario);

        this.usuariosService.atualizarSenha(email, novaSenha).subscribe({
          next: (usuarioAtualizado) => {
            alert(`Senha atualizada com sucesso para: ${email}`);
            console.log('Senha atualizada:', usuarioAtualizado);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Erro completo ao atualizar senha:', error);
            console.error('Status:', error.status);
            console.error('Mensagem:', error.message);
            alert('Erro ao atualizar senha. Tente novamente.');
          }
        });
      },
      error: (error) => {
        console.error('Erro ao verificar usuário:', error);
        alert('Erro ao verificar usuário. Tente novamente.');
      }
    });
  }
}
