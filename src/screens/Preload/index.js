import React, { useEffect } from 'react';
import { Container, LoadingIcon } from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

import BarberLogo from '../../assets/barber.svg';

import Api from '../../Api';

export default () => {

    const navigation = useNavigation();

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if(token){
                //validar token
                let res = await Api.checkToken(token);
                if(res.token){
                    await AsyncStorage.setItem('token', res.token);
                    navigation.reset({   
                        routes: [{name:'MainTab'}]
                });
                }else{
                    //Mandar pro login
                    navigation.reset({
                        routes: [{name:'SignIn'}]
                    });
                }
            }
            else{
                //Mandar pro login
                navigation.reset({
                    routes: [{name:'SignIn'}]
                });
            }
        }
        checkToken();
    }, []);

    return(
        <Container>
            <BarberLogo width="100%" height="160"></BarberLogo>
            <LoadingIcon size="large" color="#FFF"></LoadingIcon>
        </Container>
    )
}