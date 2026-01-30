import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
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
  
  // Variables para controlar la edición
  editando: boolean = false;
  pacienteSeleccionado: any = null;

  constructor(
    private pacientesService: PacientesService,
    public authService: AuthService 
  ) {}

  ngOnInit() {
    this.obtenerPacientes();
  }

  obtenerPacientes() {
  this.pacientesService.getPacientes().subscribe({
    next: (data) => {
      // Forzamos que la lista y el filtro tengan los mismos datos al inicio
      this.listaPacientes = data;
      this.pacientesFiltrados = data;
      console.log('Pacientes cargados:', data);
    },
    error: (err) => {
      console.error('Error 401: La sesión no se envió correctamente', err);
    }
  });
}

  buscarPorDni(event: any) {
    const valor = event.target.value.toLowerCase();
    if (!valor) {
      this.pacientesFiltrados = this.listaPacientes;
    } else {
      this.pacientesFiltrados = this.listaPacientes.filter(p => 
        p.dni.toString().includes(valor)
      );
    }
  }

  // Función principal para el botón del formulario
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
      // Si estamos editando, llamamos a UPDATE (PUT)
      this.pacientesService.updatePaciente(datos.dni, datos).subscribe({
        next: () => {
          alert('¡Paciente actualizado con éxito!');
          this.finalizarOperacion(form);
        },
        error: (err: any) => alert('Error al actualizar: ' + (err.error.message || 'Error desconocido'))
      });
    } else {
      // Si no, llamamos a CREATE (POST)
      this.pacientesService.createPaciente(datos).subscribe({
        next: () => {
          alert('¡Paciente registrado con éxito!');
          this.finalizarOperacion(form);
        },
        error: (err) => alert('Error al crear: ' + (err.error.message || 'El DNI ya existe'))
      });
    }
  }

  // Prepara el formulario con los datos del paciente a editar
  prepararEdicion(paciente: any) {
    this.editando = true;
    // Hacemos una copia para no modificar la tabla directamente mientras escribimos
    this.pacienteSeleccionado = { ...paciente };
    
    // Ajuste de fecha: MySQL devuelve a veces formato ISO largo, necesitamos YYYY-MM-DD para el input
    if (this.pacienteSeleccionado.fecha_nacimiento) {
      this.pacienteSeleccionado.fecha_nacimiento = this.pacienteSeleccionado.fecha_nacimiento.split('T')[0];
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.pacienteSeleccionado = null;
  }

  private finalizarOperacion(form: any) {
    this.obtenerPacientes(); // Refresca la tabla
    form.reset();            // Limpia el formulario
    this.cancelarEdicion();  // Sale del modo edición
  }

  borrar(dni: number) {
    if (confirm('¿Estás seguro de eliminar a este paciente?')) {
      this.pacientesService.deletePaciente(dni).subscribe({
        next: () => {
          alert('Paciente eliminado correctamente');
          this.obtenerPacientes();
        },
        error: (err) => alert('No se pudo eliminar: ' + err.message)
      });
    }
  }
}