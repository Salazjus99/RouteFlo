import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DriverDashboard } from './src/screens/DriverDashboard'
import { PreTripInspection } from './src/screens/PreTripInspection'
import { StopDetail } from './src/screens/StopDetail'

export type RootStackParamList = {
  Dashboard: { routeId: string }
  PreTrip: { routeId: string }
  StopDetail: { stopId: string; routeId: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DriverDashboard} />
        <Stack.Screen name="PreTrip" component={PreTripInspection} />
        <Stack.Screen name="StopDetail" component={StopDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
