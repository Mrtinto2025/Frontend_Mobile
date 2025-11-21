import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import UsersScreen from './src/screens/UsersScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import SubCategoriesScreen from './src/screens/SubCategoriesScreem';
import ProductsScreen from './src/screens/ProductsScreen';


const Stack = createNativeStackNavigator();
export dafault fuction App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
        />
        <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Menu Principal'}}
        />
        <Stack.Screen
        name="Users"
        component={UsersScreen}
        options={{title: 'Gestion de Usuarios'}}
        />
        <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        />
        <Stack.Screen
        name="SubCategories"
        component={SubCategoriesScreen}
        />
        <Stack.Screen
        name="Products"
        component={ProductsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';

//export default function App() {
  //return (
    //<View style={styles.container}>
      //<Text>Open up App.tsx to start working on your app!</Text>
      //<StatusBar style="auto" />
    //</View>
  //);
//}
