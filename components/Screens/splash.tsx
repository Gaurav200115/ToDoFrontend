import React from "react";

import { Dimensions, Image, ImageBackground, StatusBar, StyleSheet, Text, View , } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
const { height , width } = Dimensions.get("window");


export const Splash= ()=> {
  return (
    <ImageBackground
      source={require('../Assets/ready.jpg')} 
      style={styles.background}
      blurRadius={2}
    >
     <StatusBar hidden={true} />

    <View style={{ flex:1, backgroundColor:'#ffffff78' ,borderRadius:20 ,marginHorizontal:width*.1 , marginVertical:height*.2}}>
    <View style={styles.overlay}>
      <Icon name='pencil' size={58} color={'black'}/>
      <Text style={{fontSize:30 , fontWeight:'bold'}}>
        To-Do 
      </Text>
      <Text style={{fontSize:20 , fontWeight:'600'
         , textAlign:'center' , marginTop:height*.1,
         marginHorizontal:20}}>
        The Best Prepration for tomorrow is doing your best today
      </Text>
    </View>
    </View>
      
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1, 
    resizeMode:'contain', 
  },
  overlay: {
    flex:1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop:10,
    fontFamily:'PlaywriteAUSA'
  },
  text2:{
    color:'white',
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center'
  }
});

export default Splash