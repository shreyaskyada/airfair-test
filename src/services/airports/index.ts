import backendService from "../api"
import {
  getAirports,
  getBankDetailsConfig,
  getBankNameConfig,
  getFlightsConfig,
  getBestOfferConfig
} from "../api/urlConstants"

export const airlineMapping: { [key: string]: string } = {
  AI: "Air India",
  IX: "Air India Express",
  I5: "AIX Connect",
  QP: "Akasa Air",
  G8: "Go First",
  "6E": "Indigo",
  SG: "SpiceJet",
  UK: "Vistara",
  S5: "Star Air",
  "9I": "Alliance Air",
  S9: "FLY BIG"

  ,GB: "ABX Air",
  A3: "Aegean Airlines",
  EI: "Aer Lingus",
  P5: "Aero Republica",
  SU: "Aeroflot",
  AR: "Aerolineas Argentinas",
  AM: "Aeromexico",
  AW: "Africa World Airlines",
  J7: "Afrijet",
  AH: "Air Algérie",
  G9: "Air Arabia",
  KC: "Air Astana",
  UU: "Air Austral",
  BT: "Air Baltic",
  BP: "Air Botswana",
  "2J": "Air Burkina",
  SM: "Air Cairo",
  TY: "Air Caledonie",
  AC: "Air Canada",
  TX: "Air Caraibes",
  "9H": "Air Changan",
  CA: "Air China",
  XK: "Air Corsica",
  EN: "Air Dolomiti",
  UX: "Air Europa",
  AF: "Air France",
  GT: "Air Guilin",
  JS: "Air Koryo",
  NX: "Air Macau",
  MD: "Air Madagascar",
  KM: "Air Malta",
  MK: "Air Mauritius",
  "9U": "Air Moldova",
  "4O": "Air Montenegro",
  NZ: "Air New Zealand",
  PX: "Air Niugini",
  YW: "Air Nostrum",
  P4: "Air Peace",
  JU: "Air Serbia",
  HM: "Air Seychelles",
  VT: "Air Tahiti",
  TN: "Air Tahiti Nui",
  TC: "Air Tanzania",
  TS: "Air Transat",
  NF: "Air Vanuatu",
  RU: "AirBridgeCargo Airlines",
  SB: "Aircalin",
  "4Z": "Airlink",
  AS: "Alaska Airlines",
  AP: "Albastar",
  "4W": "Allied Air",
  UJ: "AlMasria Universal Airlines",
  HP: "Amapola Flyg",
  "8R": "Amelia",
  AA: "American Airlines",
  NH: "ANA",
  GP: "APG Airlines",
  IZ: "Arkia Israeli Airlines",
  OZ: "Asiana Airlines",
  KP: "ASKY",
  "3V": "ASL Airlines Belgium",
  "5O": "ASL Airlines France",
  RC: "Atlantic Airways",
  "5Y": "Atlas Air",
  OS: "Austrian",
  AV: "Avianca",
  LR: "Avianca Costa Rica",
  "2K": "Avianca Ecuador",
  J2: "Azerbaijan Airlines",
  S4: "Azores Airlines",
  AD: "Azul Brazilian Airlines",
  J4: "Badr Airlines",
  UP: "Bahamasair",
  QH: "Bamboo Airways",
  PG: "Bangkok Airways",
  ID: "Batik Air",
  OD: "Batik Air Malaysia",
  B2: "Belavia Belarusian Airlines",
  BG: "Biman Bangladesh Airlines",
  NT: "Binter Canarias",
  OB: "BoA Boliviana de Aviacion",
  TF: "Braathens Regional Airways",
  BA: "British Airways",
  SN: "Brussels Airlines",
  FB: "Bulgaria Air",
  QC: "Camair-Co",
  K6: "Cambodia Angkor Air",
  JD: "Capital Airlines",
  W8: "Cargojet Airways",
  CV: "Cargolux",
  BW: "Caribbean Airlines",
  V3: "Carpatair",
  CX: "Cathay Pacific",
  "5J": "Cebu Pacific",
  "5Z": "CemAir",
  CE: "Chalair",
  X7: "Challenge Airlines (BE)",
  "5C": "Challenge Airlines (IL)",
  CI: "China Airlines",
  CK: "China Cargo Airlines",
  MU: "China Eastern",
  G5: "China Express Airlines",
  CF: "China Postal Airlines",
  CZ: "China Southern Airlines",
  WX: "CityJet",
  DE: "Condor",
  "8Z": "Congo Airways",
  CM: "COPA Airlines",
  XC: "Corendon Airlines",
  SS: "Corsair International",
  OU: "Croatia Airlines",
  CU: "Cubana",
  CY: "Cyprus Airways",
  OK: "Czech Airlines",
  DL: "Delta Air Lines",
  DO: "DHL Air",
  "2D": "Eastern Airlines",
  T3: "Eastern Airways",
  WK: "Edelweiss Air",
  MS: "Egyptair",
  LY: "EL AL",
  EK: "Emirates",
  ET: "Ethiopian Airlines",
  EY: "Etihad Airways",
  YU: "EuroAtlantic Airways",
  QY: "European Air Transport",
  EW: "Eurowings",
  BR: "EVA Air",
  FJ: "Fiji Airways",
  AY: "Finnair",
  IF: "Fly Baghdad",
  WV: "Fly Namibia",
  FZ: "flydubai",
  FT: "FlyEgypt",
  XY: "Flynas",
  "5F": "FLYONE",
  FH: "Freebird Airlines",
  BF: "French Bee",
  FU: "Fuzhou Airlines",
  GA: "Garuda Indonesia",
  A9: "Georgian Airways",
  ZQ: "German Airways",
  G6: "GlobalX",
  G3: "GOL Linhas Aereas",
  GF: "Gulf Air",
  GX: "GX Airlines",
  HR: "Hahn Air",
  HU: "Hainan Airlines",
  HA: "Hawaiian Airlines",
  NS: "Hebei Airlines",
  "5K": "Hi Fly",
  HX: "Hong Kong Airlines",
  UO: "Hong Kong Express Airways",
  IB: "IBERIA",
  E9: "Iberojet Airlines",
  QI: "Ibom Air",
  FI: "Icelandair",
  EO: "Ikar",
  IR: "Iran Air",
  B9: "Iran Airtour Airline",
  EP: "Iran Aseman Airlines",
  "6H": "Israir",
  AZ: "ITA Airways",
  JL: "Japan Airlines",
  NU: "Japan Transocean Air",
  J9: "Jazeera Airways",
  "7C": "Jeju Air",
  B6: "JetBlue",
  LJ: "Jin Air",
  R5: "Jordan Aviation",
  HO: "Juneyao Airlines",
  RQ: "Kam Air",
  KQ: "Kenya Airways",
  KL: "KLM",
  KE: "Korean Air",
  KY: "Kunming Airlines",
  KU: "Kuwait Airways",
  BO: "La Compagnie",
  TM: "LAM",
  QV: "Lao Airlines",
  JJ: "LATAM Airlines Brasil",
  "4C": "LATAM Airlines Colombia",
  XL: "LATAM Airlines Ecuador",
  LA: "LATAM Airlines Group",
  PZ: "LATAM Airlines Paraguay",
  LP: "LATAM Airlines Peru",
  M3: "LATAM Cargo Brasil",
  UC: "LATAM Cargo Chile",
  GJ: "Loong Air",
  LO: "LOT Polish Airlines",
  "8L": "Lucky Air",
  LH: "Lufthansa",
  CL: "Lufthansa CityLine",
  LG: "Luxair",
  MH: "Malaysia Airlines",
  AE: "Mandarin Airlines",
  MP: "Martinair Cargo",
  M7: "MasAir",
  L6: "Mauritania Airlines International",
  ME: "MEA",
  OM: "MIAT Mongolian Airlines",
  MB: "MNG Airlines",
  "8M": "Myanmar Airways International",
  UB: "Myanmar National Airlines",
  N8: "National Airlines",
  NO: "Neos",
  NE: "Nesma Airlines",
  NP: "Nile Air",
  Y7: "NordStar",
  N4: "Nordwind Airlines",
  BJ: "Nouvelair",
  BK: "Okay Airways",
  OA: "Olympic Air",
  WY: "Oman Air",
  OF: "Overland Airways",
  PK: "Pakistan International Airlines",
  ZP: "Paranair",
  PC: "Pegasus Airlines",
  NI: "PGA-Portugalia Airlines",
  PR: "Philippine Airlines",
  PU: "Plus Ultra",
  PW: "Precision Air",
  P6: "Privilege Style",
  QF: "Qantas",
  QR: "Qatar Airways",
  IQ: "Qazaq Air",
  "7H": "Ravn Alaska",
  FV: "Rossiya Airlines",
  AT: "Royal Air Maroc",
  BI: "Royal Brunei",
  RJ: "Royal Jordanian",
  DR: "Ruili Airlines",
  "7R": "RusLine",
  WB: "RwandAir",
  S7: "S7 Airlines",
  FA: "Safair",
  OV: "Salam Air",
  SK: "SAS",
  SP: "SATA Air Acores",
  SV: "Saudi Arabian Airlines",
  DV: "SCAT Airlines",
  TR: "Scoot",
  O3: "SF Airlines",
  SC: "Shandong Airlines",
  FM: "Shanghai Airlines",
  ZH: "Shenzhen Airlines",
  "3U": "Sichuan Airlines",
  "7L": "Silk Way West Airlines",
  SQ: "Singapore Airlines",
  H2: "SKY Airline",
  "5N": "Smartavia",
  QS: "Smartwings",
  IE: "Solomon Airlines",
  SZ: "Somon Air",
  SA: "South African Airways",
  UL: "SriLankan Airlines",
  XQ: "SunExpress",
  Y8: "Suparna Airlines",
  LX: "SWISS",
  RN: "Syrianair",
  TW: "T'way Air",
  DT: "TAAG Angola Airlines",
  TA: "TACA",
  "5U": "TAG Airlines",
  TP: "TAP Air Portugal",
  RO: "TAROM",
  SF: "Tassili Airlines",
  TG: "Thai Airways",
  SL: "Thai Lion Air",
  WE: "Thai Smile",
  GS: "Tianjin Airlines",
  X3: "TUIfly",
  TU: "Tunisair",
  TK: "Turkish Airlines",
  PS: "Ukraine International Airlines",
  B7: "UNI AIR",
  UA: "United Airlines",
  "5X": "UPS Airlines",
  U6: "Ural Airlines",
  UQ: "Urumqi Air",
  UT: "UTair",
  HY: "Uzbekistan Airways",
  VJ: "Vietjet",
  VN: "Vietnam Airlines",
  VS: "Virgin Atlantic",
  VA: "Virgin Australia",
  "2Z": "Voepass Linhas Aereas",
  Y4: "Volaris",
  V7: "Volotea",
  VY: "Vueling",
  EB: "Wamos Air",
  PN: "West Air",
  WS: "WestJet",
  WF: "Wideroe",
  "2W": "World2Fly",
  MF: "Xiamen Airlines"
}

export const getAirportsWrapper = (query: string) => {
  const config = getAirports(query)
  return backendService
    .request(config)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.error(err))
}

export const searchFlights = (data: {
  from: string
  to: string
  doj: string
  roundtrip: boolean
  adults: number
  infants: number
  children: number
  seatingClass: string
  typeOfJourney: string
  offerDetails: Array<object>
  doa?: string
  bankList: any
  walletList: any
}) => {
  const config = getFlightsConfig(data)
  return backendService
    .request(config)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.error(err))
}

export const getBankDetails = (status: string) => {
  const config = getBankDetailsConfig(status)
  return backendService
    .request(config)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.error(err))
}

export const getBankName = (bankName: string, bankType: string) => {
  const config = getBankNameConfig(bankName, bankType)
  return backendService
    .request(config)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err) => console.error(err))
}

export const getBestOffer = (data: object) => {
  const config = getBestOfferConfig(data)
  return backendService
    .request(config)
    .then((res) => {
      return res
    })
    .catch((err) => console.error(err))
}
