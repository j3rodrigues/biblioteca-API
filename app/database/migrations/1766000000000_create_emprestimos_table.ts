import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Emprestimos extends BaseSchema {
  protected tableName = 'emprestimos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('livro_id').unsigned().notNullable().references('id').inTable('livros').onDelete('CASCADE')

      table.timestamp('date_borrowed').notNullable()
      table.timestamp('due_date').notNullable()
      table.timestamp('returned_at').nullable()

      table.boolean('active').notNullable().defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
