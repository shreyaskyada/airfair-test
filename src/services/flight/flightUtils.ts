interface Segment {
    Cabin: string;
    Carrier: string;
    DepartureDate: string;
    Origin: string;
    Destination: string;
    BookingCode: string;
}

interface TripDetails {
    PointOfSaleCountry: string;
    UserCurrency: string;
    DisplayedPrice: string;
    DisplayedPriceCurrency: string;
    ReferralId: string;
    TripType: string;
}

interface ItineraryRequest {
    TripDetails: TripDetails;
    Segments: Segment[];
}

export function mergeToRoundTrip(onwardURI: any, returnURI: any): string {
    if (onwardURI.includes("cleartrip")) {
        // Handle cleartrip URL
        return handleCleartripURL(onwardURI, returnURI);
    } else {
        // Handle other URLs
        return handleEaseMyTrip(onwardURI, returnURI);
    }
}

function handleEaseMyTrip(onwardJourney: any, returnJourney: any): string {
    const onwardParams = new URLSearchParams(onwardJourney.split("?")[1]);
    const returnParams = new URLSearchParams(returnJourney.split("?")[1]);
    const segments: any = {};
    const slices1: number[] = [];
    const slices2: number[] = [];
    let segmentIndex = 1;
    let globalIndex = 1;
    if (onwardParams.has("Origin2")) {
        return onwardJourney;
    }
    while (onwardParams.has(`Segment${globalIndex}`)) {
        const segmentString = onwardParams.get(`Segment${globalIndex}`);
        segments[`Segment${segmentIndex}`] = segmentString;
        slices1.push(segmentIndex);
        segmentIndex++;
        globalIndex++;
    }

    globalIndex = 1;

    let originFirstSegment: string | null = null;
    let departureTimeFirstSegment: string | null = null;
    let destinationLastSegment: string | null = null;

    // Iterate through segments
    while (returnParams.has(`Segment${globalIndex}`)) {
        const segmentString: string = returnParams.get(
            `Segment${globalIndex}`
        )!;
        const segmentParams: string[] = segmentString.split(",");

        // Fetch Origin and DepartureTime from the first segment
        if (globalIndex === 1) {
            originFirstSegment =
                segmentParams
                    .find((param) => param.includes("Origin="))
                    ?.split("=")[1] || null;
            departureTimeFirstSegment =
                segmentParams
                    .find((param) => param.includes("DepartureDate="))
                    ?.split("=")[1] || null;
        }

        // Fetch Destination from the last segment
        if (!returnParams.has(`Segment${globalIndex + 1}`)) {
            destinationLastSegment =
                segmentParams
                    .find((param) => param.includes("Destination="))
                    ?.split("=")[1] || null;
        }
        segments[`Segment${segmentIndex}`] = segmentString;
        slices2.push(segmentIndex);
        segmentIndex++;
        globalIndex++;
    }
    let departureDateFirstSegment: string | null = null;
    if (departureTimeFirstSegment) {
        departureDateFirstSegment = departureTimeFirstSegment.split("T")[0];
    }
    const onwardParamsObj: any = {};
    onwardParams.forEach((value, key) => {
        onwardParamsObj[key] = value;
    });

    // Extract relevant parameters for return journey
    const returnParamsObj: any = {};
    returnParams.forEach((value, key) => {
        returnParamsObj[key] = value;
    });

    const roundTripParams: any = {
        Adult: onwardParamsObj.Adult,
        Child: onwardParamsObj.Child,
        Infant: onwardParamsObj.Infant,
        ReferralId: onwardParamsObj.ReferralId,
        UserLanguage: onwardParamsObj.UserLanguage,
        DisplayedPriceCurrency: onwardParamsObj.DisplayedPriceCurrency,
        UserCurrency: onwardParamsObj.UserCurrency,
        DisplayedPrice: onwardParamsObj.DisplayedPrice,
        PointOfSaleCountry: onwardParamsObj.PointOfSaleCountry,
        TripType: "RoundTrip",
        Origin1: onwardParamsObj.Origin1,
        Destination1: onwardParamsObj.Destination1,
        DepartureDate1: onwardParamsObj.DepartureDate1,
        Cabin1: onwardParamsObj.Cabin1,
        BookingCode1: onwardParamsObj.BookingCode1,
        FlightNumber1: onwardParamsObj.FlightNumber1,
        Origin2: originFirstSegment,
        Destination2: destinationLastSegment,
        DepartureDate2: departureDateFirstSegment,
        Cabin2: returnParamsObj.Cabin1,
        BookingCode2: returnParamsObj.BookingCode1,
        FlightNumber2: returnParamsObj.FlightNumber1,
        cc: "",
        Slice1: slices1.join(","),
        Slice2: slices2.join(","),
    };

    Object.entries(segments).forEach(([key, value]) => {
        roundTripParams[key] = value;
    });

    // Construct round trip URI
    const roundTripURI =
        "https://flight.easemytrip.com/RemoteSearchHandlers/index?" +
        new URLSearchParams(roundTripParams).toString();

    return roundTripURI;
}

function handleCleartripURL(onwardURI: any, returnURI: any): string {
    if (onwardURI.includes("cleartrip")) {
        // Parse URIs to extract parameters
        const parseURI = (uri: string) =>
            new URLSearchParams(uri.split("?")[1]);
        const onwardParams = parseURI(onwardURI);
        const returnParams = parseURI(returnURI);

        // Extract relevant parameters for onward journey
        const onwardParamsObj: { [key: string]: string } = {};
        onwardParams.forEach((value, key) => {
            onwardParamsObj[key] = value;
        });

        // Extract relevant parameters for return journey
        const returnParamsObj: { [key: string]: string } = {};
        returnParams.forEach((value, key) => {
            returnParamsObj[key] = value;
        });
        // Construct round trip parameters
        if (onwardParamsObj.intl == null) {
            const roundTripParams: { [key: string]: string } = {
                from: onwardParamsObj.from,
                to: onwardParamsObj.to,
                depart_date: onwardParamsObj.depart_date,
                return_date: returnParamsObj.depart_date,
                adults: onwardParamsObj.adults,
                childs: onwardParamsObj.childs,
                infants: onwardParamsObj.infants,
                class: onwardParamsObj.class,
                psid: onwardParamsObj.psid,
                out_price: onwardParamsObj.out_price,
                out_fare_key: onwardParamsObj.out_fare_key,
                ret_price: returnParamsObj.out_price,
                ret_fare_key: returnParamsObj.out_fare_key,
                uid: onwardParamsObj.uid,
            };

            // Construct round trip URI
            let paramsString = "";
            for (const [key, value] of Object.entries(roundTripParams)) {
                // Check if it's the first parameter to avoid adding an '&' at the start
                if (paramsString.length > 0) {
                    paramsString += "&";
                }
                paramsString += key + "=" + value;
            }

    const roundTripURI = "https://www.cleartrip.com/flights/initiate-booking?" + paramsString;

    return roundTripURI;
        } else {
            onwardURI =
                onwardURI + "&return_date=" + returnParamsObj.depart_date;
            return onwardURI;
        }
    } else {
        return onwardURI; // Return original URI if it doesn't contain 'cleartrip'
    }
}
