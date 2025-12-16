import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@adonisjs/lucid/orm'
import User from './user'
import Emprestimo from './emprestimo'

export default class Devolucaoemulta extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare emprestimoId: number

  @column()
  declare userId: number

  @column()
  declare daysLate: number

  @column()
  declare dailyRate: number

  @column()
  declare amount: number

  @column()
  declare paid: boolean

  @column.dateTime()
  declare paidAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Emprestimo, { foreignKey: 'emprestimoId' })
  public emprestimo: BelongsTo<typeof Emprestimo>
}