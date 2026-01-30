import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Paciente extends BaseModel {
  @column({ isPrimary: true })
  declare dni: number

  @column()
  declare nombre: string

  @column()
  declare apellido: string

  @column.date()
  declare fechaNacimiento: DateTime

  @column()
  declare telefono: string

  @column()
  declare email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
