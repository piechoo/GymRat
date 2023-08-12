import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import { MD3Colors, ProgressBar, Surface, Text } from 'react-native-paper'

import { Set } from '../Store/types'
import { GamificationRecord } from '../Store/Gamification/types'
import SimpleUserPreview, { UserPreviewSize } from './SimpleUserPreview'
import { findNameFromId } from '../Store/Excercises/consts'
import NumberValue from './NumberValue'

interface Props {
  gamification: GamificationRecord
  bestResult: number
  currentUserId: string
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  surface: {
    marginHorizontal: '5%',
    width: '90%',
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  setButton: {
    height: 50,
    width: '100%',
    borderRadius: 50,
  },
})

const LeaderboardResult = memo(
  ({ gamification, bestResult, currentUserId }: Props) => {
    const barValue = isFinite(gamification.overall / bestResult)
      ? gamification.overall / bestResult
      : 1
    return (
      <Surface style={styles.surface} elevation={1}>
        <View
          style={{
            width: '100%',
          }}
        >
          <View style={{ paddingHorizontal: 10 }}>
            <SimpleUserPreview userId={gamification.userId} disabled />
          </View>
          <View style={styles.setButton}>
            <View style={{ alignItems: 'center' }}>
              <NumberValue value={gamification.overall} />
            </View>
            <ProgressBar progress={barValue} color={MD3Colors.error50} />
          </View>
        </View>
      </Surface>
    )
  },
)

LeaderboardResult.displayName = 'LeaderboardResult'
export default LeaderboardResult
