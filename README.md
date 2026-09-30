# Demo Chatbot

AI chatbot demos for five industries, built on **one engine with separate configs**. Each bot answers only about its own business and takes bookings (appointments, tables, property viewings or trial classes). It runs entirely in the browser, with no API key and no dependencies.

**Live demo:** https://skylinewebco.github.io/demo-chatbot/

| Industry | Business (fictional) | Direct link |
|---|---|---|
| Dental Clinic | Bright Smile Dental Clinic | `?type=dental` |
| Restaurant | Spice Garden | `?type=restaurant` |
| Real Estate | Prime Homes Realty | `?type=realestate` |
| Beauty Salon | Glow Studio | `?type=salon` |
| Gym & Fitness | Iron Pulse Fitness | `?type=gym` |

- With no `?type`, the page shows all five industry cards, and the chat header has a "Switch industry" button.
- With `?type=…`, the page shows only that business, and its chatbot opens automatically.

## What the bots do

- Answer questions about the business: prices, hours, location, staff and 25+ Q&As each. They handle typos and several questions in one message.
- Take bookings step by step and validate names, phone numbers, dates and times, using the device's real date for "today", "tomorrow" and "next Monday".
- Show which staff members are available on a given day, recommend the right specialist, and check times against that person's hours.
- Answer the actual question first and then continue the booking. Details can be changed mid-booking, for example "actually make it Thursday".
- Give a polite one-line reply to anything off-topic, including other industries and prompt-injection attempts.
- Use a dark design with an accent colour per business. They're mobile-friendly and isolated with Shadow DOM.

## Conversation features

- **Waits for you to finish:** every message and keystroke restarts a 4-second timer. Then all queued messages are read together and answered in one reply.
- **Phone and/or email:** either or both are accepted and validated, with friendly, varied error messages.
- **Multiple bookings:** "2 appointments", "for me and my wife", "2 tables", two properties or a friend joining a trial class. The bot books each one in turn (reusing the same contact if you like), then shows one combined summary.
- **Multiple services in one booking:** e.g. "cleaning and surgery" or "haircut and gel nails".
- **After booking:** one warm closing message with an "Add to Calendar" (.ics) button, then "anything else?" once and a friendly goodbye.
- **Other touches:** "Seen" ticks, a "Start new chat" button, and the chat survives a page refresh during the same visit.

## Add a chatbot to any website

```html
<script src="chatbot.js" data-type="restaurant"></script>
```

The engine loads `configs/restaurant.js` automatically; keep the `configs` folder next to `chatbot.js`. Without `data-type`, it loads the dental bot.

## New client in 3 steps

1. Copy a file in `configs/`, for example `configs/salon.js` → `configs/my-client.js`.
2. Change the key at the top (`.salon =` → `["my-client"] =`), then edit the business info, hours, staff, prices, booking fields and Q&As.
3. Embed it with `<script src="chatbot.js" data-type="my-client"></script>`.

## Files

- `chatbot.js`: the chatbot engine (design, logic and booking flow)
- `configs/*.js`: one config per business
- `index.html`: the demo landing page and the direct-link pages
- `netlify.toml`: Netlify settings (serves the project root, no build step)
