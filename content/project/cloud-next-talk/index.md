---
date: '2019-12-06'
draft: false
title: "Migrating a Monolith to Microservices: Google Cloud Next '19"
slug: cloud-next-talk
summary: A deep dive into the journey of migrating two large-scale monolithic applications at Google—Louhi and GlassPane—to microservices, presented at Google Cloud Next in San Francisco and London.
thumbnail: https://img.youtube.com/vi/IiJIHG4Qw9M/hqdefault.jpg
thumbnailHd: https://img.youtube.com/vi/IiJIHG4Qw9M/maxresdefault.jpg
images:
- https://img.youtube.com/vi/IiJIHG4Qw9M/maxresdefault.jpg
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
- CloudNext
- GoogleCloud
- AppEngine
- Kubernetes
- GKE
- SpringCloud
- CloudDatastore
- CloudPubSub
- Programming
- Stackdriver
- StranglerPattern
- SagaPattern
- CircuitBreaker
- Architecture
- Migration
toc: true
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

### Presenting to 800+ Developers: A Unique Experience

In 2019, I had the privilege of presenting at Google Cloud Next not once, but twice—first in San Francisco alongside my friend and co-worker Sergio, and then solo in London. Standing in front of over 500 developers in SF and more than 330 in London was both exhilarating and humbling. The feedback was overwhelmingly positive (90%+ in post-talk surveys), and the YouTube comments still make me smile.

This talk was born out of real, hard-won experience: our team in Google’s Release Engineering group was tasked with migrating two massive, business-critical monolithic applications—Louhi and GlassPane—each built on a different tech stack, into dynamic, scalable microservices on Google Cloud Platform.

## Key Takeaways from the Talk

### Monolith vs. Microservices

We explored the pros and cons of both architectures, and why Louhi and GlassPane started as monoliths before we made the leap to microservices. **TL;DR** it's natural for applications to start as monoliths, especially with a small development team, but microservices offer benefits for all team sizes.

---

#### Monolithic Architecture

**Pros:** 👍

* **Experimentation:** Monolithic applications allow for quick experimentation.
* **Focus on Business Logic:** They enable teams to focus on the application's business logic without worrying about complex interactions between new binaries.
* **Prevents Over-design:** Monolithic architecture prevents initial over-design of services, allowing for a quick setup.
* **Easier Management for Small Teams:** A single monolithic application is easier for small teams to manage.
* **Simplified Operations:** Debugging, security, and operations only need to be done once.

**Cons:** 👎

* **Increased Product Requirements:** As projects grow, managing more product requirements becomes challenging.
* **High Cognitive Load for New Members:** Onboarding new team members becomes difficult due to the extensive knowledge required to understand the entire application architecture.
* **Deployment Delays:** Feature syncing across sub-teams can delay deployments.
* **Lack of Independent Scaling:** Different parts of the application cannot be scaled independently, even if one part requires more performance.
* **Messy Debugging:** Debugging can become complicated if components are not kept separate within the binary.

---

#### Microservices Architecture

**Pros:** 👍

* **Simplicity and Easy Onboarding:** Microservices are simple to understand, with a straightforward onboarding process for new team members.
* **Flexible Tech Stacks:** Allows the use of different tech stacks for various services (e.g., Python for one, Java for another).
* **Isolated Responsibilities:** Guarantees isolated responsibilities, aligning with domain-driven design principles.
* **Independent Deployment:** Services can be deployed completely independently.
* **Scalable and Distributable:** Microservices are inherently scalable and distributable.
* **Code Reusability:** Business logic can be reused across the application without rewriting or complex interdependencies.
* **Fault Tolerant:** Microservices are highly fault-tolerant, handling service failures much better than monolithic applications.

**Cons:** 👎

* **Costly Migration:** Migrating from a monolithic application to microservices can be a costly process.
* **Risk of Nanoservices:** There is a danger of creating services that are too fine-grained (nanoservices). This anti-pattern leads to excessive complexity, network latency, and operational overhead that outweighs the benefits.

  > 💡 Tip
  >
  > We gave an example of falling into the nanoservices trap with GlassPane's metric data collectors, before we adjusted our service granularity.

