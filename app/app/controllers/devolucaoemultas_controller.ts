import type { HttpContext } from '@adonisjs/core/http'
import Devolucaoemulta from 'App/Models/Devolucaoemulta'
import { DateTime } from 'luxon'

export default class DevolucaoemultasController {
	async index({ request, response }: HttpContext) {
		const { user_id, unpaid, page = 1, limit = 20 } = request.qs() as any

		let query = Devolucaoemulta.query()
		if (user_id) query.where('user_id', user_id)
		if (unpaid !== undefined) query.where('paid', unpaid === 'true' || unpaid === true)

		const results = await query.paginate(Number(page) || 1, Number(limit) || 20)
		return response.ok(results)
	}

	async show({ params, response }: HttpContext) {
		const m = await Devolucaoemulta.find(params.id)
		if (!m) return response.status(404).json({ message: 'Multa não encontrada' })
		await m.load('user')
		await m.load('emprestimo')
		return response.ok(m)
	}

	async pay({ params, response }: HttpContext) {
		const m = await Devolucaoemulta.find(params.id)
		if (!m) return response.status(404).json({ message: 'Multa não encontrada' })
		if (m.paid) return response.status(400).json({ message: 'Multa já paga' })

		m.paid = true
    m.paidAt = DateTime.local()

		return response.ok(m)
	}
}