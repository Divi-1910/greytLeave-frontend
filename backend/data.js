import { EmploymentType } from "@prisma/client";

export const holidays = [
  {
    id: 1,
    name: "New Year's Day Holiday",
    date: "2025-01-01T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 2,
    name: "Chinese New Year Holiday",
    date: "2025-01-29T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 3,
    name: "Chinese New Year Holiday",
    date: "2025-01-30T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 4,
    name: "Hari Raya Puasa",
    date: "2025-03-31T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 5,
    name: "Good Friday",
    date: "2025-04-18T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 6,
    name: "Labour Day / May Day",
    date: "2025-05-01T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 7,
    name: "Vesak Day",
    date: "2025-05-12T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 8,
    name: "Hari Raya Haji",
    date: "2025-06-09T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 9,
    name: "National Day Holiday",
    date: "2025-08-11T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 10,
    name: "Deepawali",
    date: "2025-10-20T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 11,
    name: "Christmas Day",
    date: "2025-12-25T00:00:00.000Z",
    isOptional: false,
    countryId: 1
  },
  {
    id: 12,
    name: "New Year's Day Holiday",
    date: "2025-01-01T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 13,
    name: "Chinese New Year Holiday",
    date: "2025-01-29T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 14,
    name: "Chinese New Year Holiday",
    date: "2025-01-30T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 15,
    name: "Thaipusam Holiday",
    date: "2025-02-11T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 16,
    name: "Nuzul-al-Quran",
    date: "2025-03-18T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 17,
    name: "Hari Raya Aidilfitri",
    date: "2025-03-31T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 18,
    name: "Hari Raya Aidilfitri",
    date: "2025-04-01T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 19,
    name: "Labour Day",
    date: "2025-05-01T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 20,
    name: "Vesak Day",
    date: "2025-05-12T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 21,
    name: "Agong's Birthday",
    date: "2025-06-02T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 22,
    name: "Awal Muharram / Islamic New Year",
    date: "2025-06-27T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 23,
    name: "Merdeka Day Holiday",
    date: "2025-09-01T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 24,
    name: "Prophet Muhammad’s Birthday Holiday",
    date: "2025-09-05T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 25,
    name: "Malaysia Day",
    date: "2025-09-16T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 26,
    name: "Deepavali",
    date: "2025-10-20T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 27,
    name: "Sultan of Selangor's Birthday Holiday",
    date: "2025-12-11T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 28,
    name: "Christmas Day",
    date: "2025-12-25T00:00:00.000Z",
    isOptional: false,
    countryId: 2
  },
  {
    id: 29,
    name: "New Year’s Day Holiday",
    date: "2025-01-01T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 30,
    name: "Chinese New Year Holiday",
    date: "2025-01-29T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 31,
    name: "Makha Bucha Day",
    date: "2025-02-12T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 32,
    name: "Chakri Memorial Day",
    date: "2025-04-07T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 33,
    name: "Songkran Festival Holidays",
    date: "2025-04-14T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 34,
    name: "Songkran Festival Holidays",
    date: "2025-04-15T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 35,
    name: "Labour Day Holiday",
    date: "2025-05-01T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 36,
    name: "Coronation of King Vajiralongkorn",
    date: "2025-05-05T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 37,
    name: "Vishaka Bucha Day",
    date: "2025-05-12T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 38,
    name: "Substitution for H.M. Queen Sirikit The Queen Mother’s Birthday",
    date: "2025-08-12T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 39,
    name: "Passing of His Majesty the Late King",
    date: "2025-10-14T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 40,
    name: "Chulalongkorn Memorial Day",
    date: "2025-10-23T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 41,
    name: "His Majesty the Late King's Birthday",
    date: "2025-12-05T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 42,
    name: "Constitution Day",
    date: "2025-12-10T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 43,
    name: "Christmas Day",
    date: "2025-12-25T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 44,
    name: "New Year’s Eve",
    date: "2025-12-31T00:00:00.000Z",
    isOptional: false,
    countryId: 3
  },
  {
    id: 45,
    name: "New Year's Day Holiday",
    date: "2025-01-01T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 46,
    name: "Isra Mi'raj Holiday",
    date: "2025-01-27T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 47,
    name: "Chinese New Year Holiday",
    date: "2025-01-29T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 48,
    name: "Idul Fitri Holidays",
    date: "2025-03-31T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 49,
    name: "Idul Fitri Holidays",
    date: "2025-04-01T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 50,
    name: "Good Friday",
    date: "2025-04-18T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 51,
    name: "International Labor Day",
    date: "2025-05-01T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 52,
    name: "Vesak Day",
    date: "2025-05-12T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 53,
    name: "Ascension Day of Jesus Christ",
    date: "2025-05-29T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 54,
    name: "Idul Adha",
    date: "2025-06-06T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 55,
    name: "Islamic New Year / Muharram",
    date: "2025-06-27T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 56,
    name: "Indonesian Independence Day",
    date: "2025-08-18T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 57,
    name: "Birthday of Prophet Muhammad",
    date: "2025-09-05T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 58,
    name: "Christmas Day",
    date: "2025-12-25T00:00:00.000Z",
    isOptional: false,
    countryId: 4
  },
  {
    id: 59,
    name: "New Year's Day Holiday",
    date: "2025-01-01T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 60,
    name: "Pongal/Bihu/Makar Sankranti",
    date: "2025-01-14T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 61,
    name: "Republic Day Holiday",
    date: "2025-01-27T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 62,
    name: "Holi",
    date: "2025-03-14T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 63,
    name: "Ramazan Eid",
    date: "2025-03-31T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 64,
    name: "Tamil New Year Holiday",
    date: "2025-04-14T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 65,
    name: "Good Friday",
    date: "2025-04-18T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 66,
    name: "May Day / Labour Day",
    date: "2025-05-01T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 67,
    name: "Independence Day",
    date: "2025-08-15T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 68,
    name: "Ganesh Chaturthi Holiday",
    date: "2025-08-27T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 69,
    name: "Bakri Eid",
    date: "2025-09-05T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 70,
    name: "Ayudha Pooja",
    date: "2025-10-01T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 71,
    name: "Mahatma Gandhi Jayanti & Dussehra",
    date: "2025-10-02T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 72,
    name: "Diwali",
    date: "2025-10-20T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 73,
    name: "Diwali",
    date: "2025-10-21T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 74,
    name: "Christmas Day",
    date: "2025-12-25T00:00:00.000Z",
    isOptional: false,
    countryId: 5
  },
  {
    id: 75,
    name: "New Year's Day",
    date: "2025-01-01T00:00:00.000Z",
    isOptional: false,
    countryId: 6
  },
  {
    id: 76,
    name: "Tet Holiday",
    date: "2025-01-28T00:00:00.000Z",
    isOptional: false,
    countryId: 6
  },
  {
    id: 77,
    name: "Tet Holiday",
    date: "2025-02-03T00:00:00.000Z",
    isOptional: false,
    countryId: 6
  },
  {
    id: 78,
    name: "Hung King’s Day Holiday",
    date: "2025-04-07T00:00:00.000Z",
    isOptional: false,
    countryId: 6
  },
  {
    id: 79,
    name: "Reunification Day",
    date: "2025-04-30T00:00:00.000Z",
    isOptional: false,
    countryId: 6
  },
  {
    id: 80,
    name: "International Labor Day",
    date: "2025-05-01T00:00:00.000Z",
    isOptional: false,
    countryId: 6
  },
  {
    id: 81,
    name: "National Day Holidays",
    date: "2025-09-01T00:00:00.000Z",
    isOptional: false,
    countryId: 6
  },
  {
    id: 82,
    name: "National Day Holidays",
    date: "2025-09-02T00:00:00.000Z",
    isOptional: false,
    countryId: 6
  },
  {
    id: 83,
    name: "Christmas Day",
    date: "2025-12-25T00:00:00.000Z",
    isOptional: false,
    countryId: 6
  },
  {
    id: 84,
    name: "New Year's Day",
    date: "2025-01-01T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 85,
    name: "Chinese New Year Holiday",
    date: "2025-01-29T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 86,
    name: "Hari Raya Puasa",
    date: "2025-03-31T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 87,
    name: "Maundy Thursday",
    date: "2025-04-17T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 88,
    name: "Good Friday",
    date: "2025-04-18T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 89,
    name: "Labor Day",
    date: "2025-05-01T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 90,
    name: "Idul Adha",
    date: "2025-06-06T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 91,
    name: "Independence Day",
    date: "2025-06-12T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 92,
    name: "Ninoy Aquino Day",
    date: "2025-08-21T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 93,
    name: "National Heroes Day",
    date: "2025-08-25T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 94,
    name: "All Saints' Day",
    date: "2025-10-31T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 95,
    name: "Bonifacio Day",
    date: "2025-12-01T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 96,
    name: "Christmas Holidays",
    date: "2025-12-24T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 97,
    name: "Christmas Holidays",
    date: "2025-12-25T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 98,
    name: "Holiday for Rizal Day and New Year’s Eve",
    date: "2025-12-30T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  },
  {
    id: 99,
    name: "Holiday for Rizal Day and New Year’s Eve",
    date: "2025-12-31T00:00:00.000Z",
    isOptional: false,
    countryId: 7
  }
];

export const countries = [
  { id: 1, name: "Singapore", code: "SGP" },
  { id: 2, name: "Philippines", code: "PHL" },
  { id: 3, name: "Malaysia", code: "MYS" },
  { id: 4, name: "Thailand", code: "THA" },
  { id: 5, name: "Indonesia", code: "IDN" },
  { id: 6, name: "India", code: "IND" },
  { id: 7, name: "Vietnam", code: "VNM" }
];

export const departments = [
  { name: "EBU", id: 1 },
  { name: "CSM", id: 2 },
  { name: "People", id: 3 },
  { name: "Product & Engineering", id: 4 },
  { name: "Finance", id: 5 },
  { name: "Data Engineering", id: 6 },
  { name: "Marketplace Delivery", id: 7 },
  { name: "Product", id: 8 },
  { name: "FinOps", id: 9 },
  { name: "Marketing", id: 10 },
  { name: "IT & Admin", id: 11 },
  { name: "Account Management", id: 12 },
  { name: "Performance Marketing", id: 13 },
  { name: "Business Development & Partnerships", id: 14 },
  { name: "Management", id: 15 }
];

export const roles = [
  { id: 1, name: "Sr Associate, Customer Solutions - EBU" },
  { id: 2, name: "Director, CSM & Product" },
  { id: 3, name: "Senior Project Manager" },
  { id: 4, name: "Senior Manager, People & Culture" },
  { id: 5, name: "Senior Manager, Product & Engineering" },
  { id: 6, name: "Manager, Product & Engineering" },
  { id: 7, name: "VP, Enterprise Business Unit" },
  { id: 8, name: "Senior Manager, Finance" },
  { id: 9, name: "Director, Data Engineering" },
  { id: 10, name: "Lead Engineer, Product & Engineering" },
  { id: 11, name: "Manager, E-Commerce Operations" },
  { id: 12, name: "Senior Manager, Product" },
  { id: 13, name: "Engineer, EBU" },
  { id: 14, name: "Director, E-Commerce Operations" },
  { id: 15, name: "Senior Manager, UI/UX Design, EBU" },
  { id: 16, name: "Manager, Product" },
  { id: 17, name: "Lead, E-Commerce Operations" },
  { id: 18, name: "Senior Manager, FinOps" },
  { id: 19, name: "Senior Engineer, EBU" },
  { id: 20, name: "Senior Manager, E-Commerce Operations" },
  { id: 21, name: "Manager, CSM & Product" },
  { id: 22, name: "Senior Associate, E-Commerce Operations" },
  { id: 23, name: "Senior Associate, Design" },
  { id: 24, name: "Associate Project Manager" },
  { id: 25, name: "Lead Engineer, QC" },
  { id: 26, name: "Associate, E-Commerce Operations" },
  { id: 27, name: "Associate, Buyer Experience" },
  { id: 28, name: "Senior Analyst, CSM & Product" },
  { id: 29, name: "Senior Architect, Enterprise Solutions, EBU" },
  { id: 30, name: "Director, Data Engineering - SRE" },
  { id: 31, name: "Senior Associate, Buyer Experience" },
  { id: 32, name: "Lead, Buyer Experience" },
  { id: 33, name: "Senior Engineer, Product & Engineering" },
  { id: 34, name: "Director, Product" },
  { id: 35, name: "Senior Manager, Design" },
  { id: 36, name: "Senior Quality Engineer" },
  { id: 37, name: "Lead Engineer, IT" },
  { id: 38, name: "Senior Associate, Finance" },
  { id: 39, name: "Director, Finance" },
  { id: 40, name: "CTO, Engineering" },
  { id: 41, name: "Engineer, QA" },
  { id: 42, name: "Sr Engineer, Product & Engineering" },
  { id: 43, name: "Engineer, Product & Engineering" },
  { id: 44, name: "Senior Analyst, Product" },
  { id: 45, name: "Associate, Customer Solutions - EBU" },
  { id: 46, name: "Senior Associate, FinOps" },
  { id: 47, name: "Sr Engineer, QA Automation" },
  { id: 48, name: "Senior Engineer, Data Engineering" },
  { id: 49, name: "Analyst, Data Engineering" },
  { id: 50, name: "Senior Manager, Marketing" },
  { id: 51, name: "Sr Engineer, EBU" },
  { id: 52, name: "Assistant Manager, Finance" },
  { id: 53, name: "Associate, Design" },
  { id: 54, name: "Sr Manager, Product & Engineering" },
  { id: 55, name: "Tech Lead, Product & Engineering" },
  { id: 56, name: "Sr Analyst - Product" },
  { id: 57, name: "EA to Founders" },
  { id: 58, name: "Tech Lead, Data Science" },
  { id: 59, name: "Sr Associate, Design" },
  { id: 60, name: "Engineer, Customer Solutions" },
  { id: 61, name: "Associate, Account Management" },
  { id: 62, name: "Manager, Administration" },
  { id: 63, name: "Associate, Customer Solutions" },
  { id: 64, name: "Associate Engineer, QA - EBU" },
  { id: 65, name: "Associate, Product Catalogue" },
  { id: 66, name: "Technical Lead, Magento" },
  { id: 67, name: "Principal Data Scientist, Data Engineering" },
  { id: 68, name: "Project Manager, EBU" },
  { id: 69, name: "Manager, Finance" },
  { id: 70, name: "Quality Engineer" },
  { id: 71, name: "Associate, FinOps" },
  { id: 72, name: "Lead, People & Culture" },
  { id: 73, name: "Senior Associate, Marketing" },
  { id: 74, name: "Project Manager" },
  { id: 75, name: "Senior Associate, Account Management" },
  { id: 76, name: "Manager, Account Management" },
  { id: 77, name: "Director, Account Management" },
  { id: 78, name: "Director, CSM" },
  { id: 79, name: "Lead, Performance Marketing" },
  { id: 80, name: "Senior Manager, Performance Marketing" },
  { id: 81, name: "Senior Manager, Account Management" },
  { id: 82, name: "Director, Performance Marketing" },
  { id: 83, name: "Sr Analyst, Performance Marketing" },
  { id: 84, name: "Senior Analyst, Performance Marketing" },
  { id: 85, name: "Analyst, Performance Marketing" },
  { id: 86, name: "Senior Manager, Sales" },
  { id: 87, name: "CEO" },
  { id: 88, name: "COO" },
  { id: 89, name: "EVP, Business Development & Partnerships" },
  { id: 90, name: "EVP, Account Management & Delivery" },
  { id: 91, name: "Chief Experience Officer, CSM" },
  { id: 92, name: "VP Performance Marketing" },
  { id: 93, name: "CFO" },
  { id: 94, name: "Contractor, Performance Marketing" },
  { id: 95, name: "Senior Manager, Graphic Design" },
  { id: 96, name: "Associate, Marketplace Delivery" },
  { id: 97, name: "Analyst, Product" },
  { id: 98, name: "Engineer, Data Engineering" },
  { id: 99, name: "Senior Manager, Data Engineering" },
  { id: 100, name: "Associate, Project Management" },
  { id: 101, name: "Engineer, Data Engineering - SRE" },
  { id: 102, name: "Intern, E-Commerce Operations" },
  { id: 103, name: "Business System Analyst (Manager, Performance Marketing)" },
  { id: 104, name: "Intern, Performance Marketing" },
  { id: 105, name: "Engineer, IT Services" },
  { id: 106, name: "Consultant, Performance Marketing" },
  { id: 107, name: "Intern, EBU" },
  { id: 108, name: "Intern, Data Engineering" },
  { id: 109, name: "Manager, Product & Marketing" },
  { id: 110, name: "Engineer, Data Science" },
  { id: 111, name: "Intern, Product" }
];

export const leaveTypes = [
  {
    id: 1,
    name: "Child Care Leave",
    description: "Leave for taking care of a child",
    requiresProof: true
  },
  {
    id: 2,
    name: "Annual Leave",
    description: "Paid time off for vacation or personal reasons",
    requiresProof: false
  },
  {
    id: 3,
    name: "Hospitalization Leave",
    description: "Leave for hospitalization due to health issues",
    requiresProof: true
  },
  {
    id: 4,
    name: "Sick Leave",
    description: "Leave for health-related issues",
    requiresProof: false
  },
  {
    id: 5,
    name: "Privilege Leave",
    description:
      "Additional leave for employees as a privilege based on experience",
    requiresProof: false
  },
  {
    id: 6,
    name: "Miscarriage Leave",
    description: "Leave for employees who have experienced a miscarriage",
    requiresProof: true
  },
  {
    id: 7,
    name: "Marriage Leave",
    description: "Leave for employees getting married",
    requiresProof: true
  },
  {
    id: 8,
    name: "Maternity Leave",
    description:
      "Leave for female employees during pregnancy and after childbirth",
    requiresProof: true
  },
  {
    id: 9,
    name: "Paternity Leave",
    description: "Leave for male employees following the birth of a child",
    requiresProof: true
  },
  {
    id: 10,
    name: "Violence Against Women and Children Leave",
    description: "Leave for victims of violence",
    requiresProof: false
  },
  {
    id: 11,
    name: "Bereavement Leave",
    description: "Leave in case of death of a close family member",
    requiresProof: true
  },
  {
    id: 12,
    name: "Loss of Pay Leave",
    description: "Leave without pay",
    requiresProof: false
  },
  {
    id: 13,
    name: "Adoption Leave",
    description: "Leave for employees adopting a child",
    requiresProof: true
  },
  {
    id: 14,
    name: "Compensation Leave",
    description: "Leave given as compensation for extra work",
    requiresProof: false
  },
  {
    id: 15,
    name: "Birthday Leave",
    description: "Leave on the employee’s birthday",
    requiresProof: true
  }
];

export const leavePolicies = [
  { id: 1, countryId: 1, leaveTypeId: 1, allowedDays: 6 },
  { id: 2, countryId: 1, leaveTypeId: 2, allowedDays: 12, maxCarryForward: 5 },
  { id: 3, countryId: 1, leaveTypeId: 3, allowedDays: 60 },
  { id: 4, countryId: 1, leaveTypeId: 4, allowedDays: 12 },
  { id: 5, countryId: 1, leaveTypeId: 5, allowedDays: 5 },
  { id: 6, countryId: 1, leaveTypeId: 6, allowedDays: 90 },
  { id: 7, countryId: 1, leaveTypeId: 7, allowedDays: 5 },
  { id: 8, countryId: 1, leaveTypeId: 8, allowedDays: 90 },
  { id: 9, countryId: 1, leaveTypeId: 9, allowedDays: 15 },
  { id: 10, countryId: 1, leaveTypeId: 11, allowedDays: 5 },
  { id: 11, countryId: 1, leaveTypeId: 12, allowedDays: 10000 },
  { id: 12, countryId: 1, leaveTypeId: 13, allowedDays: 84 },
  { id: 13, countryId: 1, leaveTypeId: 14, allowedDays: 10000 },
  { id: 14, countryId: 1, leaveTypeId: 15, allowedDays: 1 },
  { id: 15, countryId: 2, leaveTypeId: 2, allowedDays: 12, maxCarryForward: 5 },
  { id: 16, countryId: 2, leaveTypeId: 3, allowedDays: 60 },
  { id: 17, countryId: 2, leaveTypeId: 4, allowedDays: 12 },
  { id: 18, countryId: 2, leaveTypeId: 5, allowedDays: 5 },
  { id: 19, countryId: 2, leaveTypeId: 6, allowedDays: 90 },
  { id: 20, countryId: 2, leaveTypeId: 7, allowedDays: 5 },
  { id: 21, countryId: 2, leaveTypeId: 8, allowedDays: 90 },
  { id: 22, countryId: 2, leaveTypeId: 9, allowedDays: 15 },
  { id: 23, countryId: 2, leaveTypeId: 10, allowedDays: 10 },
  { id: 24, countryId: 2, leaveTypeId: 11, allowedDays: 5 },
  { id: 25, countryId: 2, leaveTypeId: 12, allowedDays: 10000 },
  { id: 26, countryId: 2, leaveTypeId: 13, allowedDays: 84 },
  { id: 27, countryId: 2, leaveTypeId: 14, allowedDays: 10000 },
  { id: 28, countryId: 2, leaveTypeId: 15, allowedDays: 1 },
  { id: 29, countryId: 3, leaveTypeId: 2, allowedDays: 12, maxCarryForward: 5 },
  { id: 30, countryId: 3, leaveTypeId: 3, allowedDays: 60 },
  { id: 31, countryId: 3, leaveTypeId: 4, allowedDays: 12 },
  { id: 32, countryId: 3, leaveTypeId: 5, allowedDays: 5 },
  { id: 33, countryId: 3, leaveTypeId: 6, allowedDays: 90 },
  { id: 34, countryId: 3, leaveTypeId: 7, allowedDays: 5 },
  { id: 35, countryId: 3, leaveTypeId: 8, allowedDays: 90 },
  { id: 36, countryId: 3, leaveTypeId: 9, allowedDays: 15 },
  { id: 37, countryId: 3, leaveTypeId: 11, allowedDays: 5 },
  { id: 38, countryId: 3, leaveTypeId: 12, allowedDays: 10000 },
  { id: 39, countryId: 3, leaveTypeId: 13, allowedDays: 84 },
  { id: 40, countryId: 3, leaveTypeId: 14, allowedDays: 10000 },
  { id: 41, countryId: 3, leaveTypeId: 15, allowedDays: 1 },
  { id: 42, countryId: 4, leaveTypeId: 2, allowedDays: 12, maxCarryForward: 5 },
  { id: 43, countryId: 4, leaveTypeId: 3, allowedDays: 60 },
  { id: 44, countryId: 4, leaveTypeId: 4, allowedDays: 12 },
  { id: 45, countryId: 4, leaveTypeId: 5, allowedDays: 5 },
  { id: 46, countryId: 4, leaveTypeId: 6, allowedDays: 90 },
  { id: 47, countryId: 4, leaveTypeId: 7, allowedDays: 5 },
  { id: 48, countryId: 4, leaveTypeId: 8, allowedDays: 90 },
  { id: 49, countryId: 4, leaveTypeId: 9, allowedDays: 15 },
  { id: 50, countryId: 4, leaveTypeId: 11, allowedDays: 5 },
  { id: 51, countryId: 4, leaveTypeId: 12, allowedDays: 10000 },
  { id: 52, countryId: 4, leaveTypeId: 13, allowedDays: 84 },
  { id: 53, countryId: 4, leaveTypeId: 14, allowedDays: 10000 },
  { id: 54, countryId: 4, leaveTypeId: 15, allowedDays: 1 },
  { id: 55, countryId: 5, leaveTypeId: 2, allowedDays: 12, maxCarryForward: 5 },
  { id: 56, countryId: 5, leaveTypeId: 3, allowedDays: 60 },
  { id: 57, countryId: 5, leaveTypeId: 4, allowedDays: 12 },
  { id: 58, countryId: 5, leaveTypeId: 5, allowedDays: 5 },
  { id: 59, countryId: 5, leaveTypeId: 6, allowedDays: 90 },
  { id: 60, countryId: 5, leaveTypeId: 7, allowedDays: 5 },
  { id: 61, countryId: 5, leaveTypeId: 8, allowedDays: 90 },
  { id: 62, countryId: 5, leaveTypeId: 9, allowedDays: 15 },
  { id: 63, countryId: 5, leaveTypeId: 11, allowedDays: 5 },
  { id: 64, countryId: 5, leaveTypeId: 12, allowedDays: 10000 },
  { id: 65, countryId: 5, leaveTypeId: 13, allowedDays: 84 },
  { id: 66, countryId: 5, leaveTypeId: 14, allowedDays: 10000 },
  { id: 67, countryId: 5, leaveTypeId: 15, allowedDays: 1 },
  { id: 68, countryId: 6, leaveTypeId: 2, allowedDays: 12, maxCarryForward: 5 },
  { id: 69, countryId: 6, leaveTypeId: 3, allowedDays: 60 },
  { id: 70, countryId: 6, leaveTypeId: 4, allowedDays: 12 },
  { id: 71, countryId: 6, leaveTypeId: 5, allowedDays: 5 },
  { id: 72, countryId: 6, leaveTypeId: 6, allowedDays: 90 },
  { id: 73, countryId: 6, leaveTypeId: 7, allowedDays: 5 },
  { id: 74, countryId: 6, leaveTypeId: 8, allowedDays: 90 },
  { id: 75, countryId: 6, leaveTypeId: 9, allowedDays: 15 },
  { id: 76, countryId: 6, leaveTypeId: 11, allowedDays: 5 },
  { id: 77, countryId: 6, leaveTypeId: 12, allowedDays: 10000 },
  { id: 78, countryId: 6, leaveTypeId: 13, allowedDays: 84 },
  { id: 79, countryId: 6, leaveTypeId: 14, allowedDays: 10000 },
  { id: 80, countryId: 6, leaveTypeId: 15, allowedDays: 1 },
  { id: 81, countryId: 7, leaveTypeId: 2, allowedDays: 12, maxCarryForward: 5 },
  { id: 82, countryId: 7, leaveTypeId: 3, allowedDays: 60 },
  { id: 83, countryId: 7, leaveTypeId: 4, allowedDays: 12 },
  { id: 84, countryId: 7, leaveTypeId: 5, allowedDays: 5 },
  { id: 85, countryId: 7, leaveTypeId: 6, allowedDays: 90 },
  { id: 86, countryId: 7, leaveTypeId: 7, allowedDays: 5 },
  { id: 87, countryId: 7, leaveTypeId: 8, allowedDays: 90 },
  { id: 88, countryId: 7, leaveTypeId: 9, allowedDays: 15 },
  { id: 89, countryId: 7, leaveTypeId: 11, allowedDays: 5 },
  { id: 90, countryId: 7, leaveTypeId: 12, allowedDays: 10000 },
  { id: 91, countryId: 7, leaveTypeId: 13, allowedDays: 84 },
  { id: 92, countryId: 7, leaveTypeId: 14, allowedDays: 10000 },
  { id: 93, countryId: 7, leaveTypeId: 15, allowedDays: 1 }
];

export const employees = [
  {
    id: 1,
    employeeCode: "EMP001",
    fullName: "John Doe",
    emailAddress: "divyansh.muley@graas.ai",
    passwordHash: "",
    dateOfJoining: new Date("2020-01-01"),
    employmentType: EmploymentType.FullTime,
    roleId: 4,
    countryId: 1,
    departmentId: 1, //
    managerId: null, // No (CEO)
    isActive: true,
    isOnNoticePeriod: false
  },
  {
    id: 2,
    employeeCode: "EMP002",
    fullName: "Jane Smith",
    emailAddress: "divyansh.muley@graas.ai",
    passwordHash: "hashedpassword2",
    dateOfJoining: new Date("2018-06-01"),
    employmentType: EmploymentType.FullTime,
    roleId: 3,
    countryId: 1,
    departmentId: 1,
    managerId: 1,
    isActive: true,
    isOnNoticePeriod: false
  },
  {
    id: 3,
    employeeCode: "EMP003",
    fullName: "Tom Green",
    emailAddress: "divyansh.muley@graas.ai",
    passwordHash: "hashedpassword3",
    dateOfJoining: new Date("2021-05-01"),
    employmentType: EmploymentType.FullTime,
    roleId: 2,
    countryId: 1,
    departmentId: 1,
    managerId: 2,
    isActive: true,
    isOnNoticePeriod: false
  },
  {
    id: 4,
    employeeCode: "EMP004",
    fullName: "Lucy Brown",
    emailAddress: "lucy.brown@company.com",
    employmentType: EmploymentType.FullTime,
    passwordHash: "hashedpassword4",
    dateOfJoining: new Date("2020-03-15"),
    roleId: 1,
    countryId: 1,
    departmentId: 1, // Product Management
    managerId: 3, // Tom Green is Lucy's manager
    isActive: true,
    isOnNoticePeriod: false
  },
  {
    id: 5,
    employeeCode: "EMP005",
    fullName: "Michael Clark",
    emailAddress: "michael.clark@company.com",
    passwordHash: "hashedpassword5",
    dateOfJoining: new Date("2019-01-01"),
    employmentType: EmploymentType.FullTime,

    roleId: 3, // Vice President
    countryId: 2, // Philippines
    departmentId: 2, // Ecommerce Operations
    managerId: 1, // John Doe is Michael's manager
    isActive: true,
    isOnNoticePeriod: false
  },
  {
    id: 6,
    employeeCode: "EMP006",
    fullName: "Sarah Adams",
    emailAddress: "sarah.adams@company.com",
    passwordHash: "hashedpassword6",
    dateOfJoining: new Date("2021-07-01"),
    employmentType: EmploymentType.FullTime,
    roleId: 2, // Manager
    countryId: 2, // Philippines
    departmentId: 2, // Ecommerce Operations
    managerId: 5, // Michael Clark is Sarah's manager
    isActive: true,
    isOnNoticePeriod: false
  },
  {
    id: 7,
    employeeCode: "EMP007",
    fullName: "James Wilson",
    emailAddress: "james.wilson@company.com",
    passwordHash: "hashedpassword7",
    dateOfJoining: new Date("2022-09-10"),
    employmentType: EmploymentType.FullTime,
    roleId: 1, // Employee
    countryId: 2, // Philippines
    departmentId: 2, // Ecommerce Operations
    managerId: 6, // Sarah Adams is James's manager
    isActive: true,
    isOnNoticePeriod: false
  },
  {
    id: 8,
    employeeCode: "EMP008",
    fullName: "Laura Martinez",
    emailAddress: "laura.martinez@company.com",
    passwordHash: "hashedpassword8",
    dateOfJoining: new Date("2020-05-20"),
    roleId: 1, // Employee
    countryId: 3, // Malaysia
    departmentId: 3, // Performance Marketing
    employmentType: EmploymentType.FullTime,

    managerId: null, // No manager
    isActive: true,
    isOnNoticePeriod: false
  },
  {
    id: 9,
    employeeCode: "EMP009",
    fullName: "David Lee",
    emailAddress: "david.lee@company.com",
    passwordHash: "hashedpassword9",
    dateOfJoining: new Date("2021-06-10"),
    employmentType: EmploymentType.FullTime,
    roleId: 2, // Manager
    countryId: 3, // Malaysia
    departmentId: 3, // Performance Marketing
    managerId: 8, // Laura Martinez is David's manager
    isActive: true,
    isOnNoticePeriod: false
  },
  {
    id: 10,
    employeeCode: "EMP010",
    fullName: "Emily Taylor",
    emailAddress: "emily.taylor@company.com",
    employmentType: EmploymentType.FullTime,
    passwordHash: "hashedpassword10",
    dateOfJoining: new Date("2022-01-01"),
    roleId: 1,
    countryId: 3,
    departmentId: 3,
    managerId: 9,
    isActive: true,
    isOnNoticePeriod: false
  }
];
