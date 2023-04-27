import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import WorkoutExcercise from './WorkoutExcercise'
import { Layout } from '../Theme'
import { Card, Chip, Text, useTheme } from 'react-native-paper'
import { getBodypartColor } from '../Store/Excercises/consts'
import firestore from '@react-native-firebase/firestore'
import { navigate } from '../Navigators/utils'
import SimpleUserPreview from './SimpleUserPreview'
import Button from './Button'

// {
//         userId: user.uid,
//         day: currentDay ?? new Date().toISOString().slice(0, 10),
//         excercises: excercises,
//         // postImg: imageUrl,
//         postTime: firestore.Timestamp.fromDate(new Date()),
//         tags: getWorkoutTags(excercises),
//         load: getTotalLoad(excercises),
//         likes: null,
//         comments: null,
//       }

const styles = StyleSheet.create({
  saveButton: { paddingHorizontal: 10, paddingVertical: 5 },
  card: { marginVertical: 10, marginHorizontal: 5 },
  center: { textAlign: 'center', paddingBottom: 30 },
  delete: { position: 'absolute', top: 5, right: 0 },
  content: { flexDirection: 'row', flexWrap: 'wrap' },
  surface: { margin: 2, borderRadius: 10 },
  setButton: { flexDirection: 'column', padding: 5, borderRadius: 10 },
  modalContent: { paddingHorizontal: 20 },
  divider: { padding: 5 },
  saveButtonLabel: { fontWeight: '600', fontSize: 20 },
})
const SimpleWorkoutPreview = ({ workout }) => {
  const [userData, setUserData] = useState(null)

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(workout.userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data())
        }
      })
  }

  useEffect(() => {
    if (workout.userId) {
      getUser()
      // navigation.addListener('focus', () => setLoading(!loading))
    }
  }, [workout.userId])

  return (
    <Card style={styles.card} mode={'contained'}>
      {workout.userId && (
        <SimpleUserPreview userId={workout.userId} date={workout.day} />
      )}

      <Card.Content>
        <WorkoutExcercise
          excercise={workout.excercises[0]}
          key={workout.excercises[0].name}
          readOnly
        />
        {workout.excercises.length > 1 && (
          <Text style={styles.center}>{`And ${
            workout.excercises.length - 1
          } more`}</Text>
        )}
        <Chip icon="information" elevated>
          Total volume: {workout.load} KG
        </Chip>
        <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
          {workout.tags.map((tag, i) => {
            return (
              <Chip
                mode="outlined"
                elevated
                style={{
                  backgroundColor: getBodypartColor(tag.name),
                  marginRight: 5,
                }}
                textStyle={{ color: 'white' }}
                key={workout.day + i}
              >
                {tag.name}
              </Chip>
            )
          })}
        </View>
        <Button
          onPress={() => {
            navigate('Workout', {
              dayToCopy: workout.day,
              userId: workout.userId,
            })
          }}
          labelStyle={styles.saveButtonLabel}
          // weight={20}
          // fullWidth={false}
          mode="contained"
        >
          Preview
        </Button>
      </Card.Content>
    </Card>
  )
}

export default SimpleWorkoutPreview
