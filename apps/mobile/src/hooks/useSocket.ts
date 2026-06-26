import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { API_URL } from '../lib/api'

export function useSocket(routeId: string) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const s = io(API_URL)
    s.emit('join:route', routeId)
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [routeId])

  return { socket }
}
