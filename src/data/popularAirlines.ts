import { camelCase } from "lodash"
import {
  AIRINDIA,
  AIR_AISIA_INDIA,
  AIR_INDIA_EXPRESS,
  AKASA,
  ALLIANCE_AIR,
  INIGO,
  SPICEJET,
  STAR_AIR,
  VISTARA,
  MULTI_AIR,
  FLY_BIG,
  AEGEAN_AIRLINES,
  AER_LINGUS,
  AIR_ARABIA,
  AIR_ASIA,
  AIR_ASIA_X,
  AIR_FIJI,
  AIR_FRANCE,
  ASTRAKHAN_AIRLINES,
  AUSTRIAN_AIRLINES,
  BRITISH_AIRWAYS,
  CONDOR_AIRLINES,
  Air_Algérie,
  AIR_ASTANA,
  AIR_AUSTRAL,
  AIR_BALTIC,
  AIR_BOTSWANA,
  AIR_BURKINA,
  AIR_CANADA,
  AIR_CARAIBES,
  AIR_CHANGAN,
  AIR_CHINA,
  AIR_CORSICA,
  AIR_DOLOMITI,
  AIR_EUROPA,
  AIR_GUILIN,
  AIR_MACAU,
  MADAGASCAR_AIRLINES,
  AIR_MALTA,
  AIR_MONTENEGRO,
  AIR_NEWZEALAND,
  AIR_NIUGINI,
  AIR_NOSTRUM,
  AIR_PEACE,
  AIR_SERBIA,
  AIR_SEYCHELLES,
  AIR_TAHITI,
  AIR_TAHITI_NUI,
  AIR_TANZANIA,
  AIR_TRANSAT,
  AIR_VANUATU,
  AIRCALIN,
  AIRLINK,
  ALASKA_AIRLINES,
  ALBASTAR,
  ALL_NIPPON,
  APG_AIRLINES,
  ARKIA_ISRAELI_AIRLINES,
  EMIRATES,
  ASIANA_AIRLINES,
  ASKY,
  ASL_AIRLINES_FRANCE,
  ATLANTIC_AIRWAYS,
  AVIANCA,
  AVIANCA_COSTA_RICA,
  AVIANCA_ECUADOR,
  AZERBAIJAN_AIRLINES,
  AZUL_AIRLINES,
  GEORGIAN_AIRWAYS,
  BADR_AIRLINES,
  BAHAMASAIR,
  AIR_KYRGYZSTAN,
  BANGKOK_AIRWAYS,
  BATIK_AIR,
  BATIK_AIR_MALAYSIA,
  BELAVIA,
  BIMAN_AIRLINES,
  BINTER_CANARIAS,
  BRA,
  BRUSSELS_AIRLINES,
  BULGARIA_AIR,
  CAMEROON_AIRLINES,
  CAMBODIA_ANGKOR_AIR,
  CAPITAL_AIRLINES,
  CARIBBEAN_AIRLINES,
  CATHAY_PACIFIC,
  CEBU_PACIFIC,
  CEM_AIR,
  CHALAIR,
  CHINA_AIRLINES,
  CHINA_EASTERN,
  CHINA_EXPRESS,
  CHINA_SOUTHERN,
  COPA_AIRLINES,
  CORENDON_AIRLINES,
  CORSAIR,
  CROATIA,
  CUBANA,
  CYPRUS,
  CZECH,
  DELTA_AIRLINES,
  EASTERN_AIRLINES,
  EASTERN_AIRWAYS,
  EDELWEISS,
  EGYPT_AIR,
  EL_AL,
  ETHIOPIAN,
  ETIHAD,
  EURO_ATLANTIC,
  EUROWINGS,
  EVA_AIR,
  FINNAIR,
  FLY_BAGHDAD,
  FLY_NAMIBIA,
  FLY_DUBAI,
  FLYNAS,
  FLYONE,
  FRENCH_BEE,
  FUZHOU,
  GARUDA_INDONESIA,
  GERMAN_AIRWAYS,
  GOL,
  GULF_AIR,
  GX_AIRLINES,
  HAHN_AIR,
  HAINAN,
  HAWAIIAN,
  HEBEI,
  HONGKONG_AIRLINES,
  HONGKONG_EXPRESS,
  IBERIA,
  IBOM_AIR,
  ICELANDAIR,
  IRANAIR,
  IRAN_AIRTOUR,
  IRAN_ASEMAN,
  ISRAIR,
  ITA,
  JAPAN_AIRLINES,
  JAZEERA_AIRWAYS,
  JEJU_AIR,
  JETBLUE,
  JINAIR,
  JUNEYAO,
  KAM_AIR,
  KENYA_AIRWAYS,
  KLM,
  KOREAN_AIR,
  KUNMING_AIRLINES,
  KUWAIT_AIRWAYS,
  LA_COMPAGNIE,
  LAM,
  LAO,
  LATAM_BRASIL,
  LATAM_COLOMBIA,
  LATAM_ECUADOR,
  LATAM_PARAGUAY,
  LATAM_PERU,
  LOONG_AIR,
  LOT,
  LUFTHANSA,
  LUCKY_AIR,
  LUFTHANSA_CITYLINE,
  LUXAIR,
  MALAYSIA_AIRLINES,
  MAURITANIA,
  MEA,
  MIAT,
  MAI,
  MNA,
  NEOS,
  NILE,
  NESMA,
  NORDWIND,
  NOUVELAIR,
  OKAY,
  OLYMPIC,
  OMAN_AIR,
  OVERLAND_AIRWAYS,
  PIA,
  PARANAIR,
  PEGASUS,
  PGA,
  PHILIPPINE_AIRLINES,
  PLUS_ULTRA,
  PRECISION_AIR,
  QANTAS,
  QATAR,
  QAZAQ,
  RAVN_ALASKA,
  ROSSIYA,
  ROYAL_AIR_MAROC,
  ROYAL_BRUNEI,
  ROYAL_JORDANIAN,
  RUILI_AIRLINES,
  RUSLINE,
  RWANDAIR,
  S7,
  SAFAIR,
  SALAMAIR,
  SAS,
  SATA_INTERNATIONAL,
  SATA_AIR_ACORES,
  SAUDI_ARABIAN,
  SCAT,
  SCOOT,
  SHANDONG,
  SHANGHAI,
  SHENZHEN,
  SICHUAN,
  SINGAPORE_AIRLINES,
  SKY_AIRLINE,
  SMARTAVIA,
  SMART_WINGS,
  SOLOMON,
  SOMON,
  SOUTH_AFRICAN,
  SRILANKAN_AIRWAYS,
  SUNEXPRESS,
  SUPARNA,
  SWISS,
  SYRIAN,
  TWAY,
  TAAG,
  TAG_AIRLINES,
  TAP,
  TAROM

} from "../assets/images/popularAirlines"
import { ISO_8601 } from "moment"

