import React, { useContext, useState, useEffect, useCallback } from 'react'
import { useMemo } from 'react'
import { memo } from 'react'
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import firestore from '@react-native-firebase/firestore'
import { useTheme, Text, ActivityIndicator } from 'react-native-paper'
import { AuthContext } from './Authentication/AuthProvider'
import { navigate } from '../Navigators/utils'

interface Props {
  excerciseId: number
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  labelsContainer: { paddingLeft: 10 },
  labelsContainerCentered: { textAlign: 'center', paddingTop: 10 },
})

const ExcerciseDetails = memo(({ excerciseId }: Props) => {
  const { user } = useContext(AuthContext)
  const [historicalExcrecises, setHistoricalExcercises] = useState({
    labels: [],
    values: [],
    reps: [],
  })
  const [followedBest, setFollowedBest] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistoricalExcercises()
    getFollowedBestLifts()
  }, [])

  const getHistoricalExcercises = useCallback(async () => {
    await firestore()
      .collection('workouts')
      .where('userId', '==', user?.uid)
      .orderBy('postTime', 'asc')
      .get()
      .then(querySnapshot => {
        const list = {
          labels: [],
          values: [],
          reps: [],
        }
        querySnapshot.forEach(doc => {
          const { day, excercises } = doc.data()

          const excerciseFromWorkout = excercises.find(
            el => el.id === excerciseId,
          )

          if (!excerciseFromWorkout) return

          const maxExcerciseWorkoutValue = excerciseFromWorkout.sets.reduce(
            (element, max) => (element.weight > max.weight ? element : max),
            { weight: 0 },
          )

          list.labels.push(day)
          list.values.push(maxExcerciseWorkoutValue.weight)
          list.reps.push(maxExcerciseWorkoutValue.reps)
        })

        setLoading(false)
        setHistoricalExcercises(list)
      })
  }, [user?.uid, excerciseId])

  const getFollowedBestLifts = useCallback(async () => {
    const bestLiftsCollection:
      | ((prevState: never[]) => never[])
      | { name: string; value: any; userId: string; userImg: any }[] = []
    await firestore()
      .collection('users')
      .where('__name__', 'in', user?.followed)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const { bestLifts, fname, lname, userImg } = doc.data()
          const bestLiftInEx = bestLifts?.find?.(el => el.id === excerciseId)
          const usrId = doc.id
          if (bestLiftInEx)
            bestLiftsCollection.push({
              name: `${fname} ${lname}`,
              value: bestLiftInEx.value,
              userId: usrId,
              userImg,
            })
        })
      })
    setFollowedBest(bestLiftsCollection)
  }, [user?.followed, excerciseId])

  const theme = useTheme()

  const data = useMemo(() => {
    const oneRepMax =
      historicalExcrecises.values?.length > 0
        ? historicalExcrecises.values[historicalExcrecises.values.length - 1] /
          (1.0278 -
            0.0278 *
              historicalExcrecises.reps[historicalExcrecises.reps.length - 1])
        : 0

    return {
      labels: historicalExcrecises.labels,
      datasets: [
        {
          data: historicalExcrecises.values,
          color: () => theme.colors.secondary, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ['Weight (KG)'], // optional
      oneRepMax: parseFloat(`${oneRepMax}`).toFixed(2),
    }
  }, [historicalExcrecises, theme])

  return (
    <View>
      {loading && (
        <ActivityIndicator
          animating={true}
          size={'large'}
          style={{ marginTop: 30 }}
        />
      )}
      {data.labels.length > 0 ? (
        <LineChart
          data={data}
          width={Dimensions.get('window').width - 60}
          height={200}
          chartConfig={{
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            decimalPlaces: 2, // optional, defaults to 2dp
            color: () => theme.colors.text,
            labelColor: theme.colors.text,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '1',
              color: theme.colors.primaryContainer,
            },
          }}
          formatXLabel={val => val.slice(5)}
        />
      ) : null}

      {followedBest.length > 0 && (
        <>
          <Text variant="titleLarge" style={styles.labelsContainerCentered}>
            Friends heaviest lifts:
          </Text>
          <ScrollView>
            {followedBest.map(el => {
              return (
                <View style={styles.container} key={el.userId}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate('Profile', {
                        userId: el.userId,
                      })
                    }
                    style={styles.button}
                  >
                    <Image
                      style={styles.image}
                      source={
                        el?.userImg
                          ? {
                              uri: el?.userImg,
                            }
                          : require('../Assets/Images/avatar.png')
                      }
                    />
                    <View style={styles.labelsContainer}>
                      <Text variant="labelMedium">{el.name}</Text>
                      <Text variant="labelSmall">{el.value} KG</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            })}
          </ScrollView>
        </>
      )}
      {!loading && (
        <Text variant="titleSmall" style={styles.labelsContainerCentered}>
          Your current estimated one rep max:
          {data.oneRepMax} KG
        </Text>
      )}
    </View>
  )
})

ExcerciseDetails.displayName = 'ExcerciseDetails'
export default ExcerciseDetails
