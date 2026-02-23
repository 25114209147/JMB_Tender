  
  export interface FormData {
    // Basic Information
    title: string;
    service_type: string;
    custom_service_type?: string;
    // Property Information
    property_name: string;
    property_address_line_1: string;
    property_address_line_2: string;
    property_city: string;
    property_state: string;
    property_postcode: string;
    property_country: string;
    // Scope & Requirements
    scope_of_work: string;
    contract_period_days: string;
    contract_start_date: string;
    contract_end_date: string;
    required_licenses: string[];
    custom_licenses: string[]; // Array to support multiple custom licenses when "Others" is selected
    evaluation_criteria: EvaluationCriteria[];
    tender_fee: string;
    // Budget & Timeline
    min_budget: string;
    max_budget: string;
    closing_date: string;
    closing_time: string;
    // Site Visit
    site_visit_date?: string;
    site_visit_time?: string;
    // Contact Information
    contact_person: string;
    contact_email: string;
    contact_phone: string;
    // Tender Documents
    tender_documents: string[];
    status: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface EvaluationCriteria {
    criteria: string;
    weight: number;
  }

  export const emptyFormData: FormData = {
    title: "",
    service_type: "",
    property_name: "",
    property_address_line_1: "",
    property_address_line_2: "",
    property_postcode: "",
    property_city: "",
    property_state: "",
    property_country: "Malaysia",
    scope_of_work: "",
    contract_period_days: "",
    contract_start_date: "",
    contract_end_date: "",
    required_licenses: [],
    custom_licenses: [],
    evaluation_criteria: [
      { criteria: "Price competitiveness", weight: 30 },
      { criteria: "Experience & track record", weight: 25 },
      { criteria: "Staff qualifications", weight: 20 },
      { criteria: "Proposed methodology", weight: 15 },
      { criteria: "Equipment & resources", weight: 10 },
    ],
    tender_fee: "",
    min_budget: "",
    max_budget: "",
    closing_date: "",
    closing_time: "",
    site_visit_date: "",
    site_visit_time: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    tender_documents: [],
    status: "open",
    created_at: "",
    updated_at: "",
  };



  export const demoFormData: FormData = {
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
  };

export const Required_Licenses = [
  "PPKBM License",
  "KKM Pest Control License",
  "CIDB Registration",
  "BOMBA Certificate",
  "ISO 9001 Certification",
  "MOF Registration",
  "Others",
] as const; 