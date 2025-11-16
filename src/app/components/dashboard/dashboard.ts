import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DispositivoService } from '../../services/dispositivos';
import { DispositivosFormsComponent } from '../dispositivos-forms/dispositivos-forms';
import { DetalhesDispositivosComponent } from '../detalhes-dispositivos/detalhes-dispositivos';
import { AuthService } from '../../services/auth-service';

interface Manutencao {
  data: string;
  descricao: string;
}

interface DispositivoDashboard {
  id: number | string;
  nome: string;
  categoria: number | string;
  categoriaId?: number;
  ultimaManutencao: string;
  dataAquisicao: string;
  lembrete: string;
  observacoes?: string;
  estado: string;
  icone: string;
  usuarioId: number | string;
  manutencoes?: Manutencao[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DispositivosFormsComponent,
    DetalhesDispositivosComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  modalAberto = false;
  modalDetalhesAberto = false;
  deletingId: number | string | null = null;
  dispositivos: DispositivoDashboard[] = [];
  dispositivoSelecionado: any = null;
  dispositivoDetalhes: any = null;
  usuarioLogadoId: string | number | null = null;

  constructor(
    private router: Router,
    private dispositivoService: DispositivoService,
    public auth: AuthService
  ) {}

  categorias = [
    { id: 1, nome: 'Notebook', icon: '💻' },
    { id: 2, nome: 'Celular', icon: '📱' },
    { id: 3, nome: 'Desktop', icon: '🖥️' },
    { id: 4, nome: 'TV', icon: '📺' },
    { id: 5, nome: 'Console', icon: '🎮' },
    { id: 6, nome: 'Outros', icon: '♾' },
  ];

  getIconeCategoria(id: number | null | undefined): string {
    const categoria = this.categorias.find((c) => c.id === id);
    return categoria ? categoria.icon : '❓';
  }

  ngOnInit() {
    if (!this.auth.isLogado()) {
      this.router.navigate(['/login']);
      return;
    }
    this.carregarUsuarioLogado();
    this.carregarDispositivos();
  }

  carregarUsuarioLogado() {
    const usuarioStorage = localStorage.getItem('usuarioLogado');
    if (usuarioStorage) {
      const usuario = JSON.parse(usuarioStorage);
      this.usuarioLogadoId = usuario.id;
      console.log('🔐 ID do usuário logado:', this.usuarioLogadoId, typeof this.usuarioLogadoId);
    } else {
      console.error('❌ Usuário não encontrado no localStorage');
    }
  }

  carregarDispositivos() {
    if (!this.usuarioLogadoId) {
      console.error('❌ Usuário não logado ou ID inválido:', this.usuarioLogadoId);
      return;
    }

    console.log('🔄 Carregando dispositivos para o usuário:', this.usuarioLogadoId);

    this.dispositivoService.listar(this.usuarioLogadoId).subscribe({
      next: (apiData) => {
        console.log('✅ Dispositivos carregados da API:', apiData);

        this.dispositivos = apiData.map((item) => {
          const ultimaManutencaoData = this.obterUltimaManutencaoData(item);

          return {
            id: item.id!,
            nome: item.nomeDispositivo,
            categoria: this.converterCategoria(item.categoria ?? ''),
            categoriaId: item.categoria,
            ultimaManutencao: this.formatarDataBR(ultimaManutencaoData),
            dataAquisicao: this.formatarDataBR(item.dataAquisicao || ''),
            lembrete: item.lembrete ?? 'Sem lembrete',
            observacoes: item.observacoes,
            estado: this.calcularEstado(ultimaManutencaoData),
            icone: this.getIconeCategoria(item.categoria),
            usuarioId: item.usuarioId,
            manutencoes: item.manutencoes || [],
          };
        });

        console.log('📊 Dispositivos processados:', this.dispositivos);
      },
      error: (error) => {
        console.error('❌ ERRO AO CARREGAR DISPOSITIVOS:', error);
      }
    });
  }

  private obterUltimaManutencaoData(item: any): string {
    if (item.manutencoes && Array.isArray(item.manutencoes) && item.manutencoes.length > 0) {
      const manutencoesOrdenadas = [...item.manutencoes].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      return manutencoesOrdenadas[0].data;
    }
    return '';
  }

  converterCategoria(id: number) {
    const categorias: any = {
      1: 'Notebook',
      2: 'Celular',
      3: 'Desktop',
      4: 'TV',
      5: 'Console',
      6: 'Outros',
    };
    return categorias[id] || 'Outros';
  }

  formatarDataBR(data: string | null | undefined): string {
    if (!data) return 'Não informada';
    try {
      const [ano, mes, dia] = data.split('-').map(Number);
      const d = new Date(ano, mes - 1, dia);
      if (isNaN(d.getTime())) return 'Data inválida';
      return d.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  }

  calcularEstado(data: string) {
    if (!data) return 'Precisa de manutenção';
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const [ano, mes, dia] = data.split('-').map(Number);
      const manut = new Date(ano, mes - 1, dia);
      manut.setHours(0, 0, 0, 0);

      const diff = hoje.getTime() - manut.getTime();
      const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

      return dias < 30 ? 'Em dia' : 'Precisa de manutenção';
    } catch (error) {
      return 'Precisa de manutenção';
    }
  }

  logout() {
    this.auth.setLogado(false);
    localStorage.removeItem('usuarioLogado');
    this.router.navigate(['/login']);
  }

  editarDispositivo(dispositivo: any) {
    this.dispositivoSelecionado = dispositivo;
    this.modalAberto = true;
  }

  deletarDispositivo(id?: number | string) {
    if (id == null) {
      alert('ID do dispositivo inválido.');
      return;
    }

    if (!confirm('Deseja excluir este dispositivo?')) return;

    this.deletingId = id;

    this.dispositivoService.excluir(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.carregarDispositivos();
      },
      error: () => {
        this.deletingId = null;
        alert('Erro ao excluir dispositivo.');
      },
    });
  }

  visualizarDispositivo(dispositivo: any) {
    this.dispositivoService.obterPorId(dispositivo.id).subscribe({
      next: (dispositivoCompleto) => {
        this.dispositivoDetalhes = dispositivoCompleto;
        this.modalDetalhesAberto = true;
      },
      error: () => {
        this.dispositivoDetalhes = dispositivo;
        this.modalDetalhesAberto = true;
      },
    });
  }

  onDispositivoAtualizado(dispositivoAtualizado: any) {
    console.log('🔄 DISPOSITIVO ATUALIZADO RECEBIDO:', dispositivoAtualizado);

    const index = this.dispositivos.findIndex((d) => d.id === dispositivoAtualizado.id);

    if (index !== -1) {
      this.dispositivos[index] = {
        ...this.dispositivos[index],
        nome: dispositivoAtualizado.nomeDispositivo,
        categoria: this.converterCategoria(dispositivoAtualizado.categoria),
        ultimaManutencao: this.formatarDataBR(
          this.obterUltimaManutencaoData(dispositivoAtualizado)
        ),
        estado: this.calcularEstado(
          this.obterUltimaManutencaoData(dispositivoAtualizado)
        ),
        manutencoes: dispositivoAtualizado.manutencoes
      };
    }

    if (this.dispositivoSelecionado?.id === dispositivoAtualizado.id) {
      this.dispositivoSelecionado = { ...this.dispositivos[index] };
    }

    if (this.dispositivoDetalhes?.id === dispositivoAtualizado.id) {
      this.dispositivoDetalhes = dispositivoAtualizado;
    }

    this.carregarDispositivos();
  }

  adicionarDispositivo() {
    this.dispositivoSelecionado = null;
    this.modalAberto = true;
  }

  aoSalvar() {
    this.modalAberto = false;
    this.dispositivoSelecionado = null;
    this.carregarDispositivos();
  }

  fecharDetalhes() {
    this.modalDetalhesAberto = false;
    this.dispositivoDetalhes = null;
  }
}
