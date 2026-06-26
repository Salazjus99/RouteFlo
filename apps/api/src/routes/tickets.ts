import { Router } from 'express'
import { io } from '../index'

export const ticketsRouter = Router()

// POST /api/tickets — create a repair ticket (from pre-trip or stop photo)
ticketsRouter.post('/', (req, res) => {
  const { source, stopId, notes, photoUrl } = req.body
  // TODO: insert into database
  res.status(201).json({ message: 'Ticket created', source, stopId })
})

// PATCH /api/tickets/:id/complete — welder marks job done
ticketsRouter.patch('/:id/complete', (req, res) => {
  const { id } = req.params
  const { notes, photoUrl } = req.body
  // TODO: update ticket, auto-create logistics ticket for run-around
  io.emit('ticket:complete', { ticketId: id })
  res.json({ message: 'Ticket completed', ticketId: id })
})
