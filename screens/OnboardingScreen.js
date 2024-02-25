import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { setItem } from '../utils/asyncStorage';

const {width, height} = Dimensions.get('window');

export default function OnboardingScreen() {
    const navigation = useNavigation();

    const handleDone = ()=>{
        navigation.navigate('Home');
        setItem('onboarded', '1');
    }

    const doneButton = ({...props})=>{
        return (
            <TouchableOpacity style={styles.doneButton} {...props}>
                <Text>Done</Text>
            </TouchableOpacity>
        )
        
    }
  return (
    <View style={styles.container}>
      <Onboarding
            onDone={handleDone}
            onSkip={handleDone}
            // bottomBarHighlight={false}
            // DoneButtonComponent={doneButton}
            containerStyles={{paddingHorizontal: 15}}
            pages={[
                {
                    backgroundColor: '#03071e',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/lab.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Lab in Hands',
                    subtitle: 'Low cost app for Urine Analysis',
                },
                {
                    backgroundColor: '#03071e',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/Animation - 1703167283521.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Capture Strip',
                    subtitle: 'Capture the strip and upload it!',
                },
                {
                    backgroundColor: '#03071e',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie source={require('../assets/animations/results.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Lightning Results',
                    subtitle: 'Get super fast results of the urine strip, right from your mobile',
                },
            ]}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white'
    },
    lottie:{
        width: width*0.9,
        height: width
    },
    doneButton: {
        padding: 20,
        color: '#ffffff',
        zIndex:1,
        // borderTopLeftRadius: '100%',
        // borderBottomLeftRadius: '100%'
    }
})