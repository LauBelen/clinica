import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router'; 
import { PacientesService } from '../../services/pacientes';
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.html',
  styleUrls: ['./pacientes.css']
})
export class PacientesComponent implements OnInit {
  listaPacientes: any[] = [];
  pacientesFiltrados: any[] = [];
  editando: boolean = false;
  pacienteSeleccionado: any = null;

  // --- NUEVAS VARIABLES PARA NOTAS ---
  pacienteParaNotas: any = null;
  nuevaNotaTexto: string = '';
  listaNotas: any[] = [];

  constructor(
    private pacientesService: PacientesService,
    public authService: AuthService,
    private router: Router 
  ) {}

  ngOnInit() {
    this.obtenerPacientes();
  }

  obtenerPacientes() {
    this.pacientesService.getPacientes().subscribe({
      next: (data) => {
        this.listaPacientes = data;
        this.pacientesFiltrados = data;
      },
      error: (err) => console.error('Error al cargar pacientes', err)
    });
  }

  // --- LÓGICA DE NOTAS ---
  seleccionarPacienteParaNotas(paciente: any) {
    // Si hacemos clic en el mismo paciente que ya está abierto, lo cerramos
    if (this.pacienteParaNotas?.dni === paciente.dni) {
      this.pacienteParaNotas = null;
      this.listaNotas = [];
    } else {
      this.pacienteParaNotas = paciente;
      this.obtenerNotas(paciente.dni);
    }
  }

  obtenerNotas(dni: string) {
    this.pacientesService.getNotas(dni).subscribe({
      next: (data) => this.listaNotas = data,
      error: (err) => console.error('Error al cargar notas', err)
    });
  }

  guardarNota() {
    // 1. Validamos que haya texto
    if (!this.nuevaNotaTexto || !this.nuevaNotaTexto.trim()) {
      alert('Escribe algo en la nota');
      return;
    }

    // 2. IMPORTANTE: Pasamos los datos como el Service los espera:
    // Primero el DNI, después el TEXTO. Sin el objeto intermedio.
    this.pacientesService.createNota(
      this.pacienteParaNotas.dni, 
      this.nuevaNotaTexto
    ).subscribe({
      next: () => {
        this.nuevaNotaTexto = ''; // Limpia el textarea
        this.obtenerNotas(this.pacienteParaNotas.dni); // Recarga la lista de notas
        alert('Nota guardada con éxito'); // Agregué esto para que sepas que funcionó
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert('Error al guardar la nota');
      }
    });
  }

  borrarNota(id: number) {
    if (confirm('¿Eliminar esta nota?')) {
      this.pacientesService.deleteNota(id).subscribe({
        next: () => this.obtenerNotas(this.pacienteParaNotas.dni),
        error: (err) => alert('Error al eliminar la nota')
      });
    }
  }
  // -----------------------

  onLogout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authService.logout(); 
      this.router.navigate(['/login']);
    }
  }

  buscarPorDni(event: any) {
    const valor = event.target.value.toLowerCase();
    this.pacientesFiltrados = !valor 
      ? this.listaPacientes 
      : this.listaPacientes.filter(p => p.dni.toString().includes(valor));
  }

  guardar(event: any) {
    event.preventDefault();
    const form = event.target;
    const datos = {
      dni: form.dni.value,
      nombre: form.nombre.value,
      apellido: form.apellido.value,
      fechaNacimiento: form.fechaNacimiento.value,
      telefono: form.telefono.value,
      email: form.email.value
    };

    if (this.editando) {
      this.pacientesService.updatePaciente(datos.dni, datos).subscribe({
        next: () => { alert('¡Paciente actualizado!'); this.finalizarOperacion(form); },
        error: (err) => alert('Error: ' + (err.error.message || 'Error desconocido'))
      });
    } else {
      this.pacientesService.createPaciente(datos).subscribe({
        next: () => { alert('¡Paciente registrado!'); this.finalizarOperacion(form); },
        error: (err) => alert('Error: ' + (err.error.message || 'El DNI ya existe'))
      });
    }
  }

  prepararEdicion(paciente: any) {
    this.editando = true;
    this.pacienteSeleccionado = { ...paciente };
    if (this.pacienteSeleccionado.fecha_nacimiento) {
      this.pacienteSeleccionado.fecha_nacimiento = this.pacienteSeleccionado.fecha_nacimiento.split('T')[0];
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.pacienteSeleccionado = null;
  }

  private finalizarOperacion(form: any) {
    this.obtenerPacientes();
    form.reset();
    this.cancelarEdicion();
  }

  borrar(dni: number) {
    if (confirm('¿Estás seguro de eliminar a este paciente?')) {
      this.pacientesService.deletePaciente(dni).subscribe({
        next: () => { alert('Eliminado correctamente'); this.obtenerPacientes(); },
        error: (err) => alert('Error: ' + err.message)
      });
    }
  }
}