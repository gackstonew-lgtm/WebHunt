import { IndustryCategory, IndustryDefinition } from "./types";

export const INDUSTRY_CATEGORIES: IndustryCategory[] = [
  // 1. Agriculture & Agribusiness
  {
    id: "agriculture_agribusiness",
    name: "Agriculture & Agribusiness",
    icon: "Wheat",
    description: "Crop farming, horticulture, coffee, tea, livestock, grain, seeds, fertilizer, and agricultural technology.",
    applicableModes: ["physical", "online"],
  },
  // 2. Forestry & Timber
  {
    id: "forestry_timber",
    name: "Forestry & Timber",
    icon: "Trees",
    description: "Forestry, reforestation, logging, timber, lumber, sawmills, wood processing, and paper pulp.",
    applicableModes: ["physical"],
  },
  // 3. Fishing & Aquaculture
  {
    id: "fishing_aquaculture",
    name: "Fishing & Aquaculture",
    icon: "Fish",
    description: "Commercial fishing, fish farming, shrimp farming, hatcheries, seafood processing, and marine aquaculture.",
    applicableModes: ["physical"],
  },
  // 4. Mining & Minerals
  {
    id: "mining_minerals",
    name: "Mining & Minerals",
    icon: "Pickaxe",
    description: "Gold, copper, lithium, cobalt, iron ore, coal, gemstones, quarries, mineral exploration, and mining services.",
    applicableModes: ["physical"],
  },
  // 5. Oil & Gas
  {
    id: "oil_gas",
    name: "Oil & Gas",
    icon: "Flame",
    description: "Crude oil exploration, natural gas, LNG, LPG, drilling, refining, fuel stations, and pipeline logistics.",
    applicableModes: ["physical"],
  },
  // 6. Energy & Utilities
  {
    id: "energy_utilities",
    name: "Energy & Utilities",
    icon: "Zap",
    description: "Solar energy, wind power, hydroelectric, geothermal, electricity grids, and battery storage.",
    applicableModes: ["physical", "online"],
  },
  // 7. Water & Environmental Services
  {
    id: "water_environmental",
    name: "Water & Environmental Services",
    icon: "Droplets",
    description: "Water treatment, desalination, wastewater, recycling, waste management, and environmental consulting.",
    applicableModes: ["physical"],
  },
  // 8. Manufacturing
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "Factory",
    description: "Food processing, textiles, chemicals, electronics, industrial machinery, metal fabrication, and plastics.",
    applicableModes: ["physical", "online"],
  },
  // 9. Construction & Engineering
  {
    id: "construction",
    name: "Construction & Civil Engineering",
    icon: "Hammer",
    description: "Residential, commercial, civil engineering, roads, bridges, plumbing, electrical, roofing, and HVAC contracting.",
    applicableModes: ["physical"],
  },
  // 10. Real Estate & Property
  {
    id: "real_estate",
    name: "Real Estate & Property",
    icon: "Building",
    description: "Commercial real estate, residential brokerage, property management, leasing, valuation, and REITs.",
    applicableModes: ["physical"],
  },
  // 11. Wholesale & Distribution
  {
    id: "wholesale_distribution",
    name: "Wholesale & Distribution",
    icon: "Boxes",
    description: "Food wholesale, pharmaceutical distribution, industrial supplies, import/export, and commodity wholesale.",
    applicableModes: ["physical"],
  },
  // 12. Retail & E-Commerce
  {
    id: "retail_ecommerce",
    name: "Retail & E-Commerce",
    icon: "ShoppingBag",
    description: "Supermarkets, fashion, electronics, hardware, pharmacies, department stores, and online marketplaces.",
    applicableModes: ["physical", "online"],
  },
  // 13. Automotive
  {
    id: "automotive",
    name: "Automotive",
    icon: "Car",
    description: "Car dealerships, auto repair, body shops, detailing, auto parts, car rental, and EV charging stations.",
    applicableModes: ["physical"],
  },
  // 14. Transportation
  {
    id: "transportation",
    name: "Transportation",
    icon: "Truck",
    description: "Road freight, passenger buses, taxis, ride-hailing, rail transportation, and courier transport.",
    applicableModes: ["physical"],
  },
  // 15. Logistics & Supply Chain
  {
    id: "logistics_supply_chain",
    name: "Logistics & Supply Chain",
    icon: "Container",
    description: "Freight forwarding, warehousing, 3PL fulfillment, cold chain logistics, last-mile delivery, and customs brokerage.",
    applicableModes: ["physical", "online"],
  },
  // 16. Aviation & Airports (Dedicated Major Sector)
  {
    id: "aviation_airports",
    name: "Aviation & Airports",
    icon: "Plane",
    description: "International airports, regional airports, cargo terminals, duty-free retail, airlines, aircraft maintenance, and MRO.",
    applicableModes: ["physical", "online"],
  },
  // 17. Maritime & Ports
  {
    id: "maritime_ports",
    name: "Maritime & Ports",
    icon: "Anchor",
    description: "Commercial ports, container terminals, shipyards, marine engineering, cargo shipping, and harbor services.",
    applicableModes: ["physical"],
  },
  // 18. Travel & Tourism
  {
    id: "travel_tourism",
    name: "Travel & Tourism",
    icon: "Compass",
    description: "Travel agencies, tour operators, safari companies, adventure tourism, destination management, and travel tech.",
    applicableModes: ["physical", "online"],
  },
  // 19. Hospitality
  {
    id: "hospitality",
    name: "Hospitality & Accommodation",
    icon: "Hotel",
    description: "Hotels, luxury resorts, boutique lodges, guesthouses, motels, serviced apartments, and vacation rentals.",
    applicableModes: ["physical"],
  },
  // 20. Food & Beverage
  {
    id: "food_beverage",
    name: "Food & Beverage",
    icon: "Utensils",
    description: "Restaurants, cafes, bakeries, bars, breweries, catering, cloud kitchens, and food manufacturing.",
    applicableModes: ["physical"],
  },
  // 21. Information Technology
  {
    id: "information_technology",
    name: "Information Technology",
    icon: "Cpu",
    description: "Software engineering, SaaS, cloud infrastructure, AI, cybersecurity, DevOps, web development, and data centers.",
    applicableModes: ["physical", "online"],
  },
  // 22. Telecommunications
  {
    id: "telecommunications",
    name: "Telecommunications",
    icon: "Radio",
    description: "Mobile operators, fiber broadband, ISPs, satellite communications, 5G infrastructure, and telecom equipment.",
    applicableModes: ["physical", "online"],
  },
  // 23. Media & Entertainment
  {
    id: "media_entertainment",
    name: "Media & Entertainment",
    icon: "Film",
    description: "Television, radio, publishing, film production, music streaming, podcasts, gaming, esports, and animation.",
    applicableModes: ["physical", "online"],
  },
  // 24. Marketing & Advertising
  {
    id: "marketing_advertising",
    name: "Marketing & Advertising",
    icon: "Megaphone",
    description: "Advertising agencies, digital marketing, SEO, PR, branding, influencer marketing, and media buying.",
    applicableModes: ["physical", "online"],
  },
  // 25. Banking & Finance
  {
    id: "banking_finance",
    name: "Banking & Finance",
    icon: "Landmark",
    description: "Commercial banking, investment banking, microfinance, fintech, digital payments, and foreign exchange.",
    applicableModes: ["physical", "online"],
  },
  // 26. Insurance
  {
    id: "insurance",
    name: "Insurance",
    icon: "Shield",
    description: "Life, health, property, auto, marine, aviation insurance, reinsurance, and claims management.",
    applicableModes: ["physical", "online"],
  },
  // 27. Investment & Capital Markets
  {
    id: "investment_capital_markets",
    name: "Investment & Capital Markets",
    icon: "TrendingUp",
    description: "Venture capital, private equity, asset management, wealth advisory, hedge funds, and stock brokerages.",
    applicableModes: ["physical", "online"],
  },
  // 28. Professional Services
  {
    id: "professional_services",
    name: "Professional & Business Services",
    icon: "Briefcase",
    description: "Accounting, auditing, tax advisory, management consulting, architecture, translation, and BPO.",
    applicableModes: ["physical", "online"],
  },
  // 29. Legal & Compliance
  {
    id: "legal_compliance",
    name: "Legal & Compliance",
    icon: "Scale",
    description: "Law firms, corporate law, intellectual property, litigation, regulatory compliance, AML, and legal tech.",
    applicableModes: ["physical", "online"],
  },
  // 30. Healthcare
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    icon: "HeartPulse",
    description: "Hospitals, private clinics, dental practices, pharmacies, diagnostic imaging, medical labs, and telemedicine.",
    applicableModes: ["physical", "online"],
  },
  // 31. Pharmaceuticals & Biotechnology
  {
    id: "pharmaceuticals_biotech",
    name: "Pharmaceuticals & Biotechnology",
    icon: "Dna",
    description: "Drug development, generic pharmaceuticals, vaccines, clinical trials, medical devices, and genomics.",
    applicableModes: ["physical", "online"],
  },
  // 32. Education
  {
    id: "education",
    name: "Education & Training",
    icon: "GraduationCap",
    description: "Universities, private schools, colleges, vocational training, tutoring, corporate training, and edtech.",
    applicableModes: ["physical", "online"],
  },
  // 33. Science & Research
  {
    id: "science_research",
    name: "Science & Research",
    icon: "FlaskConical",
    description: "Scientific laboratories, agricultural research, materials science, testing laboratories, and R&D centers.",
    applicableModes: ["physical", "online"],
  },
  // 34. Government & Public Sector
  {
    id: "government_public_sector",
    name: "Government & Public Sector",
    icon: "Building2",
    description: "Municipalities, regional authorities, public utilities, emergency services, embassies, and public works.",
    applicableModes: ["physical"],
  },
  // 35. Defense & Security
  {
    id: "defense_security",
    name: "Defense & Security",
    icon: "ShieldAlert",
    description: "Private security, security systems, CCTV, access control, defense equipment, and alarm monitoring.",
    applicableModes: ["physical"],
  },
  // 36. Human Resources & Employment
  {
    id: "human_resources",
    name: "Human Resources & Employment",
    icon: "Users",
    description: "Staffing agencies, executive search, recruitment, payroll services, and workforce management software.",
    applicableModes: ["physical", "online"],
  },
  // 37. Consumer & Personal Services
  {
    id: "consumer_personal_services",
    name: "Consumer & Personal Services",
    icon: "Scissors",
    description: "Beauty salons, barbershops, spas, fitness gyms, dry cleaning, home maintenance, and pet care.",
    applicableModes: ["physical"],
  },
  // 38. Sports & Recreation
  {
    id: "sports_recreation",
    name: "Sports & Recreation",
    icon: "Trophy",
    description: "Sports clubs, fitness academies, stadiums, golf clubs, recreation centers, and theme parks.",
    applicableModes: ["physical"],
  },
  // 39. Arts & Creative Industries
  {
    id: "arts_creative",
    name: "Arts & Creative Industries",
    icon: "Palette",
    description: "Art galleries, museums, photography studios, graphic design, interior architecture, and artisan crafts.",
    applicableModes: ["physical", "online"],
  },
  // 40. Events & Conferences
  {
    id: "events_conferences",
    name: "Events & Conferences",
    icon: "Calendar",
    description: "Event planning, convention centers, trade show organizers, exhibition venues, and audio-visual production.",
    applicableModes: ["physical"],
  },
  // 41. Nonprofit & Social Enterprise
  {
    id: "nonprofit_social_enterprise",
    name: "Nonprofit & Social Enterprise",
    icon: "Heart",
    description: "NGOs, charities, foundations, humanitarian agencies, community organizations, and social enterprises.",
    applicableModes: ["physical", "online"],
  },
  // 42. Digital Economy
  {
    id: "digital_economy",
    name: "Digital Economy & Creator Platforms",
    icon: "Globe",
    description: "Creator economy, digital marketplaces, remote platforms, content subscription tools, and virtual goods.",
    applicableModes: ["physical", "online"],
  },
  // 43. Space Industry
  {
    id: "space_industry",
    name: "Space Industry & Aerospace",
    icon: "Rocket",
    description: "Satellites, satellite communications, Earth observation, space launch, aerospace systems, and ground stations.",
    applicableModes: ["physical", "online"],
  },
  // 44. Infrastructure
  {
    id: "infrastructure",
    name: "Infrastructure & Civil Works",
    icon: "Construction",
    description: "Highway construction, railway infrastructure, bridges, dams, telecommunications towers, and urban works.",
    applicableModes: ["physical"],
  },
  // 45. Smart Cities & Urban Development
  {
    id: "smart_cities",
    name: "Smart Cities & Urban Development",
    icon: "Layers",
    description: "Smart traffic management, IoT urban sensors, smart parking, digital government, and city analytics.",
    applicableModes: ["physical", "online"],
  },
  // 46. Climate & Clean Technology
  {
    id: "climate_cleantech",
    name: "Climate & Clean Technology",
    icon: "Leaf",
    description: "Carbon capture, green finance, recycling technologies, environmental remediation, and circular economy.",
    applicableModes: ["physical", "online"],
  },
  // 47. Luxury & Premium Markets
  {
    id: "luxury_premium",
    name: "Luxury & Premium Markets",
    icon: "Crown",
    description: "Luxury fashion, fine jewelry, high-end watches, private jet charter, yacht brokerage, and luxury real estate.",
    applicableModes: ["physical"],
  },
  // 48. Industrial Services
  {
    id: "industrial_services",
    name: "Industrial Services & Maintenance",
    icon: "Wrench",
    description: "Industrial equipment maintenance, machinery repair, calibration, quality testing, and facility servicing.",
    applicableModes: ["physical"],
  },
  // 49. Property & Facilities Management
  {
    id: "property_facilities",
    name: "Property & Facilities Management",
    icon: "Key",
    description: "Building management, janitorial services, elevator maintenance, smart building energy, and security staff.",
    applicableModes: ["physical"],
  },
  // 50. Emerging Technologies
  {
    id: "emerging_tech",
    name: "Emerging Technologies",
    icon: "Sparkles",
    description: "Autonomous robotics, quantum computing, digital twins, spatial computing, Web3, and advanced materials.",
    applicableModes: ["physical", "online"],
  },
  // 51. Trading & Commodities
  {
    id: "trading_commodities",
    name: "Trading & Commodities",
    icon: "BarChart3",
    description: "Energy trading, agricultural commodities, precious metals, carbon credits, forex brokerage, and derivatives.",
    applicableModes: ["physical", "online"],
  },
  // 52. Procurement & Supply Chain
  {
    id: "procurement_supply_chain",
    name: "Procurement & Supply Chain",
    icon: "ClipboardCheck",
    description: "Strategic sourcing, supplier vendor management, purchasing analytics, and trade compliance consulting.",
    applicableModes: ["physical", "online"],
  },
  // 53. Mobility & Transportation Technology
  {
    id: "mobility_transport_tech",
    name: "Mobility & Transportation Technology",
    icon: "Navigation",
    description: "Ride-hailing tech, EV fleet management, micro-mobility, autonomous vehicles, and connected telematics.",
    applicableModes: ["physical", "online"],
  },
  // 54. Corporate & Business Services
  {
    id: "corporate_services",
    name: "Corporate & Business Services",
    icon: "Building",
    description: "Coworking spaces, virtual offices, business centers, corporate communications, and records management.",
    applicableModes: ["physical"],
  },
  // 55. Other / Specialized Industries
  {
    id: "specialized_industries",
    name: "Specialized Industries & Trades",
    icon: "SlidersHorizontal",
    description: "Niche industrial specializations, custom artisan services, and specialized commercial operations.",
    applicableModes: ["physical", "online"],
  },
];