export const Airlines_Data = [
  {
    name: "Indigo Airlines",
    image: INIGO
  },
  {
    name: "Air India",
    image: AIRINDIA
  },
  {
    name: "Air India Express",
    image: AIR_INDIA_EXPRESS
  },
  {
    name: "Air Aisia India",
    image: AIR_AISIA_INDIA
  },
  {
    name: "Akasa Air",
    image: AKASA
  },
  {
    name: "Vistara Airline",
    image: VISTARA
  },
  {
    name: "SpiceJet",
    image: SPICEJET
  },
  {
    name: "Star Air",
    image: STAR_AIR
  },
  {
    name: "Alliance Air",
    image: ALLIANCE_AIR
  },
  {
    name: "Fly Big",
    image: FLY_BIG
  },
  {
    name: "Aegean Airlines",
    image: AEGEAN_AIRLINES
  },
  {
    name: "Aer Lingus",
    image: AER_LINGUS
  },
  {
    name: "Air Arabia",
    image: AIR_ARABIA
  },
  {
    name: "Air Asia",
    image: AIR_ASIA
  },
  {
    name: "AirAsia X",
    image: AIR_ASIA_X
  },
  {
    name: "Air Fiji",
    image: AIR_FIJI
  },
  {
    name: "Air France",
    image: AIR_FRANCE
  },
  {
    name: "Astrakhan Airlines",
    image: ASTRAKHAN_AIRLINES
  },
  {
    name: "Austrian Airlines",
    image: AUSTRIAN_AIRLINES
  },
  {
    name: "British Airways",
    image: BRITISH_AIRWAYS
  },
  {
    name: "Condor Airlines",
    image: CONDOR_AIRLINES
  },
  {
    name: "Air Algérie",
    image: Air_Algérie
  },
  {
    name: "Air Astana",
    image: AIR_ASTANA
  },
  {
    name: "Air Austral",
    image: AIR_AUSTRAL
  },
  {
    name: "Air Baltic",
    image: AIR_BALTIC
  },
  {
    name: "Air Botswana",
    image: AIR_BOTSWANA
  },
  {
    name: "Air Burkina",
    image: AIR_BURKINA
  },
  {
    name: "Air Canada",
    image: AIR_CANADA
  },
  {
    name: "Air Caraibes",
    image: AIR_CARAIBES
  },
  {
    name: "Air Changan",
    image: AIR_CHANGAN
  },
  {
    name: "Air China",
    image: AIR_CHINA
  },
  {
    name: "Air Corsica",
    image: AIR_CORSICA
  },
  {
    name: "Air Dolomiti",
    image: AIR_DOLOMITI
  },
  {
    name: "Air Europa",
    image: AIR_EUROPA
  },
  {
    name: "Air Guilin",
    image: AIR_GUILIN
  },
  {
    name: "Air Macau",
    image: AIR_MACAU
  },
  {
    name: "Madagascar Airlines",
    image: MADAGASCAR_AIRLINES
  },
  {
    name: "Air Malta",
    image: AIR_MALTA
  },
  {
    name: "Air Montenegro",
    image: AIR_MONTENEGRO
  },
  {
    name: "Air New Zealand",
    image: AIR_NEWZEALAND
  },
  {
    name: "Air Niugini",
    image: AIR_NIUGINI
  },
  {
    name: "Air Nostrum",
    image: AIR_NOSTRUM
  },
  {
    name: "Air Peace",
    image: AIR_PEACE
  },
  {
    name: "Air Serbia",
    image: AIR_SERBIA
  },
  {
    name: "Air Seychelles",
    image: AIR_SEYCHELLES
  },
  {
    name: "Air Tahiti",
    image: AIR_TAHITI
  },
  {
    name: "Air Tahiti Nui",
    image: AIR_TAHITI_NUI
  },
  {
    name: "Air Tanzania",
    image: AIR_TANZANIA
  },
  {
    name: "Air Transat",
    image:AIR_TRANSAT
  },
  {
    name:"Air Vanuatu",
    image:AIR_VANUATU
  },
  {
    name:"Aircalin",
    image:AIRCALIN
  },
  {
    name:"Airlink",
    image:AIRLINK
  },
  {
    name:"Alaska Airlines",
    image:ALASKA_AIRLINES
  },
  {
    name:"AlbaStart",
    image:ALBASTAR
  },
  {
    name:"All Nippon",
    image:ALL_NIPPON
  },
  {
    name: "APG Airlines",
    image:APG_AIRLINES
  },
  {
    name:"Arkia Israeli Airlines",
    image:ARKIA_ISRAELI_AIRLINES
  },
  {
    name:"Emirates",
    image:EMIRATES
  },
  {
    name:"Asiana Airlines",
    image:ASIANA_AIRLINES
  },
  {
    name:"ASKY",
    image:ASKY
  },
  {
    name:"ASL Airlines France",
    image:ASL_AIRLINES_FRANCE
  },
  {
    name:"Atlantic Airways",
    image:ATLANTIC_AIRWAYS
  },
  {
    name:"Avianca",
    image:AVIANCA
  },
  {
    name:"Avianca Costa Rica",
    image:AVIANCA_COSTA_RICA
  },
  {
    name:"Avianca Ecuador",
    image:AVIANCA_ECUADOR
  },
  {
    name:"Azerbaijan Airlines",
    image:AZERBAIJAN_AIRLINES
  },
  {
    name:"Azul Airlines",
    image:AZUL_AIRLINES
  },
  {
    name:"Georgian Airways",
    image:GEORGIAN_AIRWAYS
  },
  {
    name:"Badr Airlines",
    image:BADR_AIRLINES
  },
  {
    name:"Bahamasair",
    image:BAHAMASAIR
  },
  {
    name:"Air Kyrgyzstan",
    image:AIR_KYRGYZSTAN
  },
  {
    name:"Bangkok Airways",
    image:BANGKOK_AIRWAYS
  },
  {
    name:"Batik Air",
    image:BATIK_AIR
  },
  {
    name:"Batik Air Malaysia",
    image:BATIK_AIR_MALAYSIA
  },
  {
    name:"Belavia",
    image:BELAVIA
  },
  {
    name:"Biman Bangladesh Airlines",
    image:BIMAN_AIRLINES
  },
  {
    name:"Binter Canarias",
    image:BINTER_CANARIAS
  },
  {
    name:"Braathens Regional Airlines",
    image:BRA
  },
  {
    name:"Brussels Airlines",
    image:BRUSSELS_AIRLINES
  },
  {
    name:"Bulgaria Air",
    image:BULGARIA_AIR
  },
  {
    name:"Cameroon Airlines",
    image:CAMEROON_AIRLINES
  },
  {
    name:"Cambodia Angkor Air",
    image:CAMBODIA_ANGKOR_AIR
  },
  {
    name: "Capital Airlines",
    image: CAPITAL_AIRLINES
  },
  {
    name:"Caribbean Airlines",
    image:CARIBBEAN_AIRLINES
  },
  {
    name:"Cathay Pacific",
    image:CATHAY_PACIFIC
  },
  {
    name:"Cebu Pacific",
    image:CEBU_PACIFIC
  },
  {
    name:"CemAir",
    image:CEM_AIR
  },
  {
    name:"Chalair",
    image:CHALAIR
  },
  {
    name:"China Airlines",
    image:CHINA_AIRLINES
  },
  {
    name:"China Eastern",
    image:CHINA_EASTERN
  },
  {
    name:"China Express Airlines",
    image:CHINA_EXPRESS
  },
  {
    name:"China Southern Airlines",
    image:CHINA_SOUTHERN
  },
  {
    name:"COPA Airlines",
    image:COPA_AIRLINES
  },
  {
    name:"Corendon Airlines",
    image:CORENDON_AIRLINES
  },
  {
    name:"Corsair International",
    image: CORSAIR
  },
  {
    name:"Croatia Airlines",
    image:CROATIA
  },
  {
    name:"Cubana",
    image:CUBANA
  },
  {
    name:"Cyprus Airways",
    image:CYPRUS
  },
  {
    name:"Czech Airlines",
    image:CZECH
  },
  {
    name:"Delta Airlines",
    image:DELTA_AIRLINES
  },
  {
    name:"Eastern Airlines",
    image:EASTERN_AIRLINES
  },
  {
    name:"Eastern Airways",
    image:EASTERN_AIRWAYS
  },
  {
    name:"Edelweiss Air",
    image:EDELWEISS
  },
  {
    name:"Egypt Air",
    image:EGYPT_AIR
  },
  {
    name:"EL AL",
    image:EL_AL
  },
  {
    name:"Ethiopian Airlines",
    image:ETHIOPIAN
  },
  {
    name:"Etihad Airways",
    image:ETIHAD
  },
  {
    name:"EuroAtlantic Airways",
    image:EURO_ATLANTIC
  },
  {
    name:"Eurowings",
    image:EUROWINGS
  },
  {
    name:"EVA Air",
    image:EVA_AIR
  },
  {
    name:"Finnair",
    image:FINNAIR
  },
  {
    name:"Fly Baghdad",
    image:FLY_BAGHDAD
  },
  {
    name:"Fly Namibia",
    image:FLY_NAMIBIA
  },
  {
    name:"flydubai",
    image:FLY_DUBAI
  },
  {
    name:"flynas",
    image:FLYNAS
  },
  {
    name:"FLYONE",
    image:FLYONE
  },
  {
    name:"French Bee",
    image:FRENCH_BEE
  },
  {
    name:"Fuzhou Airlines",
    image:FUZHOU
  },
  {
    name:"Garuda Indonesia",
    image:GARUDA_INDONESIA
  },
  {
    name:"German Airways",
    image:GERMAN_AIRWAYS
  },
  {
    name:"GOL Linhas Aereas",
    image:GOL
  },
  {
    name:"Gulf Air",
    image:GULF_AIR
  },
  {
    name:"GX Airlines",
    image:GX_AIRLINES
  },
  {
    name:"Hainan Airlines",
    image:HAINAN
  },
  {
    name:"Hahn Air",
    image:HAHN_AIR
  },
  {
    name:"Hawaiian Airlines",
    image:HAWAIIAN
  },
  {
    name:"Hebei Airlines",
    image:HEBEI
  },
  {
    name:"Hong Kong Airlines",
    image:HONGKONG_AIRLINES
  },
  {
    name:"Hong Kong Express Airways",
    image:HONGKONG_EXPRESS
  },
  {
    name:"IBERIA",
    image:IBERIA
  },
  {
    name:"Ibom Air",
    image:IBOM_AIR
  },
  {
    name:"Icelandair",
    image:ICELANDAIR
  },
  {
    name:"Iran Air",
    image:IRANAIR
  },
  {
    name:"Iran Airtour Airline",
    image:IRAN_AIRTOUR
  },
  {
    name:"Iran Aseman Airlines",
    image:IRAN_ASEMAN
  },
  {
    name:"Israir",
    image:ISRAIR
  },
  {
    name:"ITA Airways",
    image:ITA
  },
  {
    name:"Japan Airlines",
    image:JAPAN_AIRLINES
  },
  {
    name:"Jazeera Airways",
    image:JAZEERA_AIRWAYS
  },
  {
    name:"Jeju Air",
    image:JEJU_AIR
  },
  {
    name:"JetBlue",
    image:JETBLUE
  },
  {
    name:"Jin Air",
    image:JINAIR
  },
  {
    name:"Juneyao Airlines",
    image:JUNEYAO
  },
  {
    name:"Kam Air",
    image:KAM_AIR
  },
  {
    name:"Kenya Airways",
    image:KENYA_AIRWAYS
  },
  {
    name:"KLM",
    image:KLM
  },
  {
    name:"Korean Air",
    image:KOREAN_AIR
  },
  {
    name:"Kunming Airlines",
    image:KUNMING_AIRLINES
  },
  {
    name:"La Compagnie",
    image:LA_COMPAGNIE
  },
  {
    name:"LAM",
    image:LAM
  },
  {
    name:"LAO",
    image:LAO
  },
  {
    name:"LATAM Brasil",
    image:LATAM_BRASIL
  },
  {
    name:"LATAM Colombia",
    image:LATAM_COLOMBIA
  },
  {
    name:"LATAM Peru",
    image:LATAM_PERU
  },
  {
    name:"LATAM Ecuador",
    image:LATAM_ECUADOR
  },
  {
    name:"LATAM Paraguay",
    image:LATAM_PARAGUAY
  },
  {
    name:"Loong Air",
    image:LOONG_AIR
  },
  {
    name:"LOT Polish Airlines",
    image:LOT
  },
  {
    name:"Lufthansa",
    image:LUFTHANSA
  },
  {
    name:"Lucky Air",
    image:LUCKY_AIR
  },
  {
    name:"Lufthansa CityLine",
    image:LUFTHANSA_CITYLINE
  },
  {
    name:"Luxair",
    image:LUXAIR
  },
  {
    name:"Malaysia Airlines",
    image:MALAYSIA_AIRLINES
  },
  {
    name:"Mauritania Airlines",
    image:MAURITANIA
  },
  {
    name:"Middle East Airlines",
    image:MEA
  },
  {
    name:"MIAT Mongolian Airlines",
    image:MIAT
  },
  {
    name:"Myanmar Airways International",
    image:MAI
  },
  {
    name:"Myanmar National Airlines",
    image:MNA
  },
  {
    name:"Neos",
    image:NEOS
  },
  {
    name:"Nile Air",
    image:NILE
  },
  {
    name:"Nesma Airlines",
    image:NESMA
  },
  {
    name:"Nordwind Airlines",
    image:NORDWIND
  },
  {
    name:"Nouvelair",
    image:NOUVELAIR
  },
  {
    name:"Okay Airways",
    image:OKAY
  },
  {
    name:"Olympic Airlines",
    image:OLYMPIC
  },
  {
    name:"Oman Air",
    image:OMAN_AIR
  },
  {
    name:"Overland Airways",
    image:OVERLAND_AIRWAYS
  },
  {
    name:"Pakistan International Airlines",
    image:PIA
  },
  {
    name:"Paranair",
    image:PARANAIR
  },
  {
    name:"Pegasus Airlines",
    image:PEGASUS
  },
  {
    name:"PGA-Portugalia Airlines",
    image:PGA
  },
  {
    name:"Philippine Airlines",
    image:PHILIPPINE_AIRLINES
  },
  {
    name:"Plus Ultra",
    image:PLUS_ULTRA
  },
  {
    name:"Precision Air",
    image:PRECISION_AIR
  },
  {
    name:"Qantas",
    image:QANTAS
  },
  {
    name:"Qatar Airways",
    image:QATAR
  },
  {
    name:"Qazaq Air",
    image:QAZAQ
  },
  {
    name:"Ravn Alaska",
    image:RAVN_ALASKA
  },
  {
    name:"Rossiya Airlines",
    image:ROSSIYA
  },
  {
    name:"Royal Air Maroc",
    image:ROYAL_AIR_MAROC
  },
  {
    name:"Royal Brunei",
    image:ROYAL_BRUNEI
  },
  {
    name:"Royal Jordanian",
    image:ROYAL_JORDANIAN
  },
  {
    name:"Ruili Airlines",
    image:RUILI_AIRLINES
  },
  {
    name:"RusLine",
    image:RUSLINE
  },
  {
    name:"RwandAir",
    image:RWANDAIR
  },
  {
    name:"S7 Airlines",
    image:S7
  },
  {
    name:"Safair",
    image:SAFAIR
  },
  {
    name:"Salam Air",
    image:SALAMAIR
  },
  {
    name:"Scandinavian Airlines",
    image:SAS
  },
  {
    name:"SATA International",
    image:SATA_INTERNATIONAL
  },
  {
    name:"SATA Air Acores",
    image:SATA_AIR_ACORES
  },
  {
    name:"Saudi Arabian Airlines",
    image:SAUDI_ARABIAN
  },
  {
    name:"SCAT Airlines",
    image:SCAT
  },
  {
    name:"Fly Scoot",
    image:SCOOT
  },
  {
    name:"Shandong Airlines",
    image:SHANDONG
  },
  {
    name:"Shanghai Airlines",
    image:SHANGHAI
  },
  {
    name:"Shenzhen Airlines",
    image:SHENZHEN
  },
  {
    name:"Sichuan Airlines",
    image:SICHUAN
  },
  {
    name:"Singapore Airlines",
    image:SINGAPORE_AIRLINES
  },
  {
    name:"SKY AIRLINE",
    image:SKY_AIRLINE
  },
  {
    name:"Smartavia",
    image:SMARTAVIA
  },
  {
    name:"Smart Wings",
    image:SMART_WINGS
  },
  {
    name:"Solomon Airlines",
    image:SOLOMON
  },
  {
    name:"Somon Air",
    image:SOMON
  },
  {
    name:"South African Airways",
    image:SOUTH_AFRICAN
  },
  {
    name:"SriLankan Airlines",
    image:SRILANKAN_AIRWAYS
  },
  {
    name:"SUNEXPRESS",
    image:SUNEXPRESS
  },
  {
    name:"Suparna Airlines",
    image:SUPARNA
  },
  {
    name:"SWISS",
    image:SWISS
  },
  {
    name:"Syrian Air",
    image:SYRIAN
  },
  {
    name:"T'way Air",
    image:TWAY
  },
  {
    name:"TAAG Angola Airlines",
    image:TAAG
  },
  {
    name:"TAG Airlines",
    image:TAG_AIRLINES
  },
  {
    name:"TAP Air Portugal",
    image:TAP
  },
  {
    name:"TAROM",
    image:TAROM
  }
]

