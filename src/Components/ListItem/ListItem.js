import React from 'react'
import PropTypes from 'prop-types'
import { View, Image, StyleSheet, Pressable, Text } from 'react-native'
import { useTheme } from '@/Hooks'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'black',
  },
})

const ListItem = ({ item, onClick }) => {
  return (
    <Pressable onPress={onClick}>
      <Text style={styles.item}>{item}</Text>
    </Pressable>
  )
}

ListItem.propTypes = {
  height: PropTypes.number,
  mode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'repeat', 'center']),
  width: PropTypes.number,
}

ListItem.defaultProps = {
  height: 200,
  mode: 'contain',
  width: 200,
}

export default ListItem
