import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

type DetailInquiryScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const image1 = require("../../assets/images/slider1.png");
const image2 = require("../../assets/images/slider2.png");
const image3 = require("../../assets/images/slider3.png");

const images = [
  image1,
  image2,
  image3,
  image1, // Repeat the images to create an infinite loop
  image2,
  image3,
];

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const DetailInquiryScreen: React.FC<DetailInquiryScreenProps> = ({
  navigation,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set up the interval for auto-scrolling
    const intervalId = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length; // Move to the next image
      setCurrentIndex(nextIndex);

      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 3000); // Scroll every 3 seconds

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} resizeMode="cover" />
        )}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      <Text style={styles.descriptionText}>
        Explore how we help you achieve your health goals with personalized
        plans and happiness at the core.
      </Text>
      {/* make the button stay in the same horizontal line */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.button, styles.skipButton]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    display: "flex",
    flexDirection: "column",
    gap: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: "auto",
  },
  image: {
    width,
    height: 300,
    borderRadius: 20,
  },
  descriptionText: {
    fontSize: 18,
    textAlign: "center",
    color: "black",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  buttonSection: {
    flexDirection: "row",
    gap: 25,
  },
  button: {
    width: "35%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginVertical: 10, // Space between buttons
  },
  skipButton: {
    backgroundColor: "#042628",
  },
  nextButton: {
    backgroundColor: "#70B9BE",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DetailInquiryScreen;
