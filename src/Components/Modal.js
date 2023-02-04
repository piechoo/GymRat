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

const Modal = memo(({ isVisible, setVisible, buttons, children }) => {
  const hideModal = () => setVisible(false)
  const { Layout, Gutters, Fonts } = useTheme()

  const containerStyle = { backgroundColor: 'white', margin: 20, flex: 1 }

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

Modal.type.displayName = 'Modal'
export default Modal
