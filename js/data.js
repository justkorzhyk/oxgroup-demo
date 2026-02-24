// ─── DATA ───────────────────────────────────────────
const PRODUCTS = [
  { id:'ZX11-501/26', name:'Ultimate Zebra Diamond Blade - Abrasive / Dual - 600/25.4mm', cat:'Diamond Tools', price:410, orig:448, stock:342, inStock:true, img:'diamond' },
  { id:'ZCA500/25',   name:'Ultimate Zebra Diamond Blade - Abrasive / Dual - 500/25.4mm', cat:'Diamond Tools', price:378, orig:410, stock:342, inStock:true, img:'diamond' },
  { id:'ZCA450/25',   name:'Ultimate Zebra Diamond Blade - Abrasive / Dual - 450/25.4mm', cat:'Diamond Tools', price:258, orig:290, stock:2,   inStock:true, img:'diamond' },
  { id:'ZCA400/25',   name:'Ultimate Zebra Diamond Blade - Abrasive / Dual - 400/25.4mm', cat:'Diamond Tools', price:218, orig:240, stock:0,   inStock:false, img:'diamond' },
  { id:'ZA350/25',    name:'Ultimate Shark Diamond Blade - Asphalt - 350/25.4mm',          cat:'Diamond Tools', price:158, orig:175, stock:342, inStock:true, img:'tool' },
  { id:'LST350/25',   name:'Spectrum Ultimate Thin Turbo Dia Blade - Porcelain - 350/25.4mm', cat:'Diamond Tools', price:113.37, orig:125, stock:235, inStock:true, img:'tool' },
  { id:'LST300/25/20',name:'Spectrum Ultimate Thin Turbo Dia Blade - Porcelain - 300/25.4/20mm', cat:'Diamond Tools', price:88.87, orig:99, stock:342, inStock:true, img:'tool' },
  { id:'LST150/25/22',name:'Spectrum Ultimate Thin Turbo Dia Blade - Porcelain - 150/25.4/22.23mm', cat:'Diamond Tools', price:31.83, orig:38, stock:243, inStock:true, img:'tool' },
  { id:'BX10-152',    name:'Spectrum Superior Superfast Helix Dry Diamond Core Drill - 152mm', cat:'Diamond Tools', price:98, orig:110, stock:124, inStock:true, img:'tool' },
  { id:'BX10-127',    name:'Spectrum Superior Superfast Helix Dry Diamond Core Drill - 127mm', cat:'Diamond Tools', price:86.30, orig:96, stock:34, inStock:true, img:'tool' },
  { id:'BX10-117',    name:'Spectrum Superior Superfast Helix Dry Diamond Core Drill - 117mm', cat:'Diamond Tools', price:74.50, orig:84, stock:243, inStock:true, img:'tool' },
  { id:'BX10-065',    name:'Spectrum Superior Superfast Helix Dry Diamond Core Drill - 65mm',  cat:'Diamond Tools', price:50.10, orig:58, stock:178, inStock:true, img:'tool' },
  { id:'BX10-028-BSP',name:'Spectrum Superior Superfast Helix Dry Diamond Core Drill - 28mm-BSP', cat:'Diamond Tools', price:44, orig:50, stock:243, inStock:true, img:'tool' },
  { id:'BD152',       name:'Spectrum Plus Gold Dry Diamond Core Drill - 152mm', cat:'Diamond Tools', price:64.90, orig:75, stock:84, inStock:true, img:'diamond' },
  { id:'BD142',       name:'Spectrum Plus Gold Dry Diamond Core Drill - 142mm', cat:'Diamond Tools', price:58.30, orig:68, stock:243, inStock:true, img:'diamond' },
  { id:'PM-4550',     name:'BORA Adjustable Speedhorse XT', cat:'Hand Tools', price:1400, orig:2000, stock:2, inStock:true, img:'package' },
  { id:'OX-S248930',  name:'OX Folding Collapsible Ear Defenders', cat:'Safety', price:8.54, orig:10, stock:4, inStock:true, img:'headphones' },
  { id:'SP-TDB5',     name:'Spectrum Adjustable Thin Turbo Dia Blade', cat:'Diamond Tools', price:99.99, orig:115, stock:89, inStock:true, img:'sliders' },
  { id:'OX-P110642',  name:'OX Pro Heavy Duty Flexi Tub - 42L / 9 Gallons', cat:'Merchandising', price:4.24, orig:5, stock:153, inStock:true, img:'package' },
  { id:'OX-T310715',  name:'OX Trade Black Bucket - 15L / 3.3 Gallons', cat:'Merchandising', price:1.82, orig:2.5, stock:24, inStock:true, img:'package' },
];

