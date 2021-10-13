import React, { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import { 
   StatusBar,
   KeyboardAvoidingView,
   TouchableWithoutFeedback,
   Keyboard,
   Alert,
} from 'react-native';
import * as Yup from 'yup';

import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { database } from '../../database';

import theme from '../../styles/theme';
import { useAuth } from '../../hooks/auth'

import {
 Container, 
 Header,
 SubTitle,
 Title,
 Form,
 Footer,

} from './styles';

export function SignIn(){

   const [email, setEmail ] = useState('');
   const [password, setPassword ] = useState('');

   const navigation = useNavigation();
   const { signIn } = useAuth();

   async function handleSignIn(){
   try {
      const schema = Yup.object().shape({ 
         email: Yup.string()
         .required('E-Mail obrigatório.')
         .email('Digite um e-mail válido'),
         password: Yup.string()
         .required('A senha é obrigatória')

      });

      await schema.validate({email, password});
      // Alert.alert('Tudo Certo!');

      signIn({email, password});

   } catch (error) {

      if(error instanceof Yup.ValidationError) {
         return Alert.alert('Opa', error.message);
      }
      else{
         Alert.alert('Error na autenticação', 
         'Ocorreu um erro ao fazer login, verifique suas credenciais');
      }
      
   }

   }

   function handleNewAccount(){

      navigation.navigate('SingUpFirstStep');

   }

   return(  
         <KeyboardAvoidingView behavior="position" enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
               <Container>
                  <StatusBar 
                  barStyle="dark-content"
                  backgroundColor="transparent"
                  translucent
                  />
                  <Header>

                     <Title> Estamos{'\n'}quase lá.</Title>
                     <SubTitle>Faça seu login para começar{'\n'}
                     uma nova experiência incrível.</SubTitle>
                  </Header>

                  <Form>
                  <Input
                  iconName="mail"
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={setEmail}
                  value={email}

                  />
                  <PasswordInput
                  iconName="lock"
                  placeholder="Senha"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setPassword}
                  value={password}               

                  />
                  </Form>

                  <Footer>
                     <Button
                     title="Login"
                     onPress={handleSignIn}
                     enabled={true}
                     loading={false}
                     />

                     <Button
                     title="Criar conta gratuita"
                     color= {theme.colors.background_secondary}
                     light
                     onPress={handleNewAccount}
                     enabled={true}
                     loading={false}
                     />
                  </Footer>

               </Container>
            </TouchableWithoutFeedback>
         </KeyboardAvoidingView>
   );
}