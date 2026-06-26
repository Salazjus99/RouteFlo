import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { API_URL } from '../lib/api'

export function useSocket(routeId: string) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(API_URL)
    socketRef.current = socket
    socket.emit('join:route', routeId)

    return () => {
      socket.disconnect()
    }
  }, [routeId])

  return { socket: socketRef.current }
}
