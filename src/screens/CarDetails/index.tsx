import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,

} from 'react-native-reanimated';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { StatusBar, StyleSheet } from 'react-native';

// import speedSvg from '../../assets/speed.svg';


import { getAccessoryIcons } from '../../utils/getAccessoryIcons'

import {
 Container, 
 Header,
 CarImages,
 Details,
 Description,
 Brand,
 Name,
 Rent,
 Period,
 Price,
 About,
 Accessories,
 Footer,

} from './styles';
import { CarDTO } from '../../dtos/CarDTO';

interface Params { 
car: CarDTO;

}

export function CarDetails(){

  const navigation = useNavigation();
  const route = useRoute();
  const {  car } = route.params as Params;

  const theme = useTheme();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value= event.contentOffset.y;
  });

  const headerStyleAnimation= useAnimatedStyle(()=>{
    return{
      height: interpolate(
        scrollY.value,
        [0,200],
        [200,70],
        Extrapolate.CLAMP
        ),
    }

  });

  const sliderCarsStyleAnimation =  useAnimatedStyle(()=>{

    return{
      opacity: interpolate(
        scrollY.value,
        [0,150],
        [1,0],
        Extrapolate.CLAMP
      )
    }

  })

  function handleConfirmRental() {
    navigation.navigate('Scheduling', {car});

  }

  function handleBack() {
    navigation.goBack();

  }

   return(
            <Container>
               <StatusBar
                barStyle="dark-content"
                translucent
                backgroundColor="transparent"
                />
            <Animated.View 
            style={[headerStyleAnimation, 
              styles.header,
              {backgroundColor: theme.colors.background_secondary}
            
            ]}
            >
              <Header>
              <BackButton 
              onPress={handleBack} />

              </Header>

                <Animated.View style={sliderCarsStyleAnimation}>
                  <CarImages>
                  <ImageSlider 
                  imageUrl={car.photos}/>
                  </CarImages>
                </Animated.View>
                
            </Animated.View>

                <Animated.ScrollView 
                 contentContainerStyle={{
                  padding: 24,
                  paddingTop: getStatusBarHeight()+160,
                  
                }}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                
                > 
                    <Details>
                      <Description>
                        <Brand>{ car.brand }</Brand>
                        <Name>{ car.name }</Name>
                      </Description>
                      
                      <Rent>

                        <Period> { car.period } </Period>
                        <Price>R$ { car.price }</Price>
                      </Rent>
                      
                    </Details>

                    <Accessories>
                    {  car.accessories.map(accessory => (
                        <Accessory 
                        key={accessory.type}
                        name={accessory.name} 
                          // nao coloco em arrowfunction '()=>' porque a funcao nao vai aguardar clique, ou seja vai ser rederizado no inicio  
                          icon={getAccessoryIcons(accessory.type)}
                          
                          /> 

                      ))}
                          
                    </Accessories>
                   
                    <About> 
                      {car.about} 
                      {car.about} 
                      {car.about} 
                    
                    </About>

                </Animated.ScrollView>  
                <Footer>
                <Button 
                title="Escolher Periodo do Aluguel"
                onPress={handleConfirmRental}
                />
                  </Footer>  

            </Container>
   );
   }

   const styles = StyleSheet.create({
     header: {
      position: 'absolute',
      overflow: 'hidden',
      zIndex:1,
     },
   })