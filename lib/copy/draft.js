// DRAFT copy, proposed for approval. Nothing here is approved.
//
// - Slot IDs (S1 to S16) follow COPY-BRIEF.md §5.
// - Anything clinical needs Dr. Traverso's review before it can move to
//   approved.js. Missing facts are todo() entries, never invented.
// - Drafts render only in preview builds (see lib/copy/index.js). A
//   production build shows a TODO marker instead.
// - `npm run copy:deck` turns this file into docs/copy/COPY-DECK.md for review.

export const todo = (missing) => ({ todo: missing });

export const draft = {
  site: {
    // S3, same line on every symptom page
    reassurance: "You do not need a diagnosis to get in touch. Start with what you are feeling.",
    // S4: shown only after approval, so there is no draft
    reviewed: todo("Reviewer name, review date and last updated date, added only after the page is approved"),
    // S11
    talkLine: "When you are ready, the practice is happy to talk it through with you.",
    // S12, one wording site-wide. No approved wording has been supplied, so
    // this stays TODO(copy) as COPY-BRIEF.md §3 requires. The proposal is in
    // the note for Ray to approve.
    disclaimer: todo(
      'Approved disclaimer wording, one site-wide. Proposed: "This guide is general education. It is not a diagnosis. It is not a substitute for a consultation with a clinician who can examine your hand."',
    ),
    // S13
    phone: todo("Practice phone number"),
    // S14, the line under "Still not sure?"
    nextStepLine: "You do not need to know what is causing it. A consultation is a place to talk it through.",
    // Urgent-care wording conflicts with "never urgent" (§2) and "no advice"
    // (§3). Held as TODO until Dr. Traverso decides; see REVIEW-NOTES.md.
    emergency: todo('Urgent-care wording, decision pending with Dr. Traverso. Earlier draft: "If you think you need urgent care, contact emergency services."'),
    noHealthDetails: "Please do not send health details through this website.",
    // S5 navigation labels
    labels: {
      onThisPage: "On this page",
      sections: {
        feel: "What it may feel like",
        where: "Where this is in the hand",
        evaluated: "How it is evaluated",
        options: "Options that may be appropriate",
        talk: "Talk it through",
      },
      related: "Related",
      aside: "Talk to the practice",
      nextStep: "Still not sure?",
      schedule: "Schedule",
      call: "Call THInc",
      nonsurgical: "Options that do not involve surgery",
      surgery: "When surgery may be considered",
    },
  },

  home: {
    hero: {
      title: "How can we help you today?",
      body: "Start with what you are feeling. You do not need to know a diagnosis.",
      chooser: "Choose what sounds closest",
    },
    anatomy: {
      body: "Start with the anatomy. Our guides explain what a condition may feel like, how it is evaluated and what options may be appropriate.",
      structuresHeading: "Structures shown",
      chapters: {
        inside: {
          eyebrow: "Under the skin",
          title: "Muscles, tendons, nerves and vessels, in a small space.",
          body: "Your fingers move because muscles pull on long tendons. Nerves carry feeling to each fingertip. Arteries and veins keep it all supplied.",
          demo: "As you scroll, the skin is peeled away.",
        },
        bones: {
          eyebrow: "The frame",
          title: "Small bones, working as one.",
          body: "Beneath it all, the hand and wrist are built from many small bones. They glide against each other. When one is injured or worn, everyday movements may start to hurt.",
          demo: "The bones drift apart so you can see each one.",
        },
        "carpal-tunnel-syndrome": {
          eyebrow: "Numb or tingling fingers",
          title: "A nerve in a narrow tunnel.",
          body: "A nerve (the median nerve) passes through a narrow passage at the wrist (the carpal tunnel). When it is squeezed there, the thumb, index and middle fingers may tingle or go numb. This often happens at night.",
          demo: "The signal fades as it passes through the tunnel.",
        },
        "trigger-finger": {
          eyebrow: "A finger that catches or locks",
          title: "Tendons glide through snug tunnels.",
          body: "Each finger bends because a tendon slides through a series of rings. If the first ring tightens, the tendon may catch. The finger may then click or lock as it bends.",
          demo: "The ring finger bends, catches at the base, then moves through.",
        },
        "thumb-arthritis": {
          eyebrow: "Pain at the base of the thumb",
          title: "One small joint does a lot of work.",
          body: "Where the thumb meets the wrist, a joint lets you pinch, grip and turn keys. When its surfaces wear, those simple tasks may ache.",
          demo: "Each pinch loads the joint at the base of the thumb.",
        },
        "de-quervains-tenosynovitis": {
          eyebrow: "Pain on the thumb side of the wrist",
          title: "Two tendons, one tight passage.",
          body: "Two tendons that move the thumb run together along the side of the wrist. When they or their tunnel are irritated, lifting and gripping may hurt.",
          demo: "Tucking the thumb into a fist stretches the two tendons.",
        },
        "ganglion-cyst": {
          eyebrow: "A lump on the wrist",
          title: "Sometimes the answer is on the back of the hand.",
          body: "One common cause of a wrist lump is a fluid-filled sac (a ganglion). It grows from the lining of a joint or tendon. The lump shown here is a drawn illustration.",
          demo: "A ganglion may grow and shrink over time.",
        },
        "wrist-fracture": {
          eyebrow: "A wrist that has not recovered after a fall",
          title: "Small bones, big falls.",
          body: "A fall onto an outstretched hand can break the end of the forearm bone (radius). It can also break a small wrist bone (scaphoid). Some breaks only show up as a wrist that does not settle.",
          demo: "A fall sends force through the wrist bones.",
        },
        "dupuytrens-contracture": {
          eyebrow: "Fingers drawing into the palm",
          title: "A layer in the palm that can tighten.",
          body: "Under the skin of the palm lies a fan of tough tissue. It may thicken into cords. Over time, the cords may draw a finger toward the palm. The finger may then not straighten fully.",
          demo: "The ring and little fingers are drawn in.",
        },
      },
      readGuide: "Read the guide",
    },
    visit: {
      title: "What to expect at a first visit",
      steps: [
        "We listen to what you are noticing.",
        "We examine your hand and wrist.",
        "We explain what we find, in plain words.",
        "We talk through options together, including ones that do not involve surgery.",
      ],
    },
    surgeon: {
      eyebrow: "Who you will see",
      body: "Your first appointment is a conversation. We talk about what you are noticing and how it affects your day. We also talk through the options, including ones that do not involve surgery.",
    },
    professionals: {
      eyebrow: "For referring physicians and partners",
      title: "Referral process, what to include, and how the practice reports back.",
      link: "Refer a patient",
    },
    closing: {
      title: "When you are ready, we will listen.",
      body: "Leave your name and a way to reach you. No health details are needed. The office will call you back.",
      call: "Prefer to call?",
    },
  },

  // Names of the structures on the anatomy figures, keyed by anchor. These are
  // clinical labels, so they need Dr. Traverso's review.
  anatomy: {
    structures: {
      muscle: "Muscle",
      tendon: "Tendon",
      nerve: "Nerve",
      artery: "Artery",
      vein: "Vein",
      scaphoid: "Scaphoid",
      metacarpal: "Metacarpal",
      phalanx: "Phalanx",
      median: "Median nerve",
      ligament: "Transverse carpal ligament",
      a1: "A1 pulley",
      flexor: "Flexor tendons",
      cmc: "Trapezium",
      mc1: "First metacarpal",
      dq: "Abductor pollicis longus",
      dq2: "Extensor pollicis brevis",
      ganglion: "Ganglion (illustration)",
      radius: "Radius",
      aponeurosis: "Palmar aponeurosis",
    },
  },

  // Page titles and search descriptions (browser tab, search results, sharing)
  meta: {
    siteTitle: "Hand and wrist surgeon in Coral Springs, FL",
    siteDescription: "Plain-language guides to hand and wrist symptoms, and how to reach Dr. Purnell Traverso, hand and wrist surgeon in Coral Springs, Florida.",
    about: "About Dr. Purnell Traverso",
    aboutDescription: "Dr. Purnell Traverso, hand and wrist surgeon in Coral Springs, Florida.",
    physicians: "For referring physicians and partners",
    physiciansDescription: "How to refer to Dr. Purnell Traverso, what to include, and how to work with the practice.",
    accessibility: "Accessibility",
    sent: "Request received",
  },

  // Interface labels shared across pages
  ui: {
    skip: "Skip to main content",
    menu: "Menu",
    nav: {
      symptoms: "Symptoms",
      anatomy: "Anatomy",
      visit: "Your visit",
      about: "About the surgeon",
      physicians: "For physicians",
    },
    tagline: "Hand and wrist surgery, Coral Springs",
    breadcrumbHome: "Home",
    footer: {
      symptoms: "Symptoms",
      patients: "Patients",
      professionals: "Professionals",
      startSymptom: "Start with a symptom",
      firstVisit: "Your first visit",
      schedule: "Schedule",
      about: "About the surgeon",
      referring: "Referring physicians",
      howToRefer: "How to refer",
      accessibility: "Accessibility",
      // Licence credit for the 3D model (CC BY-SA 4.0 requires attribution)
      credit:
        "3D anatomy: Open3DModel \"Hand, complete\", Open3D project, AnatomyTOOL.org, based on BodyParts3D and Z-Anatomy, licensed CC BY-SA 4.0, simplified for the web. Skin: WebXR Input Profiles generic hand, MIT license, copyright 2019 Amazon, smoothed and re-rigged. The ganglion shown is an illustration.",
    },
    viewer: {
      skin: "Skin",
      inside: "Inside",
      rotateLeft: "Rotate left",
      rotateRight: "Rotate right",
      reset: "Reset",
      play: "Play motion",
      pause: "Pause motion",
      loading: "Loading the 3D figure",
      unavailable: "The 3D view is not available on this device.",
      structures: "Structures shown",
      show: "Show",
      hide: "Hide",
      onFigure: "Find on figure",
    },
  },

  pages: {
    home: {
      step: "Step",
      practical: { title: "Practical details", where: "Where", when: "When", insurance: "Insurance" },
      facts: {
        training: "Training",
        certification: "Certification",
        affiliations: "Hospital affiliations",
        languages: "Languages",
      },
      meet: "Meet Dr. Traverso",
    },
    conditions: {
      eyebrow: "Guides",
      title: "Hand and wrist symptoms",
    },
    contact: {
      eyebrow: "Schedule",
      title: "The office will call you",
      body: "Leave a name and a way to reach you. Someone from the office will get in touch to find a time.",
      callTitle: "Prefer to call?",
      callBody: "Talking to a person is often easier. The number will be a tap-to-call link.",
      visiting: "Visiting",
    },
    form: {
      errorsTitle: "Please check the form",
      errorPrefix: "Error:",
      name: "Your name",
      reach: "How can the office reach you?",
      reachHint: "One of these is enough.",
      phone: "Phone",
      email: "Email",
      time: "Preferred time",
      optional: "(optional)",
      anyTime: "Any time",
      morning: "Morning",
      afternoon: "Afternoon",
      noteStrong: "Please do not include symptoms or medical details.",
      note: "This form is only for contact details. The office will ask what it needs when it calls you.",
      submit: "Send",
      sending: "Sending",
      errorName: "Please tell us your name.",
      errorContact: "Please give a phone number or an email address so the office can reach you.",
    },
    sent: {
      eyebrow: "Thank you",
      title: "Your request is with the office",
      body: "Someone will call or email you to find a time.",
      prototype: "Prototype note: this preview does not send or store anything you type.",
      read: "Read guides",
      home: "Go home",
    },
    about: {
      eyebrow: "About the surgeon",
      approach: "Approach to care",
      training: "Training and certification",
      affiliations: "Hospital and surgery center affiliations",
      memberships: "Professional memberships",
    },
    physicians: {
      eyebrow: "For referring physicians and partners",
      intro: "Hand and wrist surgery, Coral Springs, Florida. This page sets out how to refer, what to include, and how the practice reports back.",
      fax: "Referral fax",
      secure: "Secure referral",
      line: "Physician line",
      toc: {
        scope: "Scope of practice",
        refer: "How to refer",
        include: "What to include",
        urgent: "Urgent referrals",
        reporting: "Reporting back",
        partners: "Working with the practice",
      },
      partnersIntro: "For partners, such as therapists, imaging centers and other organizations.",
      referSecure: "Send the referral through the practice's secure channel:",
      referFax: "Or fax it to",
      referContact: "The office contacts the patient directly to schedule.",
      noPatientInfo: "This website does not accept patient information. Please do not send clinical details through any form on this site.",
      includeNote: "Proposed list, to confirm with the practice.",
      include: [
        "Reason for referral and the question you would like answered",
        "Relevant history, examination findings and current treatment",
        "Imaging reports, and where to access the images",
        "Nerve conduction study results, if done",
        "Insurance details and any authorization numbers",
      ],
    },
    accessibility: {
      eyebrow: "Accessibility",
      title: "Using this site",
      intro: "We aim for this site to meet WCAG 2.2 at level AA.",
      figureTitle: "The 3D figure",
      points: [
        "Everything the 3D figure shows is also written out in the text next to it.",
        "Every structure on a figure is also in a text list, and can be chosen from either.",
        "On symptom pages, focus the viewer and use the arrow keys to rotate, L to switch between skin and inner layers, and R to reset.",
        "Motion on symptom pages starts paused. If your device is set to reduce motion, the figures do not animate.",
        "Without JavaScript, or on devices without 3D support, a still image is shown instead.",
      ],
      contactTitle: "Contact",
      contactLine: "If something on this site does not work for you, please tell us:",
    },
    notFound: {
      title: "This page is not here",
      body: "It may have moved. You can start again from what you are feeling.",
      cta: "Start again",
    },
  },

  // One entry per symptom page. S1 (the name) is fixed and lives in
  // lib/conditions.js. S4 is site.reviewed. S3, S5, S11 to S14 are shared.
  symptoms: {
    "carpal-tunnel-syndrome": {
      card: "My fingers go numb or tingle, often at night",
      S2: "Numbness or tingling in the thumb and first fingers. It is often linked to pressure on a nerve at the wrist.",
      S6: {
        intro:
          "On the palm side of the wrist there is a narrow passage (the carpal tunnel). A nerve (the median nerve) runs through it. When there is less room in the tunnel, the nerve may be squeezed. That can change how your fingers feel.",
        points: [
          "Numbness or tingling in the thumb, index and middle fingers",
          "Symptoms that wake you at night, or ease after you shake your hand",
          "Tingling while you hold a phone, a book or a steering wheel",
          "Over time, a weaker grip or dropping small things",
        ],
      },
      S7: "Highlighted: the median nerve, and the band of tissue (transverse carpal ligament) that forms the roof of the carpal tunnel.",
      S8: [
        "A conversation about what you are noticing, when it started and how it affects your day.",
        "An examination of your hand and wrist, including how your fingers feel.",
        todo("Which tests, if any, are used for this, from Dr. Traverso"),
        todo("How Dr. Traverso evaluates this in the practice"),
      ],
      S9: [
        "Options that do not involve surgery are often talked through first. Which may be appropriate depends on your examination and on what matters to you.",
        todo("Nonsurgical options the practice offers for this, from Dr. Traverso"),
      ],
      S10: [
        "If other options have not helped, surgery may be one option to talk through.",
        todo("When surgery is considered for this, from Dr. Traverso"),
      ],
      S15: { symptoms: ["de-quervains-tenosynovitis", "trigger-finger", "ganglion-cyst"], centres: todo("Which centres to link") },
      S16: {
        title: "Numb or tingling fingers (carpal tunnel syndrome)",
        description: "Numbness or tingling in the thumb and first fingers. What it may feel like and how it is evaluated.",
      },
    },

    "thumb-arthritis": {
      card: "The base of my thumb hurts when I grip or pinch",
      S2: "An ache at the base of the thumb when you grip or pinch. It is often linked to wear in the joint there.",
      S6: {
        intro:
          "Where the thumb meets the wrist, there is a joint. It lets the thumb swing across the palm to pinch and grip. Like other joints, its smooth surface (cartilage) may wear over time. When it does, the joint may become sore and stiff.",
        points: [
          "An ache at the base of the thumb when you open jars, turn keys or write",
          "Weakness when you pinch or grip",
          "Swelling, or a bump at the base of the thumb",
          "Pain that eases with rest and returns with use",
        ],
      },
      S7: "Highlighted: the joint at the base of the thumb, between a small wrist bone (trapezium) and the first bone of the thumb (first metacarpal).",
      S8: [
        "A conversation about what you are noticing, and which tasks are harder.",
        "An examination of your thumb and wrist.",
        todo("Which tests, if any, are used for this, from Dr. Traverso"),
        todo("How Dr. Traverso evaluates this in the practice"),
      ],
      S9: [
        "Options that do not involve surgery are often talked through first. Which may be appropriate depends on your examination and on what matters to you.",
        todo("Nonsurgical options the practice offers for this, from Dr. Traverso"),
      ],
      S10: [
        "If other options have not helped, surgery may be one option to talk through.",
        todo("When surgery is considered for this, from Dr. Traverso"),
      ],
      S15: { symptoms: ["de-quervains-tenosynovitis", "trigger-finger", "wrist-fracture"], centres: todo("Which centres to link") },
      S16: {
        title: "Pain at the base of the thumb (thumb base arthritis)",
        description: "An ache at the base of the thumb when you grip or pinch. What it may feel like and how it is evaluated.",
      },
    },

    "trigger-finger": {
      card: "A finger catches, clicks or locks when I bend it",
      S2: "A finger or thumb that catches, clicks or locks as it bends. It is often linked to a tendon that no longer glides smoothly.",
      S6: {
        intro:
          "The tendons that bend your fingers glide through a series of tunnels, a bit like a cord through rings. The first tunnel sits at the base of the finger. If it becomes tight, the tendon may catch as it moves.",
        points: [
          "A finger or thumb that clicks or catches when it bends",
          "A finger that locks bent and has to be straightened with the other hand",
          "A tender spot or small bump in the palm at the base of the finger",
          "Stiffness that is often worse in the morning",
        ],
      },
      S7: "Highlighted: the first ring-shaped tunnel (A1 pulley) at the base of the ring finger, and the tendons that bend the finger (flexor tendons).",
      S8: [
        "A conversation about which finger is affected and when it catches.",
        "An examination of your hand, including watching the finger bend and straighten.",
        todo("Whether tests are used for this, and how Dr. Traverso evaluates it in the practice"),
      ],
      S9: [
        "Options that do not involve surgery are often talked through first. Which may be appropriate depends on your examination and on what matters to you.",
        todo("Nonsurgical options the practice offers for this, from Dr. Traverso"),
      ],
      S10: [
        "If other options have not helped, surgery may be one option to talk through.",
        todo("When surgery is considered for this, from Dr. Traverso"),
      ],
      S15: { symptoms: ["dupuytrens-contracture", "thumb-arthritis", "carpal-tunnel-syndrome"], centres: todo("Which centres to link") },
      S16: {
        title: "A finger that catches or locks (trigger finger)",
        description: "A finger or thumb that catches, clicks or locks as it bends. What it may feel like and how it is evaluated.",
      },
    },

    "de-quervains-tenosynovitis": {
      card: "It hurts on the thumb side of my wrist",
      S2: "Pain on the thumb side of the wrist. It is often linked to irritation of two tendons that move the thumb.",
      S6: {
        intro:
          "Two tendons that move the thumb run together along the thumb side of the wrist. They pass through a snug tunnel. When the tendons or the tunnel lining are irritated, moving the thumb and wrist may hurt.",
        points: [
          "Pain on the thumb side of the wrist, sometimes running up the forearm",
          "Pain when you lift, grip, or turn the wrist with the thumb tucked in",
          "Swelling along the side of the wrist",
          "A catching feeling when you move the thumb",
        ],
      },
      S7: "Highlighted: two thumb tendons on the thumb side of the wrist (abductor pollicis longus and extensor pollicis brevis).",
      S8: [
        "A conversation about what you are noticing, and any change in your routine.",
        "An examination of your thumb and wrist, including some gentle movements.",
        todo("Whether tests are used for this, and how Dr. Traverso evaluates it in the practice"),
      ],
      S9: [
        "Options that do not involve surgery are often talked through first. Which may be appropriate depends on your examination and on what matters to you.",
        todo("Nonsurgical options the practice offers for this, from Dr. Traverso"),
      ],
      S10: [
        "If other options have not helped, surgery may be one option to talk through.",
        todo("When surgery is considered for this, from Dr. Traverso"),
      ],
      S15: { symptoms: ["thumb-arthritis", "carpal-tunnel-syndrome", "wrist-fracture"], centres: todo("Which centres to link") },
      S16: {
        title: "Pain on the thumb side of the wrist (De Quervain's tenosynovitis)",
        description: "Pain on the thumb side of the wrist when you lift or grip. What it may feel like and how it is evaluated.",
      },
    },

    "ganglion-cyst": {
      card: "I have a lump on my wrist",
      S2: "A lump on the wrist. One common cause is a fluid-filled sac (a ganglion).",
      S6: {
        intro:
          "A fluid-filled sac (a ganglion) can grow from the lining of a joint or tendon. On the wrist it often appears on the back. Sometimes it appears on the palm side. It may change size over time. A clinician can look at any new lump and talk it through with you.",
        points: [
          "A smooth, rounded lump on the wrist",
          "A lump that gets bigger or smaller over time",
          "An ache with use, or no pain at all",
          "Sometimes tingling, if the lump presses on a nearby nerve",
        ],
      },
      S7: "Highlighted: the back of the wrist. The lump shown is a drawn illustration, not part of the anatomy model.",
      S8: [
        "A conversation about when you first noticed the lump and whether it has changed.",
        "An examination of the lump and of your wrist.",
        todo("Which tests, if any, are used for this, from Dr. Traverso"),
        todo("How Dr. Traverso evaluates this in the practice"),
      ],
      S9: [
        "Some lumps may simply be watched over time. Whether that is appropriate depends on your examination and on what matters to you.",
        todo("Nonsurgical options the practice offers for this, from Dr. Traverso"),
      ],
      S10: [
        "In some situations, surgery may be one option to talk through.",
        todo("When surgery is considered for this, from Dr. Traverso"),
      ],
      S15: { symptoms: ["de-quervains-tenosynovitis", "wrist-fracture", "carpal-tunnel-syndrome"], centres: todo("Which centres to link") },
      S16: {
        title: "A lump on the wrist (ganglion cyst)",
        description: "A lump on the wrist, and one common cause of it. What it may feel like and how it is evaluated.",
      },
    },

    "wrist-fracture": {
      card: "My wrist has not recovered after a fall",
      S2: "A wrist that is still sore after a fall. A fall onto an outstretched hand can break one of the wrist bones.",
      S6: {
        intro:
          "A fall onto an outstretched hand can break one of the bones of the wrist. That might be the end of the forearm bone (radius). It might be one of the small wrist bones (carpal bones). Some breaks are clear straight away. Others are subtle. The wrist simply does not settle.",
        points: [
          "Pain and swelling after a fall that do not settle",
          "Tenderness on the thumb side of the wrist",
          "Difficulty gripping, or turning the wrist and forearm",
        ],
      },
      S7: "Highlighted: the end of the forearm bone (radius) and a small wrist bone (scaphoid).",
      S8: [
        "A conversation about the fall and what you have noticed since.",
        "An examination of your wrist and hand.",
        todo("Which tests or imaging, if any, are used for this, from Dr. Traverso"),
        todo("How Dr. Traverso evaluates this in the practice"),
      ],
      S9: [
        "Some breaks may be treated without surgery. Which options may be appropriate depends on the break and on your examination.",
        todo("Nonsurgical options the practice offers for this, from Dr. Traverso"),
      ],
      S10: [
        "For some breaks, surgery may be one option to talk through.",
        todo("When surgery is considered for this, from Dr. Traverso"),
      ],
      S15: { symptoms: ["ganglion-cyst", "thumb-arthritis", "de-quervains-tenosynovitis"], centres: todo("Which centres to link") },
      S16: {
        title: "A wrist that has not recovered after a fall (wrist fracture)",
        description: "A wrist that is still sore after a fall. What it may feel like and how it is evaluated.",
      },
    },

    "dupuytrens-contracture": {
      card: "My fingers are bending toward my palm and will not straighten",
      S2: "Fingers that slowly bend toward the palm. It is often linked to thickening of the tissue under the skin of the palm.",
      S6: {
        intro:
          "Under the skin of the palm is a layer of tough tissue. It may thicken and form lumps and cords. Over time, the cords may slowly pull one or more fingers toward the palm. Those fingers may no longer straighten fully. It is often not painful.",
        points: [
          "Firm lumps or pits in the skin of the palm",
          "A cord running from the palm into a finger",
          "A finger that will not fully straighten, often the ring or little finger",
          "Difficulty laying the hand flat, putting on gloves, or shaking hands",
        ],
      },
      S7: "Highlighted: the layer of tough tissue under the skin of the palm (palmar aponeurosis).",
      S8: [
        "A conversation about what you have noticed and how it affects your day.",
        "An examination of your palm and fingers, including how far each finger straightens.",
        todo("How Dr. Traverso evaluates this in the practice"),
      ],
      S9: [
        "Some people may choose to watch it over time. Which options may be appropriate depends on your examination and on what matters to you.",
        todo("Nonsurgical options the practice offers for this, from Dr. Traverso"),
      ],
      S10: [
        "If the fingers are drawn in further, surgery may be one option to talk through.",
        todo("When surgery is considered for this, from Dr. Traverso"),
      ],
      S15: { symptoms: ["trigger-finger", "thumb-arthritis", "carpal-tunnel-syndrome"], centres: todo("Which centres to link") },
      S16: {
        title: "Fingers drawing into the palm (Dupuytren's contracture)",
        description: "Fingers that slowly bend toward the palm and will not straighten. What it may feel like and how it is evaluated.",
      },
    },
  },
};
