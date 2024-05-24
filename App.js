import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text, View } from 'react-native';
import TelaNotificacao from './Telas/TelaNotificacao';
import TelaHome from './Telas/TelaHome';
import TelaProduto from './Telas/TelaProduto';
import MenuLateral from './components/MenuLateral';  // Certifique-se de que o caminho está correto

// Configurações do seu projeto Firebase

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Home" 
        drawerContent={(props) => <MenuLateral {...props} />}
      >
        <Drawer.Screen name="Home" component={TelaHome} />
        <Drawer.Screen name="Produto" component={TelaProduto} />
        <Drawer.Screen name="Notificação" component={TelaNotificacao} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
