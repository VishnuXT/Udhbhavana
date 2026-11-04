import fs from 'fs';

const content = fs.readFileSync('c:/Users/vishn/OneDrive/Desktop/udhbavana/src/data/raw_bus_data.csv', 'utf-8');
const lines = content.split(/\r?\n/);

function clean(s) {
  if (!s) return '';
  return s.trim().replace(/^"+|"+$/g, '').trim();
}

function parseNum(v) {
  if (!v) return null;
  const cleaned = v.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : null;
}

function normalizeName(name) {
  return name.toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[().,\-_/]/g, '')
    .trim();
}

// 1. Build fare map from Sheet 2 and Sheet 3
const fareDatabase = [];

// Sheet 2: lines 260 to 481
for (let i = 260; i < 482; i++) {
  const line = lines[i];
  if (!line || line.trim() === '') continue;
  const p = line.split(',').map(clean);
  if (p[0] === 'Sl. No' || p[1] === 'Boarding Point' || line.includes('BANK')) continue;

  const rawName = p[1];
  if (!rawName) continue;

  const existingDay = parseNum(p[4]);
  const hike1Day = parseNum(p[5]);
  const hike2Day = parseNum(p[7]);
  const existingHostel = parseNum(p[9]);
  const hike1Hostel = parseNum(p[10]);
  const hike2Hostel = parseNum(p[12]);

  if (existingDay || hike1Day || hike2Day || existingHostel) {
    fareDatabase.push({
      name: rawName,
      busNo: p[2] ? parseInt(p[2], 10) : null,
      time: p[3] || '',
      existingDay,
      hike1Day,
      hike2Day,
      existingHostel,
      hike1Hostel,
      hike2Hostel,
      rateType: 'standard'
    });
  }
}

// Sheet 3 (A/C Buses): lines 485 to 506
for (let i = 485; i < 508; i++) {
  const line = lines[i];
  if (!line || line.trim() === '') continue;
  const p = line.split(',').map(clean);
  if (p[0] === 'Sl. No' || p[1] === 'Boarding Point' || line.includes('BANK')) continue;

  const rawName = p[1];
  if (!rawName) continue;

  const existingDay = parseNum(p[4]);
  const hike1Day = parseNum(p[5]); // 20%
  const hike2Day = parseNum(p[7]); // 25%
  const existingHostel = parseNum(p[9]);
  const hike1Hostel = parseNum(p[10]); // 20%
  const hike2Hostel = parseNum(p[12]); // 25%

  if (existingDay || hike1Day || hike2Day || existingHostel) {
    fareDatabase.push({
      name: rawName,
      busNo: p[2] ? parseInt(p[2], 10) : null,
      time: p[3] || '',
      existingDay,
      hike1Day,
      hike2Day,
      existingHostel,
      hike1Hostel,
      hike2Hostel,
      rateType: 'ac'
    });
  }
}

function findFare(stopName, busNo) {
  const norm = normalizeName(stopName);
  
  if (busNo) {
    const matchBus = fareDatabase.find(f => f.busNo === busNo && normalizeName(f.name) === norm);
    if (matchBus) return matchBus;
  }

  const exact = fareDatabase.find(f => normalizeName(f.name) === norm);
  if (exact) return exact;

  const partial = fareDatabase.find(f => {
    const fnorm = normalizeName(f.name);
    return fnorm.includes(norm) || norm.includes(fnorm);
  });
  if (partial) return partial;

  return null;
}

