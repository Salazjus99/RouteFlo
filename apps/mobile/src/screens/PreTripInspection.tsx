import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../../App'
import { api } from '../lib/api'

type Props = NativeStackScreenProps<RootStackParamList, 'PreTrip'>

const CHECKLIST_ITEMS = [
  'Brakes operational',
  'Lights functional (headlights, brake, reverse)',
  'Mirrors adjusted',
  'Hydraulics operational',
  'Tires inflated and undamaged',
  'Emergency equipment present',
  'Cab clean and clear',
]

type CheckState = Record<string, boolean>

export function PreTripInspection({ route, navigation }: Props) {
  const { routeId } = route.params
  const [checks, setChecks] = useState<CheckState>({})
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function toggle(item: string) {
    setChecks((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  const allChecked = CHECKLIST_ITEMS.every((item) => checks[item])
  const failedItems = CHECKLIST_ITEMS.filter((item) => !checks[item])

  async function handleSubmit() {
    if (failedItems.length > 0) {
      // Auto-generate repair ticket for any unchecked items
      await api.post('/tickets', {
        source: 'pre_trip',
        notes: `Pre-trip issues: ${failedItems.join(', ')}. Driver notes: ${notes}`,
      })
      Alert.alert(
        'Repair Ticket Created',
        `A ticket has been sent to the mechanic for: ${failedItems.join(', ')}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Dashboard', { routeId }) }]
      )
    } else {
      navigation.navigate('Dashboard', { routeId })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Pre-Trip Inspection</Text>
        <Text style={styles.subtitle}>Check off each item. Any unchecked items will auto-generate a repair ticket.</Text>

        {CHECKLIST_ITEMS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.checkRow, checks[item] && styles.checkRowDone]}
            onPress={() => toggle(item)}
          >
            <View style={[styles.checkbox, checks[item] && styles.checkboxChecked]}>
              {checks[item] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkLabel, checks[item] && styles.checkLabelDone]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}

        <TextInput
          style={styles.notes}
          placeholder="Additional notes (optional)..."
          placeholderTextColor="#aaa"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitBtnText}>
            {allChecked ? 'Start Route' : 'Submit & Flag Issues'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#666', marginBottom: 20 },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  checkRowDone: { borderColor: '#4caf50', backgroundColor: '#f1f8f1' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#4caf50', borderColor: '#4caf50' },
  checkmark: { color: '#fff', fontWeight: '700', fontSize: 14 },
  checkLabel: { fontSize: 15, color: '#333', flex: 1 },
  checkLabelDone: { color: '#2e7d32' },
  notes: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    marginBottom: 20,
    fontSize: 14,
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#eee',
    color: '#333',
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
})
