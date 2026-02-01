import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const PacientesController = () => import('#controllers/pacientes_controller')

// 1. Ruta de Login (Siempre fuera de grupos para evitar conflictos)
router.post('login', [AuthController, 'login'])

// 2. Grupo de Pacientes y Notas
router.group(() => {
  // Rutas de Pacientes
  router.get('pacientes', [PacientesController, 'index'])
  router.post('pacientes', [PacientesController, 'store'])
  router.put('pacientes/:dni', [PacientesController, 'update'])
  router.delete('pacientes/:dni', [PacientesController, 'destroy'])

  // Rutas de Notas (Aseguramos nombres únicos)
  router.get('pacientes/:dni/notas', [PacientesController, 'getNotas'])
  router.post('pacientes/notas', [PacientesController, 'storeNota'])
  router.delete('pacientes/notas/:id', [PacientesController, 'destroyNota'])
})