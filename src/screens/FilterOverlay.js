import React from 'react'
import {
    VStack,
    HStack,
    Button,
    Text,
    Box,
    Slider,
    Switch,
    Select,
    CheckIcon,
    ScrollView
} from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, selectFilters } from '../store/reducer';

export default function FilterComponent(prop, ref) {

    // Redux stuff
    const dispatch = useDispatch();
    const filter = useSelector(selectFilters);

    // Saving the variable passed in
    const [saveState, setSaveState] = React.useState('');
    const [render, setRender] = React.useState(false);

    // Distance silder variable
    const [distance, setDistance] = React.useState(0.5);
    const [defaultValue, setDefaultValue] = React.useState(5);

    // Start DateTime variables
    const [startMode, setStartMode] = React.useState('date');
    const [startDate, setStartDate] = React.useState(new Date());
    const [startShow, setStartShow] = React.useState(false);
    const [startTimeString, setStartTimeString] = React.useState('');
    const [startDateString, setStartDateString] = React.useState('');

    // End DateTime variable
    const [endMode, setEndMode] = React.useState('date');
    const [endDate, setEndDate] = React.useState(new Date());
    const [endShow, setEndShow] = React.useState(false);
    const [endTimeString, setEndTimeString] = React.useState('');
    const [endDateString, setEndDateString] = React.useState('');
    const [endMinDate, setEndMinDate] = React.useState(new Date());
    const [maxDate, setMaxDate] = React.useState();

    // Carpark Type variable
    const [carparkType, setCarparkType] = React.useState('MULTI-STOREY CAR PARK');

    // Payment Type variable
    const [paymentType, setPaymentType] = React.useState('ELECTRONIC PARKING');

    // Rates Toggle variable
    const [showRates, setShowRates] = React.useState(true);

    // Calculate the differents betwseen start and end date
    function countDays(date1, date2) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    // Start DateTime Picker
    const startOnChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setStartShow(Platform.OS === 'ios');
        setStartDate(currentDate);
        saveStartTime(currentDate);
        saveStartDate(currentDate);
        if (currentDate > endDate) {
            let newEndDate = new Date(endDate.setDate(endDate.getDate() + countDays(currentDate, endDate)));
            if (newEndDate > maxDate) {
                setEndDate(maxDate);
                saveEndDate(maxDate);
                saveEndTime(maxDate);
                setEndMinDate(maxDate);
            }
            else {
                setEndDate(newEndDate);
                saveEndDate(newEndDate);
                setEndMinDate(newEndDate);
            }
        }
        else if (currentDate < endDate) {
            setEndMinDate(currentDate);
        }
    };

    function saveStartTime(date) {
        hours = ("0" + date.getHours()).slice(-2);
        mins = ("0" + date.getMinutes()).slice(-2);
        setStartTimeString(hours + ':' + mins);
    }

    function saveStartDate(date) {
        day = ("0" + date.getDate()).slice(-2);
        month = date.getMonth() + 1;
        month = ("0" + month).slice(-2);
        year = date.getFullYear();
        setStartDateString(year + '/' + month + '/' + day);
    }

    const showStartMode = (currentMode) => {
        setStartShow(true);
        setStartMode(currentMode);
    };

    const showStartDatepicker = () => {
        showStartMode('date');
    };

    const showStartTimepicker = () => {
        showStartMode('time');
    };

    // End DateTime Picker
    const endOnChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setEndShow(Platform.OS === 'ios');
        setEndDate(currentDate);
        saveEndTime(currentDate);
        saveEndDate(currentDate);
        if (currentDate.getTime() < startDate.getTime()) {
            let newEndDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
            if (newEndDate > maxDate) {
              setEndDate(maxDate);
              saveEndDate(maxDate);
              saveEndTime(maxDate);
              setEndMinDate(maxDate);
            }
            else {
              setEndDate(newEndDate);
              saveEndDate(newEndDate);
              setEndMinDate(newEndDate);
            }
          }
          else if (currentDate.getTime() > startDate.getTime() && currentDate > startDate) {
            setEndMinDate(startDate);
          }
    };

    function saveEndTime(date) {
        hours = ("0" + date.getHours()).slice(-2);
        mins = ("0" + date.getMinutes()).slice(-2);
        setEndTimeString(hours + ':' + mins);
    }

    function saveEndDate(date) {
        day = ("0" + date.getDate()).slice(-2);
        month = date.getMonth() + 1;
        month = ("0" + month).slice(-2);
        year = date.getFullYear();
        setEndDateString(year + '/' + month + '/' + day);
    }

    const showEndMode = (currentMode) => {
        setEndShow(true);
        setEndMode(currentMode);
    };

    const showEndDatepicker = () => {
        showEndMode('date');
    };

    const showEndTimepicker = () => {
        showEndMode('time');
    };

    // Function for distance slider
    const onChange = (v) => {
        setDistance(Math.floor(v) / 10)
    };

    // Rate Toggle Function
    const onToggleRate = () => {
        setShowRates(previousState => !previousState);
    }

    // Send the filter back
    const sendFilter = () => {
        let filter = {
            distance: (distance * 1000),
            startTime: startTimeString,
            endTime: endTimeString,
            startDate: startDateString,
            endDate: endDateString,
            carparkType: carparkType,
            paymentType: paymentType,
            showRates: showRates,
            long: saveState.long,
            lat: saveState.lat,
            currentLong: saveState.currentLong,
            currentLat: saveState.currentLat,
            startEpoch: startDate.valueOf(),
            endEpoch: endDate.valueOf(),
            endMinEpoch: endMinDate.valueOf(),
            maxDateEpoch: maxDate.valueOf(),
        }
        dispatch(setFilters(filter));
        return (filter);
    }

    // Forward Ref stuff
    React.useImperativeHandle(ref, () => ({ sendFilter }));

    // Set the filter
    React.useEffect(() => {
        if (filter) {
            setSaveState(filter);
            setDistance(filter.distance / 1000);
            setDefaultValue(filter.distance / 100);

            setStartDate(new Date(filter.startEpoch));
            setStartDateString(filter.startDate);
            setStartTimeString(filter.startTime);

            setEndDate(new Date(filter.endEpoch));
            setEndDateString(filter.endDate);
            setEndTimeString(filter.endTime);
            setEndMinDate(new Date(filter.endMinEpoch));

            setMaxDate(new Date(filter.maxDateEpoch));

            setCarparkType(filter.carparkType);

            setPaymentType(filter.paymentType);

            setShowRates(filter.showRates);

            setRender(true);
        }
    }, []);

    return (
        <>
            {render ? <VStack space={4} >
                <Box
                    bg="trueGray.300"
                    p="12"
                    rounded="xl"
                >
                    <VStack space={2} >
                        <Text textAlign="center">Max Distance</Text>
                        <Slider
                            defaultValue={defaultValue}
                            colorScheme="cyna"
                            size="lg"
                            onChange={onChange}
                        >
                            <Slider.Track>
                                <Slider.FilledTrack />
                            </Slider.Track>
                            <Slider.Thumb />
                        </Slider>
                        <Text textAlign="right">{distance}km</Text>
                    </VStack>
                </Box>

                <Box
                    bg="trueGray.300"
                    p="12"
                    rounded="xl"
                >
                    <VStack space={2} >
                        <Text textAlign="center">Planned Parking Duration</Text>

                        <Text textAlign="left">Start Date: </Text>
                        <Button onPress={showStartDatepicker}>{startDateString}</Button>
                        <Text textAlign="left">Start Time: </Text>
                        <Button onPress={showStartTimepicker}>{startTimeString}</Button>
                        {startShow && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={startDate}
                                mode={startMode}
                                is24Hour={true}
                                display="default"
                                onChange={startOnChange}
                                minimumDate={new Date()}
                                maximumDate={maxDate}
                            />
                        )}

                        <Text textAlign="left">End Date: </Text>
                        <Button onPress={showEndDatepicker}>{endDateString}</Button>
                        <Text textAlign="left">End Time: </Text>
                        <Button onPress={showEndTimepicker}>{endTimeString}</Button>
                        {endShow && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={endDate}
                                mode={endMode}
                                is24Hour={true}
                                display="default"
                                onChange={endOnChange}
                                minimumDate={endMinDate}
                                maximumDate={maxDate}
                            />
                        )}

                    </VStack>
                </Box>

                <Box
                    bg="trueGray.300"
                    p="12"
                    rounded="xl"
                >
                    <VStack space={2} >
                        <Text textAlign="center">Search Options</Text>
                        <HStack alignItems="center" space={4} justifyContent="space-between">
                            <Text textAlign="left">Carpark Type:   </Text>

                            <Select
                                selectedValue={carparkType}
                                defaultValue="Multi-Storey"
                                minWidth="180"
                                accessibilityLabel="Choose Car Park Type"
                                _selectedItem={{
                                    bg: "lightBlue.600",
                                    endIcon: <CheckIcon size="5" />,
                                }}
                                onValueChange={(itemValue) => setCarparkType(itemValue)}
                                align="right"
                            >
                                <Select.Item label="Multi-Storey" value="MULTI-STOREY CAR PARK" />
                                <Select.Item label="Surface" value="SURFACE CAR PARK" />
                                <Select.Item label="Basement" value="BASEMENT CAR PARK" />
                                <Select.Item label="Surface/Multi-Storey" value="SURFACE/MULTI-STOREY CAR PARK" />
                            </Select>

                        </HStack>

                        <HStack alignItems="center" space={4} justifyContent="space-between">
                            <Text textAlign="left">Payment Type: </Text>
                            <Select
                                selectedValue={paymentType}
                                defaultValue="Electronic"
                                minWidth="180"
                                accessibilityLabel="Choose Payment Type"
                                _selectedItem={{
                                    bg: "lightBlue.600",
                                    endIcon: <CheckIcon size="5" />,
                                }}
                                onValueChange={(itemValue) => setPaymentType(itemValue)}
                                align="right"
                            >
                                <Select.Item label="Electronic" value="ELECTRONIC PARKING" />
                                <Select.Item label="Coupon" value="COUPON PARKING" />
                            </Select>
                        </HStack>

                        <HStack alignItems="center" space={4} justifyContent="space-between">
                            <Text textAlign="left">Show Car Park Rates</Text>
                            <Switch defaultIsChecked={showRates} size="lg" align="right" onChange={onToggleRate} />
                        </HStack>

                    </VStack>
                </Box>
            </VStack> : <></>}
        </>
    );
}

FilterComponent = React.forwardRef(FilterComponent);