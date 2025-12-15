import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'livros'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()
      table.string('isbn').notNullable().unique()
      table.text('authors') // stored as JSON string
      table.string('publisher')
      table.integer('year')
      table.integer('edition')
      table.integer('pages')
      table.string('category')
      table.integer('quantity_available').notNullable().defaultTo(1)
      table.string('shelf_location')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}