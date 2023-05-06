import React from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { IconButton } from 'react-native-paper'

interface Props {
  buttonTitle: string
  iconName: string
  color: string
  backgroundColor: string
  onPress: () => void
}

const SocialButton = ({
  buttonTitle,
  iconName,
  color,
  backgroundColor,
  ...rest
}: Props) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, { backgroundColor }]}
      {...rest}
    >
      <View style={styles.iconWrapper}>
        <IconButton icon={iconName} iconColor={color} size={22} />
      </View>
      <View style={styles.btnTxtWrapper}>
        <Text style={[styles.buttonText, { color }]}>{buttonTitle}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default SocialButton

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    height: Dimensions.get('window').height / 15,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 3,
  },
  iconWrapper: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  btnTxtWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lato-Regular',
  },
})
