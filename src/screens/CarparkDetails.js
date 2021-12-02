import React from "react";
import {
    VStack,
    HStack,
    Text,
    Box,
    Button,
    IconButton,
    Icon,
    FlatList,
    Spacer,
    ScrollView,
} from "native-base";
import apiFilter from '../controls/APIFilterController';
import axios from 'axios';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { MaterialIcons } from '@expo/vector-icons';
import { Linking, SafeAreaView} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, } from 'react-native-maps'


export default function CarparkDetails({ navigation, route }) {

    const [isExpanded, setExpanded] = React.useState(false);

    const [mapRegion, setmapRegion] = React.useState({
        latitude: parseFloat(route.params.item.location.coordinates[1]),
        longitude: parseFloat(route.params.item.location.coordinates[0]),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const onToggleExpanded = () => {
        setExpanded(previousState => !previousState);
    }

    const redirectGoogle = () => {
        console.log("Redirecting");
        console.log('https://www.google.com/maps/dir/?api=1&travelmode=driving&destination='
            + route.params.item.location.coordinates[1]
            + "%2C" + route.params.item.location.coordinates[0]);

        Linking.openURL('https://www.google.com/maps/dir/?api=1&travelmode=driving&destination='
            + route.params.item.address);
    }

    function calculateTotalLots(lots) {
        let length = lots.length;
        let total = 0;
        for (let i = 0; i < length; i++) {
            total += parseInt(lots[i].lots_available);
        }
        return total;
    }

    function displayParkingRates(over_night, free_parking, car_park_no){

        let isFree = (free_parking != "NO"); //if true, carpark contains free parking timings
        let isOvernight = (over_night == "YES"); //if true, carpark overnight caps at $5
        let carparksInCentral = ["ACB", "BBB", "BRB1", "CY", "DUXM", "HLM", 
        "KAB", "KAM", "KAS", "PRM", "SLS", "SR1", "SR2", "TPM", "UCS", "WCB"];

        let isCentral = (carparksInCentral.includes(car_park_no)); //if true, carpark in central area (double rate)
        
        return(
                <VStack space={8} >
                    {isCentral ? <>
                        <Text textAlign="center" bold>Monday - Saturday (7AM-5PM):</Text>
                        <Text textAlign="center">$1.20 PER HALF HR</Text>
                        <Text/>
                        <Text textAlign="center" bold>Other Timings:</Text>
                        <Text textAlign="center">$0.60 PER HALF HR</Text>
                        </>
                        : <>
                        <Text textAlign="center" bold>Monday - Sunday:</Text>
                        <Text textAlign="center">$0.60 PER HALF HR</Text>
                        </>}
                    {isFree ? <>
                        <Text textAlign="center" bold>Free Parking Available:</Text>
                        <Text textAlign="center">{free_parking}</Text>
                        </>
                        : <>
                        <Text textAlign="center" bold>No Free Parking</Text>
                        </>}
                    {isOvernight ? <>
                        <Text textAlign="center" bold>Night Parking Scheme Available:</Text>
                        <Text>CAPPED AT $5 FR 10:30PM-7AM NEXT DAY</Text>
                        </>
                        : <>
                        <Text textAlign="center" bold>No Night Parking Scheme</Text>
                        </>}
                </VStack>
                
            );

    }

    return (
        <ScrollView
            _contentContainerStyle={{
                px: "20px",
                mb: "4",
                paddingBottom: 330
            }}
        >
            <VStack space={6} >
                <Text textAlign="center"
                    bold
                    fontSize="xl">{route.params.item.address}</Text>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ alignSelf: 'stretch', height: '25%' }}
                    region={mapRegion}
                >
                    <Marker
                        coordinate={mapRegion}
                    />
                </MapView>
                <HStack space={2} justifyContent="space-between">
                    <Text textAlign="left"
                        fontSize="md">{route.params.dist + "km from Location"}</Text>
                    <HStack space={2} justifyContent="space-between">
                        <Text textAlign="right"
                        bold
                        fontSize="md">Lots Available:</Text>
                        <Text textAlign="right"
                        color="success.600"
                        fontSize="lg">{calculateTotalLots(route.params.item.car_park_lot)}</Text>
                    </HStack>
                </HStack>
                <Box
                    bg="trueGray.300"
                    p="5"
                    rounded="xl"
                >
                    <Text textAlign="center"
                        bold
                        fontSize="md">{"Car Park Type:"}</Text>
                    <Text textAlign="center">{route.params.item.car_park_type}</Text>
                    <Text/>
                    <Text textAlign="center"
                        bold
                        fontSize="md">{"Payment Type:"}</Text>
                    <Text textAlign="center">{route.params.item.type_of_parking_system}</Text>
                    <Text/>
                    <Text textAlign="center"
                        bold
                        fontSize="md">{"Overnight Parking:"}</Text>
                    <Text textAlign="center">{route.params.item.night_parking}</Text>
                </Box>
                <Box
                    bg="trueGray.300"
                    p="5"
                    rounded="xl"
                >
                    <HStack space={3} justifyContent="space-between">
                        <Box
                            bg="trueGray.300"
                            p="5"
                            rounded="xl" />
                        <Text textAlign="center" 
                            bold
                            fontSize="lg">Parking Rates</Text>
                        <IconButton
                            variant="ghost"
                            icon={<Icon size="md"
                                as={<MaterialIcons
                                    name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} />}
                                color="black" />}
                            onPress={onToggleExpanded}
                        />
                    </HStack>
                    {isExpanded ? <>
                        {displayParkingRates(route.params.item.night_parking,
                            route.params.item.free_parking,
                            route.params.item.car_park_no)}

                    </>
                        : <>
                        </>
                    }
                </Box>
                <Box
                    bg="trueGray.300"
                    p="4"
                    rounded="xl"
                >
                    <Text textAlign="center" 
                        bold
                        fontSize="lg">Parking Cost</Text>
                    <Text textAlign="center" 
                        bold
                        fontSize="5xl"
                        color="success.600"
                        _dark={{
                            color: "success.200",
                        }}>{"$" + route.params.rate}</Text>
                </Box>
                <Button onPress={redirectGoogle}>Directions on Google Maps</Button>
            </VStack>
        </ScrollView>
    )
}