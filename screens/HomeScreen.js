import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity,ImageBackground,Linking, Button, Image, Alert } from 'react-native'
import { useEffect,useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import { removeItem } from '../utils/asyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton, MD3Colors } from 'react-native-paper';
import * as Location from 'expo-location';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import mime from "mime";
import Modals from './results';
import Carousel from './scroll';
import AppLoader from './load';

const {width, height} = Dimensions.get('window');

export default function HomeScreen() {
  axios.defaults.withCredentials = true;
  const [location, setLocation] = useState();
  const [flatitude,setLatitude] = useState(null);
  const [flongitude,setLongitude] = useState(null);
  const [imageUri, setImageUri] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [resultText, setResultText] = useState(null);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [load,setLoad] = useState(false);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    // Load user history from storage when the component mounts
    loadUserHistory();
  }, []);
  const loadUserHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('userHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading user history:', error);
    }
  };
  const saveToUserHistory = async (resultData) => {
    try {
      if (resultData !== undefined && resultData !== null) {
        const currentTime = new Date().toLocaleString(); // Get the current timestamp
        const newEntry = `Result - ${history.length + 1} (${currentTime})`;
        setHistory([...history, newEntry]); // Update state
        await AsyncStorage.setItem(`resultData-${history.length + 1}`, JSON.stringify(resultData)); // Save result data to AsyncStorage
        await AsyncStorage.setItem('userHistory', JSON.stringify([...history, newEntry])); // Save history to AsyncStorage
      }
    } catch (error) {
      console.error('Error saving to user history:', error);
    }
  };
  

  const pickImage = async (sourceType) => {
    let result;
    if (sourceType === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      // Check if result.assets is defined and not empty
      if (result.assets && result.assets.length > 0) {
        // Check if an image is already selected, and if yes, deselect it
        if (imageUri === result.assets[0].uri) {
          setImageUri(null);
        } else {
          setImageUri(result.assets[0].uri);
          setResultText(null);
        }
      }
    }
  };

  const handleImagePick = () => {
    Alert.alert(
      'Select Image',
      'Choose the source for the image',
      [
        { text: 'Camera', onPress: () => pickImage('camera') },
        { text: 'Gallery', onPress: () => pickImage('gallery') },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };
  const handleUpload = async (image) => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'images');
    data.append('cloud_name', 'dg6sycihu');
  
    return fetch("https://api.cloudinary.com/v1_1/dg6sycihu/image/upload", {
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then(data => {
        return data.url; // Return the URL directly
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      })
  };
  
  

  const uploadImageAndProcess = async () => {
    setLoad(true)
    try {
      if (!imageUri) {
        console.log("Image URI is undefined"); 
        setLoad(false); 
        return;
      }
  
      let newfile = { uri: imageUri, type: mime.getType(imageUri), name: imageUri.split("/").pop() };
      
      if (!newfile) {
        console.log("New file is undefined");
        setLoad(false);
        return;
      }

      // Wait for handleUpload to complete and get the imageUrl directly
      const imageUrl = await handleUpload(newfile);

      if (imageUrl) {
        // Make the axios.post request only if imageUrl is defined
        axios.post(`http://vamsimarriwada.pythonanywhere.com/process_image?image_url=${imageUrl}`)
          .then(res => {
            const testing = JSON.stringify(res.data.result);  
            setResultText(testing);
            setModalVisibility(true);
            setLoad(false);
            saveToUserHistory(res.data.result);
          })
          .catch(e => console.log("axios.post error:", e));
      } else {
        console.log("imageUrl is undefined");
        setLoad(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoad(false);
    }
    
    
  };
  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLatitude(currentLocation.coords.latitude); 
      setLongitude(currentLocation.coords.longitude);
    };
    getPermissions();
  }, [])
  const navigation = useNavigation();

  const handleReset = async ()=>{
    await removeItem('onboarded');
    navigation.push('Onboarding');
  }

const handleOpenMap = () => {
  // Use the state variables directly
  
  const url = `https://www.google.com/maps/search/hospitals/@${flatitude},${flongitude},15z`;
  
  // Open the Google Maps app or browser with the specified URL
  Linking.openURL(url);
};
  const camButton = ({...props})=>{
    return (
        <TouchableOpacity style={styles.camButton} {...props}>
            <ImageBackground source={'../assets/images/fullStar.png' } resizeMode="cover" style={{height:50,width:50}}></ImageBackground>
            <Text>Done</Text>
        </TouchableOpacity>
    )
    
  }
  return (
    <SafeAreaView style={{flex:1, alignItems:'center',backgroundColor:"#ffffff"}}>
      {load && <AppLoader/>}
      <Text style={styles.text}>Welcome to Urine analyzer</Text>
      <View style={{flex:1, alignItems:'center',marginBottom:20}}>
        <Carousel/>
      </View>
      
      {/* <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
        <Text>Reset</Text>
      </TouchableOpacity> */}
  
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-evenly", flexDirection:'row', width:width, paddingBottom:0}}>
          <IconButton
          icon="camera"
          size={50}
          mode="contained"
          onPress={handleImagePick}
          color="#0077b6"
          />
          {imageUri && <Image source={{ uri: imageUri }} style={{ width: 120, height: 120, marginBottom: 10, borderRadius:10 }} />}
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly', flexDirection:'row' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-evenly",width:width}}>
            {imageUri && <TouchableOpacity onPress={uploadImageAndProcess} style={styles.processButton}><Text style={{color:"#fff"}}>Process</Text></TouchableOpacity>}
            {imageUri && <TouchableOpacity onPress={() => navigation.navigate('UserHistory', { history })} style={styles.historyButton}>
              <Text style={{color:"#fff"}}>History</Text>
            </TouchableOpacity>}
            
          </View>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-evenly",width:width}}>
          {imageUri && !modalVisibility && <Text style={{textAlign:"center", marginRight:15}}>Click on process button to get <Text style={{fontWeight:'bold'}}>results</Text></Text>}
          {modalVisibility  && resultText !== null && <Modals sdata={resultText}/> }
          </View>
        </View>
        {!imageUri && <TouchableOpacity onPress={() => navigation.navigate('UserHistory', { history })} style={styles.historyButton}>
              <Text style={{color:"#fff"}}>History</Text>
            </TouchableOpacity>}
      </View>
     
      <Text style={{fontSize:12,marginTop:5,marginBottom:15}}>In emergency?<Text style={{fontWeight:'bold', color:"#0077b6",fontSize:14}} onPress={handleOpenMap}> see nearby hospitals</Text></Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  historyButton:{
    backgroundColor: '#f08080',
    padding: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  lottie:{
    width: width*0.8,
    height: width*0.6,
  },
  text: {
    fontSize: width*0.06,
    marginBottom: 0,
    marginTop:40,
    fontWeight:'bold'
  },
  processButton: {
    backgroundColor: '#f08080',
    padding: 10,
    borderRadius: 10,
    marginBottom:10,
    marginTop:10,
    color: '#fff',
  }
})