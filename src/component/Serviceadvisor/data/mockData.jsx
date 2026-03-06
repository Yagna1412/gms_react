export const DEFAULT_BRANCH = 'Mumbai Main';
export const DEFAULT_TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
];

export const DEFAULT_CUSTOMERS = [
  {
    id: 'CUST/MUM/2024/0001',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    address: 'Bandra West, Mumbai',
    type: 'Premium',
    loyaltyPoints: 450,
    branch: 'Mumbai Main',
    vehicles: [
      { id: 1, make: 'Maruti Suzuki', model: 'Swift', year: 2020, regNo: 'MH02AB1234', vin: 'MA3EW51S000123456' }
    ],
    preferences: { technician: 'Rajesh Kumar', timeSlot: 'Morning', communication: 'WhatsApp' },
    serviceHistory: [
      { date: '2024-11-15', service: 'General Service', amount: 3500, jobCard: 'JC/MUM/2024/0089' }
    ]
  },
  {
    id: 'CUST/MUM/2024/0002',
    name: 'Priya Patel',
    phone: '+91 98765 43211',
    email: 'priya.patel@example.com',
    address: 'Andheri East, Mumbai',
    type: 'Regular',
    loyaltyPoints: 120,
    branch: 'Mumbai Main',
    vehicles: [
      { id: 1, make: 'Hyundai', model: 'i20', year: 2019, regNo: 'MH01CD5678', vin: 'MALH11GB7K8123456' }
    ],
    preferences: { technician: 'Any', timeSlot: 'Afternoon', communication: 'SMS' },
    serviceHistory: []
  },
  {
    id: 'CUST/MUM/2024/0003',
    name: 'Amit Desai',
    phone: '+91 98765 43212',
    email: 'amit.desai@example.com',
    address: 'Powai, Mumbai',
    type: 'VIP',
    loyaltyPoints: 850,
    branch: 'Mumbai Main',
    vehicles: [
      { id: 1, make: 'Honda', model: 'City', year: 2021, regNo: 'MH03XY9012', vin: 'MAEAA8H00L8123456' }
    ],
    preferences: { technician: 'Rajesh Kumar', timeSlot: 'Morning', communication: 'WhatsApp' },
    serviceHistory: [
      { date: '2024-12-01', service: 'Premium Service', amount: 5500, jobCard: 'JC/MUM/2024/0095' },
      { date: '2024-10-10', service: 'Oil Change', amount: 1200, jobCard: 'JC/MUM/2024/0078' }
    ]
  }
];

export const DEFAULT_APPOINTMENTS = [
  {
    id: 'APT/MUM/2024/0001',
    customerId: 'CUST/MUM/2024/0001',
    customerName: 'Rahul Sharma',
    vehicle: 'Swift - MH02AB1234',
    date: '2024-12-19',
    time: '10:00 AM',
    time_slot: '10:00 AM',
    serviceType: 'General Service',
    status: 'Scheduled',
    branch: 'Mumbai Main',
    technician: 'Rajesh Kumar',
    duration: '2 hours'
  },
  {
    id: 'APT/MUM/2024/0002',
    customerId: 'CUST/MUM/2024/0003',
    customerName: 'Amit Desai',
    vehicle: 'City - MH03XY9012',
    date: '2024-12-19',
    time: '02:00 PM',
    time_slot: '02:00 PM',
    serviceType: 'AC Service',
    status: 'In-Progress',
    branch: 'Mumbai Main',
    technician: 'Vikram Singh',
    duration: '3 hours'
  }
];

export const DEFAULT_JOB_CARDS = [
  {
    id: 'JC/MUM/2024/0098',
    customerId: 'CUST/MUM/2024/0001',
    customerName: 'Rahul Sharma',
    vehicle: 'Swift - MH02AB1234',
    complaints: ['Engine noise', 'Brake issue'],
    odometer: 45000,
    priority: 'Normal',
    status: 'In-Progress',
    progress: 65,
    createdDate: '2024-12-19',
    branch: 'Mumbai Main',
    technician: 'Rajesh Kumar',
    serviceAdvisor: 'Current User',
    estimationStatus: 'Approved'
  },
  {
    id: 'JC/MUM/2024/0099',
    customerId: 'CUST/MUM/2024/0003',
    customerName: 'Amit Desai',
    vehicle: 'City - MH03XY9012',
    complaints: ['AC not cooling'],
    odometer: 28000,
    priority: 'VIP',
    status: 'Quality Check',
    progress: 90,
    createdDate: '2024-12-19',
    branch: 'Mumbai Main',
    technician: 'Vikram Singh',
    serviceAdvisor: 'Current User',
    estimationStatus: 'Approved'
  }
];

export const DEFAULT_ESTIMATIONS = [
  {
    id: 'EST/MUM/2024/0045',
    jobCardId: 'JC/MUM/2024/0098',
    customerId: 'CUST/MUM/2024/0001',
    customerName: 'Rahul Sharma',
    services: [
      { name: 'Engine Oil Change', price: 800, qty: 1 },
      { name: 'Brake Pad Replacement', price: 2500, qty: 1 }
    ],
    parts: [
      { name: 'Engine Oil 5W30', price: 450, qty: 4, stock: 25 },
      { name: 'Brake Pads Front', price: 1200, qty: 1, stock: 8 }
    ],
    laborCharges: 1500,
    discount: 10,
    discountApproved: true,
    tax: 18,
    totalAmount: 7542,
    status: 'Approved',
    validTill: '2024-12-26',
    branch: 'Mumbai Main',
    createdDate: '2024-12-19'
  },
  {
    id: 'EST/MUM/2024/0046',
    jobCardId: 'JC/MUM/2024/0100',
    customerId: 'CUST/MUM/2024/0002',
    customerName: 'Priya Patel',
    services: [
      { name: 'Wheel Alignment', price: 800, qty: 1 }
    ],
    parts: [],
    laborCharges: 500,
    discount: 5,
    discountApproved: true,
    tax: 18,
    totalAmount: 1534,
    status: 'Pending',
    validTill: '2024-12-26',
    branch: 'Mumbai Main',
    createdDate: '2024-12-19'
  }
];

export const DEFAULT_COMPLAINTS = [
  {
    id: 'COMP/MUM/2024/001',
    customerId: 'CUST/MUM/2024/0002',
    customerName: 'Priya Patel',
    jobCardId: 'JC/MUM/2024/0097',
    category: 'Service Quality',
    severity: 'Medium',
    description: 'Service took longer than estimated time',
    status: 'Under Review',
    department: 'Operations',
    filedDate: '2024-12-18',
    branch: 'Mumbai Main'
  }
];

export const DEFAULT_INVOICES = [
  {
    id: 'INV/MUM/2024/0089',
    jobCardId: 'JC/MUM/2024/0097',
    customerId: 'CUST/MUM/2024/0002',
    customerName: 'Priya Patel',
    amount: 3200,
    tax: 576,
    total: 3776,
    status: 'Paid',
    paymentMode: 'UPI',
    date: '2024-12-18',
    branch: 'Mumbai Main'
  }
];
