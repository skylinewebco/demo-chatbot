/* =====================================================================
   REAL ESTATE — "Prime Homes Realty" (fictional demo)
   Copy this file to create a new client's chatbot, then edit the data.
   ===================================================================== */
(function () {
  // Listings: each property is shown by its listing agent (agent id from staff.list)
  const listings = [
    { id: "p1", label: "Sunset Villa", deal: "For sale", price: "$850,000", beds: 4, baths: 3, area: "2,800 sq ft", location: "Westwood", agent: "daniel",
      match: ["sunset", "villa", "westwood", "p1"], extra: "Pool, double garage and a large garden." },
    { id: "p2", label: "Harbor View Apartment", deal: "For sale", price: "$420,000", beds: 2, baths: 2, area: "1,150 sq ft", location: "Downtown", agent: "priya",
      match: ["harbor", "harbour", "harbor view", "downtown apartment", "p2"], extra: "Balcony with water views, gym and 24/7 concierge." },
    { id: "p3", label: "Maple Family Home", deal: "For sale", price: "$565,000", beds: 3, baths: 2.5, area: "1,900 sq ft", location: "Oak Park", agent: "marcus",
      match: ["maple", "family home", "oak park", "p3"], extra: "Walking distance to top-rated schools and parks." },
    { id: "p4", label: "City Loft", deal: "For rent", price: "$2,400/month", beds: 1, baths: 1, area: "850 sq ft", location: "Arts District", agent: "priya",
      match: ["loft", "city loft", "arts district", "p4"], extra: "High ceilings, fully furnished, pets welcome." },
    { id: "p5", label: "Garden Townhouse", deal: "For rent", price: "$3,100/month", beds: 3, baths: 2, area: "1,600 sq ft", location: "Riverside", agent: "sofia",
      match: ["garden townhouse", "townhouse", "riverside", "p5"], extra: "Private garden, 2 parking spaces, 12-month lease." }
  ];
  const agents = [
    { id: "daniel", name: "Daniel Brooks",  specialty: "Luxury Homes Agent",       days: [1, 3, 5], from: "09:00", to: "17:00", treats: ["buy", "sell"] },
    { id: "priya",  name: "Priya Nair",     specialty: "Downtown & Condo Specialist", days: [2, 4, 6], from: "10:00", to: "19:00", treats: ["condo"] },
    { id: "marcus", name: "Marcus Lee",     specialty: "Family Homes Agent",       days: [1, 2, 3], from: "09:00", to: "18:00", treats: ["family"] },
    { id: "sofia",  name: "Sofia Martinez", specialty: "Rentals & Leasing Agent",  days: [4, 5, 6], from: "10:00", to: "18:00", treats: ["rent"] }
  ];
  const agentName = (id) => agents.find((a) => a.id === id).name;
  const facts = (p) => `${p.beds} bed · ${p.baths} bath · ${p.area} · ${p.location}`;
  const listingsHtml = "Here are our current listings 🏡" + `<div class="price-list">` +
    listings.map((p) => `<div class="pl-row"><span><b>${p.label}</b><br>${facts(p)}</span><span>${p.price}<br>${p.deal}</span></div>`).join("") +
    `</div><div class="pl-note">Tap “Book a Viewing” to see any of them in person.</div>`;
  const prices = {};
  listings.forEach((p) => { prices[p.id] = { label: `${p.label} (${p.deal.toLowerCase()})`, value: p.price }; });

  (window.ChatbotConfigs = window.ChatbotConfigs || {}).realestate = {
    id: "realestate",
    industry: "Real Estate",
    tagline: "Shows listings, answers buying & renting questions and books property viewings.",

    business: {
      name: "Prime Homes Realty",
      address: "200 Harbor Avenue, Suite 5",
      city: "Springfield",
      phone: "+1 (555) 345-6789",
      whatsapp: "+1 (555) 345-6789",
      email: "hello@primehomesrealty.com"
    },

    theme: { accent: "#7DD3FC", accent2: "#818CF8", glow: "125,211,252", glow2: "99,102,241", blob: "129,140,248", icon: "home" },

    hours: {
      openDays: [1, 2, 3, 4, 5, 6], open: "09:00", close: "19:00", lastSlotBeforeClose: 60,
      display: "Monday to Saturday, 9:00 AM – 7:00 PM",
      shortDisplay: "Monday to Saturday, 9 AM – 7 PM",
      daysText: "Monday to Saturday",
      closedDisplay: "We're closed on Sundays (viewings by special arrangement)."
    },

    prices,

    staff: {
      intent: "agents", singular: "agent", plural: "agents", label: "Agent", words: ["realtor", "broker"], titles: [], shortPrefix: "",
      priority: ["rent", "condo", "family", "buy", "sell"],
      serviceLabels: { rent: "rentals", buy: "buying a home", sell: "selling your home", condo: "downtown apartments", family: "family homes" },
      feeChips: ["Agent fees", "Book a Viewing"],
      list: agents.map((a) => ({ ...a, short: a.name.split(" ")[0] }))
    },

    services: ["Home sales", "Rentals & leasing", "Free home valuations", "Mortgage partner introductions", "Virtual tours"],

    booking: {
      noun: "viewing",
      steps: ["name", "phone", "property", "date", "time"],
      summary: ["name", "phone", "property", "date", "time", "staff"],
      multiPerson: false,
      maxDaysAhead: 60,
      fields: {
        property: {
          type: "choice", label: "Property", words: "property|house|home|listing", changeLabel: "the property",
          prompt: "Which <b>property</b> would you like to view?", shortPrompt: "Which <b>property</b> would you like to view?",
          invalid: "Please choose one of our listings below.",
          ack: "a viewing of <b>{value}</b>",
          options: listings.map((p) => ({
            id: p.id, label: p.label, match: p.match, staff: p.agent,
            info: `<b>${p.label}</b> — ${p.deal.toLowerCase()} at <b>${p.price}</b>.<br>${facts(p)}. ${p.extra} Viewings are with ${agentName(p.agent)}.`,
            chips: ["Book a Viewing", "All listings"]
          }))
        }
      }
    },

    bot: {
      name: "Prime Homes Assistant",
      welcome: "Hi there! 👋 Welcome to Prime Homes Realty. How can I help you today? Browse our listings, ask about buying or renting — or I can book a property viewing for you.",
      quickReplies: ["Book a Viewing", "Listings", "Buy or Rent", "Agents"],
      tooltip: "Looking for a home? Chat with us!",
      showTooltipAfterMs: 2500,
      optionIntents: ["listings", "buy", "rent", "prices", "book"],
      overlaps: [["documentsBuy", "documents"], ["documentsRent", "documents"], ["fees", "agents"], ["documentsRent", "rent"], ["documentsBuy", "buy"], ["deposit", "rent"], ["leaseTerm", "rent"], ["pets", "rent"], ["mortgage", "buy"], ["documents", "rent"], ["documents", "buy"]],
      topicWords: ["property", "properties", "house", "home", "homes", "apartment", "villa", "condo", "rent", "rental", "buy", "listing", "listings", "viewing", "mortgage", "bedroom", "bedrooms", "agent", "realtor", "lease"],
      offTopicWords: ["weather", "politics", "political", "election", "president", "government", "football", "soccer", "cricket", "movie", "movies", "song", "music", "code", "coding", "python", "javascript", "programming", "bitcoin", "crypto", "news", "joke", "poem", "game", "homework", "math", "flight", "hotel"],
      replies: {
        introBook: "Great, let's book your viewing! 🏡 ",
        askName: "Great, let's book your viewing! 🏡 May I have your <b>full name</b>?",
        askDateStaff: "Which <b>date</b> suits you best? Viewings are with {staff}, who's available {days}.",
        sentNew: "✅ Your viewing request has been sent. Your agent will call you to confirm.",
        timeLate: "Our last viewing starts at {lastShort}. Please choose a time between {openShort} and {lastShort}.",
        compareStaff: "All our agents are experienced local experts: {staffShortList}. You're in great hands with any of them!",
        openOn: "Yes, we're open on <b>{date}</b> from {openShort} to {closeShort}. Would you like to book a viewing?",
        pricesIntro: "Here are the prices for our current listings:"
      }
    },

    faq: [
      { id: "reschedule", action: "reschedule",
        strong: ["reschedule", "cancel", "cancellation", "postpone", "change viewing", "move viewing", "change booking", "different date", "another date"], weak: [] },
      { id: "book", action: "book",
        strong: ["book", "booking", "viewing", "book a viewing", "schedule a viewing", "see the property", "visit the property", "tour", "showing"], weak: ["see", "visit", "view", "appointment", "available", "availability"] },
      { id: "advice", priority: 1,
        strong: ["good investment", "should i buy", "is it worth", "financial advice", "invest", "investment", "interest rate", "interest rates", "market crash", "tax advice"], weak: [],
        answer: "That's an important decision, and I'm not able to give financial or investment advice. One of our agents can walk you through the numbers and connect you with a licensed mortgage advisor — call us at {phone}.",
        chips: ["Agents", "Book a Viewing"] },
      { id: "listings",
        strong: ["listings", "listing", "properties", "property", "what do you have", "available homes", "homes for sale", "show me", "houses"], weak: ["home", "house", "options"],
        answer: listingsHtml, chips: ["Book a Viewing", "Buy or Rent"] },
      { id: "buy",
        strong: ["buy", "buying", "purchase", "for sale", "own a home", "first home", "first time buyer"], weak: ["sale"],
        answer: "We have 3 homes for sale right now: <b>Sunset Villa</b> ($850,000), <b>Harbor View Apartment</b> ($420,000) and <b>Maple Family Home</b> ($565,000). Would you like to book a viewing?",
        chips: ["Book a Viewing", "Mortgage help", "Documents to buy"] },
      { id: "rent",
        strong: ["rent", "renting", "rental", "rentals", "lease", "for rent", "tenant", "monthly"], weak: [],
        answer: "We have 2 rentals available: <b>City Loft</b> ($2,400/month) and <b>Garden Townhouse</b> ($3,100/month). Would you like to book a viewing?",
        chips: ["Book a Viewing", "Documents to rent", "Deposit"] },
      { id: "sell",
        strong: ["sell", "selling", "sell my house", "sell my home", "list my home", "list my property", "valuation", "value my home", "how much is my house worth", "appraisal"], weak: ["worth"],
        answer: "We'd love to help you sell! We offer a <b>free home valuation</b> — one of our agents will visit, assess your home and suggest the best asking price. Call us at {phone} to arrange it.",
        chips: ["Agent fees", "Agents"] },
      { id: "mortgage",
        strong: ["mortgage", "home loan", "loan", "pre approval", "preapproval", "pre approved", "financing", "down payment", "deposit for buying"], weak: ["bank", "finance"],
        answer: "We don't give financial advice ourselves, but our agents work with trusted, licensed mortgage advisors and can introduce you — including help with pre-approval. Call us at {phone} and we'll connect you.",
        chips: ["Documents to buy", "Agents"] },
      { id: "documentsBuy",
        strong: ["documents to buy", "documents needed to buy", "buying documents", "paperwork to buy", "what do i need to buy"], weak: [],
        answer: "To buy, you'll usually need a <b>photo ID</b>, <b>proof of funds or a mortgage pre-approval letter</b>, and recent <b>bank statements</b>. Your agent will guide you through the rest.",
        chips: ["Mortgage help", "Book a Viewing"] },
      { id: "documentsRent",
        strong: ["documents to rent", "documents needed to rent", "rental documents", "rental application", "what do i need to rent", "references"], weak: [],
        answer: "To rent, please bring a <b>photo ID</b>, <b>proof of income</b> (3 recent payslips or an employment letter) and a <b>reference</b> from a previous landlord.",
        chips: ["Deposit", "Book a Viewing"] },
      { id: "documents",
        strong: ["documents", "document", "paperwork", "what documents", "id needed"], weak: ["papers"],
        answer: "To <b>buy</b>: photo ID, proof of funds or a mortgage pre-approval, and bank statements. To <b>rent</b>: photo ID, proof of income and a landlord reference.",
        chips: ["Documents to buy", "Documents to rent"] },
      { id: "fees",
        strong: ["agent fee", "agent fees", "commission", "your fee", "fees", "do you charge", "how much do you charge", "broker fee"], weak: ["fee", "charge"],
        answer: "Buyers pay <b>no agent fee</b>. For sellers our commission is <b>2.5%</b> of the sale price, and for rentals the tenant fee is <b>one week's rent</b>.",
        chips: ["Sell my home", "Listings"] },
      { id: "deposit",
        strong: ["deposit", "security deposit", "advance rent", "first month"], weak: [],
        answer: "For rentals, we ask for a <b>security deposit of one month's rent</b> plus the first month in advance. The deposit is fully refundable at the end of the lease (subject to the property's condition).",
        chips: ["Documents to rent", "Rentals"] },
      { id: "leaseTerm",
        strong: ["minimum lease", "lease length", "short term", "how long lease", "6 months", "12 months"], weak: [],
        answer: "Our standard lease is <b>12 months</b>. Some landlords accept 6-month leases — just ask your agent.", chips: ["Rentals", "Book a Viewing"] },
      { id: "pets",
        strong: ["pet", "pets", "dog", "cat", "pet friendly"], weak: [],
        answer: "The <b>City Loft</b> is pet-friendly 🐾. For other properties it depends on the owner — your agent will check for you.", chips: ["Listings", "Book a Viewing"] },
      { id: "virtualTour",
        strong: ["virtual tour", "video tour", "online viewing", "video call", "virtual viewing"], weak: ["video", "online"],
        answer: "Yes! Any of our agents can give you a live video tour of a property. Just book a viewing and mention you'd like it virtual.", chips: ["Book a Viewing"] },
      { id: "openHouse",
        strong: ["open house", "open houses"], weak: [],
        answer: "We hold open houses on selected Saturdays. Call us at {phone} to hear about the next one, or book a private viewing any day we're open.", chips: ["Book a Viewing"] },
      { id: "neighborhoods",
        strong: ["neighborhood", "neighbourhood", "area", "areas", "schools", "safe area", "commute"], weak: ["nearby", "locality"],
        answer: "Our listings are in <b>Westwood</b> (quiet and leafy), <b>Downtown</b> (city living), <b>Oak Park</b> (great schools), the <b>Arts District</b> and <b>Riverside</b>. Your agent can tell you all about each area.",
        chips: ["Listings", "Agents"] },
      { id: "agents",
        strong: ["agent", "agents", "realtor", "broker", "who are", "team", "staff"], weak: ["experience", "experienced"],
        answer: "Our team: {staffList}. You'll be in very good hands!", chips: ["Book a Viewing", "Listings"] },
      { id: "timings",
        strong: ["timing", "hours", "opening hours", "office hours", "working hours", "what time"], weak: ["open", "close", "closing", "time", "when"],
        answer: "We're open {hours}. {closed}", chips: ["Book a Viewing", "Location"] },
      { id: "location",
        strong: ["location", "located", "address", "office", "direction", "map", "google maps", "where are you", "how to reach", "find you"], weak: ["where", "street"],
        answer: "Our office is at <b>{address}</b>.<br>{mapsLink}", chips: ["Timings", "Book a Viewing"] },
      { id: "parking",
        strong: ["parking", "park", "car park", "garage"], weak: ["car"],
        answer: "Yes — there's free visitor parking in front of our office.", chips: ["Location"] },
      { id: "discount",
        strong: ["discount", "discounts", "offers", "deal", "deals", "negotiate", "negotiable", "lower price", "best price"], weak: ["cheaper"],
        answer: "Prices are set by the owners, but there's often room to negotiate. Your agent can make an offer on your behalf — call us at {phone}.", chips: ["Listings", "Agents"] },
      { id: "late",
        strong: ["late", "running late", "delayed", "delay"], weak: [],
        answer: "No worries — please call us at {phone} and we'll let your agent know.", chips: ["Location"] },
      { id: "email",
        strong: ["email", "e mail", "mail", "email address"], weak: [],
        answer: "You can email us at {email}.", chips: ["Book a Viewing"] },
      { id: "human",
        strong: ["real person", "human", "talk to someone", "speak to someone", "whatsapp", "phone number", "contact number", "call you"], weak: ["talk", "call", "contact", "phone", "number"],
        answer: "You can call our team at {phone}, or message us on WhatsApp at {whatsapp}.", chips: ["Agents", "Book a Viewing"] },
      { id: "language",
        strong: ["spanish", "espanol", "french", "arabic", "urdu", "hindi", "german", "chinese", "language", "other language"], weak: ["speak"],
        answer: "Sorry, I can only chat in English right now, but our team can help you at {phone}." },
      { id: "prices", action: "prices",
        strong: ["prices", "price list"], weak: ["price", "cost", "how much", "expensive", "cheap", "afford", "budget"] },
      { id: "services", action: "services",
        strong: ["services", "what do you offer", "what do you do"], weak: ["offer", "provide"] },
      { id: "greeting",
        strong: ["hi", "hello", "hey", "hiya", "good morning", "good afternoon", "good evening", "salam", "assalam"], weak: [],
        answer: "Hello! 😊 How can I help you today?" },
      { id: "thanks",
        strong: ["thank", "thanks", "thx", "appreciate", "great", "perfect", "awesome"], weak: [],
        answer: "You're very welcome! Good luck with your search — we're here whenever you need us. 😊" },
      { id: "bye",
        strong: ["bye", "goodbye", "see you", "good night"], weak: [],
        answer: "Thank you for chatting with us — have a wonderful day! 😊" }
    ]
  };
})();
