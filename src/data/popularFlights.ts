import {
  MUMBAI,
  DELHI,
  KOLKATA,
  CHANNAI,
  HYDERABAD,
  AHMADABAD,
  BANGALURU,
  PUNE,
  PATNA,
  COIMBATORE,
  KOCHI,
  GOA
} from "../assets/images/popularFlights"

export const popularFlightsData = [
  {
    departureFlightTitle: "Mumbai Flights",
    departureFlightCode: "BOM",
    departureFlightImage: MUMBAI,
    destinationFlights: [
      { flightTitle: "Goa", fligthCode: "GOI" },
      { flightTitle: "Delhi", fligthCode: "DEL" },
      { flightTitle: "Bangalore", fligthCode: "BLR" },
      { flightTitle: "Ahmedabad", fligthCode: "AMD" }
    ]
  },
  {
    departureFlightTitle: "Delhi Flights",
    departureFlightCode: "DEL",
    departureFlightImage: DELHI,
    destinationFlights: [
      { flightTitle: "Mumbai", fligthCode: "BOM" },
      { flightTitle: "Goa", fligthCode: "GOI" },
      { flightTitle: "Bangalore", fligthCode: "BLR" },
      { flightTitle: "Pune", fligthCode: "PNQ" }
    ]
  },
  {
    departureFlightCode: "CCU",
    departureFlightImage: KOLKATA,
    departureFlightTitle: "Kolkata Flights",
    destinationFlights: [
      { flightTitle: "Mumbai", fligthCode: "BOM" },
      { flightTitle: "Delhi", fligthCode: "DEL" },
      { flightTitle: "Bangalore", fligthCode: "BLR" },
      { flightTitle: "Bagdogra", fligthCode: "IXB" }
    ]
  },
  {
    departureFlightCode: "MMA",
    departureFlightImage: CHANNAI,
    departureFlightTitle: "Chennai Flights",
    destinationFlights: [
      { flightTitle: "Mumbai", fligthCode: "BOM" },
      { flightTitle: "Delhi", fligthCode: "DEL" },
      { flightTitle: "Madurai", fligthCode: "IXM" },
      { flightTitle: "Coimbatore", fligthCode: "CJB" }
    ]
  },
  {
    departureFlightCode: "HYD",
    departureFlightImage: HYDERABAD,
    departureFlightTitle: "Hyderabad Flights",
    destinationFlights: [
      { flightTitle: "Mumbai", fligthCode: "BOM" },
      { flightTitle: "Goa", fligthCode: "GOI" },
      { flightTitle: "Bangalore", fligthCode: "BLR" },
      { flightTitle: "Delhi", fligthCode: "DEL" }
    ]
  },
  {
    departureFlightCode: "AMD",
    departureFlightImage: AHMADABAD,
    departureFlightTitle: "Ahemdabad Flights",
    destinationFlights: [
      { flightTitle: "Mumbai", fligthCode: "BOM" },
      { flightTitle: "Delhi", fligthCode: "DEL" },
      { flightTitle: "Bangalore", fligthCode: "BLR" },
      { flightTitle: "Goa", fligthCode: "GOI" }
    ]
  },
  {
    departureFlightCode: "BLR",
    departureFlightImage: BANGALURU,
    departureFlightTitle: "Bangalore Flights",
    destinationFlights: [
      { flightTitle: "Mumbai", fligthCode: "BOM" },
      { flightTitle: "Delhi", fligthCode: "DEL" },
      { flightTitle: "Goa", fligthCode: "GOI" },
      { flightTitle: "Hyderabad", fligthCode: "HYD" }
    ]
  },
  {
    departureFlightCode: "PNQ",
    departureFlightImage: PUNE,
    departureFlightTitle: "Pune Flights",
    destinationFlights: [
      { flightTitle: "Goa", fligthCode: "GOI" },
      { flightTitle: "Delhi", fligthCode: "DEL" },
      { flightTitle: "Bangalore", fligthCode: "BLR" },
      { flightTitle: "Nagpur", fligthCode: "NAG" }
    ]
  },
  {
    departureFlightCode: "PAT",
    departureFlightImage: PATNA,
    departureFlightTitle: "Patna Flights",
    destinationFlights: [
      { flightTitle: "Delhi", fligthCode: "DEL" },
      { flightTitle: "Bangalore", fligthCode: "BLR" },
      { flightTitle: "Mumbai", fligthCode: "BOM" },
      { flightTitle: "Kolkata", fligthCode: "CCU" }
    ]
  },
  {
    departureFlightCode: "CJB",
    departureFlightImage: COIMBATORE,
    departureFlightTitle: "Coimbatore Flights",
    destinationFlights: [
      { flightTitle: "Chennai", fligthCode: "MAA" },
      { flightTitle: "Bangalore", fligthCode: "BLR" },
      { flightTitle: "Delhi", fligthCode: "DEL" },
      { flightTitle: "Hyderabad", fligthCode: "HYD" }
    ]
  },
  {
    departureFlightCode: "COK",
    departureFlightImage: KOCHI,
    departureFlightTitle: "Kochi Flights",
    destinationFlights: [
      { flightTitle: "Delhi", fligthCode: "DEL" },
      { flightTitle: "Bangalore", fligthCode: "BLR" },
      { flightTitle: "Mumbai", fligthCode: "BOM" },
      { flightTitle: "Guwahati", fligthCode: "GAU" }
    ]
  },
  {
    departureFlightCode: "GOI",
    departureFlightImage: GOA,
    departureFlightTitle: "Goa Flights",
    destinationFlights: [
      { flightTitle: "Mumbai", fligthCode: "BOM" },
      { flightTitle: "Delhi", fligthCode: "DEL" },
      { flightTitle: "Bangalore", fligthCode: "BLR" },
      { flightTitle: "Hyderabad", fligthCode: "HYD" }
    ]
  }
]