export const INDUSTRY_TAXONOMY: IndustryDefinition[] = [
  // ==========================================
  // 1. AVIATION & AIRPORTS (REQUIRED MAJOR SECTOR)
  // ==========================================
  {
    id: "airports_international",
    name: "International Airports & Terminals",
    categoryId: "aviation_airports",
    industryGroup: "Airports & Operators",
    subCategory: "Airports",
    niche: "International Hubs",
    businessType: "International Airport",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["international airport", "airport terminal", "aerodrome", "airport operator", "airfield", "passenger terminal", "airport authority"],
    businessTerms: {
      queryTerms: ["international airport", "airport terminal", "airport authority", "aerodrome"],
      osmTags: [
        { key: "aeroway", value: "aerodrome" },
        { key: "aeroway", value: "terminal" },
      ],
      googleTypes: ["airport"],
      yelpCategories: ["airports"],
      foursquareCategories: ["Airport", "Airport Terminal"],
    },
    jobTerms: {
      titles: ["Airport Operations Manager", "Aviation Systems Engineer", "Airfield Operations Specialist"],
      keywords: ["airport operations", "icao", "iata", "aviation compliance"],
    },
  },
  {
    id: "airports_regional_cargo",
    name: "Regional & Cargo Airports",
    categoryId: "aviation_airports",
    industryGroup: "Airports & Operators",
    subCategory: "Airports",
    niche: "Cargo & Regional Logistics",
    businessType: "Cargo Airport",
    isPopular: false,
    applicableModes: ["physical"],
    aliases: ["cargo airport", "regional airport", "air cargo terminal", "airfield", "general aviation airport", "freight terminal"],
    businessTerms: {
      queryTerms: ["cargo airport", "regional airport", "air cargo hub", "general aviation airfield"],
      osmTags: [
        { key: "aeroway", value: "aerodrome" },
        { key: "aeroway", value: "hangar" },
      ],
      googleTypes: ["airport"],
      yelpCategories: ["airports"],
      foursquareCategories: ["Airport"],
    },
    jobTerms: {
      titles: ["Air Cargo Coordinator", "Airfield Safety Inspector"],
      keywords: ["cargo logistics", "air freight", "runway operations"],
    },
  },
  {
    id: "airport_commercial_retail",
    name: "Airport Duty-Free, Retail & Lounges",
    categoryId: "aviation_airports",
    industryGroup: "Airport Commercial Businesses",
    subCategory: "Commercial Facilities",
    niche: "Airport Retail & Lounges",
    businessType: "Duty-Free & Airport Concessions",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["duty free", "airport retail", "airport lounge", "vip lounge", "airport restaurant", "airport car rental", "airport hotel", "airport currency exchange"],
    businessTerms: {
      queryTerms: ["duty free shop airport", "airport vip lounge", "airport restaurant", "airport car rental"],
      osmTags: [
        { key: "shop", value: "duty_free" },
        { key: "amenity", value: "airport_lounge" },
        { key: "amenity", value: "bureau_de_change" },
        { key: "amenity", value: "car_rental" },
      ],
      googleTypes: ["duty_free_store", "airport", "car_rental"],
      yelpCategories: ["dutyfreeshops", "airportlounges"],
      foursquareCategories: ["Airport Lounge", "Duty-Free Shop", "Rental Car Location"],
    },
    jobTerms: {
      titles: ["Airport Retail Concession Manager", "Lounge Hospitality Lead"],
      keywords: ["duty free retail", "airport concessions", "passenger experience"],
    },
  },
  {
    id: "aviation_passenger_airlines",
    name: "Passenger & Charter Airlines",
    categoryId: "aviation_airports",
    industryGroup: "Airlines & Air Operators",
    subCategory: "Airlines",
    niche: "Commercial & Private Aviation",
    businessType: "Aviation Operator",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["airline", "passenger airline", "charter flight", "private jet charter", "helicopter charter", "regional carrier", "business aviation"],
    businessTerms: {
      queryTerms: ["airline office", "air charter company", "private jet service", "airline ticketing office"],
      osmTags: [
        { key: "office", value: "airline" },
        { key: "aeroway", value: "helipad" },
        { key: "office", value: "travel_agent" },
      ],
      googleTypes: ["travel_agency", "airport"],
      yelpCategories: ["airlines"],
      foursquareCategories: ["Airlines", "Travel Agency"],
    },
    jobTerms: {
      titles: ["Airline Operations Planner", "Flight Dispatcher", "Aviation Software Developer"],
      keywords: ["airline reservations", "gds", "flight operations", "sabre", "amadeus"],
    },
  },
  {
    id: "aircraft_maintenance_mro",
    name: "Aircraft Maintenance, Repair & Avionics (MRO)",
    categoryId: "aviation_airports",
    industryGroup: "Aircraft & Aviation Services",
    subCategory: "Aviation Maintenance",
    niche: "MRO & Avionics",
    businessType: "Aircraft Repair Station",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["aircraft maintenance", "mro", "avionics repair", "aircraft parts", "flight school", "aviation consulting", "ground handling services"],
    businessTerms: {
      queryTerms: ["aircraft maintenance hangar", "aviation avionics repair", "flight training academy", "ground support services"],
      osmTags: [
        { key: "aeroway", value: "hangar" },
        { key: "industrial", value: "aircraft_repair" },
        { key: "amenity", value: "flight_school" },
      ],
      googleTypes: ["airport", "general_contractor"],
      yelpCategories: ["aviationcourses", "flightinstruction"],
      foursquareCategories: ["Flight School", "Airport"],
    },
    jobTerms: {
      titles: ["Avionics Engineer", "Aircraft Technician", "Flight Instructor"],
      keywords: ["faa", "easa", "avionics", "aircraft maintenance", "mro"],
    },
  },

  // ==========================================
  // 2. AGRICULTURE & AGRIBUSINESS
  // ==========================================
  {
    id: "commercial_coffee_farming",
    name: "Commercial Coffee, Tea & Crop Farms",
    categoryId: "agriculture_agribusiness",
    industryGroup: "Crop Farming",
    subCategory: "Commercial Plantations",
    niche: "Cash Crops & Grains",
    businessType: "Commercial Plantation / Farm",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["coffee farm", "tea estate", "coffee plantation", "grain farm", "maize farm", "wheat farm", "commercial agriculture", "horticulture farm"],
    businessTerms: {
      queryTerms: ["commercial coffee farm", "tea plantation estate", "agricultural grain farm", "horticultural farm"],
      osmTags: [
        { key: "landuse", value: "farmland" },
        { key: "landuse", value: "orchard" },
        { key: "landuse", value: "plant_nursery" },
      ],
      googleTypes: ["farm"],
      yelpCategories: ["farms"],
      foursquareCategories: ["Farm"],
    },
    jobTerms: {
      titles: ["Agronomist", "Farm Manager", "AgriTech Software Engineer", "Supply Chain Agricultural Analyst"],
      keywords: ["agronomy", "crop management", "soil science", "precision agriculture"],
    },
  },
  {
    id: "livestock_dairy_poultry",
    name: "Livestock, Dairy & Poultry Production",
    categoryId: "agriculture_agribusiness",
    industryGroup: "Livestock & Animal Farming",
    subCategory: "Animal Agriculture",
    niche: "Dairy & Poultry",
    businessType: "Livestock Farm / Dairy",
    isPopular: false,
    applicableModes: ["physical"],
    aliases: ["cattle farm", "dairy farm", "poultry farm", "egg producer", "beef production", "animal feed manufacturer", "veterinary agriculture"],
    businessTerms: {
      queryTerms: ["commercial dairy farm", "poultry farm chicken", "livestock feed supplier", "cattle ranch"],
      osmTags: [
        { key: "landuse", value: "farmyard" },
        { key: "animal", value: "cattle" },
        { key: "animal", value: "poultry" },
      ],
      googleTypes: ["farm"],
      yelpCategories: ["farms"],
      foursquareCategories: ["Farm"],
    },
    jobTerms: {
      titles: ["Livestock Manager", "Veterinary Agricultural Officer"],
      keywords: ["dairy science", "animal husbandry", "veterinary feed"],
    },
  },
  {
    id: "agri_chemicals_equipment",
    name: "Agricultural Equipment, Irrigation & Fertilizer",
    categoryId: "agriculture_agribusiness",
    industryGroup: "Agricultural Inputs & Machinery",
    subCategory: "Farm Machinery & Inputs",
    niche: "Equipment & Irrigation",
    businessType: "Agri-Inputs Dealer / Manufacturer",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["tractor dealer", "farm machinery", "fertilizer supplier", "pesticides", "irrigation systems", "seed distributor", "agritech company"],
    businessTerms: {
      queryTerms: ["agricultural machinery equipment dealer", "fertilizer supplier", "irrigation system supplier", "seed distributor"],
      osmTags: [
        { key: "shop", value: "agrarian" },
        { key: "shop", value: "farm" },
        { key: "craft", value: "agricultural_engines" },
      ],
      googleTypes: ["store", "hardware_store"],
      yelpCategories: ["farms", "gardening"],
      foursquareCategories: ["Garden Center", "Hardware Store"],
    },
    jobTerms: {
      titles: ["AgriTech Hardware Specialist", "Irrigation Engineer"],
      keywords: ["precision irrigation", "agrochemicals", "farm automation"],
    },
  },

  // ==========================================
  // 3. MINING & MINERALS
  // ==========================================
  {
    id: "mining_exploration_quarries",
    name: "Mining, Minerals Exploration & Quarries",
    categoryId: "mining_minerals",
    industryGroup: "Mining & Extraction",
    subCategory: "Mineral Extraction",
    niche: "Minerals & Quarries",
    businessType: "Mining Site / Quarry",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["gold mining", "copper mining", "lithium exploration", "quarry", "stone quarry", "granite mining", "mineral processing", "mining equipment"],
    businessTerms: {
      queryTerms: ["mining company office", "stone quarry", "mineral exploration company", "mining equipment supplier"],
      osmTags: [
        { key: "landuse", value: "quarry" },
        { key: "industrial", value: "mine" },
      ],
      googleTypes: ["general_contractor"],
      yelpCategories: ["contractors"],
      foursquareCategories: ["Factory"],
    },
    jobTerms: {
      titles: ["Mining Engineer", "Geologist", "Mineral Processing Specialist"],
      keywords: ["geology", "gis", "mining safety", "mineral processing"],
    },
  },

  // ==========================================
  // 4. OIL, GAS & ENERGY UTILITIES
  // ==========================================
  {
    id: "oil_gas_fuel_stations",
    name: "Oil & Gas, Fuel Stations & Refineries",
    categoryId: "oil_gas",
    industryGroup: "Petroleum & Gas",
    subCategory: "Fuel Distribution",
    niche: "Petroleum & LPG",
    businessType: "Fuel Station / Oil Depot",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["petrol station", "gas station", "fuel station", "lpg gas supplier", "petroleum distributor", "oil drilling", "pipeline company"],
    businessTerms: {
      queryTerms: ["petrol fuel station", "lpg gas distributor", "petroleum depot", "oil company office"],
      osmTags: [
        { key: "amenity", value: "fuel" },
        { key: "industrial", value: "oil_refinery" },
      ],
      googleTypes: ["gas_station"],
      yelpCategories: ["servicestations"],
      foursquareCategories: ["Gas Station"],
    },
    jobTerms: {
      titles: ["Petroleum Engineer", "Health Safety Environment Officer"],
      keywords: ["oil gas", "hse", "pipeline", "refinery"],
    },
  },
  {
    id: "solar_renewable_energy",
    name: "Solar Energy & Renewable Installation",
    categoryId: "energy_utilities",
    industryGroup: "Renewable Energy",
    subCategory: "Solar & Clean Energy",
    niche: "Solar Installation",
    businessType: "Solar Contractor / Clean Energy",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["solar installation", "solar panels", "renewable energy", "inverter battery", "wind energy", "clean energy installer", "commercial solar"],
    businessTerms: {
      queryTerms: ["solar panel installation company", "renewable energy installer", "commercial solar systems"],
      osmTags: [
        { key: "craft", value: "electrician" },
        { key: "shop", value: "solar" },
        { key: "plant:source", value: "solar" },
      ],
      googleTypes: ["electrician", "general_contractor"],
      yelpCategories: ["solarinstallation"],
      foursquareCategories: ["Solar Energy Company"],
    },
    jobTerms: {
      titles: ["Solar Design Engineer", "Renewable Energy Project Manager", "CleanTech Software Engineer"],
      keywords: ["pvyst", "autocad", "solar pv", "clean energy", "microgrid"],
    },
  },

  // ==========================================
  // 5. MANUFACTURING
  // ==========================================
  {
    id: "food_beverage_manufacturing",
    name: "Food, Beverage & FMCG Manufacturing",
    categoryId: "manufacturing",
    industryGroup: "Food & Consumer Goods",
    subCategory: "Food Processing",
    niche: "FMCG Processing",
    businessType: "Food Processing Plant",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["food processing plant", "beverage factory", "bakery manufacturing", "bottled water plant", "dairy processing factory", "grain milling plant"],
    businessTerms: {
      queryTerms: ["food manufacturing factory", "beverage bottling plant", "commercial bakery factory", "flour milling plant"],
      osmTags: [
        { key: "industrial", value: "food_processing" },
        { key: "industrial", value: "brewery" },
        { key: "craft", value: "brewery" },
      ],
      googleTypes: ["food", "store"],
      yelpCategories: ["fooddeliveryservices"],
      foursquareCategories: ["Factory"],
    },
    jobTerms: {
      titles: ["Quality Assurance Manager", "Plant Operations Lead", "Food Scientist"],
      keywords: ["haccp", "iso 22000", "fmcg manufacturing", "plant operations"],
    },
  },
  {
    id: "industrial_machinery_metal",
    name: "Machinery, Metal Fabrication & Chemicals",
    categoryId: "manufacturing",
    industryGroup: "Heavy & Industrial Manufacturing",
    subCategory: "Metal & Machinery",
    niche: "Fabrication & Chemicals",
    businessType: "Metal Fabrication / Factory",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["metal fabrication", "steel manufacturing", "industrial machinery", "chemical plant", "plastics manufacturing", "cnc machining"],
    businessTerms: {
      queryTerms: ["metal fabrication workshop", "steel manufacturing plant", "industrial machinery factory", "plastic molding factory"],
      osmTags: [
        { key: "craft", value: "metal_construction" },
        { key: "industrial", value: "factory" },
      ],
      googleTypes: ["general_contractor"],
      yelpCategories: ["contractors"],
      foursquareCategories: ["Factory"],
    },
    jobTerms: {
      titles: ["Mechanical Design Engineer", "Automation Engineer", "CNC Programmer"],
      keywords: ["solidworks", "plc", "industrial automation", "metal fabrication"],
    },
  },

  // ==========================================
  // 6. CONSTRUCTION & CIVIL INFRASTRUCTURE
  // ==========================================
  {
    id: "plumbing",
    name: "Plumbers & Plumbing Services",
    categoryId: "construction",
    industryGroup: "Trade Contractors",
    subCategory: "Plumbing & Piping",
    niche: "Residential & Commercial Plumbing",
    businessType: "Plumbing Contractor",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["plumber", "drain cleaning", "pipe repair", "water heater repair", "commercial plumbing", "emergency plumber"],
    businessTerms: {
      queryTerms: ["plumber", "plumbing contractor", "emergency plumbing repair", "drain cleaning"],
      osmTags: [
        { key: "craft", value: "plumber" },
        { key: "shop", value: "trade" },
      ],
      googleTypes: ["plumber"],
      yelpCategories: ["plumbing"],
      foursquareCategories: ["Plumbing Service"],
    },
    jobTerms: {
      titles: ["Master Plumber", "Plumbing Estimator", "Project Manager"],
      keywords: ["plumbing", "pipefitting", "estimating"],
    },
  },
  {
    id: "electrical_contracting",
    name: "Electricians & Electrical Contracting",
    categoryId: "construction",
    industryGroup: "Trade Contractors",
    subCategory: "Electrical",
    niche: "Electrical Contracting",
    businessType: "Electrical Contractor",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["electrician", "electrical wiring", "circuit repair", "commercial electrician", "lighting installation", "generator installation"],
    businessTerms: {
      queryTerms: ["electrician", "electrical contractor", "commercial electrical services"],
      osmTags: [
        { key: "craft", value: "electrician" },
      ],
      googleTypes: ["electrician"],
      yelpCategories: ["electricians"],
      foursquareCategories: ["Electrician"],
    },
    jobTerms: {
      titles: ["Licensed Electrician", "Electrical Estimator"],
      keywords: ["electrical wiring", "nec", "high voltage"],
    },
  },
  {
    id: "hvac_air_conditioning",
    name: "HVAC, Air Conditioning & Refrigeration",
    categoryId: "construction",
    industryGroup: "Trade Contractors",
    subCategory: "HVAC & Cooling",
    niche: "HVAC Services",
    businessType: "HVAC Contractor",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["hvac", "air conditioning repair", "heating installation", "commercial refrigeration", "cold storage repair"],
    businessTerms: {
      queryTerms: ["hvac contractor", "air conditioning repair company", "commercial refrigeration service"],
      osmTags: [
        { key: "craft", value: "hvac" },
      ],
      googleTypes: ["hvac_contractor"],
      yelpCategories: ["hvac"],
      foursquareCategories: ["HVAC Service"],
    },
    jobTerms: {
      titles: ["HVAC Technician", "Refrigeration Specialist"],
      keywords: ["hvac", "refrigeration", "epa certification"],
    },
  },
  {
    id: "roofing_building_contractors",
    name: "Roofing, General Contracting & Civil Construction",
    categoryId: "construction",
    industryGroup: "General Contracting & Civil Works",
    subCategory: "General Construction",
    niche: "Building & Civil Works",
    businessType: "General Contractor / Civil Builder",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["roofing contractor", "general contractor", "building construction", "civil engineer builder", "road contractor", "renovation contractor"],
    businessTerms: {
      queryTerms: ["roofing contractor", "general building contractor", "civil engineering construction company"],
      osmTags: [
        { key: "craft", value: "roofer" },
        { key: "craft", value: "builder" },
        { key: "office", value: "architect" },
      ],
      googleTypes: ["roofing_contractor", "general_contractor"],
      yelpCategories: ["roofing", "contractors"],
      foursquareCategories: ["Roofing Service", "General Contractor"],
    },
    jobTerms: {
      titles: ["Construction Superintendent", "Civil Project Manager", "Estimator"],
      keywords: ["procore", "primavera", "construction management"],
    },
  },

  // ==========================================
  // 7. REAL ESTATE
  // ==========================================
  {
    id: "commercial_residential_real_estate",
    name: "Commercial & Residential Real Estate Agencies",
    categoryId: "real_estate",
    industryGroup: "Property Brokerage & Management",
    subCategory: "Real Estate Brokerage",
    niche: "Commercial & Residential Property",
    businessType: "Real Estate Brokerage / Agency",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["real estate agency", "property management company", "realtor", "commercial property leasing", "estate agent", "property valuation"],
    businessTerms: {
      queryTerms: ["real estate agency office", "property management company", "commercial real estate brokerage"],
      osmTags: [
        { key: "office", value: "estate_agent" },
        { key: "office", value: "property_management" },
      ],
      googleTypes: ["real_estate_agency"],
      yelpCategories: ["realestateagents", "propertymanagement"],
      foursquareCategories: ["Real Estate Office"],
    },
    jobTerms: {
      titles: ["Real Estate Asset Manager", "Commercial Leasing Specialist", "PropTech Product Manager"],
      keywords: ["mls", "commercial leasing", "real estate finance"],
    },
  },

  // ==========================================
  // 8. AUTOMOTIVE
  // ==========================================
  {
    id: "auto_repair",
    name: "Auto Repair, Mechanics & Service Garages",
    categoryId: "automotive",
    industryGroup: "Automotive Service & Repair",
    subCategory: "Auto Service",
    niche: "Mechanics & Garages",
    businessType: "Auto Repair Garage",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["mechanic", "auto garage", "car service", "brake repair", "engine diagnostic", "auto maintenance", "transmission repair"],
    businessTerms: {
      queryTerms: ["auto repair garage", "car mechanic workshop", "automotive engine repair"],
      osmTags: [
        { key: "shop", value: "car_repair" },
      ],
      googleTypes: ["car_repair"],
      yelpCategories: ["autorepair"],
      foursquareCategories: ["Automotive Shop"],
    },
    jobTerms: {
      titles: ["Master Auto Diagnostic Tech", "Service Advisor"],
      keywords: ["obd2", "ase certified", "fleet maintenance"],
    },
  },
  {
    id: "auto_body_detailing",
    name: "Auto Detailing, Car Wash & Body Paint",
    categoryId: "automotive",
    industryGroup: "Automotive Appearance & Body",
    subCategory: "Body & Detailing",
    niche: "Detailing & Collision",
    businessType: "Auto Detailing / Body Shop",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["car wash", "auto detailing", "car detailing", "auto body shop", "collision repair", "ceramic coating", "car painter", "paintless dent repair"],
    businessTerms: {
      queryTerms: ["car wash detailing center", "auto body collision repair paint", "ceramic coating car spa"],
      osmTags: [
        { key: "amenity", value: "car_wash" },
        { key: "craft", value: "car_painter" },
        { key: "shop", value: "car_repair" },
      ],
      googleTypes: ["car_wash", "car_repair"],
      yelpCategories: ["carwash", "bodyshops", "auto_detailing"],
      foursquareCategories: ["Car Wash", "Automotive Shop"],
    },
    jobTerms: {
      titles: ["Auto Body Painter", "Detailing Lead"],
      keywords: ["auto refinishing", "ceramic coating", "paint matching"],
    },
  },
  {
    id: "used_car_dealerships",
    name: "Car Dealerships & Vehicle Rental",
    categoryId: "automotive",
    industryGroup: "Automotive Sales & Rentals",
    subCategory: "Vehicle Dealerships",
    niche: "Car Dealerships & Rentals",
    businessType: "Automotive Dealership / Car Rental",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["car dealership", "used car dealer", "motorcycle dealer", "truck dealership", "car rental agency", "vehicle leasing"],
    businessTerms: {
      queryTerms: ["car dealership showroom", "used car dealer", "car rental agency"],
      osmTags: [
        { key: "shop", value: "car" },
        { key: "amenity", value: "car_rental" },
      ],
      googleTypes: ["car_dealer", "car_rental"],
      yelpCategories: ["car_dealers", "carrental"],
      foursquareCategories: ["Auto Dealership", "Rental Car Location"],
    },
    jobTerms: {
      titles: ["Dealership Sales Manager", "Fleet Operations Lead"],
      keywords: ["dealership crm", "automotive sales", "fleet leasing"],
    },
  },
  {
    id: "auto_parts_accessories",
    name: "Auto Parts, Tires & Battery Centers",
    categoryId: "automotive",
    industryGroup: "Automotive Parts & Supplies",
    subCategory: "Parts & Tires",
    niche: "Auto Spare Parts",
    businessType: "Auto Parts Store",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["auto parts", "car spares", "tire shop", "car battery supplier", "motorcycle parts", "oem parts dealer"],
    businessTerms: {
      queryTerms: ["auto spare parts shop", "car tire center replacement", "car battery dealer"],
      osmTags: [
        { key: "shop", value: "car_parts" },
        { key: "shop", value: "tyres" },
      ],
      googleTypes: ["auto_parts_store", "store"],
      yelpCategories: ["autoparts", "tires"],
      foursquareCategories: ["Auto Parts Store", "Tire Shop"],
    },
    jobTerms: {
      titles: ["Parts Inventory Specialist", "Counter Sales Lead"],
      keywords: ["parts catalog", "inventory management", "automotive aftermarket"],
    },
  },

  // ==========================================
  // 9. MARITIME, PORTS & WATERWAYS
  // ==========================================
  {
    id: "ports_container_terminals",
    name: "Commercial Ports, Terminals & Shipyards",
    categoryId: "maritime_ports",
    industryGroup: "Ports & Maritime Shipping",
    subCategory: "Maritime Terminals",
    niche: "Ports & Cargo Shipping",
    businessType: "Port Terminal / Shipyard",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["commercial port", "container terminal", "shipyard", "ship repair", "marine shipping company", "port logistics", "stevedoring"],
    businessTerms: {
      queryTerms: ["container port terminal", "shipyard ship repair", "marine shipping company office", "port authority"],
      osmTags: [
        { key: "industrial", value: "port" },
        { key: "industrial", value: "shipyard" },
      ],
      googleTypes: ["general_contractor"],
      yelpCategories: ["marinas"],
      foursquareCategories: ["Harbor / Marina"],
    },
    jobTerms: {
      titles: ["Marine Engineer", "Port Operations Coordinator", "Maritime Logistics Specialist"],
      keywords: ["maritime safety", "container terminal", "vessel navigation"],
    },
  },

  // ==========================================
  // 10. FORESTRY, TIMBER & FISHING
  // ==========================================
  {
    id: "commercial_forestry_timber",
    name: "Commercial Forestry, Timber & Sawmills",
    categoryId: "forestry_timber",
    industryGroup: "Forestry & Wood",
    subCategory: "Timber Processing",
    niche: "Lumber & Forestry",
    businessType: "Sawmill / Timber Processor",
    isPopular: false,
    applicableModes: ["physical"],
    aliases: ["forestry company", "timber supplier", "sawmill", "lumber yard", "wood processing", "logging contractor", "paper pulp"],
    businessTerms: {
      queryTerms: ["commercial sawmill timber", "lumber wood supplier", "forestry logging company"],
      osmTags: [
        { key: "industrial", value: "sawmill" },
        { key: "landuse", value: "forest" },
      ],
      googleTypes: ["general_contractor", "store"],
      yelpCategories: ["contractors"],
      foursquareCategories: ["Factory"],
    },
    jobTerms: {
      titles: ["Forester", "Timber Operations Manager"],
      keywords: ["silviculture", "timber harvesting", "fsc certification"],
    },
  },
  {
    id: "commercial_fishing_aquaculture",
    name: "Commercial Fishing, Aquaculture & Seafood Processing",
    categoryId: "fishing_aquaculture",
    industryGroup: "Aquaculture & Marine Catch",
    subCategory: "Fish Farming",
    niche: "Seafood & Hatcheries",
    businessType: "Fish Farm / Seafood Processor",
    isPopular: false,
    applicableModes: ["physical"],
    aliases: ["fish farm", "aquaculture", "tilapia farm", "shrimp hatchery", "seafood processing", "commercial fishing fleet"],
    businessTerms: {
      queryTerms: ["fish farm aquaculture hatchery", "commercial seafood processing plant", "fish processing factory"],
      osmTags: [
        { key: "landuse", value: "aquaculture" },
        { key: "industrial", value: "food_processing" },
      ],
      googleTypes: ["store"],
      yelpCategories: ["seafoodmarkets"],
      foursquareCategories: ["Fish Market", "Factory"],
    },
    jobTerms: {
      titles: ["Aquaculture Specialist", "Hatchery Manager"],
      keywords: ["aquaculture", "water quality", "fish nutrition"],
    },
  },

  // ==========================================
  // 11. WATER & ENVIRONMENTAL SERVICES
  // ==========================================
  {
    id: "water_treatment_waste_management",
    name: "Water Treatment, Desalination & Recycling",
    categoryId: "water_environmental",
    industryGroup: "Environmental Engineering",
    subCategory: "Water & Waste",
    niche: "Water Utilities & Recycling",
    businessType: "Water Treatment Plant / Waste Processor",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["water treatment plant", "desalination facility", "recycling center", "waste management company", "hazardous waste disposal", "environmental testing lab"],
    businessTerms: {
      queryTerms: ["water treatment plant supplier", "commercial recycling center", "waste management collection company"],
      osmTags: [
        { key: "amenity", value: "recycling" },
        { key: "amenity", value: "waste_transfer_station" },
        { key: "man_made", value: "water_works" },
      ],
      googleTypes: ["local_government_office", "general_contractor"],
      yelpCategories: ["recyclingcenter"],
      foursquareCategories: ["Recycling Facility"],
    },
    jobTerms: {
      titles: ["Environmental Engineer", "Water Systems Operator"],
      keywords: ["water purification", "scada", "waste management", "environmental compliance"],
    },
  },

  // ==========================================
  // 12. WHOLESALE & DISTRIBUTION
  // ==========================================
  {
    id: "wholesale_fmcg_distribution",
    name: "Wholesale FMCG, Food & Beverage Distributors",
    categoryId: "wholesale_distribution",
    industryGroup: "Wholesale Trade",
    subCategory: "FMCG Distribution",
    niche: "Food & Consumer Goods Wholesale",
    businessType: "Wholesale Depot / Distributor",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["wholesale distributor", "fmcg distributor", "bulk food supplier", "beverage distributor", "commodity wholesaler", "import export trading"],
    businessTerms: {
      queryTerms: ["fmcg wholesale distributor depot", "bulk food beverage distributor", "wholesale merchant warehouse"],
      osmTags: [
        { key: "shop", value: "wholesale" },
        { key: "building", value: "warehouse" },
      ],
      googleTypes: ["wholesale_store", "store"],
      yelpCategories: ["wholesale_stores"],
      foursquareCategories: ["Wholesale Store", "Warehouse"],
    },
    jobTerms: {
      titles: ["Distribution Channel Manager", "Wholesale Account Lead"],
      keywords: ["fmcg sales", "distribution logistics", "trade marketing"],
    },
  },

  // ==========================================
  // 13. RETAIL & E-COMMERCE
  // ==========================================
  {
    id: "supermarkets_grocery_retail",
    name: "Supermarkets, Hypermarkets & Department Stores",
    categoryId: "retail_ecommerce",
    industryGroup: "Consumer Retail",
    subCategory: "Grocery & Department Stores",
    niche: "Supermarkets & Retail Stores",
    businessType: "Supermarket / Department Store",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["supermarket", "hypermarket", "grocery store", "department store", "convenience store", "retail mall store"],
    businessTerms: {
      queryTerms: ["supermarket", "hypermarket retail store", "department store shopping"],
      osmTags: [
        { key: "shop", value: "supermarket" },
        { key: "shop", value: "department_store" },
        { key: "shop", value: "convenience" },
      ],
      googleTypes: ["supermarket", "department_store", "grocery_or_supermarket"],
      yelpCategories: ["grocery", "deptstores"],
      foursquareCategories: ["Supermarket", "Department Store"],
    },
    jobTerms: {
      titles: ["Retail Store Manager", "Inventory Merchandiser"],
      keywords: ["pos system", "retail inventory", "loss prevention"],
    },
  },
  {
    id: "fashion_electronics_retail",
    name: "Fashion, Electronics, Home & Hardware Retail",
    categoryId: "retail_ecommerce",
    industryGroup: "Specialty Retail",
    subCategory: "Specialty Stores",
    niche: "Apparel, Tech & Hardware",
    businessType: "Specialty Retail Store",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["clothing store", "electronics shop", "hardware store", "furniture showroom", "pharmacy retail", "jewelry store", "optician"],
    businessTerms: {
      queryTerms: ["electronics retail store", "fashion boutique apparel", "hardware tools shop", "furniture showroom"],
      osmTags: [
        { key: "shop", value: "electronics" },
        { key: "shop", value: "clothes" },
        { key: "shop", value: "hardware" },
        { key: "shop", value: "furniture" },
      ],
      googleTypes: ["electronics_store", "clothing_store", "hardware_store", "furniture_store"],
      yelpCategories: ["electronics", "womenscloth", "hardware"],
      foursquareCategories: ["Electronics Store", "Clothing Store", "Hardware Store"],
    },
    jobTerms: {
      titles: ["E-Commerce Specialist", "Retail Buyer", "Visual Merchandiser"],
      keywords: ["shopify", "retail merchandise", "inventory replenishment"],
    },
  },

  // ==========================================
  // 14. TRANSPORTATION & LOGISTICS
  // ==========================================
  {
    id: "freight_trucking_transport",
    name: "Freight Trucking, Road Haulage & Rail",
    categoryId: "transportation",
    industryGroup: "Freight & Heavy Transport",
    subCategory: "Road & Rail Freight",
    niche: "Heavy Haulage",
    businessType: "Freight Carrier / Haulage Company",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["trucking company", "freight carrier", "road haulage", "heavy transport", "container haulage", "rail freight operator", "bulk transport"],
    businessTerms: {
      queryTerms: ["freight trucking company office", "road haulage transporter", "heavy transport cargo carrier"],
      osmTags: [
        { key: "amenity", value: "fuel" },
        { key: "office", value: "logistics" },
      ],
      googleTypes: ["moving_company", "general_contractor"],
      yelpCategories: ["trucking"],
      foursquareCategories: ["Moving Company"],
    },
    jobTerms: {
      titles: ["Fleet Dispatcher", "Transport Operations Manager"],
      keywords: ["fleet telematics", "eld", "route dispatch", "freight billing"],
    },
  },
  {
    id: "warehousing_3pl_logistics",
    name: "Warehousing, 3PL Fulfillment & Cold Storage",
    categoryId: "logistics_supply_chain",
    industryGroup: "Logistics & Warehousing",
    subCategory: "Warehousing & Fulfillment",
    niche: "3PL & Cold Storage",
    businessType: "3PL Warehouse / Fulfillment Center",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["warehousing company", "3pl fulfillment", "cold storage facility", "freight forwarding", "customs broker", "last mile courier", "fulfillment hub"],
    businessTerms: {
      queryTerms: ["warehousing fulfillment center", "3pl logistics facility", "cold storage logistics company", "customs clearing forwarder"],
      osmTags: [
        { key: "building", value: "warehouse" },
        { key: "office", value: "logistics" },
        { key: "amenity", value: "courier" },
      ],
      googleTypes: ["moving_company", "storage"],
      yelpCategories: ["couriers", "storage"],
      foursquareCategories: ["Warehouse", "Storage Facility"],
    },
    jobTerms: {
      titles: ["Supply Chain Architect", "Warehouse Operations Director", "Logistics Analyst"],
      keywords: ["wms", "tms", "inventory modeling", "cold chain logistics"],
    },
  },

  // ==========================================
  // 15. HOSPITALITY & FOOD & BEVERAGE
  // ==========================================
  {
    id: "hotels_luxury_resorts",
    name: "Hotels, Luxury Resorts & Lodges",
    categoryId: "hospitality",
    industryGroup: "Accommodation & Lodging",
    subCategory: "Hotels & Resorts",
    niche: "Luxury & Boutique Accommodation",
    businessType: "Hotel / Luxury Resort",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["hotel", "resort", "luxury hotel", "boutique hotel", "safari lodge", "vacation rental", "serviced apartment", "guesthouse"],
    businessTerms: {
      queryTerms: ["luxury hotel resort", "boutique hotel", "safari lodge accommodation", "serviced apartments"],
      osmTags: [
        { key: "tourism", value: "hotel" },
        { key: "tourism", value: "resort" },
        { key: "tourism", value: "guest_house" },
      ],
      googleTypes: ["lodging"],
      yelpCategories: ["hotels", "resorts"],
      foursquareCategories: ["Hotel", "Resort"],
    },
    jobTerms: {
      titles: ["Hotel General Manager", "Hospitality Revenue Manager"],
      keywords: ["hospitality management", "opera pms", "hotel distribution"],
    },
  },
  {
    id: "restaurants_cafes_dining",
    name: "Restaurants, Cafes, Bars & Bakeries",
    categoryId: "food_beverage",
    industryGroup: "Dining & Food Service",
    subCategory: "Restaurants & Bars",
    niche: "Dining & Beverage",
    businessType: "Restaurant / Cafe / Bar",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["restaurant", "cafe", "coffee shop", "bar", "bakery", "pizzeria", "fine dining", "fast food", "craft brewery"],
    businessTerms: {
      queryTerms: ["restaurant", "coffee cafe", "bakery", "bar lounge", "craft brewery"],
      osmTags: [
        { key: "amenity", value: "restaurant" },
        { key: "amenity", value: "cafe" },
        { key: "amenity", value: "fast_food" },
        { key: "amenity", value: "bar" },
        { key: "shop", value: "bakery" },
      ],
      googleTypes: ["restaurant", "cafe", "bakery", "bar"],
      yelpCategories: ["restaurants", "cafes", "bakeries", "bars"],
      foursquareCategories: ["Restaurant", "Cafe", "Bakery", "Bar"],
    },
    jobTerms: {
      titles: ["Executive Chef", "Restaurant General Manager", "Beverage Director"],
      keywords: ["culinary operations", "food cost control", "pos toast"],
    },
  },

  // ==========================================
  // 16. INFORMATION TECHNOLOGY & SOFTWARE
  // ==========================================
  {
    id: "b2b_saas_software",
    name: "Software Companies, SaaS & IT Services",
    categoryId: "information_technology",
    industryGroup: "Software & Cloud",
    subCategory: "SaaS & IT",
    niche: "B2B SaaS & Tech",
    businessType: "Software Company",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["software company", "saas company", "it consulting", "cloud computing", "devops agency", "cybersecurity firm", "data center", "ai company"],
    businessTerms: {
      queryTerms: ["software development company", "saas technology office", "it consulting services firm"],
      osmTags: [
        { key: "office", value: "it" },
        { key: "office", value: "software" },
      ],
      googleTypes: ["store"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Tech Startup", "IT Services"],
    },
    jobTerms: {
      titles: ["Full-Stack Engineer", "Senior React Developer", "Cloud Architect", "DevOps Engineer", "AI ML Engineer"],
      keywords: ["next.js", "react", "typescript", "python", "aws", "docker", "kubernetes", "ai"],
    },
  },
  {
    id: "software_development",
    name: "Software & Web Development Agencies",
    categoryId: "information_technology",
    industryGroup: "Software & Web",
    subCategory: "Engineering",
    niche: "Full-Stack Development",
    businessType: "Development Agency",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["web developer", "software engineer", "frontend developer", "backend engineer", "mobile app developer"],
    businessTerms: {
      queryTerms: ["web development agency", "mobile app software studio"],
      osmTags: [
        { key: "office", value: "it" },
        { key: "office", value: "software" },
      ],
      googleTypes: ["store"],
      yelpCategories: ["web_design"],
      foursquareCategories: ["Tech Startup"],
    },
    jobTerms: {
      titles: ["Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Engineer", "Senior Developer"],
      keywords: ["javascript", "typescript", "react", "node", "python", "sql", "api", "next.js"],
    },
  },

  // ==========================================
  // 17. TELECOMMUNICATIONS & MEDIA
  // ==========================================
  {
    id: "telecom_operators_broadband",
    name: "Telecom Carriers, Fiber Broadband & ISP",
    categoryId: "telecommunications",
    industryGroup: "Telecommunications",
    subCategory: "Telecom Providers",
    niche: "Carriers & Broadband",
    businessType: "Telecom Carrier / ISP",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["mobile operator", "isp", "fiber internet", "broadband provider", "satellite internet", "telecom towers", "5g networks"],
    businessTerms: {
      queryTerms: ["telecom carrier customer center", "internet service provider isp office", "fiber broadband company"],
      osmTags: [
        { key: "shop", value: "telecommunication" },
        { key: "office", value: "telecommunication" },
        { key: "man_made", value: "mast" },
      ],
      googleTypes: ["store", "local_government_office"],
      yelpCategories: ["telecom"],
      foursquareCategories: ["Telecommunication Service"],
    },
    jobTerms: {
      titles: ["Network Systems Engineer", "Telecom Infrastructure Lead", "RF Engineer"],
      keywords: ["bgp", "mpls", "fiber optics", "5g ran", "cisco"],
    },
  },
  {
    id: "digital_media_broadcasting",
    name: "TV, Radio, Film Studios & Digital Media",
    categoryId: "media_entertainment",
    industryGroup: "Media Production",
    subCategory: "Broadcasting & Digital Media",
    niche: "Studios & Publishing",
    businessType: "Media Studio / Publishing House",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["tv station", "radio station", "film production studio", "podcast studio", "digital publication", "animation studio", "music recording studio"],
    businessTerms: {
      queryTerms: ["film tv production studio", "radio broadcasting station office", "recording studio audio"],
      osmTags: [
        { key: "office", value: "newspaper" },
        { key: "office", value: "studio" },
      ],
      googleTypes: ["local_government_office"],
      yelpCategories: ["media"],
      foursquareCategories: ["Studio", "Broadcast Studio"],
    },
    jobTerms: {
      titles: ["Media Producer", "Video Content Strategist", "Audio Engineer"],
      keywords: ["premiere pro", "broadcast media", "video production", "davinci resolve"],
    },
  },
  {
    id: "digital_marketing_agencies",
    name: "Digital Marketing, SEO & PR Agencies",
    categoryId: "marketing_advertising",
    industryGroup: "Marketing & Advertising Agencies",
    subCategory: "Digital Marketing",
    niche: "SEO, Performance & PR",
    businessType: "Marketing Agency",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["marketing agency", "seo agency", "social media agency", "pr firm", "branding agency", "advertising agency", "growth marketing"],
    businessTerms: {
      queryTerms: ["digital marketing advertising agency", "public relations pr firm office", "seo search marketing company"],
      osmTags: [
        { key: "office", value: "advertising" },
        { key: "office", value: "consulting" },
      ],
      googleTypes: ["local_government_office"],
      yelpCategories: ["marketing"],
      foursquareCategories: ["Marketing Agency"],
    },
    jobTerms: {
      titles: ["Growth Marketing Manager", "SEO Strategist", "Paid Acquisition Lead", "Content Marketing Manager"],
      keywords: ["seo", "google ads", "meta ads", "conversion optimization", "hubspot"],
    },
  },

  // ==========================================
  // 17. BANKING, FINANCE, INSURANCE & INVESTMENTS
  // ==========================================
  {
    id: "commercial_banking_fintech",
    name: "Commercial Banks, Microfinance & FinTech",
    categoryId: "banking_finance",
    industryGroup: "Banking & Financial Services",
    subCategory: "Banking",
    niche: "Banks & FinTech",
    businessType: "Bank Branch / FinTech Office",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["commercial bank", "bank branch", "microfinance institution", "fintech company", "mobile money agency", "forex bureau"],
    businessTerms: {
      queryTerms: ["commercial bank branch", "microfinance institution office", "fintech payments company"],
      osmTags: [
        { key: "amenity", value: "bank" },
        { key: "amenity", value: "atm" },
      ],
      googleTypes: ["bank", "finance"],
      yelpCategories: ["banks"],
      foursquareCategories: ["Bank", "Financial or Legal Service"],
    },
    jobTerms: {
      titles: ["FinTech Product Manager", "Financial Analyst", "Compliance Officer"],
      keywords: ["banking systems", "payments api", "swift", "aml kyc"],
    },
  },
  {
    id: "insurance_agencies_brokerage",
    name: "Insurance Companies & Brokerages",
    categoryId: "insurance",
    industryGroup: "Insurance",
    subCategory: "Insurance Brokerage",
    niche: "Insurance Services",
    businessType: "Insurance Brokerage / Agency",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["insurance agency", "insurance broker", "health insurance", "property insurance", "auto insurance agency", "life insurance"],
    businessTerms: {
      queryTerms: ["insurance brokerage agency office", "commercial insurance company"],
      osmTags: [
        { key: "office", value: "insurance" },
      ],
      googleTypes: ["insurance_agency"],
      yelpCategories: ["insurance"],
      foursquareCategories: ["Insurance Broker"],
    },
    jobTerms: {
      titles: ["Underwriter", "Insurance Claims Analyst", "Actuary"],
      keywords: ["insurance underwriting", "claims management", "actuarial"],
    },
  },
  {
    id: "venture_capital_private_equity",
    name: "Venture Capital, Private Equity & Asset Management",
    categoryId: "investment_capital_markets",
    industryGroup: "Investment Funds",
    subCategory: "Capital Markets",
    niche: "VC & Private Equity",
    businessType: "Investment Firm / Asset Manager",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["venture capital", "private equity", "wealth management", "hedge fund", "family office", "investment bank", "stock brokerage"],
    businessTerms: {
      queryTerms: ["venture capital firm office", "private equity asset management", "wealth management advisory office"],
      osmTags: [
        { key: "office", value: "financial" },
      ],
      googleTypes: ["finance"],
      yelpCategories: ["financialadvising"],
      foursquareCategories: ["Financial or Legal Service"],
    },
    jobTerms: {
      titles: ["Investment Associate", "Portfolio Manager", "Financial Modeler"],
      keywords: ["dcf modeling", "lbo", "due diligence", "term sheet"],
    },
  },

  // ==========================================
  // 18. PROFESSIONAL SERVICES & LEGAL
  // ==========================================
  {
    id: "law_firms_corporate_legal",
    name: "Law Firms, Attorneys & Legal Consultancies",
    categoryId: "legal_compliance",
    industryGroup: "Legal Services",
    subCategory: "Law Practices",
    niche: "Corporate & Civil Law",
    businessType: "Law Firm / Legal Practice",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["law firm", "advocate", "attorney", "corporate lawyer", "commercial law firm", "legal consultant", "notary public"],
    businessTerms: {
      queryTerms: ["law firm advocates office", "corporate legal services attorney", "commercial law practice"],
      osmTags: [
        { key: "office", value: "lawyer" },
      ],
      googleTypes: ["lawyer"],
      yelpCategories: ["lawyers"],
      foursquareCategories: ["Law Firm"],
    },
    jobTerms: {
      titles: ["Corporate Counsel", "Legal Compliance Associate", "Paralegal"],
      keywords: ["contract negotiation", "compliance", "corporate governance"],
    },
  },
  {
    id: "accounting_auditing_tax",
    name: "Accounting, Tax & Management Consulting Firms",
    categoryId: "professional_services",
    industryGroup: "Accounting & Consulting",
    subCategory: "Accounting & Advisory",
    niche: "Tax & Advisory",
    businessType: "Accounting Firm / Consulting Office",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["accounting firm", "auditing firm", "tax consultant", "cpa", "management consulting", "business advisory firm"],
    businessTerms: {
      queryTerms: ["accounting auditing firm", "tax consultant office", "management consulting agency"],
      osmTags: [
        { key: "office", value: "accountant" },
        { key: "office", value: "consulting" },
      ],
      googleTypes: ["accounting"],
      yelpCategories: ["accountants"],
      foursquareCategories: ["Accounting Firm"],
    },
    jobTerms: {
      titles: ["Senior Auditor", "Management Consultant", "Tax Strategist"],
      keywords: ["gaap", "ifrs", "tax advisory", "financial modeling"],
    },
  },

  // ==========================================
  // 19. HEALTHCARE, PHARMA & BIOTECH
  // ==========================================
  {
    id: "private_hospitals_clinics",
    name: "Private Hospitals, Medical Centers & Specialized Care",
    categoryId: "healthcare",
    industryGroup: "Medical Facilities",
    subCategory: "Hospitals & Clinics",
    niche: "Hospitals & Diagnostics",
    businessType: "Private Hospital / Medical Center",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["private hospital", "medical center", "diagnostic lab", "specialist clinic", "urgent care", "radiology center"],
    businessTerms: {
      queryTerms: ["private hospital", "medical clinic center", "diagnostic medical laboratory"],
      osmTags: [
        { key: "amenity", value: "hospital" },
        { key: "amenity", value: "clinic" },
        { key: "amenity", value: "doctors" },
      ],
      googleTypes: ["hospital", "doctor"],
      yelpCategories: ["hospitals", "medcenters"],
      foursquareCategories: ["Hospital", "Medical Center"],
    },
    jobTerms: {
      titles: ["Clinical Director", "Healthcare IT Administrator", "Telemedicine Physician"],
      keywords: ["emr", "ehr", "hipaa", "clinical informatics"],
    },
  },
  {
    id: "dentistry",
    name: "Dentists & Dental Clinics",
    categoryId: "healthcare",
    industryGroup: "Dental Services",
    subCategory: "Dentistry",
    niche: "Dental Care",
    businessType: "Dental Practice",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["dentist", "dental clinic", "orthodontist", "teeth whitening", "dental surgery", "cosmetic dentistry", "oral health"],
    businessTerms: {
      queryTerms: ["dentist", "dental clinic", "orthodontic clinic", "cosmetic dentistry center"],
      osmTags: [
        { key: "amenity", value: "dentist" },
      ],
      googleTypes: ["dentist"],
      yelpCategories: ["dentists", "cosmeticdentists"],
      foursquareCategories: ["Dentist's Office"],
    },
    jobTerms: {
      titles: ["Dental Practice Manager", "Orthodontist"],
      keywords: ["dental practice", "patient scheduling"],
    },
  },
  {
    id: "pharmaceutical_manufacturing_biotech",
    name: "Pharmaceutical Manufacturers, Biotech & Clinical Research",
    categoryId: "pharmaceuticals_biotech",
    industryGroup: "Life Sciences & Pharma",
    subCategory: "Biotech & Pharma",
    niche: "Drug Development & Clinical Trials",
    businessType: "Pharma Manufacturer / Biotech Lab",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["pharmaceutical company", "biotech lab", "drug manufacturing", "clinical trials organization", "cro", "vaccine manufacturer", "medical device manufacturer"],
    businessTerms: {
      queryTerms: ["pharmaceutical manufacturing plant", "biotech clinical research lab", "medical device manufacturer"],
      osmTags: [
        { key: "industrial", value: "factory" },
        { key: "amenity", value: "pharmacy" },
      ],
      googleTypes: ["pharmacy", "general_contractor"],
      yelpCategories: ["pharmacy"],
      foursquareCategories: ["Laboratory", "Factory"],
    },
    jobTerms: {
      titles: ["Clinical Research Associate", "Regulatory Affairs Specialist", "Biochemist"],
      keywords: ["fda", "gmp", "gcp", "clinical trials", "pharmacology"],
    },
  },

  // ==========================================
  // 20. EDUCATION, SCIENCE & RESEARCH
  // ==========================================
  {
    id: "schools_universities_academies",
    name: "Schools, Universities & Vocational Colleges",
    categoryId: "education",
    industryGroup: "Educational Institutions",
    subCategory: "Institutions",
    niche: "Schools & Higher Education",
    businessType: "Educational Institution",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["private school", "international school", "university", "vocational college", "training academy", "tutoring center", "language school"],
    businessTerms: {
      queryTerms: ["private international school", "university campus", "vocational training college"],
      osmTags: [
        { key: "amenity", value: "school" },
        { key: "amenity", value: "university" },
        { key: "amenity", value: "college" },
      ],
      googleTypes: ["school", "university"],
      yelpCategories: ["privateschools", "colleges"],
      foursquareCategories: ["School", "College and University"],
    },
    jobTerms: {
      titles: ["Academic Director", "Instructional Designer", "Curriculum Specialist"],
      keywords: ["curriculum", "pedagogy", "lms", "educational administration"],
    },
  },
  {
    id: "scientific_laboratories_testing",
    name: "Scientific Laboratories, Testing Labs & R&D Centers",
    categoryId: "science_research",
    industryGroup: "Scientific Research",
    subCategory: "Laboratories",
    niche: "Testing & R&D",
    businessType: "Testing Laboratory / Research Center",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["testing laboratory", "research center", "materials testing", "soil testing lab", "r&d center", "standards testing"],
    businessTerms: {
      queryTerms: ["scientific testing laboratory", "r&d research center", "materials analysis testing lab"],
      osmTags: [
        { key: "amenity", value: "research_institute" },
      ],
      googleTypes: ["local_government_office"],
      yelpCategories: ["laboratory"],
      foursquareCategories: ["Laboratory"],
    },
    jobTerms: {
      titles: ["Research Scientist", "Laboratory Quality Manager"],
      keywords: ["iso 17025", "spectroscopy", "data analysis", "r&d"],
    },
  },

  // ==========================================
  // 21. PUBLIC SECTOR, DEFENSE & SECURITY
  // ==========================================
  {
    id: "municipal_public_administration",
    name: "Municipalities, Public Authorities & Government Bodies",
    categoryId: "government_public_sector",
    industryGroup: "Public Sector",
    subCategory: "Government",
    niche: "Public Agencies",
    businessType: "Government Agency",
    isPopular: false,
    applicableModes: ["physical"],
    aliases: ["municipal council", "county government", "public authority", "revenue authority", "embassy", "civil service office"],
    businessTerms: {
      queryTerms: ["municipal council office", "government agency public office", "county headquarters"],
      osmTags: [
        { key: "amenity", value: "townhall" },
        { key: "amenity", value: "courthouse" },
        { key: "office", value: "government" },
      ],
      googleTypes: ["local_government_office", "city_hall"],
      yelpCategories: ["publicservicesgovt"],
      foursquareCategories: ["Government Building"],
    },
    jobTerms: {
      titles: ["Public Policy Analyst", "Public Sector Program Manager"],
      keywords: ["public procurement", "governance", "public policy"],
    },
  },
  {
    id: "security_systems_guarding",
    name: "Private Security Companies, CCTV & Alarms",
    categoryId: "defense_security",
    industryGroup: "Security & Protection",
    subCategory: "Security Services",
    niche: "Private Security & Systems",
    businessType: "Security Company",
    isPopular: false,
    applicableModes: ["physical"],
    aliases: ["private security", "security guard company", "cctv installation", "alarm systems", "access control installer", "fire safety contractor"],
    businessTerms: {
      queryTerms: ["private security guard company", "cctv surveillance installation company", "alarm security systems installer"],
      osmTags: [
        { key: "office", value: "security" },
        { key: "craft", value: "locksmith" },
      ],
      googleTypes: ["locksmith", "general_contractor"],
      yelpCategories: ["securitysystems"],
      foursquareCategories: ["Security Service"],
    },
    jobTerms: {
      titles: ["Security Operations Director", "CCTV Systems Technician"],
      keywords: ["physical security", "access control", "surveillance systems"],
    },
  },

  // ==========================================
  // 22. HUMAN RESOURCES & CONSUMER SERVICES
  // ==========================================
  {
    id: "staffing_recruitment_agencies",
    name: "Staffing Agencies, Executive Search & HR Consultancies",
    categoryId: "human_resources",
    industryGroup: "Human Resources",
    subCategory: "Recruitment",
    niche: "Staffing & Executive Search",
    businessType: "Recruitment Agency",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["recruitment agency", "staffing firm", "executive search", "headhunter", "hr consulting", "talent acquisition"],
    businessTerms: {
      queryTerms: ["staffing recruitment agency office", "executive search firm", "hr consultancy company"],
      osmTags: [
        { key: "office", value: "employment_agency" },
      ],
      googleTypes: ["employment_agency"],
      yelpCategories: ["employmentagencies"],
      foursquareCategories: ["Recruiter"],
    },
    jobTerms: {
      titles: ["Technical Recruiter", "Talent Acquisition Lead", "HR Business Partner"],
      keywords: ["recruiting", "ats", "talent sourcing", "onboarding"],
    },
  },
  {
    id: "beauty_salons_spas",
    name: "Beauty Salons, Spas, Barbershops & Wellness",
    categoryId: "consumer_personal_services",
    industryGroup: "Personal Care",
    subCategory: "Salons & Spas",
    niche: "Beauty & Grooming",
    businessType: "Beauty Salon / Spa / Barbershop",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["beauty salon", "hair salon", "barbershop", "spa", "nail salon", "massage therapy", "skincare clinic"],
    businessTerms: {
      queryTerms: ["beauty hair salon", "luxury day spa", "barbershop grooming", "nail salon"],
      osmTags: [
        { key: "shop", value: "hairdresser" },
        { key: "shop", value: "beauty" },
        { key: "shop", value: "massage" },
      ],
      googleTypes: ["hair_care", "beauty_salon", "spa"],
      yelpCategories: ["hair", "beautysvc", "spas"],
      foursquareCategories: ["Salon / Barbershop", "Spa"],
    },
    jobTerms: {
      titles: ["Spa Director", "Master Stylist"],
      keywords: ["salon management", "aesthetic therapy"],
    },
  },

  // ==========================================
  // 23. SPORTS, ARTS, EVENTS & NONPROFITS
  // ==========================================
  {
    id: "sports_clubs_fitness_centers",
    name: "Fitness Gyms, Sports Clubs & Recreation Centers",
    categoryId: "sports_recreation",
    industryGroup: "Sports & Fitness",
    subCategory: "Gyms & Clubs",
    niche: "Fitness & Sports Facilities",
    businessType: "Gym / Sports Club",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["gym", "fitness center", "sports club", "swimming academy", "tennis club", "golf club", "martial arts studio"],
    businessTerms: {
      queryTerms: ["fitness gym center", "sports athletic club", "crossfit studio"],
      osmTags: [
        { key: "leisure", value: "fitness_centre" },
        { key: "leisure", value: "sports_centre" },
      ],
      googleTypes: ["gym"],
      yelpCategories: ["gyms", "fitness"],
      foursquareCategories: ["Gym / Fitness Center"],
    },
    jobTerms: {
      titles: ["Fitness Operations Director", "Personal Training Lead"],
      keywords: ["fitness coaching", "gym management", "athletic conditioning"],
    },
  },
  {
    id: "art_galleries_creative_studios",
    name: "Art Galleries, Photography Studios & Interior Architecture",
    categoryId: "arts_creative",
    industryGroup: "Creative Arts",
    subCategory: "Galleries & Studios",
    niche: "Visual Arts & Interior Design",
    businessType: "Art Gallery / Design Studio",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["art gallery", "photography studio", "interior design firm", "sculpture studio", "custom framing", "artisan craft workshop"],
    businessTerms: {
      queryTerms: ["art gallery exhibition", "commercial photography studio", "interior design architecture studio"],
      osmTags: [
        { key: "tourism", value: "gallery" },
        { key: "shop", value: "art" },
        { key: "office", value: "architect" },
      ],
      googleTypes: ["art_gallery"],
      yelpCategories: ["galleries", "photographers"],
      foursquareCategories: ["Art Gallery", "Photography Studio"],
    },
    jobTerms: {
      titles: ["Creative Director", "Interior Architect", "Gallery Curator"],
      keywords: ["autocad", "sketchup", "art curation", "visual design"],
    },
  },
  {
    id: "event_planning_exhibitions",
    name: "Event Organizers, Convention Centers & Audio-Visual",
    categoryId: "events_conferences",
    industryGroup: "Events & Exhibitions",
    subCategory: "Event Production",
    niche: "Conferences & Staging",
    businessType: "Event Management Company / Venue",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["event planner", "conference organizer", "convention center", "exhibition venue", "wedding planner", "av staging company"],
    businessTerms: {
      queryTerms: ["event planning management company", "convention exhibition center venue", "audio visual staging production"],
      osmTags: [
        { key: "amenity", value: "events_venue" },
        { key: "amenity", value: "conference_centre" },
      ],
      googleTypes: ["event_venue"],
      yelpCategories: ["eventservices"],
      foursquareCategories: ["Event Space", "Conference Room"],
    },
    jobTerms: {
      titles: ["Event Production Lead", "Conference Coordinator"],
      keywords: ["event production", "av staging", "vendor management"],
    },
  },
  {
    id: "ngos_humanitarian_charities",
    name: "NGOs, International Aid Agencies & Foundations",
    categoryId: "nonprofit_social_enterprise",
    industryGroup: "Nonprofit & Humanitarian",
    subCategory: "Nonprofits",
    niche: "Humanitarian Aid & Social Impact",
    businessType: "NGO / Charitable Foundation",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["ngo", "nonprofit organization", "international development agency", "charity foundation", "humanitarian mission", "social enterprise"],
    businessTerms: {
      queryTerms: ["international ngo office", "humanitarian aid foundation", "nonprofit organization headquarters"],
      osmTags: [
        { key: "office", value: "ngo" },
        { key: "office", value: "charity" },
      ],
      googleTypes: ["local_government_office"],
      yelpCategories: ["nonprofit"],
      foursquareCategories: ["Non-Profit"],
    },
    jobTerms: {
      titles: ["Monitoring and Evaluation Specialist", "Grants Manager", "Country Director"],
      keywords: ["m&e", "usaid", "un grants", "humanitarian relief", "social impact"],
    },
  },

  // ==========================================
  // 24. AI, DATA ANNOTATION, ROBOTICS & EMERGING TECH
  // ==========================================
  {
    id: "ai_data_annotation",
    name: "AI Data Annotation, Labeling & Image Tagging",
    categoryId: "ai_robotics_emerging_tech",
    industryGroup: "AI Training & Data Operations",
    subCategory: "Data Labeling",
    niche: "Computer Vision & NLP Annotation",
    businessType: "AI Data Service",
    isPopular: true,
    applicableModes: ["online"],
    aliases: ["data annotation", "data labeler", "image annotation", "video labeling", "bounding box annotation", "lidar annotation", "audio transcription data"],
    businessTerms: {
      queryTerms: ["ai data annotation company", "data labeling service provider"],
      osmTags: [{ key: "office", value: "it" }],
      googleTypes: ["store"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Tech Startup"],
    },
    jobTerms: {
      titles: ["Data Annotator", "AI Image Labeler", "Annotation Quality Specialist", "Dataset Curator"],
      keywords: ["labelbox", "cvat", "data annotation", "image segmentation", "bounding boxes", "nlp dataset"],
    },
  },
  {
    id: "ai_training_feedback",
    name: "AI Model Training, RLHF & Response Evaluation",
    categoryId: "ai_robotics_emerging_tech",
    industryGroup: "AI Training & Data Operations",
    subCategory: "RLHF & Model Tuning",
    niche: "LLM Evaluation & Feedback",
    businessType: "AI Training Provider",
    isPopular: true,
    applicableModes: ["online"],
    aliases: ["ai training", "rlhf", "model feedback", "ai tutor", "prompt engineering", "model alignment", "ai response evaluation"],
    businessTerms: {
      queryTerms: ["ai rlhf model training firm"],
      osmTags: [{ key: "office", value: "it" }],
      googleTypes: ["store"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Tech Startup"],
    },
    jobTerms: {
      titles: ["AI Trainer", "RLHF Specialist", "AI Feedback Evaluator", "Prompt Engineer", "LLM Benchmark Specialist"],
      keywords: ["rlhf", "llm evaluation", "prompt engineering", "human-in-the-loop", "model alignment", "hallucination detection"],
    },
  },
  {
    id: "search_evaluation_raters",
    name: "Search Quality Raters & Content Moderators",
    categoryId: "ai_robotics_emerging_tech",
    industryGroup: "Evaluation & Quality",
    subCategory: "Quality Rating",
    niche: "Search Engine & Ads Quality",
    businessType: "Evaluation Service",
    isPopular: true,
    applicableModes: ["online"],
    aliases: ["search quality rater", "search evaluator", "ads assessor", "content moderator", "web search evaluator", "internet rater"],
    businessTerms: {
      queryTerms: ["search engine evaluation agency"],
      osmTags: [{ key: "office", value: "it" }],
      googleTypes: ["store"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Tech Startup"],
    },
    jobTerms: {
      titles: ["Search Quality Evaluator", "Internet Assessor", "Ads Quality Rater", "Content Moderator"],
      keywords: ["search evaluation", "rater guidelines", "ads quality", "content review", "query relevance"],
    },
  },
  {
    id: "ai_coding_evaluation",
    name: "AI Coding Evaluation & Code Review Benchmarking",
    categoryId: "ai_robotics_emerging_tech",
    industryGroup: "AI Code Intelligence",
    subCategory: "Code Evaluation",
    niche: "Software Benchmarking",
    businessType: "AI Code Platform",
    isPopular: true,
    applicableModes: ["online"],
    aliases: ["ai code evaluator", "coding prompt reviewer", "ai coding tutor", "software benchmark reviewer", "code generation rater"],
    businessTerms: {
      queryTerms: ["ai coding benchmark platform"],
      osmTags: [{ key: "office", value: "software" }],
      googleTypes: ["store"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Tech Startup"],
    },
    jobTerms: {
      titles: ["AI Coding Specialist", "Code Quality Evaluator", "Technical LLM Benchmark Engineer"],
      keywords: ["python", "typescript", "code review", "unit tests", "algorithms", "evals", "coding rlhf"],
    },
  },
  {
    id: "ai_math_reasoning",
    name: "AI STEM, Mathematics & Advanced Reasoning Specialist",
    categoryId: "ai_robotics_emerging_tech",
    industryGroup: "AI Domain Expertise",
    subCategory: "STEM Evaluation",
    niche: "Math & Physics Reasoning",
    businessType: "AI Reasoning Service",
    isPopular: false,
    applicableModes: ["online"],
    aliases: ["ai math trainer", "stem prompt evaluator", "reasoning benchmark specialist", "physics ai evaluator"],
    businessTerms: {
      queryTerms: ["stem reasoning evaluation"],
      osmTags: [{ key: "office", value: "it" }],
      googleTypes: ["store"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Tech Startup"],
    },
    jobTerms: {
      titles: ["AI Math Specialist", "STEM Reasoning Evaluator", "Advanced Reasoning Rater"],
      keywords: ["calculus", "linear algebra", "physics reasoning", "step-by-step logic", "mathematical proofs"],
    },
  },
  {
    id: "ai_safety_quality",
    name: "AI Safety, Red Teaming & Policy Compliance",
    categoryId: "ai_robotics_emerging_tech",
    industryGroup: "AI Trust & Safety",
    subCategory: "Safety & Alignment",
    niche: "Red Teaming & Policy",
    businessType: "AI Safety Practice",
    isPopular: false,
    applicableModes: ["online"],
    aliases: ["ai red teamer", "ai safety researcher", "trust and safety evaluator", "adversarial prompt tester"],
    businessTerms: {
      queryTerms: ["ai safety auditing lab"],
      osmTags: [{ key: "office", value: "it" }],
      googleTypes: ["store"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Tech Startup"],
    },
    jobTerms: {
      titles: ["AI Red Teamer", "Trust & Safety Specialist", "Adversarial Robustness Evaluator"],
      keywords: ["jailbreak testing", "bias auditing", "adversarial testing", "safety benchmarks", "content policy"],
    },
  },
  {
    id: "transcription_annotation",
    name: "Audio Transcription, Speech Collection & Linguistic Annotation",
    categoryId: "ai_robotics_emerging_tech",
    industryGroup: "Language & Audio Data",
    subCategory: "Audio Operations",
    niche: "Transcription & Linguistics",
    businessType: "Transcription Service",
    isPopular: true,
    applicableModes: ["online"],
    aliases: ["transcriptionist", "audio transcriber", "voice recording collector", "linguistic annotator", "speech data annotator"],
    businessTerms: {
      queryTerms: ["audio transcription speech data firm"],
      osmTags: [{ key: "office", value: "it" }],
      googleTypes: ["store"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Tech Startup"],
    },
    jobTerms: {
      titles: ["Audio Transcriber", "Speech Data Collector", "Linguist", "Phonetic Annotator"],
      keywords: ["transcription", "phonetics", "audio labeling", "speech recognition", "accent localization"],
    },
  },
  {
    id: "robotics_autonomous_systems",
    name: "Robotics, Autonomous Hardware & Drone Systems",
    categoryId: "ai_robotics_emerging_tech",
    industryGroup: "Robotics & Hardware",
    subCategory: "Autonomous Systems",
    niche: "Robotics & Drones",
    businessType: "Robotics Engineering Lab",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["robotics company", "drone manufacturer", "autonomous systems", "industrial robotics", "agv manufacturer"],
    businessTerms: {
      queryTerms: ["robotics engineering company", "commercial drone manufacturer", "autonomous systems robotics"],
      osmTags: [
        { key: "industrial", value: "factory" },
        { key: "office", value: "it" },
      ],
      googleTypes: ["general_contractor"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Tech Startup"],
    },
    jobTerms: {
      titles: ["Robotics Software Engineer", "Embedded Systems Engineer", "Drone Flight Test Lead"],
      keywords: ["ros", "ros2", "c++", "slam", "computer vision", "embedded c"],
    },
  },

  // ==========================================
  // 25. CYBERSECURITY & CLOUD INFRASTRUCTURE
  // ==========================================
  {
    id: "cybersecurity_managed_soc",
    name: "Cybersecurity, Managed SOC & Penetration Testing",
    categoryId: "cybersecurity",
    industryGroup: "Information Security",
    subCategory: "Cybersecurity Services",
    niche: "SOC & Penetration Testing",
    businessType: "Cybersecurity Consultancy / MSSP",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["cybersecurity firm", "penetration testing", "soc provider", "incident response", "security auditing", "ethical hacking"],
    businessTerms: {
      queryTerms: ["cybersecurity consulting firm office", "managed security service provider mssp", "soc security monitoring center"],
      osmTags: [
        { key: "office", value: "it" },
        { key: "office", value: "security" },
      ],
      googleTypes: ["store"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Tech Startup", "IT Services"],
    },
    jobTerms: {
      titles: ["Security Operations Center SOC Analyst", "Penetration Tester", "Information Security Officer CISO", "Cloud Security Engineer"],
      keywords: ["siem", "splunk", "soc2", "penetration testing", "incident response", "cissp", "owasp"],
    },
  },

  // ==========================================
  // 26. SPACE, SATELLITE & AEROSPACE
  // ==========================================
  {
    id: "satellite_aerospace_systems",
    name: "Satellite Communications, Earth Observation & Space Tech",
    categoryId: "space_industry",
    industryGroup: "Space Technology",
    subCategory: "Satellites & Earth Observation",
    niche: "Space Systems & Satellites",
    businessType: "Space Technology Firm / Ground Station",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["space company", "satellite operator", "earth observation", "ground station", "launch service provider", "cubesat developer"],
    businessTerms: {
      queryTerms: ["satellite communications ground station", "space technology aerospace company", "earth observation geospatial analytics"],
      osmTags: [
        { key: "man_made", value: "satellite_dish" },
        { key: "man_made", value: "telescope" },
      ],
      googleTypes: ["local_government_office"],
      yelpCategories: ["itservices"],
      foursquareCategories: ["Research Station"],
    },
    jobTerms: {
      titles: ["Satellite Systems Engineer", "Geospatial Data Scientist", "Orbital Mechanics Specialist"],
      keywords: ["orbital dynamics", "sar", "satellite telemetry", "gis", "remote sensing"],
    },
  },

  // ==========================================
  // 27. CLEANTECH, SUSTAINABILITY & CARBON
  // ==========================================
  {
    id: "waste_to_energy_carbon_capture",
    name: "CleanTech, Carbon Credits & ESG Sustainability",
    categoryId: "cleantech_sustainability",
    industryGroup: "Climate Technology",
    subCategory: "Sustainability & Carbon",
    niche: "Carbon Markets & ESG",
    businessType: "CleanTech Provider / Sustainability Consultancy",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["cleantech company", "carbon credits", "esg consulting", "carbon offset project", "waste to energy", "battery storage system"],
    businessTerms: {
      queryTerms: ["cleantech sustainability consulting office", "carbon project developer", "waste to energy plant"],
      osmTags: [
        { key: "office", value: "consulting" },
        { key: "plant:source", value: "biomass" },
      ],
      googleTypes: ["general_contractor"],
      yelpCategories: ["consulting"],
      foursquareCategories: ["Office"],
    },
    jobTerms: {
      titles: ["ESG Sustainability Analyst", "Carbon Project Developer", "Climate Modeling Specialist"],
      keywords: ["ghg protocol", "carbon credits", "esg reporting", "life cycle analysis lca"],
    },
  },

  // ==========================================
  // 28. LUXURY GOODS & ARTISAN CRAFTS
  // ==========================================
  {
    id: "luxury_fashion_jewelry",
    name: "Luxury Fashion, High Jewelry & Horology",
    categoryId: "luxury_goods",
    industryGroup: "Luxury & High-End Retail",
    subCategory: "Luxury Goods",
    niche: "Jewelry, Watches & Haute Couture",
    businessType: "Luxury Boutique / High-End Jeweler",
    isPopular: false,
    applicableModes: ["physical"],
    aliases: ["luxury boutique", "haute couture", "high jewelry", "luxury watch dealer", "bespoke tailoring", "fine gems dealer"],
    businessTerms: {
      queryTerms: ["luxury fashion designer boutique", "fine jewelry diamond dealer", "luxury swiss watch boutique"],
      osmTags: [
        { key: "shop", value: "jewelry" },
        { key: "shop", value: "watches" },
        { key: "shop", value: "boutique" },
      ],
      googleTypes: ["jewelry_store", "clothing_store"],
      yelpCategories: ["jewelry", "high_end"],
      foursquareCategories: ["Jewelry Store", "Boutique"],
    },
    jobTerms: {
      titles: ["Luxury Brand Manager", "Gemologist", "VIP Client Relations Specialist"],
      keywords: ["haute horlogerie", "gia certification", "clienteling", "luxury retail"],
    },
  },

  // ==========================================
  // 29. PET CARE & VETERINARY
  // ==========================================
  {
    id: "veterinary_clinics_pet_care",
    name: "Veterinary Clinics, Pet Hospitals & Grooming",
    categoryId: "pet_care_veterinary",
    industryGroup: "Animal Health & Pet Services",
    subCategory: "Veterinary",
    niche: "Pet Care & Clinics",
    businessType: "Veterinary Clinic / Pet Hospital",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["veterinary clinic", "pet hospital", "vet surgeon", "dog grooming", "pet boarding", "pet store"],
    businessTerms: {
      queryTerms: ["veterinary animal hospital", "pet grooming salon", "pet care boarding kennel"],
      osmTags: [
        { key: "amenity", value: "veterinary" },
        { key: "shop", value: "pet" },
        { key: "shop", value: "pet_grooming" },
      ],
      googleTypes: ["veterinary_care", "pet_store"],
      yelpCategories: ["vet", "petgroomers"],
      foursquareCategories: ["Veterinarian", "Pet Service"],
    },
    jobTerms: {
      titles: ["Veterinary Surgeon", "Pet Care Operations Manager"],
      keywords: ["veterinary medicine", "animal pathology", "veterinary practice management"],
    },
  },

  // ==========================================
  // 30. WELLNESS & FITNESS
  // ==========================================
  {
    id: "holistic_wellness_yoga",
    name: "Yoga Studios, Holistic Wellness & Nutrition",
    categoryId: "wellness_fitness",
    industryGroup: "Wellness & Preventative Health",
    subCategory: "Holistic Health",
    niche: "Yoga & Nutrition",
    businessType: "Wellness Studio / Nutrition Clinic",
    isPopular: true,
    applicableModes: ["physical", "online"],
    aliases: ["yoga studio", "pilates studio", "wellness retreat", "nutritionist clinic", "holistic medicine", "meditation center"],
    businessTerms: {
      queryTerms: ["yoga studio wellness center", "pilates studio", "clinical nutritionist office"],
      osmTags: [
        { key: "leisure", value: "fitness_centre" },
        { key: "shop", value: "health_food" },
      ],
      googleTypes: ["health", "gym"],
      yelpCategories: ["yoga", "nutritionists"],
      foursquareCategories: ["Yoga Studio", "Gym / Fitness Center"],
    },
    jobTerms: {
      titles: ["Wellness Program Director", "Holistic Health Coach"],
      keywords: ["mindfulness", "nutrition science", "wellness coaching"],
    },
  },

  // ==========================================
  // 31. COMMODITY TRADING, PROCUREMENT & CORPORATE SERVICES
  // ==========================================
  {
    id: "commodity_trading_energy_fx",
    name: "Commodity Trading, Energy Brokers & FX Desks",
    categoryId: "trading_commodities",
    industryGroup: "Wholesale & Physical Trading",
    subCategory: "Commodity Trading",
    niche: "Energy, Metals & Agricultural Trading",
    businessType: "Trading House / Brokerage Desk",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["commodity trading house", "oil trader", "grain trader", "metals desk", "fx broker", "carbon credit desk"],
    businessTerms: {
      queryTerms: ["commodity trading house office", "energy trading firm", "forex trading desk"],
      osmTags: [
        { key: "office", value: "financial" },
      ],
      googleTypes: ["finance"],
      yelpCategories: ["financialadvising"],
      foursquareCategories: ["Financial or Legal Service"],
    },
    jobTerms: {
      titles: ["Commodity Trader", "Quantitative Risk Analyst"],
      keywords: ["hedging", "derivatives", "physical commodity logistics", "var"],
    },
  },
  {
    id: "strategic_sourcing_procurement",
    name: "Procurement Consulting & Strategic Sourcing",
    categoryId: "procurement_supply_chain",
    industryGroup: "Corporate Procurement",
    subCategory: "Sourcing & Procurement",
    niche: "Supplier Management",
    businessType: "Procurement Consultancy",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["procurement consultant", "strategic sourcing", "vendor management", "supply chain advisory", "purchasing consultant"],
    businessTerms: {
      queryTerms: ["strategic procurement consulting office", "supply chain sourcing advisor"],
      osmTags: [
        { key: "office", value: "consulting" },
      ],
      googleTypes: ["accounting"],
      yelpCategories: ["consulting"],
      foursquareCategories: ["Office"],
    },
    jobTerms: {
      titles: ["Strategic Sourcing Manager", "Procurement Operations Lead"],
      keywords: ["rfp", "vendor negotiation", "category management", "coupa", "sap ariba"],
    },
  },
  {
    id: "ev_charging_fleet_tech",
    name: "EV Charging Infrastructure, Mobility & Telematics",
    categoryId: "mobility_transport_tech",
    industryGroup: "Smart Mobility",
    subCategory: "EV & Telematics",
    niche: "EV Stations & Fleet Software",
    businessType: "EV Charging Hub / Mobility Tech",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["ev charging station", "electric vehicle charging hub", "fleet telematics company", "mobility tech", "ride hailing tech"],
    businessTerms: {
      queryTerms: ["ev charging station public hub", "fleet telematics software company"],
      osmTags: [
        { key: "amenity", value: "charging_station" },
        { key: "office", value: "it" },
      ],
      googleTypes: ["electric_vehicle_charging_station"],
      yelpCategories: ["evchargingstations"],
      foursquareCategories: ["EV Charging Station"],
    },
    jobTerms: {
      titles: ["EV Infrastructure Engineer", "Telematics Product Specialist"],
      keywords: ["ocpp", "ev charging protocols", "telematics api", "fleet electrification"],
    },
  },
  {
    id: "coworking_business_centers",
    name: "Coworking Spaces, Executive Suites & Business Hubs",
    categoryId: "corporate_services",
    industryGroup: "Workspace & Business Support",
    subCategory: "Flexible Workspace",
    niche: "Coworking & Executive Suites",
    businessType: "Coworking Space / Business Center",
    isPopular: true,
    applicableModes: ["physical"],
    aliases: ["coworking space", "shared office", "business center", "virtual office", "executive suites", "incubator workspace"],
    businessTerms: {
      queryTerms: ["coworking space shared office", "executive business center suites"],
      osmTags: [
        { key: "amenity", value: "coworking_space" },
        { key: "office", value: "coworking" },
      ],
      googleTypes: ["real_estate_agency"],
      yelpCategories: ["coworkingspaces"],
      foursquareCategories: ["Coworking Space"],
    },
    jobTerms: {
      titles: ["Community Manager", "Workspace Operations Director"],
      keywords: ["coworking management", "member retention", "office operations"],
    },
  },
  {
    id: "specialized_industrial_trades",
    name: "Specialized Industrial Trades & Custom Artisan Services",
    categoryId: "specialized_industries",
    industryGroup: "Specialized Services",
    subCategory: "Niche Trades",
    niche: "Custom Artisan & Industrial",
    businessType: "Specialized Service Provider",
    isPopular: false,
    applicableModes: ["physical", "online"],
    aliases: ["specialized industrial service", "custom metal spinning", "precision calibration", "underwater welding", "antique restoration", "custom fabrication"],
    businessTerms: {
      queryTerms: ["specialized industrial fabrication service", "precision calibration laboratory"],
      osmTags: [
        { key: "craft", value: "blacksmith" },
        { key: "craft", value: "clockmaker" },
        { key: "craft", value: "stonemason" },
      ],
      googleTypes: ["general_contractor"],
      yelpCategories: ["contractors"],
      foursquareCategories: ["Factory"],
    },
    jobTerms: {
      titles: ["Specialized Industrial Technician", "Master Craftsman"],
      keywords: ["precision machining", "calibration", "specialized craftsmanship"],
    },
  },
];
