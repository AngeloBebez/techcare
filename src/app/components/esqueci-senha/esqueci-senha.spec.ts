import { ComponentFixture, TestBed } from '@angular/core/testing';

import { esqueciSenhaComponent } from './esqueci-senha';

describe('EsqueciSenha', () => {
  let component: esqueciSenhaComponent;
  let fixture: ComponentFixture<esqueciSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [esqueciSenhaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(esqueciSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
