import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Platform, RefreshControl } from 'react-native';
import BarberItem from '../../components/BarberItem';

import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import Api from '../../Api';

import {
    Container,
    Scroller,

    HeaderArea,
    HeaderTitle,
    SearchButton,
    
    LocationArea,
    LocationInput,
    LocationFinder,

    LoadingIcon,
    ListArea,
} from './styles';

import SearchIcon from '../../assets/search.svg';
import MyLocationIcon from '../../assets/my_location.svg';


export default () => {

    const navigation = useNavigation();

    const [locationText, setLocationText] = useState('');
    const [coord, setCoords] = useState(null);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);


    const handleLocationFinder = async () =>{
        setCoords(null);
        let result = await request(
            Platform.OS === 'ios' ?
                PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                :
                PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        );

        if(result === 'granted'){
            setLocationText('');
            setList([]);

            Geolocation.getCurrentPosition((info)=>{
                setCoords(info.coords);
                getBarbers();
            });
        }
    }

    const getBarbers = async () => {
        setLoading(true);
        setList([]);
    
        let lat = null;
        let lng = null;

        if(coord){
            lat = coord.latitude;
            lng = coord.longitude;
        }

        let res = await Api.getBarbers(lat, lng, locationText);

        if(res.error == ''){
            if(res.loc){
                setLocationText(res.loc);
            }
            setList(res.data);
            setLoading(false);
        }
        else{
            alert("Error: "+res.error);
        }
    };

    useEffect(() => {
        getBarbers();
    }, []);

    const onRefresh = () => {
        getBarbers();
        setRefreshing(false);
    }

    const handleLocationSearch = () => {
        setCoords([]);
        getBarbers();
    }


    return (
        <Container>
            <Scroller refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <HeaderArea>
                    <HeaderTitle numberOfLines={2}>
                        Encontre o seu barbeiro favorito
                    </HeaderTitle>
                    <SearchButton onPress={()=>navigation.navigate('Search')}>
                        <SearchIcon width="26" height="26" fill="#FFF" />
                    </SearchButton>
                </HeaderArea>

                <LocationArea>
                    <LocationInput
                        placeholder="Onde você está ?"
                        placeholderTextColor="#FFF"
                        value={locationText}
                        onChange={t=>setLocationText(t)}
                        onEndEditing={handleLocationSearch}
                    />
                    <LocationFinder onPress={handleLocationFinder}>
                        <MyLocationIcon width="24" height="24" fill="#FFF" />
                    </LocationFinder>
                </LocationArea>
                {loading &&
                    <LoadingIcon size="large" color="#FFF" />
                }
                <ListArea>
                    {list.map((item, k) =>(
                        <BarberItem key={k} data={item} />
                    ))}
                </ListArea>
            </Scroller>
        </Container>
    );
}