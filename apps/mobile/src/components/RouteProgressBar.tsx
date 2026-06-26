import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface Props {
  completed: number
  total: number
}

export function RouteProgressBar({ completed, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  const stopsLeft = total - completed
  const avgMinutesPerStop = 8
  const etaMinutes = stopsLeft * avgMinutesPerStop
  const etaText = etaMinutes < 60
    ? `~${etaMinutes}m left`
    : `~${Math.round(etaMinutes / 60)}h ${etaMinutes % 60}m left`

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.pct}>{pct}% complete</Text>
        <Text style={styles.eta}>{etaText}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.sub}>{completed} of {total} stops</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  pct: { color: '#fff', fontWeight: '700', fontSize: 15 },
  eta: { color: '#aaa', fontSize: 13 },
  track: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  sub: { color: '#888', fontSize: 12, marginTop: 4 },
})
