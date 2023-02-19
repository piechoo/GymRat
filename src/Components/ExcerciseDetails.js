import { getUserExcerciseHistory } from '@/Store/User'
import * as React from 'react'
import { useMemo } from 'react'
import { memo } from 'react'
import { Dimensions, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import {
  Portal,
  Text,
  Button,
  Provider,
  Modal as PaperModal,
} from 'react-native-paper'
import { useSelector } from 'react-redux'
import { useTheme } from 'react-native-paper'

// const data = {
//   labels: ['January', 'February', 'March', 'April', 'May', 'June'],
//   datasets: [
//     {
//       data: [20, 45, 28, 80, 99, 43],
//       color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
//       strokeWidth: 2, // optional
//     },
//   ],
//   legend: ['Rainy Days'], // optional
// }

const ExcerciseDetails = memo(({ excerciseId }) => {
  const historicalExcrecises = useSelector(state =>
    getUserExcerciseHistory(state, excerciseId),
  )

  const theme = useTheme()

  const data = useMemo(() => {
    const labels = []
    const values = []

    const sortedByDate = historicalExcrecises.sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    )
    sortedByDate.map(ex => {
      labels.push(ex.date)
      values.push(Math.max(...ex.excercise.sets.map(o => o.weight)))
    })

    const oneRepMax = Math.max(
      ...sortedByDate[sortedByDate.length - 1].excercise.sets.map(
        o => o.weight / (1.0278 - 0.0278 * o.reps),
      ),
    )

    return {
      labels: labels,
      datasets: [
        {
          data: values,
          color: () => theme.colors.secondary, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ['Weight (KG)'], // optional
      oneRepMax: parseFloat(oneRepMax).toFixed(2),
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
      <Text>
        Estimated one rep max:
        {data.oneRepMax} KG
      </Text>
    </View>
  )
})

ExcerciseDetails.type.displayName = 'ExcerciseDetails'
export default ExcerciseDetails
