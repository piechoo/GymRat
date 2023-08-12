import React, { useEffect, useState, useCallback } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Appbar, Avatar, List, TextInput } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import { navigate } from '../Navigators/utils'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    marginLeft: 10,
    backgroundColor: '#dbdbdb',
  },
  textInput: { flexGrow: 1 },
})

const UsersList = ({
  selectedUsersIds,
  setIsModalVisible,
  title,
  onSelect,
}) => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  const getUser = useCallback(async () => {
    const usersArray = []

    if (selectedUsersIds) {
      await firestore()
        .collection('users')
        .where('__name__', 'in', selectedUsersIds)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const userData = doc.data()
            userData.id = doc.id
            usersArray.push(userData)
          })
        })
    } else {
      await firestore()
        .collection('users')
        .where('fname', '>=', search)
        .where('fname', '<=', search + '\uf8ff')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const userData = doc.data()
            userData.id = doc.id
            usersArray.push(userData)
          })
        })
      await firestore()
        .collection('users')
        .where('lname', '>=', search)
        .where('lname', '<=', search + '\uf8ff')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const userData = doc.data()
            userData.id = doc.id
            if (!usersArray.find(el => el.id === userData.id))
              usersArray.push(userData)
          })
        })
    }
    setUsers(usersArray)
  }, [selectedUsersIds, search])

  useEffect(() => {
    if (selectedUsersIds) getUser()
  }, [selectedUsersIds])

  const openModal = useCallback(() => setIsModalVisible(false), [])
  const getUserFunction = useCallback(() => getUser(), [getUser])

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={openModal} />
        {title ? (
          <Appbar.Content title={title} />
        ) : (
          <TextInput
            mode="outlined"
            style={styles.textInput}
            label="User first or last name"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="words"
            autoCorrect={false}
          />
        )}

        {!title && <Appbar.Action icon="magnify" onPress={getUserFunction} />}
      </Appbar.Header>
      {users.length > 0 && (
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <List.Item
              title={`${item.fname} ${item.lname}`}
              description={item.about}
              left={() => (
                <Avatar.Image
                  size={48}
                  style={styles.avatar}
                  source={
                    item?.userImg
                      ? {
                          uri: item.userImg,
                        }
                      : require('../Assets/Images/avatar.png')
                  }
                />
              )}
              onPress={() => {
                setIsModalVisible(false)
                if (onSelect) onSelect(item.id)
                else
                  navigate('Profile', {
                    userId: item.id,
                  })
              }}
            />
          )}
        />
      )}
    </View>
  )
}

export default UsersList