export const AIRPORT_DATA = [
  {
    id: 48,
    code: "DEL",
    city: "New Delhi",
    name: "Indira Gandhi International Airport",
    country: "INDIA"
  },
  {
    id: 13,
    code: "CCU",
    city: "Kolkata",
    name: "Netaji S C Bose International Airport",
    country: "INDIA"
  },
  {
    id: 44,
    code: "BOM",
    city: "Mumbai (Bombay)",
    name: "C S M International Airport",
    country: "INDIA"
  },
  {
    id: 92,
    code: "MAA",
    city: "Chennai",
    name: "Chennai International Airport",
    country: "INDIA"
  },
  {
    id: 24,
    code: "GOI",
    city: "Goa",
    name: "Dabolim Airport",
    country: "INDIA"
  },
  {
    id: 8,
    code: "BLR",
    city: "Bangalore",
    name: "Bangalore Airport",
    country: "INDIA"
  },
  {
    id: 3,
    code: "AMD",
    city: "Ahmedabad",
    name: "Ahmedabad Airport",
    country: "INDIA"
  },
  {
    id: 51,
    code: "PNQ",
    city: "Poona (Pune)",
    name: "Lohegaon Airport",
    country: "INDIA"
  },
  {
    id: 7,
    code: "IXB",
    city: "Bagdogra",
    name: "Bagdogra Airport",
    country: "INDIA"
  },
  {
    id: 103,
    code: "HYD",
    city: "Hyderabad",
    name: "Rajiv Gandhi International Airport",
    country: "INDIA"
  },
  {
    id: 49,
    code: "PAT",
    city: "Patna",
    name: "Patna Airport",
    country: "INDIA"
  },
  {
    id: 16,
    code: "COK",
    city: "Cochin",
    name: "Cochin International Airport",
    country: "INDIA"
  },
  {
    id: 17,
    code: "CJB",
    city: "Coimbatore",
    name: "Coimbatore Peelamedu Airport",
    country: "INDIA"
  },
  {
    id: 42,
    code: "IXM",
    city: "Madurai",
    name: "Madurai Airport",
    country: "INDIA"
  },
  {
    id: 23,
    code: "GAU",
    city: "Guwahati",
    name: "Borjhar Airport",
    country: "INDIA"
  },
  {
    id: 45,
    code: "NAG",
    city: "Nagpur",
    name: "Sonegaon Airport",
    country: "INDIA"
  }
]
