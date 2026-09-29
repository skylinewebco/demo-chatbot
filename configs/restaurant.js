/* =====================================================================
   RESTAURANT — "Spice Garden" (fictional demo)
   Copy this file to create a new client's chatbot, then edit the data.
   ===================================================================== */
(function () {
  const menu = [
    ["Starters", [["samosa", "Vegetable Samosa (2 pcs)", 6, "🌱"], ["paneerTikka", "Paneer Tikka", 12, "🌱"], ["chickenTikka", "Chicken Tikka", 14, ""]]],
    ["Mains", [["butterChicken", "Butter Chicken", 17, ""], ["roganJosh", "Lamb Rogan Josh", 19, "🌶️🌶️"], ["chickenBiryani", "Chicken Biryani", 16, "🌶️"],
      ["vegBiryani", "Vegetable Biryani", 14, "🌱🌶️"], ["palakPaneer", "Palak Paneer", 15, "🌱"], ["dalMakhani", "Dal Makhani", 13, "🌱"], ["chanaMasala", "Chana Masala", 12, "🌱 vegan"]]],
    ["Breads & rice", [["garlicNaan", "Garlic Naan", 4, "🌱"], ["plainNaan", "Plain Naan", 3, "🌱"], ["rice", "Basmati Rice", 4, "🌱 vegan"]]],
    ["Desserts & drinks", [["gulabJamun", "Gulab Jamun", 6, "🌱"], ["mangoLassi", "Mango Lassi", 5, "🌱"], ["chai", "Masala Chai", 3, "🌱"]]]
  ];
  const prices = {};
  menu.forEach(([, items]) => items.forEach(([key, label, price]) => { prices[key] = { label, value: "$" + price }; }));
  const menuHtml = "Here's our menu 🍛 (🌱 = vegetarian, 🌶️ = spicy):" + menu.map(([group, items]) =>
    `<div class="pl-note" style="margin-top:8px">${group}</div><div class="price-list">` +
    items.map(([, label, price, tag]) => `<div class="pl-row"><span>${label}${tag ? " " + tag : ""}</span><span>$${price}</span></div>`).join("") + "</div>").join("");

  (window.ChatbotConfigs = window.ChatbotConfigs || {}).restaurant = {
    id: "restaurant",
    industry: "Restaurant",
    tagline: "Takes table reservations and answers menu, delivery and allergy questions.",

    business: {
      name: "Spice Garden",
      address: "48 Market Street",
      city: "Springfield",
      phone: "+1 (555) 234-5678",
      whatsapp: "+1 (555) 234-5678",
      email: "hello@spicegarden.com"
    },

    theme: { accent: "#FACC15", accent2: "#4ADE80", glow: "250,204,21", glow2: "234,179,8", blob: "34,197,94", icon: "dish" },

    hours: {
      days: { 0: ["12:00", "22:00"], 2: ["12:00", "22:00"], 3: ["12:00", "22:00"], 4: ["12:00", "22:00"], 5: ["12:00", "23:00"], 6: ["12:00", "23:00"] },
      lastSlotBeforeClose: 60,                                     // last seating 1 hour before closing
      display: "Tuesday to Sunday, 12:00 PM – 10:00 PM (Fridays & Saturdays until 11:00 PM)",
      shortDisplay: "Tuesday to Sunday, 12 PM – 10 PM (Fri & Sat until 11 PM)",
      daysText: "Tuesday to Sunday",
      closedDisplay: "We're closed on Mondays."
    },

    prices,

    booking: {
      noun: "reservation",
      steps: ["name", "phone", "date", "time", "guests"],
      summary: ["name", "phone", "date", "time", "guests"],
      multiPerson: false,                                          // "me and my wife" = a table for 2
      maxDaysAhead: 60,
      fields: {
        guests: {
          type: "number", label: "Guests", words: "guests?|people|party size|number of people", min: 1, max: 12, allowFor: true,
          prompt: "And how many <b>guests</b> will be joining?", shortPrompt: "How many <b>guests</b>?",
          chips: ["2", "4", "6", "8"],
          invalid: "Please tell me how many guests (1–12).",
          tooBig: "For groups larger than 12, please call us at {phone} — we'd love to host you in our private Garden Room!",
          shortErrors: ["Please enter the number of guests (1–12).", "Please tap a number below, or type how many guests."],
          ack: "a table for <b>{value}</b>", changeLabel: "the number of guests"
        }
      }
    },

    pricing: {
      intents: {},
      qty: [
        { words: "butter chickens?", key: "butterChicken", name: "Butter Chicken" }, { words: "chicken biryanis?|biryanis?", key: "chickenBiryani", name: "Chicken Biryani" },
        { words: "veg(?:etable)? biryanis?", key: "vegBiryani", name: "Vegetable Biryani" }, { words: "garlic naans?", key: "garlicNaan", name: "Garlic Naan" },
        { words: "plain naans?|naans?", key: "plainNaan", name: "Plain Naan" }, { words: "samosas?", key: "samosa", name: "Vegetable Samosa (2 pcs)" },
        { words: "paneer tikkas?", key: "paneerTikka", name: "Paneer Tikka" }, { words: "chicken tikkas?", key: "chickenTikka", name: "Chicken Tikka" },
        { words: "rogan josh|lamb curry", key: "roganJosh", name: "Lamb Rogan Josh" }, { words: "palak paneers?", key: "palakPaneer", name: "Palak Paneer" },
        { words: "dal makhanis?|dals?", key: "dalMakhani", name: "Dal Makhani" }, { words: "chana masalas?", key: "chanaMasala", name: "Chana Masala" },
        { words: "rices?", key: "rice", name: "Basmati Rice" }, { words: "gulab jamuns?", key: "gulabJamun", name: "Gulab Jamun" },
        { words: "mango lassis?|lassis?", key: "mangoLassi", name: "Mango Lassi" }, { words: "chais?|teas?", key: "chai", name: "Masala Chai" }
      ],
      qtyChips: ["Reserve a Table", "Delivery"]
    },

    bot: {
      name: "Spice Garden Assistant",
      welcome: "Hi there! 👋 Welcome to Spice Garden. How can I help you today? Ask me about our menu, delivery or opening hours — or I can reserve a table for you.",
      quickReplies: ["Reserve a Table", "Menu", "Delivery", "Timings"],
      tooltip: "Hungry? Chat with us!",
      overlaps: [["deliveryTime", "delivery"], ["deliveryFee", "delivery"], ["veg", "menu"], ["spice", "menu"], ["popular", "menu"], ["halal", "menu"], ["allergies", "menu"], ["dessert", "menu"], ["drinks", "menu"]],
      showTooltipAfterMs: 2500,
      topicWords: ["food", "menu", "dish", "dishes", "table", "restaurant", "dine", "dining", "dinner", "lunch", "eat", "order", "meal", "curry", "spice", "reservation", "delivery", "takeaway"],
      offTopicWords: ["weather", "politics", "political", "election", "president", "government", "football", "soccer", "cricket", "movie", "movies", "song", "music", "code", "coding", "python", "javascript", "programming", "bitcoin", "crypto", "stock", "stocks", "news", "joke", "poem", "game", "homework", "math", "flight", "hotel"],
      replies: {
        introBook: "Lovely, let's reserve your table! 😊 ",
        askName: "Lovely, let's reserve your table! 😊 May I have your <b>full name</b>?",
        sentNew: "✅ Your table reservation request has been sent. Our team will call you to confirm.",
        timeLate: "Our last seating is at {lastShort}. Please choose a time between {openShort} and {lastShort}.",
        openOn: "Yes, we're open on <b>{date}</b> from {openShort} to {closeShort}. Would you like to reserve a table?",
        dateTodayLate: "We're fully booked for the rest of today. Which other day works for you?"
      }
    },

    faq: [
      { id: "reschedule", action: "reschedule",
        strong: ["reschedule", "cancel", "cancellation", "postpone", "change reservation", "change booking", "move reservation", "different date", "another date", "another time"], weak: [] },
      { id: "book", action: "book",
        strong: ["book", "booking", "reserve", "reservation", "table", "book a table", "get a table"], weak: ["seat", "seats", "available", "availability", "come in", "dine in"] },
      { id: "allergies", priority: 1,
        strong: ["allergy", "allergies", "allergic", "nut", "nuts", "peanut", "gluten", "celiac", "coeliac", "dairy", "lactose", "shellfish", "intolerance"], weak: ["safe"],
        answer: "Thanks for letting us know — your safety comes first. Please tell our staff about any allergies when you order, and our chef will advise which dishes are safe for you. For detailed questions, call us at {phone}.",
        chips: ["Menu", "Vegetarian options"] },
      { id: "menu",
        strong: ["menu", "dishes", "what do you serve", "food list", "what food", "full menu"], weak: ["dish", "food", "eat", "serve"],
        answer: menuHtml, chips: ["Reserve a Table", "Vegetarian options", "Delivery"] },
      { id: "popular",
        strong: ["popular", "best dish", "signature", "recommend", "recommendation", "must try", "specialty", "speciality", "chef special"], weak: ["best", "favorite", "famous"],
        answer: "Our most-loved dishes are the <b>Butter Chicken</b> ({price:butterChicken}), <b>Chicken Biryani</b> ({price:chickenBiryani}) and <b>Lamb Rogan Josh</b> ({price:roganJosh}). Pair them with our Garlic Naan — you won't regret it! 😋",
        chips: ["Menu", "Reserve a Table"] },
      { id: "veg",
        strong: ["vegetarian", "veg", "vegan", "veggie", "plant based", "meat free", "no meat"], weak: ["meat"],
        answer: "Yes! We have lots of vegetarian dishes — Paneer Tikka, Palak Paneer, Dal Makhani, Vegetable Biryani and more. Our <b>Chana Masala</b> and Basmati Rice are fully vegan. 🌱",
        chips: ["Menu", "Spice level"] },
      { id: "spice",
        strong: ["spicy", "spice level", "spice", "mild", "hot", "chili", "chilli", "heat"], weak: ["level"],
        answer: "Every dish can be made <b>mild, medium or hot</b> — just tell your server. Our Lamb Rogan Josh is our spiciest dish 🌶️🌶️, and the Butter Chicken is lovely and mild.",
        chips: ["Menu", "Vegetarian options"] },
      { id: "halal",
        strong: ["halal", "pork", "beef"], weak: [],
        answer: "All our meat is <b>100% halal</b>, and we don't serve pork or beef.", chips: ["Menu"] },
      { id: "kids",
        strong: ["kids menu", "children", "child", "kids", "high chair", "family"], weak: ["baby"],
        answer: "Families are very welcome! We have high chairs, and our kitchen can make any dish mild for little ones. 👨‍👩‍👧",
        chips: ["Reserve a Table", "Menu"] },
      { id: "delivery",
        strong: ["delivery", "deliver", "delivery area", "delivery areas", "do you deliver", "home delivery"], weak: ["area", "areas", "zone"],
        answer: "Yes, we deliver to <b>Downtown, Riverside, Oak Park, Maple Heights and West End</b> (within 5 miles). The delivery fee is $3.99, and it's <b>free on orders over $40</b>. Minimum order is $15.",
        chips: ["Delivery time", "Menu", "Takeaway"] },
      { id: "deliveryTime",
        strong: ["delivery time", "how long delivery", "how long does delivery take", "eta"], weak: ["fast", "quick"],
        answer: "Delivery usually takes <b>35–45 minutes</b>, depending on your area and how busy we are.", chips: ["Delivery", "Menu"] },
      { id: "deliveryFee",
        strong: ["delivery fee", "delivery charge", "delivery cost", "free delivery", "minimum order"], weak: [],
        answer: "The delivery fee is $3.99, and delivery is <b>free on orders over $40</b>. The minimum order is $15.", chips: ["Delivery", "Menu"] },
      { id: "takeaway",
        strong: ["takeaway", "take away", "takeout", "take out", "pickup", "pick up", "collect", "collection", "to go"], weak: [],
        answer: "Yes! You can order takeaway by calling us at {phone} — it's usually ready in about 20 minutes.", chips: ["Menu", "Delivery"] },
      { id: "privateEvents",
        strong: ["private event", "private events", "private party", "party", "birthday", "anniversary", "event", "catering", "large group", "big group", "corporate"], weak: ["celebration", "group"],
        answer: "We'd love to host your celebration! 🎉 Our private <b>Garden Room</b> seats up to 40 guests, and we also offer catering. Please call us at {phone} to plan the details.",
        chips: ["Reserve a Table", "Menu"] },
      { id: "walkIn",
        strong: ["walk in", "walk ins", "without reservation", "without booking", "need a reservation", "need to book"], weak: [],
        answer: "Walk-ins are always welcome! On Friday and Saturday evenings we do get busy, so we recommend reserving a table.", chips: ["Reserve a Table", "Timings"] },
      { id: "late",
        strong: ["late", "running late", "delayed", "delay"], weak: [],
        answer: "No worries — we hold tables for 15 minutes. If you're running later than that, please call us at {phone} and we'll do our best to keep it for you.", chips: ["Location", "Parking"] },
      { id: "payment",
        strong: ["payment", "pay", "cash", "card", "credit", "debit", "apple pay", "google pay", "visa", "mastercard", "split the bill"], weak: ["method", "bill"],
        answer: "We accept cash, all major credit and debit cards, Apple Pay and Google Pay. Happy to split the bill too!", chips: ["Menu", "Reserve a Table"] },
      { id: "discount",
        strong: ["discount", "discounts", "offers", "special offer", "deal", "deals", "promo", "promotion", "coupon", "voucher", "happy hour", "gift card"], weak: ["cheaper"],
        answer: "For current offers, deals or gift cards, please call us at {phone}.", chips: ["Menu", "Reserve a Table"] },
      { id: "drinks",
        strong: ["drinks", "drink", "alcohol", "wine", "beer", "cocktail", "byob", "lassi", "chai", "soft drinks"], weak: ["beverage"],
        answer: "We serve Mango Lassi ({price:mangoLassi}), Masala Chai ({price:chai}) and soft drinks. We're alcohol-free, and you're welcome to bring your own wine (no corkage fee).",
        chips: ["Menu"] },
      { id: "dessert",
        strong: ["dessert", "desserts", "sweet", "sweets", "gulab jamun"], weak: [],
        answer: "Our Gulab Jamun ({price:gulabJamun}) is the perfect sweet finish — warm, soft and soaked in rose syrup. 🍮", chips: ["Menu"] },
      { id: "seating",
        strong: ["outdoor seating", "outside", "terrace", "patio", "garden seating", "wheelchair", "accessible", "accessibility"], weak: ["seating"],
        answer: "We have a lovely garden terrace for warmer days 🌿, and the restaurant is fully wheelchair accessible.", chips: ["Reserve a Table"] },
      { id: "wifi",
        strong: ["wifi", "wi fi", "internet"], weak: [],
        answer: "Yes, free Wi-Fi is available for all guests — just ask your server for the password.", chips: ["Menu"] },
      { id: "timings",
        strong: ["timing", "hours", "opening hours", "working hours", "what time", "open today", "monday"], weak: ["open", "close", "closing", "time", "when"],
        answer: "We're open {hours}. {closed}", chips: ["Reserve a Table", "Location"] },
      { id: "parking",
        strong: ["parking", "park", "car park", "garage"], weak: ["car", "drive", "driving", "vehicle"],
        answer: "Yes — there's free parking behind the restaurant, plus street parking on Market Street.", chips: ["Location", "Timings"] },
      { id: "location",
        strong: ["location", "located", "address", "direction", "map", "google maps", "where are you", "how to reach", "how do i get", "find you"], weak: ["where", "near", "street"],
        answer: "You'll find us at <b>{address}</b>.<br>{mapsLink}", chips: ["Timings", "Parking", "Reserve a Table"] },
      { id: "email",
        strong: ["email", "e mail", "mail", "email address"], weak: [],
        answer: "You can email us at {email}.", chips: ["Reserve a Table"] },
      { id: "human",
        strong: ["real person", "human", "manager", "talk to someone", "speak to someone", "whatsapp", "phone number", "contact number", "call you", "staff"], weak: ["talk", "call", "contact", "phone", "number"],
        answer: "You can call our team at {phone}, or message us on WhatsApp at {whatsapp}.", chips: ["Timings", "Reserve a Table"] },
      { id: "language",
        strong: ["spanish", "espanol", "french", "arabic", "urdu", "hindi", "german", "chinese", "language", "other language"], weak: ["speak"],
        answer: "Sorry, I can only chat in English right now, but our team can help you at {phone}." },
      { id: "prices", action: "prices",
        strong: ["price list", "prices", "rates"], weak: ["price", "cost", "how much", "expensive", "cheap", "afford"] },
      { id: "greeting",
        strong: ["hi", "hello", "hey", "hiya", "good morning", "good afternoon", "good evening", "salam", "assalam"], weak: [],
        answer: "Hello! 😊 How can I help you today?" },
      { id: "thanks",
        strong: ["thank", "thanks", "thx", "appreciate", "great", "perfect", "awesome"], weak: [],
        answer: "You're very welcome! We look forward to serving you at Spice Garden. 😊" },
      { id: "bye",
        strong: ["bye", "goodbye", "see you", "good night"], weak: [],
        answer: "Thank you for chatting with us — have a delicious day! 😊" }
    ]
  };
})();
