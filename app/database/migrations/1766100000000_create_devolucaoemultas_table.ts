import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DevolucaoEmultas extends BaseSchema {
  protected tableName = 'devolucao_emultas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('emprestimo_id').unsigned().notNullable().references('id').inTable('emprestimos').onDelete('CASCADE')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')

      table.integer('days_late').notNullable().defaultTo(0)
      table.decimal('daily_rate', 8, 2).notNullable().defaultTo(0)
      table.decimal('amount', 10, 2).notNullable().defaultTo(0)

      table.boolean('paid').notNullable().defaultTo(false)
      table.timestamp('paid_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
