import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private logado = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const estado = localStorage.getItem('logado');
      this.logado = estado === 'true';
    }
  }

  isLogado() {
    return this.logado;
  }

  setLogado(valor: boolean) {
    this.logado = valor;

    if (this.isBrowser) {
      localStorage.setItem('logado', valor.toString());
    }
  }
}
