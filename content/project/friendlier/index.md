---
date: 2015-04-10
draft: false
title: 'Friendlier: Letting a Startup Fail Fast'
slug: friendlier
summary: Reflections on building, pitching, and ultimately losing a promising social
  app to a single API dependency.
thumbnail: /project/friendlier/images/featured.gif
thumbnailHd: /project/friendlier/images/featured-hd.gif
categories:
- Project
- Business
- Reflection
tags:
- Startup
- Android
- Social
- Business
- Failure
- API
toc: true
images:
- /project/friendlier/images/featured-hd.gif
---
{{< project-details
  timeline="2014-2015"
  languages="Java (Android)"
  school="Colorado College"
  role="CEO, Mobile Developer, Big Idea Finalist"
>}}

In our sophomore year at Colorado College, my best friend Anubrat and I set out to solve a problem we both felt deeply: how do you keep the connections you’ve made, when life and social media make it so easy to forget? The result was **Friendlier**—a mobile app that nudged you to reach out to friends you might otherwise lose touch with, using data, context, and a bit of gamification.

## The Big Idea (and the Big Pitch)

{{< youtube yQSyp_e19Es >}}

We poured our hearts into Friendlier, and it paid off—at least at first. We were named [finalists in a startup pitch competition](https://thecatalystnews.com/2015/04/03/startups-take-the-next-step-for-the-big-idea-competition/#:~:text=Friendlier%20is%20another,and%20Soeren%20Walls.) at our college, and even secured a verbal commitment from an angel investor. The pitch was simple: Friendlier helps you maintain your most important relationships by suggesting 3–5 friends to reach out to each day, crafting personalized messages, and rewarding you for keeping in touch. It was inspired by [Dunbar’s Number](https://en.wikipedia.org/wiki/Dunbar%27s_number), Seth Godin’s *[Tribes](https://share.google/c3Qw55e8zdqp0aioB)*, and our own struggles to stay connected.

## How Friendlier Worked

The app analyzed your contacts, social media, and calendar to figure out who you hadn’t talked to in a while, then suggested timely, context-aware messages. It stored data securely on-device, assigned an “importance” score to each friend, and sent push notifications at the best moments. The more you reached out, the more points you earned—leveling up your social life, one nudge at a time.

{{< figure src="/project/friendlier/images/screenshot.jpg" alt="A screenshot of the Android app" caption="A friend (Alexa) and a message you could send her with a single button click">}}

**Tech stack:** Java (Android), Facebook Graph API, SMS, Google Calendar, and more.

Here’s a taste of the code that powered our daily friend selection:

```java
// Pseudocode for daily friend selection
for (Contact friend : allContacts) {
    int score = calculateImportance(friend);
    if (score > threshold) {
        todaysList.add(friend);
    }
}
```

Friendlier’s contact analysis was pretty deep. Here’s a real snippet from the `ContactAnalyzer` class, which synced and enriched contacts with phone, email, and event data:

```java
public void syncAllPotentialContacts() {
    Thread thread = new Thread() {
        @Override
        public void run() {
            ContentResolver contentResolver = mContext.getContentResolver();
            Cursor cursor = contentResolver.query(
                PHONE_CONTENT_URI,
                new String[]{PHONE_CONTACT_ID, CONTACT_DISPLAY_NAME, RAWCONTACT_VERSION,
                    CONTACT_STARRED, CONTACT_LAST_TIME_CONTACTED, PHONE_NUMBER, PHONE_TYPE},
                CONTACT_HAS_PHONE_NUMBER + " = ? AND (" + PHONE_TYPE + " = ? OR " + PHONE_TYPE + " = ? )",
                new String[]{String.valueOf(1), String.valueOf(PHONE_TYPE_MAIN), String.valueOf(PHONE_TYPE_MOBILE)},
                null);
            // Loop through every contact (excluding those without phone numbers) in the phone.
            if (cursor.getCount() > 0) {
                while (cursor.moveToNext()) {
                    // ... get contact info, validate, enrich, and sync ...
                }
            }
            cursor.close();
        }
    };
    thread.start();
}
```

And here’s how Friendlier enriched a contact with birthdays and other events:

```java
Cursor eventCursor = contentResolver.query(
    DATA_CONTENT_URI,
    new String[] { EVENT_START_DATE, EVENT_TYPE, EVENT_LABEL },
    DATA_MIMETYPE + " = ? AND " + EVENT_CONTACT_ID + " = ? ",
    new String[] { EVENT_CONTENT_ITEM_TYPE, friend.getContactId() },
    null);
while (eventCursor.moveToNext()) {
    int eventType = eventCursor.getInt(eventCursor.getColumnIndex(EVENT_TYPE));
    String dateNum = eventCursor.getString(eventCursor.getColumnIndex(EVENT_START_DATE));
    // ... parse date, assign to friend ...
}
eventCursor.close();
```

## The Fatal Flaw: API Dependency

We were on top of the world—until we weren’t. Just a week after our investor agreed to fund us, Facebook deprecated the very API we depended on to fetch friends’ data. Overnight, Friendlier was dead in the water. There was no workaround, no pivot, no second chance. We learned the hard way: **never build your business on a single API you don’t control**. Or, as I like to say now: either don’t be dependent on a single API, or **[be](https://www.youtube.com/watch?v=fBpojbwbx48)** the API!

Here’s the API call that gave us everything, before it got taken away:

```java
String url = "https://graph.facebook.com/me/friends?fields=id,name";
String response = Util.openUrl(url, "GET", parameters);
JSONObject obj = Util.parseJson(response);
JSONArray array = obj.optJSONArray("data");
if (array != null) {
    for (int i = 0; i < array.length(); i++) {
        String name = array.getJSONObject(i).getString("name");
        String id = array.getJSONObject(i).getString("id");
        // ...
    }
}
```

## Business & Financials

We had ambitious plans: a free app for everyone, with a premium tier for power users and businesspeople (think LinkedIn integration, Google for Work, advanced analytics). Our financial projections modeled three rounds of investment ($14k, $30k, $50k) and a slow burn rate, with losses of ~$2k/month as we built toward growth. We believed that with time, Friendlier could become the next social media phenomenon. The spreadsheet said we’d need to keep raising or start earning fast.

## Lessons Learned

* **Don’t build on quicksand:** If your product depends on a third-party API, have a backup plan—or better yet, own the platform.
* **Validate dependencies early:** We could have built a prototype that didn’t rely on Facebook, or at least diversified our integrations.
* **Pitching is just the start:** Winning a competition or getting investor interest is exciting, but it’s not the same as product-market fit (or technical resilience).
* **Failure is a feature:** Friendlier’s demise was painful at the time, but it taught me more about business, tech, and resilience than any class ever could.

## Reflections

Looking back, I’m grateful for the experience. Friendlier was a crash course in entrepreneurship, teamwork, and humility. It’s a story I tell often—especially to anyone tempted to build on someone else’s platform. If you take one thing from our journey, let it be this: **don’t just use the API—be the API.**

- - -

*Have valuable startup lessons you want to share? Please drop the knowledge bombs in the comments below!*
