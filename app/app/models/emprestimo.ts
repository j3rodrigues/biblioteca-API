import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@adonisjs/lucid/orm'
import User from './user'
import Livro from './livro'

export default class Emprestimo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare livroId: number

  @column.dateTime()
  declare dateBorrowed: DateTime

  @column.dateTime()
  declare dueDate: DateTime

  @column.dateTime()
  declare returnedAt: DateTime | null

  @column()
  declare active: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Livro, { foreignKey: 'livroId' })
  public livro: BelongsTo<typeof Livro>

  public get isOverdue() {
    if (!this.returnedAt) {
      return DateTime.local() > this.dueDate
    }
    return false
  }
}
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Emprestimo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}