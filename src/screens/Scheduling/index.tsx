import React, { useState } from 'react';
import {useTheme} from 'styled-components';

import { BackButton } from '../../components/BackButton';
import ArrowSvg from '../../assets/arrow.svg';
import { StatusBar } from 'react-native';
import { format } from 'date-fns';

import { Button } from '../../components/Button';
import { Calendar, DayProps, generateInterval, MarkedDateProps } from '../../components/Calendar';

import { useNavigation, useRoute } from '@react-navigation/native';

import { getPlataformDate } from '../../utils/getPlataformDate';
import { CarDTO } from '../../dtos/CarDTO';

import {
 Container, 
 Header,
 Title,
 RentalPeriod,
 DateInfo,
 DateTitle,
 DateValue,
 Content,
 Foorter,


} from './styles';

interface RentalPeriod {
// start: number;
startFormatted: string;
// end: number;
endFormatted: string;

};

interface Params { 
  car: CarDTO;
  
 };

export function Scheduling(){
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates, setMarkedDates ] = useState<MarkedDateProps>({} as MarkedDateProps);
  const [ rentalPeriod, setRentalPeriod ] = useState<RentalPeriod>({} as RentalPeriod);
  const theme = useTheme();

  const navigation = useNavigation();

  const route = useRoute();
  const {  car } = route.params as Params;

  function handleConfirmRental() {
  
    navigation.navigate('SchedulingDetails', { 
      car,
      dates: Object.keys(markedDates),

    });

  }

  function handleBack() {
    navigation.goBack();

  }

  function handleChangeDate(date: DayProps){
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if(start.timestamp > end.timestamp){
      start = end;
      end =start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);
    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length -1];

    setRentalPeriod({ 
   
      startFormatted: format(getPlataformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlataformDate(new Date(endDate)), 'dd/MM/yyyy'),

    })
  }

   return(
            <Container>
              <Header>
                <StatusBar
                barStyle="light-content"
                translucent
                backgroundColor="transparent"
                />
                <BackButton 
                onPress={handleBack}
                color={theme.colors.shape}
                />

                <Title>
                  Escolha uma{'\n'}
                  Data de in??cio e{'\n'}
                  fim do aluguel
                </Title>

                <RentalPeriod>
                  <DateInfo>
                    <DateTitle>DE</DateTitle>
                    {/* as duas !! transformam a string em uma verificacao de true false */}
                    <DateValue selected={!!rentalPeriod.startFormatted}> 
                      {rentalPeriod.startFormatted}</DateValue>
                  </DateInfo>

                  <ArrowSvg/>

                  <DateInfo>
                    <DateTitle>AT??</DateTitle>
                    <DateValue selected={!!rentalPeriod.endFormatted}>
                      {rentalPeriod.endFormatted}</DateValue>
                  </DateInfo>

                </RentalPeriod>
              </Header>

              <Content>
                <Calendar
                
                markedDates={markedDates}
                onDayPress={handleChangeDate}
                />

              </Content>
              <Foorter>
                <Button
                title= "Confirmar"
                onPress={handleConfirmRental}
                enabled={!!rentalPeriod.startFormatted}
                />
              </Foorter>

            </Container>
   );
}