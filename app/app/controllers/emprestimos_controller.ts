import type { HttpContext } from '@adonisjs/core/http'
import Emprestimo from 'App/Models/Emprestimo'
import User from 'App/Models/User'
import Livro from 'App/Models/Livro'
import { validateCreate } from 'App/Validators/emprestimo'
import Env from '@ioc:Adonis/Core/Env'
import { DateTime } from 'luxon'

const DEFAULT_LOAN_DAYS = Number(Env.get('LOAN_DAYS', '14'))

export default class EmprestimosController {
  async index({ request, response }: HttpContext) {
    const { user_id, active, page = 1, limit = 20 } = request.qs() as any

    let query = Emprestimo.query().preload('user').preload('livro')
    if (user_id) query.where('user_id', user_id)
    if (active !== undefined) query.where('active', active === 'true' || active === true)

    const results = await query.paginate(Number(page) || 1, Number(limit) || 20)
    return response.ok(results)
  }

  async store({ request, response }: HttpContext) {
    const payload = request.only(['user_id', 'livro_id'])
    const validation = validateCreate(payload)
    if (!validation.valid) return response.status(422).json({ errors: validation.errors })

    const user = await User.find(payload.user_id)
    if (!user) return response.status(404).json({ message: 'Usuário não encontrado' })

    const livro = await Livro.find(payload.livro_id)
    if (!livro) return response.status(404).json({ message: 'Livro não encontrado' })

    // Check availability
    if ((livro.quantityAvailable ?? 0) <= 0) return response.status(409).json({ message: 'Nenhum exemplar disponível' })

    // Check user pending overdue loans
    const overdue = await Emprestimo.query()
      .where('user_id', user.id)
      .andWhere('returned_at', null)
      .andWhere('due_date', '<', DateTime.local().toSQL())
      .count('* as total')

    if (Number((overdue[0] as any).total) > 0) return response.status(403).json({ message: 'Usuário possui empréstimos atrasados' })

    // Check user's active loans count (limit 3)
    const activeCountRes = await Emprestimo.query().where('user_id', user.id).andWhere('returned_at', null).count('* as total')
    const activeCount = Number((activeCountRes[0] as any).total)
    if (activeCount >= 3) return response.status(403).json({ message: 'Limite máximo de 3 empréstimos simultâneos atingido' })

    const dateBorrowed = DateTime.local()
    const dueDate = dateBorrowed.plus({ days: DEFAULT_LOAN_DAYS })

    const emprestimo = await Emprestimo.create({
      userId: user.id,
      livroId: livro.id,
      dateBorrowed: dateBorrowed.toISO(),
      dueDate: dueDate.toISO(),
      returnedAt: null,
      active: true,
    })

    // decrement available
    livro.quantityAvailable = (livro.quantityAvailable ?? 0) - 1
    await livro.save()

    return response.status(201).json(emprestimo)
  }

  async show({ params, response }: HttpContext) {
    const e = await Emprestimo.find(params.id)
    if (!e) return response.status(404).json({ message: 'Empréstimo não encontrado' })
    await e.load('user')
    await e.load('livro')
    return response.ok(e)
  }

  async return({ params, response }: HttpContext) {
    const e = await Emprestimo.find(params.id)
    if (!e) return response.status(404).json({ message: 'Empréstimo não encontrado' })
    if (e.returnedAt) return response.status(400).json({ message: 'Já retornado' })

    e.returnedAt = DateTime.local()
    e.active = false
    await e.save()

    const livro = await Livro.find(e.livroId)
    if (livro) {
      livro.quantityAvailable = (livro.quantityAvailable ?? 0) + 1
      await livro.save()
    }

    return response.ok(e)
  }

  async destroy({ params, response }: HttpContext) {
    const e = await Emprestimo.find(params.id)
    if (!e) return response.status(404).json({ message: 'Empréstimo não encontrado' })

    // if not returned, increment availability
    if (!e.returnedAt) {
      const livro = await Livro.find(e.livroId)
      if (livro) {
        livro.quantityAvailable = (livro.quantityAvailable ?? 0) + 1
        await livro.save()
      }
    }

    await e.delete()
    return response.status(204).send(null)
  }
}
// import type { HttpContext } from '@adonisjs/core/http'

export default class EmprestimosController {
}