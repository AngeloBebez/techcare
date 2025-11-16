import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DispositivoService } from '../../services/dispositivos';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dispositivos-forms',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dispositivos-forms.html',
  styleUrls: ['./dispositivos-forms.css'],
})
export class DispositivosFormsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  @Input() dispositivoParaEditar: any = null;

  form!: FormGroup;
  usuarioLogadoId: string | number | null = null;

  constructor(
    private fb: FormBuilder,
    private dispositivosService: DispositivoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarUsuarioLogado();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    const dataAtual = new Date().toISOString().split('T')[0];
    const formConfig: any = {
      nomeDispositivo: ['', Validators.required],
      categoria: [null, Validators.required],
      dataAquisicao: [dataAtual, Validators.required],
      observacoes: ['Sem observações', Validators.required],
      lembrete: ['Verificar periodicamente', Validators.required],
    };

    if (!this.dispositivoParaEditar) {
      formConfig.dataManutencao = [dataAtual, Validators.required];
      formConfig.descricaoManutencao = ['Manutenção inicial', Validators.required];
    }

    this.form = this.fb.group(formConfig);

    if (this.dispositivoParaEditar) {
      setTimeout(() => {
        console.log('Editando dispositivo:', this.dispositivoParaEditar);

        this.form.patchValue({
          nomeDispositivo: this.dispositivoParaEditar.nomeDispositivo,
          categoria: this.dispositivoParaEditar.categoria,
          dataAquisicao: this.dispositivoParaEditar.dataAquisicao,
          observacoes: this.dispositivoParaEditar.observacoes,
          lembrete: this.dispositivoParaEditar.lembrete,
        });
      }, 100);
    }
  }

  carregarUsuarioLogado() {
    const usuarioStorage = localStorage.getItem('usuarioLogado');
    if (usuarioStorage) {
      const usuario = JSON.parse(usuarioStorage);
      this.usuarioLogadoId = usuario.id;
      console.log('🔐 ID do usuário no forms:', this.usuarioLogadoId, typeof this.usuarioLogadoId);
    }
  }

  categorias = [
    { id: 1, nome: 'Notebook', icon: '💻' },
    { id: 2, nome: 'Celular', icon: '📱' },
    { id: 3, nome: 'Desktop', icon: '🖥️' },
    { id: 4, nome: 'TV', icon: '📺' },
    { id: 5, nome: 'Console', icon: '🎮' },
    { id: 6, nome: 'Outros', icon: '♾' },
  ];

  selecionarCategoria(id: number) {
    this.form.patchValue({ categoria: id });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });

      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.usuarioLogadoId) {
      alert('Erro: Usuário não identificado.');
      return;
    }

    let manutencoes;

    if (this.dispositivoParaEditar && this.dispositivoParaEditar.manutencoes) {
      manutencoes = this.dispositivoParaEditar.manutencoes;
    } else {
      manutencoes = [{
        data: this.form.value.dataManutencao,
        descricao: this.form.value.descricaoManutencao
      }];
    }

    const formData = {
      ...this.form.value,
      categoria: Number(this.form.value.categoria),
      usuarioId: this.usuarioLogadoId,
      manutencoes: manutencoes
    };

    delete formData.dataManutencao;
    delete formData.descricaoManutencao;

    console.log('📤 DADOS PARA SALVAR:', formData);

    if (this.dispositivoParaEditar && this.dispositivoParaEditar.id) {
      console.log('Atualizando dispositivo ID:', this.dispositivoParaEditar.id);

      formData.usuarioId = this.dispositivoParaEditar.usuarioId;

      this.dispositivosService.atualizar(this.dispositivoParaEditar.id, formData).subscribe({
        next: () => {
          alert('Dispositivo atualizado com sucesso!');
          this.saved.emit();
          this.close.emit();
        },
        error: (error) => {
          console.error('Erro ao atualizar:', error);
          alert('Erro ao atualizar dispositivo.');
        },
      });
      return;
    }

    console.log('Criando novo dispositivo');
    this.dispositivosService.adicionar(formData).subscribe({
      next: () => {
        alert('Dispositivo cadastrado com sucesso!');
        this.saved.emit();
        this.close.emit();
      },
      error: (error) => {
        console.error('Erro ao criar:', error);
        alert('Erro ao cadastrar dispositivo.');
      },
    });
  }

  cancelar() {
    this.close.emit();
  }

  get isEditando(): boolean {
    return !!this.dispositivoParaEditar;
  }
}
