import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Esto limpia el usuario si ya existía para no duplicar
    await User.query().where('username', 'admin').delete()

    // Creamos el admin con la contraseña encriptada
    await User.create({
      username: 'admin',
      password: await hash.make('admin123'),
      role: 'admin'
    })
    
    console.log('¡Usuario admin creado con éxito!')
  }
}