* **Risk of Increased Operational Overhead:** Depending on your tech stack, setting up the infrastructure - e.g. binary release orchestration, monitoring, load balancing, configuration, etc - for each new service can be a pain.

  > 💡 Tip
  >
  > We mentioned specific tools like API Gateway, Service Registry, Micrometer, Stackdriver, and Envoy & Istio, as well as [helpful patterns](#migration-patterns) you can use to reduce operational overhead.

---

### Practical Examples

We shared concrete stories from Louhi and GlassPane, highlighting what worked, what didn’t, and the anti-patterns to avoid (like nanoservices).

- **GlassPane:**
  - Originally a single App Engine app, we used the Strangler Pattern to split it into ~7 microservices, each with its own Cloud Datastore instance. This allowed us to iterate independently and deploy with confidence.
  - **Tech stack**: Google App Engine (Java), Cloud Pub/Sub, Cloud Datastore, Cloud Functions, Stackdriver.

- **Louhi:**
  - Migrated from a monolith to microservices using Google Kubernetes Engine (GKE) and Spring Cloud Kubernetes. The transition was seamless thanks to the flexibility of Kubernetes and the power of Spring Cloud.
  - **Tech Stack:** GKE, Spring Cloud (Java), Stackdriver, API Gateway, Micrometer, Cloud Build.

### Benefits of Migration

Refactoring is never free, but for us, the payoff was huge: faster iteration, more focused business logic, and a platform that could scale with our needs. Our migration from monoliths to microservices offered several key advantages:

* **Faster Iteration and Focus on Business Logic:** Once the migration was complete, the development teams were able to iterate on new features more quickly and concentrate on the core business logic of their applications, rather than getting bogged down in the complexities of the monolithic codebase.
* **Improved Onboarding:** The smaller, more focused nature of microservices made it easier for new team members to get up to speed on the architecture and contribute to the project.
* **Independent Scaling:** A significant benefit was the ability to scale individual services independently. This addressed a key limitation of the monolithic architecture, where a single component requiring more resources would necessitate scaling the entire application.
* **Enhanced Fault Tolerance:** The microservices architecture proved to be more resilient to failures. With the implementation of patterns like the circuit breaker, the applications could handle service outages more gracefully than the original monolithic versions.

### Migration Patterns

We leaned heavily on proven patterns that were instrumental in the migration process:

* **Strangler Pattern:** This pattern was used to gradually break down the monolithic application into smaller, more manageable microservices.
    * **For Louhi,** the process was relatively straightforward because the original application already had a modular structure. Most modules were converted directly into microservices. A notable exception was the "pipeline" module, which was a complex "Frankenstein module" that had to be broken down into three separate services: a pipeline service, a stage type service, and a GCB executor.
    * **For GlassPane,** following *Domain-Driven Design* as our primary philosophy, we ended on the "magic number" of seven microservices, based on the seven distinct domains within the original monolith.
* **Saga Patterns (Orchestration and Choreography):** These patterns were used to manage transactions and maintain data consistency across multiple services.
    * **In Louhi,** both orchestration and choreography patterns were employed. For example, a "fan-out" approach was used to emit events when a project was deleted, allowing other services to listen and react accordingly. A "fan-in" approach was also used, where a single service would listen for events from multiple other services to collect metrics.
* **Circuit Breaker Pattern:** This pattern was implemented to handle service failures gracefully and prevent them from cascading throughout the system.
    * **In GlassPane,** a custom `@MethodRetry` annotation was created to act as a circuit breaker. This allowed for a configurable number of retry attempts and a fallback method to provide alternative functionality if a service failed. For example, if the metric service was down, the system would fetch previously collected metrics from a local memcache to avoid showing an error to the user.
    * **In Louhi,** the circuit breaker pattern improves the user experience by preventing endless loading screens and providing informative error messages. Spring's Feign clients can provide this functionality out of the box.

### Architectural Choices

The talks wrapped up with lessons on how to choose the right architecture for your application, based on our real-world experience.

* **Service Granularity and Domain-Driven Design:** Our team aimed for a balance in service size, following the rule of thumb that if the setup and operational costs of a service outweigh the implementation cost, the service is too small. We also embraced domain-driven design, thinking about each part of the application as a separate domain with a single responsibility.
* **Avoiding Nanoservices:** Our team learned to avoid the "nanoservice" anti-pattern, where services are too small. GlassPane initially made this mistake by creating a separate metric collector for every single metric, which proved to be unfeasible. We later opted for a serverless approach with a single microservice for all metrics, using Google Cloud Functions for collection.
* **Repository Structure and Team Responsibilities:** We chose to have one repository per microservice to establish clear dependencies and simplify deployments. We also emphasized the importance of setting clear team responsibilities to avoid "orphan microservices".
* **Technology Stack:**
    * **Deployment:** Louhi was deployed on Google Kubernetes Engine (GKE) for its container orchestration capabilities, self-healing services, and auto-scaling.
    * **Backend:** Java and Spring were chosen for the backend due to team familiarity, the maturity of the framework, and its cloud-native design.
    * **Frontend:** Polymer (now Lit) was used for the UI of both applications, leveraging web components to create isolated responsibilities that mirrored the backend microservices.
* **Service Communication:** An API Gateway was used as a single entry point for all clients, decoupling them from the downstream services and handling tasks like request throttling and security. Aggregator or composite services were also used to simplify inter-service communication.
* **Configuration Management:** For configuration, Louhi used Spring Cloud Kubernetes to manage changes, while GlassPane created a custom "configuration microservice" to listen for changes and propagate them to other services.
* **Service Discovery and Self-Healing:** The applications used a service registry for service discovery, with Kubernetes automatically monitoring the health of services and restarting them as needed.

---

## Lessons Learned

- **Start with Why:** Don’t migrate for the sake of it. Have a clear business or technical reason.
- **Incremental Wins:** Use patterns like Strangler to avoid big-bang rewrites.
- **Embrace Failure:** Circuit Breakers and Sagas are your friends—design for failure from day one.
- **Avoid Anti-Patterns:** Don’t just split your monolith into a distributed monolith. Watch out for tight coupling and shared databases.
- **Iterate, Iterate, Iterate:** Migration is a journey, not a destination.

## More Resources

- [*Martin Fowler: Microservices*](https://martinfowler.com/articles/microservices.html)

---

*Presenting this talk was one of the highlights of my career at Google. If you’re considering a migration, or just want to geek out about distributed systems, check out the videos above—or drop me a line. Happy to chat!*
