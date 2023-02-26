import { useTheme } from '@/Hooks'
import * as React from 'react'
import { memo } from 'react'
import { View } from 'react-native'
import {
  Portal,
  Text,
  Button,
  Provider,
  Modal as PaperModal,
} from 'react-native-paper'

interface ModalProps {
    isVisible: boolean;
    setVisible: (arg:boolean)=>any;
    buttons?:React.ReactElement;
    shouldStretch?:boolean,
    children:React.ReactElement
}

const Modal = memo(({ isVisible, setVisible, buttons, shouldStretch, children }:ModalProps) => {
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
        <View style={[Layout.rowReverse]}>
          {buttons}
          <Button
            mode="text"
            onPress={() => setVisible(false)}
            style={{ paddingHorizontal: 10, paddingVertical: 5 }}
          >
            Cancel
          </Button>
        </View>
      </PaperModal>
    </Portal>
  )
})

Modal.displayName = 'Modal'
export default Modal
