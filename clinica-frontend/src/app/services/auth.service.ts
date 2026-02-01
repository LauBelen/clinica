import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; // <--- IMPORTANTE

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3333';

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectamos el ID de la plataforma
  ) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      username,
      password,
    }, { withCredentials: true });
  }

  saveUser(user: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser() {
    // Solo intentamos leer si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null; // Si es el servidor, devolvemos null
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  logout() {
  localStorage.removeItem('user'); // O como sea que guardes el token/usuario
  this.router.navigate(['/login']);
}
}