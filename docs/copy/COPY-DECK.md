# THInc copy deck

Generated from `lib/copy` by `npm run copy:deck`. Do not edit by hand: change `lib/copy/draft.js` and run the script again.

- **Draft**: proposed, needs approval. **Approved**: in `lib/copy/approved.js`. **Missing**: a fact we do not have, marked `TODO(copy)`.
- Ray approves all wording. Anything marked "Clinical review: Yes" also needs Dr. Traverso before it moves to `approved.js`.
- Drafts show in preview builds only, with a dotted underline. A production build shows a TODO marker until a slot is approved.

## Shared slots (every symptom page)

| Slot | What | Proposed text | Words | Clinical review | Owner | Status | Missing (`TODO(copy)`) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S3 | No diagnosis needed to get in touch | You do not need a diagnosis to get in touch. Start with what you are feeling. | 16 | Yes | Ray | Draft |  |
| S4 | Reviewed by, dates (after approval only) | `TODO(copy)`: Reviewer name, review date and last updated date, added only after the page is approved | 0 | Yes | Practice | Missing | Reviewer name, review date and last updated date, added only after the page is approved |
| S5 | Navigation labels | **onThisPage:** On this page<br>**feel:** What it may feel like<br>**where:** Where this is in the hand<br>**evaluated:** How it is evaluated<br>**options:** Options that may be appropriate<br>**talk:** Talk it through<br>**related:** Related<br>**aside:** Talk to the practice<br>**nextStep:** Still not sure?<br>**schedule:** Schedule<br>**call:** Call THInc<br>**nonsurgical:** Options that do not involve surgery<br>**surgery:** When surgery may be considered | 48 | No | Ray | Draft |  |
| S11 | One line, no pressure | When you are ready, the practice is happy to talk it through with you. | 14 | No | Ray | Draft |  |
| S12 | Not a substitute for a consultation | `TODO(copy)`: Approved disclaimer wording, one site-wide. Proposed: "This guide is general education. It is not a diagnosis. It is not a substitute for a consultation with a clinician who can examine your hand." | 0 | Yes | Ray | Missing | Approved disclaimer wording, one site-wide. Proposed: "This guide is general education. It is not a diagnosis. It is not a substitute for a consultation with a clinician who can examine your hand." |
| S13 | Practice phone number | `TODO(copy)`: Practice phone number | 0 | No | Practice | Missing | Practice phone number |
| S14 | Line under "Still not sure?" | You do not need to know what is causing it. A consultation is a place to talk it through. | 19 | No | Ray | Draft |  |

## Homepage and anatomy section

