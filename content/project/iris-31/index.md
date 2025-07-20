---
date: 2017-04-30
title: "Iris-31: A Play in VR"
slug: iris-31
summary: "A groundbreaking virtual reality theatrical performance that combined live acting with VR and hand/body motion-tracking technology to tell the story of my grandfather surviving a catastrophic hurricane in 1931 British Honduras."
thumbnail: /project/iris-31/images/featured.gif
thumbnailHd: /project/iris-31/images/featured-hd.gif
images:
  - /project/iris-31/images/featured-hd.gif
tags:
  - VirtualReality
  - VR
  - Theatre
  - Unity
  - C#
  - PerformanceArt
  - Programming
  - ComputerScience
  - Storytelling
  - SteamVR
  - Kinect
  - HTCVive
  - LeapMotion
  - MotionTracking
categories:
  - Academic
  - Performance
  - Project
toc: true
---

{{< project-details
    timeline="Sep 2016 - Apr 2017"
    languages="C#, Unity, SteamVR, Leap Motion SDK"
    school="Colorado College"
    course="TH404 Senior Thesis"
>}}

> *"Reality is wrong. Dreams are for real."* — Tupac Shakur

# When I Built a Chocolate Factory to Make a Cookie

What began as my impulse to tell a story resulted in the creation of a new form of performance. I wanted to make a cookie, so naturally I built a whole new chocolate factory. The name of my new factory is **Cybernetically Augmented Theatre (CAT)**, and the cookie is ***Iris-31***.

It's my attempt to create art with a traditionally non-artistic medium: virtual reality (VR). Despite feeling like I was continually laying the railroad tracks in front of me as I chugged along, I'm proud to say the development of *Iris-31* took a very natural progression into a final form that, although perhaps not fully matured, nonetheless managed to achieve two feats: the final performance remained true to my initial aesthetic intentions, and even after sixty performances, it maintained a sense of unpredictability and liveness through a constantly fluctuating three-way synergy between each individual participant, the actor, and the audience.

## Performance Footage

One of over 75 individuals who participated in the performance over the course of 4 days (Apr 13-16, 2017), each participant featured here graciously gave us permission to use this footage for educational purposes.

### *Emily's Experience*

{{< youtube fJAeXN1F7C8 >}}

