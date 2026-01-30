import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const PacientesController = () => import('#controllers/pacientes_controller')
const AuthController = () => import('#controllers/auth_controller')

router.post('/login', [AuthController, 'login'])

router.group(() => {
  
  router.get('/pacientes', [PacientesController, 'index'])
  router.post('/pacientes', [PacientesController, 'store'])
  router.put('/pacientes/:dni', [PacientesController, 'update'])
  router.delete('/pacientes/:dni', [PacientesController, 'destroy'])
}).use(middleware.auth({ guards: ['web'] }))