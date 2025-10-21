import { Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-cadastro.html',
  styleUrls: ['./login-cadastro.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginCadastroComponent {
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() campos: {
    type: string;
    model: string;
    name: string;
    placeholder: string;
    required?: boolean;
  }[] = [];
  @Input() textoBotao: string = '';
  @Input() linkTexto: string = '';
  @Input() linkRota: string = '';
  @Input() linkDescricao: string = '';
  @Input() mostrarEsqueciSenha: boolean = false;

  @Input() onSubmitFn!: (formData: any) => void;
  @Output() formSubmit = new EventEmitter<any>();

  data: any = {};

  // Inicializa o objeto data quando o componente é criado
  ngOnInit() {
    this.campos.forEach(campo => {
      this.data[campo.model] = '';
    });
  }

  // Função chamada durante a digitação (validação em tempo real)
  onInputChange() {
    console.log('Dados atuais:', this.data);
  }

  onSubmit(form: NgForm) {
    console.log('=== FORM SUBMIT ===');
    console.log('Formulário válido:', form.valid);
    console.log('Dados:', this.data);
    console.log('onSubmitFn existe?:', !!this.onSubmitFn);

    // Força a validação de todos os campos
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });

    if (form.valid) {
      if (this.onSubmitFn) {
        console.log('Chamando onSubmitFn...');
        this.onSubmitFn(this.data);
      } else {
        this.formSubmit.emit(this.data);
      }
    } else {
      console.log('Formulário inválido - campos com erro:');
      Object.keys(form.controls).forEach(key => {
        const control = form.controls[key];
        if (control.invalid) {
          console.log(`- ${key}:`, control.errors);
        }
      });
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
    }
  }
}
