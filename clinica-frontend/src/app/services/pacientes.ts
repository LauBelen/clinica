import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PacientesService {
  // URL base apuntando a tu backend de AdonisJS
  private apiUrl = 'http://localhost:3333/pacientes';

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los pacientes
   */
  getPacientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
  }

  /**
   * Crear un nuevo paciente (POST)
   */
  createPaciente(paciente: any): Observable<any> {
    return this.http.post(this.apiUrl, paciente, { withCredentials: true });
  }

  /**
   * Actualizar un paciente existente (PUT)
   * Se envía el DNI en la URL como identificador único
   */
  updatePaciente(dni: string | number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${dni}`, datos, { withCredentials: true });
  }

  /**
   * Eliminar un paciente (DELETE)
   */
  deletePaciente(dni: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${dni}`, { withCredentials: true });
  } 

  // --- MÉTODOS PARA NOTAS MÉDICAS ---

  getNotas(dni: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${dni}/notas`, { withCredentials: true });
  }

  // Modificamos este para que sea más claro y no falle
  createNota(pacienteDni: string, contenido: string): Observable<any> {
    const data = {
      paciente_dni: pacienteDni,
      texto: contenido
    };
    return this.http.post(`${this.apiUrl}/notas`, data, { withCredentials: true });
  }

  deleteNota(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notas/${id}`, { withCredentials: true });
  }
}