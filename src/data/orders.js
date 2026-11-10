const SAMPLE_ORDERS = [
  {
    id: "PR-1042",
    title: "Steel Rebar Grade 60 – 40 tons",
    amount: 62000,
    vendor: "Apex Steel",
    date: "Jun 12",
    stage: "pending",
    tags: ["materials", "urgent"],
    directorSigned: false,
    breakdown: { base: 56000, shipping: 3000, tax: 3000 },
    quotes: [
      { vendor: "Apex Steel", amount: 62000, lead: "4 days", best: true },
      { vendor: "Standard Metals", amount: 65400, lead: "6 days" },
      { vendor: "Prime Rebar", amount: 64200, lead: "5 days" },
    ],
  },
  {
    id: "PR-1043",
    title: "Cordless Drill Set (x12)",
    amount: 4200,
    vendor: "ToolHub",
    date: "Jun 13",
    stage: "pending",
    tags: ["tools"],
    directorSigned: false,
    breakdown: { base: 3800, shipping: 100, tax: 300 },
    quotes: [
      { vendor: "ToolHub", amount: 4200, lead: "2 days", best: true },
      { vendor: "Industrial Supply", amount: 4500, lead: "3 days" },
    ],
  },
  {
    id: "PR-1038",
    title: "Concrete Mixer Truck Lease",
    amount: 84000,
    vendor: "BuildMax",
    date: "Jun 08",
    stage: "director",
    tags: ["tools"],
    directorSigned: false,
    breakdown: { base: 72000, shipping: 4500, tax: 7500 },
    quotes: [
      { vendor: "BuildMax", amount: 84000, lead: "5 days", best: true },
      { vendor: "HeavyHaul", amount: 89500, lead: "3 days" },
      { vendor: "CityMix", amount: 92100, lead: "7 days" },
    ],
  },
  {
    id: "PR-1031",
    title: "Scaffolding Frames",
    amount: 51500,
    vendor: "HighRise Co",
    date: "Jun 02",
    stage: "po",
    tags: ["materials"],
    directorSigned: true,
    breakdown: { base: 46000, shipping: 2500, tax: 3000 },
    quotes: [
      { vendor: "HighRise Co", amount: 51500, lead: "3 days", best: true },
    ],
  },
  {
    id: "PR-1020",
    title: "PVC Piping Bundle",
    amount: 18600,
    vendor: "AquaFlow",
    date: "May 28",
    stage: "delivered",
    tags: ["materials"],
    directorSigned: false,
    breakdown: { base: 16500, shipping: 1100, tax: 1000 },
    quotes: [{ vendor: "AquaFlow", amount: 18600, lead: "2 days", best: true }],
  },
];

const SAMPLE_ITEMS = [
  { title: "Safety helmets", unit: "units", tag: "safety" },
  { title: "High-visibility jackets", unit: "units", tag: "safety" },
  { title: "Work gloves", unit: "pairs", tag: "safety" },
  { title: "Steel rebar", unit: "tons", tag: "materials" },
  { title: "Concrete mix", unit: "bags", tag: "materials" },
  { title: "Copper cable", unit: "rolls", tag: "materials" },
  { title: "PVC pipe fittings", unit: "sets", tag: "materials" },
  { title: "Cordless drill kits", unit: "kits", tag: "tools" },
  { title: "Angle grinders", unit: "units", tag: "tools" },
  { title: "Extension ladders", unit: "units", tag: "tools" },
  { title: "Scaffolding frames", unit: "frames", tag: "equipment" },
  { title: "Portable generators", unit: "units", tag: "equipment" },
  { title: "Site lighting towers", unit: "units", tag: "equipment" },
  { title: "Forklift rental", unit: "weeks", tag: "rental" },
  { title: "Waste removal service", unit: "loads", tag: "services" },
  { title: "Equipment maintenance", unit: "visits", tag: "services" },
  { title: "Office chairs", unit: "units", tag: "office" },
  { title: "Laptop workstations", unit: "units", tag: "office" },
  { title: "Printer toner", unit: "cartridges", tag: "office" },
  { title: "First aid refills", unit: "kits", tag: "safety" },
];

const SAMPLE_VENDORS = [
  "Northstar Industrial",
  "Cedar Supply Co.",
  "Metro Build Goods",
  "Summit Equipment",
  "Harbor Trade Group",
  "Keystone Materials",
  "Fieldstone Services",
  "Brightline Tools",
  "Evergreen Workwear",
  "Union Site Supply",
  "Redwood Rentals",
  "Atlas Commercial",
  "Pioneer Safety",
  "Granite & Co.",
  "Bluecrest Procurement",
  "Westward Industrial",
];

const SAMPLE_STAGES = ["pending", "director", "po", "delivered"];
const SAMPLE_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const GENERATED_ORDERS = Array.from({ length: 2000 }, (_, index) => {
  const item = SAMPLE_ITEMS[index % SAMPLE_ITEMS.length];
  const stage = SAMPLE_STAGES[index % SAMPLE_STAGES.length];
  const vendorIndex = (index * 7 + Math.floor(index / SAMPLE_ITEMS.length)) % SAMPLE_VENDORS.length;
  const vendor = SAMPLE_VENDORS[vendorIndex];
  const quantity = (index * 13) % 48 + 2;
  const amount = index % 10 < 3
    ? 52000 + ((index * 7919) % 60000)
    : 1500 + ((index * 7919) % 47000);
  const base = Math.round(amount * 0.88);
  const shipping = Math.round(amount * 0.05);
  const tax = amount - base - shipping;
  const quoteCount = index % 3 + 1;
  const quotes = [
    { vendor, amount, lead: `${index % 9 + 2} days`, best: true },
    ...Array.from({ length: quoteCount - 1 }, (_, quoteIndex) => ({
      vendor: SAMPLE_VENDORS[(vendorIndex + quoteIndex + 1) % SAMPLE_VENDORS.length],
      amount: amount + (quoteIndex + 1) * (75 + (index % 900)),
      lead: `${(index + quoteIndex * 2) % 10 + 3} days`,
      best: false,
    })),
  ];

  return {
    id: `PR-${String(index + 2000).padStart(4, "0")}`,
    title: `${item.title} (${quantity} ${item.unit})`,
    amount,
    vendor,
    date: `${SAMPLE_MONTHS[index % SAMPLE_MONTHS.length]} ${index % 28 + 1}`,
    stage,
    tags: [
      item.tag,
      ...(index % 9 === 0 ? ["urgent"] : []),
    ],
    directorSigned: amount > 50000 && (stage === "po" || stage === "delivered"),
    breakdown: { base, shipping, tax },
    quotes,
  };
});

export const INITIAL_ORDERS = [...SAMPLE_ORDERS, ...GENERATED_ORDERS];
