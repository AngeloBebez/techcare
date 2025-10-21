import { Injectable } from '@angular/core';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private usuarios: Usuario[] = [
    { id: 1, nome: 'Miguel', email: 'miguel@miguel.com', senha: '1234' },
    { id: 2, nome: 'Ana', email: 'ana@ana.com', senha: 'abcd' }
  ];

  autenticar(email: string, senha: string): Usuario | undefined {
    if (!email || !senha) return undefined;

    const emailFormatado = email.trim().toLowerCase();
    const senhaFormatada = senha.trim();

    return this.usuarios.find(
      u => u.email.toLowerCase() === emailFormatado && u.senha === senhaFormatada
    );
  }

  cadastrar(usuario: Omit<Usuario, 'id'>): Usuario {
    const novoUsuario: Usuario = {
      ...usuario,
      id: this.usuarios.length + 1
    };
    this.usuarios.push(novoUsuario);
    return novoUsuario;
  }

  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  usuarioExiste(email: string): boolean {
    return this.usuarios.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }
}
