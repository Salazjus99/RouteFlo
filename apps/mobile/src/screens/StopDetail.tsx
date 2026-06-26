import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../../App'
import type { Stop } from '@routeflo/shared'
import { api } from '../lib/api'

type Props = NativeStackScreenProps<RootStackParamList, 'StopDetail'>

export function StopDetail({ route, navigation }: Props) {
  const { stopId, routeId } = route.params
  const [stop, setStop] = useState<Stop | null>(null)

  useEffect(() => {
    api.get<Stop>(`/stops/${stopId}`)
      .then(setStop)
      .catch(() => Alert.alert('Error', 'Failed to load stop details.'))
  }, [stopId])

  async function handleComplete() {
    try {
      await api.patch(`/stops/${stopId}/complete`, { routeId })
      setStop((s) => s ? { ...s, status: 'complete' } : s)
      navigation.goBack()
    } catch {
      Alert.alert('Error', 'Failed to complete stop. Please try again.')
    }
  }

  async function handlePhoto() {
    // TODO: launch camera via expo-camera
    Alert.alert('Camera', 'Photo attachment coming soon.')
  }

  async function handleExtraTrash() {
    Alert.alert('Extra Trash', 'Log extra trash volume here.')
    // TODO: open volume/tote input modal
  }

  if (!stop) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading stop...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.address}>{stop.address}</Text>

        {stop.flaggedByOffice && (
          <View style={styles.officeAlert}>
            <Text style={styles.officeAlertText}>⚑ Office Note</Text>
            {stop.notes ? <Text style={styles.officeNote}>{stop.notes}</Text> : null}
          </View>
        )}

        {stop.accountStatus === 'suspended' && (
          <View style={styles.suspendedAlert}>
            <Text style={styles.suspendedText}>Account Suspended — Do not service until cleared</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnComplete} onPress={handleComplete}>
            <Text style={styles.btnCompleteText}>Complete Stop</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSecondary} onPress={handlePhoto}>
            <Text style={styles.btnSecondaryText}>Attach Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSecondary} onPress={handleExtraTrash}>
            <Text style={styles.btnSecondaryText}>Log Extra Trash</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { padding: 20 },
  loading: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#666' },
  back: { marginBottom: 16 },
  backText: { color: '#1a1a2e', fontSize: 15, fontWeight: '600' },
  address: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  officeAlert: {
    backgroundColor: '#e0f0ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  officeAlertText: { fontWeight: '700', color: '#1565c0', marginBottom: 4 },
  officeNote: { color: '#1565c0' },
  suspendedAlert: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  suspendedText: { fontWeight: '600', color: '#2e7d32' },
  actions: { gap: 12, marginTop: 24 },
  btnComplete: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCompleteText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  btnSecondary: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnSecondaryText: { color: '#333', fontWeight: '600', fontSize: 15 },
})
