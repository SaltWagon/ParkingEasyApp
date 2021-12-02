import React from "react";
import {
  Input,
  VStack,
  HStack,
  Button,
  Text,
  Box,
  Slider,
  Switch,
  Select,
  CheckIcon,
  ScrollView,
  Spacer,
  useToast,
  ZStack,
  CloseIcon,
  usePropsResolution,
  Fab,
} from "native-base";
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Animated, Circle } from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { checkPH } from "../controls/PHController";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, selectFilters } from '../store/reducer';

const GOOGLE_PLACES_API_KEY = '[GOOGLE MAPS API KEY HERE]';

export default function Home({ navigation }) {

  // Variable to check if the screen is in focus
  const isFocused = useIsFocused();

  // Variable for the filter changes
  const filter = useSelector(selectFilters);
  const [filterChange, setFilterChange] = React.useState(false);
  const dispatch = useDispatch();

  // Variable for current GPS location
  const [currentLocation, setCurrentLocation] = React.useState({
    description: 'Current location',
    geometry:
    {
      location:
      {
        lat: '',
        lng: ''
      }
    },
  });

  // Variable to set where the map will show
  const [mapRegion, setmapRegion] = React.useState({
    latitude: 1.3473549,
    longitude: 103.6807647,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Ref for the search bar
  const ref = React.useRef();

  // Ref for the mapView
  const mapView = React.useRef();

  // Toast to show the pop up warning
  const toast = useToast()

  // Search Location variable
  const [locationDetail, setLocationDetail] = React.useState('');
  const [gps, setGPS] = React.useState(true);

  // Distance silder variable
  const [distance, setDistance] = React.useState(0.5)
  const [defaultValue, setDefaultValue] = React.useState(5);
  const [render, setRender] = React.useState(false);

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

  // Function for clear button
  const clearButton = () => {
    ref.current?.setAddressText('');
    setLocationDetail('');
    if (currentLocation.geometry.location.lat != '' && currentLocation.geometry.location.lng) {
      setmapRegion(
        {
          latitude: currentLocation.geometry.location.lat,
          longitude: currentLocation.geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
      );
      // mapView.current.animateToRegion({
      //   latitude: currentLocation.geometry.location.lat,
      //   longitude: currentLocation.geometry.location.lng,
      //   latitudeDelta: 0.0922,
      //   longitudeDelta: 0.0421,
      // }, 500);
      mapView.current.animateCamera({
        center: {
          latitude: currentLocation.geometry.location.lat,
          longitude: currentLocation.geometry.location.lng,
        },
        zoom: 12.18
      });
    }
  }

  // Function for location details
  const onPress = (data, details = null) => {
    if (details.description == 'Current location')
      getAddress({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng });
    setView({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng });
    setLocationDetail(details);
  }

  // Function for distance slider
  const onChange = (v) => {
    setDistance(Math.floor(v) / 10)
  };

  // Rate Toggle Function
  const onToggleRate = () => {
    setShowRates(previousState => !previousState);
  }

  // Function for search button
  const onClick = () => {
    if (locationDetail) {
      let send = {
        distance: (distance * 1000),
        startTime: startTimeString,
        endTime: endTimeString,
        startDate: startDateString,
        endDate: endDateString,
        carparkType: carparkType,
        paymentType: paymentType,
        showRates: showRates,
        long: locationDetail.geometry.location.lng,
        lat: locationDetail.geometry.location.lat,
        currentLong: currentLocation.geometry.location.lng,
        currentLat: currentLocation.geometry.location.lat,
        startEpoch: startDate.valueOf(),
        endEpoch: endDate.valueOf(),
        endMinEpoch: endMinDate.valueOf(),
        maxDateEpoch: maxDate.valueOf(),
      }
      dispatch(setFilters(send));
      setFilterChange(true);
      setRender(false);
      navigation.navigate('Search Result');
    }
    else {
      toast.show({
        title: "No location entered!",
        status: "warning",
        description: "Please enter a location",
      })
    }
  }

  // Calling ReverseGeocodeLocation to get address
  function getAddress(point) {
    var config = {
      method: 'get',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + point.latitude + ',' + point.longitude + '&key=' + GOOGLE_PLACES_API_KEY,
      headers: {}
    };

    axios(config)
      .then(async function (response) {
        ref.current?.setAddressText(response.data.results[0].formatted_address);
      })
      .catch(function (error) {
        console.log(error);
        ref.current?.setAddressText('');
      });
  }

  // Change the map region
  function setView(point) {
    setmapRegion(
      {
        latitude: point.latitude,
        longitude: point.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    )
    // mapView.current.animateToRegion({
    //   latitude: point.latitude,
    //   longitude: point.longitude,
    //   latitudeDelta: 0.01,
    //   longitudeDelta: 0.01,
    // }, 500);
    mapView.current.animateCamera({
      center: {
        latitude: point.latitude,
        longitude: point.longitude,
      },
      zoom: 15
    });
  }

  // Set the time and date at page load
  React.useEffect(() => {
    var date = new Date();
    saveStartTime(date);
    saveStartDate(date);
    saveEndTime(date);
    saveEndDate(date);
    date.setMonth(date.getMonth() + 1)
    date.setHours(23, 59, 59)
    setMaxDate(date);
    setRender(true);
  }, []);

  // Get GPS location at page load
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({}).then();

        setCurrentLocation({
          description: 'Current location',
          geometry:
          {
            location:
            {
              lat: location.coords.latitude,
              lng: location.coords.longitude
            }
          },
        });
        setmapRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
        );
        mapView.current.setCamera({
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          zoom: 12.18
        }, 0);
        mapView.current.setMapBoundaries({ latitude: 1.4504753, longitude: 104.0120359 }, { latitude: 1.2421084, longitude: 103.5822933 });
      }
      catch (e) {
        setGPS(false);
      }
    })();
  }, []);

  // Changing of the filter
  useFocusEffect(
    React.useCallback(() => {
      if (filterChange) {
        if (distance != filter.distance) {
          setDistance(filter.distance / 1000);
          setDefaultValue(filter.distance / 100);
        }

        setStartDate(new Date(filter.startEpoch));
        setStartDateString(filter.startDate);
        setStartTimeString(filter.startTime);

        setEndDate(new Date(filter.endEpoch));
        setEndDateString(filter.endDate);
        setEndTimeString(filter.endTime);
        setEndMinDate(new Date(filter.endMinEpoch))

        if (carparkType != filter.carparkType)
          setCarparkType(filter.carparkType);
        if (paymentType != filter.paymentType)
          setPaymentType(filter.paymentType);
        if (showRates != filter.showRates)
          setShowRates(filter.showRates);

        setFilterChange(false);
        setRender(true);
      }
    }, [filterChange, filter])
  );

  React.useEffect(() => {
    if (render) {
      mapView.current.setCamera({
        center: {
          latitude: filter.lat,
          longitude: filter.long,
        },
        zoom: 15
      }, 0);
    }
  }, [render]);

  return (<>
    < VStack space={2} >
      <Spacer />
      {gps ? <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Enter location"
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
          components: 'country:sg',
        }}
        onPress={onPress}
        onFail={(error) => console.error(error)}
        predefinedPlaces={[currentLocation]}
        textInputProps={{
          InputComp: Input,
          leftIcon: { type: 'font-awesome', name: 'chevron-left' },
          errorStyle: { color: 'red' },
          variant: "outline",
          mx: "3",
          w: { base: "70%", md: "25%", },
        }}
        fetchDetails
        styles={{
          container: {
            flex: 0
          },
        }}
        textInputProps={{
          clearButtonMode: 'never',
        }}
        renderRightButton={() => (
          <CloseIcon size="xs" mt="3"
            onPress={clearButton}
          />
        )}
      /> :
        <GooglePlacesAutocomplete
          ref={ref}
          placeholder="Enter location"
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
            components: 'country:sg',
          }}
          onPress={onPress}
          onFail={(error) => console.error(error)}
          textInputProps={{
            InputComp: Input,
            leftIcon: { type: 'font-awesome', name: 'chevron-left' },
            errorStyle: { color: 'red' },
            variant: "outline",
            mx: "3",
            w: { base: "70%", md: "25%", },
          }}
          fetchDetails
          styles={{
            container: {
              flex: 0
            },
          }}
          textInputProps={{
            clearButtonMode: 'never',
          }}
          renderRightButton={() => (
            <CloseIcon size="xs" mt="3"
              onPress={clearButton}
            />
          )}
        />}
      <Spacer />
    </VStack >

    {render ? <ScrollView
      _contentContainerStyle={{
        px: "12px",
        mb: "4",
        paddingBottom: 310
      }}
    >

      <VStack space={4} >
        <MapView
          ref={mapView}
          provider={PROVIDER_GOOGLE}
          style={{ alignSelf: 'stretch', height: '25%' }}
          maxZoomLevel={20}
          minZoomLevel={12.18}
        // region={mapRegion}
        >
          <Circle
            center={mapRegion}
            radius={distance * 1000}
            strokeColor={"#00CCFF"}
            fillColor={"#00CCFF50"}
          />
          <Marker
            draggable
            coordinate={mapRegion}
            onDragEnd={(e) => {
              setView(e.nativeEvent.coordinate);
              getAddress(e.nativeEvent.coordinate);
              setLocationDetail({
                geometry:
                {
                  location:
                  {
                    lat: e.nativeEvent.coordinate.latitude,
                    lng: e.nativeEvent.coordinate.longitude
                  }
                }
              });
            }}
          />
        </MapView>

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
        {/* <Button onPress={onClick}>Look for lots</Button> */}
        {isFocused ? <Fab sizes="xs"
          borderRadius="full"
          placement="bottom-right"
          label="Look for lots"
          onPress={onClick}
        /> : null}
      </VStack>
    </ScrollView> : <></>}
  </>
  );
}