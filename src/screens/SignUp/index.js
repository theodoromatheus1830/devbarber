import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../contexts/UserContext';
import AsyncStorage from '@react-native-community/async-storage';

import { 
    Container, 
    InputArea,
    CustomButton,
    CustomButtonText,
    SignMessageButton,
    SignMessageButtonText,
    SignMessageButtonTextBold
} from './styles';

import Api from '../../Api';

import SignInput from '../../components/SignInput';
import BarberLogo from '../../assets/barber.svg';
import PersonIcon from '../../assets/person.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';

export default () => {
    const { dispatch: userDispatch } = useContext(UserContext);

    const navigation = useNavigation();

    const [nameField, setNameField] = useState('');
    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');

    const handleMessageButtonClick = () => {
        navigation.navigate('SignIn');
    }

    const handleSignClick = async () => {
        if(nameField!='' && emailField != '' && passwordField != ''){
            let res = await Api.signUp(nameField, emailField, passwordField);
            if(res.token){
                await AsyncStorage.setItem('token', res.token);

                userDispatch({
                    type: 'setAvatar',
                    payload: res.data.avatar
                });

                navigation.reset({
                    routes: [{name:'MainTab'}]
                });
            }else{
                alert("Error: "+res.error);
            }
        }else{
            alert('Preencha os campos!');
        }
    }

    return(
        <Container>
            <BarberLogo width="100%" height="160"></BarberLogo>

            <InputArea>
            <SignInput 
                    IconSvg={PersonIcon}
                    placeholder="Name"
                    value={nameField}
                    onChangeText={t=>setNameField(t)}
                />
                <SignInput 
                    IconSvg={EmailIcon}
                    placeholder="Email"
                    value={emailField}
                    onChangeText={t=>setEmailField(t)}
                />
                <SignInput 
                    IconSvg={LockIcon}
                    placeholder="Senha"
                    value={passwordField}
                    onChangeText={t=>setPasswordField(t)}
                    password={true}
                />

                <CustomButton onPress={handleSignClick}>
                    <CustomButtonText>Cadastrar</CustomButtonText>
                </CustomButton>
            </InputArea>

            <SignMessageButton onPress={handleMessageButtonClick}>
                <SignMessageButtonText>Já possui uma conta ?</SignMessageButtonText>
                <SignMessageButtonTextBold> Faça o login </SignMessageButtonTextBold>
            </SignMessageButton>

        </Container>
    )
}