const CART_ITEMS = [
  { ...PRODUCTS[15], qty:1, lineOrig:'£2,000.00', linePrice:'£1,400.00' },
  { ...PRODUCTS[0],  qty:30, lineOrig:'£448.00',  linePrice:'£456.00' },
  { ...PRODUCTS[16], qty:10, lineOrig:'£166.14',  linePrice:'£152.00' },
];

const CATEGORIES = ['Diamond Tools','Hand Tools','Safety','Power Tool Accessories','Workwear','Merchandising','Promotions'];
const CAT_ICONS  = ['diamond','tool','shield','zap','workwear','tag','sale'];

const FAQS = [
  { q:'Do you have a minimum order value?', a:'$55 is the minimum order value.' },
  { q:'Where do you offer free shipping?', a:'Metro Areas: FIS Minimum Order Value $350. Regional Areas: $500. Far Regional Areas: $750.' },
  { q:'How do I track my order?', a:'You will receive a tracking number via email once your order has been dispatched.' },
  { q:"What is your returns policy?", a:'We offer a no-hassle returns policy. Contact our team within 30 days of receipt.' },
  { q:'Do you accept credit cards?', a:'Yes, we accept all major credit cards including Visa, Mastercard, and Amex.' },
  { q:'Where can I download my invoices?', a:'Invoices are available in your account under Orders > Invoices.' },
];

const CART_FAQS = [
  { q:'Where do you offer free shipping?', a:'Metro Areas: FIS Minimum Order Value: $350.<br>Regional Areas &amp; Tasmania: FIS Minimum Order Value: $500.<br>Far Regional Areas (Far North Queensland, Northern Territory and Northern Western Australia): FIS Minimum Order Value: $750.' },
  { q:'What is your returns policy?', a:'We offer a no-hassle returns policy. Contact our team within 30 days of receipt.' },
  { q:'Do you offer a warranty?', a:'Yes, all our products come with a manufacturer warranty. Contact us for details.' },
  { q:'Are taxes included in the price?', a:'Prices shown exclude VAT. Tax will be calculated at checkout based on your delivery address.' },
];

const PURCHASES = [
  { id:'UK433584', status:'Pending Approval',  date:'18.12.2025', po:'123456', shipped:'',           amount:'£1,111.00', track:'' },
  { id:'UK433585', status:'Pending Approval',  date:'15.12.2025', po:'123456', shipped:'',           amount:'£930.75',   track:'' },
  { id:'UK433587', status:'Pending Fulfilled', date:'26.11.2025', po:'11111',  shipped:'',           amount:'£1,200.99', track:'0123456789' },
  { id:'UK433586', status:'Billed',            date:'05.12.2025', po:'PO-002', shipped:'07.12.2025', amount:'£456.00',   track:'TN123456' },
];

const RETURNS = [
  { id:'UK433587', date:'18.12.2025', items:1, amount:'£1,111.00', status:'Pending Approval' },
  { id:'UK433585', date:'15.12.2025', items:2, amount:'£930.75',   status:'Pending Approval' },
  { id:'UK433584', date:'26.11.2025', items:3, amount:'£1,200.99', status:'Pending Approval' },
];

const SUPPORT_CASES = [
  { id:'433590', subject:'Testing',               created:'18.12.2025', lastMsg:'19.12.2025', status:'Open' },
  { id:'433589', subject:'Missing Goods - Frei...', created:'15.12.2025', lastMsg:'',          status:'Open' },
  { id:'433588', subject:'Picked Incorrectly',    created:'26.11.2025', lastMsg:'',          status:'Open' },
  { id:'433587', subject:'Short-Supplied Goods',  created:'22.11.2025', lastMsg:'',          status:'Closed' },
  { id:'433586', subject:'Warranty',              created:'16.11.2025', lastMsg:'',          status:'Closed' },
  { id:'433585', subject:'Warranty',              created:'23.10.2025', lastMsg:'',          status:'Closed' },
  { id:'433594', subject:'Product Issue',         created:'10.10.2025', lastMsg:'',          status:'Closed' },
];

