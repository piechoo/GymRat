import React, { useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import WorkoutExcercise from './WorkoutExcercise'
import { Card, Chip, Text } from 'react-native-paper'
import { getBodypartColor } from '../Store/Excercises/consts'
import { navigate } from '../Navigators/utils'
import SimpleUserPreview from './SimpleUserPreview'
import Button from './Button'

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
  chipTextStyle: { color: 'white' },
  chipViewStyle: { flexDirection: 'row', paddingVertical: 10 },
})

const SimpleWorkoutPreview = ({ workout }) => {
  const navigateToWorkout = useCallback(() => {
    navigate('Workout', {
      dayToCopy: workout.day,
      userId: workout.userId,
    })
  }, [workout.day, workout.userId])

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
        <View style={styles.chipViewStyle}>
          {workout.tags.map((tag, i) => {
            return (
              <Chip
                mode="outlined"
                elevated
                style={{
                  backgroundColor: getBodypartColor(tag.name),
                  marginRight: 5,
                }}
                textStyle={styles.chipTextStyle}
                key={workout.day + i}
              >
                {tag.name}
              </Chip>
            )
          })}
        </View>
        <Button
          onPress={navigateToWorkout}
          labelStyle={styles.saveButtonLabel}
          mode="contained"
        >
          Preview
        </Button>
      </Card.Content>
    </Card>
  )
}

export default SimpleWorkoutPreview
