import { defineConfig, stores } from '@adonisjs/session'

/**
 * Configuración de sesión optimizada para desarrollo local.
 */
const sessionConfig = defineConfig({
  enabled: true,
  cookieName: 'adonis-session',
  clearWithBrowser: false,
  age: '2h',
  cookie: {
    path: '/',
    httpOnly: true,
    // Debe ser false en localhost (sin HTTPS) para que el navegador acepte la cookie
    secure: false, 
    // 'lax' permite que la cookie se envíe desde el puerto 4200 al 3333
    sameSite: 'lax', 
  },
  // Usamos 'cookie' como store para evitar líos de permisos en carpetas del sistema
  store: 'cookie',
  stores: {
    cookie: stores.cookie(),
  }
})

export default sessionConfig