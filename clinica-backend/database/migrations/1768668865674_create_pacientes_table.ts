import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pacientes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('dni').primary()
      table.string('nombre', 50).notNullable()
      table.string('apellido', 50).notNullable()
      table.date('fecha_nacimiento').notNullable()
      table.string('telefono', 20)
      table.string('email', 100)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
