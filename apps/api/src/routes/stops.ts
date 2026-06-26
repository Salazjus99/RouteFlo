import { Router } from 'express'
import { io } from '../index'

export const stopsRouter = Router()

// PATCH /api/stops/:id/complete
stopsRouter.patch('/:id/complete', (req, res) => {
  const { id } = req.params
  // TODO: update database
  io.to(`route:${req.body.routeId}`).emit('stop:completed', { stopId: id })
  res.json({ message: 'Stop completed', stopId: id })
})

// PATCH /api/stops/:id/flag — office flags a stop (triggers blue highlight)
stopsRouter.patch('/:id/flag', (req, res) => {
  const { id } = req.params
  const { routeId, notes } = req.body
  // TODO: update database
  io.to(`route:${routeId}`).emit('stop:flagged', { stopId: id, notes })
  res.json({ message: 'Stop flagged', stopId: id })
})

// POST /api/stops/:id/photo — attach a photo (blocked/missed)
stopsRouter.post('/:id/photo', (req, res) => {
  const { id } = req.params
  // TODO: upload to storage, link to stop
  res.json({ message: 'Photo attached', stopId: id })
})

// POST /api/stops/:id/extra-trash — log extra trash volume
stopsRouter.post('/:id/extra-trash', (req, res) => {
  const { volume, toteCount } = req.body
  // TODO: save to database
  res.json({ message: 'Extra trash logged', stopId: req.params.id, volume, toteCount })
})
