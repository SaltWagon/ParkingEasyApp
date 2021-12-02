import React from "react";
import {
    VStack,
    HStack,
    Text,
    Box,
    FlatList,
    Spacer,
    Modal,
    Button,
    Spinner,
    useToast,
} from "native-base";
import apiFilter from '../controls/APIFilterController';
import axios from 'axios';
import FilterComponent from "./FilterOverlay";
import PHChecker from '../controls/PHController';
import { AntDesign } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, selectFilters } from '../store/reducer';
import { TouchableOpacity } from "react-native";

export default function SearchResult({ navigation, route }) {

    // Redux stuffs
    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);

    // Ref for filter page
    const ref = React.useRef();

    // Save the filter
    const [filter, setFilter] = React.useState('');

    // Show/Hide filter page
    const [showFilter, setShowFilter] = React.useState(false);

    // Variable to save carpark info
    const [carparkInfo, setCarparkInfo] = React.useState('');

    // Variable to hide/show loading spinner
    const [showSpinner, setShowSpinner] = React.useState(true);

    // Variable to use for toast
    const toast = useToast();

    const [rateSaver, setRateSaver] = React.useState([]);

    function checkAlreadyCalculated(startTime, endTime, startDate, endDate, freeParking, nightParkingScheme, isCentral) {
        let check = rateSaver.filter(item => item.isCentral === isCentral && item.nightParkingScheme === nightParkingScheme && item.freeParking === freeParking && item.startTime == startTime && item.endTime == endTime && item.startDate == startDate && item.endDate == endDate);
        return check;
    }

    // Function for calculation of carpark rate
    function calculateCarparkRate(paymentType, startTime, endTime, startDate, endDate, carparkNo, freeParking, nightParkingScheme) {

        const carparksInCentral = ["ACB", "BBB", "BRB1", "CY", "DUXM", "HLM", "KAB", "KAM", "KAS", "PRM", "SLS", "SR1", "SR2", "TPM", "UCS", "WCB"];

        // Collection of variables
        let totalCost, isCentral, minutesObject
        let dateTimeStart = new Date(startDate + " " + startTime);
        let dateTimeEnd = new Date(endDate + " " + endTime);
        let costMinutesChargeableDouble, costMinutesChargeableNormal, costMinutesWithFreeParking, costMinutesWithNPS;

        isCentral = carparksInCentral.includes(carparkNo);

        let check = checkAlreadyCalculated(startTime, endTime, startDate, endDate, freeParking, nightParkingScheme, isCentral);
        if (check.length != 0) {
            return check[0].carparkRate;
        }
        else {
            minutesObject = calculateMinutes(dateTimeStart, dateTimeEnd, freeParking, nightParkingScheme, isCentral)
            console.log("minutesChargeableDouble: " + minutesObject.minutesChargeableDouble);
            console.log("minutesChargeableNormal: " + minutesObject.minutesChargeableNormal);
            console.log("minutesWithFreeParking: " + minutesObject.minutesWithFreeParking);
            console.log("minutesWithNPS: " + minutesObject.minutesWithNPS);
            console.log("\n");

            // cost calculation
            costMinutesChargeableDouble = minutesObject.minutesChargeableDouble * 0.04;
            costMinutesChargeableNormal = minutesObject.minutesChargeableNormal * 0.02;
            costMinutesWithFreeParking = 0;
            costMinutesWithNPS = minutesObject.minutesWithNPS * 0.02
            if (costMinutesWithNPS > 5) {
                costMinutesWithNPS = 5;
            }

            totalCost = costMinutesChargeableDouble + costMinutesChargeableNormal + costMinutesWithFreeParking + costMinutesWithNPS;

            let calculated = {
                carparkRate: totalCost.toFixed(2),
                freeParking: freeParking,
                nightParkingScheme: nightParkingScheme,
                isCentral: isCentral,
                startTime: startTime,
                endTime: endTime,
                startDate: startDate,
                endDate: endDate,
            }
            rateSaver.push(calculated);

            return totalCost.toFixed(2);
        }
    }

    function calculateMinutes(dateTimeStart, dateTimeEnd, freeParking, nightParking, isCentral) {
        let totalMinutes = 0;
        let minutesWithNPS = 0;
        let minutesWithFreeParking = 0;
        let minutesChargeableNormal = 0;
        let minutesChargeableDouble = 0;
        let dd, mm, yyyy, sliderDate;

        let dateTimeSlider = dateTimeStart;

        // Calculate total minutes between start and end
        totalMinutes = Math.floor(calculateTimeDifference(dateTimeStart, dateTimeEnd) / 60);

        // Loop through the minutes
        for (let i = 0; i < totalMinutes; i++) {
            dd = dateTimeSlider.getDate();
            mm = dateTimeSlider.getMonth() + 1;
            yyyy = dateTimeSlider.getFullYear();
            sliderDate = mm + '/' + dd + '/' + yyyy;

            if (nightParking == "YES" &&
                dateTimeSlider >= new Date(sliderDate + " 22:30") && dateTimeSlider <= new Date(sliderDate + " 23:59") ||
                dateTimeSlider >= new Date(sliderDate + " 00:00") && dateTimeSlider <= new Date(sliderDate + " 07:00")) {
                minutesWithNPS++;
                dateTimeSlider = addMinutesToDate(dateTimeSlider, 1);
                continue;
            }

            if (freeParking != "NO" && dateTimeSlider.getDay() == 0 || PHChecker.checkPH(dateTimeSlider)) {
                if (freeParking == "SUN & PH FR 7AM-10.30PM") {
                    if (dateTimeSlider >= new Date(sliderDate + " 07:00") && dateTimeSlider <= new Date(sliderDate + " 22:30")) {
                        minutesWithFreeParking++;
                        dateTimeSlider = addMinutesToDate(dateTimeSlider, 1);
                        continue;
                    }
                }
                else if (freeParking == "SUN & PH FR 1PM-10.30PM") {
                    if (dateTimeSlider >= new Date(sliderDate + " 13:00") && dateTimeSlider <= new Date(sliderDate + " 22:30")) {
                        minutesWithFreeParking++;
                        dateTimeSlider = addMinutesToDate(dateTimeSlider, 1);
                        continue;
                    }
                }
            }

            if (isCentral &&
                freeParking == "NO" &&
                dateTimeSlider.getDay() != 0 &&
                dateTimeSlider >= new Date(sliderDate + " 07:00") && dateTimeSlider <= new Date(sliderDate + " 17:00")) {
                minutesChargeableDouble++;
                dateTimeSlider = addMinutesToDate(dateTimeSlider, 1);
                continue;
            }
        }
        minutesChargeableNormal = totalMinutes - minutesChargeableDouble - minutesWithFreeParking - minutesWithNPS

        return {
            minutesChargeableNormal,
            minutesChargeableDouble,
            minutesWithFreeParking,
            minutesWithNPS
        }
    }

    function addDaysToDate(date, days) {
        let newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }

    function addHoursToDate(date, hours) {
        let newDate = new Date(date);
        newDate.setHours(newDate.getHours() + hours);
        return newDate;
    }

    function addMinutesToDate(date, minutes) {
        let newDate = new Date(date);
        newDate.setMinutes(newDate.getMinutes() + minutes);
        return newDate;
    }

    function subtractDaysToDate(date, days) {
        let newDate = new Date(date);
        newDate.setDate(newDate.getDate() - days);
        return newDate;
    }

    function calculateTimeDifference(startTime, endTime) {
        let timeDifference = (endTime - startTime) / 1000;
        if (timeDifference < 0) {
            timeDifference += 86400;
        }
        return timeDifference;
    }

    // Function to add up all the carpark lots in an array
    function calculateTotalLots(lots) {
        let length = lots.length;
        let total = 0;
        for (let i = 0; i < length; i++) {
            total += parseInt(lots[i].lots_available);
        }
        return total;
    }

    // Function to calculate distance from entered address to carpark
    function calculateDistance(lon1, lat1, lon2, lat2) {
        let p = 0.017453292519943295;    // Math.PI / 180
        let c = Math.cos;
        let a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;

        let dist = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        return dist.toFixed(2);
    }

    // Function to call SaltWagonAPI to get carpark info
    // http://172.21.148.170:3000/ is the school server
    function getCarparkInfo(long, lat, dist, carparkType, paymentType) {
        var config = {
            method: 'get',
            //url: 'http://172.21.148.170:3000/api/findMultiple?tableName=hdbCarparkLotsInformation&filter=' + apiFilter.searchByDistCTypePType(long, lat, dist, carparkType, paymentType),
            url: 'https://saltwagonapi.herokuapp.com/api/findMultiple?tableName=hdbCarparkLotsInformation&filter=' + apiFilter.searchByDistCTypePType(long, lat, dist, carparkType, paymentType),
            headers: {}
        };
        axios(config)
            .then(async function (response) {
                if (response.data.length > 0) {
                    setCarparkInfo(response.data);
                    setShowSpinner(false);
                }
                else {
                    setShowSpinner(false);
                    toast.show({
                        description: "No carpark found!",
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // Add filter button to header
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <AntDesign name="filter" size={24} color="white" onPress={() => setShowFilter(true)} style={{ padding: 10 }} />
            ),
        });
    }, [navigation]);

    // Get carpark info at page load
    React.useEffect(() => {
        setFilter(filters);
        getCarparkInfo(filters.long, filters.lat, filters.distance, filters.carparkType, filters.paymentType);
    }, []);

    // Function to apply filters
    const applyChangesButton = () => {
        let filter = ref.current?.sendFilter();
        setShowFilter(false);
        setShowSpinner(true);
        setFilter(filter);
        getCarparkInfo(filter.long, filter.lat, filter.distance, filter.carparkType, filter.paymentType);
    }

    const pressItem = (item) => {
        navigation.navigate("Carpark Details", item);
    };

    // Use for FlatList
    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => pressItem({
                item: item,
                dist: calculateDistance(filter.long, filter.lat, item.location.coordinates[0], item.location.coordinates[1]),
                rate: calculateCarparkRate(filter.paymentType, filter.startTime, filter.endTime,
                    filter.startDate, filter.endDate, item.car_park_no, item.free_parking, item.night_parking)
            })}
        >
            <Box
                borderBottomWidth="1"
                _dark={{
                    borderColor: "gray.600",
                }}
                borderColor="coolGray.200"
                pl="4"
                pr="5"
                py="2"
            >
                <Text
                    _dark={{
                        color: "warmGray.50",
                    }}
                    color="coolGray.800"
                    bold
                >
                    {item.address}
                </Text>

                <Text
                    color="coolGray.600"
                    _dark={{
                        color: "warmGray.200",
                    }}
                    textAlign="right"
                >
                    {calculateDistance(filter.long, filter.lat, item.location.coordinates[0], item.location.coordinates[1])}km
                </Text>

                {filter.showRates ? <>
                    <HStack space={2} justifyContent="space-between">

                        <Text textAlign="left" bold>Cost:
                            <Text
                                color="coolGray.600"
                                _dark={{
                                    color: "warmGray.200",
                                }}
                                textAlign="left"
                                fontSize="lg"
                            >
                                {' $' + calculateCarparkRate(filter.paymentType, filter.startTime, filter.endTime, filter.startDate, filter.endDate, item.car_park_no, item.free_parking, item.night_parking)} </Text>
                        </Text>

                        <HStack space={2} justifyContent="space-between">
                            <Text textAlign="right" bold>Lots Available:
                                <Text
                                    color="success.600"
                                    _dark={{
                                        color: "success.200",
                                    }}
                                    textAlign="right"
                                    fontSize="lg"
                                >
                                    {' ' + calculateTotalLots(item.car_park_lot)} </Text>
                            </Text>
                        </HStack>

                    </HStack>
                </>
                    : <>
                        <Text textAlign="right" bold>Lots Available:
                            <Text
                                color="success.600"
                                _dark={{
                                    color: "success.200",
                                }}
                                textAlign="right"
                                fontSize="lg"
                            >
                                {' ' + calculateTotalLots(item.car_park_lot)} </Text>
                        </Text>
                    </>}
            </Box>
        </TouchableOpacity>
    )

    return (
        <>
            <Modal isOpen={showFilter} onClose={() => setShowFilter(false)} size="full">
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header alignItems="center">Search Option</Modal.Header>
                    <Modal.Body>
                        <FilterComponent
                            ref={ref}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onPress={applyChangesButton}>Apply Changes</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {showSpinner ? <Spinner size="lg" /> : <></>}
            <FlatList
                flex="0.5"
                data={carparkInfo}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
            />
        </>
    );
}