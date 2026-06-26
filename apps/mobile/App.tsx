import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DriverDashboard } from './src/screens/DriverDashboard'
import { PreTripInspection } from './src/screens/PreTripInspection'
import { StopDetail } from './src/screens/StopDetail'
import { api } from './src/lib/api'

export type RootStackParamList = {
  Dashboard: { routeId: string }
  PreTrip: { routeId: string }
  StopDetail: { stopId: string; routeId: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

// Hardcoded for now — will come from auth session once login is built
const DRIVER_ID = 'driver-placeholder-id'

export default function App() {
  const [routeId, setRouteId] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api
      .get<{ id: string }>(`/routes/active?driverId=${DRIVER_ID}`)
      .then((r) => setRouteId(r.id))
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load route. Check your connection.</Text>
      </View>
    )
  }

  if (!routeId) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading your route...</Text>
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        initialParams={{ routeId }}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Dashboard" component={DriverDashboard} initialParams={{ routeId }} />
        <Stack.Screen name="PreTrip" component={PreTripInspection} />
        <Stack.Screen name="StopDetail" component={StopDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' },
  loadingText: { fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: '#c62828', textAlign: 'center', paddingHorizontal: 24 },
})
