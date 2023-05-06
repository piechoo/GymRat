import React, { useMemo } from 'react'
import { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Portal, Modal as PaperModal } from 'react-native-paper'
import Button from './Button'

interface ModalProps {
  isVisible: boolean
  setVisible: (arg: boolean) => any
  buttons?: React.ReactElement | null
  shouldStretch?: boolean
  closeLabel?: string
  children: React.ReactElement
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginVertical: 80,
    marginHorizontal: 30,
    flexDirection: 'column',
  },
  modalView: {
    paddingBottom: 5,
    paddingLeft: 5,
    flexDirection: 'row-reverse',
  },
})

const Modal = memo(
  ({
    isVisible,
    setVisible,
    buttons,
    shouldStretch,
    children,
    closeLabel = 'Cancel',
  }: ModalProps) => {
    const hideModal = () => setVisible(false)

    const stretchStyle = useMemo(
      () => ({ flex: shouldStretch ? 1 : 0 }),
      [shouldStretch],
    )

    return (
      <Portal>
        <PaperModal
          visible={isVisible}
          onDismiss={hideModal}
          contentContainerStyle={[styles.container, stretchStyle]}
        >
          {children}
          <View style={styles.modalView}>
            {buttons}
            <Button
              mode="text"
              fullWidth={false}
              onPress={() => setVisible(false)}
            >
              {closeLabel}
            </Button>
          </View>
        </PaperModal>
      </Portal>
    )
  },
)

Modal.displayName = 'Modal'
export default Modal
