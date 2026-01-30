import { Routes } from '@angular/router'

import { LoginComponent } from './pages/login/login' 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'pacientes', 
    
    loadComponent: () => import('./pages/pacientes/pacientes').then(m => m.PacientesComponent) 
  }
]