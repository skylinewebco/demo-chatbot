# Demo Chatbot

A ready-to-use AI receptionist chatbot for a dental clinic ("Bright Smile Dental Clinic" — a fictional demo). It runs entirely in the browser with no API key and no dependencies.

**Live demo:** https://skylinewebco.github.io/demo-chatbot/test.html

## What it does

- Answers patient questions about services, prices, opening hours, location, insurance, payments and doctors (typo-tolerant, understands different wordings)
- Books appointments step by step: name, phone, date, reason, doctor and time, then shows a summary to confirm
- Shows only the doctors available on the chosen day, recommends the right specialist, and checks times against each doctor's hours
- Understands full messages like *"Next Tuesday at 7:45pm with Dr. Ali for root canal"*
- Handles emergencies first, never gives medical advice, and politely declines off-topic questions
- Dark theme, mobile responsive, and isolated with Shadow DOM so it never clashes with your site's CSS

## Add it to any website

Copy `chatbot.js` to your site and add this one line before `</body>`:

```html
<script src="chatbot.js"></script>
```

That's it — a chat button appears in the bottom-right corner.

## Customize

All clinic details (name, phone numbers, hours, prices, doctors, and Q&A) live in the `CONFIG` object at the top of `chatbot.js`. Edit it to set up the chatbot for a new client.

## Files

- `chatbot.js` — the complete chatbot (design, logic and configuration)
- `test.html` — a blank page for testing the chatbot on its own
