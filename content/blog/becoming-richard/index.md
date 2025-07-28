---
date: 2022-01-29T00:00:00.000-07:00
draft: false
title: "Becoming Richard Hendricks: How I Accidentally Gave Away my Favorite
  Project at Google"
slug: becoming-richard
summary: The lessons I learned from watching my project get destroyed from the
  inside out, when a senior staff engineer used my ideas to secure his promotion
  to director. It felt like I was in an episode of HBO's Silicon Valley.
thumbnail: /blog/becoming-richard/images/featured-hd.jpg
thumbnailHd: /blog/becoming-richard/images/featured-hd.jpg
images:
  - /blog/becoming-richard/images/featured-hd.jpg
categories:
  - Opinion
  - Career
tags:
  - Career
  - Programming
  - Google
  - SoftwareEngineer
  - Corporate
  - Politics
  - HBO
  - SiliconValley
toc: false
---

> 📣 Disclaimer
>
> *The opinions expressed here are my own and not Google's.*

Have you ever had an experience so absurdly specific that it felt like it was ripped from a TV show? For me, that show was HBO's *Silicon Valley*, and the scene was an infamous moment from Season 2. I lived through my own version of it between 2018 and 2022, regrettably before I ever saw the show (*I know, I was late!*). It was a painful, disillusioning, and ultimately transformative lesson in corporate politics at Google.

## The Idea and The Project

It started with an idea I was passionate about. Fresh on a new team, I saw an opportunity to solve a major problem. I poured my energy into a proposal, pitched it to an Engineering Director, and to my surprise, he not only funded it but also entrusted me with the role of Tech Lead (TL) to see it through. **GlassPane** was born: a metrics platform acting as a single pane of glass for GCP's reliability.

{{< figure src="images/glasspane.jpg" caption="**GlassPane**'s elevator pitch." alt="An internal metrics platform to help directors and managers understand the health of their projects and teams." attr="*Image: Google, 2019*" attrlink="https://www.youtube.com/watch?v=_azoxefUs_Y" >}}

This was a dream scenario. Within six months, I was leading a project I had conceived, backed by leadership, and working to build something I truly believed would have a massive impact. We were making great progress, and I was incredibly proud of what my team and I were accomplishing. I even [presented GlassPane's architecture to 800+ people](/project/cloud-next-talk/) at Cloud Next '19.

## The Betrayal

Then, an L7 engineer from a different organization (outside Cloud) started attending our team's standups. He expressed a keen interest in our work, asking sharp questions about our implementation details and architecture. I was naive. I saw him as a senior expert genuinely curious and potentially willing to mentor or partner with us. I welcomed his input, answered his questions openly, and thought I was fostering a collaborative spirit.

I was wrong.

Behind my back, this engineer took the very ideas and implementation details I had shared so openly and presented them to both his management chain and my own—as his. He repackaged our work, our strategy, and our architectural plans into a pitch of his own. He skillfully used his seniority and political capital to convince my director, the same one who had funded my project, that *his* vision was the superior path forward.

The result? My project was defunded.

{{< figure src="images/siliconvalley.jpg" caption="**Season 2: Episode 2** from *Silicon Valley* hit a little too close to home." attr="*Image: Steve Jurvetson, Flickr. License: CC BY 2.0*" attrlink="https://www.flickr.com/photos/jurvetson/33947304356" >}}

The ultimate gut punch was what came next. My only viable option was to join *his* newly-formed team, tasked with building a watered-down, inferior version of the very product he had just killed. To add insult to injury, once I was on his team, I discovered that his new project had direct dependencies on code I had written for the original project he'd defunded. He had not only stolen the vision but also the foundation.

This experience was crushing. It shattered my self-confidence and sent me into a spiral of burnout and imposter syndrome. It wasn't just a personal failure; it was a loss for Google. His product, built on a foundation of betrayal and short-sighted politics, ultimately failed, setting our organization back years on a critical mission. We were back at square one.

## Lessons from Richard Hendricks

It was only later, while decompressing with some TV, that I watched *Silicon Valley* for the first time. When I saw the episode where Richard Hendricks gets manipulated by Hooli engineers in a "sales meeting" to share proprietary details about his middle-out compression algorithm, I was flooded with emotion. The pattern was identical: the feigned interest, the mining for information, and the corporate big-heads manipulating the little guy.

Most of all, Richard willingly handed it to them, just like I did. Watching that scene made me feel hurt, angry, and strangely validated. It wasn't just me. This was a *thing*. A known, tragically common pattern in the tech world.

From that L7's betrayal, I learned a few invaluable lessons:

1.  **Guard Your Ideas:** Naive transparency is a liability in a competitive environment. Share your vision, but be strategic about who you share the "how" with, especially with those who have nothing to lose from a rug pull and everything to gain from your work.
2.  **Understand the Game:** Talent and hard work aren't always enough. Corporate politics are a real and powerful force. Understanding how to navigate them, build alliances, and protect your interests is a skill just as critical as writing code. The L7 wasn't a better engineer; he was a better politician.
3.  **Documentation Won't Save You:** By the time the rug was pulled from under me, having a clear history of my designs and contributions meant nothing. By then it was too late. The fact that his project had direct code dependencies on my code only served as proof to my director that his plan would work.

The experience was brutal, but like Richard, I survived it. It taught me a lesson that no amount of coding or design work ever could have. It made me more resilient, more aware, and, ironically, better prepared to take riskier career leaps where the stakes are even higher.

---

*Have you had a crushing corporate experience where you failed, but became a better engineer for it? I'd be curious to hear about it, please share in the comments!*