| Key | Proposed text | Words | Clinical review | Status |
| --- | --- | --- | --- | --- |
| `home.hero.title` | How can we help you today? | 6 | No | Draft |
| `home.hero.body` | Start with what you are feeling. You do not need to know a diagnosis. | 14 | No | Draft |
| `home.hero.chooser` | Choose what sounds closest | 4 | No | Draft |
| `home.anatomy.title` | See the structure before you see the surgeon. | 8 | No | Approved |
| `home.anatomy.body` | Start with the anatomy. Our guides explain what a condition may feel like, how it is evaluated and what options may be appropriate. | 23 | Yes | Draft |
| `anatomy.caption` | Illustration for education only. Not a substitute for a consultation. | 10 | Yes | Approved |
| `anatomy.structurePending` | To be supplied and clinically reviewed. | 6 | Yes | Approved |
| `home.anatomy.structuresHeading` | Structures shown | 2 | No | Draft |
| `home.visit.title` | What to expect at a first visit | 7 | No | Draft |
| `home.visit.steps` | 1. We listen to what you are noticing.<br>2. We examine your hand and wrist.<br>3. We explain what we find, in plain words.<br>4. We talk through options together, including ones that do not involve surgery. | 33 | No | Draft |
| `home.surgeon.body` | Your first appointment is a conversation. We talk about what you are noticing and how it affects your day. We also talk through the options, including ones that do not involve surgery. | 32 | No | Draft |
| `home.professionals.title` | Referral process, what to include, and how the practice reports back. | 11 | No | Draft |
| `home.closing.title` | When you are ready, we will listen. | 7 | No | Draft |
| `home.closing.body` | Leave your name and a way to reach you. No health details are needed. The office will call you back. | 20 | No | Draft |
| `site.emergency` | `TODO(copy)`: Urgent-care wording, decision pending with Dr. Traverso. Earlier draft: "If you think you need urgent care, contact emergency services." | 0 | Yes | Missing |
| `home.anatomy.chapters.inside` | **eyebrow:** Under the skin<br>**title:** Muscles, tendons, nerves and vessels, in a small space.<br>**body:** Your fingers move because muscles pull on long tendons. Nerves carry feeling to each fingertip. Arteries and veins keep it all supplied.<br>**demo:** As you scroll, the skin is peeled away. | 42 | Yes | Draft |
| `home.anatomy.chapters.bones` | **eyebrow:** The frame<br>**title:** Small bones, working as one.<br>**body:** Beneath it all, the hand and wrist are built from many small bones. They glide against each other. When one is injured or worn, everyday movements may start to hurt.<br>**demo:** The bones drift apart so you can see each one. | 47 | Yes | Draft |
| `home.anatomy.chapters.carpal-tunnel-syndrome` | **eyebrow:** Numb or tingling fingers<br>**title:** A nerve in a narrow tunnel.<br>**body:** A nerve (the median nerve) passes through a narrow passage at the wrist (the carpal tunnel). When it is squeezed there, the thumb, index and middle fingers may tingle or go numb. This often happens at night.<br>**demo:** The signal fades as it passes through the tunnel. | 56 | Yes | Draft |
| `home.anatomy.chapters.trigger-finger` | **eyebrow:** A finger that catches or locks<br>**title:** Tendons glide through snug tunnels.<br>**body:** Each finger bends because a tendon slides through a series of rings. If the first ring tightens, the tendon may catch. The finger may then click or lock as it bends.<br>**demo:** The ring finger bends, catches at the base, then moves through. | 53 | Yes | Draft |
| `home.anatomy.chapters.thumb-arthritis` | **eyebrow:** Pain at the base of the thumb<br>**title:** One small joint does a lot of work.<br>**body:** Where the thumb meets the wrist, a joint lets you pinch, grip and turn keys. When its surfaces wear, those simple tasks may ache.<br>**demo:** Each pinch loads the joint at the base of the thumb. | 50 | Yes | Draft |
| `home.anatomy.chapters.de-quervains-tenosynovitis` | **eyebrow:** Pain on the thumb side of the wrist<br>**title:** Two tendons, one tight passage.<br>**body:** Two tendons that move the thumb run together along the side of the wrist. When they or their tunnel are irritated, lifting and gripping may hurt.<br>**demo:** Tucking the thumb into a fist stretches the two tendons. | 49 | Yes | Draft |
| `home.anatomy.chapters.ganglion-cyst` | **eyebrow:** A lump on the wrist<br>**title:** Sometimes the answer is on the back of the hand.<br>**body:** One common cause of a wrist lump is a fluid-filled sac (a ganglion). It grows from the lining of a joint or tendon. The lump shown here is a drawn illustration.<br>**demo:** A ganglion may grow and shrink over time. | 54 | Yes | Draft |
| `home.anatomy.chapters.wrist-fracture` | **eyebrow:** A wrist that has not recovered after a fall<br>**title:** Small bones, big falls.<br>**body:** A fall onto an outstretched hand can break the end of the forearm bone (radius). It can also break a small wrist bone (scaphoid). Some breaks only show up as a wrist that does not settle.<br>**demo:** A fall sends force through the wrist bones. | 57 | Yes | Draft |
| `home.anatomy.chapters.dupuytrens-contracture` | **eyebrow:** Fingers drawing into the palm<br>**title:** A layer in the palm that can tighten.<br>**body:** Under the skin of the palm lies a fan of tough tissue. It may thicken into cords. Over time, the cords may draw a finger toward the palm. The finger may then not straighten fully.<br>**demo:** The ring and little fingers are drawn in. | 56 | Yes | Draft |

## Interface labels and other pages

Not clinical. Ray approves.

