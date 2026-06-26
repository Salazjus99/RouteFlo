import { useEffect, useRef } from 'react'
import * as Location from 'expo-location'
import type { Stop } from '@routeflo/shared'

const GEOFENCE_RADIUS_METERS = 45 // ~50 yards

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useGeofencing(stops: Stop[], onArrival: (stopId: string) => void) {
  const triggeredRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (stops.length === 0) return
    let active = true

    async function watch() {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return

      // NOTE: Stop coordinates would come from geocoded addresses stored in the DB.
      // For now this hook is wired up structurally; coordinate lookup is a TODO.
      const subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (loc) => {
          if (!active) return
          const { latitude, longitude } = loc.coords
          stops.forEach((stop) => {
            if (triggeredRef.current.has(stop.id)) return
            if (stop.status !== 'pending') return
            if (!stop.latitude || !stop.longitude) return
            const dist = haversineDistance(latitude, longitude, stop.latitude, stop.longitude)
            if (dist <= GEOFENCE_RADIUS_METERS) {
              triggeredRef.current.add(stop.id)
              onArrival(stop.id)
            }
          })
        }
      )
      return subscription
    }

    const subscriptionPromise = watch()
    return () => {
      active = false
      subscriptionPromise.then((sub) => sub?.remove())
    }
  }, [stops])
}
