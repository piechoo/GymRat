import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/Components'
import { useTheme } from '@/Hooks'
import { changeTheme } from '@/Store/Theme'
import { getBodypartExcercises } from '@/Store/Excercises'
import { bodyParts } from '@/Store/Excercises/consts'
import ListItem from '@/Components/ListItem/ListItem'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

const ExcercisesList = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={Object.values(bodyParts)}
        renderItem={({ item }) => <ListItem item={item} />}
      />
    </View>
  )
}

export default ExcercisesList
