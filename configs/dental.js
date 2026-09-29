/* =====================================================================
   DENTAL CLINIC — "Bright Smile Dental Clinic" (fictional demo)
   Copy this file to create a new client's chatbot, then edit the data.
   ===================================================================== */
(window.ChatbotConfigs = window.ChatbotConfigs || {}).dental = {
  id: "dental",
  industry: "Dental Clinic",
  tagline: "Books checkups, answers price questions and recommends the right dentist.",

  business: {
    name: "Bright Smile Dental Clinic",
    shortName: "Bright Smile",
    address: "123 Main Street",
    city: "Springfield",
    phone: "+1 (555) 123-4567",
    whatsapp: "+1 (555) 123-4567",
    emergencyPhone: "+1 (555) 000-0000",
    email: "hello@brightsmiledental.com"
  },

  theme: { accent: "#FFB800", accent2: "#FF4D2E", icon: "tooth" },

  hours: {
    openDays: [1, 2, 3, 4, 5, 6],                // 0 = Sunday … 6 = Saturday
    open: "10:00", close: "20:00", lastSlot: "19:45",
    display: "Monday to Saturday, 10:00 AM – 8:00 PM",
    shortDisplay: "Monday to Saturday, 10 AM – 8 PM",
    daysText: "Monday to Saturday",
    closedDisplay: "We're closed on Sundays."
  },

  prices: {
    consultation: { label: "Consultation / checkup",   value: "$50" },
    cleaning:     { label: "Teeth cleaning",           value: "$80" },
    filling:      { label: "Filling",                  value: "$120" },
    whitening:    { label: "Teeth whitening",          value: "$250 per session" },
    rootCanal:    { label: "Root canal",               value: "$300–$800" },
    wisdom:       { label: "Wisdom tooth removal",     value: "$200–$400" },
    implant:      { label: "Dental implant (from)",    value: "$1,200" },
    braces:       { label: "Braces & aligners",        value: "After consultation" }
  },

  // Staff: days 0 = Sunday … 6 = Saturday. "treats" links a dentist to knowledge-base topics.
  staff: {
    intent: "doctors", singular: "doctor", plural: "doctors", label: "Doctor",
    words: ["dentist"], titles: ["dr"], shortPrefix: "Dr. ",
    priority: ["children", "rootCanal", "braces", "wisdom", "implants", "fillings", "cleaning", "consultation", "pain"],
    serviceLabels: { braces: "braces or aligners", rootCanal: "a root canal", implants: "implants", wisdom: "wisdom tooth removal", children: "your child's visit",
      consultation: "a checkup", cleaning: "a cleaning", fillings: "fillings", pain: "tooth pain" },
    feeChips: ["Doctors", "Book Appointment"],
    list: [
      { id: "sarah", name: "Dr. Sarah Khan",   specialty: "General Dentist",       days: [1, 3, 5],    from: "10:00", to: "18:00", treats: ["consultation", "cleaning", "fillings", "pain"] },
      { id: "ali",   name: "Dr. Ali Ahmed",    specialty: "Root Canal Specialist", days: [2, 4, 6],    from: "12:00", to: "20:00", treats: ["rootCanal"] },
      { id: "emily", name: "Dr. Emily Carter", specialty: "Orthodontist",          days: [1, 2, 4],    from: "10:00", to: "16:00", treats: ["braces"] },
      { id: "james", name: "Dr. James Wilson", specialty: "Oral Surgeon",          days: [3, 6],       from: "14:00", to: "20:00", treats: ["implants", "wisdom"] },
      { id: "maria", name: "Dr. Maria Lopez",  specialty: "Children's Dentist",    days: [1, 3, 5, 6], from: "10:00", to: "15:00", treats: ["children"] }
    ]
  },

  services: ["Checkups & consultations", "Teeth cleaning", "Fillings", "Root canal treatment", "Teeth whitening",
             "Braces & aligners", "Dental implants", "Wisdom tooth removal", "Children's dentistry", "Emergency care"],

  booking: {
    noun: "appointment",
    steps: ["name", "phone", "date", "reason", "staff", "time"],
    rescheduleSteps: ["name", "phone", "date", "time"],
    summary: ["name", "phone", "date", "time", "staff", "reason"],
    editChips: ["Name", "Phone", "Date", "Doctor", "Time", "Reason"],
    multiPerson: true,
    maxDaysAhead: 90,
    fields: {
      reason: {
        type: "text", label: "Reason", words: "reason", changeLabel: "the reason",
        prompt: "Almost there! What's the main <b>reason for your visit</b>?",
        shortPrompt: "What's the main <b>reason for your visit</b>?",
        chips: ["Checkup", "Teeth cleaning", "Filling", "Tooth pain", "Braces / aligners", "Root canal", "Wisdom tooth / implant", "Child's checkup", "Other"],
        invalid: "Could you tell me briefly what the visit is for?",
        shortErrors: ["Please enter a short reason for your visit.", "Please tap one of the options below, or type a short reason."],
        ack: "the reason for your visit ({value})", ackLower: true, ackAlone: false,
        recommend: true,
        fromIntents: [["fillings", "Filling"], ["wisdom", "Wisdom tooth removal"], ["rootCanal", "Root canal"], ["implants", "Dental implant"],
          ["braces", "Braces / aligners"], ["cleaning", "Teeth cleaning"], ["whitening", "Whitening"], ["consultation", "Checkup"], ["pain", "Tooth pain"]],
        childIntent: "children", childDefaultFrom: "Checkup", childLabel: "Child's checkup"
      }
    }
  },

  pricing: {
    intents: { consultation: "consultation", cleaning: "cleaning", fillings: "filling", rootCanal: "rootCanal", whitening: "whitening", wisdom: "wisdom", braces: "braces", implants: "implant" },
    qty: [
      { words: "fillings?", key: "filling" }, { words: "implants?", key: "implant" }, { words: "cleanings?", key: "cleaning" },
      { words: "whitening sessions?|sessions?", key: "whitening" }, { words: "checkups?|consultations?", key: "consultation" },
      { words: "root canals?", key: "rootCanal" }, { words: "wisdom teeth|wisdom tooth removals?", key: "wisdom" }
    ],
    qtyChips: ["Book Appointment", "Payment options"],
    multiChips: ["Book Appointment", "Payment options"]
  },

  // Nervous patients: reassure, mention local anesthesia where it applies (never talk price unless asked)
  fear: {
    words: ["scared", "afraid", "nervous", "anxious", "anxiety", "fear", "terrified", "frightened", "worried", "phobia", "panic"],
    treatments: [
      { intent: "rootCanal", name: "root canal treatment", numb: true },
      { intent: "wisdom", name: "wisdom tooth removal", numb: true },
      { intent: "implants", name: "implant treatment", numb: true },
      { intent: "fillings", re: /\b(crown|crowns)\b/, name: "filling and crown treatment", numb: true },
      { intent: "braces", name: "orthodontic treatment", numb: false },
      { intent: "cleaning", name: "teeth cleaning", numb: false },
      { intent: "whitening", name: "teeth whitening", numb: false }
    ],
    serviceIntents: ["consultation", "cleaning", "fillings", "rootCanal", "whitening", "braces", "implants", "wisdom", "children"],
    chips: ["Book Appointment", "Doctors"]
  },
  urgentMedicineIntent: "medical",

  bot: {
    name: "Bright Smile Assistant",
    welcome: "Hi there! 👋 Welcome to Bright Smile Dental Clinic. How can I help you today? Feel free to ask about our services, prices or opening hours — or I can book an appointment for you.",
    quickReplies: ["Book Appointment", "Prices", "Timings", "Location"],
    tooltip: "Need help? Chat with us!",
    showTooltipAfterMs: 2500,
    urgentChips: ["Book earliest appointment", "Location"],
    topicWords: ["tooth", "teeth", "dental", "dentist", "gum", "gums", "mouth", "jaw", "filling", "crown", "cavity", "cavities", "extraction", "wisdom", "denture", "veneer", "breath", "bite", "enamel", "smile", "clinic", "treatment", "x-ray", "xray", "appointment", "visit"],
    offTopicWords: ["weather", "politics", "political", "election", "president", "government", "recipe", "recipes", "cook", "cooking", "pizza", "burger", "food", "football", "soccer", "cricket", "movie", "movies", "song", "music", "code", "coding", "python", "javascript", "program", "programming", "bitcoin", "crypto", "stock", "stocks", "news", "joke", "poem", "game", "restaurant", "hotel", "flight", "homework", "math", "buy"],
    urgentWords: ["bleeding", "bleed", "broken", "broke", "knocked out", "knocked", "cracked", "swelling", "swollen", "abscess", "accident", "fever", "unbearable", "excruciating", "severe pain", "severe toothache", "severe ache", "cant sleep", "a lot of pain"],
    compareWords: ["better", "best", "compare", "comparison", "vs", "versus", "which one", "who should", "recommend", "prefer", "more experienced", "good"],

    replies: {
      urgent: "I'm so sorry — that sounds really painful 😟. Please call our emergency line right away at {emergency} so our team can help you straight away.",
      urgentNoMedicine: "I'm not able to recommend any medication, but our dentist can advise you safely.",
      urgentOffer: "I can also book the earliest available appointment for you.",
      fearNumb: "It's completely normal to feel nervous — you're not alone! Modern {treatment} is done with local anesthesia, so it's usually very comfortable, and our dentists will explain every step and go at your pace. 😊",
      fearGentle: "It's completely normal to feel nervous — you're not alone! Modern {treatment} is gentle and usually very comfortable, and our dentists will explain every step and go at your pace. 😊",
      fearGeneral: "It's completely normal to feel nervous — you're not alone! Our dentists are gentle and patient, they'll explain every step, and local anesthesia is used whenever it's needed so you stay comfortable. 😊",
      compareStaff: "All our dentists are highly experienced in their specialties: {staffShortList}. You're in great hands with any of them!",
      staffFees: "All our doctors charge the same consultation fee — {price:consultation} — so you can simply choose whoever suits your needs and schedule.",
      durationOther: "Treatment time depends on your case, so your dentist will confirm it at your checkup. For reference, a routine checkup takes about 30 minutes.",
      openOn: "Yes, we're open on <b>{date}</b> from {openShort} to {closeShort}. Would you like to book an appointment?",
      pricesNote: "We'll confirm the exact cost of any treatment after your checkup."
    }
  },

  /* KNOWLEDGE BASE — strong = 3 points, weak = 1 point (typos & plurals handled automatically).
     Answer tokens: {phone} {whatsapp} {email} {emergency} {address} {mapsLink} {hours} {closed}
     {open} {close} {doctors} {price:key} {specialist:topic} */
  faq: [
    { id: "reschedule", action: "reschedule",
      strong: ["reschedule", "cancel", "cancellation", "postpone", "change appointment", "move appointment", "change booking", "different date", "another date", "another time"], weak: [] },
    { id: "book", action: "book",
      strong: ["book", "booking", "reserve", "make appointment", "get appointment", "schedule"],
      weak: ["appointment", "slot", "visit", "available", "availability", "come in"] },
    { id: "safety", priority: 2,
      strong: ["pregnant", "pregnancy", "breastfeeding", "x ray", "xray", "radiation", "allergic", "allergy", "diabetes", "diabetic", "heart condition", "blood thinner", "side effect"],
      weak: ["safe", "risk"],
      answer: "That's a really important question — your dentist is the best person to advise you, based on your situation. Please call us at {phone} before your visit, and our team will make sure you're well looked after.",
      chips: ["Book Appointment"] },
    { id: "medical", priority: 1,
      strong: ["medicine", "medication", "painkiller", "antibiotic", "antibiotics", "ibuprofen", "paracetamol", "tylenol", "advil", "prescribe", "prescription", "pill", "tablet", "diagnose", "diagnosis"],
      weak: [],
      answer: "I'm sorry you're dealing with this. I'm not able to recommend medication — only a dentist can advise on that safely. If it's urgent, please call our emergency line at {emergency}, or I can book the earliest available appointment for you.",
      chips: ["Book earliest appointment", "Location"] },
    { id: "pain",
      strong: ["pain", "painful", "toothache", "ache", "hurt", "hurting", "sore", "sensitive"], weak: ["bad", "terrible"],
      answer: "I'm so sorry you're in pain 😟. If it's severe, please call our emergency line at {emergency} right away. I can also book the earliest available appointment for you.",
      chips: ["Book earliest appointment", "Location"] },
    { id: "emergency",
      strong: ["emergency", "urgent", "urgently"], weak: ["immediately"],
      answer: "Yes, of course — we see dental emergencies. Please call our emergency line at {emergency} and our team will take care of you right away.",
      chips: ["Book earliest appointment", "Location"] },
    { id: "late",
      strong: ["late", "running late", "delayed", "delay", "arrive late", "miss my appointment"], weak: [],
      answer: "No worries — if you're running late, please give us a call at {phone} and our team will let you know the best option.",
      chips: ["Location", "Parking"] },
    { id: "language",
      strong: ["spanish", "espanol", "french", "arabic", "urdu", "hindi", "german", "chinese", "mandarin", "portuguese", "italian", "russian", "language", "other language"], weak: ["speak"],
      answer: "Sorry, I can only chat in English right now, but our team can help you at {phone}." },
    { id: "duration",
      strong: ["how long", "duration", "how much time", "how many minutes"], weak: ["take", "last", "long", "minute"],
      answer: "A routine checkup takes about 30 minutes.", chips: ["Book Appointment", "Prices"] },
    { id: "consultation",
      strong: ["consultation", "consult", "checkup", "check up", "examination", "exam", "first visit"], weak: ["fee"],
      answer: "A consultation and checkup is {price:consultation}. Would you like me to book one for you?", chips: ["Book Appointment", "Prices", "Insurance"] },
    { id: "cleaning",
      strong: ["cleaning", "clean", "scaling", "polishing", "polish", "hygiene", "plaque", "tartar", "deep clean"], weak: [],
      answer: "A professional teeth cleaning is {price:cleaning}. Would you like to book one?", chips: ["Book Appointment", "Whitening", "Prices"] },
    { id: "fillings",
      strong: ["filling", "fillings", "cavity", "cavities", "cavity filling"], weak: [],
      answer: "Yes, we do fillings — they're {price:filling} each, done by {specialist:fillings}.", chips: ["Book Appointment", "Prices"] },
    { id: "rootCanal",
      strong: ["root canal", "rct", "endodontic", "nerve treatment"], weak: ["canal", "root", "nerve"],
      answer: "A root canal usually costs {price:rootCanal}, depending on the tooth, and it's done by {specialist:rootCanal}. We'll confirm the exact cost after a checkup.",
      chips: ["Book Appointment", "Payment options"] },
    { id: "wisdom",
      strong: ["wisdom tooth", "wisdom teeth", "wisdom", "extraction", "extract", "tooth removal", "teeth removal", "pull tooth", "pulled"], weak: ["removal", "remove"],
      answer: "Yes, we do! Wisdom tooth removal is {price:wisdom}, and it's performed by {specialist:wisdom}.", chips: ["Book Appointment", "Payment options"] },
    { id: "whitening",
      strong: ["whitening", "whiten", "bleach", "bleaching", "white teeth", "yellow teeth", "stain", "stained"], weak: ["white", "bright", "brighter", "yellow"],
      answer: "Yes, we do! Professional teeth whitening is {price:whitening}.", chips: ["Book Appointment", "Prices"] },
    { id: "braces",
      strong: ["braces", "brace", "aligner", "invisalign", "orthodontic", "orthodontics", "orthodontist", "straighten", "crooked", "retainer"], weak: ["straight"],
      answer: "Yes, we offer metal braces, ceramic braces and clear aligners with {specialist:braces}. Since every smile is different, we'll give you an exact price after a consultation.",
      chips: ["Book Appointment", "Payment options"] },
    { id: "implants",
      strong: ["implant", "missing tooth", "missing teeth", "replace tooth", "tooth replacement", "lost tooth"], weak: ["missing", "replace", "replacement"],
      answer: "Yes, we offer dental implants, starting from {price:implant} per implant, with {specialist:implants}.", chips: ["Book Appointment", "Payment options"] },
    { id: "children",
      strong: ["child", "children", "kid", "kids", "pediatric", "paediatric", "toddler", "son", "daughter", "baby", "year old", "years old", "yr old"], weak: ["age", "young", "family"],
      answer: "Absolutely! We happily treat children aged 3 and above with {specialist:children}.", chips: ["Book Appointment", "Doctors"] },
    { id: "insurance",
      strong: ["insurance", "insured", "insurer", "coverage"], weak: ["cover", "covered", "claim", "policy"],
      answer: "Yes, we accept most major dental insurance plans. Just remember to bring your insurance card to your visit.", chips: ["Payment options", "Book Appointment"] },
    { id: "payment",
      strong: ["payment", "pay", "cash", "card", "credit", "debit", "installment", "instalment", "emi", "financing", "finance", "visa", "mastercard"], weak: ["method", "plan"],
      answer: "We accept cash and credit/debit cards, and we also offer installment plans for larger treatments.", chips: ["Insurance", "Prices"] },
    { id: "discount",
      strong: ["discount", "discounts", "offers", "special offer", "deal", "deals", "promo", "promotion", "coupon", "voucher", "sale"], weak: ["cheaper"],
      answer: "For current offers or discounts, please call us at {phone}.", chips: ["Prices", "Book Appointment"] },
    { id: "doctors",
      strong: ["doctor", "dentist", "dr", "specialist", "surgeon", "who are"], weak: ["experience", "experienced", "qualified", "team", "staff"],
      answer: "Our team: {doctors}. You'll be in very good hands!", chips: ["Book Appointment", "Services"] },
    { id: "weekends",
      strong: ["weekend", "saturday", "sunday"], weak: [],
      answer: "We're open on Saturdays from {open} to {close}, and closed on Sundays.", chips: ["Book Appointment", "Location"] },
    { id: "timings",
      strong: ["timing", "hours", "opening hours", "working hours", "business hours", "what time"], weak: ["open", "close", "closing", "time", "when"],
      answer: "We're open {hours}. {closed}", chips: ["Book Appointment", "Location"] },
    { id: "parking",
      strong: ["parking", "park", "car park", "garage"], weak: ["car", "drive", "driving", "vehicle"],
      answer: "Yes — there's free parking right in front of the clinic.", chips: ["Location", "Timings"] },
    { id: "location",
      strong: ["location", "located", "address", "direction", "map", "google maps", "where are you", "how to reach", "how do i get", "find you"], weak: ["where", "near", "area", "city", "street"],
      answer: "You'll find us at <b>{address}</b>.<br>{mapsLink}", chips: ["Timings", "Parking", "Book Appointment"] },
    { id: "email",
      strong: ["email", "e mail", "mail", "email address"], weak: [],
      answer: "You can email us at {email}.", chips: ["Book Appointment"] },
    { id: "human",
      strong: ["real person", "human", "receptionist", "talk to someone", "speak to someone", "talk to person", "agent", "whatsapp", "phone number", "contact number", "call you", "representative"],
      weak: ["talk", "call", "contact", "phone", "number"],
      answer: "You can call our team at {phone}, or message us on WhatsApp at {whatsapp}.", chips: ["Timings", "Book Appointment"] },
    { id: "prices", action: "prices",
      strong: ["price list", "prices", "rates", "charges"], weak: ["price", "cost", "how much", "charge", "rate", "expensive", "cheap", "afford"] },
    { id: "services", action: "services",
      strong: ["services", "treatments", "what do you offer", "what do you do"], weak: ["offer", "treatment", "provide"] },
    { id: "greeting",
      strong: ["hi", "hello", "hey", "hiya", "good morning", "good afternoon", "good evening", "salam", "assalam"], weak: [],
      answer: "Hello! 😊 How can I help you today?" },
    { id: "thanks",
      strong: ["thank", "thanks", "thx", "appreciate", "great", "perfect", "awesome"], weak: [],
      answer: "You're very welcome! Take care, and we look forward to seeing you soon. 😊" },
    { id: "bye",
      strong: ["bye", "goodbye", "see you", "good night"], weak: [],
      answer: "Thank you for chatting with us — take care and have a lovely day! 😊" }
  ]
};
