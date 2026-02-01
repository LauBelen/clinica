import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login'; 
// Quitamos el .ts y nos aseguramos que el nombre sea el que exportaste
import { PacientesComponent } from './pages/pacientes/pacientes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'pacientes', component: PacientesComponent } 
  // Borramos la segunda declaración que usaba 'loadComponent' porque ya lo importaste arriba
];