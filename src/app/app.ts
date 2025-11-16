import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraNavegacao } from './components/barra-navegacao/barra-navegacao';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BarraNavegacao],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('techcare');
}
