import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/Components'
import { useTheme } from '@/Hooks'
import { changeTheme } from '@/Store/Theme'
import {
  getUserName,
  setUserHeight,
  setUserName,
  setUserWeight,
} from '@/Store/User'
import { navigateAndSimpleReset } from '@/Navigators/utils'

const ExampleContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()

  const [userId, setUserId] = useState('9')

  const onChangeTheme = ({ theme, darkMode }) => {
    dispatch(changeTheme({ theme, darkMode }))
  }

  const userName = useSelector(getUserName)

  return (
    <ScrollView
      style={Layout.fullSize}
      contentContainerStyle={[Gutters.smallHPadding]}
    >
      <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
        <Brand />
        <ActivityIndicator />
        <Text style={Fonts.textRegular}>
          {t('example.helloUser', { name: 'Gienio' })}
        </Text>
      </View>
      <View
        style={[
          Layout.column,
          Layout.fullWidth,
          Gutters.smallHPadding,
          Common.backgroundPrimary,
        ]}
      >
        <Text style={[Fonts.textCenter, Fonts.textSmall]}>
          {t('Podaj nazwe')}
        </Text>
        <TextInput
          onChangeText={name => dispatch(setUserName(name))}
          value={userName}
          selectTextOnFocus
          style={[Common.textInput]}
        />
        <Text style={[Fonts.textCenter, Fonts.textSmall]}>
          {t('Podaj swoja wage')}
        </Text>
        <TextInput
          onChangeText={name => dispatch(setUserWeight(name))}
          keyboardType={'number-pad'}
          maxLength={1}
          value={userId}
          selectTextOnFocus
          style={[Common.textInput]}
        />

        <Text style={[Fonts.textCenter, Fonts.textSmall]}>
          {t('Podaj swoj wzrost')}
        </Text>
        <TextInput
          onChangeText={name => dispatch(setUserHeight(name))}
          keyboardType={'number-pad'}
          maxLength={1}
          value={userId}
          selectTextOnFocus
          style={[Common.textInput]}
        />
      </View>

      <TouchableOpacity
        style={[Common.button.rounded, Gutters.regularVMargin]}
        onPress={() => navigateAndSimpleReset('Main')}
      >
        <Text style={Fonts.textRegular}>Zaloguj</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[Common.button.outlineRounded, Gutters.regularBMargin]}
        onPress={() => onChangeTheme({ darkMode: true })}
      >
        <Text style={Fonts.textRegular}>Dark</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[Common.button.outline, Gutters.regularBMargin]}
        onPress={() => onChangeTheme({ darkMode: false })}
      >
        <Text style={Fonts.textRegular}>Light</Text>
      </TouchableOpacity> */}
    </ScrollView>
  )
}

export default ExampleContainer
