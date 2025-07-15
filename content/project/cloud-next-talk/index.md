---
date: "2019-12-06"
draft: false
title: "Migrating a Monolith to Microservices: Google Cloud Next '19"
summary: A deep dive into the journey of migrating two large-scale monolithic applications at Google—Louhi and GlassPane—to microservices, presented at Google Cloud Next in San Francisco and London.
thumbnail: "https://img.youtube.com/vi/IiJIHG4Qw9M/maxresdefault.jpg"
categories:
- Project
- Business
- Talks
- Web
- Video
tags:
- Google
- GlassPane
- Louhi
- Cloud
- Architecture
- Microservices
- Monolith
- Cloud Next
- Google Cloud
- App Engine
- Kubernetes
- GKE
- Spring Cloud
- Cloud Datastore
- Cloud Pub/Sub
- Programming
- Stackdriver
- Strangler Pattern
- Saga Pattern
- Circuit Breaker
- Architecture
- Migration
---

{{< project-details
  timeline="Apr-Dec 2019"
  languages="Java, Python, Spring Cloud, GCP, Kubernetes, App Engine"
  reason="To enable faster iteration and scalability for critical internal Google projects"
  role="Tech Lead, Speaker, Software Engineer"
>}}

## Watch the Talks

**London (4k+ views, Dec 6, 2019)**

{{< youtube IiJIHG4Qw9M >}}

**San Francisco (29k+ views, Apr 10, 2019)**

{{< youtube _azoxefUs_Y >}}

---

### Presenting to 800+ Developers: A Unique Experience

In 2019, I had the privilege of presenting at Google Cloud Next not once, but twice—first in San Francisco alongside my friend and co-worker Sergio, and then solo in London. Standing in front of over 500 developers in SF and more than 330 in London was both exhilarating and humbling. The feedback was overwhelmingly positive (90%+ in post-talk surveys), and the YouTube comments still make me smile.

This talk was born out of real, hard-won experience: our team in Google’s Release Engineering group was tasked with migrating two massive, business-critical monolithic applications—Louhi and GlassPane—each built on a different tech stack, into dynamic, scalable microservices on Google Cloud Platform.

---

## Key Takeaways from the Talk

- **Monolithic vs. Microservices:**
  - We explored the pros and cons of both architectures, and why Louhi and GlassPane started as monoliths before we made the leap to microservices.

- **Benefits of Migration:**
  - Refactoring is never free, but the payoff was huge: faster iteration, more focused business logic, and a platform that could scale with our needs ([43:08](https://www.youtube.com/watch?v=IiJIHG4Qw9M&t=2588s)).

- **Migration Patterns:**
  - We leaned heavily on proven patterns:
    - **Strangler Pattern:** Incrementally broke down the monolith into manageable microservices.
    - **Saga Patterns:** Ensured data consistency and atomicity across distributed services.
    - **Circuit Breaker Pattern:** Helped us gracefully handle service failures.

- **Practical Examples:**
  - I shared concrete stories from Louhi and GlassPane, highlighting what worked, what didn’t, and the anti-patterns to avoid.

- **Architectural Choices:**
  - The talk wrapped up with lessons on how to choose the right architecture for your application, based on our real-world experience.

---

## Behind the Scenes: Louhi & GlassPane

- **GlassPane:**
  - Originally a single App Engine app, we used the Strangler Pattern to split it into ~7 microservices, each with its own Cloud Datastore instance. This allowed us to iterate independently and deploy with confidence.

- **Louhi:**
  - Migrated from a monolith to microservices using Google Kubernetes Engine (GKE) and Spring Cloud Kubernetes. The transition was seamless thanks to the flexibility of Kubernetes and the power of Spring Cloud.

- **Tech Stack:**
  - GKE, App Engine, Cloud Pub/Sub, Cloud Datastore, Stackdriver, Spring Cloud, Java, Python, and more.

---

## Lessons Learned

- **Start with Why:** Don’t migrate for the sake of it. Have a clear business or technical reason.
- **Incremental Wins:** Use patterns like Strangler to avoid big-bang rewrites.
- **Embrace Failure:** Circuit Breakers and Sagas are your friends—design for failure from day one.
- **Avoid Anti-Patterns:** Don’t just split your monolith into a distributed monolith. Watch out for tight coupling and shared databases.
- **Iterate, Iterate, Iterate:** Migration is a journey, not a destination.

---

## More Resources

- [*Martin Fowler: Microservices*](https://martinfowler.com/articles/microservices.html)

---

Presenting this talk was one of the highlights of my career at Google. If you’re considering a migration, or just want to geek out about distributed systems, check out the videos above—or drop me a line. Happy to chat!
