import React from 'react'
import { View, Image } from 'react-native'
import { useTheme } from '@/Hooks'

enum imageModes {
  contain = 'contain',
  cover = 'cover',
  stretch = 'stretch',
  repeat = 'repeat',
  center = 'center',
}
interface Props {
  height: number
  width: number
  mode: imageModes
}

const Logo = ({
  height = 200,
  width = 200,
  mode = imageModes.contain,
}: Props) => {
  const { Layout, Images } = useTheme()

  return (
    <View style={{ height, width }}>
      <Image style={Layout.fullSize} source={Images.logo} resizeMode={mode} />
    </View>
  )
}

export default Logo