export const Airlines_Images:any = {
  "Indigo": INIGO,
  "Air India": AIRINDIA,
  "Air India Express": AIR_INDIA_EXPRESS,
  "Air Aisia India": AIR_AISIA_INDIA,
  "Akasa Air": AKASA,
  "Vistara": VISTARA,
  "SpiceJet": SPICEJET,
  "Star Air": STAR_AIR,
  "Alliance Air": ALLIANCE_AIR,
  "Multiple Airlines":MULTI_AIR,
  "AIX Connect":AIR_AISIA_INDIA,
  "Go First":AKASA,
  "Fly Big":FLY_BIG,
  "Aegean Airlines":AEGEAN_AIRLINES,
  "Aer Lingus":AER_LINGUS,
  "Air Arabia":AIR_ARABIA,
  "Air Asia":AIR_ASIA,
  "AirAsia X":AIR_ASIA_X,
  "Air Fiji": AIR_FIJI,
  "Air France":AIR_FRANCE,
  "Astrakhan Airlines":ASTRAKHAN_AIRLINES,
  "Austrian Airlines":AUSTRIAN_AIRLINES,
  "British Airways":BRITISH_AIRWAYS,
  "Condor Airlines":CONDOR_AIRLINES,
  "Air Algérie":Air_Algérie,
  "Air Astana":AIR_ASTANA,
  "Air Austral":AIR_AUSTRAL,
  "Air Baltic":AIR_BALTIC,
  "Air Botswana":AIR_BOTSWANA,
  "Air Burkina":AIR_BURKINA,
  "Air Canada": AIR_CANADA,
  "Air Caraibes":AIR_CARAIBES,
  "Air Changan":AIR_CHANGAN,
  "Air China":AIR_CHINA,
  "Air Corsica":AIR_CORSICA,
  "Air Dolomiti": AIR_DOLOMITI,
  "Air Europa":AIR_EUROPA,
  "Air Guilin":AIR_GUILIN,
  "Air Macau":AIR_MACAU,
  "Madagascar Airlines":MADAGASCAR_AIRLINES,
  "Air Malta":AIR_MALTA,
  "Air Montenegro":AIR_MONTENEGRO,
  "Air New Zealand":AIR_NEWZEALAND,
  "Air Niugini":AIR_NIUGINI,
  "Air Nostrum":AIR_NOSTRUM,
  "Air Peace":AIR_PEACE,
  "Air Serbia":AIR_SERBIA,
  "Air Seychelles":AIR_SEYCHELLES,
  "Air Tahiti":AIR_TAHITI,
  "Air Tahiti Nui":AIR_TAHITI_NUI,
  "Air Tanzania":AIR_TANZANIA,
  "Air Transat":AIR_TRANSAT,
  "Air Vanuatu":AIR_VANUATU,
  "Aircalin":AIRCALIN,
  "Airlink":AIRLINK,
  "Alaska Airlines":ALASKA_AIRLINES,
  "AlbaStart":ALBASTAR,
  "All Nippon":ALL_NIPPON,
  "APG Airlines":APG_AIRLINES,
  "Arkia Israeli Airlines":ARKIA_ISRAELI_AIRLINES,
  "Emirates":EMIRATES,
  "Asiana Airlines":ASIANA_AIRLINES,
  "ASKY":ASKY,
  "ASL Airlines France":ASL_AIRLINES_FRANCE,
  "Atlantic Airways":ATLANTIC_AIRWAYS,
  "Avianca":AVIANCA,
  "Avianca Costa Rica":AVIANCA_COSTA_RICA,
  "Avianca Ecuador":AVIANCA_ECUADOR,
  "Azerbaijan Airlines":AZERBAIJAN_AIRLINES,
  "Azul Airlines":AZUL_AIRLINES,
  "Georgian Airways":GEORGIAN_AIRWAYS,
  "Badr Airlines":BADR_AIRLINES,
  "Bahamasair":BAHAMASAIR,
  "Air Kyrgyzstan":AIR_KYRGYZSTAN,
  "Bangkok Airways":BANGKOK_AIRWAYS,
  "Batik Air":BATIK_AIR,
  "Batik Air Malaysia":BATIK_AIR_MALAYSIA,
  "Belavia Airlines":BELAVIA,
  "Biman Bangladesh Airlines":BIMAN_AIRLINES,
  "Binter Canarias":BINTER_CANARIAS,
  "Braathens Regional Airlines":BRA,
  "Brussels Airlines":BRUSSELS_AIRLINES,
  'Bulgaria Air':BULGARIA_AIR,
  "Cameroon Airlines":CAMEROON_AIRLINES,
  "Cambodia Angkor Air":CAMBODIA_ANGKOR_AIR,
  "Capital Airlines":CAPITAL_AIRLINES,
  "Caribbean Airlines":CARIBBEAN_AIRLINES,
  "Cathay Pacific":CATHAY_PACIFIC,
  "Cebu Pacific":CEBU_PACIFIC,
  "CemAir":CEM_AIR,
  "Chalair":CHALAIR,
  "China Airlines":CHINA_AIRLINES,
  "China Eastern":CHINA_EASTERN,
  "China Express Airlines":CHINA_EXPRESS,
  "China Southern Airlines":CHINA_SOUTHERN,
  "COPA Airlines":COPA_AIRLINES,
  "Corendon Airlines":CORENDON_AIRLINES,
  "Corsair International":CORSAIR,
  "Croatia Airlines":CROATIA,
  "Cubana":CUBANA,
  "Cyprus Airways":CYPRUS,
  "Czech Airlines":CZECH,
  "Delta Airlines":DELTA_AIRLINES,
  "Eastern Airlines":EASTERN_AIRLINES,
  "Eastern Airways":EASTERN_AIRWAYS,
  "Edelweiss Air":EDELWEISS,
  "Egypt Air":EGYPT_AIR,
  "EL AL":EL_AL,
  "Ethiopian Airlines":ETHIOPIAN,
  "Etihad Airways":ETIHAD,
  "EuroAtlantic Airways":EURO_ATLANTIC,
  "Eurowings":EUROWINGS,
  "EVA Air":EVA_AIR,
  "Finnair":FINNAIR,
  "Fly Baghdad":FLY_BAGHDAD,
  "Fly Namibia":FLY_NAMIBIA,
  "flydubai":FLY_DUBAI,
  "Flynas":FLYNAS,
  "FLYONE":FLYONE,
  "French Bee":FRENCH_BEE,
  "Fuzhou Airlines":FUZHOU,
  "Garuda Indonesia":GARUDA_INDONESIA,
  "German Airways":GERMAN_AIRWAYS,
  "GOL Linhas Aereas":GOL,
  "Gulf Air":GULF_AIR,
  "GX Airlines":GX_AIRLINES,
  "Hahn Air":HAHN_AIR,
  "Hainan Airlines":HAINAN,
  "Hawaiian Airlines":HAWAIIAN,
  "Hebei Airlines":HEBEI,
  "Hong Kong Airlines":HONGKONG_AIRLINES,
  "Hong Kong Express Airways":HONGKONG_EXPRESS,
  "IBERIA":IBERIA,
  "Ibom Air":IBOM_AIR,
  "Icelandair":ICELANDAIR,
  "Iran Air":IRANAIR,
  "Iran Airtour Airline":IRAN_AIRTOUR,
  "Iran Aseman Airlines":IRAN_ASEMAN,
  "Israir":ISRAIR,
  "ITA Airways":ITA,
  "Japan Airlines":JAPAN_AIRLINES,
  "Jazeera Airways":JAZEERA_AIRWAYS,
  "Jeju Air":JEJU_AIR,
  "JetBlue":JETBLUE,
  "Jin Air":JINAIR,
  "Juneyao Airlines":JUNEYAO,
  "Kam Air":KAM_AIR,
  "Kenya Airways":KENYA_AIRWAYS,
  "KLM":KLM,
  "Korean Air":KOREAN_AIR,
  "Kunming Airlines":KUNMING_AIRLINES,
  "Kuwait Airways":KUWAIT_AIRWAYS,
  "La Compagnie":LA_COMPAGNIE,
  "LAM":LAM,
  "Lao Airlines":LAO,
  "LATAM Brasil":LATAM_BRASIL,
  "LATAM Colombia":LATAM_COLOMBIA,
  "LATAM Peru":LATAM_PERU,
  "LATAM Ecuador":LATAM_ECUADOR,
  "LATAM Paraguay":LATAM_PARAGUAY,
  "Loong Air":LOONG_AIR,
  "LOT Polish Airlines":LOT,
  "Lufthansa":LUFTHANSA,
  "Lucky Air":LUCKY_AIR,
  "Lufthansa CityLine":LUFTHANSA_CITYLINE,
  "Luxair":LUXAIR,
  "Malaysia Airlines":MALAYSIA_AIRLINES,
  "Mauritania Airlines":MAURITANIA,
  "Middle East Airlines":MEA,
  "MIAT Mongolian Airlines":MIAT,
  "Myanmar Airways International":MAI,
  "Myanmar National Airlines":MNA,
  "Neos":NEOS,
  "Nile Air":NILE,
  "Nesma Airlines":NESMA,
  "Nordwind Airlines":NORDWIND,
  "Nouvelair":NOUVELAIR,
  "Okay Airways":OKAY,
  'Olympic Airlines':OLYMPIC,
  "Oman Air":OMAN_AIR,
  "Overland Airways":OVERLAND_AIRWAYS,
  "Pakistan International Airlines":PIA,
  "Paranair":PARANAIR,
  "Pegasus Airlines":PEGASUS,
  "PGA-Portugalia Airlines":PGA,
  "Philippine Airlines":PHILIPPINE_AIRLINES,
  "Plus Ultra":PLUS_ULTRA,
  "Precision Air":PRECISION_AIR,
  "Qantas":QANTAS,
  "Qatar Airways":QATAR,
  "Qazaq Air":QAZAQ,
  "Ravn Alaska":RAVN_ALASKA,
  "Rossiya Airlines":ROSSIYA,
  "Royal Air Maroc":ROYAL_AIR_MAROC,
  "Royal Brunei":ROYAL_BRUNEI,
  "Royal Jordanian":ROYAL_JORDANIAN,
  "Ruili Airlines":RUILI_AIRLINES,
  "RusLine":RUSLINE,
  "RwandAir":RWANDAIR,
  "S7 Airlines":S7,
  "Safair":SAFAIR,
  "Salam Air":SALAMAIR,
  "Scandinavian Airlines":SAS,
  "SATA International":SATA_INTERNATIONAL,
  "SATA Air Acores":SATA_AIR_ACORES,
  "Saudi Arabian Airlines":SAUDI_ARABIAN,
  "SCAT Airlines":SCAT,
  "Fly Scoot":SCOOT,
  "Shandong Airlines":SHANDONG,
  "Shanghai Airlines":SHANGHAI,
  "Shenzhen Airlines":SHENZHEN,
  "Sichuan Airlines":SICHUAN,
  "Singapore Airlines":SINGAPORE_AIRLINES,
  "Smartavia":SMARTAVIA,
  "Smart Wings":SMART_WINGS,
  "Solomon Airlines":SOLOMON,
  "Somon Air":SOMON,
  "South African Airways":SOUTH_AFRICAN,
  "SriLankan Airlines":SRILANKAN_AIRWAYS,
  "SUNEXPRESS":SUNEXPRESS,
  "Suparna Airlines":SUPARNA,
  "SWISS":SWISS,
  "Syrian Air":SYRIAN,
  "TAAG Angola Airlines":TAAG,
  "TAG Airlines":TAG_AIRLINES,
  "TAP Air Portugal":TAP,
  "TAROM":TAROM
}
