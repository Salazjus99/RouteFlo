import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import type { Stop } from '@routeflo/shared'

interface Props {
  stop: Stop
  onPress: () => void
}

export function StopCard({ stop, onPress }: Props) {
  const bg = cardBackground(stop)

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: bg }]} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.sequence}>#{stop.sequence}</Text>
        <View style={styles.info}>
          <Text style={styles.address}>{stop.address}</Text>
          {stop.notes ? <Text style={styles.notes}>{stop.notes}</Text> : null}
        </View>
        <StatusBadge stop={stop} />
      </View>
    </TouchableOpacity>
  )
}

function StatusBadge({ stop }: { stop: Stop }) {
  if (stop.status === 'complete') {
    return <Text style={[styles.badge, styles.badgeComplete]}>Done</Text>
  }
  if (stop.status === 'arrived') {
    return <Text style={[styles.badge, styles.badgeArrived]}>At stop</Text>
  }
  if (stop.accountStatus === 'suspended') {
    return <Text style={[styles.badge, styles.badgeSuspended]}>Suspended</Text>
  }
  return null
}

function cardBackground(stop: Stop): string {
  if (stop.status === 'complete') return '#fff'
  if (stop.flaggedByOffice) return '#e0f0ff'       // light blue — office flagged
  if (stop.accountStatus === 'suspended') return '#d4edda'  // green — suspended/unpaid
  if (stop.accountStatus === 'paid') return '#d4edda'
  return '#fff'
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sequence: { fontSize: 16, fontWeight: '700', color: '#999', width: 28 },
  info: { flex: 1 },
  address: { fontSize: 15, fontWeight: '600' },
  notes: { fontSize: 13, color: '#555', marginTop: 2 },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  badgeComplete: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
  badgeArrived: { backgroundColor: '#fff3e0', color: '#e65100' },
  badgeSuspended: { backgroundColor: '#ffebee', color: '#c62828' },
})
