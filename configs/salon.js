/* =====================================================================
   BEAUTY SALON — "Glow Studio" (fictional demo)
   Copy this file to create a new client's chatbot, then edit the data.
   ===================================================================== */
(function () {
  // Services: id, name, price, duration, keywords
  const services = [
    { id: "haircut",  label: "Women's Haircut & Blow-dry", price: "$45",  time: "45 min",      match: ["haircut", "hair cut", "trim", "blow dry", "blowdry", "blow out", "womens haircut", "cut my hair"] },
    { id: "mensCut",  label: "Men's Haircut",              price: "$25",  time: "30 min",      match: ["mens haircut", "men haircut", "men's cut", "mens cut", "fade", "beard", "barber", "beard trim"] },
    { id: "color",    label: "Hair Color",                 price: "$90",  time: "2 hours",     match: ["color", "colour", "coloring", "dye", "hair color", "root touch up", "grey coverage"] },
    { id: "highlights", label: "Highlights / Balayage",    price: "$140", time: "2.5 hours",   match: ["highlights", "balayage", "ombre", "lowlights"] },
    { id: "keratin",  label: "Keratin Treatment",          price: "$180", time: "2.5 hours",   match: ["keratin", "smoothing", "straightening", "frizz"] },
    { id: "facial",   label: "Signature Facial",           price: "$65",  time: "60 min",      match: ["facial", "facials", "skin", "skincare", "glow facial", "face treatment"] },
    { id: "manicure", label: "Manicure",                   price: "$25",  time: "40 min",      match: ["manicure", "mani"] },
    { id: "pedicure", label: "Pedicure",                   price: "$35",  time: "50 min",      match: ["pedicure", "pedi", "feet", "toes"] },
    { id: "gel",      label: "Gel Nails",                  price: "$40",  time: "60 min",      match: ["gel", "gel nails", "gel polish", "acrylic", "extensions"] },
    { id: "makeup",   label: "Party Makeup",               price: "$70",  time: "60 min",      match: ["makeup", "make up", "party makeup", "glam"] },
    { id: "bridal",   label: "Bridal Package (hair + makeup)", price: "$250", time: "3 hours", match: ["bridal", "bride", "wedding", "bridal package", "bridal makeup"] },
    { id: "brows",    label: "Eyebrow Shaping",            price: "$15",  time: "15 min",      match: ["eyebrow", "eyebrows", "brows", "threading", "brow shaping"] }
  ];
  const stylists = [
    { id: "aisha",  name: "Aisha Rahman",  specialty: "Senior Stylist & Bridal Artist", days: [2, 4, 6],    from: "10:00", to: "19:00", treats: ["haircut", "bridal", "makeup"] },
    { id: "chloe",  name: "Chloe Bennett", specialty: "Color Specialist",               days: [2, 3, 5, 6], from: "10:00", to: "18:00", treats: ["color", "highlights", "keratin"] },
    { id: "nina",   name: "Nina Patel",    specialty: "Skin & Facial Expert",           days: [0, 3, 4, 5], from: "11:00", to: "17:00", treats: ["facial", "brows"] },
    { id: "jordan", name: "Jordan Kim",    specialty: "Nail Artist",                    days: [0, 2, 5, 6], from: "11:00", to: "17:00", treats: ["nails", "manicure", "pedicure", "gel"] },
    { id: "marco",  name: "Marco Rossi",   specialty: "Barber & Men's Stylist",          days: [3, 4, 5, 6], from: "12:00", to: "20:00", treats: ["mensCut"] }
  ];
  const byId = (id) => stylists.find((s) => (s.treats || []).includes(id));
  const prices = {};
  services.forEach((s) => { prices[s.id] = { label: s.label, value: s.price }; });

  (window.ChatbotConfigs = window.ChatbotConfigs || {}).salon = {
    id: "salon",
    industry: "Beauty Salon",
    tagline: "Books hair, nails, skin and bridal appointments with the right stylist.",

    business: {
      name: "Glow Studio",
      address: "77 Rose Lane",
      city: "Springfield",
      phone: "+1 (555) 456-7890",
      whatsapp: "+1 (555) 456-7890",
      email: "hello@glowstudio.com"
    },

    theme: { accent: "#F9A8D4", accent2: "#E879F9", glow: "249,168,212", glow2: "232,121,249", blob: "217,70,239", icon: "scissors" },

    hours: {
      days: { 0: ["11:00", "17:00"], 2: ["10:00", "20:00"], 3: ["10:00", "20:00"], 4: ["10:00", "20:00"], 5: ["10:00", "20:00"], 6: ["09:00", "19:00"] },
      lastSlotBeforeClose: 30,
      display: "Tuesday to Friday 10:00 AM – 8:00 PM, Saturday 9:00 AM – 7:00 PM, Sunday 11:00 AM – 5:00 PM",
      shortDisplay: "Tuesday to Sunday (Tue–Fri 10 AM – 8 PM, Sat 9 AM – 7 PM, Sun 11 AM – 5 PM)",
      daysText: "Tuesday to Sunday",
      closedDisplay: "We're closed on Mondays."
    },

    prices,

    staff: {
      intent: "stylists", singular: "stylist", plural: "stylists", label: "Stylist", words: ["artist", "beautician", "barber"], titles: [], shortPrefix: "",
      priority: ["bridal", "mensCut", "color", "keratin", "facial", "nails", "makeup", "haircut"],
      serviceLabels: { bridal: "bridal hair & makeup", mensCut: "men's haircuts", color: "hair color", keratin: "keratin treatments", facial: "facials",
        nails: "nails", makeup: "makeup", haircut: "haircuts" },
      feeChips: ["Prices", "Book Appointment"],
      list: stylists.map((s) => ({ ...s, short: s.name.split(" ")[0] }))
    },

    services: services.map((s) => s.label),

    booking: {
      noun: "appointment",
      steps: ["name", "contact", "service", "date", "staff", "time"],
      summary: ["name", "contact", "service", "date", "time", "staff"],
      closingLine: "Your {service}{staffWith} is booked for {date} at {time}",
      duration: 60,
      multiPerson: true,
      maxDaysAhead: 60,
      fields: {
        service: {
          type: "choice", label: "Service", words: "service|treatment|services", changeLabel: "the service", multi: true,
          prompt: "Lovely! Which <b>service</b> would you like to book?", shortPrompt: "Which <b>service</b> would you like to book?",
          chips: ["Haircut", "Men's Haircut", "Hair Color", "Facial", "Manicure", "Pedicure", "Bridal"],
          invalid: "Which service would you like? Just tap one below, or type it.",
          ack: "<b>{value}</b>",
          options: services.map((s) => ({
            id: s.id, label: s.label, match: s.match,
            info: `Our <b>${s.label}</b> is <b>${s.price}</b> and takes about ${s.time}.` + (byId(s.id) ? ` Our specialist for this is <b>${byId(s.id).name}</b>.` : ""),
            chips: ["Book Appointment", "Prices"]
          }))
        }
      }
    },

    pricing: {
      intents: { haircut: "haircut", mensCut: "mensCut", color: "color", keratin: "keratin", facial: "facial", nails: "manicure", makeup: "makeup", bridal: "bridal" },
      qty: [{ words: "manicures?", key: "manicure", name: "Manicures" }, { words: "pedicures?", key: "pedicure", name: "Pedicures" }, { words: "facials?", key: "facial", name: "Facials" }],
      qtyChips: ["Book Appointment", "Prices"],
      multiChips: ["Book Appointment", "Prices"]
    },

    bot: {
      name: "Glow Studio Assistant",
      welcome: "Hi gorgeous! 👋 Welcome to Glow Studio. How can I help you today? Ask about our services, prices or stylists — or I can book your appointment.",
      quickReplies: ["Book Appointment", "Prices", "Stylists", "Timings"],
      tooltip: "Treat yourself — chat with us!",
      showTooltipAfterMs: 2500,
      optionIntents: ["haircut", "mensCut", "color", "keratin", "facial", "nails", "makeup", "bridal", "prices", "book"],
      overlaps: [["groupBooking", "bridal"], ["lashes", "brows"], ["waxing", "brows"], ["bondRepair", "haircut"], ["deposit", "bridal"], ["firstVisit", "consultation"], ["bridalTrial", "bridal"], ["patchTest", "color"]],
      topicWords: ["hair", "haircut", "salon", "nails", "facial", "makeup", "beauty", "stylist", "appointment", "color", "spa", "treatment"],
      offTopicWords: ["weather", "politics", "political", "election", "president", "government", "football", "soccer", "cricket", "movie", "movies", "song", "music", "code", "coding", "python", "javascript", "programming", "bitcoin", "crypto", "stock", "stocks", "news", "joke", "poem", "game", "homework", "math", "flight", "hotel"],
      replies: {
        introBook: "Wonderful, let's get you booked in! 💅 ",
        askName: "Wonderful, let's get you booked in! 💅 May I have your <b>full name</b>?",
        compareStaff: "All our stylists are highly experienced in their specialties: {staffShortList}. You're in great hands with any of them!",
        staffFees: "Our prices are the same whichever stylist you choose — you can pick whoever suits your style and schedule.",
        openOn: "Yes, we're open on <b>{date}</b> from {openShort} to {closeShort}. Would you like to book an appointment?",
        pricesNote: "Prices may vary slightly for very long or thick hair — your stylist will confirm before starting."
      }
    },

    faq: [
      { id: "reschedule", action: "reschedule",
        strong: ["reschedule", "cancel", "postpone", "change appointment", "move appointment", "change booking", "different date", "another date", "another time"], weak: [] },
      { id: "book", action: "book",
        strong: ["book", "booking", "reserve", "make appointment", "get appointment", "schedule"], weak: ["appointment", "slot", "available", "availability", "come in"] },
      { id: "patchTest", priority: 1,
        strong: ["patch test", "allergy", "allergic", "allergies", "sensitive skin", "reaction", "pregnant", "pregnancy", "safe during pregnancy"], weak: ["safe", "sensitive"],
        answer: "Your safety matters to us. For any hair color we do a quick <b>patch test 48 hours before</b> your appointment, and if you have allergies, sensitive skin or are pregnant, please mention it when booking — for medical questions, check with your doctor first.",
        chips: ["Book Appointment", "Hair Color"] },
      { id: "haircut",
        strong: ["haircut", "hair cut", "trim", "blow dry", "blowdry", "womens haircut"], weak: ["cut", "hair"],
        answer: "Our <b>Women's Haircut & Blow-dry</b> is {price:haircut} (about 45 minutes), and a <b>Men's Haircut</b> is {price:mensCut}.", chips: ["Book Appointment", "Stylists"] },
      { id: "mensCut",
        strong: ["mens haircut", "men haircut", "barber", "beard", "fade", "for men", "male"], weak: ["men", "mens"],
        answer: "Yes! Our <b>Men's Haircut</b> is {price:mensCut}, with {specialist:mensCut}. Beard trims are included.", chips: ["Book Appointment", "Stylists"] },
      { id: "color",
        strong: ["color", "colour", "coloring", "dye", "hair color", "highlights", "balayage", "ombre", "grey coverage"], weak: [],
        answer: "A full <b>Hair Color</b> is {price:color}, and <b>Highlights / Balayage</b> is {price:highlights}, with {specialist:color}.", chips: ["Book Appointment", "Patch test"] },
      { id: "keratin",
        strong: ["keratin", "smoothing", "straightening", "frizz"], weak: [],
        answer: "Our <b>Keratin Treatment</b> is {price:keratin} and takes about 2.5 hours, with {specialist:keratin}.", chips: ["Book Appointment"] },
      { id: "facial",
        strong: ["facial", "facials", "skin", "skincare", "acne", "glow"], weak: ["face"],
        answer: "Our <b>Signature Facial</b> is {price:facial} (60 minutes), with {specialist:facial}. It cleanses, exfoliates and leaves your skin glowing ✨",
        chips: ["Book Appointment", "Prices"] },
      { id: "nails",
        strong: ["nails", "nail", "manicure", "pedicure", "gel", "acrylic", "nail art"], weak: [],
        answer: "Manicure {price:manicure}, Pedicure {price:pedicure} and Gel Nails {price:gel} — all done by {specialist:nails}. 💅", chips: ["Book Appointment", "Prices"] },
      { id: "makeup",
        strong: ["makeup", "make up", "party makeup", "glam"], weak: [],
        answer: "Our <b>Party Makeup</b> is {price:makeup} (about 60 minutes), with {specialist:makeup}.", chips: ["Book Appointment", "Bridal"] },
      { id: "bridal",
        strong: ["bridal", "bride", "wedding", "bridal package", "bridal makeup"], weak: [],
        answer: "Congratulations! 💍 Our <b>Bridal Package</b> (hair + makeup) is {price:bridal}, with {specialist:bridal}. We recommend booking at least 4–6 weeks ahead.",
        chips: ["Bridal trial", "Book Appointment"] },
      { id: "bridalTrial",
        strong: ["bridal trial", "trial", "trial run", "test run"], weak: [],
        answer: "A bridal hair & makeup <b>trial is $80</b>, and it's deducted from your Bridal Package if you book with us.", chips: ["Book Appointment"] },
      { id: "brows",
        strong: ["eyebrow", "eyebrows", "brows", "threading", "brow shaping"], weak: [],
        answer: "Eyebrow Shaping is {price:brows}. We also offer waxing — ask our team for the full waxing menu at {phone}.", chips: ["Book Appointment"] },
      { id: "duration",
        strong: ["how long", "duration", "how much time", "how many minutes"], weak: ["take", "long"],
        answer: "It depends on the service: a haircut takes about 45 minutes, a facial 60 minutes, hair color around 2 hours and the Bridal Package about 3 hours.", chips: ["Prices", "Book Appointment"] },
      { id: "cancelPolicy",
        strong: ["cancellation policy", "cancel policy", "late cancellation", "no show", "cancellation fee", "cancel fee"], weak: ["policy"],
        answer: "Please give us at least <b>24 hours' notice</b> to cancel or reschedule. Late cancellations and no-shows may be charged <b>50% of the service price</b>.",
        chips: ["Book Appointment"] },
      { id: "walkIn",
        strong: ["walk in", "walk ins", "walkin", "without appointment", "without booking", "just come", "drop in"], weak: [],
        answer: "Walk-ins are welcome whenever a stylist is free, but booking ahead guarantees your spot — especially on weekends.", chips: ["Book Appointment", "Timings"] },
      { id: "products",
        strong: ["products", "product", "brands", "brand", "shampoo", "what do you use", "organic", "vegan products", "cruelty free"], weak: [],
        answer: "We use professional, <b>salon-grade products</b> — sulfate-free hair care, ammonia-free color options and cruelty-free skincare. You can buy our favorites at the front desk too!",
        chips: ["Prices", "Book Appointment"] },
      { id: "kids",
        strong: ["kids haircut", "child", "children", "kids", "son", "daughter"], weak: [],
        answer: "Yes! Kids' haircuts (under 12) are <b>$20</b>.", chips: ["Book Appointment"] },
      { id: "giftCard",
        strong: ["gift card", "gift voucher", "voucher", "gift certificate", "present"], weak: ["gift"],
        answer: "Yes, we have gift cards from $25 up — the perfect treat! 🎁 Buy one at the salon or call us at {phone}.", chips: ["Prices"] },
      { id: "late",
        strong: ["late", "running late", "delayed", "delay"], weak: [],
        answer: "No worries — please call us at {phone}. If you're more than 15 minutes late we may need to shorten or move your appointment.", chips: ["Location"] },
      { id: "payment",
        strong: ["payment", "pay", "cash", "card", "credit", "debit", "apple pay", "google pay", "visa", "mastercard"], weak: ["method"],
        answer: "We accept cash, credit and debit cards, Apple Pay and Google Pay.", chips: ["Prices"] },
      { id: "discount",
        strong: ["discount", "discounts", "offers", "special offer", "deal", "deals", "promo", "promotion", "coupon", "loyalty", "student discount"], weak: ["cheaper"],
        answer: "For current offers and our loyalty program, please call us at {phone}.", chips: ["Prices", "Book Appointment"] },
      { id: "stylists",
        strong: ["stylist", "stylists", "hairdresser", "who are", "team", "staff", "artist"], weak: ["experience", "experienced"],
        answer: "Our team: {staffList}. You'll be in very good hands!", chips: ["Book Appointment", "Prices"] },
      { id: "timings",
        strong: ["timing", "hours", "opening hours", "working hours", "what time", "monday"], weak: ["open", "close", "closing", "time", "when"],
        answer: "We're open {hours}. {closed}", chips: ["Book Appointment", "Location"] },
      { id: "parking",
        strong: ["parking", "park", "car park", "garage"], weak: ["car", "drive"],
        answer: "Yes — free parking is available right outside the salon.", chips: ["Location"] },
      { id: "location",
        strong: ["location", "located", "address", "direction", "map", "google maps", "where are you", "how to reach", "find you"], weak: ["where", "street"],
        answer: "You'll find us at <b>{address}</b>.<br>{mapsLink}", chips: ["Timings", "Book Appointment"] },
      { id: "email",
        strong: ["email", "e mail", "mail", "email address"], weak: [],
        answer: "You can email us at {email}.", chips: ["Book Appointment"] },
      { id: "human",
        strong: ["real person", "human", "receptionist", "talk to someone", "speak to someone", "whatsapp", "phone number", "contact number", "call you"], weak: ["talk", "call", "contact", "phone", "number"],
        answer: "You can call our team at {phone}, or message us on WhatsApp at {whatsapp}.", chips: ["Book Appointment"] },
      { id: "language",
        strong: ["spanish", "espanol", "french", "arabic", "urdu", "hindi", "german", "chinese", "language", "other language"], weak: ["speak"],
        answer: "Sorry, I can only chat in English right now, but our team can help you at {phone}." },
      { id: "prices", action: "prices",
        strong: ["price list", "prices", "rates", "menu"], weak: ["price", "cost", "how much", "charge", "expensive", "cheap", "afford"] },
      { id: "services", action: "services",
        strong: ["services", "treatments", "what do you offer", "what do you do"], weak: ["offer", "treatment", "provide"] },
      { id: "firstVisit", strong: ["first visit", "first time", "new client", "never been"], weak: [],
        answer: "Welcome! 💕 On your first visit, your stylist will start with a quick consultation about your hair or skin goals before we begin. Please arrive 5–10 minutes early.", chips: ["Book Appointment", "Prices"] },
      { id: "consultation", strong: ["consultation", "free consultation", "color consultation", "advice on color"], weak: [],
        answer: "Consultations are always free! Pop in or book one, and your stylist will recommend the perfect color, cut or treatment for you.", chips: ["Book Appointment", "Stylists"] },
      { id: "hairLength", strong: ["long hair", "thick hair", "hair length", "extra charge", "extra for long"], weak: [],
        answer: "For very long or thick hair, color services may cost $10–$30 more — your stylist will always confirm the price before starting.", chips: ["Prices"] },
      { id: "lashes", strong: ["lashes", "lash", "lash lift", "lash extensions", "eyelash", "eyelashes", "lash tint"], weak: [],
        answer: "We offer a <b>Lash Lift & Tint</b> for $60 (45 minutes). We don't do lash extensions at the moment.", chips: ["Book Appointment", "Prices"] },
      { id: "waxing", strong: ["wax", "waxing", "full leg", "underarm", "bikini wax", "hair removal"], weak: [],
        answer: "Yes! Waxing starts from $15 for brows and $25 for underarms, up to $55 for a full leg. Call us at {phone} for the full waxing menu.", chips: ["Book Appointment"] },
      { id: "massage", strong: ["massage", "spa", "body treatment", "body scrub", "sauna"], weak: [],
        answer: "We focus on hair, nails, skin and makeup, so we don't offer massages or body treatments — sorry about that!", chips: ["Services"] },
      { id: "extensions", strong: ["extensions", "hair extensions", "weave", "wig", "clip ins"], weak: [],
        answer: "We don't offer hair extensions right now, but our stylists can recommend cuts and styles that add lots of volume.", chips: ["Haircut", "Stylists"] },
      { id: "perm", strong: ["perm", "perms", "permanent wave", "curls", "curly perm"], weak: [],
        answer: "Yes, we do perms! A perm is $120 and takes about 2 hours — your stylist will do a quick hair check first.", chips: ["Book Appointment"] },
      { id: "bondRepair", strong: ["damaged hair", "bond repair", "hair treatment", "deep conditioning", "hair mask", "dry hair", "split ends"], weak: [],
        answer: "Our <b>Bond Repair Treatment</b> is a $35 add-on that brings damaged hair back to life — perfect with any cut or color. ✨", chips: ["Book Appointment", "Hair Color"] },
      { id: "groupBooking", strong: ["bridal party", "group booking", "bridesmaids", "group of", "party of", "for a group"], weak: ["group"],
        answer: "We'd love to glam your whole group! 💃 For bridal parties and groups of 3 or more, please call us at {phone} so we can plan the timings together.", chips: ["Bridal", "Book Appointment"] },
      { id: "deposit", strong: ["deposit", "pay in advance", "prepay", "pay upfront", "advance payment"], weak: [],
        answer: "Most services need no deposit. For the Bridal Package we ask for a $50 deposit to secure your date, which comes off your final bill.", chips: ["Bridal", "Payment"] },
      { id: "tipping", strong: ["tip", "tipping", "gratuity"], weak: [],
        answer: "Tips are always appreciated but never expected — you can add one by card or cash.", chips: ["Payment"] },
      { id: "unhappy", strong: ["not happy", "redo", "fix my hair", "refund", "complaint", "didnt like", "unhappy"], weak: [],
        answer: "We're so sorry to hear that! If you're not happy with your service, let us know within 7 days and we'll adjust it for free — please call {phone}.", chips: ["Book Appointment"] },
      { id: "whatToBring", strong: ["what to bring", "before my appointment", "wash my hair", "prepare", "come with clean hair"], weak: [],
        answer: "No need to bring anything! For color, come with dry, unwashed (1–2 days) hair; for facials, arrive with a clean face if you can. Inspiration photos are always welcome 📸", chips: ["Book Appointment"] },
      { id: "drinks", strong: ["coffee", "tea", "drinks", "wifi", "wi fi", "refreshments"], weak: [],
        answer: "Of course! Enjoy complimentary tea, coffee and free Wi-Fi while you relax. ☕", chips: ["Book Appointment"] },
      { id: "accessibility", strong: ["wheelchair", "accessible", "accessibility", "disabled", "ramp"], weak: [],
        answer: "Yes, Glow Studio is on the ground floor and fully wheelchair accessible.", chips: ["Location"] },
      { id: "greeting",
        strong: ["hi", "hello", "hey", "hiya", "good morning", "good afternoon", "good evening", "salam", "assalam"], weak: [],
        answer: "Hello! 😊 How can I help you today?" },
      { id: "thanks",
        strong: ["thank", "thanks", "thx", "appreciate", "great", "perfect", "awesome"], weak: [],
        answer: "You're very welcome! We can't wait to see you at Glow Studio. ✨" },
      { id: "bye",
        strong: ["bye", "goodbye", "see you", "good night"], weak: [],
        answer: "Thank you for chatting with us — have a beautiful day! ✨" }
    ]
  };
})();