const CAT_DATA = {
  OX: [
    { name: 'Diamond Tools', icon: 'diamond', subs: [
      { heading: 'Diamond Blades', items: ['Floorsaw Blades', 'Tiling Blades', 'Angle Grinder & Demolition Saw Blades', 'Mortar Raking Blades', 'Asphalt & Block Blades', 'Concrete & Masonry Blades', 'Metal Cutting Blades', 'General Purpose Blades', 'Multi-Purpose Blades'] },
      { heading: 'Diamond Core Drills', items: ['Dry Cores', 'Wet Cores', 'Tile Holesaws', 'Accessories', 'Dry Core Sets'] },
      { heading: 'Diamond Grinding', items: ['Double Row Cup Wheels', 'Turbo Cup Wheels'] },
    ]},
    { name: 'Hand Tools', icon: 'tool', subs: [
      { heading: 'Cutting & Scoring', items: ['Stanley Knives', 'Tile Cutters', 'Glass Cutters', 'Angle Grinders'] },
      { heading: 'Measuring & Layout', items: ['Spirit Levels', 'Tape Measures', 'Squares', 'Chalk Lines'] },
    ]},
    { name: 'Safety', icon: 'shield', subs: [
      { heading: 'Eye Protection', items: ['Safety Glasses', 'Goggles', 'Face Shields'] },
      { heading: 'Hearing Protection', items: ['Ear Defenders', 'Ear Plugs'] },
      { heading: 'Head Protection', items: ['Hard Hats', 'Bump Caps'] },
    ]},
    { name: 'Power Tool Accessories', icon: 'zap', subs: [
      { heading: 'Drill Bits', items: ['SDS Plus Bits', 'Flat Bits', 'Step Drill Bits', 'Hole Saws'] },
      { heading: 'Grinding & Finishing', items: ['Flap Discs', 'Grinding Discs', 'Wire Wheels', 'Polishing Pads'] },
    ]},
    { name: 'Workwear', icon: 'workwear', subs: [
      { heading: 'Protective Clothing', items: ['Hi-Vis Vests', 'Coveralls', 'Knee Pads', 'Gloves'] },
      { heading: 'Footwear', items: ['Safety Boots', 'Wellington Boots', 'Overshoes'] },
    ]},
    { name: 'Merchandising', icon: 'tag', subs: [
      { heading: 'Display & Storage', items: ['Display Stands', 'Buckets & Tubs', 'Tool Bags', 'Storage Boxes'] },
    ]},
    { name: 'Promotions', icon: 'sale', subs: [
      { heading: 'Special Offers', items: ['Bundle Deals', 'Clearance Lines', 'New Arrivals', 'Seasonal Offers'] },
    ]},
  ],
  BORA: [
    { name: 'Workbenches', icon: 'tool', subs: [
      { heading: 'Speedhorse', items: ['Speedhorse XT', 'Speedhorse XB', 'Speedhorse GT', 'Centipede Stands'] },
      { heading: 'Accessories', items: ['Work Shelf', 'Side Brackets', 'Bag Hooks', 'Extension Wings'] },
    ]},
    { name: 'Clamps', icon: 'tool', subs: [
      { heading: 'Bar Clamps', items: ['Quick Clamps', 'F-Clamps', 'Spring Clamps'] },
    ]},
    { name: 'Guides & Jigs', icon: 'tool', subs: [
      { heading: 'Circular Saw Guides', items: ['WTX Clamp Edge', 'NGX Track Adapter', 'Straight Edge Clamp'] },
    ]},
  ],
  TRACER: [
    { name: 'Laser Levels', icon: 'zap', subs: [
      { heading: 'Line Lasers', items: ['3-Line Laser', '5-Line Laser', 'Cross Line Laser'] },
      { heading: 'Point Lasers', items: ['3-Point Laser', '5-Point Laser'] },
    ]},
    { name: 'Measuring Tools', icon: 'tool', subs: [
      { heading: 'Distance', items: ['Laser Measure 30m', 'Laser Measure 60m', 'Laser Measure 100m'] },
    ]},
    { name: 'Accessories', icon: 'tool', subs: [
      { heading: 'Laser Accessories', items: ['Tripods', 'Detector Receivers', 'Carrying Cases', 'Batteries'] },
    ]},
  ],
  SMART: [
    { name: 'Corner Systems', icon: 'tool', subs: [
      { heading: 'Inside Corners', items: ['Pre-formed Internal Corners', 'Flexible Corner Beads'] },
      { heading: 'Outside Corners', items: ['Standard Corner Bead', 'Bullnose Corner Bead', 'Metal Corner Bead'] },
    ]},
    { name: 'Cable Management', icon: 'zap', subs: [
      { heading: 'Trunking', items: ['Mini Trunking', 'Maxi Trunking', 'Skirting Trunking'] },
      { heading: 'Conduit', items: ['Oval Conduit', 'Round Conduit', 'Flexible Conduit'] },
    ]},
  ],
  UNITEC: [
    { name: 'Bonding', icon: 'tool', subs: [
      { heading: 'Adhesives', items: ['Tile Adhesive', 'Wall Adhesive', 'Rapid Set Adhesive', 'Flexible Adhesive'] },
      { heading: 'Grouts', items: ['Standard Grout', 'Rapid Set Grout', 'Epoxy Grout'] },
    ]},
    { name: 'Sealing', icon: 'shield', subs: [
      { heading: 'Sealants', items: ['Sanitary Silicone', 'Neutral Cure Silicone', 'Acrylic Sealant'] },
      { heading: 'Waterproofing', items: ['Tanking Slurry', 'Waterproof Membrane', 'Joint Tape'] },
    ]},
  ],
};

