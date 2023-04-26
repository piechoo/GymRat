import React from 'react'
import { StyleSheet, GestureResponderEvent } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'

interface Props {
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'
  onPress: (e: GestureResponderEvent) => void
  buttonColor?: string
  textColor?: string
  icon?: string
  fullWidth?: boolean
  width?: number
  children: React.ReactElement | string
}

const Button = ({
  mode,
  onPress,
  buttonColor,
  textColor,
  icon,
  fullWidth = true,
  children,
  width,
  labelStyle,
}: Props) => {
  return (
    <PaperButton
      mode={mode}
      style={[
        styles.button,
        fullWidth ? styles.fullWidth : {},
        width ? { width: width } : {},
      ]}
      labelStyle={labelStyle}
      onPress={onPress}
      buttonColor={buttonColor}
      textColor={textColor}
      icon={icon}
    >
      {children}
    </PaperButton>
  )
}

export default Button

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
    borderRadius: 5,
  },
  fullWidth: {
    width: '100%',
  },
})
