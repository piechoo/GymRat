import React from 'react'
import PropTypes from 'prop-types'
import { View, Image, StyleSheet, Pressable, Text } from 'react-native'
import { useTheme } from '@/Hooks'
import { Button } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    // flex: 1,
    // flexGrow: 1,
    // minWidth: '100%',
  },
  item: {
    flex: 1,
    fontSize: 18,
    height: 44,
    color: 'black',
  },
})

const ListItem = ({ item, title, selected, onClick }) => {
  return (
    <Button
      mode="text"
      onPress={() => onClick(item)}
      style={[
        styles.container,
        { backgroundColor: selected ? 'green' : 'transparent' },
      ]}
    >
      <Text style={styles.item}>{title}</Text>
    </Button>
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