| Key | Proposed text | Words | Status |
| --- | --- | --- | --- |
| `meta.siteTitle` | Hand and wrist surgeon in Coral Springs, FL | 8 | Draft |
| `meta.siteDescription` | Plain-language guides to hand and wrist symptoms, and how to reach Dr. Purnell Traverso, hand and wrist surgeon in Coral Springs, Florida. | 22 | Draft |
| `meta.about` | About Dr. Purnell Traverso | 4 | Draft |
| `meta.aboutDescription` | Dr. Purnell Traverso, hand and wrist surgeon in Coral Springs, Florida. | 11 | Draft |
| `meta.physicians` | For referring physicians and partners | 5 | Draft |
| `meta.physiciansDescription` | How to refer to Dr. Purnell Traverso, what to include, and how to work with the practice. | 17 | Draft |
| `meta.accessibility` | Accessibility | 1 | Draft |
| `meta.sent` | Request received | 2 | Draft |
| `ui.skip` | Skip to main content | 4 | Draft |
| `ui.menu` | Menu | 1 | Draft |
| `ui.nav.symptoms` | Symptoms | 1 | Draft |
| `ui.nav.anatomy` | Anatomy | 1 | Draft |
| `ui.nav.visit` | Your visit | 2 | Draft |
| `ui.nav.about` | About the surgeon | 3 | Draft |
| `ui.nav.physicians` | For physicians | 2 | Draft |
| `ui.tagline` | Hand and wrist surgery, Coral Springs | 6 | Draft |
| `ui.breadcrumbHome` | Home | 1 | Draft |
| `ui.footer.symptoms` | Symptoms | 1 | Draft |
| `ui.footer.patients` | Patients | 1 | Draft |
| `ui.footer.professionals` | Professionals | 1 | Draft |
| `ui.footer.startSymptom` | Start with a symptom | 4 | Draft |
| `ui.footer.firstVisit` | Your first visit | 3 | Draft |
| `ui.footer.schedule` | Schedule | 1 | Draft |
| `ui.footer.about` | About the surgeon | 3 | Draft |
| `ui.footer.referring` | Referring physicians | 2 | Draft |
| `ui.footer.howToRefer` | How to refer | 3 | Draft |
| `ui.footer.accessibility` | Accessibility | 1 | Draft |
| `ui.footer.credit` | 3D anatomy: Open3DModel "Hand, complete", Open3D project, AnatomyTOOL.org, based on BodyParts3D and Z-Anatomy, licensed CC BY-SA 4.0, simplified for the web. Skin: WebXR Input Profiles generic hand, MIT license, copyright 2019 Amazon, smoothed and re-rigged. The ganglion shown is an illustration. | 41 | Draft |
| `ui.viewer.skin` | Skin | 1 | Draft |
| `ui.viewer.inside` | Inside | 1 | Draft |
| `ui.viewer.rotateLeft` | Rotate left | 2 | Draft |
| `ui.viewer.rotateRight` | Rotate right | 2 | Draft |
| `ui.viewer.reset` | Reset | 1 | Draft |
| `ui.viewer.play` | Play motion | 2 | Draft |
| `ui.viewer.pause` | Pause motion | 2 | Draft |
| `ui.viewer.loading` | Loading the 3D figure | 4 | Draft |
| `ui.viewer.unavailable` | The 3D view is not available on this device. | 9 | Draft |
| `ui.viewer.structures` | Structures shown | 2 | Draft |
| `ui.viewer.show` | Show | 1 | Draft |
| `ui.viewer.hide` | Hide | 1 | Draft |
| `ui.viewer.onFigure` | Find on figure | 3 | Draft |
| `pages.home.step` | Step | 1 | Draft |
| `pages.home.practical.title` | Practical details | 2 | Draft |
| `pages.home.practical.where` | Where | 1 | Draft |
| `pages.home.practical.when` | When | 1 | Draft |
| `pages.home.practical.insurance` | Insurance | 1 | Draft |
| `pages.home.facts.training` | Training | 1 | Draft |
| `pages.home.facts.certification` | Certification | 1 | Draft |
| `pages.home.facts.affiliations` | Hospital affiliations | 2 | Draft |
| `pages.home.facts.languages` | Languages | 1 | Draft |
| `pages.home.meet` | Meet Dr. Traverso | 3 | Draft |
| `pages.conditions.eyebrow` | Guides | 1 | Draft |
| `pages.conditions.title` | Hand and wrist symptoms | 4 | Draft |
| `pages.contact.eyebrow` | Schedule | 1 | Draft |
| `pages.contact.title` | The office will call you | 5 | Draft |
| `pages.contact.body` | Leave a name and a way to reach you. Someone from the office will get in touch to find a time. | 21 | Draft |
| `pages.contact.callTitle` | Prefer to call? | 3 | Draft |
| `pages.contact.callBody` | Talking to a person is often easier. The number will be a tap-to-call link. | 14 | Draft |
| `pages.contact.visiting` | Visiting | 1 | Draft |
| `pages.form.errorsTitle` | Please check the form | 4 | Draft |
| `pages.form.errorPrefix` | Error: | 1 | Draft |
| `pages.form.name` | Your name | 2 | Draft |
| `pages.form.reach` | How can the office reach you? | 6 | Draft |
| `pages.form.reachHint` | One of these is enough. | 5 | Draft |
| `pages.form.phone` | Phone | 1 | Draft |
| `pages.form.email` | Email | 1 | Draft |
| `pages.form.time` | Preferred time | 2 | Draft |
| `pages.form.optional` | (optional) | 1 | Draft |
| `pages.form.anyTime` | Any time | 2 | Draft |
| `pages.form.morning` | Morning | 1 | Draft |
| `pages.form.afternoon` | Afternoon | 1 | Draft |
| `pages.form.noteStrong` | Please do not include symptoms or medical details. | 8 | Draft |
| `pages.form.note` | This form is only for contact details. The office will ask what it needs when it calls you. | 18 | Draft |
| `pages.form.submit` | Send | 1 | Draft |
| `pages.form.sending` | Sending | 1 | Draft |
| `pages.form.errorName` | Please tell us your name. | 5 | Draft |
| `pages.form.errorContact` | Please give a phone number or an email address so the office can reach you. | 15 | Draft |
| `pages.sent.eyebrow` | Thank you | 2 | Draft |
| `pages.sent.title` | Your request is with the office | 6 | Draft |
| `pages.sent.body` | Someone will call or email you to find a time. | 10 | Draft |
| `pages.sent.prototype` | Prototype note: this preview does not send or store anything you type. | 12 | Draft |
| `pages.sent.read` | Read guides | 2 | Draft |
| `pages.sent.home` | Go home | 2 | Draft |
| `pages.about.eyebrow` | About the surgeon | 3 | Draft |
| `pages.about.approach` | Approach to care | 3 | Draft |
| `pages.about.training` | Training and certification | 3 | Draft |
| `pages.about.affiliations` | Hospital and surgery center affiliations | 5 | Draft |
| `pages.about.memberships` | Professional memberships | 2 | Draft |
| `pages.physicians.eyebrow` | For referring physicians and partners | 5 | Draft |
| `pages.physicians.intro` | Hand and wrist surgery, Coral Springs, Florida. This page sets out how to refer, what to include, and how the practice reports back. | 23 | Draft |
| `pages.physicians.fax` | Referral fax | 2 | Draft |
| `pages.physicians.secure` | Secure referral | 2 | Draft |
| `pages.physicians.line` | Physician line | 2 | Draft |
| `pages.physicians.toc.scope` | Scope of practice | 3 | Draft |
| `pages.physicians.toc.refer` | How to refer | 3 | Draft |
| `pages.physicians.toc.include` | What to include | 3 | Draft |
| `pages.physicians.toc.urgent` | Urgent referrals | 2 | Draft |
| `pages.physicians.toc.reporting` | Reporting back | 2 | Draft |
| `pages.physicians.toc.partners` | Working with the practice | 4 | Draft |
| `pages.physicians.partnersIntro` | For partners, such as therapists, imaging centers and other organizations. | 10 | Draft |
| `pages.physicians.referSecure` | Send the referral through the practice's secure channel: | 8 | Draft |
| `pages.physicians.referFax` | Or fax it to | 4 | Draft |
| `pages.physicians.referContact` | The office contacts the patient directly to schedule. | 8 | Draft |
| `pages.physicians.noPatientInfo` | This website does not accept patient information. Please do not send clinical details through any form on this site. | 19 | Draft |
| `pages.physicians.includeNote` | Proposed list, to confirm with the practice. | 7 | Draft |
| `pages.physicians.include` | 1. Reason for referral and the question you would like answered<br>2. Relevant history, examination findings and current treatment<br>3. Imaging reports, and where to access the images<br>4. Nerve conduction study results, if done<br>5. Insurance details and any authorization numbers | 37 | Draft |
| `pages.accessibility.eyebrow` | Accessibility | 1 | Draft |
| `pages.accessibility.title` | Using this site | 3 | Draft |
| `pages.accessibility.intro` | We aim for this site to meet WCAG 2.2 at level AA. | 12 | Draft |
| `pages.accessibility.figureTitle` | The 3D figure | 3 | Draft |
| `pages.accessibility.points` | 1. Everything the 3D figure shows is also written out in the text next to it.<br>2. Every structure on a figure is also in a text list, and can be chosen from either.<br>3. On symptom pages, focus the viewer and use the arrow keys to rotate, L to switch between skin and inner layers, and R to reset.<br>4. Motion on symptom pages starts paused. If your device is set to reduce motion, the figures do not animate.<br>5. Without JavaScript, or on devices without 3D support, a still image is shown instead. | 90 | Draft |
| `pages.accessibility.contactTitle` | Contact | 1 | Draft |
| `pages.accessibility.contactLine` | If something on this site does not work for you, please tell us: | 13 | Draft |
| `pages.notFound.title` | This page is not here | 5 | Draft |
| `pages.notFound.body` | It may have moved. You can start again from what you are feeling. | 13 | Draft |
| `pages.notFound.cta` | Start again | 2 | Draft |

