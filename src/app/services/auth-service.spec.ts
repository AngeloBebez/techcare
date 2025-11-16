import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logado = false;

  setLogado(valor: boolean) {
    this.logado = valor;
  }

  isLogado() {
    return this.logado;
  }
}
