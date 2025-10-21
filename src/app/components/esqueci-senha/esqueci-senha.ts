import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginCadastroComponent } from '../login-cadastro/login-cadastro';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [FormsModule, LoginCadastroComponent],
  templateUrl: './esqueci-senha.html',
  styleUrl: './esqueci-senha.css'
})
export class esqueciSenhaComponent {
  onSubmit(formData: any) {
    const { email } = formData;
    console.log('E-mail para recuperação:', email);
    alert(`Instruções de recuperação enviadas para: ${email}`);
  }

  campos = [
    {
      type: 'email',
      model: 'email',
      name: 'email',
      placeholder: 'E-mail',
      required: true
    },
  ];
}
