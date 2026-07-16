const WIX = (file, w, h) =>
  `https://static.wixstatic.com/media/${file}/v1/fill/w_${w},h_${h},al_c,q_85,usm_0.66_1.00_0.01/${file}`;

export const FAQ_SECTIONS = [
  {
    category: "Theatre",
    items: [
      {
        q: "Where are you located?",
        a: "Our main summer production takes place in Pinkney Park at 177 Rowayton Avenue in Rowayton, CT. Our offices are at the Rowayton Community Center, 33 Highland Avenue.",
      },
      {
        q: "Where do I park?",
        a: "Parking for our summer production is located at Old School Field on Witch Lane, down the road from Pinkney Park. Overflow parking is available at the United Church of Rowayton. There is a municipal parking lot in Rowayton and on-street parking on Rowayton Avenue. Handicap parking is available in Pinkney Park — call (203) 957-1006 in advance to secure an accessible space.",
      },
      {
        q: "What time does the park open?",
        a: "Gates open at 4pm on show days. The box office opens at 5pm. After 5pm, you can place personal blankets and chairs.",
      },
      {
        q: "Are there bathrooms in the park?",
        a: "Yes, there are porta-potties located in the park, as well as a wheelchair-accessible bathroom.",
      },
      {
        q: "Can I bring food?",
        a: "Picnicking before the show is a time-honored SOS tradition and highly encouraged! Be prepared for an actor to steal a piece of cheese! A list of local restaurants can be found on our Visit page.",
      },
      {
        q: "Can I bring alcohol?",
        a: 'You can absolutely bring alcohol into the park, but please drink responsibly. "Good company, good wine, good welcome…"',
      },
      {
        q: "Can I bring a dog?",
        a: "No. With the exception of Seeing Eye dogs for people who are blind or visually impaired, or those who have certification the dog is needed for emotional support or another kind of disability.",
      },
      {
        q: "Is there wheelchair accessibility?",
        a: "Yes, there are spaces reserved for those with wheelchairs. Please contact us in advance so we can accommodate your full party.",
      },
      {
        q: "Do I need to bring my own chair/blanket?",
        a: "General admission tickets do not include chairs or blankets. VIP tickets include a high or low-back chair.",
      },
      {
        q: "What time should I arrive?",
        a: "It is recommended to arrive 30 minutes before the show. The park opens at 4pm on show days; the box office opens at 5pm. We encourage arriving earlier for a pre-show picnic and to choose your spot on the lawn.",
      },
      {
        q: "Can I sit anywhere?",
        a: "For our GA tickets, you are able to choose your own spot. For our VIP tickets, these seats are assigned in advance.",
      },
      {
        q: "Is there late seating?",
        a: "Late arrivals will be allowed in at the discretion of the front of house staff.",
      },
    ],
  },
  {
    category: "Performance",
    items: [
      {
        q: "What happens in the case of inclement weather?",
        a: "We will make every effort to perform the show under safe weather circumstances. If the weather is too severe to present the play, SOS will notify ticket holders by emailing them directly from our ticket platform, by posting on our social media channels (Facebook and Instagram), and the voicemail on our box office phone line. Please check any and all these methods of communication for updates.",
      },
      {
        q: "Is the play suitable for children?",
        a: "Children are welcome to all performances. There is an accessible Kids' Show at 6:30pm near the house in Pinkney Park every show evening — a 30-minute version of the MainStage play.",
      },
      {
        q: "Will I be able to understand the plays?",
        a: "We take great pride in producing Shakespeare that will be accessible for all, that is engaging and clear to everyone. A synopsis will be included in the program and on our website.",
      },
      {
        q: "Where do your actors come from?",
        a: "All of our actors are professional actors from all across the country. Our casting is done out of New York City, but we also hold local auditions. All are welcome to audition.",
      },
      {
        q: "How long is the play?",
        a: "Each show will have different runtimes, please check in closer to the summer.",
      },
    ],
  },
  {
    category: "Tickets",
    items: [
      {
        q: "How much are tickets?",
        a: "General Admission (open lawn) is $25 for adults and $5 for children 12 & under. VIP reserved seating is $75. Students and seniors (65+) may buy $15 rush tickets in person at the park box office on the day of the show only. Pay-What-You-Will nights are Tuesdays (June 16 and 23 in 2026) — suggested donation $25 adults, $5 children.",
      },
      {
        q: "How do I purchase tickets?",
        a: "Buy online at shakespeareonthesound.org/tickets, or call (203) 957-1006. During the summer run, the park box office also sells tickets in person from 5pm on show days.",
      },
      {
        q: "Do I need to purchase tickets ahead of time?",
        a: "It is encouraged, but not necessary!",
      },
      {
        q: "What are the box office hours?",
        a: "During the summer run, the in-person park box office is open from 5–7:30pm, Tuesday–Sunday. Off-season, reach us by email or at (203) 957-1006.",
      },
      {
        q: "Is there a student/senior rate?",
        a: "Yes — $15 rush for seniors 65+ and current students, sold in person only at the park box office on the day of the show.",
      },
      {
        q: "Do kids need a ticket for the Kids' Show?",
        a: "No ticket is required for the Kids' Show. It is accessible and begins at 6:30pm near the house in Pinkney Park every Main Stage evening.",
      },
      {
        q: "Can I transfer my tickets to another performance?",
        a: "Yes. Email contactus@shakespeareonthesound.org or call (203) 957-1006 and we will help move your tickets to another available performance when possible.",
      },
      {
        q: "What is your refund/exchange policy?",
        a: "All ticket sales are final, no refunds will be issued with the exception of inclement weather. If you cannot attend on the night you purchased tickets for, exchanges can be made by contacting us at (203) 957-1006 or contactus@shakespeareonthesound.org. See our Cancellation Policy for more information.",
      },
    ],
  },
  {
    category: "Education",
    items: [
      {
        q: "Do you offer any classes throughout the year?",
        a: "Absolutely, we offer workshops, tours, and other educational programming year-round. Check out our Education page for more information.",
      },
      {
        q: "Do you have summer camps?",
        a: "We do! We offer summer performance and training camps for ages 8–15.",
      },
      {
        q: "What else do you do for kids?",
        a: "There will be a kids show for kids ages 1–99 at 6:30pm every night of the show. This show is accessible — no ticket required.",
      },
    ],
  },
];

