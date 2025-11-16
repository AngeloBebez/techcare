import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Usuario {
  id?: number; // ← Opcional pois será gerado pelo JSON Server
  nome: string;
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'http://localhost:3000/usuarios';
  constructor(private http: HttpClient) {}
  private logado = false;

  setLogado(valor: boolean) {
    this.logado = valor;
  }

  isLogado() {
    return this.logado;
  }

  autenticar(email: string, senha: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      map(usuarios => usuarios.filter(u =>
        u.email === email && u.senha === senha
      ))
    );
  }

  cadastrar(usuario: Usuario): Observable<Usuario> {
    const { id, ...dados } = usuario;

    const usuarioFormatado = {
      ...dados
    };

    console.log('Enviando usuário para API:', usuarioFormatado);
    return this.http.post<Usuario>(this.apiUrl, usuarioFormatado);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  usuarioExiste(email: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      map(usuarios => usuarios.filter(u => u.email === email))
    );
  }

  atualizarSenha(email: string, novaSenha: string): Observable<Usuario> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      map(usuarios => {
        const usuarioEncontrado = usuarios.find(u => u.email === email);
        if (!usuarioEncontrado) {
          throw new Error('Usuário não encontrado');
        }
        return usuarioEncontrado;
      }),
      switchMap(usuario => {
        const usuarioAtualizado = {
          ...usuario,
          senha: novaSenha
        };

        return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuarioAtualizado);
      })
    );
  }

  atualizarSenhaSimples(email: string, novaSenha: string): Observable<Usuario> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      switchMap(usuarios => {
        const usuario = usuarios.find(u => u.email === email);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }

        const dadosAtualizacao = { senha: novaSenha };

        return this.http.patch<Usuario>(`${this.apiUrl}/${usuario.id}`, dadosAtualizacao);
      })
    );
  }
}
