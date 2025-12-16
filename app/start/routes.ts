/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Livros
router.get('/livros', 'LivrosController.index')
router.post('/livros', 'LivrosController.store')
router.get('/livros/:id', 'LivrosController.show')
router.put('/livros/:id', 'LivrosController.update')
router.delete('/livros/:id', 'LivrosController.destroy')

// Empréstimos
router.get('/emprestimos', 'EmprestimosController.index')
router.post('/emprestimos', 'EmprestimosController.store')
router.get('/emprestimos/:id', 'EmprestimosController.show')
router.post('/emprestimos/:id/return', 'EmprestimosController.return')
router.delete('/emprestimos/:id', 'EmprestimosController.destroy')
