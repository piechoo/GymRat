import React, { useContext, useState, useEffect } from 'react'
import { getUserExcerciseHistory } from '@/Store/User'
import { useMemo } from 'react'
import { memo } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { useSelector } from 'react-redux'
import firestore from '@react-native-firebase/firestore'
import { useTheme } from 'react-native-paper'
import { AuthContext } from './Authentication/AuthProvider'

interface Props {
  excerciseId: number
}

const ExcerciseDetails = memo(({ excerciseId }: Props) => {
  const { user } = useContext(AuthContext)
  const [historicalExcrecises, setHistoricalExcercises] = useState({
    labels: [],
    values: [],
    reps: [],
  })

  useEffect(() => {
    getHistoricalExcercises()
  }, [])

  const getHistoricalExcercises = async () => {
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

          // const maxExcerciseWorkoutValue = Math.max(
          //   excerciseFromWorkout.sets.map(o => o.weight),
          // )
          const maxExcerciseWorkoutValue = excerciseFromWorkout.sets.reduce(
            (element, max) => (element.weight > max.weight ? element : max),
            { weight: 0 },
          )

          list.labels.push(day)
          list.values.push(maxExcerciseWorkoutValue.weight)
          list.reps.push(maxExcerciseWorkoutValue.reps)
        })

        setHistoricalExcercises(list)
      })
  }

  // const historicalExcrecises = useSelector(state =>
  //   getUserExcerciseHistory(state, excerciseId),
  // )

  const theme = useTheme()

  const data = useMemo(() => {
    const labels = []
    const values = []

    // const sortedByDate = historicalExcrecises.sort(
    //   (a, b) => +new Date(a.date) - +new Date(b.date),
    // )
    // sortedByDate.map(ex => {
    //   labels.push(ex.date)
    //   values.push(Math.max(...ex.excercise.sets.map(o => o.weight)))
    // })

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
  }, [historicalExcrecises])

  return (
    <View>
      {/* {historicalExcrecises.map(ex => {
        return (
          <Text>
            {ex.date} - {Math.max(...ex.excercise.sets.map(o => o.weight))}
          </Text>
        )
      })} */}
      {data.labels.length > 0 ? (
        <LineChart
          data={data}
          width={Dimensions.get('window').width - 60}
          height={220}
          chartConfig={{
            //   backgroundColor: '#fb8c00',
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
          // bezier
          verticalLabelRotation={90}
          style={{
            paddingBottom: 60,
            borderRadius: 16,
          }}
        />
      ) : null}
      {/* <LineChart
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }}
        width={Dimensions.get('window').width} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      /> */}
      <Text>
        Estimated one rep max:
        {data.oneRepMax} KG
      </Text>
    </View>
  )
})

ExcerciseDetails.displayName = 'ExcerciseDetails'
export default ExcerciseDetails