const REORDER_ITEMS = [
  { id:'ZX11-501/26',  name:'Ultimate Zebra Diamond Blade - Abrasive / Dual - 600/25.4mm', price:258,    orig:null,   stock:342, inStock:true, img:'diamond',   lastOrder:'15.12.2025' },
  { id:'OX-S248930',   name:'OX Folding Collapsible Ear Defenders',                         price:152,    orig:166.14, stock:2,   inStock:true, img:'headphones', lastOrder:'15.12.2025' },
];

const INVOICES = [
  // ── Open ──────────────────────────────────────────────────────────────────
  { id:'INV40968', date:'01.12.2025', amount:'£1,408.00', dueDate:'01.01.2026', status:'open' },
  { id:'INV33585', date:'15.12.2025', amount:'£930.75',   dueDate:'15.01.2026', status:'open' },
  { id:'INV33587', date:'28.11.2025', amount:'£1,200.99', dueDate:'28.12.2025', status:'open' },
  { id:'INV33588', date:'22.11.2025', amount:'£600.50',   dueDate:'22.12.2025', status:'open' },
  { id:'INV33586', date:'16.11.2025', amount:'£405.00',   dueDate:'16.12.2025', status:'open' },
  { id:'INV33589', date:'23.10.2025', amount:'£2,007.30', dueDate:'23.11.2025', status:'open' },
  { id:'INV33590', date:'20.10.2025', amount:'£819.99',   dueDate:'20.11.2025', status:'open' },
  { id:'INV33591', date:'05.10.2025', amount:'£819.99',   dueDate:'05.11.2025', status:'open' },
  { id:'INV33592', date:'01.10.2025', amount:'£819.99',   dueDate:'01.11.2025', status:'open' },
  { id:'INV33593', date:'23.09.2025', amount:'£819.99',   dueDate:'23.10.2025', status:'open' },
  { id:'INV33580', date:'15.08.2025', amount:'£550.00',   dueDate:'15.09.2025', status:'open' },
  { id:'INV33578', date:'01.08.2025', amount:'£1,100.00', dueDate:'01.09.2025', status:'open' },
  // ── Paid ──────────────────────────────────────────────────────────────────
  { id:'INV33594', date:'15.09.2025', amount:'£625.00',   dueDate:'15.10.2025', paymentDate:'12.10.2025', status:'paid' },
  { id:'INV33595', date:'01.09.2025', amount:'£1,050.00', dueDate:'01.10.2025', paymentDate:'30.09.2025', status:'paid' },
  { id:'INV33596', date:'15.08.2025', amount:'£780.50',   dueDate:'15.09.2025', paymentDate:'14.09.2025', status:'paid' },
  { id:'INV33597', date:'01.08.2025', amount:'£2,200.00', dueDate:'01.09.2025', paymentDate:'01.09.2025', status:'paid' },
  { id:'INV33598', date:'15.07.2025', amount:'£340.00',   dueDate:'15.08.2025', paymentDate:'13.08.2025', status:'paid' },
  { id:'INV33599', date:'01.07.2025', amount:'£980.75',   dueDate:'01.08.2025', paymentDate:'31.07.2025', status:'paid' },
  { id:'INV33600', date:'15.06.2025', amount:'£512.25',   dueDate:'15.07.2025', paymentDate:'12.07.2025', status:'paid' },
  { id:'INV33601', date:'01.06.2025', amount:'£1,670.00', dueDate:'01.07.2025', paymentDate:'30.06.2025', status:'paid' },
  { id:'INV33602', date:'15.05.2025', amount:'£890.00',   dueDate:'15.06.2025', paymentDate:'14.06.2025', status:'paid' },
  { id:'INV33603', date:'01.05.2025', amount:'£430.50',   dueDate:'01.06.2025', paymentDate:'31.05.2025', status:'paid' },
];
const INV_PER_PAGE = 10;