const busDefs = [
  {
    busNo: 1,
    routeName: "Alappuzha (A/C Bus)",
    startPoint: "Alappuzha",
    destination: "SBCE Pattoor",
    departureTime: "6:30 AM",
    isAC: true,
    district: "Alappuzha",
    hikeRateType: "20% & 25% Increase",
    stops: [
      { stopNo: 1, name: "Alappuzha (A/C Bus)", time: "6.30 a.m" },
      { stopNo: 2, name: "Paravoor", time: "7.05 a.m" },
      { stopNo: 3, name: "Punnapra", time: "7.10 a.m" },
      { stopNo: 4, name: "Ambalappuzha", time: "7.20 a.m" },
      { stopNo: 5, name: "Purakadu", time: "7.25 a.m" },
      { stopNo: 6, name: "Thottappally", time: "7.30 a.m" },
      { stopNo: 7, name: "Kannalippalam", time: "7.33 a.m" },
      { stopNo: 8, name: "TB Junction", time: "7.35 a.m" },
      { stopNo: 9, name: "Karuvatta HS", time: "7.38 a.m" },
      { stopNo: 10, name: "Thamallakkal", time: "7.42 a.m" }
    ]
  },
  {
    busNo: 2,
    routeName: "Valiyakulangara – Haripad – Mavelikara",
    startPoint: "Valiyakulangara",
    destination: "SBCE Pattoor",
    departureTime: "7:30 AM",
    isAC: false,
    district: "Alappuzha",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Valiyakulangara", time: "7.30 a.m" },
      { stopNo: 2, name: "Karthikappally", time: "7.40 a.m" },
      { stopNo: 3, name: "Danappady", time: "7.45 a.m" },
      { stopNo: 4, name: "Haripad", time: "7.50 a.m" },
      { stopNo: 5, name: "Nangiarkulangara", time: "7.45 a.m" },
      { stopNo: 6, name: "Pallippad", time: "7.50 a.m" },
      { stopNo: 7, name: "Muttam", time: "7.52 a.m" },
      { stopNo: 8, name: "Karipuzha", time: "7.55 a.m" },
      { stopNo: 9, name: "Thattarambalam", time: "7.55 a.m" },
      { stopNo: 10, name: "Mavelikara", time: "8.00 a.m" }
    ]
  },
  {
    busNo: 3,
    routeName: "Pullukulangara – Muthukulam – Kakkanad",
    startPoint: "Pullukulangara",
    destination: "SBCE Pattoor",
    departureTime: "7:10 AM",
    isAC: false,
    district: "Alappuzha",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Pullukulangara", time: "7.10 a.m" },
      { stopNo: 2, name: "Velanchira", time: "7.15 a.m" },
      { stopNo: 3, name: "Muthukulam H. S", time: "7.20 a.m" },
      { stopNo: 4, name: "Pathiyoor", time: "7.30 a.m" },
      { stopNo: 5, name: "Eruva", time: "7.35 a.m" },
      { stopNo: 6, name: "Kakkanad", time: "7.37 a.m" }
    ]
  },
  {
    busNo: 4,
    routeName: "Chettikulangara – Mannar – Mavelikara – Vettiyar",
    startPoint: "Chettikulangara (Bhagavathippadi)",
    destination: "SBCE Pattoor",
    departureTime: "7:10 AM",
    isAC: false,
    district: "Alappuzha",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Bhagavathippadi", time: "7.10 a.m" },
      { stopNo: 2, name: "Chettikulangara", time: "7.15 a.m" },
      { stopNo: 3, name: "Thattarampalam", time: "7.22 a.m" },
      { stopNo: 4, name: "Chennithala Temple", time: "7.30 a.m" },
      { stopNo: 5, name: "Koickal Jn (Mannar)", time: "7.40 a.m" },
      { stopNo: 6, name: "Kallummodu", time: "7.50 a.m" },
      { stopNo: 7, name: "Cherukole", time: "7.55 a.m" },
      { stopNo: 8, name: "Mavelikara (Puthiyakavu Jn)", time: "8.00 a.m" },
      { stopNo: 9, name: "Pynummoodu", time: "8.10 a.m" },
      { stopNo: 10, name: "Vettiyar", time: "8.20 a.m" }
    ]
  },
  {
    busNo: 5,
    routeName: "Pandanad – Mannar – Kollakadavu – Mamkamkuzhy",
    startPoint: "Pandanad",
    destination: "SBCE Pattoor",
    departureTime: "7:35 AM",
    isAC: false,
    district: "Alappuzha",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Pandanad", time: "7.35 a.m" },
      { stopNo: 2, name: "Mannar", time: "7.45 a.m" },
      { stopNo: 3, name: "Store Jn", time: "7.50 a.m" },
      { stopNo: 4, name: "Budhanoor", time: "7.55 a.m" },
      { stopNo: 5, name: "Puliyoor", time: "7.50 a.m" },
      { stopNo: 6, name: "Cheriyanadu", time: "7.52 a.m" },
      { stopNo: 7, name: "Kollakadavu", time: "8.00 a.m" },
      { stopNo: 8, name: "Kochallummoodu", time: "8.02 a.m" },
      { stopNo: 9, name: "Mamkamkuzhy", time: "8.05 a.m" }
    ]
  },
  {
    busNo: 6,
    routeName: "Thiruvalla – Chengannoor – Venmony",
    startPoint: "Thiruvalla",
    destination: "SBCE Pattoor",
    departureTime: "7:30 AM",
    isAC: false,
    district: "Pathanamthitta",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Thiruvalla", time: "7.30 a.m" },
      { stopNo: 2, name: "Thirumoolapuram", time: "7.40 a.m" },
      { stopNo: 3, name: "Kuttur", time: "7.50 a.m" },
      { stopNo: 4, name: "Pravincoode", time: "7.55 a.m" },
      { stopNo: 5, name: "Kallissery", time: "8.00 a.m" },
      { stopNo: 6, name: "Chengannoor", time: "7.45 a.m" },
      { stopNo: 7, name: "Mulakkuzha", time: "8.05 a.m" },
      { stopNo: 8, name: "Kodukulanji", time: "8.10 a.m" },
      { stopNo: 9, name: "Venmony", time: "8.15 a.m" }
    ]
  },
  {
    busNo: 7,
    routeName: "Kozhencherry – Aranmula – Kuriyanapally – Edappon",
    startPoint: "Kozhencherry",
    destination: "SBCE Pattoor",
    departureTime: "7:25 AM",
    isAC: false,
    district: "Pathanamthitta",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Kozhencherry", time: "7.25 a.m" },
      { stopNo: 2, name: "Aranmula", time: "7.30 a.m" },
      { stopNo: 3, name: "Kidangannur", time: "7.35 a.m" },
      { stopNo: 4, name: "Kuriyanapally", time: "7.38 a.m" },
      { stopNo: 5, name: "Karithotta", time: "7.40 a.m" },
      { stopNo: 6, name: "Kotta", time: "7.45 a.m" },
      { stopNo: 7, name: "Paarelpadi Jn", time: "7.50 a.m" },
      { stopNo: 8, name: "Karakkad", time: "8.00 a.m" },
      { stopNo: 9, name: "Manthuka", time: "8.05 a.m" },
      { stopNo: 10, name: "Muttar", time: "8.15 a.m" },
      { stopNo: 11, name: "Mudiyoorkonam", time: "8.20 a.m" },
      { stopNo: 12, name: "Arathil Mukku", time: "8.21 a.m" },
      { stopNo: 13, name: "Iranikudy", time: "8.22 a.m" },
      { stopNo: 14, name: "Edappon", time: "8.23 a.m" }
    ]
  },
  {
    busNo: 8,
    routeName: "Elavumthitta – Thumbamon – Pandalam",
    startPoint: "Elavumthitta",
    destination: "SBCE Pattoor",
    departureTime: "7:30 AM",
    isAC: false,
    district: "Pathanamthitta",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Elavumthitta", time: "7.30 a.m" },
      { stopNo: 2, name: "Ramanchira", time: "7.45 a.m" },
      { stopNo: 3, name: "Ambalakkadavu", time: "7.50 a.m" },
      { stopNo: 4, name: "Thumbamon", time: "8.00 a.m" },
      { stopNo: 5, name: "Pandalam", time: "8.05 a.m" }
    ]
  },
  {
    busNo: 9,
    routeName: "Pathanamthitta – Omalloor – Thumpamon – Pandalam",
    startPoint: "Pathanamthitta",
    destination: "SBCE Pattoor",
    departureTime: "7:35 AM",
    isAC: false,
    district: "Pathanamthitta",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Pathanamthitta", time: "7.35 a.m" },
      { stopNo: 2, name: "Puthen peedika", time: "7.40 a.m" },
      { stopNo: 3, name: "Omalloor", time: "7.45 a.m" },
      { stopNo: 4, name: "Kaippattoor", time: "7.50 a.m" },
      { stopNo: 5, name: "Nariyapuram", time: "7.55 a.m" },
      { stopNo: 6, name: "Thumpamon", time: "8.05 a.m" },
      { stopNo: 7, name: "Kadakkad", time: "8.10 a.m" },
      { stopNo: 8, name: "Pandalam", time: "8.15 a.m" }
    ]
  },
  {
    busNo: 10,
    routeName: "Kumbazha – Konni – Chandanappally – Pandalam",
    startPoint: "Kumbazha",
    destination: "SBCE Pattoor",
    departureTime: "7:35 AM",
    isAC: false,
    district: "Pathanamthitta",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Kumbazha", time: "7.35 a.m" },
      { stopNo: 2, name: "Konni", time: "7.40 a.m" },
      { stopNo: 3, name: "Pookavu", time: "7.45 a.m" },
      { stopNo: 4, name: "Vallikode", time: "7.47 a.m" },
      { stopNo: 5, name: "Chandanappally", time: "7.55 a.m" },
      { stopNo: 6, name: "Thatta", time: "8.00 a.m" },
      { stopNo: 7, name: "Keeruzhi", time: "8.05 a.m" },
      { stopNo: 8, name: "Kurambala", time: "8.07 a.m" },
      { stopNo: 9, name: "Pandalam", time: "8.08 a.m" }
    ]
  },
  {
    busNo: 11,
    routeName: "Pathanapuram – Elamannoor – Parakode",
    startPoint: "Pathanapuram",
    destination: "SBCE Pattoor",
    departureTime: "7:20 AM",
    isAC: false,
    district: "Kollam",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Pathanapuram", time: "7.20 a.m" },
      { stopNo: 2, name: "Kallumkadavu", time: "7.30 a.m" },
      { stopNo: 3, name: "Puthuval", time: "7.35 a.m" },
      { stopNo: 4, name: "Elamannoor H.S", time: "7.45 a.m" },
      { stopNo: 5, name: "Pattazhi Mukku (PP)", time: "7.55 a.m" },
      { stopNo: 6, name: "Ezhamkulam", time: "7.40 a.m" },
      { stopNo: 7, name: "Parakode", time: "7.45 a.m" },
      { stopNo: 8, name: "Kottamughal", time: "7.48 a.m" }
    ]
  },
  {
    busNo: 12,
    routeName: "Kundara – Kottarakkara – Kalayapuram",
    startPoint: "Kundara",
    destination: "SBCE Pattoor",
    departureTime: "7:00 AM",
    isAC: false,
    district: "Kollam",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Kundara", time: "7.00 a.m" },
      { stopNo: 2, name: "Kundara Pallimukku", time: "7.05 a.m" },
      { stopNo: 3, name: "Arumurikkada", time: "7.08 a.m" },
      { stopNo: 4, name: "Cheerankavu", time: "7.10 a.m" },
      { stopNo: 5, name: "Ezhukone", time: "7.15 a.m" },
      { stopNo: 6, name: "Ambalathumkala", time: "7.20 a.m" },
      { stopNo: 7, name: "Kottarakkara Railway", time: "7.25 a.m" },
      { stopNo: 8, name: "Kottarakkara Jn", time: "7.30 a.m" },
      { stopNo: 9, name: "Mylom", time: "7.35 a.m" },
      { stopNo: 10, name: "Pattazhimukku", time: "7.40 a.m" },
      { stopNo: 11, name: "Kalayapuram", time: "7.43 a.m" }
    ]
  },
  {
    busNo: 13,
    routeName: "Kulakkada – Enathu – Adoor – Pazhakulam – Nooranad",
    startPoint: "Kulakkada",
    destination: "SBCE Pattoor",
    departureTime: "7:45 AM",
    isAC: false,
    district: "Kollam",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Kulakkada", time: "7.45 a.m" },
      { stopNo: 2, name: "Enathu", time: "7.47 a.m" },
      { stopNo: 3, name: "Vadakkadathu kavu", time: "7.50 a.m" },
      { stopNo: 4, name: "Adoor", time: "7.55 a.m" },
      { stopNo: 5, name: "Peringanad", time: "8.00 a.m" },
      { stopNo: 6, name: "Pazhakulam", time: "8.10 a.m" },
      { stopNo: 7, name: "Athikattukulangara", time: "8.15 a.m" },
      { stopNo: 8, name: "Nooranad", time: "8.20 a.m" }
    ]
  },
  {
    busNo: 14,
    routeName: "Kodumon – Adoor – Paranthal – Kudassanad – Padanilam",
    startPoint: "Kodumon",
    destination: "SBCE Pattoor",
    departureTime: "7:00 AM",
    isAC: false,
    district: "Pathanamthitta",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Kodumon", time: "7.00 a.m" },
      { stopNo: 2, name: "Ayikkad", time: "7.10 a.m" },
      { stopNo: 3, name: "Anandappally", time: "7.20 a.m" },
      { stopNo: 4, name: "Pannivizha", time: "7.25 a.m" },
      { stopNo: 5, name: "Adoor", time: "7.35 a.m" },
      { stopNo: 6, name: "High School Jn (Adoor)", time: "7.40 a.m" },
      { stopNo: 7, name: "Paranthal", time: "7.50 a.m" },
      { stopNo: 8, name: "Kurampala", time: "7.55 a.m" },
      { stopNo: 9, name: "Medical Mission", time: "8.00 a.m" },
      { stopNo: 10, name: "Poozhikkadu", time: "8.05 a.m" },
      { stopNo: 11, name: "Kudassanad", time: "8.15 a.m" },
      { stopNo: 12, name: "Padanilam", time: "8.20 a.m" }
    ]
  },
  {
    busNo: 15,
    routeName: "Kadambanadu – Nellimugal – Adoor – Nooranad",
    startPoint: "Kadambanadu",
    destination: "SBCE Pattoor",
    departureTime: "7:20 AM",
    isAC: false,
    district: "Pathanamthitta",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Kadambanadu", time: "7.20 a.m" },
      { stopNo: 2, name: "Nellimugal", time: "7.26 a.m" },
      { stopNo: 3, name: "Manakkala", time: "7.29 a.m" },
      { stopNo: 4, name: "Adoor", time: "7.35 a.m" },
      { stopNo: 5, name: "Peringanad", time: "7.41 a.m" },
      { stopNo: 6, name: "Pazhakulam", time: "7.45 a.m" },
      { stopNo: 7, name: "Athikkattu Kulangara", time: "7.48 a.m" },
      { stopNo: 8, name: "Nooranad", time: "8.00 a.m" }
    ]
  },
  {
    busNo: 16,
    routeName: "Mynagappally – Sasthamkotta – Bharanikkavu – Charummood",
    startPoint: "Mynagappally",
    destination: "SBCE Pattoor",
    departureTime: "7:20 AM",
    isAC: false,
    district: "Kollam",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Mynagappally", time: "7.20 a.m" },
      { stopNo: 2, name: "ICS Junction", time: "7.25 a.m" },
      { stopNo: 3, name: "Sasthamkotta", time: "7.30 a.m" },
      { stopNo: 4, name: "Bharanikkavu", time: "7.35 a.m" },
      { stopNo: 5, name: "Chakkuvally", time: "7.40 a.m" },
      { stopNo: 6, name: "High School Jn", time: "7.50 a.m" },
      { stopNo: 7, name: "Anayadi", time: "7.55 a.m" },
      { stopNo: 8, name: "Thamarakulam", time: "7.58 a.m" },
      { stopNo: 9, name: "Charummood", time: "8.00 a.m" }
    ]
  },
  {
    busNo: 17,
    routeName: "Kollam (A/C Bus)",
    startPoint: "Kollam",
    destination: "SBCE Pattoor",
    departureTime: "6:40 AM",
    isAC: true,
    district: "Kollam",
    hikeRateType: "20% & 25% Increase",
    stops: [
      { stopNo: 1, name: "Kollam", time: "6.40 a.m" },
      { stopNo: 2, name: "Ramankulangara", time: "7.05 a.m" },
      { stopNo: 3, name: "Kavanad", time: "7.10 a.m" },
      { stopNo: 4, name: "Neendakara", time: "7.15 a.m" },
      { stopNo: 5, name: "Chavara", time: "7.20 a.m" },
      { stopNo: 6, name: "Sankaramangalam", time: "7.25 a.m" },
      { stopNo: 7, name: "Edappalykkotta", time: "7.30 a.m" },
      { stopNo: 8, name: "Kuttivattom", time: "7.35 a.m" }
    ]
  },
  {
    busNo: 18,
    routeName: "Karunagappally – Vavvakkavu – Kayamkulam",
    startPoint: "Karunagappally",
    destination: "SBCE Pattoor",
    departureTime: "7:15 AM",
    isAC: false,
    district: "Kollam",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Karunagappally", time: "7.15 a.m" },
      { stopNo: 2, name: "Vavvakkavu", time: "7.45 a.m" },
      { stopNo: 3, name: "Changankulangara", time: "7.49 a.m" },
      { stopNo: 4, name: "Kayamkulam", time: "7.50 a.m" },
      { stopNo: 5, name: "IIIrd Mile Stone (KP Road)", time: "7.48 a.m" }
    ]
  },
  {
    busNo: 19,
    routeName: "Puthiyakavu (Karunagappally) – Patharam – Nooranad",
    startPoint: "Puthiyakavu (Karunagappally)",
    destination: "SBCE Pattoor",
    departureTime: "7:15 AM",
    isAC: false,
    district: "Kollam",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Puthiyakavu (Karunagappally)", time: "7.15 a.m" },
      { stopNo: 2, name: "AVHS Junction", time: "7.20 a.m" },
      { stopNo: 3, name: "Patharamukku", time: "7.25 a.m" },
      { stopNo: 4, name: "Pathram", time: "7.30 a.m" },
      { stopNo: 5, name: "KCT Junction", time: "7.35 a.m" },
      { stopNo: 6, name: "Parakkadavu", time: "7.45 a.m" },
      { stopNo: 7, name: "Mattathumukku", time: "7.50 a.m" },
      { stopNo: 8, name: "Vanchimukku", time: "7.55 a.m" },
      { stopNo: 9, name: "Veterinary Junction", time: "8.00 a.m" },
      { stopNo: 10, name: "Panayil", time: "8.10 a.m" },
      { stopNo: 11, name: "Pallimukku (Nooranad)", time: "8.15 a.m" }
    ]
  },
  {
    busNo: 20,
    routeName: "Oachira – Krishnapuram – Kattanam – Vetticodu",
    startPoint: "Oachira",
    destination: "SBCE Pattoor",
    departureTime: "7:25 AM",
    isAC: false,
    district: "Kollam",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Oachira", time: "7.25 a.m" },
      { stopNo: 2, name: "Krishnapuram", time: "7.35 a.m" },
      { stopNo: 3, name: "Kayamkulam Railway Station", time: "7.40 a.m" },
      { stopNo: 4, name: "Kuttitheruvu / 2nd mile stone", time: "7.45 a.m" },
      { stopNo: 5, name: "Kattanam", time: "7.50 a.m" },
      { stopNo: 6, name: "Vetticodu", time: "7.55 a.m" }
    ]
  },
  {
    busNo: 21,
    routeName: "Kayamkulam – Kattanam – Charummoodu – Padanilam",
    startPoint: "Kayamkulam",
    destination: "SBCE Pattoor",
    departureTime: "7:40 AM",
    isAC: false,
    district: "Alappuzha",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Kayamkulam", time: "7.40 a.m" },
      { stopNo: 2, name: "Kattanam", time: "7.50 a.m" },
      { stopNo: 3, name: "Vetticodu", time: "7.55 a.m" },
      { stopNo: 4, name: "Charummoodu", time: "8.00 a.m" },
      { stopNo: 5, name: "Nooranad Para Jn.", time: "8.10 a.m" },
      { stopNo: 6, name: "Padanilam", time: "8.15 a.m" }
    ]
  },
  {
    busNo: 22,
    routeName: "Choonad – Kurathikadu – Kallumala – Chunnakkara",
    startPoint: "Choonad",
    destination: "SBCE Pattoor",
    departureTime: "7:10 AM",
    isAC: false,
    district: "Alappuzha",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Choonad", time: "7.10 a.m" },
      { stopNo: 2, name: "Nambukulangara", time: "7.15 a.m" },
      { stopNo: 3, name: "Thazhava Mukku (Kattanam)", time: "7.20 a.m" },
      { stopNo: 4, name: "Bharanikkavu (Kurathikadu)", time: "7.25 a.m" },
      { stopNo: 5, name: "Kurathikadu", time: "7.35 a.m" },
      { stopNo: 6, name: "Kallumala", time: "7.40 a.m" },
      { stopNo: 7, name: "Arnoottimangalam", time: "7.45 a.m" },
      { stopNo: 8, name: "Nalumukku", time: "7.50 a.m" },
      { stopNo: 9, name: "Chunnakkara", time: "8.00 a.m" }
    ]
  },
  {
    busNo: 23,
    routeName: "Muttom via Chennithala – Mavelikara – Mankankuzhy",
    startPoint: "Muttom (Panachamud Jn)",
    destination: "SBCE Pattoor",
    departureTime: "7:35 AM",
    isAC: false,
    district: "Alappuzha",
    hikeRateType: "10% & 15% Increase",
    stops: [
      { stopNo: 1, name: "Muttom via Chennithala", time: "7.35 a.m" },
      { stopNo: 2, name: "Evoor (Panachamud jn)", time: "7.35 a.m" },
      { stopNo: 3, name: "Choondupalaka", time: "7.37 a.m" },
      { stopNo: 4, name: "Muttom Petrol Pump", time: "7.39 a.m" },
      { stopNo: 5, name: "Puthusseri Ambalam", time: "7.43 a.m" },
      { stopNo: 6, name: "Thattarambalam", time: "7.45 a.m" },
      { stopNo: 7, name: "Chennithala Ambalajunction", time: "7.49 a.m" },
      { stopNo: 8, name: "Store Junction", time: "7.54 a.m" },
      { stopNo: 9, name: "Jawahar Navodaya", time: "7.56 a.m" },
      { stopNo: 10, name: "Kallummoodu Jn", time: "7.58 a.m" },
      { stopNo: 11, name: "Puthiyakavu (Mavelikara)", time: "8.00 a.m" },
      { stopNo: 12, name: "Mavelikara Overbridge", time: "8.10 a.m" },
      { stopNo: 13, name: "Thazhkkara JN", time: "8.15 a.m" },
      { stopNo: 14, name: "Pynumud", time: "8.20 a.m" },
      { stopNo: 15, name: "Mankankuzhy", time: "8.30 a.m" }
    ]
  }
];

