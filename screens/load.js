import React from 'react' ;
import { View, StyleSheet,Text } from 'react-native' ;
import LottieView from 'lottie-react-native' ;

const AppLoader = ()=>{
    return(
        <View style={[StyleSheet.absoluteFillObject,styles.container]}>
            <LottieView source={require('../assets/animations/loading.json')} autoPlay loop/>
        </View>
    );
};

export default AppLoader;

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,0.3)',
        zIndex:1,
    }
})