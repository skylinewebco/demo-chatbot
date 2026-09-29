/* =====================================================================
   GYM & FITNESS — "Iron Pulse Fitness" (fictional demo)
   Copy this file to create a new client's chatbot, then edit the data.
   ===================================================================== */
(function () {
  const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hm = (t) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}${m ? ":" + String(m).padStart(2, "0") : ""} ${h < 12 ? "AM" : "PM"}`; };
  // Classes: days 0 = Sunday … 6 = Saturday, start times in 24h format
  const classes = [
    { id: "yoga",     label: "Yoga",                    days: [1, 3, 5], times: ["07:00", "18:00"], coach: "Maya Chen",     match: ["yoga", "vinyasa", "stretching"] },
    { id: "hiit",     label: "HIIT",                    days: [2, 4],    times: ["06:30", "19:00"], coach: "Jake Morrison", match: ["hiit", "high intensity", "interval", "bootcamp"] },
    { id: "spin",     label: "Spin",                    days: [1, 2, 4], times: ["07:30", "18:30"], coach: "Emma Walsh",    match: ["spin", "spinning", "cycling", "bike class"] },
    { id: "zumba",    label: "Zumba",                   days: [3, 6],    times: ["10:00", "17:00"], coach: "Emma Walsh",    match: ["zumba", "dance", "dance fitness"] },
    { id: "strength", label: "Strength & Conditioning", days: [1, 3, 5], times: ["19:00"],          coach: "Jake Morrison", match: ["strength", "conditioning", "weights class", "lifting"] },
    { id: "boxing",   label: "Boxing Fit",              days: [2, 6],    times: ["11:00", "18:00"], coach: "Leo Grant",     match: ["boxing", "kickboxing", "boxing fit"] },
    { id: "pilates",  label: "Pilates",                 days: [0, 2, 4], times: ["09:00"],          coach: "Maya Chen",     match: ["pilates", "core"] }
  ];
  const when = (c) => `${c.days.map((d) => DAY[d]).join(", ")} at ${c.times.map(hm).join(" & ")}`;
  const scheduleHtml = "Here's our weekly class schedule 🗓️" + `<div class="price-list">` +
    classes.map((c) => `<div class="pl-row"><span><b>${c.label}</b><br>${c.coach}</span><span>${c.days.map((d) => DAY[d]).join(", ")}<br>${c.times.map(hm).join(" & ")}</span></div>`).join("") +
    `</div><div class="pl-note">Your first class is free — just book a trial!</div>`;
  const plansHtml = "Our membership plans 💪" + `<div class="price-list">` +
    [["Basic", "$29/month", "Gym floor & cardio"], ["Standard", "$49/month", "+ unlimited classes"], ["Premium", "$79/month", "+ 2 PT sessions/month, sauna & guest pass"],
     ["Annual (Standard)", "$490/year", "2 months free"], ["Student", "$25/month", "With valid student ID"], ["Day pass", "$12", "Full access for a day"]]
      .map(([n, p, d]) => `<div class="pl-row"><span><b>${n}</b><br>${d}</span><span>${p}</span></div>`).join("") +
    `</div><div class="pl-note">No joining fee. Try a free class first!</div>`;

  (window.ChatbotConfigs = window.ChatbotConfigs || {}).gym = {
    id: "gym",
    industry: "Gym & Fitness",
    tagline: "Explains memberships, shows the class schedule and books free trial classes.",

    business: {
      name: "Iron Pulse Fitness",
      address: "310 Summit Road",
      city: "Springfield",
      phone: "+1 (555) 567-8901",
      whatsapp: "+1 (555) 567-8901",
      email: "hello@ironpulsefitness.com"
    },

    theme: { accent: "#67E8F9", accent2: "#A3E635", glow: "103,232,249", glow2: "163,230,53", blob: "34,211,238", icon: "dumbbell" },

    hours: {
      days: { 0: ["07:00", "21:00"], 1: ["05:00", "23:00"], 2: ["05:00", "23:00"], 3: ["05:00", "23:00"], 4: ["05:00", "23:00"], 5: ["05:00", "23:00"], 6: ["07:00", "21:00"] },
      lastSlotBeforeClose: 60,
      display: "Monday to Friday 5:00 AM – 11:00 PM, Saturday & Sunday 7:00 AM – 9:00 PM",
      shortDisplay: "Mon–Fri 5 AM – 11 PM, Sat–Sun 7 AM – 9 PM",
      daysText: "every day",
      closedDisplay: "We're open 7 days a week."
    },

    prices: {
      basic:    { label: "Basic membership",    value: "$29/month" },
      standard: { label: "Standard membership", value: "$49/month" },
      premium:  { label: "Premium membership",  value: "$79/month" },
      annual:   { label: "Annual (Standard)",   value: "$490/year" },
      student:  { label: "Student membership",  value: "$25/month" },
      dayPass:  { label: "Day pass",            value: "$12" },
      pt:       { label: "Personal training (1 session)", value: "$50" },
      ptPack:   { label: "Personal training (10 sessions)", value: "$450" }
    },

    staff: {
      intent: "trainers", singular: "trainer", plural: "trainers", label: "Trainer", words: ["coach", "instructor"], titles: [], shortPrefix: "",
      priority: ["personalTraining", "yogaQ", "boxingQ", "hiitQ", "spinQ"],
      serviceLabels: { personalTraining: "personal training", yogaQ: "yoga & pilates", boxingQ: "boxing", hiitQ: "HIIT & strength", spinQ: "spin & zumba" },
      list: [
        { id: "jake",   name: "Jake Morrison", specialty: "Strength & HIIT Coach",        days: [1, 2, 3, 4, 5], from: "06:00", to: "20:00", treats: ["hiitQ"] },
        { id: "maya",   name: "Maya Chen",     specialty: "Yoga & Pilates Instructor",    days: [0, 1, 2, 3, 4, 5], from: "07:00", to: "19:00", treats: ["yogaQ"] },
        { id: "carlos", name: "Carlos Rivera", specialty: "Personal Trainer",             days: [2, 4, 6], from: "12:00", to: "21:00", treats: ["personalTraining"] },
        { id: "emma",   name: "Emma Walsh",    specialty: "Spin & Zumba Instructor",      days: [1, 2, 3, 4, 6], from: "07:00", to: "19:00", treats: ["spinQ"] },
        { id: "leo",    name: "Leo Grant",     specialty: "Boxing Coach",                 days: [2, 5, 6], from: "10:00", to: "20:00", treats: ["boxingQ"] }
      ].map((t) => ({ ...t, short: t.name.split(" ")[0] }))
    },

    services: ["Gym floor & cardio", "Group classes", "Personal training", "Sauna & recovery", "Free trial classes"],

    booking: {
      noun: "trial class",
      steps: ["name", "phone", "class", "date", "time"],
      summary: ["name", "phone", "class", "date", "time"],
      multiPerson: true,
      maxDaysAhead: 30,
      fields: {
        class: {
          type: "choice", label: "Class", words: "class|workout", changeLabel: "the class",
          prompt: "Which <b>class</b> would you like to try for free?", shortPrompt: "Which <b>class</b> would you like to try?",
          invalid: "Please choose one of our classes below.",
          ack: "a free <b>{value}</b> class",
          options: classes.map((c) => ({
            id: c.id, label: c.label, match: c.match, days: c.days, times: c.times,
            info: `<b>${c.label}</b> runs ${when(c)} with ${c.coach}. Your first class is free! 💪`,
            chips: ["Book a free trial", "Class schedule"]
          }))
        }
      }
    },

    bot: {
      name: "Iron Pulse Assistant",
      welcome: "Hey there! 💪 Welcome to Iron Pulse Fitness. How can I help you today? Ask about memberships, classes or trainers — or I can book you a free trial class.",
      quickReplies: ["Book a free trial", "Membership plans", "Class schedule", "Timings"],
      tooltip: "Ready to train? Chat with us!",
      showTooltipAfterMs: 2500,
      optionIntents: ["classes", "trial", "book", "yogaQ", "hiitQ", "spinQ", "boxingQ"],
      overlaps: [["student", "memberships"], ["dayPass", "memberships"], ["personalTraining", "trainers"], ["freeze", "memberships"], ["cancelMembership", "memberships"], ["joiningFee", "memberships"], ["trial", "classes"]],
      topicWords: ["gym", "workout", "fitness", "class", "classes", "trainer", "membership", "exercise", "training", "yoga", "cardio", "weights", "sauna"],
      offTopicWords: ["weather", "politics", "political", "election", "president", "government", "movie", "movies", "song", "music", "code", "coding", "python", "javascript", "programming", "bitcoin", "crypto", "stock", "stocks", "news", "joke", "poem", "game", "homework", "math", "flight", "hotel"],
      replies: {
        introBook: "Awesome, let's get you a free trial class! 💪 ",
        askName: "Awesome, let's get you a free trial class! 💪 May I have your <b>full name</b>?",
        summaryTitle: "Trial class summary",
        sentNew: "✅ Your free trial class request has been sent. Our team will call you to confirm — bring comfy workout clothes and a water bottle! 💧",
        askDate: "Which <b>date</b> suits you best? You can type something like “tomorrow”, “next Monday” or “Oct 12”.",
        compareStaff: "All our trainers are certified and experienced in their specialties: {staffShortList}. You're in great hands with any of them!",
        staffFees: "Group classes are included in Standard and Premium memberships with every trainer. Personal training is {price:pt} per session, whichever trainer you choose.",
        openOn: "Yes, we're open on <b>{date}</b> from {openShort} to {closeShort}. Want to book a free trial class?",
        pricesIntro: "Here are our prices:",
        pricesNote: "No joining fee — and your first class is free!"
      }
    },

    faq: [
      { id: "reschedule", action: "reschedule",
        strong: ["reschedule", "cancel my trial", "cancel trial", "cancel my class", "cancel class", "change my trial", "move my trial", "change booking", "different date", "another date", "another time"], weak: [] },
      { id: "book", action: "book",
        strong: ["book", "booking", "free trial", "trial class", "try a class", "book a class", "sign up for a class", "reserve"], weak: ["trial", "try", "available", "availability", "join a class"] },
      { id: "medical", priority: 1,
        strong: ["injury", "injured", "pain", "hurt", "knee", "back pain", "heart", "blood pressure", "pregnant", "pregnancy", "asthma", "diabetes", "surgery", "medical", "doctor", "medical condition", "health condition", "dizzy"], weak: ["safe"],
        answer: "Please check with your doctor before starting or changing your training — I'm not able to give medical advice. Once you have the all-clear, our trainers can adapt workouts to suit you. 💙",
        chips: ["Trainers", "Book a free trial"] },
      { id: "diet", priority: 2,
        strong: ["diet", "diet plan", "meal plan", "nutrition", "calories", "supplement", "supplements", "protein", "creatine", "lose weight fast", "what should i eat", "eat", "keto", "fasting", "steroids"], weak: ["food", "weight loss"],
        answer: "I'm not able to give diet or supplement advice — please speak to your doctor or a registered dietitian. Our trainers can help you with a training plan that supports your goals! 💪",
        chips: ["Personal training", "Membership plans"] },
      { id: "memberships",
        strong: ["membership", "memberships", "membership plans", "plans", "plan", "join", "sign up", "monthly fee", "subscription"], weak: ["package", "packages"],
        answer: plansHtml, chips: ["Book a free trial", "Student plan", "Freeze membership"] },
      { id: "student",
        strong: ["student", "students", "student discount", "student plan", "college", "university"], weak: [],
        answer: "Our <b>Student plan</b> is {price:student} with a valid student ID — full gym access plus classes at off-peak times.", chips: ["Membership plans", "Book a free trial"] },
      { id: "dayPass",
        strong: ["day pass", "drop in", "one day", "single visit", "guest pass"], weak: [],
        answer: "A <b>Day pass</b> is {price:dayPass} for full access to the gym and classes for one day. Premium members also get a free guest pass each month.", chips: ["Membership plans"] },
      { id: "joiningFee",
        strong: ["joining fee", "sign up fee", "registration fee", "hidden fees", "contract"], weak: [],
        answer: "There's <b>no joining fee</b> and no long contract — monthly plans can be cancelled with 30 days' notice.", chips: ["Membership plans"] },
      { id: "trial",
        strong: ["is the trial free", "free class", "first class free", "trial free", "try before", "free session"], weak: ["free"],
        answer: "Yes! Your <b>first class is completely free</b> — pick any class on our schedule and I'll book it for you.", chips: ["Book a free trial", "Class schedule"] },
      { id: "classes",
        strong: ["classes", "class schedule", "schedule", "timetable", "group classes", "what classes"], weak: ["class", "group"],
        answer: scheduleHtml, chips: ["Book a free trial", "Trainers"] },
      { id: "yogaQ", strong: ["yoga", "pilates"], weak: [],
        answer: "Yoga runs Mon, Wed & Fri at 7 AM & 6 PM, and Pilates Tue, Thu & Sun at 9 AM — both with {specialist:yogaQ}.", chips: ["Book a free trial", "Class schedule"] },
      { id: "hiitQ", strong: ["hiit", "strength", "conditioning", "bootcamp"], weak: [],
        answer: "HIIT runs Tue & Thu at 6:30 AM & 7 PM, and Strength & Conditioning Mon, Wed & Fri at 7 PM — with {specialist:hiitQ}.", chips: ["Book a free trial", "Class schedule"] },
      { id: "spinQ", strong: ["spin", "spinning", "cycling", "zumba", "dance"], weak: [],
        answer: "Spin runs Mon, Tue & Thu at 7:30 AM & 6:30 PM, and Zumba Wed & Sat at 10 AM & 5 PM — with {specialist:spinQ}.", chips: ["Book a free trial", "Class schedule"] },
      { id: "boxingQ", strong: ["boxing", "kickboxing", "martial arts"], weak: [],
        answer: "Boxing Fit runs Tue & Sat at 11 AM & 6 PM with {specialist:boxingQ}. Gloves are provided for your first class! 🥊", chips: ["Book a free trial", "Class schedule"] },
      { id: "personalTraining",
        strong: ["personal training", "personal trainer", "pt", "one on one", "1 on 1", "private session", "private training"], weak: [],
        answer: "Personal training is {price:pt} per session, or {price:ptPack} for a pack of 10, with {specialist:personalTraining} or any of our trainers. Premium members get 2 sessions a month included.",
        chips: ["Trainers", "Membership plans"] },
      { id: "trainers",
        strong: ["trainer", "trainers", "coach", "coaches", "instructor", "instructors", "who are", "team", "staff"], weak: ["experience", "experienced", "certified"],
        answer: "Our team: {staffList}. You'll be in great hands! 💪", chips: ["Book a free trial", "Personal training"] },
      { id: "facilities",
        strong: ["facilities", "equipment", "sauna", "shower", "showers", "locker", "lockers", "changing room", "pool", "swimming", "towel", "towels", "free weights", "machines", "cardio"], weak: [],
        answer: "We have a full free-weights area, strength machines, a cardio zone, 3 studios, a <b>sauna</b>, showers and free lockers. Towels are free for Premium members. (We don't have a pool.)",
        chips: ["Membership plans", "Class schedule"] },
      { id: "freeze",
        strong: ["freeze", "pause", "hold", "suspend", "freeze membership", "vacation", "holiday"], weak: [],
        answer: "You can <b>freeze your membership</b> for up to 2 months a year (free for Premium, $5/month otherwise) — just ask at the front desk or call {phone}.",
        chips: ["Cancel membership"] },
      { id: "cancelMembership",
        strong: ["cancel membership", "cancel my membership", "end membership", "quit the gym", "stop membership", "cancellation"], weak: ["cancel"],
        answer: "You can cancel any monthly plan with <b>30 days' notice</b> — no cancellation fee. Please visit the front desk or email {email}.",
        chips: ["Freeze membership"] },
      { id: "age",
        strong: ["age", "minimum age", "how old", "teen", "teenager", "kids", "children", "under 18"], weak: [],
        answer: "Members need to be <b>16 or older</b>. Teens aged 14–15 can train with a parent or guardian present.", chips: ["Membership plans"] },
      { id: "beginners",
        strong: ["beginner", "beginners", "never been to a gym", "first time", "unfit", "out of shape", "new to gym"], weak: [],
        answer: "Beginners are so welcome here! 😊 Every new member gets a free induction, and all our classes have easier options. A free trial class is a great way to start.",
        chips: ["Book a free trial", "Class schedule"] },
      { id: "bring",
        strong: ["what to bring", "what should i bring", "what to wear", "dress code", "shoes"], weak: ["bring", "wear"],
        answer: "Bring comfy workout clothes, trainers (sneakers), a water bottle and a towel. Lockers are free — just bring a padlock or borrow one at reception.", chips: ["Book a free trial"] },
      { id: "timings",
        strong: ["timing", "hours", "opening hours", "working hours", "what time", "24 7", "24 hours"], weak: ["open", "close", "closing", "time", "when"],
        answer: "We're open {hours}. {closed}", chips: ["Book a free trial", "Location"] },
      { id: "parking",
        strong: ["parking", "park", "car park", "garage"], weak: ["car", "drive"],
        answer: "Yes — free parking for members right next to the gym.", chips: ["Location"] },
      { id: "location",
        strong: ["location", "located", "address", "direction", "map", "google maps", "where are you", "how to reach", "find you"], weak: ["where", "street"],
        answer: "You'll find us at <b>{address}</b>.<br>{mapsLink}", chips: ["Timings", "Book a free trial"] },
      { id: "payment",
        strong: ["payment", "pay", "cash", "card", "credit", "debit", "direct debit", "apple pay", "visa", "mastercard"], weak: ["method"],
        answer: "Memberships are paid monthly by card or direct debit. We also accept cash for day passes.", chips: ["Membership plans"] },
      { id: "discount",
        strong: ["discount", "discounts", "offers", "special offer", "deal", "deals", "promo", "promotion", "coupon", "corporate", "couple"], weak: ["cheaper"],
        answer: "For current offers (including couples and corporate rates), please call us at {phone}.", chips: ["Membership plans"] },
      { id: "late",
        strong: ["late", "running late", "delayed", "delay"], weak: [],
        answer: "No worries — classes start on time, so please arrive 5 minutes early if you can. If you're running late, call us at {phone}.", chips: ["Class schedule"] },
      { id: "email",
        strong: ["email", "e mail", "mail", "email address"], weak: [],
        answer: "You can email us at {email}.", chips: ["Book a free trial"] },
      { id: "human",
        strong: ["real person", "human", "receptionist", "front desk", "talk to someone", "speak to someone", "whatsapp", "phone number", "contact number", "call you"], weak: ["talk", "call", "contact", "phone", "number"],
        answer: "You can call our team at {phone}, or message us on WhatsApp at {whatsapp}.", chips: ["Book a free trial"] },
      { id: "language",
        strong: ["spanish", "espanol", "french", "arabic", "urdu", "hindi", "german", "chinese", "language", "other language"], weak: ["speak"],
        answer: "Sorry, I can only chat in English right now, but our team can help you at {phone}." },
      { id: "prices", action: "prices",
        strong: ["price list", "prices", "rates"], weak: ["price", "cost", "how much", "charge", "expensive", "cheap", "afford"] },
      { id: "services", action: "services",
        strong: ["services", "what do you offer", "what do you have"], weak: ["offer", "provide"] },
      { id: "greeting",
        strong: ["hi", "hello", "hey", "hiya", "good morning", "good afternoon", "good evening", "salam", "assalam"], weak: [],
        answer: "Hey! 💪 How can I help you today?" },
      { id: "thanks",
        strong: ["thank", "thanks", "thx", "appreciate", "great", "perfect", "awesome"], weak: [],
        answer: "You're very welcome! See you at the gym. 💪" },
      { id: "bye",
        strong: ["bye", "goodbye", "see you", "good night"], weak: [],
        answer: "Thanks for chatting with us — keep moving and have a great day! 💪" }
    ]
  };
})();
