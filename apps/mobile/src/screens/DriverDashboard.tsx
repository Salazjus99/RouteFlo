import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../../App'
import type { Stop, Route } from '@routeflo/shared'
import { RouteProgressBar } from '../components/RouteProgressBar'
import { StopCard } from '../components/StopCard'
import { useSocket } from '../hooks/useSocket'
import { useGeofencing } from '../hooks/useGeofencing'
import { api } from '../lib/api'

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>

export function DriverDashboard({ route, navigation }: Props) {
  const { routeId } = route.params
  const [routeData, setRouteData] = useState<Route | null>(null)
  const alertedStops = useRef<Set<string>>(new Set())

  const { socket } = useSocket(routeId)
  useGeofencing(routeData?.stops ?? [], onStopArrival)

  useEffect(() => {
    api.get<Route>(`/routes/${routeId}`).then(setRouteData)
  }, [routeId])

  // Real-time updates from office
  useEffect(() => {
    if (!socket) return

    socket.on('stop:flagged', ({ stopId, notes }: { stopId: string; notes: string }) => {
      setRouteData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          stops: prev.stops.map((s) =>
            s.id === stopId ? { ...s, flaggedByOffice: true, notes } : s
          ),
        }
      })
    })

    socket.on('stop:completed', ({ stopId }: { stopId: string }) => {
      setRouteData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          stops: prev.stops.map((s) =>
            s.id === stopId ? { ...s, status: 'complete' } : s
          ),
        }
      })
    })

    // Payment cleared — alert tone + update highlight
    socket.on('payment_cleared', ({ stopId }: { stopId: string }) => {
      if (alertedStops.current.has(stopId)) return
      alertedStops.current.add(stopId)
      Alert.alert('Payment Received', 'A suspended account has cleared payment.')
      setRouteData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          stops: prev.stops.map((s) =>
            s.id === stopId ? { ...s, accountStatus: 'paid' } : s
          ),
        }
      })
    })

    return () => {
      socket.off('stop:flagged')
      socket.off('stop:completed')
      socket.off('payment_cleared')
    }
  }, [socket])

  function onStopArrival(stopId: string) {
    setRouteData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        stops: prev.stops.map((s) =>
          s.id === stopId && s.status === 'pending' ? { ...s, status: 'arrived' } : s
        ),
      }
    })
  }

  if (!routeData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading route...</Text>
      </SafeAreaView>
    )
  }

  const completed = routeData.stops.filter((s) => s.status === 'complete').length
  const total = routeData.stops.length

  return (
    <SafeAreaView style={styles.container}>
      <RouteProgressBar completed={completed} total={total} />

      <View style={styles.header}>
        <Text style={styles.title}>Today's Route</Text>
        <TouchableOpacity
          style={styles.preTripBtn}
          onPress={() => navigation.navigate('PreTrip', { routeId })}
        >
          <Text style={styles.preTripBtnText}>Pre-Trip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={routeData.stops}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <StopCard
            stop={item}
            onPress={() => navigation.navigate('StopDetail', { stopId: item.id, routeId })}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  loading: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#666' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 20, fontWeight: '700' },
  preTripBtn: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  preTripBtnText: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
})