## Anatomy structure names

Shown in the figure margins and the structure lists. Clinical review: Yes.

| Key | Proposed text | Words | Clinical review | Status |
| --- | --- | --- | --- | --- |
| `anatomy.structures.muscle` | Muscle | 1 | Yes | Draft |
| `anatomy.structures.tendon` | Tendon | 1 | Yes | Draft |
| `anatomy.structures.nerve` | Nerve | 1 | Yes | Draft |
| `anatomy.structures.artery` | Artery | 1 | Yes | Draft |
| `anatomy.structures.vein` | Vein | 1 | Yes | Draft |
| `anatomy.structures.scaphoid` | Scaphoid | 1 | Yes | Draft |
| `anatomy.structures.metacarpal` | Metacarpal | 1 | Yes | Draft |
| `anatomy.structures.phalanx` | Phalanx | 1 | Yes | Draft |
| `anatomy.structures.median` | Median nerve | 2 | Yes | Draft |
| `anatomy.structures.ligament` | Transverse carpal ligament | 3 | Yes | Draft |
| `anatomy.structures.a1` | A1 pulley | 2 | Yes | Draft |
| `anatomy.structures.flexor` | Flexor tendons | 2 | Yes | Draft |
| `anatomy.structures.cmc` | Trapezium | 1 | Yes | Draft |
| `anatomy.structures.mc1` | First metacarpal | 2 | Yes | Draft |
| `anatomy.structures.dq` | Abductor pollicis longus | 3 | Yes | Draft |
| `anatomy.structures.dq2` | Extensor pollicis brevis | 3 | Yes | Draft |
| `anatomy.structures.ganglion` | Ganglion (illustration) | 2 | Yes | Draft |
| `anatomy.structures.radius` | Radius | 1 | Yes | Draft |
| `anatomy.structures.aponeurosis` | Palmar aponeurosis | 2 | Yes | Draft |

## Carpal tunnel syndrome

Page: `/conditions/carpal-tunnel-syndrome`. Card line on the homepage: My fingers go numb or tingle, often at night (9 words, draft).

