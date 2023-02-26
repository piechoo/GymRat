import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface Props {
  value: number
  desc: string
}

const styles = StyleSheet.create({
  element: { flexDirection: 'row', alignItems: 'baseline' },
  value: { fontSize: 20, paddingRight: 1, fontWeight: 'bold' },
})

const NumberValue = ({ value, desc }: Props) => {
  return (
    <View style={styles.element}>
      <Text style={styles.value}>{value}</Text>
      <Text>{desc}</Text>
    </View>
  )
}

export default NumberValue
