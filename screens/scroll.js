import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    LogBox,
  } from "react-native";
  import React, { useEffect, useRef, useState } from "react";
  
  const Carousel = () => {
    const flatlistRef = useRef();
    const screenWidth = Dimensions.get("window").width;
    const [activeIndex, setActiveIndex] = useState(0);
  
    useEffect(() => {
      let interval = setInterval(() => {
        if (activeIndex === carouselData.length - 1) {
          flatlistRef.current.scrollToIndex({
            index: 0,
            animation: true,
          });
        } else {
          flatlistRef.current.scrollToIndex({
            index: activeIndex + 1,
            animation: true,
          });
        }
      }, 2000);
  
      return () => clearInterval(interval);
    }, [activeIndex]);
  
    const getItemLayout = (data, index) => ({
      length: screenWidth,
      offset: screenWidth * index,
      index: index,
    });
  
    const carouselData = [
      {
        id: "01",
        image: require("../assets/wait.png"),
        text:"Wait 2 min before capturing strip",
      },
      {
        id: "02",
        image: require("../assets/upload.png"),
        text:"Upload Strip",
      },
      {
        id: "03",
        image: require("../assets/results.png"),
        text:"Get instant results",
      },
    ];
  
    const renderItem = ({ item, index }) => {
      return (
        <View key={index} style={{justifyContent:'center'}}>
          <View><Image source={item.image} style={{ height: 250, width: screenWidth,resizeMode:"contain"}} /></View>
          <View><Text style={styles.carouselText} >{item.text}</Text></View>
        </View>
      );
    };
  
    const handleScroll = (event) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = scrollPosition / screenWidth;
      setActiveIndex(index);
    };
  
    return (
      <View>
        <FlatList
          data={carouselData}
          ref={flatlistRef}
          getItemLayout={getItemLayout}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal={true}
          pagingEnabled={true}
          onScroll={handleScroll}
        />
  
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
        </View>
      </View>
    );
  };
  
  export default Carousel;
  
  const styles = StyleSheet.create({
    carouselText: {
      position: "absolute",
      left: 0,
      right: 0,
      textAlign: "center",
      color: "white", // Set the text color
      fontSize: 16, // Set the font size
      fontWeight: "bold", // Set the font weight
      zIndex: 1, // Ensure the text is above the image
      color: "#343a40",
    },
  });
  