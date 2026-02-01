import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Nota extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pacienteDni: string

  @column()
  declare texto: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}