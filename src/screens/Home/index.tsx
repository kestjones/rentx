import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar, StyleSheet, Button} from 'react-native';
import { Ionicons } from  '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import {useNetInfo} from '@react-native-community/netinfo';
import { RectButton, PanGestureHandler } from 'react-native-gesture-handler';
import { synchronize } from '@nozbe/watermelondb/sync';

import { database } from '../../database';
import { api } from '../../services/api';

import Animated,
{
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated'; 

const ButtonAnimated = Animated.createAnimatedComponent(RectButton);


import Logo from '../../assets/logo.svg';
import { CarDTO } from '../../dtos/CarDTO';

import {Car} from '../../components/Car';
import { Car as ModelCar } from '../../database/model/Car';
import { LoadAnimation } from '../../components/LoadAnimation';


import { useTheme } from 'styled-components';
import {
 Container, 
 Header,
 HeaderContent,
 TotalCars,
 CarList,

} from './styles';


export function Home(){

  const navigation = useNavigation();
  const theme = useTheme();
  const netInfo = useNetInfo();

  const [cars, setCars ] = useState<ModelCar[]>([]);
  const [loading, setLoading ] = useState(true);

  const positionY = useSharedValue(0);
  const positionX = useSharedValue(0);

  const MyCarsButtonStyle = useAnimatedStyle(()=>{

    return{

      transform: [
        {translateX: positionX.value},
        {translateY: positionY.value},
      ]
    }
  });

  const onGestureEvent= useAnimatedGestureHandler({
    onStart(_, ctx: any){
      ctx.positionX = positionX.value;
      ctx.positionY = positionY.value;

    },
    onActive(event, ctx: any){
      positionX.value= ctx.positionX + event.translationX;
      positionY.value= ctx.positionY + event.translationY;

    },
    onEnd(){
      positionX.value=withSpring(0);
      positionY.value=withSpring(0); // o withspring da um efeito de elastico legal

    }

  });
  
  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', { car });

  }
 async function offlineSynchonize(){
   await synchronize({
     database,
     pullChanges: async ({lastPulledAt}) => {
       const response = await api
       .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);
       
       const { changes, latestVersion } = response.data;
       console.log("#### SINCRONIZACAO ####");
       console.log(changes);
       return { changes, timestamp: latestVersion};

     },
     pushChanges: async ({changes}) => {
       console.log("-----entrou aqui-----");
       
       const user = changes.users;

       console.log("#### ERRO DO USUARIO ####");
       console.log(user);
       await api.post('/users/sync', user).catch(console.log);

     },

   });
 }

  useEffect(()=> {
    let isMounted = true;

   async  function fetchCars(){

     try {
      const carCollection  = database.get<ModelCar>('cars');
      const cars = await carCollection.query().fetch();


      if(isMounted){
      setCars(cars);
      }

     } catch (error) {

       console.log(error);
     }
     finally {
       if(isMounted){
       setLoading(false);
       }
     }

    }
    fetchCars();
    return () => {
      isMounted= false;
    };


  }, []);

  useEffect(() =>{

    if(netInfo.isConnected===true){
      offlineSynchonize();
    }

  },[netInfo.isConnected])

 

   return(
            <Container>
              <StatusBar
              barStyle="light-content"
              backgroundColor="transparent"
              translucent
              />
              
              <Header>
              <HeaderContent>
              
              <Logo
              width= {RFValue(108)}
              height= {RFValue(12)}

              />
                  { !loading && 
                       <TotalCars>
                        {`Total de ${cars.length} carros`}
                      </TotalCars>  
                  }
              </HeaderContent>
              </Header>
              <Button title="Sincronizar" onPress={offlineSynchonize}/>

              { loading ? <LoadAnimation/> :

                <CarList 
                  data={cars}
                  keyExtractor={item => item.id}
                  renderItem={({item})=>
                  
                  <Car data={item} 
                  onPress={()=>handleCarDetails(item)}
                  />}

                />  

              }
              {/* 
                BOTAO FLUTUANTE COM ANIMACAO
              <PanGestureHandler onGestureEvent={onGestureEvent}>
               <Animated.View
               style= {[MyCarsButtonStyle, 
              {
                position: 'absolute',

                bottom: 13,
                right: 22,
              }]}
               >
                  <ButtonAnimated 
                  onPress={handleOpenMyCars}
                  style={[styles.button, {backgroundColor: theme.colors.main}]}
                  >
                  <Ionicons 
                  name="ios-car-sport"
                  size={32}
                  color={theme.colors.shape}
                  
                  />
                </ButtonAnimated>
                </Animated.View>
                </PanGestureHandler> */}
                
             
            </Container>

          
   );
}

const styles = StyleSheet.create({
 button:{
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  }
})