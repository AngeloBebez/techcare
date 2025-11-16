import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barra-navegacao',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './barra-navegacao.html',
  styleUrls: ['./barra-navegacao.css'],
})
export class BarraNavegacao {
  mostrarBotaoSair = false;

  constructor(public auth: AuthService, private router: Router) {
    this.router.events.subscribe(() => {
      const rotasSemBotao = ['/login', '/cadastro'];
      this.mostrarBotaoSair = this.auth.isLogado() && !rotasSemBotao.includes(this.router.url);
    });
  }

  logout() {
    this.auth.setLogado(false);
    this.router.navigate(['/login']);
  }
}