> *Apr 14, 2017* — Emily participates in *Iris-31*, an original two-person play that used Leap Motion hand sensors & Kinect body motion-sensors to capture the movements & sound of the actor and render them as a fully emotive virtual character in view of the single audience participant wearing an HTC Vive VR headset.
>
> For one of his senior thesis projects at Colorado College, Soeren Walls designed, programmed, scripted, and directed Iris-31 as a visceral re-imagining of the true story of his grandfather surviving the [1931 Belize hurricane](https://en.wikipedia.org/wiki/1931_British_Honduras_hurricane) tragedy as a child.
> The word "iris" has multiple relevant meanings: it's related to water, the physical eye of an animal, and the calm center point of a storm.

### *Inside the Headset (Participant 1)*

{{< youtube uay9bclFaXk >}}

### *Inside the Headset (Participant 2)*

{{< youtube aC7eZhvIj0Q >}}

### *Inside the Headset (Participant 3)*

{{< youtube okdV4o5QQ0Y >}}

## The most fun challenges

### 1. Bridging the Gap Between Real and Virtual

The core technical challenge was creating a system where a live actor could exist simultaneously in both the physical and virtual worlds. I had to track the actor's movements in real-time and render them as a virtual character that participants could interact with through the HTC Vive headset.

Here’s an excerpt from the actual `WayPoints` class (C# for Unity):

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class WayPoints : MonoBehaviour {
    public float delaySeconds = 0;
    public Transform[] wayPoints;
    [Range(0,1)] public float interpolation = 1.0f;
    public float speed = 4f;
    public int currentWayPoint = 0;
    public float acceleration = 0.1f;
    [Range(0,1)] public float deceleratePoint = 0.9f;
    public bool startAtFirstWaypoint = false;
    public bool loop = false;
    private float counter;
    private Transform targetWayPoint;
    private float distTraveledSoFar;
    private float journeyDistance;
    private float[] distanceToNext;
    private float[] angleToNext;
    private Vector3 unlerpedPosition;
    private Quaternion unlerpedRotation;
    private float moveSpeed = 0;
    private Rigidbody[] rigidBodies;
    private RigidbodyInterpolation[] oldInterp;
    private bool[] oldKinematic;
    private RigidbodyConstraints[] oldConstraints;
    private bool finished = false;

    void Start () {
        if (startAtFirstWaypoint) {
            transform.position = wayPoints[0].position;
            transform.localRotation = wayPoints[0].localRotation;
            wayPoints[0].gameObject.SetActive(false);
            Transform[] newWaypoints = new Transform[wayPoints.Length - 1];
            for (int i = 1; i < wayPoints.Length; i++)
                newWaypoints[i - 1] = wayPoints[i];
            wayPoints = newWaypoints;
        }
        journeyDistance = 0;
        distTraveledSoFar = 0;
        moveSpeed = 0;
        counter = delaySeconds;
        distanceToNext = new float[wayPoints.Length+1];
        angleToNext = new float[wayPoints.Length+1];
        for (int i = 0; i < wayPoints.Length+1; i++) {
            distanceToNext[i] = Vector3.Distance(
                i == 0 ? transform.position : wayPoints[i - 1].position,
                wayPoints[i % wayPoints.Length].position);
            journeyDistance += distanceToNext[i];
            angleToNext[i] = Quaternion.Angle(
                i == 0 ? transform.localRotation : wayPoints[i - 1].localRotation,
                wayPoints[i % wayPoints.Length].localRotation);
            if (i < wayPoints.Length)
                wayPoints[i].gameObject.SetActive(false);
        }
        unlerpedPosition = transform.position;
        unlerpedRotation = transform.localRotation;
        rigidBodies = GetComponentsInChildren<Rigidbody>();
        oldInterp = new RigidbodyInterpolation[rigidBodies.Length];
        oldKinematic = new bool[rigidBodies.Length];
        oldConstraints = new RigidbodyConstraints[rigidBodies.Length];
        for (int i = 0; i < rigidBodies.Length; i++) {
            oldInterp[i] = rigidBodies[i].interpolation;
            rigidBodies[i].interpolation = RigidbodyInterpolation.None;
            oldKinematic[i] = rigidBodies[i].isKinematic;
            rigidBodies[i].isKinematic = true;
            oldConstraints[i] = rigidBodies[i].constraints;
            rigidBodies[i].constraints = RigidbodyConstraints.FreezeAll;
        }
    }

    void Update () {
        if (counter > 0) {
            counter -= Time.deltaTime;
        } else if (currentWayPoint < wayPoints.Length || loop) {
            if (currentWayPoint > wayPoints.Length)
                currentWayPoint = 0;
            if (targetWayPoint == null)
                targetWayPoint = wayPoints[currentWayPoint % wayPoints.Length];
            Step();
        } else if (!finished) {
            for (int i = 0; i < rigidBodies.Length; i++) {
                rigidBodies[i].interpolation = oldInterp[i];
                rigidBodies[i].isKinematic = oldKinematic[i];
                rigidBodies[i].constraints = oldConstraints[i];
            }
            finished = true;
        }
    }

    void Step() {
        // ... movement logic here ...
    }
}
```

*Side note*: To my knowledge, this was the first time anyone had attempted live theatrical performance in VR, so I had no roadmap to follow. Every technical decision felt like a shot in the dark.

### 2. Creating Emotional Depth in a "Gimmicky" Medium

VR in 2017 was primarily associated with cheap thrills and zombie-killing simulations. I wanted to prove it could be used for genuine artistic expression. The challenge was creating an experience that would move people emotionally while still taking advantage of VR's unique capabilities.

The solution came from my grandfather's story—a deeply personal narrative about survival, loss, and the fragility of human existence. By grounding the virtual experience in real human tragedy, I could create something that transcended the medium's limitations.

### 3. Managing the Three-Way Performance Dynamic

The most fascinating challenge was orchestrating the relationship between:
- **The participant** (wearing the VR headset, experiencing both worlds)
- **The actor** (physically present but rendered virtually, not experiencing VR)
- **The audience** (watching the physical performance, no VR experience)

Each group had completely different experiences of the same performance. The participant saw a virtual world with virtual characters, the actor performed live but couldn't see the virtual elements, and the audience only saw a person in a headset interacting with an actor.

### 4. Technical Infrastructure on a Student Budget

I had to build an entire VR development studio from scratch. This meant:
- Acquiring an HTC Vive headset ($800)
- Building a VR-capable PC with AMD Radeon RX 480 graphics card
- Setting up motion tracking with Leap Motion Controller and Xbox Kinect
- Creating mobile ceiling rigs for Vive base stations out of PVC pipe
- Converting a basement room into a dedicated VR testing space

*Side note*: The [Keller Family Venture Grant](https://www.coloradocollege.edu/other/venturegrants/) made this possible—without that $1,500, this project would have remained just an idea on paper.

## The Performance Experience

*Iris-31* consisted of 8 scenes, each exploring different aspects of my grandfather's hurricane survival story and the liminal space between memory, trauma, and healing. In order:

### 1. The happy memory

An old man reading Shel Silverstein to a woman, with red and blue flowers swirling around them.

{{< lightgallery glob="images/Scene1*.jpg" >}}

### 2. The water tower

A young man yelling instructions to stay strong while hurricane winds blow.

{{< lightgallery glob="images/Scene2*.jpg" >}}

### 3. The mirror television

An antique TV showing different channels—ocean views, hurricane footage, and eventually an old man you can control with your body movements.

{{< lightgallery glob="images/Scene3*.jpg" >}}

### 4. The storm

Standing on a cliff overlooking the ocean as a hurricane approaches, then suddenly dissipates.

{{< lightgallery glob="images/Scene4*.jpg" >}}

### 5. The nightmare

A little boy calling '*Come on, Yvon!*' from across water, just out of reach.

{{< lightgallery glob="images/Scene5*.jpg" >}}

### 6. The dream

A gray world with a blue stream and flowers that leave yellow light trails when touched.

{{< lightgallery glob="images/Scene6*.jpg" >}}

### 7. The hospital

An old man on a hospital bed explaining '*His name was Alec, not Alex. A-L-E-C. A Greek name. Alec was my cousin. 2 years old. He was swept away.*'

{{< lightgallery glob="images/Scene7*.jpg" >}}

### 8. The reunion

Chopin's *Nocturne* playing as dice float toward you showing '3' and '1' (1931), ending with a book containing the message '*Hope you like it. Love, Granddad.*'

{{< lightgallery glob="images/Scene8*.jpg" >}}

## The Evolution of *Iris-31*: From Script to Performance

*Iris-31* didn’t start out as the abstract, dreamlike experience it became. Early drafts of the script were much more literal, with dialogue between Yvon, his parents, and their servant Binadu, and scenes of family tension, gender identity, and the chaos of the hurricane. Over time, the project evolved into a series of immersive, symbolic scenes designed to be experienced rather than simply watched.

### Artistic Influences

A major influence on my approach was the work of video and performance artists like [**Gary Hill**](https://en.wikipedia.org/wiki/Gary_Hill), whose explorations of technology, embodiment, and liveness in art challenged me to think beyond traditional theatre. Hill’s installations—along with the work of artists like [Bill Viola](https://en.wikipedia.org/wiki/Bill_Viola) and [George Coates](https://en.wikipedia.org/wiki/George_Coates)—demonstrated how technology could be used not just as a tool, but as an active participant in the creation of meaning and presence. Their work inspired me to use VR not for spectacle, but as a medium for genuine, unpredictable human connection.

*Excerpt from an early draft:*

> "YVON gets up and goes out the side door. He is met by vast golden fields of wheat and corn. Further in the distance, he sees two water towers atop a sunlit hill... To his right, ocean waves beat ominously against the shore."

As the project matured, the script became more focused on emotional resonance and participant agency, using VR’s unique capabilities to blur the lines between memory, dream, and reality.

## Family, Identity, and Survival

At its heart, *Iris-31* is about my grandfather Yvon’s survival during the [1931 hurricane in British Honduras](https://en.wikipedia.org/wiki/1931_British_Honduras_hurricane) (modern-day Belize)—a story passed down through my family. But it’s also about the complexity of family, identity, and memory. The performance explores not just physical survival, but the psychological limbo of trauma, the ambiguity of identity, and the struggle to connect across generations.

*Excerpt from the final script:*

> "A man is yelling at you. 'How could this happen?! I remember his sweet hands, his face. Nothing is the same now. Nothing is the same. You could have saved him! You could have saved him!'"

> "Old man lying on a hospital bed in front of you. He says: 'His name was Alec, not Alex. A L E C. A Greek name. Alec was my cousin. 2 years old. He was swept away. His family and their house were consumed by the waves.'"

## Symbolic Scenes and Motifs

The final performance was structured as a series of symbolic, interactive scenes:

- **Water as Rebirth and Threat:** Water rises around the participant, submerging them, representing both danger and transformation.
- **Unreachable Family:** Family members appear just out of reach, echoing the trauma of separation and loss.
- **The Book and the Dice:** The performance ends with a book inscribed "Hope you like it. Love, Granddad" and dice showing "3" and "1"—a direct reference to 1931, the year of the hurricane.
- **The TV and News:** Scenes with a TV and news broadcast ground the story in historical reality, while the TV’s static and flooding studio blur the line between past and present.

*Excerpt from the final script:*

> "A book appears in his place. It falls to the ground. You go to pick it up, and it avoids your hand, like a magnet. It floats upward in front of you, it opens, and there’s something written on the first page. It says, 'Hope you like it. Love, Granddad.'"

> "You’re standing on the edge of a cliff, and there’s a huge storm in the distance. A hurricane. It’s slowly coming toward you... Just before the hurricane reaches you, the storm immediately calms, the hurricane dissipates into the water, the sun comes out, and you’re left standing there in the sunlight. Birds. Wind. Silence. Peace."

## Exploring Identity

The early scripts also touched on issues of gender and racial identity, reflecting my own journey to understand my family’s past and my place within it. These themes, while less explicit in the final performance, informed the emotional landscape of *Iris-31*.

*Excerpt from an early draft:*

> "EDWARD: Your skin’s dark. AVICE: A bit. EDWARD: Too much sunlight. Be smart about it, like Yvon. He knows if he spends too much time in the sun, his friends won’t play with him at school. AVICE: Yvon is a good girl. She stays inside and keeps her skin fair, like a good girl."

## The Role of Binadu and Family Dynamics

The family servant, who I named Binadu out of ignorance of his real name, plays a crucial role in the survival story. He physically saved Yvon and his family during the hurricane by tying them with rope to the water towers near their home, where they remained for days. The scripts show Binadu’s care and the family’s complex dynamics under stress.

*Excerpt from an early draft:*

> "BINADU: I won’t let you take him. If you have a death wish, so be it, but I am taking Yvon now!"

## Final Thoughts

*Iris-31* is ultimately about the power of memory, the pain of loss, and the hope of connection—across time, space, and even reality itself. By blending live performance, VR technology, and personal history, I hoped to create an experience that was as unpredictable and alive as the memories that inspired it.

## Screenshots & Photos

{{< lightgallery glob="images/IMG_*.jpg" >}}