| Slot | What | Proposed text | Words | Clinical review | Owner | Status | Missing (`TODO(copy)`) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Symptom name (fixed) | Carpal tunnel syndrome | 3 | No | Fixed | Fixed |  |
| S2 | One-line description | Numbness or tingling in the thumb and first fingers. It is often linked to pressure on a nerve at the wrist. | 21 | Yes | Ray | Draft |  |
| S6 | Plain-language description | **intro:** On the palm side of the wrist there is a narrow passage (the carpal tunnel). A nerve (the median nerve) runs through it. When there is less room in the tunnel, the nerve may be squeezed. That can change how your fingers feel.<br>**points:**<br>1. Numbness or tingling in the thumb, index and middle fingers<br>2. Symptoms that wake you at night, or ease after you shake your hand<br>3. Tingling while you hold a phone, a book or a steering wheel<br>4. Over time, a weaker grip or dropping small things | 87 | Yes | Ray | Draft |  |
| S7 | Caption for the structure | Highlighted: the median nerve, and the band of tissue (transverse carpal ligament) that forms the roof of the carpal tunnel. | 20 | Yes | Ray | Draft |  |
| S8 | Evaluation steps, in order | 1. A conversation about what you are noticing, when it started and how it affects your day.<br>2. An examination of your hand and wrist, including how your fingers feel.<br>3. `TODO(copy)`: Which tests, if any, are used for this, from Dr. Traverso<br>4. `TODO(copy)`: How Dr. Traverso evaluates this in the practice | 28 | Yes | Ray | Draft | Which tests, if any, are used for this, from Dr. Traverso; How Dr. Traverso evaluates this in the practice |
| S9 | Nonsurgical options | 1. Options that do not involve surgery are often talked through first. Which may be appropriate depends on your examination and on what matters to you.<br>2. `TODO(copy)`: Nonsurgical options the practice offers for this, from Dr. Traverso | 25 | Yes | Ray | Draft | Nonsurgical options the practice offers for this, from Dr. Traverso |
| S10 | When surgery is considered | 1. If other options have not helped, surgery may be one option to talk through.<br>2. `TODO(copy)`: When surgery is considered for this, from Dr. Traverso | 14 | Yes | Ray | Draft | When surgery is considered for this, from Dr. Traverso |
| S15 | Symptoms and centres to link | **symptoms:**<br>1. de-quervains-tenosynovitis<br>2. trigger-finger<br>3. ganglion-cyst<br>`TODO(copy)`: Which centres to link | 3 | Yes | Ray | Draft | Which centres to link |
| S16 | SEO title and Open Graph text | **title:** Numb or tingling fingers (carpal tunnel syndrome)<br>**description:** Numbness or tingling in the thumb and first fingers. What it may feel like and how it is evaluated. | 26 | No | Ray | Draft |  |
| S3, S4, S5, S11 to S14 | Shared | See shared slots | | | | | |

## Thumb base arthritis

Page: `/conditions/thumb-arthritis`. Card line on the homepage: The base of my thumb hurts when I grip or pinch (11 words, draft).

| Slot | What | Proposed text | Words | Clinical review | Owner | Status | Missing (`TODO(copy)`) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Symptom name (fixed) | Thumb base arthritis | 3 | No | Fixed | Fixed |  |
| S2 | One-line description | An ache at the base of the thumb when you grip or pinch. It is often linked to wear in the joint there. | 23 | Yes | Ray | Draft |  |
| S6 | Plain-language description | **intro:** Where the thumb meets the wrist, there is a joint. It lets the thumb swing across the palm to pinch and grip. Like other joints, its smooth surface (cartilage) may wear over time. When it does, the joint may become sore and stiff.<br>**points:**<br>1. An ache at the base of the thumb when you open jars, turn keys or write<br>2. Weakness when you pinch or grip<br>3. Swelling, or a bump at the base of the thumb<br>4. Pain that eases with rest and returns with use | 84 | Yes | Ray | Draft |  |
| S7 | Caption for the structure | Highlighted: the joint at the base of the thumb, between a small wrist bone (trapezium) and the first bone of the thumb (first metacarpal). | 24 | Yes | Ray | Draft |  |
| S8 | Evaluation steps, in order | 1. A conversation about what you are noticing, and which tasks are harder.<br>2. An examination of your thumb and wrist.<br>3. `TODO(copy)`: Which tests, if any, are used for this, from Dr. Traverso<br>4. `TODO(copy)`: How Dr. Traverso evaluates this in the practice | 19 | Yes | Ray | Draft | Which tests, if any, are used for this, from Dr. Traverso; How Dr. Traverso evaluates this in the practice |
| S9 | Nonsurgical options | 1. Options that do not involve surgery are often talked through first. Which may be appropriate depends on your examination and on what matters to you.<br>2. `TODO(copy)`: Nonsurgical options the practice offers for this, from Dr. Traverso | 25 | Yes | Ray | Draft | Nonsurgical options the practice offers for this, from Dr. Traverso |
| S10 | When surgery is considered | 1. If other options have not helped, surgery may be one option to talk through.<br>2. `TODO(copy)`: When surgery is considered for this, from Dr. Traverso | 14 | Yes | Ray | Draft | When surgery is considered for this, from Dr. Traverso |
| S15 | Symptoms and centres to link | **symptoms:**<br>1. de-quervains-tenosynovitis<br>2. trigger-finger<br>3. wrist-fracture<br>`TODO(copy)`: Which centres to link | 3 | Yes | Ray | Draft | Which centres to link |
| S16 | SEO title and Open Graph text | **title:** Pain at the base of the thumb (thumb base arthritis)<br>**description:** An ache at the base of the thumb when you grip or pinch. What it may feel like and how it is evaluated. | 33 | No | Ray | Draft |  |
| S3, S4, S5, S11 to S14 | Shared | See shared slots | | | | | |

