import { FormData, EvaluationCriteria } from "./create-tender-form"

export interface Tender extends FormData {
  id: string
  total_bids: number
  highest_bid: number ;
}

export const mockTenders: Tender[] = [
  {
    id: "1",
    title: "Security Services Contract 2026 – Taman Melati Condominium",
    service_type: "Security",
    property_name: "Taman Melati Condominium",
    property_address_line_1: "No. 1, Jalan Melati 5/2",
    property_address_line_2: "Taman Melati Utama",
    property_postcode: "53100",
    property_city: "Setapak",
    property_state: "W.P. Kuala Lumpur",
    property_country: "Malaysia",
    scope_of_work: `Provision of 24/7 security services for 450-unit condominium.

Key requirements:
• Minimum 6 trained guards per shift (3 day, 3 night)
• CCTV monitoring with 90-day retention
• Visitor management system (QR code + card access)
• 4 patrol rounds per shift
• Incident reporting within 2 hours
• Monthly performance report & audit

Exclusions: armed security, cash-in-transit

Contractor must provide:
• Uniformed personnel with PSMB certification
• All equipment (walkie-talkie, torchlight, raincoat)
• Public liability insurance min RM 1 million
• Compliance with AKTA 2010 & BOMBA guidelines`,
    contract_period_days: "365",
    contract_start_date: "2026-03-01",
    contract_end_date: "2027-02-28",
    required_licenses: ["PSMB License", "BOMBA Certificate", "ISO 9001"],
    custom_licenses: [],
    evaluation_criteria: [
      { criteria: "Price competitiveness", weight: 35 },
      { criteria: "Experience & past performance", weight: 25 },
      { criteria: "Staff training & qualifications", weight: 20 },
      { criteria: "Proposed methodology & technology", weight: 15 },
      { criteria: "Equipment & response capability", weight: 5 },
    ],
    tender_fee: "800",
    min_budget: "150000",
    max_budget: "220000",
    closing_date: "2026-03-31",
    closing_time: "17:00",
    site_visit_date: "2026-02-25",
    site_visit_time: "10:00",
    contact_person: "Ahmad bin Abdullah",
    contact_email: "ahmad.abdullah@tamanmelati.com.my",
    contact_phone: "+6012-3456789",
    tender_documents: [],
    status: "open",
    created_at: "2026-02-16",
    updated_at: "",
    total_bids: 12,
    highest_bid: 150000,
  },
  {
    id: "2",
    title: "Cleaning Services - KLCC Office Tower",
    service_type: "Cleaning",
    property_name: "KLCC Office Tower",
    property_address_line_1: "Level 50, Suria KLCC",
    property_address_line_2: "Jalan Ampang",
    property_city: "Kuala Lumpur",
    property_state: "W.P. Kuala Lumpur",
    property_postcode: "50088",
    property_country: "Malaysia",
    scope_of_work: `Comprehensive cleaning services for 30-story office building.

Services required:
• Daily office cleaning (Monday to Friday)
• Restroom maintenance and sanitization
• Window cleaning (monthly)
• Carpet cleaning (quarterly)
• Waste management and recycling
• Pest control coordination

Special requirements:
• Green cleaning products preferred
• Minimum 8 cleaning staff per shift
• Equipment must be provided by contractor
• Insurance coverage required`,
    contract_period_days: "365",
    contract_start_date: "2026-04-01",
    contract_end_date: "2027-03-31",
    required_licenses: ["CIDB Registration", "MOF Registration"],
    custom_licenses: [],
    evaluation_criteria: [
      { criteria: "Price competitiveness", weight: 40 },
      { criteria: "Service quality & reliability", weight: 30 },
      { criteria: "Staff experience", weight: 15 },
      { criteria: "Environmental practices", weight: 10 },
      { criteria: "Equipment & technology", weight: 5 },
    ],
    tender_fee: "500",
    min_budget: "80000",
    max_budget: "120000",
    closing_date: "2026-03-15",
    closing_time: "17:00",
    site_visit_date: "2026-03-05",
    site_visit_time: "14:00",
    contact_person: "Sarah Lee",
    contact_email: "sarah.lee@klcc.com.my",
    contact_phone: "+6012-9876543",
    tender_documents: [],
    status: "open",
    created_at: "2026-02-10",
    updated_at: "",
    total_bids: 8,
    highest_bid: 100000,
  },
  {
    id: "3",
    title: "Landscaping & Maintenance - Mont Kiara Residential",
    service_type: "Landscaping",
    property_name: "Mont Kiara Hillside Residences",
    property_address_line_1: "No. 8, Jalan Kiara 3",
    property_address_line_2: "Mont Kiara",
    property_city: "Kuala Lumpur",
    property_state: "W.P. Kuala Lumpur",
    property_postcode: "50480",
    property_country: "Malaysia",
    scope_of_work: `Landscaping and garden maintenance for luxury residential complex.

Scope includes:
• Weekly lawn mowing and trimming
• Pruning and tree maintenance
• Irrigation system maintenance
• Fertilization and pest control
• Seasonal flower planting
• Garden waste disposal
• Pathway and driveway cleaning

Property details:
• Total landscaped area: 15,000 sq ft
• 3-tier garden design
• Water feature maintenance required`,
    contract_period_days: "730",
    contract_start_date: "2026-05-01",
    contract_end_date: "2028-04-30",
    required_licenses: ["CIDB Registration"],
    custom_licenses: ["Landscape Architecture License"],
    evaluation_criteria: [
      { criteria: "Price competitiveness", weight: 30 },
      { criteria: "Design & creativity", weight: 25 },
      { criteria: "Maintenance track record", weight: 25 },
      { criteria: "Equipment & resources", weight: 15 },
      { criteria: "Sustainability practices", weight: 5 },
    ],
    tender_fee: "300",
    min_budget: "60000",
    max_budget: "90000",
    closing_date: "2026-04-20",
    closing_time: "16:00",
    site_visit_date: "2026-04-10",
    site_visit_time: "09:00",
    contact_person: "Lim Wei Ming",
    contact_email: "lim.weiming@montkiara.com",
    contact_phone: "+6013-4567890",
    tender_documents: [],
    status: "open",
    created_at: "2026-03-01",
    updated_at: "",
    total_bids: 15,
    highest_bid: 80000,
  },
  {
    id: "4",
    title: "Pest Control Services - Shopping Mall",
    service_type: "Pest Control",
    property_name: "Sunway Pyramid Shopping Mall",
    property_address_line_1: "3, Jalan PJS 11/15",
    property_address_line_2: "Bandar Sunway",
    property_city: "Petaling Jaya",
    property_state: "Selangor",
    property_postcode: "47500",
    property_country: "Malaysia",
    scope_of_work: `Comprehensive pest control services for shopping mall complex.

Services required:
• Monthly pest inspection and treatment
• Rodent control (traps and bait stations)
• Cockroach and ant control
• Bird control measures
• Termite inspection (quarterly)
• Emergency pest response (24/7)
• Documentation and reporting

Coverage areas:
• Retail spaces (200+ units)
• Food court and restaurants
• Storage areas
• Parking facilities
• Common areas`,
    contract_period_days: "365",
    contract_start_date: "2026-06-01",
    contract_end_date: "2027-05-31",
    required_licenses: ["KKM Pest Control License", "CIDB Registration"],
    custom_licenses: [],
    evaluation_criteria: [
      { criteria: "Price competitiveness", weight: 35 },
      { criteria: "Effectiveness & track record", weight: 30 },
      { criteria: "Response time", weight: 20 },
      { criteria: "Safety & compliance", weight: 10 },
      { criteria: "Reporting & documentation", weight: 5 },
    ],
    tender_fee: "400",
    min_budget: "45000",
    max_budget: "65000",
    closing_date: "2025-05-15",
    closing_time: "18:00",
    site_visit_date: "2026-05-08",
    site_visit_time: "11:00",
    contact_person: "Nurul Aisyah binti Hassan",
    contact_email: "nurul.aisyah@sunway.com.my",
    contact_phone: "+6014-5678901",
    tender_documents: [],
    status: "closed",
    created_at: "2026-04-05",
    updated_at: "2026-05-15",
    total_bids: 22,
    highest_bid: 0,
  },
  {
    id: "5",
    title: "Facilities Management - Corporate Office Building",
    service_type: "Facilities Management",
    property_name: "Menara UOA Corporate Tower",
    property_address_line_1: "No. 19, Jalan Pinang",
    property_address_line_2: "Kuala Lumpur City Centre",
    property_city: "Kuala Lumpur",
    property_state: "W.P. Kuala Lumpur",
    property_postcode: "50450",
    property_country: "Malaysia",
    scope_of_work: `Integrated facilities management services for 25-story corporate office building.

Comprehensive FM services:
• Building maintenance and repairs
• HVAC system maintenance
• Electrical and plumbing services
• Elevator maintenance coordination
• Fire safety system maintenance
• Security services coordination
• Cleaning services management
• Waste management
• Landscaping maintenance
• Tenant services support

Key requirements:
• 24/7 facilities management office
• Minimum 5 years experience in commercial FM
• ISO 9001 and ISO 14001 certified preferred
• Dedicated account manager required`,
    contract_period_days: "1095",
    contract_start_date: "2026-07-01",
    contract_end_date: "2029-06-30",
    required_licenses: ["CIDB Registration", "ISO 9001 Certification", "BOMBA Certificate"],
    custom_licenses: [],
    evaluation_criteria: [
      { criteria: "Price competitiveness", weight: 25 },
      { criteria: "Experience & track record", weight: 30 },
      { criteria: "Service quality & reliability", weight: 20 },
      { criteria: "Technology & innovation", weight: 15 },
      { criteria: "Sustainability & green practices", weight: 10 },
    ],
    tender_fee: "1500",
    min_budget: "500000",
    max_budget: "750000",
    closing_date: "2026-06-30",
    closing_time: "17:00",
    site_visit_date: "2026-06-15",
    site_visit_time: "10:00",
    contact_person: "Tan Chee Keong",
    contact_email: "tan.cheekeong@uoa.com.my",
    contact_phone: "+6016-7890123",
    tender_documents: [],
    status: "open",
    created_at: "2026-05-20",
    updated_at: "",
    total_bids: 5,
    highest_bid: 600000,
  },
]