export const PRODUCTION_DETAILS = {
  "much-ado-about-nothing": {
    title: "Much Ado About Nothing",
    date: "June 10–28, 2026",
    venue: "Shakespeare in Pinkney Park, Rowayton, CT",
    season: "2026",
    director: "David Frederick Mold",
    image: WIX("2fda61_52a2b5db62ea4c22b8da935de226b8de~mv2.jpg", 450, 712),
    heroImage: WIX("2fda61_ed5498c346784fa7a58d686004f62ad1~mv2.jpg", 1970, 667),
    description:
      "Join Shakespeare on the Sound as we celebrate 30 seasons of storytelling under the stars with Much Ado About Nothing. Shakespeare's sparkling comedy transports audiences to 19th-century Sicily, where romance blooms, tempers flare, and a battle of wits becomes a battle of hearts.",
    tickets: "/productions/much-ado-about-nothing/",
    eyebrow: "Main Stage",
    intro:
      "Enjoy a brilliant ensemble bringing this merry war of words to life in one of Connecticut's most beloved outdoor settings. Come laugh, love, and experience why Shakespeare's language still dazzles.",
    sections: [
      {
        type: "prose",
        heading: "About the Show",
        paragraphs: [
          "Join Shakespeare on the Sound as we celebrate 30 seasons of storytelling under the stars with Much Ado About Nothing.",
          "Shakespeare's sparkling comedy transports audiences to 19th-century Sicily, where romance blooms, tempers flare, and a battle of wits becomes a battle of hearts.",
          "Enjoy a brilliant ensemble bringing this merry war of words to life in one of Connecticut's most beloved outdoor settings. Come laugh, love, and experience why Shakespeare's language still dazzles. It's the perfect summer night out!",
        ],
      },
      {
        type: "details",
        heading: "Tickets & Pricing",
        rows: [
          {
            label: "VIP Reserved Seating",
            value: "$75 any day of the week. Pre-sale April 7–14; general admission on sale beginning April 15.",
          },
          {
            label: "Pay What You Will",
            value: "June 16 and 23 at 7:30pm (Tuesdays). Suggested donation: $25 adults, $5 children 12 and under.",
          },
          {
            label: "General Admission",
            value: "June 10–28 at 7:30pm, Wednesdays through Sundays. $25 adults, $5 children 12 and under.",
          },
          {
            label: "Student & Senior Rush",
            value: "$15 for seniors 65+ and current students. Sold in person only at the park box office day-of.",
          },
          {
            label: "Apprentice Matinee",
            value: "June 20 at 1pm — Pay What You Will understudy run. Walk-up admission only.",
          },
        ],
      },
      {
        type: "programs",
        heading: "Special Events",
        programs: [
          {
            title: "Opening Night Pre-show Reception",
            meta: ["Saturday, June 13", "6–7:30pm", "$50 with Main Stage ticket"],
            paragraphs: [
              "Come celebrate Opening Night! Open to all. Light bites, beer, wine, and soda included.",
              "Raise a glass to 30 years! Anyone who has worked with SOS as a volunteer, board member, cast, crew, or die-hard supporter is invited to attend.",
            ],
          },
          {
            title: "SOS Book Club",
            meta: ["Thursday, June 18", "5–6pm", "$25 with Main Stage ticket", "Rain date: June 25"],
            paragraphs: [
              "Join Director of Education and Outreach Stephanie Eiss and educator and former Board President John Love for a guided discussion about the play.",
              "Interested in learning more before watching it live? Looking for a place to explore and share ideas about the play? Join us for the first ever SoS Book Club!",
            ],
          },
        ],
      },
      {
        type: "links",
        heading: "Plan Your Visit",
        links: [
          { label: "About the Show", href: "/productions/much-ado-about-nothing/" },
          { label: "Plan Your Visit", href: "/about/visit/" },
          { label: "Upcoming Events", href: "/events/" },
          { label: "Kids' Show in the Park", href: "/productions/kids-show/" },
        ],
      },
    ],
  },
  "kids-show": {
    title: "Kids' Show",
    date: "June 10–28, 2026",
    venue: "Shakespeare in Pinkney Park, Rowayton, CT",
    season: "2026",
    image: WIX("2fda61_58e853fcce884727a4deba3453b4c1ed~mv2.jpeg", 600, 400),
    heroImage: WIX("2fda61_58e853fcce884727a4deba3453b4c1ed~mv2.jpeg", 1200, 800),
    description:
      "Much Ado About Nothing for Kids — a 30-minute version for ages 1–100! A kid-friendly adaptation by our Apprentice Company that also serves as a refresher for those who need a plot reminder.",
    eyebrow: "Family Programming",
    intro:
      "6:30 pm in the park, every night before the MainStage show. Kids' Shows are accessible to all — show up, find a spot, and enjoy!",
    sections: [
      {
        type: "prose",
        heading: "About the Kids' Show",
        paragraphs: [
          "Much Ado About Nothing for Kids is a 30-minute version of our season's show for ages 1–100!",
          "A kid-friendly adaptation by our Apprentice Company that also serves as a refresher for those who need a plot reminder.",
          "Performances take place at 6:30 pm in Pinkney Park every evening before the MainStage show, June 10–28 (except Mondays).",
          "Kids' Shows are accessible — no ticket required. Show up to the park, find a spot, and enjoy.",
        ],
      },
      {
        type: "details",
        heading: "Performance Details",
        rows: [
          { label: "Show", value: "Much Ado About Nothing for Kids" },
          { label: "Dates", value: "June 10–28, 2026 (except Mondays)" },
          { label: "Time", value: "6:30 pm nightly, before the MainStage show" },
          { label: "Location", value: "Shakespeare in Pinkney Park, Rowayton, CT" },
          { label: "Admission", value: "Accessible" },
          { label: "Performed By", value: "Shakespeare on the Sound Apprentice Company" },
        ],
      },
      {
        type: "prose",
        heading: "Tour Performances",
        paragraphs: [
          "See the Education Events calendar for tour performances in May and June 2026.",
          "To book a performance at your library or school, contact Stephanie Eiss at stephanie@shakespeareonthesound.org.",
        ],
      },
      {
        type: "links",
        heading: "Related Programs",
        links: [
          { label: "In the Park Education", href: "/education/in-the-park/" },
          { label: "Summer Camps", href: "/education/summer-camps/" },
          { label: "Plan Your Visit", href: "/about/visit/" },
          { label: "Book a Tour", href: "/education/tours/" },
        ],
      },
    ],
  },
  "past-productions": {
    title: "Past Productions",
    date: "Archive",
    venue: "Norwalk & Rowayton, CT",
    season: "1996–2026",
    image: WIX("2fda61_7c217d43df9449748f30515a8625d28f~mv2.jpg", 800, 500),
    heroImage: WIX("2fda61_7c217d43df9449748f30515a8625d28f~mv2.jpg", 1200, 800),
    description:
      "Explore decades of professional outdoor Shakespeare presented by Shakespeare on the Sound across Fairfield County — from the inaugural Much Ado About Nothing in 1996 through our 30th anniversary season in 2026.",
    eyebrow: "Archive",
    intro:
      "Nearly three decades of Shakespeare under the stars in Rowayton and beyond. Each summer brings a new professional production to Pinkney Park.",
    sections: [
      {
        type: "prose",
        heading: "Our Production History",
        paragraphs: [
          "Since 1996, Shakespeare on the Sound has presented an annual open-air festival in Fairfield County, bringing great dramatic works to a broad audience and creating a forum for learning, appreciation, and celebration.",
          "From Twelfth Night and Romeo and Juliet to Hamlet, King John, and back to Much Ado About Nothing for our 30th anniversary season, each production builds on a tradition of professional theatre under the Connecticut stars.",
        ],
      },
      {
        type: "details",
        heading: "Past Productions by Year",
        rows: [
          { label: "1996", value: "Much Ado About Nothing" },
          { label: "1997", value: "Twelfth Night" },
          { label: "1998", value: "The Taming of the Shrew" },
          { label: "1999", value: "Romeo and Juliet" },
          { label: "2000", value: "A Midsummer Night's Dream" },
          { label: "2001", value: "Henry V" },
          { label: "2002", value: "As You Like It" },
          { label: "2003", value: "The Merchant of Venice" },
          { label: "2004", value: "The Winter's Tale" },
          { label: "2005", value: "The Tempest" },
          { label: "2006", value: "Macbeth" },
          { label: "2007", value: "The Comedy of Errors" },
          { label: "2008", value: "Julius Caesar" },
          { label: "2009", value: "A Midsummer Night's Dream" },
          { label: "2010", value: "Othello" },
          { label: "2011", value: "Much Ado About Nothing" },
          { label: "2012", value: "Romeo and Juliet" },
          { label: "2013", value: "As You Like It" },
          { label: "2014", value: "The Two Gentlemen of Verona" },
          { label: "2015", value: "All's Well That Ends Well" },
          { label: "2016", value: "Hamlet" },
          { label: "2017", value: "Macbeth" },
          { label: "2018", value: "A Midsummer Night's Dream" },
          { label: "2019", value: "Twelfth Night" },
          { label: "2021", value: "A Midsummer Night's Dream" },
          { label: "2022", value: "King John" },
          { label: "2023", value: "As You Like It" },
          { label: "2024", value: "Romeo and Juliet (Claire Karpen; Aaron Simms, producing)" },
          { label: "2025", value: "Macbeth" },
          { label: "2026", value: "Much Ado About Nothing" },
        ],
      },
      {
        type: "links",
        heading: "Current Season",
        links: [
          { label: "Much Ado About Nothing 2026", href: "/productions/much-ado-about-nothing/" },
          { label: "Kids' Show", href: "/productions/kids-show/" },
          { label: "Upcoming Events", href: "/events/" },
        ],
      },
    ],
  },
};

