import { useTheme } from '@/Hooks'
import * as React from 'react'
import { memo } from 'react'
import { View } from 'react-native'
import { Portal, Text, Provider, Modal as PaperModal } from 'react-native-paper'
import Button from './Button'

interface ModalProps {
  isVisible: boolean
  setVisible: (arg: boolean) => any
  buttons?: React.ReactElement
  shouldStretch?: boolean
  children: React.ReactElement
}

const Modal = memo(
  ({ isVisible, setVisible, buttons, shouldStretch, children }: ModalProps) => {
    const hideModal = () => setVisible(false)
    const { Layout } = useTheme()

    const containerStyle = {
      backgroundColor: 'white',
      marginVertical: 80,
      marginHorizontal: 30,
      flex: shouldStretch ? 1 : 0,
    }

    return (
      <Portal>
        <PaperModal
          visible={isVisible}
          onDismiss={hideModal}
          contentContainerStyle={[containerStyle, Layout.column]}
        >
          {children}
          <View
            style={[Layout.rowReverse, { paddingBottom: 5, paddingLeft: 5 }]}
          >
            {buttons}
            <Button
              mode="text"
              fullWidth={false}
              onPress={() => setVisible(false)}
            >
              Cancel
            </Button>
          </View>
        </PaperModal>
      </Portal>
    )
  },
)

Modal.displayName = 'Modal'
export default Modal
