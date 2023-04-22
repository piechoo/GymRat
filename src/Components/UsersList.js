import React, { useEffect, useState } from 'react'
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
  },
})

const UsersList = ({ selectedUsersIds, setIsModalVisible, title }) => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const { t } = useTranslation()

  const getUser = async () => {
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
  }

  useEffect(() => {
    if (selectedUsersIds) getUser()
  }, [selectedUsersIds])

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            setIsModalVisible(false)
          }}
        />
        {title ? (
          <Appbar.Content title={title} />
        ) : (
          <TextInput
            mode="outlined"
            style={{ flexGrow: 1 }}
            label="User first or last name"
            value={search}
            onChangeText={userEmail => setSearch(userEmail)}
            autoCapitalize="words"
            autoCorrect={false}
          />
        )}

        <Appbar.Action
          icon="magnify"
          onPress={() => {
            getUser()
          }}
        />
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
