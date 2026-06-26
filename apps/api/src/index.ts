import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { routeRouter } from './routes/routes'
import { stopsRouter } from './routes/stops'
import { ticketsRouter } from './routes/tickets'

const app = express()
const httpServer = createServer(app)
export const io = new Server(httpServer, { cors: { origin: '*' } })

app.use(cors())
app.use(express.json())

app.use('/api/routes', routeRouter)
app.use('/api/stops', stopsRouter)
app.use('/api/tickets', ticketsRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join:route', (routeId: string) => {
    socket.join(`route:${routeId}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`RouteFlo API running on port ${PORT}`)
})