// Enrich stops with fares
busDefs.forEach(bus => {
  bus.stops.forEach(st => {
    const f = findFare(st.name, bus.busNo);
    if (f) {
      st.fare = {
        existingDay: f.existingDay,
        hike1Day: f.hike1Day,
        hike2Day: f.hike2Day,
        existingHostel: f.existingHostel,
        hike1Hostel: f.hike1Hostel,
        hike2Hostel: f.hike2Hostel,
        rateType: f.rateType
      };
    } else {
      st.fare = null;
    }
  });
});

const bankDetails = {
  bankName: "Canara Bank",
  accountNo: "41142200000106",
  accountTitle: "SREE BUDDHA EDUCATIONAL SOCIETY",
  ifscCode: "CNRB0014114",
  branch: "14114 - PATTOOR",
  purpose: "Bus Fare / Transportation Fee Payment 2026-27"
};

const transportGuidelines = [
  {
    title: "Morning Arrival & Timings",
    desc: "All college buses are scheduled to arrive at the Pattoor campus between 8:20 AM and 8:35 AM so that students and faculty reach comfortably before class and event sessions commence."
  },
  {
    title: "Evening Departure",
    desc: "Buses depart from the campus central bus terminal at 4:30 PM (or immediately following scheduled symposium & event valedictory sessions)."
  },
  {
    title: "Bus Pass & ID Policy",
    desc: "Students and day-scholars availing college transport must carry their valid SBCE Transport Pass / College Identity Card during travel."
  },
  {
    title: "Fee Remittance Procedure",
    desc: "Bus fees can be remitted directly to the college account via NetBanking, UPI, or Canara Bank branch counter. Please mention Student Name, Admission No., Semester, and Bus No. in the transaction remarks."
  }
];

const jsOutput = `// Auto-generated Comprehensive Bus Routes & Transport System Data
// Sree Buddha College of Engineering, Pattoor, Nooranad
// Academic Year / Transport Period: 2026-27

export const bankDetails = ${JSON.stringify(bankDetails, null, 2)};

export const transportGuidelines = ${JSON.stringify(transportGuidelines, null, 2)};

export const busRoutes = ${JSON.stringify(busDefs, null, 2)};

export const allFares = ${JSON.stringify(fareDatabase, null, 2)};
`;

fs.writeFileSync('c:/Users/vishn/OneDrive/Desktop/udhbavana/src/data/busData.js', jsOutput, 'utf-8');
console.log('Successfully generated src/data/busData.js!');

