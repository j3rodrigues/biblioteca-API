import { DateTime } from '@adonisjs/lucid'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Livro extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare isbn: string

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => {
      try {
        return value ? JSON.parse(value) : []
      } catch {
        return []
      }
    },
  })
  declare authors: string[]

  @column()
  declare publisher: string | null

  @column()
  declare year: number | null

  @column()
  declare edition: number | null

  @column()
  declare pages: number | null

  @column()
  declare category: string | null

  @column({ columnName: 'quantity_available' })
  declare quantityAvailable: number

  @column({ columnName: 'shelf_location' })
  declare shelfLocation: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}