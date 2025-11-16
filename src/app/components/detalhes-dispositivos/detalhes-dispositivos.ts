import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DispositivoService } from '../../services/dispositivos';

interface Manutencao {
  data: string;
  descricao: string;
}

@Component({
  selector: 'app-detalhes-dispositivos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalhes-dispositivos.html',
  styleUrls: ['./detalhes-dispositivos.css'],
})
export class DetalhesDispositivosComponent implements OnChanges {
  @Input() dispositivo: any;
  @Output() close = new EventEmitter<void>();
  @Output() dispositivoAtualizado = new EventEmitter<any>();

  manutencoes: Manutencao[] = [];

  constructor(private dispositivoService: DispositivoService) {}

  categorias = [
    { id: 1, nome: 'Notebook', icon: '💻' },
    { id: 2, nome: 'Celular', icon: '📱' },
    { id: 3, nome: 'Desktop', icon: '🖥️' },
    { id: 4, nome: 'TV', icon: '📺' },
    { id: 5, nome: 'Console', icon: '🎮' },
    { id: 6, nome: 'Outros', icon: '♾' },
  ];

  adicionandoManutencao = false;
  editandoManutencaoIndex: number | null = null;
  salvando = false;

  novaManutencao: Manutencao = {
    data: new Date().toISOString().split('T')[0],
    descricao: '',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dispositivo'] && this.dispositivo) {
      if (!Array.isArray(this.dispositivo.manutencoes)) {
        this.dispositivo.manutencoes = [];
      }
      this.manutencoes = [...this.dispositivo.manutencoes].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );

      this.cancelarManutencao();
    }
  }

  getIconeCategoria(id: number | null | undefined): string {
    const categoria = this.categorias.find((c) => c.id === id);
    return categoria ? categoria.icon : '📱';
  }

  getNomeCategoria(id: number | null | undefined): string {
    const categoria = this.categorias.find((c) => c.id === id);
    return categoria ? categoria.nome : 'Outros';
  }

  getHistoricoManutencoes(): Manutencao[] {
    if (this.dispositivo?.manutencoes && Array.isArray(this.dispositivo.manutencoes)) {
      return [...this.dispositivo.manutencoes].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );
    }
    return [];
  }

  formatarDataBR(data: string | null | undefined): string {
    if (!data) return 'Não informada';
    try {
      const [ano, mes, dia] = data.split('-').map(Number);
      const d = new Date(ano, mes - 1, dia);
      if (isNaN(d.getTime())) return 'Data inválida';
      return d.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  }

  formatarDataAquisicao(): string {
    return this.formatarDataBR(this.dispositivo?.dataAquisicao);
  }

  iniciarAdicaoManutencao() {
    this.novaManutencao = {
      data: new Date().toISOString().split('T')[0],
      descricao: '',
    };
    this.adicionandoManutencao = true;
    this.editandoManutencaoIndex = null;
  }

  iniciarEdicaoManutencao(index: number) {
    const manutencao = this.dispositivo.manutencoes[index];
    if (!manutencao) return;

    this.editandoManutencaoIndex = index;
    this.novaManutencao = { ...manutencao };
    this.adicionandoManutencao = true;
  }

  cancelarManutencao() {
    this.adicionandoManutencao = false;
    this.editandoManutencaoIndex = null;
    this.novaManutencao = {
      data: new Date().toISOString().split('T')[0],
      descricao: '',
    };
  }

  salvarManutencao() {
    if (!this.novaManutencao.data || !this.novaManutencao.descricao.trim()) {
      alert('Preencha a data e descrição da manutenção!');
      return;
    }

    if (this.editandoManutencaoIndex !== null) {
      this.manutencoes[this.editandoManutencaoIndex] = { ...this.novaManutencao };
    } else {
      this.manutencoes.push({ ...this.novaManutencao });
    }

    this.manutencoes.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    this.dispositivo.manutencoes = [...this.manutencoes];

    this.salvarDispositivoNoServidor(this.dispositivo);
    this.cancelarManutencao();
  }

  excluirManutencao(index: number) {
    if (!confirm('Deseja excluir esta manutenção?')) return;

    this.manutencoes.splice(index, 1);

    this.dispositivo.manutencoes = [...this.manutencoes];

    this.salvarDispositivoNoServidor(this.dispositivo);
  }

  private salvarDispositivoNoServidor(dispositivoAtualizado: any) {
    if (!dispositivoAtualizado?.id) {
      console.error('❌ ID DO DISPOSITIVO NÃO ENCONTRADO');
      this.salvando = false;
      return;
    }

    const dispositivoParaSalvar = {
      id: dispositivoAtualizado.id,
      nomeDispositivo: dispositivoAtualizado.nomeDispositivo ?? this.dispositivo?.nomeDispositivo,
      categoria: Number(dispositivoAtualizado.categoria ?? this.dispositivo?.categoria ?? 0),
      dataAquisicao: dispositivoAtualizado.dataAquisicao ?? this.dispositivo?.dataAquisicao,
      observacoes: dispositivoAtualizado.observacoes ?? this.dispositivo?.observacoes,
      lembrete: dispositivoAtualizado.lembrete ?? this.dispositivo?.lembrete,
      usuarioId: Number(dispositivoAtualizado.usuarioId ?? this.dispositivo?.usuarioId ?? 0),
      manutencoes: Array.isArray(dispositivoAtualizado.manutencoes)
        ? dispositivoAtualizado.manutencoes
        : [],
    };

    console.log('📤 DADOS PARA SALVAR:', JSON.stringify(dispositivoParaSalvar, null, 2));

    this.dispositivoService.atualizar(dispositivoAtualizado.id, dispositivoParaSalvar).subscribe({
      next: (dispositivoSalvo) => {
        console.log('✅ DISPOSITIVO SALVO COM SUCESSO!');
        console.log('📥 RESPOSTA DO SERVIDOR:', dispositivoSalvo);
        this.dispositivo = dispositivoSalvo;
        this.dispositivoAtualizado.emit(dispositivoSalvo);

        this.salvando = false;
        this.cancelarManutencao();

        alert('✅ Alterações salvas com sucesso!');
      },
      error: (error) => {
        console.error('❌ ERRO AO SALVAR DISPOSITIVO:', error);
        this.salvando = false;
        alert('❌ Erro ao salvar alterações. Verifique o console para mais detalhes.');
      },
    });
  }

  private atualizarEstadoDispositivo(dispositivo: any) {
    const manutencoes =
      dispositivo.manutencoes && Array.isArray(dispositivo.manutencoes)
        ? [...dispositivo.manutencoes].sort(
            (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
          )
        : [];

    const ultimaManutencaoData = manutencoes[0]?.data;

    if (ultimaManutencaoData) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const manut = new Date(ultimaManutencaoData + 'T00:00:00');
      manut.setHours(0, 0, 0, 0);

      const diff = hoje.getTime() - manut.getTime();
      const dias = diff / (1000 * 60 * 60 * 24);

      dispositivo.estado = dias < 30 ? 'Em dia' : 'Precisa de manutenção';
    } else {
      dispositivo.estado = 'Precisa de manutenção';
    }

    console.log('🔄 ESTADO ATUALIZADO:', dispositivo.estado);
  }

  fechar() {
    this.close.emit();
  }
}
