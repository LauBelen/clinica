import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async login({ request, auth, response }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])
    const user = await User.findBy('username', username)

    if (!user || user.password !== password) {
      return response.unauthorized({ message: 'Credenciales inválidas' })
    }

    // Fuerza el inicio de sesión en el guard web
    await auth.use('web').login(user)
    
    // Devolvemos la respuesta explícita para que el navegador capte la cookie
    return response.ok({ message: 'Login exitoso', user })
  }
}