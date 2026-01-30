import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.error = ''; // Limpiamos errores previos
    
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        console.log('Login exitoso:', res);
        this.authService.saveUser(res.user);
        this.router.navigate(['/pacientes']); // Te lleva a la lista de pacientes
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}