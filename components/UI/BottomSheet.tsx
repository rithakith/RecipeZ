// BottomSheet.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
interface BottomSheetProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isVisible, onDismiss }) => {
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        index={0}
        snapPoints={['50%', '80%']}
        onDismiss={onDismiss}
        enablePanDownToClose={true}
        backdropComponent={({ style }) => (
          <View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
        )}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Bot Interaction</Text>
          <Text>This is where you can interact with the bot.</Text>
          {/* Add bot interaction UI here */}
          <TouchableOpacity onPress={onDismiss} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BottomSheet;