const TRANSACTIONS = [
  { id:'INV40968',  type:'Invoice',     date:'01.12.2025', amount:'£1,068.80', status:'paid-full'     },
  { id:'INV40748',  type:'Invoice',     date:'15.11.2025', amount:'£1,246.80', status:'paid-full'     },
  { id:'PYMT24965', type:'Payment',     date:'26.11.2025', amount:'£1,059.95', status:'deposited'     },
  { id:'CM10871',   type:'Credit Memo', date:'22.09.2025', amount:'£1,317.00', status:'fully-applied' },
  { id:'PYMT24556', type:'Payment',     date:'16.08.2025', amount:'£2,246.93', status:'deposited'     },
  { id:'INV39500',  type:'Invoice',     date:'01.08.2025', amount:'£892.50',   status:'paid-full'     },
  { id:'PYMT23100', type:'Payment',     date:'15.07.2025', amount:'£450.00',   status:'deposited'     },
  { id:'CM10234',   type:'Credit Memo', date:'01.07.2025', amount:'£200.00',   status:'fully-applied' },
  { id:'INV38765',  type:'Invoice',     date:'15.06.2025', amount:'£1,540.00', status:'paid-full'     },
  { id:'PYMT22500', type:'Payment',     date:'01.06.2025', amount:'£765.20',   status:'deposited'     },
  { id:'INV37200',  type:'Invoice',     date:'15.05.2025', amount:'£330.00',   status:'paid-full'     },
  { id:'PYMT21800', type:'Payment',     date:'01.05.2025', amount:'£1,100.00', status:'deposited'     },
];
const TX_PER_PAGE = 10;

// ─── STATE ──────────────────────────────────────────
const BRANDS = ['OX', 'BORA', 'TRACER', 'SMART', 'UNITEC'];
let selectedBrand = 'OX';
let _pendingProductSlug = null;
let selectedCat = 0;
let stockOnly = false;
let currentProduct = PRODUCTS[2];
let favStockOnly = false;
let favPage = 1;
const FAV_PER_PAGE = 10;
let purchasesFilter = 'open';
let returnsDateFrom = '';
let returnsDateTo   = '';
let reorderStockOnly = false;
let reorderQtys = {};
let invoicesFilter = 'open';
let invoicesPage   = 1;
let invoicesChecked = {};
let txDateFrom = '';
let txDateTo   = '';
let txPage     = 1;
let stmtDate      = '';
let stmtStartDate = '';
let stmtPrefs     = [];
