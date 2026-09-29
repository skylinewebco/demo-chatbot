/*!
 * Bright Smile Dental Clinic — Chatbot widget (standalone)
 * ---------------------------------------------------------
 * Install on ANY website by adding one line before </body>:
 *     <script src="chatbot.js"></script>
 *
 * The widget renders inside a Shadow DOM, so the host website's CSS
 * can't break it (and the widget's CSS can't affect the website).
 * No API key, no dependencies. Edit the CONFIG object below per client.
 * Dark theme: black background, amber/red accents (colors in the CSS block).
 */
(function () {
  "use strict";
  if (window.__brightSmileChatLoaded) return;          // prevent double-loading
  window.__brightSmileChatLoaded = true;

  /* =====================================================================
     CLINIC CONFIG — the ONLY thing you need to edit for a new client.
     ===================================================================== */
  const CONFIG = {
    clinic: {
      name: "Bright Smile Dental Clinic",
      shortName: "Bright Smile",
      address: "123 Main Street",
      city: "Springfield",                         // ← replace with the client's city
      phone: "+1 (555) 123-4567",                  // reception (also used for WhatsApp below)
      whatsapp: "+1 (555) 123-4567",
      emergencyPhone: "+1 (555) 000-0000",
      email: "hello@brightsmiledental.com"
    },

    hours: {
      openDays: [1, 2, 3, 4, 5, 6],                // 0 = Sunday … 6 = Saturday
      open: "10:00",                               // 24h format
      close: "20:00",
      lastSlot: "19:45",                           // latest appointment start time
      display: "Monday to Saturday, 10:00 AM – 8:00 PM",
      shortDisplay: "Monday to Saturday, 10 AM – 8 PM",
      closedDisplay: "We're closed on Sundays."
    },

    // Used by the chatbot ({price:key}), the "Prices" list and price totals.
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

    /* DOCTORS — days: 0 = Sunday … 6 = Saturday, hours in 24h format.
       "treats" links a doctor to knowledge-base topics, so the bot can
       recommend the right specialist (e.g. braces → the orthodontist).
       All doctors share the same consultation fee (prices.consultation). */
    doctors: [
      { id: "sarah", name: "Dr. Sarah Khan",   specialty: "General Dentist",       days: [1, 3, 5],    from: "10:00", to: "18:00",
        treats: ["consultation", "cleaning", "fillings", "pain"] },
      { id: "ali",   name: "Dr. Ali Ahmed",    specialty: "Root Canal Specialist", days: [2, 4, 6],    from: "12:00", to: "20:00",
        treats: ["rootCanal"] },
      { id: "emily", name: "Dr. Emily Carter", specialty: "Orthodontist",          days: [1, 2, 4],    from: "10:00", to: "16:00",
        treats: ["braces"] },
      { id: "james", name: "Dr. James Wilson", specialty: "Oral Surgeon",          days: [3, 6],       from: "14:00", to: "20:00",
        treats: ["implants", "wisdom"] },
      { id: "maria", name: "Dr. Maria Lopez",  specialty: "Children's Dentist",    days: [1, 3, 5, 6], from: "10:00", to: "15:00",
        treats: ["children"] }
    ],

    // Service names used when a patient asks "what services do you offer?"
    services: ["Checkups & consultations", "Teeth cleaning", "Fillings", "Root canal treatment", "Teeth whitening",
               "Braces & aligners", "Dental implants", "Wisdom tooth removal", "Children's dentistry", "Emergency care"],

    booking: {
      maxDaysAhead: 90,
      timeSlots: ["10:00 AM", "11:30 AM", "1:00 PM", "3:00 PM", "5:00 PM", "6:30 PM"],
      reasons: ["Checkup", "Teeth cleaning", "Filling", "Tooth pain", "Braces / aligners", "Root canal", "Wisdom tooth / implant", "Child's checkup", "Other"]
    },

    bot: {
      name: "Bright Smile Assistant",
      welcome: "Hi there! 👋 Welcome to Bright Smile Dental Clinic. How can I help you today? Feel free to ask about our services, prices or opening hours — or I can book an appointment for you.",
      quickReplies: ["Book Appointment", "Prices", "Timings", "Location"],
      tooltip: "Need help? Chat with us!",
      showTooltipAfterMs: 2500,                    // set to 0 to disable the automatic tooltip
      outOfScope: "Sorry, I can't help with that. Feel free to ask me anything about our dental clinic! 😊",
      fallback: "That's a great question for our team. Please give us a call at {phone} and we'll be happy to help.",

      // Detection word lists (typos & plurals are handled automatically)
      topicWords: ["tooth", "teeth", "dental", "dentist", "gum", "gums", "mouth", "jaw", "filling", "crown", "cavity", "cavities", "extraction", "wisdom", "denture", "veneer", "breath", "bite", "enamel", "smile", "clinic", "treatment", "x-ray", "xray", "appointment", "visit"],
      offTopicWords: ["weather", "politics", "political", "election", "president", "government", "recipe", "recipes", "cook", "cooking", "pizza", "burger", "food", "football", "soccer", "cricket", "movie", "movies", "song", "music", "code", "coding", "python", "javascript", "program", "programming", "bitcoin", "crypto", "stock", "stocks", "news", "joke", "poem", "game", "restaurant", "hotel", "flight", "homework", "math", "buy"],
      urgentWords: ["bleeding", "bleed", "broken", "broke", "knocked out", "knocked", "cracked", "swelling", "swollen", "abscess", "accident", "fever", "unbearable", "excruciating", "severe pain", "severe toothache", "severe ache", "cant sleep", "a lot of pain"],
      fearWords: ["scared", "afraid", "nervous", "anxious", "anxiety", "fear", "terrified", "frightened", "worried", "phobia", "panic"],
      compareWords: ["better", "best", "compare", "comparison", "vs", "versus", "which one", "who should", "recommend", "prefer", "more experienced", "good"],

      // Reply texts used by the conversation logic ({tokens} are filled in automatically)
      replies: {
        rephrase: "Sorry, I didn't quite catch that. Could you rephrase?",
        continueBooking: "Would you like to continue with your booking?",
        continueRequest: "Would you like to continue with your request?",
        stopped: "No problem, I've stopped the {what}. Is there anything else I can help with?",
        notBooked: "No problem, I haven't booked anything. Is there anything else I can help with?",
        editWhich: "Of course — what would you like to change?",
        thanksMidFlow: "You're very welcome! 😊",
        yesIdle: "Great! How can I help you today?",
        noIdle: "No problem! Feel free to ask if you need anything. 😊",
        multiIntro: "Of course! Let's book them one at a time — first, your appointment. ",
        multiNext: "Now let's book the appointment for {who}.",
        myBookings: "Here's what you've booked:",
        myBookingsNote: "Our team will call you to confirm.",
        noBooking: "I don't see a booking in this chat yet. Would you like to make one?",

        urgent: "I'm so sorry — that sounds really painful 😟. Please call our emergency line right away at {emergency} so our team can help you straight away.",
        urgentNoMedicine: "I'm not able to recommend any medication, but our dentist can advise you safely.",
        urgentOffer: "I can also book the earliest available appointment for you.",
        fearNumb: "It's completely normal to feel nervous — you're not alone! Modern {treatment} is done with local anesthesia, so it's usually very comfortable, and our dentists will explain every step and go at your pace. 😊",
        fearGentle: "It's completely normal to feel nervous — you're not alone! Modern {treatment} is gentle and usually very comfortable, and our dentists will explain every step and go at your pace. 😊",
        fearGeneral: "It's completely normal to feel nervous — you're not alone! Our dentists are gentle and patient, they'll explain every step, and local anesthesia is used whenever it's needed so you stay comfortable. 😊",
        compareDoctors: "All our dentists are highly experienced in their specialties: {doctorsShort}. You're in great hands with any of them!",
        doctorFees: "All our doctors charge the same consultation fee — {price:consultation} — so you can simply choose whoever suits your needs and schedule.",
        durationOther: "Treatment time depends on your case, so your dentist will confirm it at your checkup. For reference, a routine checkup takes about 30 minutes.",
        openOn: "Yes, we're open on <b>{date}</b> from {openShort} to {closeShort}. Would you like to book an appointment?",
        closedOn: "Sorry, we're closed on Sundays. We're open {hoursShort}.",

        availableOn: "On <b>{date}</b>, these doctors are available:",
        noDoctors: "Sorry, no doctors are available on <b>{date}</b>. Which other day works for you?",
        doctorYes: "Yes! {doctor} is available on <b>{date}</b>, from {range}. Would you like to book?",
        doctorNo: "{doctor} isn't available on {weekday}. {short}'s next available day is <b>{next}</b> ({range}).",
        doctorGeneral: "{doctor} ({specialty}) is available {days}, {range}. The next opening is <b>{next}</b>.",
        doctorUnavailable: "{doctor} isn't available on {weekday}. {short}'s next available day is <b>{next}</b> ({range}) — or, on <b>{date}</b>, these doctors are available:",
        specialist: "For {service}, you'll see <b>{doctor}</b>, our {specialty}. {short} is available {days}, {range} — the next opening is <b>{next}</b>. Would you like to book?",
        recommend: "For this visit, I'd recommend <b>{doctor}</b>, our {specialty} — good news, {short} is available on {weekday} ({range}).",
        recommendOther: "For this visit, I'd recommend <b>{doctor}</b>, our {specialty}, who is available {days}.",
        doctorInvalid: "Please choose one of the doctors above, or tap “Any doctor” and I'll pick the best match.",
        timeDoctor: "{doctor} works {range} on {weekday}. Please choose a time in that range.",
        doctorTimeClash: "{doctor} is available on {date}, but works {range}, so {time} won't work. Please choose a time within those hours.",

        nameInvalid: "Could you please share your <b>full name</b> (letters only)? You can also type “cancel” to stop.",
        phoneInvalid: "Hmm, that doesn't look like a valid phone number. Could you enter it with digits, like <b>+1 555 123 4567</b>?",
        reasonInvalid: "Could you tell me briefly what the visit is for?",
        confirmInvalid: "Just reply <b>Yes</b> to confirm, or <b>Edit</b> if anything needs changing.",
        dateImpossible: "That date doesn't exist. Could you pick another one?",
        datePast: "That date has already passed. Please choose an upcoming date.",
        dateSunday: "Sorry, we're closed on Sundays. We're open {hoursShort}. Which other day works for you?",
        dateClosed: "Sorry, we're closed on that day. We're open {hoursShort}. Which other day works for you?",
        dateFar: "We take bookings up to 3 months ahead. Could you choose an earlier date?",
        dateTodayLate: "We're fully booked for the rest of today. Which other day works for you?",
        dateUnclear: "Sorry, I didn't quite catch that date. Could you try something like “tomorrow”, “next Monday” or “Oct 12”?",
        timeRange: "Our hours are {openShort} to {closeShort}. Please choose a time in that range.",
        timeLate: "Our last appointment starts at {lastShort}. Please choose a time between {openShort} and {lastShort}.",
        timePast: "That time has already passed today. Could you choose a later time?",
        timeUnclear: "Sorry, I didn't quite catch the time. Could you enter something like <b>11:00 AM</b> or <b>5:30 PM</b>?",
        timeAlso: "Also, {time} is outside our hours ({openShort} – {closeShort}), so we'll choose a time next."
      }
    },

    /* ---------------------------------------------------------------
       KNOWLEDGE BASE / INTENTS
       strong = 3 points, weak = 1 point. Typos & plurals are handled
       automatically. Order matters only to break ties (earlier wins).
       Answer tokens: {phone} {whatsapp} {email} {emergency} {address}
       {mapsLink} {hours} {closed} {open} {close} {doctors}
       {price:key} {specialist:topic}
       --------------------------------------------------------------- */
    faq: [
      { id: "reschedule", action: "reschedule",
        strong: ["reschedule", "cancel", "cancellation", "postpone", "change appointment", "move appointment", "change booking", "different date", "another date", "another time"],
        weak: [] },

      { id: "book", action: "book",
        strong: ["book", "booking", "reserve", "make appointment", "get appointment", "schedule"],
        weak: ["appointment", "slot", "visit", "available", "availability", "come in"] },

      { id: "safety",
        strong: ["pregnant", "pregnancy", "breastfeeding", "x ray", "xray", "radiation", "allergic", "allergy", "diabetes", "diabetic", "heart condition", "blood thinner", "side effect"],
        weak: ["safe", "risk"],
        answer: "That's a really important question — your dentist is the best person to advise you, based on your situation. Please call us at {phone} before your visit, and our team will make sure you're well looked after.",
        chips: ["Book Appointment"] },

      { id: "medical",
        strong: ["medicine", "medication", "painkiller", "antibiotic", "antibiotics", "ibuprofen", "paracetamol", "tylenol", "advil", "prescribe", "prescription", "pill", "tablet", "diagnose", "diagnosis"],
        weak: [],
        answer: "I'm sorry you're dealing with this. I'm not able to recommend medication — only a dentist can advise on that safely. If it's urgent, please call our emergency line at {emergency}, or I can book the earliest available appointment for you.",
        chips: ["Book earliest appointment", "Location"] },

      { id: "pain",
        strong: ["pain", "painful", "toothache", "ache", "hurt", "hurting", "sore", "sensitive"],
        weak: ["bad", "terrible"],
        answer: "I'm so sorry you're in pain 😟. If it's severe, please call our emergency line at {emergency} right away. I can also book the earliest available appointment for you.",
        chips: ["Book earliest appointment", "Location"] },

      { id: "emergency",
        strong: ["emergency", "urgent", "urgently"],
        weak: ["immediately"],
        answer: "Yes, of course — we see dental emergencies. Please call our emergency line at {emergency} and our team will take care of you right away.",
        chips: ["Book earliest appointment", "Location"] },

      { id: "late",
        strong: ["late", "running late", "delayed", "delay", "arrive late", "miss my appointment"],
        weak: [],
        answer: "No worries — if you're running late, please give us a call at {phone} and our team will let you know the best option.",
        chips: ["Location", "Parking"] },

      { id: "language",
        strong: ["spanish", "espanol", "french", "arabic", "urdu", "hindi", "german", "chinese", "mandarin", "portuguese", "italian", "russian", "language", "other language"],
        weak: ["speak"],
        answer: "Sorry, I can only chat in English right now, but our team can help you at {phone}." },

      { id: "duration",
        strong: ["how long", "duration", "how much time", "how many minutes"],
        weak: ["take", "last", "long", "minute"],
        answer: "A routine checkup takes about 30 minutes.",
        chips: ["Book Appointment", "Prices"] },

      { id: "consultation",
        strong: ["consultation", "consult", "checkup", "check up", "examination", "exam", "first visit"],
        weak: ["fee"],
        answer: "A consultation and checkup is {price:consultation}. Would you like me to book one for you?",
        chips: ["Book Appointment", "Prices", "Insurance"] },

      { id: "cleaning",
        strong: ["cleaning", "clean", "scaling", "polishing", "polish", "hygiene", "plaque", "tartar", "deep clean"],
        weak: [],
        answer: "A professional teeth cleaning is {price:cleaning}. Would you like to book one?",
        chips: ["Book Appointment", "Whitening", "Prices"] },

      { id: "fillings",
        strong: ["filling", "fillings", "cavity", "cavities", "cavity filling"],
        weak: [],
        answer: "Yes, we do fillings — they're {price:filling} each, done by {specialist:fillings}.",
        chips: ["Book Appointment", "Prices"] },

      { id: "rootCanal",
        strong: ["root canal", "rct", "endodontic", "nerve treatment"],
        weak: ["canal", "root", "nerve"],
        answer: "A root canal usually costs {price:rootCanal}, depending on the tooth, and it's done by {specialist:rootCanal}. We'll confirm the exact cost after a checkup.",
        chips: ["Book Appointment", "Payment options"] },

      { id: "wisdom",
        strong: ["wisdom tooth", "wisdom teeth", "wisdom", "extraction", "extract", "tooth removal", "teeth removal", "pull tooth", "pulled"],
        weak: ["removal", "remove"],
        answer: "Yes, we do! Wisdom tooth removal is {price:wisdom}, and it's performed by {specialist:wisdom}.",
        chips: ["Book Appointment", "Payment options"] },

      { id: "whitening",
        strong: ["whitening", "whiten", "bleach", "bleaching", "white teeth", "yellow teeth", "stain", "stained"],
        weak: ["white", "bright", "brighter", "yellow"],
        answer: "Yes, we do! Professional teeth whitening is {price:whitening}.",
        chips: ["Book Appointment", "Prices"] },

      { id: "braces",
        strong: ["braces", "brace", "aligner", "invisalign", "orthodontic", "orthodontics", "orthodontist", "straighten", "crooked", "retainer"],
        weak: ["straight"],
        answer: "Yes, we offer metal braces, ceramic braces and clear aligners with {specialist:braces}. Since every smile is different, we'll give you an exact price after a consultation.",
        chips: ["Book Appointment", "Payment options"] },

      { id: "implants",
        strong: ["implant", "missing tooth", "missing teeth", "replace tooth", "tooth replacement", "lost tooth"],
        weak: ["missing", "replace", "replacement"],
        answer: "Yes, we offer dental implants, starting from {price:implant} per implant, with {specialist:implants}.",
        chips: ["Book Appointment", "Payment options"] },

      { id: "children",
        strong: ["child", "children", "kid", "kids", "pediatric", "paediatric", "toddler", "son", "daughter", "baby", "year old", "years old", "yr old"],
        weak: ["age", "young", "family"],
        answer: "Absolutely! We happily treat children aged 3 and above with {specialist:children}.",
        chips: ["Book Appointment", "Doctors"] },

      { id: "insurance",
        strong: ["insurance", "insured", "insurer", "coverage"],
        weak: ["cover", "covered", "claim", "policy"],
        answer: "Yes, we accept most major dental insurance plans. Just remember to bring your insurance card to your visit.",
        chips: ["Payment options", "Book Appointment"] },

      { id: "payment",
        strong: ["payment", "pay", "cash", "card", "credit", "debit", "installment", "instalment", "emi", "financing", "finance", "visa", "mastercard"],
        weak: ["method", "plan"],
        answer: "We accept cash and credit/debit cards, and we also offer installment plans for larger treatments.",
        chips: ["Insurance", "Prices"] },

      { id: "discount",
        strong: ["discount", "discounts", "offers", "special offer", "deal", "deals", "promo", "promotion", "coupon", "voucher", "sale"],
        weak: ["cheaper"],
        answer: "For current offers or discounts, please call us at {phone}.",
        chips: ["Prices", "Book Appointment"] },

      { id: "doctors",                              // doctor names from CONFIG.doctors are added automatically
        strong: ["doctor", "dentist", "dr", "specialist", "surgeon", "who are"],
        weak: ["experience", "experienced", "qualified", "team", "staff"],
        answer: "Our team: {doctors}. You'll be in very good hands!",
        chips: ["Book Appointment", "Services"] },

      { id: "weekends",
        strong: ["weekend", "saturday", "sunday"],
        weak: [],
        answer: "We're open on Saturdays from {open} to {close}, and closed on Sundays.",
        chips: ["Book Appointment", "Location"] },

      { id: "timings",
        strong: ["timing", "hours", "opening hours", "working hours", "business hours", "what time"],
        weak: ["open", "close", "closing", "time", "when"],
        answer: "We're open {hours}. {closed}",
        chips: ["Book Appointment", "Location"] },

      { id: "parking",
        strong: ["parking", "park", "car park", "garage"],
        weak: ["car", "drive", "driving", "vehicle"],
        answer: "Yes — there's free parking right in front of the clinic.",
        chips: ["Location", "Timings"] },

      { id: "location",
        strong: ["location", "located", "address", "direction", "map", "google maps", "where are you", "how to reach", "how do i get", "find you"],
        weak: ["where", "near", "area", "city", "street"],
        answer: "You'll find us at <b>{address}</b>.<br>{mapsLink}",
        chips: ["Timings", "Parking", "Book Appointment"] },

      { id: "email",
        strong: ["email", "e mail", "mail", "email address"],
        weak: [],
        answer: "You can email us at {email}.",
        chips: ["Book Appointment"] },

      { id: "human",
        strong: ["real person", "human", "receptionist", "talk to someone", "speak to someone", "talk to person", "agent", "whatsapp", "phone number", "contact number", "call you", "representative"],
        weak: ["talk", "call", "contact", "phone", "number"],
        answer: "You can call our team at {phone}, or message us on WhatsApp at {whatsapp}.",
        chips: ["Timings", "Book Appointment"] },

      { id: "prices", action: "prices",
        strong: ["price list", "prices", "rates", "charges"],
        weak: ["price", "cost", "how much", "charge", "rate", "expensive", "cheap", "afford"] },

      { id: "services", action: "services",
        strong: ["services", "treatments", "what do you offer", "what do you do"],
        weak: ["offer", "treatment", "provide"] },

      { id: "greeting",
        strong: ["hi", "hello", "hey", "hiya", "good morning", "good afternoon", "good evening", "salam", "assalam"],
        weak: [],
        answer: "Hello! 😊 How can I help you today?" },

      { id: "thanks",
        strong: ["thank", "thanks", "thx", "appreciate", "great", "perfect", "awesome"],
        weak: [],
        answer: "You're very welcome! Take care, and we look forward to seeing you soon. 😊" },

      { id: "bye",
        strong: ["bye", "goodbye", "see you", "good night"],
        weak: [],
        answer: "Thank you for chatting with us — take care and have a lovely day! 😊" }
    ]
  };

  /* =====================================================================
     STYLES (scoped inside the Shadow DOM)
     ===================================================================== */
  const CSS = `
  :host{all:initial}
  .bs-root{
    --amber:#FFB800; --red:#FF4D2E; --mint:#3CCFB4;
    --grad:linear-gradient(135deg,#FFB800 0%,#FF4D2E 100%);
    --bg:#0D0D0F; --bubble:#1E1E24; --field:#1A1A1F; --bar:#121216;
    --text:#F5F0E8; --muted:#A39D94; --line:rgba(255,255,255,.08);
    --amber-line:rgba(255,184,0,.32); --amber-soft:rgba(255,184,0,.12);
    --bubble-shadow:0 4px 14px -6px rgba(0,0,0,.6);
    --win-shadow:0 30px 70px -18px rgba(0,0,0,.8),0 0 0 1px rgba(255,184,0,.12),0 0 40px -10px rgba(255,120,0,.18);
    color-scheme:dark;
    font-family:Outfit,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
    font-weight:300;color:var(--text);line-height:1.5;-webkit-font-smoothing:antialiased;font-size:16px;text-align:left;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  svg{display:block}
  button,input{font-family:inherit}
  b,strong{font-weight:500}

  /* ---------- Floating button + tooltip ---------- */
  .chat-launcher{position:fixed;right:24px;bottom:24px;width:62px;height:62px;border-radius:50%;border:0;cursor:pointer;z-index:2147483001;color:#0D0D0F;
    background:var(--grad);display:grid;place-items:center;transition:transform .25s,opacity .25s;
    animation:bsPulse 2.8s ease-out infinite}
  .chat-launcher:hover{transform:scale(1.06)}
  .open .chat-launcher{animation:none;box-shadow:0 10px 26px -8px rgba(255,77,46,.6),0 0 22px rgba(255,160,0,.35)}
  @keyframes bsPulse{
    0%{box-shadow:0 10px 26px -8px rgba(255,77,46,.6),0 0 22px rgba(255,160,0,.4),0 0 0 0 rgba(255,184,0,.5)}
    70%{box-shadow:0 10px 26px -8px rgba(255,77,46,.6),0 0 22px rgba(255,160,0,.4),0 0 0 16px rgba(255,184,0,0)}
    100%{box-shadow:0 10px 26px -8px rgba(255,77,46,.6),0 0 22px rgba(255,160,0,.4),0 0 0 0 rgba(255,184,0,0)}
  }
  .chat-launcher .ico{position:absolute;display:grid;place-items:center;transition:transform .3s,opacity .3s}
  .chat-launcher .i-close{opacity:0;transform:rotate(-90deg) scale(.6)}
  .open .chat-launcher .i-chat{opacity:0;transform:rotate(90deg) scale(.6)}
  .open .chat-launcher .i-close{opacity:1;transform:none}
  .unread{position:absolute;top:-2px;right:-2px;min-width:22px;height:22px;border-radius:11px;background:var(--mint);color:#062B25;font-size:12px;font-weight:500;display:none;place-items:center;padding:0 6px;border:2px solid #0D0D0F;line-height:1}
  .unread.show{display:grid}

  .chat-tooltip{position:fixed;right:98px;bottom:37px;z-index:2147483000;background:var(--bubble);color:var(--text);font-size:14px;font-weight:500;
    padding:10px 16px;border-radius:14px;border:1px solid var(--amber-line);box-shadow:0 12px 28px -10px rgba(0,0,0,.7);white-space:nowrap;cursor:pointer;
    opacity:0;transform:translateX(8px);pointer-events:none;transition:opacity .25s,transform .25s}
  .chat-tooltip::after{content:"";position:absolute;right:-6px;top:50%;width:10px;height:10px;background:var(--bubble);border-top:1px solid var(--amber-line);border-right:1px solid var(--amber-line);transform:translateY(-50%) rotate(45deg);border-radius:0 2px 0 0}
  .chat-tooltip.show{opacity:1;transform:none;pointer-events:auto}
  .open .chat-tooltip{opacity:0;pointer-events:none}

  /* ---------- Window (black with soft amber/crimson glows + dotted grid) ---------- */
  .chat-window{position:fixed;right:24px;bottom:100px;z-index:2147483000;width:384px;height:min(640px,calc(100vh - 128px));border-radius:26px;box-shadow:var(--win-shadow);
    background:
      radial-gradient(260px 220px at 8% 22%,rgba(255,184,0,.10),transparent 70%),
      radial-gradient(280px 240px at 96% 62%,rgba(220,20,60,.10),transparent 70%),
      radial-gradient(200px 180px at 30% 95%,rgba(255,120,0,.06),transparent 70%),
      radial-gradient(rgba(255,255,255,.055) 1px,transparent 1.3px) 0 0/18px 18px,
      var(--bg);
    display:flex;flex-direction:column;overflow:hidden;
    transform-origin:bottom right;transform:translateY(16px) scale(.92);opacity:0;visibility:hidden;pointer-events:none;
    transition:transform .34s cubic-bezier(.2,.9,.3,1.1),opacity .22s ease,visibility 0s linear .34s}
  .open .chat-window{transform:none;opacity:1;visibility:visible;pointer-events:auto;transition:transform .34s cubic-bezier(.2,.9,.3,1.1),opacity .22s ease,visibility 0s}

  /* Dark glassy header with a thin gold line — messages scroll softly underneath it */
  .chat-head{position:absolute;top:0;left:0;right:0;z-index:2;color:var(--text);padding:14px 14px 14px 16px;display:flex;align-items:center;gap:12px;
    background:rgba(13,13,15,.68);
    backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);
    border-bottom:1px solid var(--amber);box-shadow:0 8px 24px -14px rgba(255,184,0,.35)}
  .bot-avatar{width:42px;height:42px;border-radius:50%;background:var(--amber-soft);border:1px solid var(--amber-line);color:var(--amber);display:grid;place-items:center;flex-shrink:0}
  .chat-head .who{flex:1;min-width:0;line-height:1.3}
  .chat-head .who .name{display:block;font-size:16px;font-weight:500;letter-spacing:.1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .status{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500;color:var(--mint)}
  .status i{width:8px;height:8px;border-radius:50%;background:var(--mint);box-shadow:0 0 0 3px rgba(60,207,180,.2),0 0 8px rgba(60,207,180,.8)}
  .head-btn{width:34px;height:34px;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--text);cursor:pointer;display:grid;place-items:center;transition:background .2s,color .2s,border-color .2s}
  .head-btn:hover{background:var(--amber-soft);border-color:var(--amber-line);color:var(--amber)}

  /* ---------- Messages ---------- */
  .chat-body{flex:1;overflow-y:auto;padding:88px 14px 8px;background:transparent;scroll-behavior:smooth}
  .chat-body::-webkit-scrollbar{width:6px}
  .chat-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:3px}
  .day-sep{text-align:center;font-size:11.5px;color:var(--muted);margin:4px 0 14px}
  .msg{display:flex;gap:8px;margin-bottom:14px;animation:bsIn .38s cubic-bezier(.2,.8,.2,1) both}
  @keyframes bsIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
  .msg .mini-av{width:28px;height:28px;border-radius:50%;background:var(--amber-soft);border:1px solid var(--amber-line);color:var(--amber);display:grid;place-items:center;flex-shrink:0;align-self:flex-end;margin-bottom:19px}
  .msg .col{display:flex;flex-direction:column;max-width:80%;min-width:0}
  .msg.user{justify-content:flex-end}
  .msg.user .col{align-items:flex-end}
  .bubble{padding:10px 14px;font-size:14.5px;line-height:1.5;font-weight:300;overflow-wrap:anywhere}
  .msg.bot .bubble{background:var(--bubble);color:var(--text);border:1px solid var(--amber-line);border-radius:18px 18px 18px 4px;box-shadow:var(--bubble-shadow)}
  .msg.user .bubble{background:var(--grad);color:#0D0D0F;font-weight:400;border-radius:18px 18px 4px 18px;box-shadow:0 6px 18px -8px rgba(255,77,46,.6)}
  .bubble a{color:var(--amber);font-weight:500;text-decoration:underline;text-decoration-color:rgba(255,184,0,.4);text-underline-offset:2px}
  .msg.user .bubble a{color:#0D0D0F}
  .msg time{font-size:11px;color:var(--muted);margin-top:5px;padding:0 4px}
  .bubble a.map-btn{display:inline-flex;align-items:center;gap:6px;margin-top:8px;background:var(--amber-soft);border:1px solid var(--amber-line);padding:7px 12px;border-radius:12px;text-decoration:none;font-size:13.5px}
  .bubble a.map-btn:hover{background:rgba(255,184,0,.2)}

  .typing .bubble{display:flex;gap:5px;align-items:center;padding:14px 16px}
  .typing .bubble span{width:7px;height:7px;border-radius:50%;background:var(--amber);animation:bsDot 1.2s infinite ease-in-out}
  .typing .bubble span:nth-child(2){animation-delay:.15s}
  .typing .bubble span:nth-child(3){animation-delay:.3s}
  @keyframes bsDot{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-5px);opacity:1}}

  .price-list{margin-top:4px;min-width:220px}
  .price-list .pl-row{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px dashed rgba(255,255,255,.1);font-size:13.5px}
  .price-list .pl-row:last-child{border-bottom:0}
  .price-list .pl-row span:last-child{font-weight:500;color:var(--amber);text-align:right}
  .pl-note{font-size:12.5px;color:var(--muted);margin-top:6px}

  .summary{border:1px solid var(--line);border-radius:14px;overflow:hidden;margin:2px 0 10px;min-width:230px;background:rgba(0,0,0,.18)}
  .summary-head{background:var(--amber-soft);color:var(--amber);font-weight:500;font-size:13px;padding:8px 12px;display:flex;align-items:center;gap:6px}
  .summary-row{display:grid;grid-template-columns:78px 1fr;gap:8px;padding:7px 12px;font-size:13.5px;border-top:1px solid var(--line)}
  .summary-row span:first-child{color:var(--muted)}
  .summary-row span:last-child{font-weight:500;overflow-wrap:anywhere}

  /* ---------- Quick replies ---------- */
  .chips{display:flex;flex-wrap:wrap;gap:8px;padding:10px 14px 4px;background:transparent}
  .chips:empty{display:none}
  .chip{border:1px solid var(--amber);background:transparent;color:var(--amber);font-weight:500;font-size:13.5px;line-height:1;padding:9px 15px;border-radius:999px;cursor:pointer;
    transition:background .2s,border-color .2s,color .2s,transform .15s,box-shadow .2s;animation:bsIn .35s ease both}
  .chip:hover{background:var(--amber);color:#0D0D0F;box-shadow:0 0 16px -4px rgba(255,184,0,.6)}
  .chip:active{transform:scale(.96)}
  .chip:focus-visible,.send-btn:focus-visible,.head-btn:focus-visible,.chat-launcher:focus-visible{outline:2px solid var(--amber);outline-offset:2px}

  /* ---------- Input ---------- */
  .chat-input{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--line);background:rgba(18,18,22,.92);flex-shrink:0}
  .chat-input input{flex:1;min-width:0;border:1px solid var(--line);border-radius:999px;padding:12px 16px;font-size:15px;font-weight:300;color:var(--text);outline:none;caret-color:var(--amber);
    transition:border-color .2s,box-shadow .2s;background:var(--field);height:auto;width:auto;box-shadow:none}
  .chat-input input::placeholder{color:#8A857E}
  .chat-input input:focus{border-color:var(--amber);box-shadow:0 0 0 4px rgba(255,184,0,.14)}
  .send-btn{width:46px;height:46px;border-radius:50%;border:0;background:var(--grad);color:#0D0D0F;cursor:pointer;display:grid;place-items:center;flex-shrink:0;
    transition:transform .15s,box-shadow .2s,filter .2s;box-shadow:0 8px 18px -8px rgba(255,77,46,.8)}
  .send-btn:hover{filter:brightness(1.08);box-shadow:0 0 18px rgba(255,160,0,.45)}
  .send-btn:active{transform:scale(.93)}
  .chat-foot{text-align:center;font-size:11px;color:var(--muted);padding:0 0 10px;background:rgba(18,18,22,.92)}

  /* ---------- Doctor cards ---------- */
  .doc-list{display:flex;flex-direction:column;gap:8px;margin:10px 0 2px}
  .doc-card{display:flex;flex-direction:column;gap:2px;width:100%;text-align:left;background:rgba(0,0,0,.22);border:1px solid var(--amber-line);border-radius:14px;padding:9px 12px;
    color:var(--text);font-family:inherit;font-weight:300;cursor:pointer;transition:background .2s,border-color .2s,transform .15s}
  .doc-card:hover{background:var(--amber-soft);border-color:var(--amber)}
  .doc-card:active{transform:scale(.98)}
  .doc-card:focus-visible{outline:2px solid var(--amber);outline-offset:2px}
  .doc-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
  .doc-name{font-weight:500;font-size:14px}
  .doc-tag{font-size:10.5px;font-weight:500;color:#0D0D0F;background:var(--grad);padding:2px 8px;border-radius:999px;white-space:nowrap}
  .doc-spec{font-size:12.5px;color:var(--muted)}
  .doc-hours{font-size:12.5px;color:var(--amber)}

  @media (max-width:560px){
    .chat-window{right:0;bottom:0;width:100%;height:100%;height:100dvh;border-radius:0}
    .open .chat-launcher{opacity:0;pointer-events:none}
    .chat-launcher{right:16px;bottom:16px}
    .chat-tooltip{right:88px;bottom:29px}
  }
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
  `;

  /* =====================================================================
     ICONS
     ===================================================================== */
  const ICONS = {
    tooth: '<path d="M12 5.5C10.3 4.3 8.9 3.5 7.2 3.5 4.8 3.5 3 5.5 3 8c0 2.4 1 3.9 1.6 6 .6 2.3.8 4.6 1.6 6.3.5 1 1.8.9 2.1-.2l1.1-4.2c.6-1.4 4.6-1.4 5.2 0l1.1 4.2c.3 1.1 1.6 1.2 2.1.2.8-1.7 1-4 1.6-6.3.6-2.1 1.6-3.6 1.6-6 0-2.5-1.8-4.5-4.2-4.5-1.7 0-3.1.8-4.8 2z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    chatFill: '<path fill="currentColor" stroke="none" d="M12 3a9 9 0 0 0-7.9 13.3L3 21l4.8-1.1A9 9 0 1 0 12 3z"/><circle cx="8" cy="12" r="1.2" fill="#FFB800" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="#FFB800" stroke="none"/><circle cx="16" cy="12" r="1.2" fill="#FFB800" stroke="none"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/>'
  };
  const icon = (name, size = 20) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  /* =====================================================================
     HELPERS
     ===================================================================== */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const telHref = (p) => "tel:" + p.replace(/[^\d+]/g, "");
  const fullAddress = () => `${CONFIG.clinic.address}, ${CONFIG.clinic.city}`;
  const mapsUrl = () => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${CONFIG.clinic.name}, ${fullAddress()}`);
  const hmToMin = (hm) => { const [h, m] = hm.split(":").map(Number); return h * 60 + m; };
  const minToLabel = (min) => { const h = Math.floor(min / 60), m = min % 60; const h12 = ((h + 11) % 12) + 1; return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
  const minToShort = (min) => minToLabel(min).replace(":00", "");                 // "10 AM", "7:30 PM"
  const timeLabel = (min) => minToLabel(min) + (min === 720 ? " (noon)" : "");
  const OPEN_MIN = hmToMin(CONFIG.hours.open), CLOSE_MIN = hmToMin(CONFIG.hours.close), LAST_MIN = hmToMin(CONFIG.hours.lastSlot);
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };          // the device's real current date
  const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const fmtDate = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const fmtShort = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const relDate = (d) => (sameDay(d, today()) ? "today, " : sameDay(d, addDays(today(), 1)) ? "tomorrow, " : "") + fmtDate(d);
  const weekdayPlural = (d) => d.toLocaleDateString("en-US", { weekday: "long" }) + "s";
  const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const fromISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const clockNow = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const isOpenDay = (d) => CONFIG.hours.openDays.includes(d.getDay());
  const joinAnd = (list) => (list.length <= 1 ? list[0] || "" : list.slice(0, -1).join(", ") + " and " + list[list.length - 1]);
  const titleCase = (s) => s.toLowerCase().replace(/(^|[\s'-])([a-zà-ɏ])/g, (m, p, c) => p + c.toUpperCase());
  const firstName = (name) => name.split(" ")[0];
  const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Doctors with pre-computed working minutes ("lastMin" = latest appointment start)
  const DOCTORS = CONFIG.doctors.map((d) => {
    const parts = d.name.replace(/^dr\.?\s*/i, "").split(/\s+/);
    const fromMin = hmToMin(d.from), toMin = hmToMin(d.to);
    return { ...d, first: parts[0].toLowerCase(), last: parts[parts.length - 1].toLowerCase(), short: "Dr. " + parts[0],
      fromMin, toMin, lastMin: Math.min(toMin - 15, LAST_MIN) };
  });
  const rangeText = (doc) => `${minToShort(doc.fromMin)} – ${minToShort(doc.toMin)}`;
  const daysText = (doc) => joinAnd(doc.days.map((i) => DAY_SHORT[i]));
  const worksOn = (doc, date) => doc.days.includes(date.getDay());
  const doctorsText = () => joinAnd(DOCTORS.map((d) => `<b>${d.name}</b> (${d.specialty})`));
  const doctorsShortText = () => joinAnd(DOCTORS.map((d) => `${d.name} (${d.specialty})`));
  const specialistText = (topic) => { const d = DOCTORS.find((x) => x.treats.includes(topic)); return d ? `<b>${d.name}</b>, our ${d.specialty}` : "our dentists"; };

  // Replaces {tokens} in config texts with live values / links.
  function fill(text, extra = {}) {
    const c = CONFIG.clinic;
    const tokens = {
      phone: `<a href="${telHref(c.phone)}">${c.phone}</a>`,
      whatsapp: `<a href="https://wa.me/${c.whatsapp.replace(/\D/g, "")}" target="_blank" rel="noopener">${c.whatsapp}</a>`,
      email: `<a href="mailto:${c.email}">${c.email}</a>`,
      emergency: `<a href="${telHref(c.emergencyPhone)}">${c.emergencyPhone}</a>`,
      address: esc(fullAddress()),
      mapsLink: `<a class="map-btn" href="${mapsUrl()}" target="_blank" rel="noopener">📍 View on Google Maps</a>`,
      hours: CONFIG.hours.display,
      hoursShort: CONFIG.hours.shortDisplay,
      closed: CONFIG.hours.closedDisplay,
      open: minToLabel(OPEN_MIN),
      close: minToLabel(CLOSE_MIN),
      openShort: minToShort(OPEN_MIN),
      closeShort: minToShort(CLOSE_MIN),
      lastShort: minToShort(LAST_MIN),
      doctors: doctorsText(),
      doctorsShort: doctorsShortText(),
      ...extra
    };
    return text.replace(/\{(\w+)(?::(\w+))?\}/g, (m, key, arg) =>
      key === "price" ? (CONFIG.prices[arg] ? CONFIG.prices[arg].value : m)
        : key === "specialist" ? specialistText(arg)
        : (tokens[key] ?? m));
  }
  const R = CONFIG.bot.replies;

  /* =====================================================================
     TEXT ANALYSIS — normalisation, fuzzy matching, intent scoring
     ===================================================================== */
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/['’`]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const stem = (w) => (w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w);
  const tokenize = (s) => norm(s).split(" ").filter(Boolean).map(stem);

  // Optimal-string-alignment distance (handles swapped letters like "tiemngs")
  function editDistance(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
    return d[a.length][b.length];
  }

  function wordMatch(tok, kw) {
    if (tok === kw) return true;
    if (kw.length >= 4 && tok.startsWith(kw) && tok.length - kw.length <= 4) return true;   // "whiten" → "whitening"
    const max = kw.length >= 9 ? 2 : kw.length >= 6 ? 1 : 0;                              // short words must be exact
    return max > 0 && Math.abs(tok.length - kw.length) <= max && editDistance(tok, kw) <= max;
  }

  // Multi-word keywords match in order, allowing up to 2 filler words between ("change MY appointment")
  function phraseMatch(tokens, words) {
    for (let i = 0; i < tokens.length; i++) {
      if (!wordMatch(tokens[i], words[0])) continue;
      let j = 1, pos = i + 1, gap = 0;
      while (j < words.length && pos < tokens.length && gap <= 2) {
        if (wordMatch(tokens[pos], words[j])) { j++; gap = 0; } else gap++;
        pos++;
      }
      if (j === words.length) return true;
    }
    return false;
  }

  // Doctor names act as keywords for the "doctors" intent ("Is Dr. Sarah available?")
  const doctorFaq = CONFIG.faq.find((f) => f.id === "doctors");
  if (doctorFaq) DOCTORS.forEach((d) => doctorFaq.strong.push(d.first, d.last));

  const INTENTS = CONFIG.faq.map((f) => ({
    ...f,
    kws: [...(f.strong || []).map((k) => ({ w: tokenize(k), pts: 3 })), ...(f.weak || []).map((k) => ({ w: tokenize(k), pts: 1 }))]
  }));
  const intentById = Object.fromEntries(INTENTS.map((i) => [i.id, i]));
  const kwList = (arr) => arr.map(tokenize).filter((w) => w.length);
  const hasAny = (tokens, list) => list.some((w) => (w.length > 1 ? phraseMatch(tokens, w) : tokens.some((t) => wordMatch(t, w[0]))));
  const TOPIC = kwList(CONFIG.bot.topicWords);
  const OFFTOPIC = new Set(CONFIG.bot.offTopicWords.map(stem));
  const URGENT = kwList(CONFIG.bot.urgentWords);
  const FEAR = kwList(CONFIG.bot.fearWords);
  const COMPARE = kwList(CONFIG.bot.compareWords);

  function scoreIntent(tokens, intent) {
    let score = 0;
    const perToken = new Map();                    // each word contributes once per intent
    for (const k of intent.kws) {
      if (k.w.length > 1) { if (phraseMatch(tokens, k.w)) score += k.pts; continue; }
      tokens.forEach((t, i) => { if (wordMatch(t, k.w[0])) perToken.set(i, Math.max(perToken.get(i) || 0, k.pts)); });
    }
    perToken.forEach((v) => (score += v));
    return score;
  }

  const Q_START = /^(what|whats|how|hows|when|where|wheres|who|whos|which|why|is|are|do|does|did|can|could|will|would|should|may|have|has)\b/;
  const INJECTION_RE = /\b(ignore|disregard|forget|override|bypass)\b[^.?!]{0,40}\b(instructions?|rules|prompts?|guidelines|directions|programming|system)\b|\bsystem prompt\b|\byou are now\b|\bpretend (to be|you are|you're)\b|\bact as (a|an)\b|\bjailbreak\b|\bdeveloper mode\b|\bnew instructions\b/i;
  const KEYBOARD_RE = /(qwer|wert|erty|rtyu|tyui|yuio|uiop|asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|vbnm)/;
  const isGibberishWord = (w) => /^[a-z]{3,}$/.test(w) &&
    (!/[aeiouy]/.test(w) || /[^aeiouy]{5,}/.test(w) || KEYBOARD_RE.test(w) || /(.)\1\1/.test(w));
  function isGibberish(n) {
    const words = n.split(" ").filter((w) => /^[a-z]+$/.test(w));
    return words.length > 0 && words.filter(isGibberishWord).length >= Math.ceil(words.length / 2);
  }

  // Which treatment a fear/duration question is about (numb = done under local anesthesia)
  function treatmentOf(a) {
    const s = a.scores;
    if (s.rootCanal >= 3) return { name: "root canal treatment", numb: true };
    if (s.wisdom >= 3) return { name: "wisdom tooth removal", numb: true };
    if (s.implants >= 3) return { name: "implant treatment", numb: true };
    if (s.fillings >= 3 || /\b(crown|crowns)\b/.test(a.n)) return { name: "filling and crown treatment", numb: true };
    if (s.braces >= 3) return { name: "orthodontic treatment", numb: false };
    if (s.cleaning >= 3) return { name: "teeth cleaning", numb: false };
    if (s.whitening >= 3) return { name: "teeth whitening", numb: false };
    return null;
  }

  // Scores a message against every intent and flags special situations.
  function analyze(text) {
    const n = norm(text), tokens = tokenize(text), scores = {};
    INTENTS.forEach((i) => { scores[i.id] = tokens.length ? scoreIntent(tokens, i) : 0; });
    const a = {
      text, n, tokens, scores,
      question: text.includes("?") || Q_START.test(n),
      injection: INJECTION_RE.test(text),
      urgent: hasAny(tokens, URGENT),
      compare: hasAny(tokens, COMPARE),
      offTopic: tokens.some((t) => OFFTOPIC.has(t)),
      onTopic: hasAny(tokens, TOPIC),
      gibberish: isGibberish(n)
    };
    a.treatment = treatmentOf(a);
    a.fear = hasAny(tokens, FEAR) ||
      (/\b(is|does|will|would|do|can)\b.*\b(painful|hurt|hurts|pain)\b/.test(n) && (a.treatment !== null || /\b(it|procedure|treatment)\b/.test(n)));
    return a;
  }
  const maxAnswerScore = (a) => Math.max(0, ...INTENTS.filter((i) => !NON_ANSWER.has(i.id)).map((i) => a.scores[i.id]));

  // Specialist for the topics in a message (children first, then specific treatments)
  const SPECIALTY_PRIORITY = ["children", "rootCanal", "braces", "wisdom", "implants", "fillings", "cleaning", "consultation", "pain"];
  function specialistFor(scores) {
    for (const id of SPECIALTY_PRIORITY) {
      if (scores[id] >= 3) { const doc = DOCTORS.find((d) => d.treats.includes(id)); if (doc) return { doc, id }; }
    }
    return null;
  }

  /* =====================================================================
     ENTITY EXTRACTION — name, phone, date, time, doctor from free text
     ===================================================================== */
  const PHONE_RE = /(?:\+\d{1,3}[\s.-]?)?\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b|\+\d[\d\s().-]{6,}\d|\b\d{7,15}\b/;
  const EARLIEST_RE = /\b(earliest|soonest|asap|as soon as possible|first available|next available)\b/;
  const ANY_DOCTOR_RE = /\b(any doctor|any dentist|anyone|any one|no preference|doesn'?t matter|don'?t mind|whoever|either one|any of them)\b/;
  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const MON = "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?";
  const ORD = "(?:st|nd|rd|th)?";
  const DAY_NUM = { sun: 0, sunday: 0, mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2, wed: 3, wednesday: 3, thu: 4, thur: 4, thurs: 4, thursday: 4, fri: 5, friday: 5, sat: 6, saturday: 6 };
  const WEEKDAY_RE = /\b(?:(next|this|coming)\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tues|tue|wed|thurs|thur|thu|fri|sat)\b/;

  // Builds a calendar date; flags impossible (31 Feb) and past dates.
  function makeDate(match, y, m, d) {
    if (m < 0 || m > 11 || d < 1 || d > 31) return { match, error: "impossible" };
    const t = today(), explicitYear = y != null;
    const yy = explicitYear ? (y < 100 ? 2000 + y : y) : t.getFullYear();
    let dt = new Date(yy, m, d);
    if (dt.getMonth() !== m) return { match, error: "impossible" };
    if (dt < t) {
      if (explicitYear || t - dt <= 60 * 864e5) return { match, error: "past" };   // recently passed → past
      dt = new Date(yy + 1, m, d);                                              // e.g. "Jan 5" → next January
      if (dt.getMonth() !== m) return { match, error: "impossible" };
    }
    return { match, date: dt };
  }
  // "on the 5th" → the next 5th of a month; "the 32nd" → impossible
  function dayOnlyDate(match, d) {
    if (d < 1 || d > 31) return { match, error: "impossible" };
    const t = today();
    for (let i = 0; i < 3; i++) {
      const dt = new Date(t.getFullYear(), t.getMonth() + i, d);
      if (dt.getDate() === d && dt >= t) return { match, date: dt };
    }
    return { match, error: "impossible" };
  }

  function findDate(s) {
    const t = today();
    let m;
    if ((m = s.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/))) return makeDate(m[0], +m[1], +m[2] - 1, +m[3]);
    if ((m = s.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/)) || (m = s.match(/\b(\d{1,2})-(\d{1,2})-(\d{2,4})\b/)))
      return makeDate(m[0], m[3] ? +m[3] : null, +m[1] - 1, +m[2]);                                  // US order: MM/DD
    if ((m = s.match(new RegExp(`\\b${MON}\\s+(\\d{1,2})${ORD}\\b(?:,?\\s+(\\d{4}))?`))))
      return makeDate(m[0], m[3] ? +m[3] : null, MONTHS.indexOf(m[1]), +m[2]);                       // "Feb 31", "October 3rd"
    if ((m = s.match(new RegExp(`\\b(\\d{1,2})${ORD}\\s+(?:of\\s+)?${MON}(?:,?\\s+(\\d{4}))?`))))
      return makeDate(m[0], m[3] ? +m[3] : null, MONTHS.indexOf(m[2]), +m[1]);                       // "31st February"
    if ((m = s.match(/\b(?:on\s+)?the\s+(\d{1,2})(?:st|nd|rd|th)\b/)) || (m = s.match(/\bon\s+the\s+(\d{1,2})\b/)))
      return dayOnlyDate(m[0], +m[1]);                                                                 // "on the 32nd"
    if ((m = s.match(/\bday after tomorrow\b/))) return { match: m[0], date: addDays(t, 2) };
    if ((m = s.match(/\b(tomorrow|tmrw|tmr|tomorow|tommorow|tommorrow|tomorro|2morrow)\b/))) return { match: m[0], date: addDays(t, 1) };
    if ((m = s.match(/\b(today|tonight)\b/))) return { match: m[0], date: t };
    if ((m = s.match(/\b(yesterday|day before yesterday|last (?:week|month|sunday|monday|tuesday|wednesday|thursday|friday|saturday))\b/))) return { match: m[0], error: "past" };
    if ((m = s.match(WEEKDAY_RE))) {
      let diff = (DAY_NUM[m[2]] - t.getDay() + 7) % 7;
      if (m[1] === "next" && diff === 0) diff = 7;
      return { match: m[0], date: addDays(t, diff) };
    }
    return null;
  }

  function dateIssue(d) {
    const t = today();
    if (d < t) return "past";
    if (!isOpenDay(d)) return d.getDay() === 0 ? "sunday" : "closed";
    if (d > addDays(t, CONFIG.booking.maxDaysAhead)) return "far";
    if (sameDay(d, t) && nowMin() >= LAST_MIN - 30) return "todayLate";
    return null;
  }

  function findTime(s, lenient) {
    const hint = /\b(afternoon|evening|tonight|night)\b/.test(s) ? "p" : /\bmorning\b/.test(s) ? "a" : null;
    const build = (match, h, mm, ap) => {
      h = +h; mm = mm ? +mm : 0;
      if (h > 23 || mm > 59) return { match, error: "unclear" };
      ap = ap || hint;
      if (ap === "p" && h < 12) h += 12;
      else if (ap === "a" && h === 12) h = 0;
      else if (!ap && h >= 1 && h <= 7) h += 12;                    // "at 3" → 3 PM; "at 12" → noon
      return { match, min: h * 60 + mm };
    };
    let m;
    if ((m = s.match(/\b(12\s*noon|noon|midday)\b/))) return { match: m[0], min: 720 };
    if ((m = s.match(/\b(\d{1,2})(?:[:.](\d{2}))?\s*(a\.?\s?m\.?|p\.?\s?m\.?)(?![a-z])/))) return build(m[0], m[1], m[2], m[3][0]);
    if ((m = s.match(/\b(\d{1,2}):(\d{2})\b/))) return build(m[0], m[1], m[2], null);
    if ((m = s.match(/\b(?:at|around|by|to|make it|say)\s+(\d{1,2})(?:\.(\d{2}))?(?![\d\/-])\b/))) return build(m[0], m[1], m[2], null);
    if (lenient && (m = s.trim().match(/^(\d{1,2})(?:\.(\d{2}))?$/))) return build(m[0], m[1], m[2], null);
    if ((m = s.match(/\b(morning|afternoon|evening|tonight|night)\b/)) && !/\bgood (morning|afternoon|evening|night)\b/.test(s))
      return { match: m[0], part: m[1] === "tonight" || m[1] === "night" ? "evening" : m[1] };
    return null;
  }

  // Checks a time against clinic hours, the chosen doctor's hours, and "now" (for today).
  function timeIssue(min, date, doc) {
    if (min < OPEN_MIN || min >= CLOSE_MIN) return "range";
    if (min > LAST_MIN) return "late";
    if (doc && (min < doc.fromMin || min > doc.lastMin)) return "doctorHours";
    if (date && sameDay(date, today()) && min < nowMin() + 30) return "past";
    return null;
  }

  // "Dr. Emily", "with Ali", "Emily Carter" (or just "Emily" when choosing a doctor)
  function findDoctor(s, lenient) {
    for (const doc of DOCTORS) {
      const names = `(?:${doc.first}|${doc.last})`;
      const re = new RegExp(`\\b(?:dr\\.?|doctor|with|see)\\s+${names}\\b|\\b${doc.first}\\s+${doc.last}\\b` + (lenient ? `|\\b${names}\\b` : ""));
      const m = s.match(re);
      if (m) return { doc, match: m[0] };
    }
    return null;
  }

  const NAME_INTRO_RE = /\b(my name is|my name's|name is|name's|name:|this is|call me|i am|i'm|im|it's|its|name to)\s+([a-zÀ-ɏ][a-zÀ-ɏ'.-]*(?:\s+[a-zÀ-ɏ][a-zÀ-ɏ'.-]*){0,3})/i;
  const WEAK_INTRO = new Set(["this is", "i am", "i'm", "im", "it's", "its"]);
  const NAME_STOP = new Set(("and my phone number num mobile cell contact is at on for by of tomorrow today tonight morning afternoon evening next this " +
    "i want need would like please the a an to book booking appointment from with calling here but so can could also or dr doctor " +
    "monday tuesday wednesday thursday friday saturday sunday january february march april may june july august september october november december").split(" "));
  const NOT_NAME_START = new Set(("scared afraid nervous worried anxious in having looking not sure fine good ok okay available free busy new interested " +
    "calling trying going here sorry confused feeling getting very really so just still also back a an the currently done ready bleeding " +
    "hurting asking wondering planning coming booking thinking glad happy sad tired late on at from with your pain pregnant").split(" "));
  const NOT_A_NAME = new Set(("yes yeah yep no nope ok okay hello hi hey thanks thank test testing name idk none nothing nobody anonymous what why how who " +
    "book booking appointment dentist doctor please sure cancel stop help lol hmm maybe unknown user patient me myself my is the a an and " +
    "number phone at on for to in of it its i im any anyone same free").split(" "));

  // Rejects numbers, symbols, filler words and keyboard-mash like "asdfgh".
  function nameValid(s) {
    const clean = s.replace(/\s+/g, " ").trim();
    if (!/^[a-zA-ZÀ-ɏ][a-zA-ZÀ-ɏ .'-]{1,59}$/.test(clean)) return false;
    const words = clean.toLowerCase().split(" ");
    if (words.length > 4) return false;
    for (const w of words) {
      const letters = w.replace(/[.'-]/g, "");
      if (!letters || (letters.length === 1 && words.length === 1)) return false;
      if (NOT_A_NAME.has(letters) || isGibberishWord(letters)) return false;
    }
    const tokens = tokenize(clean);
    if (hasAny(tokens, URGENT) || hasAny(tokens, FEAR) || hasAny(tokens, TOPIC)) return false;
    const isTopic = (toks, min) => INTENTS.some((i) => i.id !== "doctors" && scoreIntent(toks, i) >= min);
    if (!isTopic(tokens, 3)) return true;
    // A surname may match a topic ("Lina Park", "Omar Khan") — accept if the first name itself is clearly not a topic
    return tokens.length >= 2 && !isTopic(tokens.slice(0, 1), 1);
  }
  const stripIntro = (s) => s.replace(/^\s*(hi|hello|hey)\b[,!.\s]*/i, "")
    .replace(/^\s*(my name is|my name's|name is|name:|this is|it's|its|i am|i'm|im|call me)\s+/i, "")
    .replace(/[.,!]+$/, "").trim();

  function findName(text) {
    const m = text.replace(/’/g, "'").match(NAME_INTRO_RE);
    if (!m) return null;
    const words = [];
    for (const w of m[2].split(/\s+/)) { if (NAME_STOP.has(w.toLowerCase().replace(/\.$/, ""))) break; words.push(w); }
    if (!words.length) return null;
    if (WEAK_INTRO.has(m[1].toLowerCase()) && NOT_NAME_START.has(words[0].toLowerCase())) return null;
    const name = words.join(" ");
    return nameValid(name) ? titleCase(name) : null;
  }

  // Pulls every piece of booking data out of one message.
  function extractEntities(text, step) {
    let rest = " " + text.toLowerCase().replace(/’/g, "'") + " ";
    const e = {};
    const cut = (m) => { rest = rest.replace(m, " "); };

    const pm = rest.match(PHONE_RE);
    if (pm) { e.phone = pm[0].trim().replace(/^\((?=[^)]*$)/, ""); cut(pm[0]); }
    else if (step === "phone") {
      const digits = text.replace(/\D/g, "");
      if (digits.length >= 7 && digits.length <= 15 && !/[a-z]{3,}/i.test(text)) { e.phone = text.trim(); rest = " "; }
    }

    const dm = findDate(rest);
    if (dm) {
      cut(dm.match);
      if (dm.error) e.dateError = dm.error;
      else { const issue = dateIssue(dm.date); if (issue) e.dateError = issue; else e.date = dm.date; }
      if (dm.match.includes("tonight")) e.part = "evening";
    } else if (EARLIEST_RE.test(rest)) e.earliest = true;

    const dr = findDoctor(rest, step === "doctor");
    if (dr) { e.doctor = dr.doc; cut(dr.match); }
    if (ANY_DOCTOR_RE.test(rest) || (step === "doctor" && /^\s*any\s*$/.test(rest))) e.anyDoctor = true;

    const tm = findTime(rest, step === "time");
    if (tm) {
      cut(tm.match);
      if (tm.error) e.timeError = "unclear";
      else if (tm.part) e.part = e.part || tm.part;
      else e.time = tm.min;
    }

    const nm = findName(text);
    if (nm) {
      e.name = nm;
      // "My name is Sarah Khan" is the patient, not the doctor
      if (dr && !/^(dr|doctor|with|see)\b/.test(dr.match.trim()) && nm.toLowerCase().includes(dr.doc.first)) delete e.doctor;
    }
    e.rest = rest.replace(/[^a-zÀ-ɏ' .-]/gi, " ").replace(/\s+/g, " ").trim();
    return e;
  }
  const hasCore = (e) => !!(e.name || e.phone || e.date || e.dateError || e.time != null || e.timeError || e.doctor || e.anyDoctor || e.earliest);
  const hasData = (e) => hasCore(e) || !!e.part;

  const REASON_BY_INTENT = [["fillings", "Filling"], ["wisdom", "Wisdom tooth removal"], ["rootCanal", "Root canal"], ["implants", "Dental implant"],
    ["braces", "Braces / aligners"], ["cleaning", "Teeth cleaning"], ["whitening", "Whitening"], ["consultation", "Checkup"], ["pain", "Tooth pain"]];
  function reasonFrom(a) {
    const found = (REASON_BY_INTENT.find(([id]) => a.scores[id] >= 3) || [])[1] || null;
    if (a.scores.children >= 3) return found && found !== "Checkup" ? `${found} (child)` : "Child's checkup";
    return found;
  }

  // Multi-person bookings: "me and my wife", "my husband and I", "both of us"
  function multiPerson(n) {
    let m = n.match(/\b(?:me and my|myself and my)\s+(wife|husband|partner|son|daughter|kid|child|mother|mom|mum|father|dad|brother|sister|friend)\b/) ||
            n.match(/\bmy\s+(wife|husband|partner|son|daughter|mother|mom|mum|father|dad|brother|sister|friend)\s+and\s+(?:me|i|myself)\b/);
    if (m) return "your " + m[1];
    return /\b(both of us|two of us|for us both|two appointments|2 appointments)\b/.test(n) ? "the second person" : null;
  }

  /* =====================================================================
     DOCTOR AVAILABILITY
     ===================================================================== */
  function availableDoctors(date, time) {
    if (!date || dateIssue(date)) return [];
    const isToday = sameDay(date, today());
    const on = DOCTORS.filter((doc) => worksOn(doc, date) && (!isToday || doc.lastMin >= nowMin() + 30));
    if (time == null) return on;
    const fit = on.filter((doc) => time >= doc.fromMin && time <= doc.lastMin);
    return fit.length ? fit : on;
  }
  function nextDateFor(doc, from) {
    let d = from && from > today() ? new Date(from) : today();
    for (let i = 0; i < 35; i++, d = addDays(d, 1)) {
      if (!worksOn(doc, d) || dateIssue(d)) continue;
      if (sameDay(d, today()) && doc.lastMin < nowMin() + 30) continue;
      return d;
    }
    return null;
  }
  function firstOpenDate() {
    let d = today();
    if (!(isOpenDay(d) && nowMin() < LAST_MIN - 30)) d = addDays(d, 1);
    while (!isOpenDay(d)) d = addDays(d, 1);
    return d;
  }
  // Nearest day + time + doctor (optionally for one preferred doctor)
  function earliestSlot(pref) {
    const t = today();
    for (let i = 0; i <= 28; i++) {
      const date = addDays(t, i);
      if (dateIssue(date)) continue;
      let best = null;
      for (const doc of pref ? [pref] : DOCTORS) {
        if (!worksOn(doc, date)) continue;
        let start = doc.fromMin;
        if (i === 0) start = Math.max(start, Math.ceil((nowMin() + 30) / 30) * 30);
        if (start <= doc.lastMin && (!best || start < best.time)) best = { date, time: start, doctor: doc };
      }
      if (best) return best;
    }
    return null;
  }
  // Clickable doctor cards; `sendFor(doc)` is the message sent when a card is tapped
  function docCards(docs, rec, sendFor) {
    const sorted = rec && docs.includes(rec) ? [rec, ...docs.filter((x) => x !== rec)] : docs;
    return `<div class="doc-list">` + sorted.map((doc) =>
      `<button type="button" class="doc-card" data-send="${esc(sendFor(doc))}">` +
        `<span class="doc-top"><span class="doc-name">${esc(doc.name)}</span>${doc === rec ? `<span class="doc-tag">Recommended</span>` : ""}</span>` +
        `<span class="doc-spec">${esc(doc.specialty)}</span><span class="doc-hours">${rangeText(doc)}</span></button>`).join("") + `</div>`;
  }

  /* =====================================================================
     BUILD THE WIDGET (Shadow DOM)
     ===================================================================== */
  // Web fonts must be registered on the main document to be usable inside a shadow root.
  if (!document.querySelector("link[data-bs-chat-font]")) {
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;500&display=swap";
    font.setAttribute("data-bs-chat-font", "");
    document.head.appendChild(font);
  }

  const host = document.createElement("div");
  host.id = "bright-smile-chatbot";
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>${CSS}</style>
    <div class="bs-root">
      <div class="chat-tooltip" role="button" tabindex="-1">${esc(CONFIG.bot.tooltip)}</div>

      <button class="chat-launcher" aria-label="Open chat" aria-expanded="false">
        <span class="ico i-chat">${icon("chatFill", 28)}</span>
        <span class="ico i-close">${icon("close", 26)}</span>
        <span class="unread">1</span>
      </button>

      <section class="chat-window" role="dialog" aria-label="Chat with clinic assistant">
        <div class="chat-head">
          <div class="bot-avatar">${icon("tooth", 23)}</div>
          <div class="who"><span class="name">${esc(CONFIG.bot.name)}</span><span class="status"><i></i>Online</span></div>
          <button class="head-btn restart" title="Restart conversation" aria-label="Restart conversation">${icon("refresh", 17)}</button>
          <button class="head-btn close" title="Close" aria-label="Close chat">${icon("close", 18)}</button>
        </div>
        <div class="chat-body" aria-live="polite"></div>
        <div class="chips"></div>
        <form class="chat-input" autocomplete="off">
          <input type="text" placeholder="Type your message…" aria-label="Type your message" maxlength="300">
          <button class="send-btn" type="submit" aria-label="Send">${icon("send", 19)}</button>
        </form>
        <div class="chat-foot">Demo assistant · runs entirely in your browser</div>
      </section>
    </div>`;

  const $ = (s) => shadow.querySelector(s);
  const root = $(".bs-root"), chatBody = $(".chat-body"), chipsEl = $(".chips"), input = $(".chat-input input");
  const launcher = $(".chat-launcher"), tooltip = $(".chat-tooltip"), unreadEl = $(".unread");
  let started = false, unread = 0, queue = Promise.resolve(), session = 0;
  const isOpen = () => root.classList.contains("open");
  const isMobile = () => window.matchMedia("(max-width: 560px)").matches;

  /* =====================================================================
     CHAT UI
     ===================================================================== */
  function scrollDown() { chatBody.scrollTop = chatBody.scrollHeight; }

  function addMessage(role, html) {
    const row = document.createElement("div");
    row.className = "msg " + role;
    row.innerHTML = (role === "bot" ? `<div class="mini-av">${icon("tooth", 15)}</div>` : "") +
      `<div class="col"><div class="bubble">${html}</div><time>${clockNow()}</time></div>`;
    chatBody.appendChild(row);
    scrollDown();
    if (role === "bot" && !isOpen()) setUnread(unread + 1);
  }

  function setChips(list = []) {
    chipsEl.innerHTML = "";
    list.forEach((label) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = label;
      b.onclick = () => sendUser(label);
      chipsEl.appendChild(b);
    });
    scrollDown();
  }

  // Doctor cards inside messages are clickable
  chatBody.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-send]");
    if (el) sendUser(el.getAttribute("data-send"));
  });

  // Queue bot replies so they appear one after another with a typing indicator.
  function bot(html, chips) {
    const mySession = session;
    queue = queue.then(() => new Promise((resolve) => {
      if (mySession !== session) return resolve();
      const t = document.createElement("div");
      t.className = "msg bot typing";
      t.innerHTML = `<div class="mini-av">${icon("tooth", 15)}</div><div class="col"><div class="bubble"><span></span><span></span><span></span></div></div>`;
      chatBody.appendChild(t); scrollDown();
      const plain = html.replace(/<[^>]+>/g, "");
      const delay = 450 + Math.min(plain.length * 9, 1000) + Math.random() * 250;
      setTimeout(() => {
        t.remove();
        if (mySession === session) { addMessage("bot", html); if (chips) setChips(chips); }
        resolve();
      }, delay);
    }));
    return queue;
  }

  function sendUser(text) {
    text = String(text).trim();
    if (!text) return;
    addMessage("user", esc(text));
    setChips([]);
    input.value = "";
    if (Flow.active) handleFlow(text); else respond(text);
  }

  /* =====================================================================
     ANSWERS — what to say for a question (priority: urgent → medical →
     fear → doctors → availability → specialist → prices → hours → FAQ)
     ===================================================================== */
  const NON_ANSWER = new Set(["book", "reschedule", "greeting", "thanks", "bye"]);
  const SERVICE_IDS = ["consultation", "cleaning", "fillings", "rootCanal", "whitening", "braces", "implants", "wisdom", "children"];
  const URGENT_CHIPS = ["Book earliest appointment", "Location"];
  const PRICE_INTENTS = { consultation: "consultation", cleaning: "cleaning", fillings: "filling", rootCanal: "rootCanal", whitening: "whitening", wisdom: "wisdom", braces: "braces", implants: "implant" };
  const SERVICE_LABEL = { braces: "braces or aligners", rootCanal: "a root canal", implants: "implants", wisdom: "wisdom tooth removal", children: "your child's visit",
    consultation: "a checkup", cleaning: "a cleaning", fillings: "fillings", pain: "tooth pain" };
  const DO_YOU_RE = /\b(do you (do|offer|provide|have|perform)|can you (do|remove)|how much|price|cost)\b/;
  const FEE_RE = /\b(cheap|cheaper|cheapest|cost|costs|price|prices|fee|fees|charge|charges|expensive|affordable)\b/;
  const AVAIL_WORDS_RE = /\b(available|availability|free|working|work|works|in on|there|when|days?|schedule|hours)\b/;
  const AVAIL_RE = /\b(who|which doctors?|which dentists?|what doctors?|any doctors?|doctors?)\b[^?]*\b(available|free|working|on duty)\b|\bwhos (available|working|in|on)\b/;
  const SPECIALIST_Q = /\b(which|what|who)\b[^.]*\b(doctor|dentist|specialist)\b|\bwho (does|do|handles|treats|can|should)\b|\bwhen\b/;
  const MY_BOOKING_RE = /\b(what (did|have) i (book|booked|schedule|scheduled)|my (booking|appointment) (details|summary|info)|(show|see|check|view|remind me of) (me )?my (booking|appointment|bookings|appointments)|when is my (appointment|booking)|what time is my (appointment|booking)|whats my (booking|appointment))\b/;
  const QTY_RE = /\b(\d{1,2}|two|three|four|five|six|seven|eight|nine|ten)\s+(fillings?|implants?|cleanings?|whitening sessions?|sessions?|checkups?|consultations?|root canals?|wisdom teeth|wisdom tooth removals?)\b/;
  const QTY_WORDS = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  const QTY_KEY = [[/filling/, "filling"], [/implant/, "implant"], [/cleaning/, "cleaning"], [/session|whitening/, "whitening"], [/checkup|consultation/, "consultation"], [/root canal/, "rootCanal"], [/wisdom/, "wisdom"]];

  const money = (n) => "$" + n.toLocaleString("en-US");
  const priceNums = (p) => (p.value.match(/\d[\d,]*/g) || []).map((x) => +x.replace(/,/g, ""));

  function pricesHtml() {
    const rows = Object.values(CONFIG.prices).map((p) => `<div class="pl-row"><span>${esc(p.label)}</span><span>${esc(p.value)}</span></div>`).join("");
    return `Here's an overview of our main prices:<div class="price-list">${rows}</div><div class="pl-note">We'll confirm the exact cost of any treatment after your checkup.</div>`;
  }
  function servicesHtml() {
    return `We offer ${joinAnd(CONFIG.services.map((s) => s.toLowerCase()))}. Which one would you like to know more about?`;
  }

  // "cleaning and whitening together" → each price + the total
  function multiPriceHtml(ids) {
    let min = 0, max = 0, from = false, priced = 0;
    const parts = ids.map((id) => {
      const p = CONFIG.prices[PRICE_INTENTS[id]];
      const isFrom = /\(from\)/i.test(p.label);
      const label = p.label.replace(/\s*\(from\)\s*/i, "").toLowerCase();
      const nums = priceNums(p);
      if (!nums.length) return `${label} ${/&|s$/.test(label) ? "are" : "is"} priced ${p.value.toLowerCase()}`;
      priced++; min += nums[0]; max += nums[nums.length - 1]; if (isFrom) from = true;
      return isFrom ? `a ${label} starts from ${p.value}` : `${label} is ${p.value}`;
    });
    let html = joinAnd(parts);
    html = html.charAt(0).toUpperCase() + html.slice(1) + ".";
    if (priced >= 2) html += ` Together, that's <b>${from ? "from " + money(min) : min === max ? money(min) : money(min) + "–" + money(max)}</b>.`;
    return html;
  }
  // "How much for 3 fillings?" → 3 × $120 = $360
  function quantityHtml(n) {
    const m = n.match(QTY_RE);
    if (!m) return null;
    const qty = /^\d+$/.test(m[1]) ? +m[1] : QTY_WORDS[m[1]];
    const key = (QTY_KEY.find(([re]) => re.test(m[2])) || [])[1];
    const p = key && CONFIG.prices[key];
    if (!p || qty < 2) return null;
    const nums = priceNums(p);
    if (!nums.length) return null;
    const lo = nums[0] * qty, hi = nums[nums.length - 1] * qty, isFrom = /\(from\)/i.test(p.label);
    const total = isFrom ? "from " + money(lo) : lo === hi ? money(lo) : money(lo) + "–" + money(hi);
    const each = /per /.test(p.value) ? p.value : p.value + " each";
    return `${qty} ${m[2]} would be <b>${total}</b> (${each}).`;
  }

  function urgentHtml(askedMedicine) {
    return fill(R.urgent) + (askedMedicine ? " " + R.urgentNoMedicine : "") + " " + R.urgentOffer;
  }
  function fearHtml(a) {
    const t = a.treatment;
    if (!t) return fill(R.fearGeneral);
    return fill(t.numb ? R.fearNumb : R.fearGentle, { treatment: t.name });
  }
  function openOnHtml(e) {
    if (e.dateError === "sunday" || e.dateError === "closed") return fill(R.closedOn);
    if (e.date) return fill(R.openOn, { date: fmtDate(e.date) });
    return null;
  }
  function answerHtml(id) {
    if (id === "prices") return pricesHtml();
    if (id === "services") return servicesHtml();
    return fill(intentById[id].answer);
  }
  const dateErrorHtml = (code) => errorText({ field: "date", code });

  // "Who is available on October 3rd?"
  function availabilityAnswer(e, inFlow) {
    if (e.dateError) return { html: dateErrorHtml(e.dateError), chips: [], info: true };
    let date = e.date || today();
    if (!e.date && availableDoctors(date).length === 0) date = firstOpenDate();
    const docs = availableDoctors(date, null);
    if (!docs.length) return { html: fill(R.noDoctors, { date: fmtDate(date) }), chips: [], info: true };
    const send = (doc) => (inFlow ? `${doc.name} on ${fmtShort(date)}` : `Book with ${doc.name} on ${fmtShort(date)}`);
    return { html: fill(R.availableOn, { date: fmtDate(date) }) + docCards(docs, null, send), chips: [], info: true };
  }
  // "Is Dr. James available on 2nd October?"
  function doctorAvailabilityAnswer(doc, e) {
    if (e.dateError) return { html: dateErrorHtml(e.dateError), chips: [], info: true };
    const vals = { doctor: doc.name, short: doc.short, specialty: doc.specialty, range: rangeText(doc), days: daysText(doc) };
    if (!e.date) {
      const next = nextDateFor(doc);
      return { html: fill(R.doctorGeneral, { ...vals, next: next ? relDate(next) : "—" }), chips: next ? [`Book with ${doc.short} on ${fmtShort(next)}`] : [], info: true };
    }
    if (worksOn(doc, e.date)) {
      return { html: fill(R.doctorYes, { ...vals, date: fmtDate(e.date) }), chips: [`Book with ${doc.short} on ${fmtShort(e.date)}`], info: true };
    }
    const next = nextDateFor(doc, e.date);
    return { html: fill(R.doctorNo, { ...vals, weekday: weekdayPlural(e.date), next: next ? relDate(next) : "—" }),
      chips: next ? [`Book with ${doc.short} on ${fmtShort(next)}`] : [], info: true };
  }
  // "I need braces, which doctor and when?"
  function specialistAnswer(spec) {
    const doc = spec.doc, next = nextDateFor(doc);
    return { html: fill(R.specialist, { service: SERVICE_LABEL[spec.id] || "this treatment", doctor: doc.name, short: doc.short, specialty: doc.specialty,
      days: daysText(doc), range: rangeText(doc), next: next ? relDate(next) : "—" }), chips: [`Book with ${doc.short}`] };
  }

  function buildAnswer(a, e, inFlow) {
    const s = a.scores, n = a.n;
    if (a.urgent) return { html: urgentHtml(s.medical >= 3), chips: URGENT_CHIPS };
    if (s.medical >= 3) return { html: fill(intentById.medical.answer), chips: URGENT_CHIPS };
    if (s.safety >= 3) return { html: fill(intentById.safety.answer), chips: intentById.safety.chips };
    if (a.fear) {
      const svc = SERVICE_IDS.filter((id) => s[id] >= 3);
      const lead = svc.length && DO_YOU_RE.test(n) ? answerHtml(svc[0]) + "<br><br>" : "";   // "do you do X and does it hurt?"
      return { html: lead + fearHtml(a), chips: ["Book Appointment", "Doctors"] };
    }
    if (s.doctors >= 3 && FEE_RE.test(n)) return { html: fill(R.doctorFees), chips: ["Doctors", "Book Appointment"] };
    if (s.doctors >= 3 && a.compare) return { html: fill(R.compareDoctors), chips: ["Book Appointment"] };
    if (e.doctor && a.question && (e.date || e.dateError || AVAIL_WORDS_RE.test(n))) return doctorAvailabilityAnswer(e.doctor, e);
    if (AVAIL_RE.test(n)) return availabilityAnswer(e, inFlow);
    const spec = specialistFor(s);
    if (spec && spec.id !== "pain" && SPECIALIST_Q.test(n)) return specialistAnswer(spec);
    const qty = quantityHtml(n);
    if (qty) return { html: qty, chips: ["Book Appointment", "Payment options"] };
    if (s.duration >= 3 && a.treatment && s.consultation < 3) return { html: fill(R.durationOther), chips: ["Book Appointment"] };

    const priced = Object.keys(PRICE_INTENTS).filter((id) => s[id] >= 3);
    if (priced.length >= 2) return { html: multiPriceHtml(priced), chips: ["Book Appointment", "Payment options"] };

    if ((s.timings >= 1 || s.weekends >= 1) && a.question) {
      const h = openOnHtml(e);
      if (h) return { html: h, chips: ["Book Appointment", "Location"], info: true };
    }

    const candidates = INTENTS.filter((i) => !NON_ANSWER.has(i.id));
    let ids = candidates.filter((i) => s[i.id] >= 3).sort((x, y) => s[y.id] - s[x.id]).map((i) => i.id);
    if (!ids.length) {
      const top = candidates.slice().sort((x, y) => s[y.id] - s[x.id])[0];
      const need = inFlow ? (a.question ? 2 : Infinity) : 1;
      if (top && s[top.id] >= need) ids = [top.id];
    }
    if (!ids.length) return null;
    // Avoid overlapping answers to the same question
    if (ids.length > 1) ids = ids.filter((id) => id !== "prices" && id !== "doctors");
    if (ids.includes("weekends")) ids = ids.filter((id) => id !== "timings");
    if (ids.includes("pain")) ids = ids.filter((id) => id !== "emergency");
    if (!ids.length) return null;
    ids = ids.slice(0, 3);
    return { html: ids.map(answerHtml).join("<br><br>"), chips: intentById[ids[0]].chips || CONFIG.bot.quickReplies };
  }

  /* ---------- "What did I book?" ---------- */
  const Session = { bookings: [] };
  function recordCard(rec) {
    const row = (k, v) => (v ? `<div class="summary-row"><span>${k}</span><span>${esc(v)}</span></div>` : "");
    return `<div class="summary"><div class="summary-head">${icon("calendar", 14)} Appointment summary</div>` +
      row("Name", rec.name) + row("Phone", rec.phone) + row("Date", rec.date ? fmtDate(fromISO(rec.date)) : "") + row("Time", rec.time) +
      row("Doctor", rec.doctor) + row("Reason", rec.reason) + `</div>`;
  }
  function showMyBookings(chips) {
    let list = Session.bookings.slice(-3);
    if (!list.length) {
      try { const last = (JSON.parse(localStorage.getItem(STORE_KEY)) || []).find((r) => r.type === "new"); if (last) list = [last]; } catch (e) { /* ignore */ }
    }
    if (!list.length) return bot(R.noBooking, ["Book Appointment"]);
    return bot(R.myBookings + list.map(recordCard).join("") + R.myBookingsNote, chips);
  }

  /* =====================================================================
     ROUTER (no booking in progress)
     ---------------------------------------------------------------------
     🔌 WHERE THE CLAUDE API GOES (real/production version)
     This widget uses local intent detection so it works with no API key.
     For the real version, send free-text questions to Claude — e.g. call
     it from respond() when nothing matched (the fallback / out-of-scope
     branches), or replace buildAnswer() entirely:

       const res = await fetch("https://YOUR-BACKEND/api/chat", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ messages: chatHistory })
       });
       const { reply } = await res.json();
       bot(esc(reply));

     The backend (never the browser — the API key must stay secret) calls:
       POST https://api.anthropic.com/v1/messages
       headers: x-api-key: process.env.ANTHROPIC_API_KEY,
                anthropic-version: 2023-06-01, content-type: application/json
       body: { model: "claude-sonnet-5-5",   // or claude-haiku-4-5 for lower cost
               max_tokens: 300,
               system: <built from CONFIG: clinic facts, prices, hours, doctors,
                        + rules: reply in English, 1–3 sentences, never diagnose
                        or prescribe, use CONFIG.bot.outOfScope for off-topic>,
               messages: chatHistory }
     Keep the booking flow below as-is (deterministic & validated), and send
     confirmed bookings from submitRequest() to email/WhatsApp/Sheets/CRM.
     ===================================================================== */
  function respond(text) {
    const a = analyze(text), s = a.scores, defaults = CONFIG.bot.quickReplies;
    if (!a.n) return bot(R.rephrase, defaults);
    if (a.injection) return bot(esc(CONFIG.bot.outOfScope));                    // prompt injection → one line

    const e = extractEntities(text, null);
    const core = hasCore(e);
    const ans = buildAnswer(a, e, false);

    if (a.urgent) return bot(ans.html, ans.chips);                               // emergencies always first
    if (MY_BOOKING_RE.test(a.n)) return showMyBookings(defaults);
    if (a.offTopic && !a.onTopic && s.book < 3 && maxAnswerScore(a) < 3) return bot(esc(CONFIG.bot.outOfScope));
    if (s.reschedule >= 3) return startFlow("reschedule", e);
    if (ans && ans.info && s.book < 3) return bot(ans.html, ans.chips);          // availability / opening-day questions

    const multi = multiPerson(a.n);
    const wantsBooking = s.book >= 3 || e.earliest || multi || (s.book >= 1 && (core || !ans)) ||
      (core && (!a.question || !ans || e.time != null || e.timeError || e.phone));
    if (wantsBooking) {
      const reason = reasonFrom(a);
      if (reason) e.reason = reason;
      return startFlow("book", e, { multi });
    }

    if (ans) return bot(ans.html, ans.chips);
    if (s.bye >= 3 || s.thanks >= 3) return bot(fill(intentById[s.bye >= 3 ? "bye" : "thanks"].answer));   // warm goodbye
    if (s.greeting >= 3) return bot(fill(intentById.greeting.answer), defaults);
    if (/^(yes|yeah|yep|sure|ok|okay|yes please)$/.test(a.n)) return bot(R.yesIdle, defaults);
    if (/^(no|nope|nah|no thanks|no thank you)$/.test(a.n)) return bot(R.noIdle);
    if (a.gibberish) return bot(R.rephrase, defaults);
    if (a.onTopic) return bot(fill(CONFIG.bot.fallback), defaults);
    return bot(esc(CONFIG.bot.outOfScope));                                        // one line only — no quick replies
  }

  /* =====================================================================
     BOOKING STATE — kept separately, so answering questions never resets it
     ===================================================================== */
  const Flow = { active: null, step: null, data: {}, earliest: false, recNoted: false, pending: [], prevPhone: null, asked: new Set(), failField: null, failCount: 0 };
  const STEPS = { book: ["name", "phone", "date", "reason", "doctor", "time"], reschedule: ["name", "phone", "date", "time"] };
  const CONFIRM_CHIPS = ["✅ Yes, confirm", "✏️ Edit details", "✖ Cancel"];
  const EDIT_CHIPS = ["Name", "Phone", "Date", "Doctor", "Time", "Reason"];
  const ABORT_RE = /^(?:(?:please|ok|okay|actually|oh|no|um|hmm)\s+)*(stop|cancel|cancel (?:it|this|that|booking|the booking|my booking|request|the request|please)|never ?mind|forget (?:it|about it)|start over|exit|quit|i changed my mind|i dont want (?:it|to|this)|no thanks|no thank you)(?:\s+(?:please|thanks|thank you))?$/;
  const YES_RE = /\b(yes|yeah|yep|yup|sure|confirm|confirmed|ok|okay|correct|go ahead|y|please do)\b/;
  const NO_RE = /\b(no|nope|nah|cancel|dont|stop)\b/;
  const EDIT_RE = /\b(edit|change|modify|wrong|fix)\b/;
  const recDoc = (d) => (d.recId ? DOCTORS.find((x) => x.id === d.recId) : null);

  function nextStep() {
    const d = Flow.data;
    if (d.cancelOnly) return "submit";
    const missing = STEPS[Flow.active].find((k) => d[k] == null);
    return missing || (Flow.active === "book" ? "confirm" : "submit");
  }

  function dateChips() {
    const d0 = Flow.data, out = [], t = today();
    let d = firstOpenDate();
    for (let i = 0; i < 40 && out.length < 5; i++, d = addDays(d, 1)) {
      if (!isOpenDay(d) || (d0.doctor && !worksOn(d0.doctor, d))) continue;          // only the chosen doctor's days
      if (d0.doctor && sameDay(d, t) && d0.doctor.lastMin < nowMin() + 30) continue;
      out.push(sameDay(d, t) ? "Today" : sameDay(d, addDays(t, 1)) ? "Tomorrow" : fmtShort(d));
    }
    return Flow.active === "reschedule" ? [...out, "Just cancel"] : out;
  }
  const PARTS = { morning: [OPEN_MIN, 719], afternoon: [720, 1019], evening: [1020, LAST_MIN] };
  function timeChips(date, part, doc) {
    const isToday = date && sameDay(date, today());
    const okNow = (m) => !isToday || m >= nowMin() + 30;
    let from = doc ? doc.fromMin : OPEN_MIN, to = doc ? doc.lastMin : LAST_MIN;
    if (part && PARTS[part]) {
      const pf = Math.max(from, PARTS[part][0]), pt = Math.min(to, PARTS[part][1]);
      if (pf <= pt) { from = pf; to = pt; }
    }
    let slots = [];
    const step = to - from > 180 ? 60 : 30;                          // hourly buttons for long shifts
    for (let m = from; m <= to; m += step) if (okNow(m)) slots.push(m);
    if (slots.length > 6) { const step = (slots.length - 1) / 5; slots = [0, 1, 2, 3, 4, 5].map((i) => slots[Math.round(i * step)]); }
    return slots.map(minToLabel);
  }
  function chipsFor(step) {
    const d = Flow.data;
    if (step === "date") return dateChips();
    if (step === "time") return timeChips(d.date, d.part, d.doctor);
    if (step === "reason") return CONFIG.booking.reasons;
    if (step === "doctor") return ["Any doctor"];
    if (step === "phone") return Flow.prevPhone ? [`Same number (${Flow.prevPhone})`] : [];
    if (step === "confirm") return CONFIRM_CHIPS;
    if (step === "editPick") return EDIT_CHIPS;
    return [];
  }
  function recommendText(doc, date) {
    const vals = { doctor: doc.name, short: doc.short, specialty: doc.specialty, range: rangeText(doc), days: daysText(doc) };
    return date && worksOn(doc, date) ? fill(R.recommend, { ...vals, weekday: weekdayPlural(date) }) : fill(R.recommendOther, vals);
  }

  function askStep(step, opts = {}) {
    if (step !== Flow.step) resetFails();          // moved on → the previous input was valid
    Flow.step = step;
    const d = Flow.data, book = Flow.active === "book";
    const short = !!opts.prefix || !!opts.short || Flow.asked.has(step);    // the long wording is used only the first time
    Flow.asked.add(step);
    const first = d.name ? esc(firstName(d.name)) : "";
    let html, chips = chipsFor(step);
    switch (step) {
      case "name":
        html = short ? "May I have your <b>full name</b>?"
          : book ? "Wonderful, let's get you booked in! 😊 May I have your <b>full name</b>?"
                 : "Of course, I can help with that. May I have the <b>full name</b> the appointment is under?";
        break;
      case "phone":
        html = short || !first ? "What's the best <b>phone number</b> to reach you on?"
          : book ? `Thank you, ${first}! What's the best <b>phone number</b> to reach you on?`
                 : `Thank you, ${first}. And which <b>phone number</b> was the appointment booked with?`;
        break;
      case "date":
        html = short ? (book ? "Which <b>date</b> suits you best?" : "What <b>new date</b> would suit you?")
          : book ? `Which <b>date</b> suits you best?${d.doctor ? ` ${esc(d.doctor.short)} is available ${daysText(d.doctor)}.` : " We're open Monday to Saturday — you can type something like “tomorrow”, “next Monday” or “Oct 12”."}`
                 : "What <b>new date</b> would suit you? If you'd simply like to cancel, just tap “Just cancel”.";
        break;
      case "reason":
        html = short ? "What's the main <b>reason for your visit</b>?" : "Almost there! What's the main <b>reason for your visit</b>?";
        break;
      case "doctor": {
        const rec = recDoc(d), docs = availableDoctors(d.date, d.time);
        if (!docs.length) { html = fill(R.noDoctors, { date: fmtDate(d.date) }); chips = dateChips(); Flow.step = "date"; break; }
        html = fill(R.availableOn, { date: fmtDate(d.date) }) + docCards(docs, rec, (doc) => doc.name);
        if (rec && !docs.includes(rec)) {
          const next = nextDateFor(rec, d.date);
          if (next) {
            html += `${esc(rec.name)} (${esc(rec.specialty)}) isn't in that day — ${esc(rec.short)}'s next available day is <b>${relDate(next)}</b>.`;
            chips = [...chips, `${fmtShort(next)} with ${rec.short}`];
          }
        }
        break;
      }
      case "time":
        html = d.part ? `What <b>time</b> in the ${d.part} works best for you?`
          : d.doctor ? `What <b>time</b> works best for you? ${esc(d.doctor.short)} is available ${rangeText(d.doctor)} on ${fmtShort(d.date)}.`
          : short || !d.date ? `What <b>time</b> works best for you${d.date ? " on " + fmtDate(d.date) : ""}?`
          : `Lovely. What <b>time</b> works best for you on ${fmtDate(d.date)}? We're open from ${minToLabel(OPEN_MIN)} to ${minToLabel(CLOSE_MIN)}.`;
        break;
      case "confirm":
        html = summaryCard(d) + "Shall I confirm this appointment?";
        break;
    }
    bot((opts.prefix || "") + (opts.html || html), chips);
  }
  const continuePrompt = () =>
    askStep(Flow.step, { prefix: (Flow.active === "book" ? R.continueBooking : R.continueRequest) + " " });

  function summaryCard(d) {
    const row = (k, v) => `<div class="summary-row"><span>${k}</span><span>${esc(v)}</span></div>`;
    return `<div class="summary"><div class="summary-head">${icon("calendar", 14)} Appointment summary</div>` +
      row("Name", d.name) + row("Phone", d.phone) + row("Date", fmtDate(d.date)) + row("Time", timeLabel(d.time)) +
      row("Doctor", d.doctor ? `${d.doctor.name} (${d.doctor.specialty})` : "Any available") + row("Reason", d.reason) + `</div>`;
  }

  function endFlow() {
    Object.assign(Flow, { active: null, step: null, data: {}, earliest: false, recNoted: false, pending: [], prevPhone: null, asked: new Set() });
    resetFails();
  }

  function startFlow(type, e = {}, opts = {}) {
    endFlow();
    Flow.active = type;
    if (opts.multi) Flow.pending = [opts.multi];
    if (!hasData(e) && !e.reason) return askStep(STEPS[type][0], opts.multi ? { prefix: R.multiIntro } : {});
    return advance(applyEntities(e), { intro: true });
  }

  function pickAnyDoctor(d) {
    const docs = availableDoctors(d.date, d.time), rec = recDoc(d);
    return rec && docs.includes(rec) ? rec : docs[0] || null;
  }

  // Stores extracted data. Returns which fields were added, changed, or invalid.
  function applyEntities(e) {
    const d = Flow.data, book = Flow.active === "book", r = { added: [], changed: [], errors: [] };
    const same = (x, y) => (x instanceof Date && y instanceof Date ? x.getTime() === y.getTime() : x === y);
    const set = (k, v) => { if (d[k] == null) r.added.push(k); else if (!same(d[k], v)) r.changed.push(k); d[k] = v; };

    // "earliest possible slot" → nearest day, time and doctor
    if (e.earliest && !e.date && !e.dateError) {
      const slot = earliestSlot(book ? e.doctor || d.doctor || recDoc(d) : null);
      if (slot) {
        e.date = slot.date;
        if (e.time == null && d.time == null) e.time = slot.time;
        if (book && !e.doctor && !d.doctor) e.doctor = slot.doctor;
        Flow.earliest = true;
      }
    }
    if (e.name) set("name", e.name);
    if (e.phone) set("phone", e.phone);
    if (e.dateError) r.errors.push({ field: "date", code: e.dateError });
    else if (e.date) set("date", e.date);
    if (e.reason && book) {
      if (d.reason == null) set("reason", e.reason);
      if (!d.recId) { const sp = specialistFor(analyze(e.reason).scores); if (sp) d.recId = sp.doc.id; }
    }
    if (e.part && e.time == null) d.part = e.part;

    // Doctor: must work on the chosen date
    if (book) {
      if (e.doctor) {
        if (d.date && !worksOn(e.doctor, d.date)) r.errors.push({ field: "doctor", code: "unavailable", doctor: e.doctor });
        else set("doctor", e.doctor);
      } else if (e.anyDoctor && !d.doctor) {
        if (d.date) { const pick = pickAnyDoctor(d); if (pick) set("doctor", pick); } else d.anyDoctor = true;
      }
      if (!d.doctor && d.anyDoctor && d.date) { const pick = pickAnyDoctor(d); if (pick) set("doctor", pick); }
      if (e.date && d.doctor && !worksOn(d.doctor, d.date) && !r.errors.some((x) => x.field === "doctor")) {
        r.errors.push({ field: "doctor", code: "unavailable", doctor: d.doctor });
        d.doctor = null;
      }
    }

    // Time: clinic hours, the doctor's hours, and not in the past
    if (e.timeError) r.errors.push({ field: "time", code: e.timeError });
    else if (e.time != null) {
      const issue = timeIssue(e.time, d.date, d.doctor);
      if (issue) r.errors.push({ field: "time", code: issue, min: e.time });
      else { set("time", e.time); d.part = null; }
    } else if ((e.date || e.doctor || e.anyDoctor) && d.time != null) {
      const issue = timeIssue(d.time, d.date, d.doctor);   // a new date/doctor can make the earlier time invalid
      if (issue) { r.errors.push({ field: "time", code: issue === "doctorHours" ? "doctorClash" : issue, min: d.time }); d.time = null; }
    }
    return r;
  }

  function errorText(err) {
    const d = Flow.data;
    if (err.field === "doctor") {
      const doc = err.doctor, next = nextDateFor(doc, d.date);
      err.chips = next ? [`${fmtShort(next)} with ${doc.short}`] : [];
      return fill(R.doctorUnavailable, { doctor: `<b>${esc(doc.name)}</b>`, short: doc.short, weekday: weekdayPlural(d.date),
        next: next ? relDate(next) : "—", range: rangeText(doc), date: fmtDate(d.date) }) +
        docCards(availableDoctors(d.date, null), null, (x) => x.name);
    }
    if (err.code === "doctorHours" || err.code === "doctorClash") {
      const doc = d.doctor;
      return fill(err.code === "doctorHours" ? R.timeDoctor : R.doctorTimeClash, { doctor: doc.name, range: rangeText(doc),
        weekday: d.date ? weekdayPlural(d.date) : "that day", date: d.date ? fmtDate(d.date) : "that day", time: minToLabel(err.min) });
    }
    const texts = {
      date: { impossible: R.dateImpossible, past: R.datePast, sunday: R.dateSunday, closed: R.dateClosed, far: R.dateFar, todayLate: R.dateTodayLate, unclear: R.dateUnclear },
      time: { range: R.timeRange, late: R.timeLate, past: R.timePast, unclear: R.timeUnclear }
    };
    return fill(texts[err.field][err.code] || R.rephrase);
  }
  function ackText(added, intro) {
    const d = Flow.data, bits = [];
    const withDoc = d.doctor && added.includes("doctor") ? ` with <b>${esc(d.doctor.name)}</b>` : "";
    let lead = "";
    if (Flow.earliest && added.includes("date")) {
      lead = `The earliest available slot is <b>${relDate(d.date)}</b>` + (d.time != null ? ` at <b>${timeLabel(d.time)}</b>` : "") +
        (d.doctor ? ` with <b>${esc(d.doctor.name)}</b> (${esc(d.doctor.specialty)})` : "") + ". ";
      Flow.earliest = false;
    } else if (added.includes("date")) {
      bits.push(`<b>${fmtDate(d.date)}</b>` + (added.includes("time") ? ` at <b>${timeLabel(d.time)}</b>` : d.part ? ` (${d.part})` : "") + withDoc);
    } else if (added.includes("time")) bits.push(`<b>${timeLabel(d.time)}</b>` + withDoc);
    else if (added.includes("doctor")) bits.push(`<b>${esc(d.doctor.name)}</b> (${esc(d.doctor.specialty)})`);
    if (added.includes("phone")) bits.push("your phone number");
    if (added.includes("reason") && (bits.length || lead)) bits.push(`the reason for your visit (${esc(d.reason.toLowerCase())})`);
    const hi = added.includes("name") ? `Thank you, ${esc(firstName(d.name))}! `
      : intro ? (Flow.active === "book" ? "Wonderful, let's get you booked in! 😊 " : "Of course, I can help with that. ") : "Great! ";
    return hi + lead + (bits.length ? `I've noted ${joinAnd(bits)}. ` : "");
  }
  function changedText(changed) {
    const d = Flow.data;
    const label = {
      name: `your name to <b>${esc(d.name || "")}</b>`, phone: `your phone number to <b>${esc(d.phone || "")}</b>`,
      date: d.date ? `the date to <b>${fmtDate(d.date)}</b>` : "the date", time: d.time != null ? `the time to <b>${timeLabel(d.time)}</b>` : "the time",
      doctor: d.doctor ? `the doctor to <b>${esc(d.doctor.name)}</b>` : "the doctor", reason: `the reason to <b>${esc(d.reason || "")}</b>`
    };
    return `No problem — I've updated ${joinAnd(changed.map((k) => label[k]))}.`;
  }

  // After new data: report errors, acknowledge what was captured, then ask for what's still missing.
  function advance(r, opts = {}) {
    const d = Flow.data;
    if (r.errors.length) {
      const [err, extra] = r.errors;
      const lead = r.changed.length ? changedText(r.changed) + " " : r.added.length ? ackText(r.added, opts.intro) : "";
      let html = lead + errorText(err);
      if (extra && extra.field === "time" && (extra.code === "range" || extra.code === "late"))
        html += " " + fill(R.timeAlso, { time: minToLabel(extra.min) });
      Flow.step = err.field;
      return invalid(err.field, html, err.chips || chipsFor(err.field));
    }
    const next = nextStep();
    let prefix = "";
    if (r.changed.length) prefix = changedText(r.changed) + " ";
    else if (r.added.length && !(r.added.length === 1 && r.added[0] === opts.step)) prefix = ackText(r.added, opts.intro);
    // Recommend the right specialist as soon as we know the reason (and the date)
    const rec = recDoc(d);
    if (Flow.active === "book" && rec && !d.doctor && d.date && !Flow.recNoted && next !== "doctor") {
      prefix += recommendText(rec, d.date) + " ";
      Flow.recNoted = true;
    }
    if (next === "submit") return submitRequest();
    askStep(next, { prefix });
  }

  function fieldFromText(n) {
    if (/\b(doctor|dentist|dr)\b/.test(n)) return Flow.active === "book" ? "doctor" : null;
    if (/\bname\b/.test(n)) return "name";
    if (/\b(phone|number|mobile)\b/.test(n)) return "phone";
    if (/\b(date|day)\b/.test(n)) return "date";
    if (/\b(time|hour)\b/.test(n)) return "time";
    if (/\breason\b/.test(n) && Flow.active === "book") return "reason";
    return null;
  }

  /* ---------- Wrong-input handling ----------
     1st wrong attempt  → the friendly, detailed message (with an example)
     2nd+ wrong attempt → a short message, rotated so it never repeats twice in a row
     3rd+ wrong attempt → also offer the clinic phone number
     The counter resets as soon as the patient enters something valid. */
  const SHORT_ERRORS = {
    name: () => ["Please enter a valid name.",
                 "Hmm, that still doesn't look right. Please enter your full name (letters only).",
                 "Please type your name using letters only."],
    phone: () => ["Please enter a valid phone number.",
                  "Hmm, that still doesn't look right. Please enter a valid phone number.",
                  "Please enter a valid phone number (digits only)."],
    date: () => ["Please enter a valid date (Monday to Saturday).",
                 "Hmm, that still doesn't look right. Please enter a valid date.",
                 "Please tap one of the dates below, or type one like “Oct 12”."],
    time: () => ["Please enter a valid time.",
                 `Hmm, that still doesn't look right. Please enter a time between ${minToShort(OPEN_MIN)} and ${minToShort(LAST_MIN)}.`,
                 "Please tap one of the times below, or type one like “3:30 PM”."],
    doctor: () => ["Please choose one of the available doctors.",
                   "Please tap one of the doctors above, or “Any doctor”."],
    reason: () => ["Please enter a short reason for your visit.",
                   "Please tap one of the options below, or type a short reason."],
    confirm: () => ["Please reply Yes or Edit.",
                    "Hmm, I didn't catch that. Tap “Yes, confirm” to book, or “Edit details” to make changes."]
  };
  function resetFails() { Flow.failField = null; Flow.failCount = 0; }
  function invalid(field, detailedHtml, chips) {
    Flow.failCount = Flow.failField === field ? Flow.failCount + 1 : 1;
    Flow.failField = field;
    let html = detailedHtml;
    if (Flow.failCount >= 2) {
      const options = SHORT_ERRORS[field]();
      html = options[(Flow.failCount - 2) % options.length];       // rotates → never the same line twice in a row
    }
    if (Flow.failCount >= 3) html += `<br>Having trouble? You can also call us at ${fill("{phone}")}.`;
    return bot(html, chips);
  }
  const STEP_INVALID = { name: "nameInvalid", phone: "phoneInvalid", date: "dateUnclear", time: "timeUnclear", doctor: "doctorInvalid",
    reason: "reasonInvalid", confirm: "confirmInvalid", editPick: "confirmInvalid" };

  /* =====================================================================
     ROUTER (booking in progress) — priority: exit → emergency/questions →
     booking data → step input. The pending step is never lost.
     ===================================================================== */
  function handleFlow(text) {
    const a = analyze(text), n = a.n, step = Flow.step, book = Flow.active === "book", s = a.scores;
    if (!n) return bot(R.rephrase, chipsFor(step));
    if (a.injection) return bot(esc(CONFIG.bot.outOfScope));

    // Exit words
    if (!book && step === "date" && /^(just )?cancel( it| my appointment| the appointment| appointment)?$/.test(n)) {
      Flow.data.cancelOnly = true;
      return submitRequest();
    }
    if (ABORT_RE.test(n) || (step !== "confirm" && step !== "editPick" && /^(no|nope|nah)$/.test(n))) {
      endFlow();
      return bot(R.stopped.replace("{what}", book ? "booking" : "request"), CONFIG.bot.quickReplies);
    }
    if (MY_BOOKING_RE.test(n)) { showMyBookings(); return continuePrompt(); }

    const confirming = step === "confirm" || step === "editPick";
    const e = extractEntities(text, confirming ? null : step);
    if (book && (s.book >= 3 || hasCore(e)) && !a.question) { const reason = reasonFrom(a); if (reason) e.reason = reason; }
    const data = hasData(e) || (!!e.reason && Flow.data.reason == null);
    const ans = buildAnswer(a, e, true);

    // Reason for visit is free text — unless it's clearly a question, new data or an emergency
    if (step === "reason" && !hasData(e) && !a.question && !(a.urgent && a.tokens.length > 4)) {
      if (a.gibberish || text.trim().length < 2) return invalid("reason", R.reasonInvalid, chipsFor("reason"));
      return advance(applyEntities({ reason: text.trim().slice(0, 120) }), { step });
    }

    // A plain name at the name step is the answer (even if it matches a doctor's surname, e.g. "Omar Khan")
    if (step === "name" && !a.question && !a.urgent && !hasCore(e)) {
      const candidate = stripIntro(text);
      if (nameValid(candidate)) return advance(applyEntities({ name: titleCase(candidate) }), { step });
    }

    // 1) Emergencies & questions are always answered first
    if (ans && (a.question || a.urgent || !data || ans.info)) {
      bot(ans.html.replace(/\s*Would you like (me )?to book (one|an appointment)( for you)?\?/g, ""), ans.info ? ans.chips : null);   // already booking
      if (!data || ans.info) return continuePrompt();
    }

    // 2) Booking data anywhere in the message (also handles "actually make it Thursday" / "change doctor to Dr. Maria")
    if (data) {
      if (step === "name" && !e.name) {
        const candidate = stripIntro(e.rest || "");
        if (candidate && nameValid(candidate)) e.name = titleCase(candidate);
      }
      return advance(applyEntities(e), { step });
    }

    // 3) Confirmation step
    if (confirming) {
      const field = fieldFromText(n);
      if (step === "editPick" && field) return askStep(field, { prefix: "Sure! " });
      if (EDIT_RE.test(n)) {
        if (field) return askStep(field, { prefix: "Sure! " });
        Flow.step = "editPick";
        return bot(R.editWhich, EDIT_CHIPS);
      }
      if (YES_RE.test(n) && !NO_RE.test(n)) return submitRequest();
      if (NO_RE.test(n)) { endFlow(); return bot(R.notBooked, CONFIG.bot.quickReplies); }
    }

    // 4) Plain answer to the pending step
    if (step === "name") {
      const candidate = stripIntro(text);
      if (nameValid(candidate)) return advance(applyEntities({ name: titleCase(candidate) }), { step });
    }
    if (s.bye >= 3) return bot(fill(intentById.bye.answer));
    if (s.thanks >= 3 || s.greeting >= 3) {
      bot(s.thanks >= 3 ? R.thanksMidFlow : fill(intentById.greeting.answer).replace(" How can I help you today?", ""));
      return continuePrompt();
    }
    if (/^(yes|yeah|yep|yup|sure|ok|okay|yes please|continue|go on|lets continue)$/.test(n)) return askStep(step, { short: true });
    if (a.offTopic && !a.onTopic) return bot(esc(CONFIG.bot.outOfScope));

    // 5) Nothing usable → wrong-input message for this step
    return invalid(confirming ? "confirm" : step, R[STEP_INVALID[step]], chipsFor(step));
  }

  function submitRequest() {
    const d = Flow.data, book = Flow.active === "book", pending = Flow.pending || [];
    const rec = {
      id: Date.now(),
      type: book ? "new" : d.cancelOnly ? "cancel" : "reschedule",
      name: d.name, phone: d.phone,
      date: d.date && !d.cancelOnly ? toISO(d.date) : null,
      time: d.time != null && !d.cancelOnly ? timeLabel(d.time) : null,
      doctor: d.doctor ? `${d.doctor.name} (${d.doctor.specialty})` : null,
      reason: book ? d.reason : d.cancelOnly ? "Cancel appointment" : "Reschedule appointment",
      createdAt: new Date().toISOString()
    };
    endFlow();
    saveRequest(rec);   // In production: POST this to your backend → email / WhatsApp / Google Sheets / CRM
    if (rec.type === "new") Session.bookings.push(rec);

    if (rec.type === "new") bot("✅ Your appointment request has been sent. Our team will call you to confirm.");
    else if (rec.type === "cancel") bot("✅ Your cancellation request has been sent. Our team will call you shortly to confirm.");
    else bot(`✅ Your request to move your appointment to <b>${fmtDate(d.date)}</b> at <b>${rec.time}</b> has been sent. Our team will call you shortly to confirm.`);

    // Booking for more than one person → start the next booking right away
    if (book && pending.length) {
      const who = pending[0];
      Flow.active = "book"; Flow.pending = pending.slice(1); Flow.prevPhone = d.phone;
      return askStep("name", { prefix: fill(R.multiNext, { who }) + " ", html: `May I have ${who}'s <b>full name</b>?` });
    }
    bot("Is there anything else I can help you with?", CONFIG.bot.quickReplies);
  }

  /* ---------- Requests: stored locally + announced to the host page ---------- */
  const STORE_KEY = "brightsmile_demo_requests";
  function saveRequest(rec) {
    try {
      const all = JSON.parse(localStorage.getItem(STORE_KEY)) || [];
      localStorage.setItem(STORE_KEY, JSON.stringify([rec, ...all]));
    } catch (e) { /* storage unavailable — ignore */ }
    // Any page can listen: window.addEventListener("brightsmile:request", e => console.log(e.detail))
    window.dispatchEvent(new CustomEvent("brightsmile:request", { detail: rec }));
  }

  /* =====================================================================
     OPEN / CLOSE / WIRING
     ===================================================================== */
  let prevBodyOverflow = "", tooltipTimer;
  function setUnread(n) { unread = n; unreadEl.textContent = n; unreadEl.classList.toggle("show", n > 0); }
  function showTooltip(autoHideMs) {
    if (isOpen()) return;
    tooltip.classList.add("show");
    clearTimeout(tooltipTimer);
    if (autoHideMs) tooltipTimer = setTimeout(hideTooltip, autoHideMs);
  }
  function hideTooltip() { clearTimeout(tooltipTimer); tooltip.classList.remove("show"); }

  function openChat() {
    root.classList.add("open");
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", "Close chat");
    hideTooltip(); setUnread(0);
    if (isMobile()) { prevBodyOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; }
    if (!started) { started = true; welcome(); }
    setTimeout(() => { if (!isMobile()) input.focus(); }, 320);
  }
  function closeChat() {
    root.classList.remove("open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Open chat");
    document.body.style.overflow = prevBodyOverflow;
  }
  function welcome() {
    const sep = document.createElement("div");
    sep.className = "day-sep"; sep.textContent = "Today";
    chatBody.appendChild(sep);
    bot(esc(CONFIG.bot.welcome), CONFIG.bot.quickReplies);
  }
  function restart() {
    session++; queue = Promise.resolve(); endFlow();
    chatBody.innerHTML = ""; setChips([]);
    welcome();
  }

  launcher.onclick = () => (isOpen() ? closeChat() : openChat());
  launcher.addEventListener("mouseenter", () => showTooltip());
  launcher.addEventListener("mouseleave", () => hideTooltip());
  tooltip.onclick = openChat;
  $(".head-btn.close").onclick = closeChat;
  $(".head-btn.restart").onclick = restart;
  $(".chat-input").onsubmit = (e) => { e.preventDefault(); sendUser(input.value); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) closeChat(); });

  // Show the tooltip + unread badge a few seconds after page load
  if (CONFIG.bot.showTooltipAfterMs > 0) {
    setTimeout(() => { if (!started) { showTooltip(8000); setUnread(1); } }, CONFIG.bot.showTooltipAfterMs);
  }

  // Optional JS API for the host site, e.g. a "Book now" button:
  //   <button onclick="BrightSmileChat.book()">Book now</button>
  window.BrightSmileChat = {
    open: openChat,
    close: closeChat,
    book: () => { openChat(); if (!Flow.active) queue.then(() => sendUser("Book Appointment")); }
  };

  function mount() { document.body.appendChild(host); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
