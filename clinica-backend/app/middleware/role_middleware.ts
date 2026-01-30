import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(
    { request, response }: HttpContext,
    next: NextFn,
    roles: string[]
  ) {
    const role = request.header('x-role')

    if (!role || !roles.includes(role)) {
      return response.unauthorized({ message: 'No autorizado' })
    }

    await next()
  }
}
