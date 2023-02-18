import React from 'react'
import PropTypes from 'prop-types'
import { View, Image, Text } from 'react-native'
import { useTheme } from '@/Hooks'
import { TouchableRipple } from 'react-native-paper'

const NumberValue = ({ value, desc }) => {
  const { Layout, Images } = useTheme()

  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
      <Text style={{ fontSize: 20, paddingRight: 1, fontWeight: 'bold' }}>
        {value}
      </Text>
      <Text>{desc}</Text>
    </View>
  )
}

NumberValue.propTypes = {
  height: PropTypes.number,
  mode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'repeat', 'center']),
  width: PropTypes.number,
}

NumberValue.defaultProps = {
  height: 200,
  mode: 'contain',
  width: 200,
}

export default NumberValue
