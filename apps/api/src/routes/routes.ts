import { Router } from 'express'
import type { Route } from '@routeflo/shared'

export const routeRouter = Router()

// GET /api/routes/active?driverId=x — fetch today's active route for a driver
routeRouter.get('/active', (req, res) => {
  const { driverId } = req.query
  // TODO: query database for today's route assigned to driverId
  res.json({ id: 'placeholder-route-id', driverId })
})

// GET /api/routes/:id — fetch a route with all stops
routeRouter.get('/:id', (req, res) => {
  // TODO: query database
  res.json({ message: `Route ${req.params.id}` })
})

// PATCH /api/routes/:id/reassign — reassign a stop to a different driver
routeRouter.patch('/:id/reassign', (req, res) => {
  const { stopId, toDriverId } = req.body
  // TODO: update database and emit socket event
  res.json({ message: 'Reassigned', stopId, toDriverId })
})