## Trigger finger

Page: `/conditions/trigger-finger`. Card line on the homepage: A finger catches, clicks or locks when I bend it (10 words, draft).

| Slot | What | Proposed text | Words | Clinical review | Owner | Status | Missing (`TODO(copy)`) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Symptom name (fixed) | Trigger finger | 2 | No | Fixed | Fixed |  |
| S2 | One-line description | A finger or thumb that catches, clicks or locks as it bends. It is often linked to a tendon that no longer glides smoothly. | 24 | Yes | Ray | Draft |  |
| S6 | Plain-language description | **intro:** The tendons that bend your fingers glide through a series of tunnels, a bit like a cord through rings. The first tunnel sits at the base of the finger. If it becomes tight, the tendon may catch as it moves.<br>**points:**<br>1. A finger or thumb that clicks or catches when it bends<br>2. A finger that locks bent and has to be straightened with the other hand<br>3. A tender spot or small bump in the palm at the base of the finger<br>4. Stiffness that is often worse in the morning | 88 | Yes | Ray | Draft |  |
| S7 | Caption for the structure | Highlighted: the first ring-shaped tunnel (A1 pulley) at the base of the ring finger, and the tendons that bend the finger (flexor tendons). | 23 | Yes | Ray | Draft |  |
| S8 | Evaluation steps, in order | 1. A conversation about which finger is affected and when it catches.<br>2. An examination of your hand, including watching the finger bend and straighten.<br>3. `TODO(copy)`: Whether tests are used for this, and how Dr. Traverso evaluates it in the practice | 23 | Yes | Ray | Draft | Whether tests are used for this, and how Dr. Traverso evaluates it in the practice |
| S9 | Nonsurgical options | 1. Options that do not involve surgery are often talked through first. Which may be appropriate depends on your examination and on what matters to you.<br>2. `TODO(copy)`: Nonsurgical options the practice offers for this, from Dr. Traverso | 25 | Yes | Ray | Draft | Nonsurgical options the practice offers for this, from Dr. Traverso |
| S10 | When surgery is considered | 1. If other options have not helped, surgery may be one option to talk through.<br>2. `TODO(copy)`: When surgery is considered for this, from Dr. Traverso | 14 | Yes | Ray | Draft | When surgery is considered for this, from Dr. Traverso |
| S15 | Symptoms and centres to link | **symptoms:**<br>1. dupuytrens-contracture<br>2. thumb-arthritis<br>3. carpal-tunnel-syndrome<br>`TODO(copy)`: Which centres to link | 3 | Yes | Ray | Draft | Which centres to link |
| S16 | SEO title and Open Graph text | **title:** A finger that catches or locks (trigger finger)<br>**description:** A finger or thumb that catches, clicks or locks as it bends. What it may feel like and how it is evaluated. | 30 | No | Ray | Draft |  |
| S3, S4, S5, S11 to S14 | Shared | See shared slots | | | | | |

## De Quervain's tenosynovitis

Page: `/conditions/de-quervains-tenosynovitis`. Card line on the homepage: It hurts on the thumb side of my wrist (9 words, draft).

