import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Manutencao {
  data: string;
  descricao: string;
}

export interface Dispositivo {
  id?: number | string;
  nomeDispositivo: string;
  categoria: number;
  dataAquisicao?: string;
  manutencoes?: Manutencao[];
  observacoes?: string;
  lembrete?: string;
  usuarioId: number | string;
}

@Injectable({ providedIn: 'root' })
export class DispositivoService {
  public apiUrl = 'http://localhost:3000/dispositivos';

  constructor(private http: HttpClient) {}

  listar(usuarioId: number | string): Observable<Dispositivo[]> {
    return this.http.get<Dispositivo[]>(this.apiUrl).pipe(
      map((dispositivos) =>
        dispositivos.filter((d) => {
          if (!d.usuarioId || !usuarioId) {
            return false;
          }
          return d.usuarioId.toString() === usuarioId.toString();
        })
      )
    );
  }

  adicionar(dispositivo: Dispositivo): Observable<Dispositivo> {
    const { id, ...dados } = dispositivo;

    const dispositivoFormatado = {
      ...dados,
      categoria: Number(dispositivo.categoria),
      usuarioId: dispositivo.usuarioId,
      manutencoes: dispositivo.manutencoes ?? [],
    };

    console.log('🟢 ENVIANDO NOVO DISPOSITIVO:', dispositivoFormatado);
    return this.http.post<Dispositivo>(this.apiUrl, dispositivoFormatado);
  }

  atualizar(id: number | string, dispositivo: Dispositivo): Observable<Dispositivo> {
    console.log('🟢 ATUALIZANDO DISPOSITIVO ID:', id);

    const { id: _removerId, ...dadosSemId } = dispositivo;

    const dispositivoFormatado = {
      ...dadosSemId,
      categoria: Number(dadosSemId.categoria),
      usuarioId: dadosSemId.usuarioId,
      manutencoes: Array.isArray(dadosSemId.manutencoes) ? dadosSemId.manutencoes : [],
    };

    console.log('🟢 DADOS ENVIADOS PARA O PUT:', dispositivoFormatado);

    return this.http.put<Dispositivo>(`${this.apiUrl}/${id}`, dispositivoFormatado);
  }

  excluir(id: number | string): Observable<void> {
    console.log(`🗑️ EXCLUINDO DISPOSITIVO ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obterPorId(id: number | string): Observable<Dispositivo> {
    console.log('🔍 BUSCANDO DISPOSITIVO ID:', id);
    return this.http.get<Dispositivo>(`${this.apiUrl}/${id}`);
  }
}
