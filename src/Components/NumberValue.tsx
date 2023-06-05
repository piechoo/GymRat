import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../Hooks'

interface Props {
  value: number
  desc: string
}

const styles = StyleSheet.create({
  element: { flexDirection: 'row', alignItems: 'baseline' },
  value: { fontSize: 20, paddingRight: 1, fontWeight: 'bold' },
})

const NumberValue = ({ value, desc }: Props) => {
  const { NavigationTheme } = useTheme()

  return (
    <View style={styles.element}>
      <Text style={[styles.value, { color: NavigationTheme.colors.text }]}>
        {value}
      </Text>
      <Text style={{ color: NavigationTheme.colors.text }}>{desc}</Text>
    </View>
  )
}

export default NumberValue
