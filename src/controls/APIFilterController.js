exports.searchByCoor = function (long, lat) {
    let filter = {
        location:
        {
            type: 'Point',
            coordinates: [long, lat]
        }
    }
    return JSON.stringify(filter);
}

// This will just return everything in the database
exports.searchByCoorNear = function (long, lat) {
    let filter = {
        location:
        {
            $near:
            {
                $geometry:
                {
                    type: 'Point',
                    coordinates: [long, lat]
                }
            }
        }
    }
    return JSON.stringify(filter);
}

// Distance in metres 
exports.searchByDist = function (long, lat, dist) {
    let filter = {
        location:
        {
            $near:
            {
                $maxDistance: dist,
                $geometry:
                {
                    type: 'Point',
                    coordinates: [long, lat]
                }
            }
        }
    }
    return JSON.stringify(filter);
}

exports.searchByDistAndCType = function (long, lat, dist, carparkType) {
    let filter = {
        location:
        {
            $near:
            {
                $maxDistance: dist,
                $geometry:
                {
                    type: 'Point',
                    coordinates: [long, lat]
                }
            }
        },
        car_park_type: carparkType
    }
    return JSON.stringify(filter);
}

exports.searchByDistPType = function (long, lat, dist, paymentType) {
    let filter = {
        location:
        {
            $near:
            {
                $maxDistance: dist,
                $geometry:
                {
                    type: 'Point',
                    coordinates: [long, lat]
                }
            }
        },
        type_of_parking_system: paymentType
    }
    return JSON.stringify(filter);
}

exports.searchByDistCTypePType = function (long, lat, dist, carparkType, paymentType) {
    let filter = {
        location:
        {
            $near:
            {
                $maxDistance: dist,
                $geometry:
                {
                    type: 'Point',
                    coordinates: [long, lat]
                }
            }
        },
        car_park_type: carparkType,
        type_of_parking_system: paymentType
    }
    return JSON.stringify(filter);
}

exports.searchByDistCTypePTypeNPark = function (long, lat, dist, carparkType, paymentType, nightParking) {
    let filter;

    if (nightParking) {
        filter = {
            location:
            {
                $near:
                {
                    $maxDistance: dist,
                    $geometry:
                    {
                        type: 'Point',
                        coordinates: [long, lat]
                    }
                }
            },
            car_park_type: carparkType,
            type_of_parking_system: paymentType,
            night_parking: "YES"
        }
    }
    else{
        filter = {
            location:
            {
                $near:
                {
                    $maxDistance: dist,
                    $geometry:
                    {
                        type: 'Point',
                        coordinates: [long, lat]
                    }
                }
            },
            car_park_type: carparkType,
            type_of_parking_system: paymentType,
        }
    }
    return JSON.stringify(filter);
}


exports.searchByCNo = function (carparkNo) {
    let filter = {
        car_park_no: carparkNo
    }
    return JSON.stringify(filter);
}