export const INNER_PAGES = [
  {
    href: "/about/mission-history/",
    title: "About Us",
    heading: "About Us.",
    eyebrow: "Our Story",
    intro:
      "Shakespeare on the Sound enriches communities through performing arts — on stage, in schools, and across Fairfield County.",
    sections: [
      {
        type: "prose",
        heading: "Mission",
        paragraphs: [
          "Shakespeare on the Sound is committed to producing affordable, professional open-air productions of the plays of William Shakespeare and related authors in Fairfield County. Working in collaboration with area civic, business and educational institutions, Shakespeare on the Sound presents an annual theatre festival, which brings great dramatic works to a broad audience, creating a forum for learning, appreciation and celebration.",
          "Our educational programming goal is to build community through the arts, giving the works of Shakespeare a vibrant life beyond the summer festival with a variety of school, library, adult education, and art programs as a means to reach a diverse cross-section of people of all ages and economic backgrounds.",
        ],
      },
      {
        type: "prose",
        heading: "Where It Began",
        paragraphs: [
          "Outdoor Shakespeare in Rowayton was the brainchild of Megan Crowley McAllister. She suggested the idea to Ezra Barnes, an actor/director who had experience founding a similar company in Westerly, R.I. They recruited six others to form a Board, and raised funds for the first production.",
          "Founders: Megan Crowley McAllister, Susan Reed Basche, Dorsey Gude, Tim Massad, Adrienne & Steven Southworth, Andrew Woolford. Founding Artistic Director: Ezra Barnes.",
        ],
      },
    ],
    secondaryCta: { label: "Explore Our History", href: "/about/history/" },
  },
  {
    href: "/about/history/",
    title: "History",
    heading: "History.",
    eyebrow: "Our Story",
    intro: "From a single summer night in Pinkney Park to a beloved Fairfield County tradition.",
    sections: [
      {
        type: "prose",
        heading: "Timeline",
        paragraphs: [
          "1995 — Outdoor Shakespeare in Rowayton was the brainchild of Megan Crowley McAllister. She suggested the idea to Ezra Barnes, an actor/director who had experience founding a similar company in Westerly, R.I. They recruited six others to form a Board, and raised funds for the first production. Founders: Megan Crowley McAllister, Susan Reed Basche, Dorsey Gude, Tim Massad, Adrienne & Steven Southworth, Andrew Woolford. Founding Artistic Director: Ezra Barnes.",
          "1996 — Rowayton's 6th Taxing District gave permission for the first production to be staged in Pinkney Park. The topography of this park, on the banks of the Five Mile River, creates a natural amphitheater. The inaugural production was Much Ado About Nothing. To the delight of all, an estimated 6,000 audience members saw this show.",
          "1997–1999 — The number of performances increased from eight to twelve. The plays were Twelfth Night (1997), The Taming of the Shrew (1998), and Romeo and Juliet (1999). Combining more performances and popular plays resulted in increased audiences. Community support and a growing audience provided financial stability.",
          "2000–2006 — In 2000, the season was extended to 16 performances. The plays were A Midsummer Night's Dream (2000), Henry V (2001), As You Like It (2002), The Merchant of Venice (2003), The Winter's Tale (2004), The Tempest (2005) and Macbeth (2006). The audiences averaged 9,000 per year. The annual gala was now an established annual fundraiser and community event. In 2006, the Board and management decided to find a second venue.",
          "2007–2008 — Greenwich agreed to test a short season in Baldwin Park, which has its waterfront on Greenwich harbor. Now there were two venues: Rowayton and Greenwich. After the Rowayton run in 2007, the added show was transferred to Greenwich where four performances played to four thousand people. In 2008, we doubled the number of Greenwich shows. Plays were The Comedy of Errors (2007) and Julius Caesar (2008).",
          "2009–2011 — With the hiring of Joanna Settle as Artistic Director, Shakespeare on the Sound underwent a year of major artistic change. The new artistic team's international credentials created a show that also increased rehearsal time and raised actors' salaries. A Midsummer Night's Dream (2009) was Joanna Settle's first production with Shakespeare on the Sound. Nearly fourteen thousand audience members attended, accounting for our largest audience ever. Our Apprentice Company launched in 2009 alongside a new play-reading series. Joanna directed Othello (2010), Much Ado About Nothing (2011) and Romeo and Juliet (2012).",
          "2012–2014 — Steven Yuhasz became Executive Director, marking a change in organizational structure. He supervised Romeo and Juliet before electing to bring in guest directors. Back in Rowayton only, As You Like It (2013), directed by Claire Shannon Kelly, was a critical success. Concurrently, Emily Bryan became Director of Education. She expanded our educational programming in lower Fairfield County schools, promoted the summer camp program, and established our crown jewel anti-bullying program, Speaking Daggers. The Apprentice Program continues to introduce young people to the theatre arts. The 2014 show was Two Gentlemen of Verona.",
          "2015 — We celebrated our 20th year with All's Well That Ends Well.",
          "2016 — Claire Shannon Kelly stepped into the shoes of Artistic Director and staged an enormously successful production of Hamlet in 2016.",
          "2017 — Our production of Macbeth was deemed spectacular, and our lauded Apprentice Company continued to present its nightly pre-show for children of all ages.",
          "2018 — Our twenty-third year was truly magical with our production of A Midsummer Night's Dream.",
          "2019 — We rounded out a quarter of a century with a captivating production of Twelfth Night and a year of successful educational programs in schools across southern CT!",
          "2020 — While our programming was cut short by the pandemic, we were able to hold a virtual reunion of our 2017 production of Macbeth, held a Short New Play Festival with new works by 5 playwrights, brought back A Christmas Carol on Zoom, and a high school Short New Play Festival in the spring.",
          "2021–2023 — Shakespeare on the Sound returned to Pinkney Park for our 25th Season with a crowd favorite, A Midsummer Night's Dream, to rave reviews. The following year we presented King John, never before seen on our stage! Summer of 2023 brings back another hit, As You Like It!",
          "2024 — Aaron Simms was hired to rebuild and lead the company. He produced a 6-person production of Romeo and Juliet directed by Claire Karpen that attracted over 4,100 to Pinkney Park. \"Shakespeare's Back!\" was the repeated refrain.",
        ],
      },
    ],
  },
  {
    href: "/about/diversity-statement/",
    title: "Diversity Statement",
    heading: "Equality & Inclusivity.",
    eyebrow: "Our Commitment",
    intro: "Theatre is for everyone and should be accessible to all.",
    sections: [
      {
        type: "prose",
        paragraphs: [
          "Shakespeare on the Sound is committed to the concept that theatre is for everyone and should be accessible to all. We believe that we are a place where Shakespeare Lives Now and need to reflect the diverse society we are a part of.",
          "We are constantly working to include and serve all members of our society and know there is so much more work to be done. We seek to include a diverse group of artists and theatre creators in our casting, hiring, and producing.",
          "We are continuing to expand our education programs to those who do not have access to theatre education. Our conversations on how to continue to serve all are ongoing and we welcome input from our community.",
        ],
      },
      {
        type: "prose",
        heading: "Local Partners",
        bullets: [
          "Showing Up for Racial Justice (SURJ) CT",
          "CTCORE-Organize Now",
          "ACLU of Connecticut",
          "RE-Center",
          "Stamford NAACP",
        ],
      },
    ],
  },
  {
    href: "/about/staff/",
    title: "Team",
    heading: "Team.",
    eyebrow: "Leadership",
    intro: "Meet the artists and administrators who bring Shakespeare to life under the stars.",
    sections: [
      {
        type: "people",
        layout: "featured",
        people: [
          {
            name: "Aaron Simms",
            role: "Executive Director",
            pronouns: "(he/him)",
            bio: "Aaron Simms is a New Yorker from Cincinnati with over thirty years of experience in regional, Off-Broadway, and Broadway theater. He is the Executive and Artistic leader of Shakespeare on the Sound. He has held management and producing positions at The York Theatre Company, Maximum Entertainment Productions, Snug Harbor Productions, Richards/Climan, Inc., Manhattan Theatre Club, Playwrights Realm, DR Theatrical Management, and ICM Partners. He is the founder and Executive Producer of Inwood Art Works in New York City. He is on the board of the Chamber of Commerce of Washington Heights and Inwood, and was the founding co-chairman of Northern Manhattan Arts and Culture. He holds a B.A. in Theater from Butler University, and an M.F.A. in Theater Management & Producing from Columbia University.",
          },
          {
            name: "Stephanie Eiss",
            role: "Director of Education and Outreach",
            pronouns: "(she/her)",
            bio: "Stephanie Eiss is an actor, Applied Theatre practitioner, teaching artist, and arts administrator who has worked in NYC and Connecticut for 15 years. She has worked with such organizations as CUNY Creative Arts Team, Elm Shakespeare, and Southern Connecticut State University facilitating arts in education programming and the creation of original theater by students from kindergarten through college. As an actor, she has worked with Target Margin Theater, AliveWire Theatrics, The Wisteria Project, and FEAST: A Performance Series. As a program manager and teaching artist, she has partnered with NYC Public Schools, NYC Department of Youth and Community Development, and The Burberry Foundation, among other organizations. She holds a B.A. in Theater from Bard College and an M.A. in Applied Theatre from CUNY School of Professional Studies.",
          },
        ],
      },
      {
        type: "people",
        heading: "Artistic Leadership History",
        layout: "history",
        people: [
          {
            name: "Claire Shannon Kelly",
            role: "Artistic Director, 2016–2023",
            bio: "From 2011–2015 Claire worked at Shakespeare on the Sound as Artistic Associate and Director of Education. For Shakespeare on the Sound's main stage she has directed Hamlet, The Two Gentlemen of Verona (which won the BroadwayWorld CT award for Best Ensemble Cast in a play), Macbeth, A Midsummer Night's Dream (2018 & 2021), Twelfth Night, King John, and As You Like It. Educationally, Claire has directed a 5-person A Midsummer Night's Dream. She co-created and directed Shakespeare on the Sound's K-5 touring production Let's Play Shakespeare!, directed their anti-bullying program Speaking Daggers, and devised and directed a children's version of All's Well That Ends Well. Currently she is in development of two new plays: The Family and Wordsmith. She has worked at the Guthrie Theater, the Shakespeare Theater of New Jersey, the Ordway Music Theater, and the George Street Playhouse among others. Claire is also a teaching artist who has taught theater to students from preschool through high school, and traveled to Livingstone, Zambia in 2017 and 2019 to teach and direct A Midsummer Night's Dream. Claire holds a Masters of Arts degree from New York University in Educational Theater.",
          },
          {
            name: "Steven Yuhasz",
            role: "Executive Director, 2013–2015",
            bio: "Steven produced Streakin' and Pterodactyl Island Off Broadway and The Visit, The Normal Heart, and The Best Little Whorehouse in Texas for The Actor's Fund of America on Broadway. He is a Founding Producer of the New York Musical Theatre Festival and has been the Associate General Manager for Papermill Playhouse, Producing Director for Capital Rep and oversaw the transition of the New Apollo Theatre in NYC to the Academy as the Creative Producer. He has directed Off Broadway Flamingo Court with Anita Gillette and Jamie Farr, and worked at numerous regional theatres around the country including Goodspeed, The Westport Playhouse, Casa Manana, Ogunquit Playhouse, The Dallas Theatre Center and The McCarter Theatre. He has appeared on Broadway in Peter Pan with Sandy Duncan, and Zorba with Anthony Quinn.",
          },
          {
            name: "Joanna Settle",
            role: "Artistic Director, 2009–2012",
            bio: "Joanna Settle directed A Midsummer Night's Dream, Othello, Much Ado About Nothing and Romeo and Juliet. Under her leadership, the company received widespread national recognition for artistic excellence. Her collaborations with artists including composers Stew and Heidi Rodewald and designer Andrew Lieberman created Shakespeare on the Sound as a home for adventurous work. She also founded the Apprentice Company in 2009, mentoring 52 developing artists who were apprenticed directly to members of the company and herself through her tenure.",
          },
          {
            name: "Ezra Barnes",
            role: "Founding Artistic Director, 1996–2008",
            bio: "Ezra Barnes, founding Artistic Director 1996–2008, both directed and performed in the company's work over the course of his successful 13 year tenure. Together with members of the community, Ezra created the tradition of Shakespeare on a summer night in Rowayton. Very quickly audiences grew in Pinkney Park to capacity, thrilling families and friends with the stories year after year. Under his leadership, and in collaboration with then managing director Mary Osborne, the company expanded to include performances in Greenwich in 2007.",
          },
        ],
      },
    ],
  },
  {
    href: "/about/board-of-directors/",
    title: "Board of Directors",
    heading: "Board of Directors.",
    eyebrow: "Governance",
    intro:
      "Our volunteer board guides Shakespeare on the Sound with local leadership, fiscal stewardship, and a long-range vision for affordable, accessible outdoor theatre in Fairfield County.",
    sections: [
      {
        type: "prose",
        heading: "Community Leadership",
        paragraphs: [
          "Shakespeare on the Sound is governed by a board of directors drawn from communities across lower Fairfield County. Officers and members oversee fundraising, education partnerships, and the summer festival at Pinkney Park — ensuring the organization stays accountable to the audiences and families we serve.",
          "The advisory board includes founders and longtime supporters whose counsel helps shape our next chapter as we celebrate 30 seasons of Shakespeare under the stars.",
        ],
      },
      {
        type: "board",
        officers: [
          { role: "President", name: "Charlotte Lyeth Burton", location: "Rowayton" },
          { role: "Vice President", name: "Michael Sagalyn", location: "Rowayton" },
          { role: "Secretary", name: "Viola Yee", location: "Redding" },
          { role: "Treasurer", name: "Peggy Parskey", location: "Norwalk" },
        ],
        members: [
          { name: "Daniel Barzach", location: "Darien" },
          { name: "Andrew Bevan", location: "New Canaan" },
          { name: "Gery Brownholz", location: "New Canaan" },
          { name: "Connor D'Amico", location: "Norwalk" },
          { name: "Russell Coleman", location: "Rowayton" },
          { name: "Kristen Ennis", location: "Rowayton" },
          { name: "Bruce Fagerstrom", location: "Darien" },
          { name: "Peter Gwynn", location: "Wilton" },
          { name: "Justin Hokin", location: "Silvermine" },
          { name: "John Hollywood", location: "Rowayton" },
          { name: "Taylor Manning", location: "Norwalk" },
          { name: "Maria Mendoza-Smith", location: "New Canaan" },
          { name: "Rob Russo", location: "Southport" },
        ],
        advisory: [
          { name: "Megan & Keith McAllister", note: "Founder", location: "Norwalk" },
          { name: "Andy & Melissa Woolford", note: "Founder", location: "South Norwalk" },
          { name: "Tim Pettee", location: "Rowayton" },
          { name: "Heather Anderson", location: "Greenwich" },
          { name: "Lelia Shields", location: "Westport" },
          { name: "Marie Reynolds", location: "Rowayton" },
          { name: "Sussan & Paul Tierney", location: "Darien" },
          { name: "William Wilson" },
          { name: "Patrick & Sarah Wayland" },
        ],
      },
    ],
    cta: { label: "Apply to the Board", action: "board-apply" },
    secondaryCta: { label: "Support Our Mission", href: "/support/donate/" },
  },
  {
    href: "/about/contact/",
    title: "Contact Us",
    heading: "Contact Us.",
    eyebrow: "Get In Touch",
    intro: "We're here to help with tickets, visits, education programs, and support.",
    sections: [
      {
        type: "spotlight",
        image: "/images/backgrounds/outdoor-audience.jpg",
        alt: "Audience gathered for Shakespeare in Pinkney Park",
        eyebrow: "Pinkney Park",
        title: "Reach the people who bring the season to life",
        paragraphs: [
          "General questions go to our shared inbox. Education bookings go straight to Stephanie. During the summer run, the park box office is staffed on show nights.",
        ],
      },
      {
        type: "details",
        rows: [
          { label: "General Inquiries", value: "contactus@shakespeareonthesound.org" },
          {
            label: "Aaron Simms, Executive Director",
            value: "aaron@shakespeareonthesound.org",
          },
          {
            label: "Stephanie Eiss, Director of Education and Outreach",
            value: "stephanie@shakespeareonthesound.org",
          },
          { label: "Mailing Address", value: "P.O. Box 15, Norwalk, CT 06853" },
          { label: "Main Phone", value: "(203) 957-1006" },
        ],
      },
      {
        type: "spotlight",
        flip: true,
        image: "/images/team/stephanie-eiss.jpg",
        alt: "Stephanie Eiss, Director of Education and Outreach",
        eyebrow: "Education",
        title: "Stephanie Eiss",
        paragraphs: [
          "Questions about workshops, tours, camps, or the Apprentice Company? Email Stephanie directly — she leads Education and Outreach for Shakespeare on the Sound.",
        ],
        cta: { label: "Email Stephanie", href: "mailto:stephanie@shakespeareonthesound.org" },
      },
      {
        type: "prose",
        paragraphs: [
          "Shakespeare on the Sound is a proud member of the Shakespeare Theatre Association.",
        ],
      },
    ],
    cta: { label: "Plan Your Visit", href: "/about/visit/" },
  },
  {
    href: "/about/employment/",
    title: "Employment",
    heading: "Employment.",
    eyebrow: "Join Our Team",
    intro: "Interested in joining Shakespeare on the Sound? Check back for openings, or volunteer with us.",
    sections: [
      {
        type: "prose",
        paragraphs: [
          "We do not have open paid positions at this time. Summer 2026 park roles are filled. When new opportunities are posted, apply by emailing Executive Director Aaron Simms at aaron@shakespeareonthesound.org with your cover letter and resume.",
          "Volunteer in the park and receive complimentary admission! Help out at the box office, with seating, or the merch/ice cream tent — email contactus@shakespeareonthesound.org to sign up.",
        ],
      },
      {
        type: "links",
        heading: "Also Explore",
        links: [
          { label: "Apprentice Application", href: "/education/apprentice-application/" },
          { label: "Volunteer Sign Up", href: "mailto:contactus@shakespeareonthesound.org" },
        ],
      },
    ],
  },
  {
    href: "/about/faq/",
    title: "FAQ",
    heading: "FAQ.",
    eyebrow: "Plan Your Visit",
    intro: "Answers to common questions about tickets, parking, and performances at Pinkney Park.",
    faq: true,
  },
  {
    href: "/about/visit/",
    title: "Visit",
    heading: "Plan Your Visit.",
    eyebrow: "Shakespeare in Pinkney Park",
    intro:
      "There's no better way to spend a summer evening than watching professional Shakespeare in this picturesque waterfront setting on the banks of the Five Mile River in Rowayton, CT.",
    sections: [
      {
        type: "figure",
        image: "/images/backgrounds/outdoor-audience.jpg",
        alt: "Audience at Shakespeare in Pinkney Park",
        caption: "Gates open early — picnic, settle in, and watch the light change over the river.",
        ratio: "wide",
      },
      {
        type: "prose",
        heading: "Before You Arrive",
        paragraphs: [
          "Whether this is your first time with Shakespeare on the Sound or your twenty-sixth, this guide will help you make the most of your evening.",
          "Need to get in touch? Call (203) 957-1006 or email contactus@shakespeareonthesound.org.",
        ],
      },
      {
        type: "map",
        heading: "Find us",
        title: "Pinkney Park",
        address: "177 Rowayton Avenue, Rowayton, CT 06853",
        embedQuery: "Pinkney Park 177 Rowayton Avenue Rowayton CT 06853",
        directionsUrl:
          "https://www.google.com/maps/dir/?api=1&destination=177%20Rowayton%20Avenue%2C%20Rowayton%2C%20CT%2006853",
      },
      {
        type: "parking",
        heading: "Best parking",
        note: "Arrive early on popular nights — the closest lot fills first. Accessible spaces in the park by advance request.",
        places: [
          {
            rank: "Best",
            name: "Old School Field",
            address: "Witch Lane & Rowayton Avenue, Rowayton, CT",
            detail: "Closest lot to Pinkney Park. Space is limited — arrive early.",
            mapsUrl:
              "https://www.google.com/maps/dir/?api=1&destination=Old%20School%20Field%20Witch%20Lane%20Rowayton%20CT",
          },
          {
            rank: "Overflow",
            name: "United Church of Rowayton",
            address: "210 Rowayton Avenue, Rowayton, CT 06853",
            detail: "Overflow parking when Old School Field is full.",
            mapsUrl:
              "https://www.google.com/maps/dir/?api=1&destination=210%20Rowayton%20Avenue%2C%20Rowayton%2C%20CT%2006853",
          },
          {
            rank: "Also",
            name: "Municipal lot & on-street",
            address: "Rowayton Avenue, Rowayton, CT",
            detail: "Municipal parking in Rowayton plus on-street spots along Rowayton Avenue.",
            mapsUrl:
              "https://www.google.com/maps/search/?api=1&query=municipal%20parking%20Rowayton%20Avenue%20Rowayton%20CT",
          },
          {
            rank: "Accessible",
            name: "Pinkney Park accessible parking",
            address: "177 Rowayton Avenue, Rowayton, CT 06853",
            detail: "Limited accessible spaces in the park. Call (203) 957-1006 ahead to reserve.",
            phone: "+12039571006",
            mapsUrl:
              "https://www.google.com/maps/dir/?api=1&destination=177%20Rowayton%20Avenue%2C%20Rowayton%2C%20CT%2006853",
          },
        ],
      },
      {
        type: "spotlight",
        image: "/images/backgrounds/much-ado-cast.jpg",
        alt: "Cast preparing for an outdoor performance",
        eyebrow: "Park traditions",
        title: "Picnic under the trees",
        paragraphs: [
          "Bring food and drink — picnicking before the show is a time-honored SOS tradition. Kindly take everything you brought out with you at the end of the night.",
        ],
      },
      {
        type: "prose",
        heading: "Picnicking",
        paragraphs: [
          "Picnicking before the show is a time-honored SOS tradition and highly encouraged! You are more than welcome to bring food and drink to enjoy before and during the show.",
          "Be prepared for an actor to steal a piece of cheese! Kindly bring whatever you brought into the park out with you at the end of the night.",
          "Arden's in Rowayton offers picnic baskets specially for SOS productions. See our local restaurant partners on the Shop & Dine page for more options.",
        ],
      },
      {
        type: "prose",
        heading: "Alcohol",
        paragraphs: [
          'You can absolutely bring alcohol into the park, but please drink responsibly. "Good company, good wine, good welcome…"',
        ],
      },
      {
        type: "prose",
        heading: "Accessibility",
        paragraphs: [
          "Yes, there are spaces reserved for those with wheelchairs. Please contact us in advance so we can accommodate your full party.",
          "There is handicap parking available in Pinkney Park. Call (203) 957-1006 to secure an accessible parking space.",
          "There are porta-potties located in the park, as well as a wheelchair-accessible bathroom.",
        ],
      },
      {
        type: "details",
        heading: "Much Ado About Nothing — season complete (June 10–28, 2026)",
        rows: [
          {
            label: "Pay What You Will",
            value: "Tuesdays June 16 and 23 at 7:30pm. Suggested donation: $25 adults, $5 children 12 and under.",
          },
          {
            label: "General Admission",
            value: "Wednesdays through Sundays at 7:30pm. $25 adults, $5 children 12 and under.",
          },
          {
            label: "Student & Senior Rush",
            value: "$15 for seniors 65+ and current students — in person at the park box office day-of only.",
          },
          { label: "Reserved Seating", value: "$75 any day of the week." },
          { label: "Park Opens", value: "4pm. Box office and blanket placement from 5pm. Curtain at 7:30pm." },
        ],
      },
      {
        type: "prose",
        heading: "At the Show",
        bullets: [
          "General admission tickets do not include a seat — bring your own blanket or low-back chair.",
          "VIP reserved seats are assigned upon arrival.",
          "Pictures and videos of the production are prohibited.",
          "All devices must be silenced or turned off before the show begins at 7:30pm.",
        ],
      },
    ],
    cta: { label: "Getting Here", href: "/about/getting-here/" },
    secondaryCta: { label: "Upcoming Events", href: "/events/" },
  },
  {
    href: "/about/getting-here/",
    title: "Getting Here",
    heading: "Getting Here.",
    eyebrow: "Plan Your Visit",
    intro: "Pinkney Park is located at 177 Rowayton Avenue in Rowayton, CT.",
    sections: [
      {
        type: "figure",
        image: "/images/backgrounds/outdoor-audience.jpg",
        alt: "Pinkney Park on a performance evening",
        caption: "177 Rowayton Avenue — on the banks of the Five Mile River.",
        ratio: "landscape",
      },
      {
        type: "map",
        heading: "Find us",
        title: "Pinkney Park",
        address: "177 Rowayton Avenue, Rowayton, CT 06853",
        embedQuery: "Pinkney Park 177 Rowayton Avenue Rowayton CT 06853",
        directionsUrl:
          "https://www.google.com/maps/dir/?api=1&destination=177%20Rowayton%20Avenue%2C%20Rowayton%2C%20CT%2006853",
      },
      {
        type: "parking",
        heading: "Best parking",
        note: "Arrive early on popular nights — the closest lot fills first. Accessible spaces in the park by advance request.",
        places: [
          {
            rank: "Best",
            name: "Old School Field",
            address: "Witch Lane & Rowayton Avenue, Rowayton, CT",
            detail: "Closest lot to Pinkney Park. Space is limited — arrive early.",
            mapsUrl:
              "https://www.google.com/maps/dir/?api=1&destination=Old%20School%20Field%20Witch%20Lane%20Rowayton%20CT",
          },
          {
            rank: "Overflow",
            name: "United Church of Rowayton",
            address: "210 Rowayton Avenue, Rowayton, CT 06853",
            detail: "Overflow parking when Old School Field is full.",
            mapsUrl:
              "https://www.google.com/maps/dir/?api=1&destination=210%20Rowayton%20Avenue%2C%20Rowayton%2C%20CT%2006853",
          },
          {
            rank: "Also",
            name: "Municipal lot & on-street",
            address: "Rowayton Avenue, Rowayton, CT",
            detail: "Municipal parking in Rowayton plus on-street spots along Rowayton Avenue.",
            mapsUrl:
              "https://www.google.com/maps/search/?api=1&query=municipal%20parking%20Rowayton%20Avenue%20Rowayton%20CT",
          },
          {
            rank: "Accessible",
            name: "Pinkney Park accessible parking",
            address: "177 Rowayton Avenue, Rowayton, CT 06853",
            detail: "Limited accessible spaces in the park. Call (203) 957-1006 ahead to reserve.",
            phone: "+12039571006",
            mapsUrl:
              "https://www.google.com/maps/dir/?api=1&destination=177%20Rowayton%20Avenue%2C%20Rowayton%2C%20CT%2006853",
          },
        ],
      },
      {
        type: "prose",
        heading: "Arrival",
        paragraphs: [
          "The park is open to Shakespeare on the Sound audience members starting three hours before showtime, at 4pm.",
          "When you enter the park, please make your way to the Box Office located near the entrance of the park.",
        ],
      },
      {
        type: "prose",
        heading: "By Train",
        paragraphs: [
          "The Rowayton Train Station is located about a half mile from the park. An Uber or Lyft can easily drop you off right at the entrance.",
        ],
      },
    ],
    secondaryCta: { label: "Back to Visit", href: "/about/visit/" },
  },
  {
    href: "/about/cancellation-policy/",
    title: "Cancellation Policy",
    heading: "Cancellation Policy.",
    eyebrow: "Ticket Information",
    intro: "All sales are final. Weather-related updates and exchanges are handled as outlined below.",
    sections: [
      {
        type: "prose",
        paragraphs: [
          "All sales are final.",
          "In the event of a weather cancellation, we will try to move your tickets to another night or a refund will be given.",
          "To find out if a show is cancelled, please take a look at our homepage for up-to-date announcements, call (203) 957-1006, or check any of our social media platforms.",
          "In the case of expected thunder, lightning, extreme rain, flooding, or high winds for the time of the performance, we may cancel up to two hours before the start of the show.",
          "We do not cancel shows if we expect the weather to clear by show time — for example, if rain is scheduled to stop by mid-afternoon.",
          "We consult weather.com and Weather Underground (www.wunderground.com) throughout the day to make a judgment.",
          "It is our desire to complete every performance once we start. However, in the event of inclement weather, we may delay the start of the show (or even hold in the middle!) in the hope that the weather will clear. Announcements will be made to inform audience members of holds. We may also pause to take precautions to ensure the safety and health of the performers and crew. The show will usually restart after a brief hold for weather, and this is not considered a cancellation.",
          "Weather-related ticket refunds or exchanges will only be processed for officially cancelled performances at the request of the ticket holder. Refunds will not be granted if the performance is cancelled after the show has begun.",
          "If you have tickets to a cancelled performance, please call (203) 957-1006 or email us at contactus@shakespeareonthesound.org to reschedule your performance.",
        ],
      },
    ],
  },
  {
    href: "/about/privacy/",
    title: "Privacy Policy",
    heading: "Privacy Policy.",
    eyebrow: "Your Information",
    intro: "How Shakespeare on the Sound handles information when you visit our site, buy tickets, or contact us.",
    showNewsletter: false,
    sections: [
      {
        type: "prose",
        paragraphs: [
          "We collect only the information needed to process ticket and shop orders, respond to inquiries, and send confirmations you request (such as order emails or My Tickets sign-in links).",
          "Payment card data is processed by Square and is not stored on our web servers. Order details (name, email, performance date, ticket codes) are stored securely to fulfill your purchase and support box-office operations.",
          "We do not sell your personal information. We may share data with service providers who help us operate ticketing, email delivery, or payment processing, under confidentiality obligations.",
          "You may contact us at contactus@shakespeareonthesound.org to ask about your order history, request correction of contact information, or ask questions about this policy.",
        ],
      },
    ],
  },
  {
    href: "/education/in-schools/",
    title: "In Schools",
    heading: "In Schools.",
    eyebrow: "Education & Community",
    intro:
      "Shakespeare on the Sound's educational programs teach Shakespeare in a manner which dispels the fear and mysticism associated with Shakespeare; we nurture a comfort with, and ownership of, his language.",
    sections: [
      {
        type: "figure",
        image: "/images/learning/kids-classroom.jpeg",
        alt: "Students in a Shakespeare on the Sound classroom workshop",
        caption: "Teaching artists bring Shakespeare to life in Fairfield County classrooms.",
        ratio: "landscape",
      },
      {
        type: "prose",
        paragraphs: [
          "Our workshops are fun, interactive, and inspiring. Utilizing a variety of theater activities, group ensemble work, and performance techniques, our professional teaching artists guide students in bringing Shakespeare's texts to life while challenging them to think outside the box and delve into the deeper meaning of the plays.",
          "Choose from one of our established programs or SOS teaching artists will work in partnership with you to create a workshop that is specifically tailored to meet your educational goals.",
        ],
      },
      {
        type: "spotlight",
        image: "/images/learning/trippingly-on-the-tongue.jpg",
        alt: "Students exploring Shakespeare through games and ensemble work",
        eyebrow: "In the classroom",
        title: "Language students can own",
        paragraphs: [
          "From Kindergarten through AP English, our workshops replace intimidation with play — games, ensemble work, and performance that make the text feel like theirs.",
        ],
      },
      {
        type: "programs",
        heading: "Workshops",
        programs: [
          {
            title: "Trippingly on the Tongue",
            meta: ["Grades K–12", "45–90 minutes", "Max 25 attendees (50 with black box)", "$700 for up to 4 workshops in one day"],
            paragraphs: [
              "Two teaching artists will work with your students to bring Shakespeare's language to life. Using games and other theatre exercises, we will help students explore the content, language, and relationships of the play. We will also guide students through discovering how these themes, characters, and situations are relatable to their everyday life.",
              "Available for any of Shakespeare's plays. We can also devise something specific for a non-Shakespeare play.",
            ],
          },
          {
            title: "All the World's a Stage",
            meta: ["Grades 7–12", "45–90 minutes", "Max 25 attendees (50 with black box)", "$1,200 for up to 4 workshops in one day"],
            paragraphs: [
              "Two actors perform excerpts from the play to see Shakespeare live on its feet. Two teaching artists will then guide the students through the play to explore the language, meaning, and help the students to think critically about the themes of the play.",
              "Available for any of Shakespeare's plays. We can also devise something specific for a non-Shakespeare play.",
            ],
          },
          {
            title: "Page to Stage: Hamlet",
            meta: ["Grades 9–12", "60 minutes", "Unlimited attendees", "$400"],
            paragraphs: [
              "Page to Stage is a 45-minute AP English enrichment presentation followed by a 15-minute Q&A session.",
              "Utilize text from the Q1, Q2 and F versions of Hamlet to examine the publishing process during Shakespeare's time, how that process influenced what is universally accepted today as the work of William Shakespeare, and the ongoing role of the modern editor.",
            ],
          },
        ],
      },
      {
        type: "figure",
        image: "/images/backgrounds/education-workshop.jpg",
        alt: "Teaching artists leading an education workshop",
        caption: "Teacher workshops and corporate sessions use the same interactive approach.",
        ratio: "wide",
      },
      {
        type: "programs",
        heading: "Teacher's Workshop for Educators of All Grades",
        programs: [
          {
            title: "Teacher's Workshop",
            meta: ["Educators of all grades", "Contact Stephanie for pricing"],
            paragraphs: [
              "This is an organized workshop for teachers hoping to utilize more theater and Shakespeare in their classrooms. Our approach is to support teachers in forming an interactive classroom in which control is given to the students.",
              "In this workshop, one of our teaching artists instructs teachers on simple educational theater pedagogy, incorporating techniques from theater of the oppressed, Forum Theater, Image Theater, and Teacher-in-Role. Meanwhile, the Director of Education helps teachers effectively organize both Shakespearean and English lesson plans, and also points to some rewarding, thought-provoking moments that may arise out of a required text.",
              "Our teaching artists and scholars are readily available to help you write curriculum and lesson plans, making your classes as fun and interactive as possible.",
            ],
          },
        ],
      },
      {
        type: "programs",
        heading: "Shakespeare for Success",
        programs: [
          {
            title: "Shakespeare for Success",
            meta: ["Corporate organizations", "Contact Stephanie for pricing"],
            paragraphs: [
              "This is an organized workshop for corporate organizations who are looking to provide their staff and/or clients with a different approach to collaboration and communication.",
              "Our approach is to support the organization by creating engaging conversations through improv and theatre games. Not only are they fun and challenging but will spark interesting conversations in and around the workplace.",
            ],
          },
        ],
      },
      {
        type: "prose",
        paragraphs: [
          "For information on pricing, booking and more, contact Stephanie Eiss, Director of Education and Outreach at stephanie@shakespeareonthesound.org.",
        ],
      },
    ],
    cta: { label: "Contact Education", href: "mailto:stephanie@shakespeareonthesound.org" },
  },
  {
    href: "/education/tours/",
    title: "Tours",
    heading: "Tours.",
    eyebrow: "Education & Community",
    intro: "Shakespeare on the Sound tours schools throughout Fairfield County every spring.",
    sections: [
      {
        type: "figure",
        image: "/images/learning/tours.jpg",
        alt: "Shakespeare on the Sound touring performance for students",
        caption: "Spring tours bring a full performance — and a talk-back — into schools and libraries.",
        ratio: "landscape",
      },
      {
        type: "programs",
        programs: [
          {
            title: "R+J4evr",
            meta: ["Grades 6–12", "45 minutes + 15-minute talk-back"],
            paragraphs: [
              "A 45-minute interactive play, followed by a 15-minute talk-back, that examines the relationship between Romeo and Juliet in a whole new way.",
              "The play is appropriate for students in grades 6–12.",
            ],
          },
          {
            title: "Much Ado About Nothing for Kids",
            meta: ["Grades K–5", "30 minutes", "Tours late May and early June"],
            paragraphs: [
              "A 30-minute interactive version of our season's show appropriate for students in grades K–5.",
              "This original play tours in late May and early June.",
            ],
          },
        ],
      },
      {
        type: "prose",
        paragraphs: [
          "For questions or to book a performance, contact Stephanie Eiss, Director of Education and Outreach at stephanie@shakespeareonthesound.org.",
        ],
      },
    ],
  },
  {
    href: "/education/summer-camps/",
    title: "Summer Camps",
    heading: "Summer Camps.",
    eyebrow: "Education & Community",
    intro: "We offer summer camps for children ages 8–15.",
    sections: [
      {
        type: "spotlight",
        image: "/images/backgrounds/kids-performance.jpg",
        alt: "Young performers in a Shakespeare on the Sound summer camp",
        eyebrow: "Ages 8–15",
        title: "Process first — then the sharing",
        paragraphs: [
          "Camps focus on collaboration and ensemble creation. The experience of making the work matters as much as the final sharing for family and friends.",
        ],
      },
      {
        type: "prose",
        paragraphs: [
          "Our mission is to teach Shakespeare in a manner which dispels the fear and mysticism associated with Shakespeare; we nurture a comfort with, and ownership of, his language. Our work with the campers is process based with a focus on collaboration, ensemble work, and a shared responsibility in the creation of the production. The process, the experience in creating, is most important.",
          "We believe Shakespeare is for everyone regardless of age, race, gender, and socio-economic background. Our programs illuminate Shakespeare's relevance in our lives today. Our camps seek to encourage imaginative play, creative expression, collaborative input, and ignite the imagination.",
        ],
      },
      {
        type: "figure",
        image: "/images/learning/summer-camps.jpg",
        alt: "Summer camp students rehearsing outdoors",
        caption: "Days filled with games, rehearsal, and ensemble play.",
        ratio: "landscape",
      },
      {
        type: "programs",
        heading: "2026 Summer Camps",
        programs: [
          {
            title: "The Globe Company",
            meta: ["June 16–27, 2026", "Ages 8–15", "Rowayton Community Center", "Tuition: $1,100"],
            paragraphs: [
              "June 16–20: 11am–3pm. June 23–27: 11am–3pm. Performance: June 28 at 1:30pm.",
              "The Globe Company will present Scenes from Macbeth and is designed for 8 to 15-year-olds who are both serious about acting and new to it.",
              "Campers will learn about performing Shakespeare's text, and work as an ensemble as they discover character, and develop their very own play. Members of the Globe Company will work with one of SOS's teaching artists and directors to choose scenes and monologues from Macbeth. Everyone will get a chance to participate and be an active member of the ensemble.",
              "No Shakespeare experience necessary for any of our camps!",
            ],
          },
          {
            title: "The Globe Company Moves to Ridgefield",
            meta: ["August 4–8, 2026", "Ages 10–15", "Ridgefield Academy", "Tuition: $600"],
            paragraphs: [
              "August 4–8: 11am–3pm.",
              "A Week of Shakespeare — The Globe Company presents scenes from Shakespeare! Join us in this dynamic program designed for students ages 10 to 15, whether they are new to acting or passionate performers.",
              "Campers will explore Shakespeare's text, develop their acting skills, and collaborate as an ensemble to bring characters to life. Through this creative process, they will build confidence, deepen their understanding of classical theater, and work together to craft their very own performance.",
              "Registration: https://www.ridgefieldacademy.org/program/ra-summer-programs/explorer-programs",
            ],
          },
        ],
      },
    ],
    cta: { label: "Contact Stephanie", href: "mailto:stephanie@shakespeareonthesound.org" },
  },
  {
    href: "/education/apprentice-application/",
    title: "Apprentice Application",
    heading: "Apprentice Company.",
    eyebrow: "Education & Community",
    intro:
      "Thinking of applying for the Apprentice Company? Here is the information you will find helpful. Opportunities exist in acting, directing, playwriting, education, costuming, and production — and we are open to specific tracks proposed by applicants, subject to approval.",
    sections: [
      {
        type: "figure",
        image: "/images/learning/professional-training.jpg",
        alt: "Apprentice company artists in training",
        caption: "Apprentices work side-by-side with the professional company — onstage, backstage, and in the park.",
        ratio: "wide",
      },
      {
        type: "prose",
        heading: "Requirements",
        paragraphs: [
          "Applicants must be over 18 and have completed at least one year of college or have extensive theater experience in the desired discipline. Unfortunately we can no longer accommodate high school students in any artistic disciplines. High school students interested in theater administration can apply through their high school internship program.",
          "Successful candidates will be self-motivated, dedicated, inquisitive, collaborative, enthusiastic, and capable of working in a fast-paced, challenging, multi-faceted environment.",
        ],
      },
      {
        type: "prose",
        heading: "Program Details",
        paragraphs: [
          "May 4 – June 29, 2026 (possible extension to July 5). The position is unpaid. A travel stipend of $1,000 for the duration of the apprenticeship will be provided. Housing is not available. Applicants must be available to start Monday, May 4, 2026.",
          "Apprentices function as an integral part of Shakespeare on the Sound and work directly with the professional artists creating the mainstage production. Shakespeare on the Sound is committed to equity, diversity, inclusion, and accessibility. We strongly encourage all interested artists to apply.",
          "All apprentices collaborate to produce a 30-minute version of Much Ado About Nothing performed at local libraries and schools, as well as prior to each Main Stage performance in Rowayton, CT.",
          "Apprentices also support the technical, backstage, and artistic teams on the mainstage production. Acting apprentices serve as understudies and participate in an Understudy Run during the residency in the park.",
          "Members of the Apprentice Company receive multi-disciplinary master classes taught by professional theater makers, academics, and artists — in person in Connecticut and New York City, or over Zoom if necessary.",
        ],
      },
      {
        type: "spotlight",
        flip: true,
        image: "/images/backgrounds/performance-spotlight.jpg",
        alt: "Performance under the lights at Pinkney Park",
        eyebrow: "2026 season",
        title: "Under the stars — and understudy ready",
        paragraphs: [
          "Acting apprentices understudy the mainstage company. Every apprentice supports tech, load-in, and the kids' show that opens each evening in the park.",
        ],
      },
      {
        type: "programs",
        heading: "Apprenticeships Offered",
        programs: [
          {
            title: "Acting — SOS Players",
            meta: ["Minimum 6 actors", "Start May 4, 2026"],
            paragraphs: [
              "We look for a minimum of six actors for the company. The SOS Players collaborate with the playwriting and directing apprentices to devise a 30-minute version of Much Ado About Nothing appropriate for a young audience, performed nightly for families in the park.",
              "Acting apprentices observe specific mainstage rehearsals, participate in an Understudy Run of the mainstage production, and attend all master classes. Applicants must be strong actors who are creative, collaborative, and fond of ensemble work.",
            ],
          },
          {
            title: "Directing",
            meta: ["Start May 4, 2026", "Meet with director prior to May 1"],
            paragraphs: [
              "First, the directing apprentice collaborates with the education director and the acting and playwriting apprentices to devise Much Ado About Nothing for kids — a 30-minute version for young audiences performed nightly prior to the mainstage show.",
              "Second, the directing apprentice assists the director on Much Ado About Nothing. Applicants should be highly collaborative, with a working knowledge of Shakespeare and the ability to work with a wide range of personalities; self-motivated, hard-working, able to multitask, and reliable. Availability to meet with the Main Stage director prior to May 1 (in person or via Zoom) is required.",
            ],
          },
          {
            title: "Education",
            meta: ["Start May 4, 2026"],
            paragraphs: [
              "Responsibilities include creating Much Ado About Nothing study guides; creating, implementing, and running activities at the First Folio Kids Corner during the run; and planning curriculum for Shakespeare on the Sound summer camps.",
              "The education apprentice also serves as a Teaching Artist for spring workshops in Fairfield County schools. Applicants should be self-motivated, independent, creative, and flexible thinkers who feel confident teaching Shakespeare to children. Familiarity with Augusto Boal is a plus. An SOS Player apprentice may double as an education apprentice.",
            ],
          },
          {
            title: "Playwriting",
            meta: ["Start May 4, 2026"],
            paragraphs: [
              "The playwriting apprentice writes the script for a 30-minute version of Much Ado About Nothing for young audiences, devised in collaboration with the directing and acting apprentices.",
              "The language mixes colloquial English and Shakespeare's text. The play is performed nightly prior to the mainstage production and at schools and libraries in Fairfield County during May and June.",
            ],
          },
          {
            title: "Costuming",
            meta: ["Start May 4, 2026"],
            paragraphs: [
              "The costume apprentice works directly with the costume designer and wardrobe supervisor: pulling costumes, assisting fittings and alterations, supporting wardrobe during the run, and laundering costumes nightly.",
              "Additionally, the costume apprentice designs costumes for Much Ado About Nothing for kids — working with the director on a design and providing sketches. Sewing skills and the ability to work with a wide range of personalities are essential. Due to budget restraints, costume designs may not be fully realized, but efforts are made to create a portion of the design.",
            ],
          },
          {
            title: "Production",
            meta: ["Start May 4, 2026"],
            paragraphs: [
              "First, the production apprentice stage-manages the development and tour of Much Ado About Nothing for kids.",
              "Second, the production apprentice assists the TD and ATD during load-in week and works with the technical crew preparing the park for tech. Exact duties depend on the apprentice's technical skills and interest.",
              "Third, beginning tech through the run, the production apprentice assists the stage management team and producer. Applicants with a strong interest in props, lighting, sound, or set design can focus on that area during tech week. Candidates should be self-motivated, collaborative, eager to learn, professional, responsible, and able to work efficiently in a fast-paced environment.",
            ],
          },
        ],
      },
      {
        type: "prose",
        heading: "All Apprentices",
        paragraphs: [
          "All apprentices are expected to actively participate in every master class. During load-in and tech, every apprentice is assigned jobs that continue throughout the run of the show.",
        ],
      },
      {
        type: "prose",
        heading: "Application Deadline",
        paragraphs: [
          "All candidates — Sunday, March 8, 2026.",
          "To apply: complete the form below and email the appropriate track-specific supplemental materials to stephanie@shakespeareonthesound.org.",
        ],
      },
      {
        type: "prose",
        heading: "Application Process",
        paragraphs: [
          "Once we have received your completed application, we will contact you to schedule your interview. Interviews are conducted in person or via Zoom and last approximately 30–45 minutes.",
        ],
      },
      {
        type: "prose",
        heading: "What All Applicants Provide",
        paragraphs: [
          "Contact information for two references — one professional/educational and one personal (entered on the form below).",
          "A professional resume detailing educational and professional work experience in your chosen field. The resume helps us understand what you have been up to and who you are at this point in your life. We do not want you to feel pressure to craft a resume based on what you think we are looking for. We review each application individually and seek a diverse group of candidates with varying levels of experience.",
          "A written personal statement answering: What drew you to theater? Who are you as an artist, and where are you in your artistic journey? What interests you in apprenticing at Shakespeare on the Sound, and what do you hope to gain from the apprenticeship? Your personal statement is the most important part of the application.",
        ],
      },
      {
        type: "programs",
        heading: "Additional Materials — by Apprenticeship",
        programs: [
          {
            title: "Acting (SOS Players)",
            paragraphs: [
              "Successful candidates should prepare two monologues (one contemporary and one Shakespeare). Each monologue should be approximately one to two minutes in length.",
              "In addition to your monologues, please prepare 16 bars of your favorite song to be sung a cappella or accompanied by yourself on a musical instrument.",
              "Please note: Refrain from using monologues from Much Ado About Nothing or the sonnets as audition pieces.",
            ],
          },
          {
            title: "Education",
            paragraphs: [
              "Imagine you are teaching Much Ado About Nothing to children 11–14 years of age in a summer camp setting. Write a lesson plan that explores the theme of DECEPTION.",
              "Your lesson plan should reflect a 1.5-hour time period and include: introduction to the topic, warm-ups, games, a scaffolded approach to the main activity rooted in a scene from the play, and wrap-up. Please provide a detailed timeline for your 1.5-hour class.",
            ],
          },
          {
            title: "Directing",
            paragraphs: [
              "Choose one of the Shakespeare plays listed below and write a treatment detailing your concept for directing the play.",
              "Your treatment should include: your approach to the play in general; theme(s) you plan to explore; concept for the production; set, costume, and lighting design; sound/music, if any; casting (based on the assumption that your production has the budget for 5 Equity contracts, 5 non-Equity contracts, and two apprentices).",
              "Your treatment should be no longer than 2 pages in length.",
            ],
          },
          {
            title: "Playwriting",
            paragraphs: [
              "Submit two contrasting samples of your work as a playwright (one-acts are acceptable) that you have written within the last two years.",
              "Choose one of the Shakespeare plays listed below and write a 5-minute version of Act 1 (approximately 5 pages) that would be appropriate for an audience of children ages 5–12. Your Act 1 should be a mixture of colloquial English and Shakespeare's text from the play. Additionally, you should include one instance of audience interaction. You may set your Act 1 in a frame. You have a cast of 6 actors. Even if you chose a tragedy you may use humor to tell your story.",
              "Keep in mind that children are smart; please do not “dumb down” your version of Act 1.",
            ],
          },
          {
            title: "Costuming",
            paragraphs: [
              "Choose one of the Shakespeare plays listed below and submit a treatment detailing your concept of the costumes. Your treatment should include: your design concept; how and why your design supports the play; and time period.",
              "Additionally, please pick one of the main characters in the play and design his/her costumes throughout the play. Provide sketches as well as a detailed design concept for each sketch.",
            ],
          },
        ],
      },
      {
        type: "prose",
        heading: "Play Choices for Directing, Playwriting & Costuming Candidates",
        bullets: [
          "As You Like It",
          "Twelfth Night",
          "The Tempest",
          "Macbeth",
          "Hamlet",
          "Othello",
        ],
      },
      {
        type: "apprentice-form",
        heading: "Apprentice Application",
        paragraphs: [
          "Complete the form below. Email track-specific supplemental materials to stephanie@shakespeareonthesound.org. Questions should be directed to Stephanie Eiss, Director of Education.",
        ],
      },
    ],
    cta: { label: "Apply Now", href: "#apply" },
    secondaryCta: { label: "Email Stephanie", href: "mailto:stephanie@shakespeareonthesound.org" },
  },
  {
    href: "/education/adult-enrichment/",
    title: "Adult Enrichment",
    heading: "Adult Enrichment.",
    eyebrow: "Education & Community",
    intro: "Programs for lifelong learners and theatre lovers.",
    sections: [
      {
        type: "figure",
        image: "/images/news/education-banner.jpg",
        alt: "Adult learners discussing Shakespeare",
        caption: "Page to Stage and enrichment evenings for curious adults.",
        ratio: "landscape",
      },
      {
        type: "programs",
        programs: [
          {
            title: "Page to Stage: Hamlet",
            meta: ["60 minutes", "Unlimited attendees", "Email Stephanie for pricing"],
            paragraphs: [
              "Page to Stage is a 45-minute adult enrichment presentation followed by a 15-minute Q&A session.",
              "Utilize text from the Q1, Q2 and F versions of Hamlet to examine the publishing process during Shakespeare's time, how that process influenced what is universally accepted today as the work of William Shakespeare, and the ongoing role of the modern editor.",
              "A presentational lecture style of information interwoven with monologues designed to support the topic of lecture.",
            ],
          },
        ],
      },
    ],
    cta: { label: "Contact Stephanie", href: "mailto:stephanie@shakespeareonthesound.org" },
  },
  {
    href: "/education/in-the-park/",
    title: "In the Park",
    heading: "In the Park.",
    eyebrow: "Education & Community",
    intro: "Educational programming in Pinkney Park before every MainStage performance.",
    sections: [
      {
        type: "figure",
        image: "/images/learning/in-the-park.jpg",
        alt: "Education tent and kids activities in Pinkney Park",
        caption: "Visit the education tent and catch Shakespeare in 30 Minutes before the evening show.",
        ratio: "landscape",
      },
      {
        type: "spotlight",
        flip: true,
        image: "/images/backgrounds/park-audience-nyt.jpg",
        alt: "Families gathered in Pinkney Park before a performance",
        eyebrow: "Show nights",
        title: "First Folio Kids Corner",
        paragraphs: [
          "Hands-on activities for young patrons, plus a 30-minute version of the season play performed before each mainstage curtain.",
        ],
        cta: { label: "Plan Your Visit", href: "/about/visit/" },
      },
      {
        type: "programs",
        heading: "Kids' Show",
        programs: [
          {
            title: "Much Ado About Nothing for Kids",
            meta: ["June 10–28, except Mondays", "6:30pm", "Shakespeare in Pinkney Park", "Accessible"],
            paragraphs: [
              "A 30-minute version of Much Ado About Nothing for ages 1–100!",
              "A kid-friendly adaptation by our Apprentice Company that also serves as a refresher for those who need a plot reminder. Show up to the park, find a spot, and enjoy!",
            ],
          },
        ],
      },
      {
        type: "programs",
        heading: "Shakespeare on the Sound Book Club",
        programs: [
          {
            title: "SOS Book Club",
            meta: ["Thursday, June 18", "5:00pm", "Shakespeare in Pinkney Park", "$25 with MainStage ticket", "Rain date: June 25"],
            paragraphs: [
              "Interested in learning more about Much Ado About Nothing before watching it live? Looking for a place to explore and share ideas about the play? Want to meet other Shakespeare fans and scholars? Join us for the first ever SoS Book Club!",
              "Join Director of Education and Outreach Stephanie Eiss and educator and former Board President John Love for a guided discussion about the play.",
            ],
          },
        ],
      },
      {
        type: "prose",
        heading: "First Folio Tent",
        paragraphs: [
          "A kids educational tent will be open prior to the mainstage show each night with loads of fun theatre-related activities!",
          "The education apprentice creates, implements and runs activities at the First Folio Kids Corner during the run of the production.",
        ],
      },
      {
        type: "links",
        heading: "Related",
        links: [
          { label: "Plan Your Visit", href: "/about/visit/" },
          { label: "Kids' Show Production Page", href: "/productions/kids-show/" },
          { label: "Summer Camps", href: "/education/summer-camps/" },
        ],
      },
    ],
    cta: { label: "Plan Your Visit", href: "/about/visit/" },
  },
  {
    href: "/education/events/",
    title: "Education Events",
    heading: "Education Events.",
    eyebrow: "Education & Community",
    intro: "Workshops, touring shows, summer camps, and community programs throughout the year.",
    sections: [
      {
        type: "prose",
        heading: "Education Mission",
        paragraphs: [
          "Education is at the cornerstone of Shakespeare on the Sound. Shakespeare on the Sound's educational programs teach Shakespeare in a manner which dispels the fear and mysticism associated with Shakespeare; we nurture a comfort with, and ownership of, his language.",
          "We believe Shakespeare is for everyone regardless of age, race, gender, and socio-economic background. Our programs illuminate Shakespeare's relevance in our lives today.",
          "Shakespeare on the Sound offers educational programming in schools, at libraries, in the park, and in our community.",
        ],
      },
      {
        type: "links",
        heading: "Explore Our Programs",
        links: [
          { label: "In Schools Workshops", href: "/education/in-schools/" },
          { label: "Spring Tours", href: "/education/tours/" },
          { label: "Summer Camps", href: "/education/summer-camps/" },
          { label: "Apprentice Application", href: "/education/apprentice-application/" },
          { label: "Adult Enrichment", href: "/education/adult-enrichment/" },
          { label: "In the Park", href: "/education/in-the-park/" },
        ],
      },
      {
        type: "details",
        heading: "Program Highlights",
        rows: [
          { label: "In Schools", value: "Workshops on Romeo & Juliet, Twelfth Night, A Midsummer Night's Dream, Macbeth, Hamlet, Othello, and more." },
          { label: "Tours", value: "R+J4evr (grades 6+) and Much Ado About Nothing for Kids (grades K–5)." },
          { label: "Summer Camps", value: "The Globe Company for ages 8–15." },
          { label: "Professional Training", value: "2026 Apprentice Company — acting, directing, playwriting, education, costuming, production." },
          { label: "In the Park", value: "Kids' Show at 6:30pm, Book Club, and First Folio Tent nightly." },
        ],
      },
      {
        type: "prose",
        paragraphs: [
          "Reach out with any questions to Stephanie Eiss, Director of Education and Outreach at stephanie@shakespeareonthesound.org.",
        ],
      },
    ],
    cta: { label: "Explore In Schools", href: "/education/in-schools/" },
  },
  {
    href: "/support/donate/",
    title: "Donate",
    heading: "Support Our Mission.",
    eyebrow: "Join & Give",
    showSupport: false,
    intro: "Give online with Square — one-time or monthly — plus stocks, DAFs, and other gift options.",
    sections: [],
  },
  {
    href: "/support/individual-giving/",
    title: "Individual Giving",
    heading: "Individual Giving.",
    eyebrow: "Join & Give",
    showSupport: false,
    intro: "Join the community of supporters who make Shakespeare on the Sound possible.",
    sections: [
      {
        type: "prose",
        paragraphs: [
          "Your charitable contributions help defray the cost of our 16 summer performances in Pinkney Park, Rowayton, as well as our year-round education program.",
          "Our ticket prices do not cover the total expense of our summer productions. Each year we must raise at least $115,000 from supporters like you to maintain our low ticket prices.",
          "Please help us to continue our mission of providing affordable, professional Shakespeare productions to our community. Your tax-deductible gift of any amount will be most appreciated.",
          "Prefer to give stock, recommend a donor-advised fund grant, or explore other gift types? See Ways to Give on our Donate page, or contact Executive Director Aaron Simms at aaron@shakespeareonthesound.org.",
          "If you prefer to donate via check, mail your tax-deductible contribution to Shakespeare on the Sound, Inc., P.O. Box 15, Norwalk, CT 06853.",
          "Shakespeare on the Sound is a tax-exempt 501(c)(3) non-profit corporation. Tax ID: 06-1437037. All donations are fully tax deductible provided that no goods or services were provided in exchange for the donation.",
        ],
      },
      {
        type: "tiers",
        heading: "Leadership Giving",
        tiers: [
          {
            title: "The Leadership Circle ($20,000+)",
            benefits: [
              "All of the benefits listed below plus a total of 10 reserved house seats during the run of the show with 10 boxed dinners",
            ],
          },
          {
            title: "Lord Chamberlain's Circle ($10,000+)",
            benefits: [
              "Invitation to the final rehearsal at The Roundabout Theatre, NYC",
              "Total of 8 reserved house seats during run of the show with 8 boxed dinners",
              "Acknowledgement from the stage before one opening night performance",
              "Prominent listing in the 8,000 show programs and SOS website",
              "Invitation to the opening night cast party",
              "Backstage tour prior to show of your choice",
              "Signed poster by cast",
            ],
          },
          {
            title: "Angels ($5,000–$9,999)",
            benefits: [
              "Acknowledgement from the stage before the opening night performance",
              "Total of 6 reserved house seats during run of the show with wine",
              "Prominent listing in the 8,000 show programs and SOS website",
              "Invitation to the opening night cast party",
              "Backstage tour prior to show of your choice",
              "Signed poster by cast",
            ],
          },
          {
            title: "Patrons of the Bard ($2,500–$4,999)",
            benefits: [
              "Total of 4 reserved house seats during run of the show",
              "Recognized at the Poet's Circle level in the 8,000 show programs and SOS website",
              "Invitation to the opening night cast party",
              "Backstage tour prior to show of your choice",
            ],
          },
          {
            title: "Poet's Circle ($1,000–$2,499)",
            benefits: [
              "Total of 2 reserved house seats during run of the show",
              "Recognized at the Poet's Circle level in the 8,000 show programs and SOS website",
            ],
          },
          {
            title: "Director's Circle ($500–$999)",
            benefits: ["Recognized at the Director's Circle level in the 8,000 show programs and SOS website"],
          },
          {
            title: "Friends ($250–$499)",
            benefits: ["Recognized at the Friends level in the 8,000 show programs and SOS website"],
          },
        ],
      },
    ],
    cta: { label: "Donate Now", href: "/support/donate/" },
    secondaryCta: { label: "Ways to give", href: "/support/donate/#other-ways" },
  },
  {
    href: "/support/program-ads-sponsorships/",
    title: "Program Ads & Sponsorships",
    heading: "Program Ads & Sponsorships.",
    eyebrow: "Join & Give",
    showSupport: false,
    intro: "Get your business noticed and support Shakespeare on the Sound.",
    sections: [],
    cta: { label: "Contact Marketing", href: "mailto:marketing@shakespeareonthesound.org" },
  },
  {
    href: "/support/events/",
    title: "Events",
    heading: "Events.",
    eyebrow: "Join & Give",
    showSupport: false,
    intro: "Main stage tickets, fundraisers, and special events.",
    sections: [],
  },
  {
    href: "/support/donors/",
    title: "Donors",
    heading: "Thank You.",
    eyebrow: "Join & Give",
    showSupport: false,
    intro: "We gratefully acknowledge the generous supporters who make our work possible.",
    sections: [
      {
        type: "prose",
        paragraphs: [
          "A huge thank you to all of our donors from our past fiscal year! Your generosity helps us reach over 10,000 people per year through our public performances and educational outreach efforts and made it possible for us to continue our mission of presenting affordable, professional outdoor productions of the plays of William Shakespeare in Fairfield County.",
        ],
      },
      {
        type: "groups",
        heading: "Donor Recognition",
        groups: [
          {
            label: "Leadership Circle ($20,000+)",
            items: ["Charlotte Lyeth Burton", "S&L Marx Foundation"],
          },
          {
            label: "Lord Chamberlain's Circle ($10,000–$19,999)",
            items: ["Robinson & Cole LLC", "Sixth Taxing District"],
          },
          {
            label: "Angels ($5,000–$9,999)",
            items: [
              "Heather and Jason Anderson",
              "Daniel Barzach and Avery Hourihan",
              "Russell Coleman and Kristin Ennis",
              "DR Bank",
              "Excelerate Foundation",
              "Dave Hokin Foundation",
              "John Hollywood",
              "Alice Jacks",
              "Palmer's Market",
              "Tim and Sheila Pettee",
              "Russo & Rizio",
              "Andrew and Melissa Woolford",
            ],
          },
          {
            label: "Patrons of the Bard ($2,500–$4,999)",
            items: [
              "Fairfield County Bank",
              "Megan and Keith McAllister",
              "Alyse Pashman",
              "Pure Insurance",
              "Rowayton Civic Association",
              "Michael Sagalyn",
            ],
          },
          {
            label: "Poet's Circle ($1,000–$2,499)",
            items: [
              "Emily Bryan",
              "Dupre Cochran",
              "CT Supporting Arts",
              "John and Christine Love",
              "Brooke Megrue",
              "Maria Mendoza-Smith",
              "Pitney Bowes Foundation",
              "Marie Reynolds and Jim Golden",
              "RSR LLC",
              "Betsy Sue and Martin Shannon",
              "James and Margie Shaughnessy",
              "Leila & Nick Shields",
              "John and Nancy Sommi",
              "Tierney Family Foundation",
              "Town of Darien",
              "Patrick and Sarah Wayland",
            ],
          },
          {
            label: "Director's Circle ($500–$999)",
            items: [
              "Timothy and Laura Callaghan",
              "Ryan and Christina Casupanan",
              "CT Office of the Arts",
              "CT Tech Education",
              "Defeo Family Foundation",
              "Autumn and John Howard",
              "Robert Kettenmann",
              "Deborah Lyeth Master",
              "Evelyn and Steven Millman",
              "Sarah O'Neill",
              "Michael Sagalyn",
              "Kerry and Jed Stevens Family Trust",
            ],
          },
          {
            label: "Friends ($250–$499)",
            items: [
              "Diane and Perry Caminis",
              "Pamela Clark",
              "Connor D'Amico",
              "B Eydt Robert",
              "Susan Hardesty",
              "Ron Holland",
              "Robert Kettenman",
              "Tammy Langalis",
              "Mettler Family",
              "Frank and Catherine Nash",
              "Stephen and Laura Petricone",
              "Michelle Riley",
              "C Robertson",
              "Jennifer and Andrew Ryan",
              "UCBC Cafe",
              "Terry Wettergreen",
              "Stephanie Zeigler",
            ],
          },
        ],
      },
    ],
    cta: { label: "Support Our Mission", href: "/support/donate/" },
  },
];

export function hrefToRoutePath(href) {
  return href.replace(/^\//, "").replace(/\/$/, "");
}
