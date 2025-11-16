import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login-cadastro',
  templateUrl: './login-cadastro.html',
  styleUrls: ['./login-cadastro.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginCadastroComponent implements OnInit {

  @Input() titulo!: string;
  @Input() subtitulo!: string;
  @Input() campos!: any[];
  @Input() textoBotao!: string;
  @Input() linkDescricao!: string;
  @Input() linkTexto!: string;
  @Input() linkRota!: string;
  @Input() mostrarEsqueciSenha: boolean = false;

  @Output() submitEvent = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const formConfig: any = {};

    this.campos.forEach(campo => {
      const validators: ValidatorFn[] = [];

      if (campo.required) validators.push(Validators.required);
      if (campo.type === 'email') validators.push(Validators.email);
      if (campo.minLength) validators.push(Validators.minLength(campo.minLength));

      formConfig[campo.model] = ['', validators];
    });

    this.form = this.fb.group(formConfig);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitEvent.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
