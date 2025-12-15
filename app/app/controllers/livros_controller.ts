import type { HttpContext } from '@adonisjs/core/http'
import Livro from 'App/Models/Livro'
import { validateCreate, validateUpdate } from 'App/Validators/livro'

export default class LivrosController {
  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    const qs = typeof request.qs === 'function' ? request.qs() : request.get ? request.get() : {}
    const { title, author, isbn, category, page = 1, limit = 20 } = qs as any

    let query = Livro.query()

    if (isbn) query.where('isbn', isbn)
    if (title) query.where('title', 'like', `%${title}%`)
    if (category) query.where('category', 'like', `%${category}%`)
    if (author) query.where('authors', 'like', `%${author}%`)

    const results = await query.paginate(Number(page) || 1, Number(limit) || 20)

    return response.ok(results)
  }

  /**
   * Display form to create a new record
   */
  async create({ response }: HttpContext) {
    return response.status(405).send({ message: 'Not supported on API' })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const payload = request.only([
      'title',
      'isbn',
      'authors',
      'publisher',
      'year',
      'edition',
      'pages',
      'category',
      'quantity_available',
      'shelf_location',
    ])

    const validation = validateCreate(payload)
    if (!validation.valid) return response.status(422).json({ errors: validation.errors })

    const existing = await Livro.findBy('isbn', payload.isbn)
    if (existing) return response.status(409).json({ message: 'ISBN already exists' })

    const livro = await Livro.create({
      title: payload.title,
      isbn: payload.isbn,
      authors: payload.authors,
      publisher: payload.publisher,
      year: payload.year,
      edition: payload.edition,
      pages: payload.pages,
      category: payload.category,
      quantityAvailable: payload.quantity_available,
      shelfLocation: payload.shelf_location,
    })

    return response.status(201).json(livro)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const livro = await Livro.find(params.id)
    if (!livro) return response.status(404).json({ message: 'Livro não encontrado' })
    return response.ok(livro)
  }

  /**
   * Edit individual record
   */
  async edit({ params, response }: HttpContext) {
    return response.status(405).send({ message: 'Not supported on API' })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const livro = await Livro.find(params.id)
    if (!livro) return response.status(404).json({ message: 'Livro não encontrado' })

    const payload = request.only([
      'title',
      'isbn',
      'authors',
      'publisher',
      'year',
      'edition',
      'pages',
      'category',
      'quantity_available',
      'shelf_location',
    ])

    const validation = validateUpdate(payload)
    if (!validation.valid) return response.status(422).json({ errors: validation.errors })

    if (payload.isbn && payload.isbn !== livro.isbn) {
      const existing = await Livro.findBy('isbn', payload.isbn)
      if (existing && existing.id !== livro.id) return response.status(409).json({ message: 'ISBN already exists' })
    }

    const data: any = {}
    if (payload.title !== undefined) data.title = payload.title
    if (payload.isbn !== undefined) data.isbn = payload.isbn
    if (payload.authors !== undefined) data.authors = payload.authors
    if (payload.publisher !== undefined) data.publisher = payload.publisher
    if (payload.year !== undefined) data.year = payload.year
    if (payload.edition !== undefined) data.edition = payload.edition
    if (payload.pages !== undefined) data.pages = payload.pages
    if (payload.category !== undefined) data.category = payload.category
    if (payload.quantity_available !== undefined) data.quantityAvailable = payload.quantity_available
    if (payload.shelf_location !== undefined) data.shelfLocation = payload.shelf_location

    livro.merge(data)
    await livro.save()

    return response.ok(livro)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const livro = await Livro.find(params.id)
    if (!livro) return response.status(404).json({ message: 'Livro não encontrado' })
    await livro.delete()
    return response.status(204).send(null)
  }
}