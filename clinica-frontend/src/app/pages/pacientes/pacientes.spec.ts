import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PacientesComponent } from './pacientes';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Necesario para que no falle el servicio
import { FormsModule } from '@angular/forms';

describe('PacientesComponent', () => {
  let component: PacientesComponent;
  let fixture: ComponentFixture<PacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como es Standalone, va en imports. Agregué los módulos de HTTP y Form para que no tire error.
      imports: [PacientesComponent, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});