| Slot | What | Proposed text | Words | Clinical review | Owner | Status | Missing (`TODO(copy)`) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Symptom name (fixed) | De Quervain's tenosynovitis | 3 | No | Fixed | Fixed |  |
| S2 | One-line description | Pain on the thumb side of the wrist. It is often linked to irritation of two tendons that move the thumb. | 21 | Yes | Ray | Draft |  |
| S6 | Plain-language description | **intro:** Two tendons that move the thumb run together along the thumb side of the wrist. They pass through a snug tunnel. When the tendons or the tunnel lining are irritated, moving the thumb and wrist may hurt.<br>**points:**<br>1. Pain on the thumb side of the wrist, sometimes running up the forearm<br>2. Pain when you lift, grip, or turn the wrist with the thumb tucked in<br>3. Swelling along the side of the wrist<br>4. A catching feeling when you move the thumb | 79 | Yes | Ray | Draft |  |
| S7 | Caption for the structure | Highlighted: two thumb tendons on the thumb side of the wrist (abductor pollicis longus and extensor pollicis brevis). | 18 | Yes | Ray | Draft |  |
| S8 | Evaluation steps, in order | 1. A conversation about what you are noticing, and any change in your routine.<br>2. An examination of your thumb and wrist, including some gentle movements.<br>3. `TODO(copy)`: Whether tests are used for this, and how Dr. Traverso evaluates it in the practice | 24 | Yes | Ray | Draft | Whether tests are used for this, and how Dr. Traverso evaluates it in the practice |
| S9 | Nonsurgical options | 1. Options that do not involve surgery are often talked through first. Which may be appropriate depends on your examination and on what matters to you.<br>2. `TODO(copy)`: Nonsurgical options the practice offers for this, from Dr. Traverso | 25 | Yes | Ray | Draft | Nonsurgical options the practice offers for this, from Dr. Traverso |
| S10 | When surgery is considered | 1. If other options have not helped, surgery may be one option to talk through.<br>2. `TODO(copy)`: When surgery is considered for this, from Dr. Traverso | 14 | Yes | Ray | Draft | When surgery is considered for this, from Dr. Traverso |
| S15 | Symptoms and centres to link | **symptoms:**<br>1. thumb-arthritis<br>2. carpal-tunnel-syndrome<br>3. wrist-fracture<br>`TODO(copy)`: Which centres to link | 3 | Yes | Ray | Draft | Which centres to link |
| S16 | SEO title and Open Graph text | **title:** Pain on the thumb side of the wrist (De Quervain's tenosynovitis)<br>**description:** Pain on the thumb side of the wrist when you lift or grip. What it may feel like and how it is evaluated. | 34 | No | Ray | Draft |  |
| S3, S4, S5, S11 to S14 | Shared | See shared slots | | | | | |

## Ganglion cyst

Page: `/conditions/ganglion-cyst`. Card line on the homepage: I have a lump on my wrist (7 words, draft).

| Slot | What | Proposed text | Words | Clinical review | Owner | Status | Missing (`TODO(copy)`) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Symptom name (fixed) | Ganglion cyst | 2 | No | Fixed | Fixed |  |
| S2 | One-line description | A lump on the wrist. One common cause is a fluid-filled sac (a ganglion). | 14 | Yes | Ray | Draft |  |
| S6 | Plain-language description | **intro:** A fluid-filled sac (a ganglion) can grow from the lining of a joint or tendon. On the wrist it often appears on the back. Sometimes it appears on the palm side. It may change size over time. A clinician can look at any new lump and talk it through with you.<br>**points:**<br>1. A smooth, rounded lump on the wrist<br>2. A lump that gets bigger or smaller over time<br>3. An ache with use, or no pain at all<br>4. Sometimes tingling, if the lump presses on a nearby nerve | 86 | Yes | Ray | Draft |  |
| S7 | Caption for the structure | Highlighted: the back of the wrist. The lump shown is a drawn illustration, not part of the anatomy model. | 19 | Yes | Ray | Draft |  |
| S8 | Evaluation steps, in order | 1. A conversation about when you first noticed the lump and whether it has changed.<br>2. An examination of the lump and of your wrist.<br>3. `TODO(copy)`: Which tests, if any, are used for this, from Dr. Traverso<br>4. `TODO(copy)`: How Dr. Traverso evaluates this in the practice | 23 | Yes | Ray | Draft | Which tests, if any, are used for this, from Dr. Traverso; How Dr. Traverso evaluates this in the practice |
| S9 | Nonsurgical options | 1. Some lumps may simply be watched over time. Whether that is appropriate depends on your examination and on what matters to you.<br>2. `TODO(copy)`: Nonsurgical options the practice offers for this, from Dr. Traverso | 22 | Yes | Ray | Draft | Nonsurgical options the practice offers for this, from Dr. Traverso |
| S10 | When surgery is considered | 1. In some situations, surgery may be one option to talk through.<br>2. `TODO(copy)`: When surgery is considered for this, from Dr. Traverso | 11 | Yes | Ray | Draft | When surgery is considered for this, from Dr. Traverso |
| S15 | Symptoms and centres to link | **symptoms:**<br>1. de-quervains-tenosynovitis<br>2. wrist-fracture<br>3. carpal-tunnel-syndrome<br>`TODO(copy)`: Which centres to link | 3 | Yes | Ray | Draft | Which centres to link |
| S16 | SEO title and Open Graph text | **title:** A lump on the wrist (ganglion cyst)<br>**description:** A lump on the wrist, and one common cause of it. What it may feel like and how it is evaluated. | 28 | No | Ray | Draft |  |
| S3, S4, S5, S11 to S14 | Shared | See shared slots | | | | | |

## Wrist fracture

Page: `/conditions/wrist-fracture`. Card line on the homepage: My wrist has not recovered after a fall (8 words, draft).

| Slot | What | Proposed text | Words | Clinical review | Owner | Status | Missing (`TODO(copy)`) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Symptom name (fixed) | Wrist fracture | 2 | No | Fixed | Fixed |  |
| S2 | One-line description | A wrist that is still sore after a fall. A fall onto an outstretched hand can break one of the wrist bones. | 22 | Yes | Ray | Draft |  |
| S6 | Plain-language description | **intro:** A fall onto an outstretched hand can break one of the bones of the wrist. That might be the end of the forearm bone (radius). It might be one of the small wrist bones (carpal bones). Some breaks are clear straight away. Others are subtle. The wrist simply does not settle.<br>**points:**<br>1. Pain and swelling after a fall that do not settle<br>2. Tenderness on the thumb side of the wrist<br>3. Difficulty gripping, or turning the wrist and forearm | 77 | Yes | Ray | Draft |  |
| S7 | Caption for the structure | Highlighted: the end of the forearm bone (radius) and a small wrist bone (scaphoid). | 14 | Yes | Ray | Draft |  |
| S8 | Evaluation steps, in order | 1. A conversation about the fall and what you have noticed since.<br>2. An examination of your wrist and hand.<br>3. `TODO(copy)`: Which tests or imaging, if any, are used for this, from Dr. Traverso<br>4. `TODO(copy)`: How Dr. Traverso evaluates this in the practice | 18 | Yes | Ray | Draft | Which tests or imaging, if any, are used for this, from Dr. Traverso; How Dr. Traverso evaluates this in the practice |
| S9 | Nonsurgical options | 1. Some breaks may be treated without surgery. Which options may be appropriate depends on the break and on your examination.<br>2. `TODO(copy)`: Nonsurgical options the practice offers for this, from Dr. Traverso | 20 | Yes | Ray | Draft | Nonsurgical options the practice offers for this, from Dr. Traverso |
| S10 | When surgery is considered | 1. For some breaks, surgery may be one option to talk through.<br>2. `TODO(copy)`: When surgery is considered for this, from Dr. Traverso | 11 | Yes | Ray | Draft | When surgery is considered for this, from Dr. Traverso |
| S15 | Symptoms and centres to link | **symptoms:**<br>1. ganglion-cyst<br>2. thumb-arthritis<br>3. de-quervains-tenosynovitis<br>`TODO(copy)`: Which centres to link | 3 | Yes | Ray | Draft | Which centres to link |
| S16 | SEO title and Open Graph text | **title:** A wrist that has not recovered after a fall (wrist fracture)<br>**description:** A wrist that is still sore after a fall. What it may feel like and how it is evaluated. | 30 | No | Ray | Draft |  |
| S3, S4, S5, S11 to S14 | Shared | See shared slots | | | | | |

## Dupuytren's contracture

Page: `/conditions/dupuytrens-contracture`. Card line on the homepage: My fingers are bending toward my palm and will not straighten (11 words, draft).

| Slot | What | Proposed text | Words | Clinical review | Owner | Status | Missing (`TODO(copy)`) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Symptom name (fixed) | Dupuytren's contracture | 2 | No | Fixed | Fixed |  |
| S2 | One-line description | Fingers that slowly bend toward the palm. It is often linked to thickening of the tissue under the skin of the palm. | 22 | Yes | Ray | Draft |  |
| S6 | Plain-language description | **intro:** Under the skin of the palm is a layer of tough tissue. It may thicken and form lumps and cords. Over time, the cords may slowly pull one or more fingers toward the palm. Those fingers may no longer straighten fully. It is often not painful.<br>**points:**<br>1. Firm lumps or pits in the skin of the palm<br>2. A cord running from the palm into a finger<br>3. A finger that will not fully straighten, often the ring or little finger<br>4. Difficulty laying the hand flat, putting on gloves, or shaking hands | 89 | Yes | Ray | Draft |  |
| S7 | Caption for the structure | Highlighted: the layer of tough tissue under the skin of the palm (palmar aponeurosis). | 14 | Yes | Ray | Draft |  |
| S8 | Evaluation steps, in order | 1. A conversation about what you have noticed and how it affects your day.<br>2. An examination of your palm and fingers, including how far each finger straightens.<br>3. `TODO(copy)`: How Dr. Traverso evaluates this in the practice | 26 | Yes | Ray | Draft | How Dr. Traverso evaluates this in the practice |
| S9 | Nonsurgical options | 1. Some people may choose to watch it over time. Which options may be appropriate depends on your examination and on what matters to you.<br>2. `TODO(copy)`: Nonsurgical options the practice offers for this, from Dr. Traverso | 24 | Yes | Ray | Draft | Nonsurgical options the practice offers for this, from Dr. Traverso |
| S10 | When surgery is considered | 1. If the fingers are drawn in further, surgery may be one option to talk through.<br>2. `TODO(copy)`: When surgery is considered for this, from Dr. Traverso | 15 | Yes | Ray | Draft | When surgery is considered for this, from Dr. Traverso |
| S15 | Symptoms and centres to link | **symptoms:**<br>1. trigger-finger<br>2. thumb-arthritis<br>3. carpal-tunnel-syndrome<br>`TODO(copy)`: Which centres to link | 3 | Yes | Ray | Draft | Which centres to link |
| S16 | SEO title and Open Graph text | **title:** Fingers drawing into the palm (Dupuytren's contracture)<br>**description:** Fingers that slowly bend toward the palm and will not straighten. What it may feel like and how it is evaluated. | 28 | No | Ray | Draft |  |
| S3, S4, S5, S11 to S14 | Shared | See shared slots | | | | | |

## Eighth symptom page

`TODO(copy)`: COPY-BRIEF.md §4 expects eight symptom pages. Seven exist. The eighth symptom has not been named.

