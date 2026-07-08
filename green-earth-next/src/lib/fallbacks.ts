import { Project, BlogPost, TeamMember, GalleryItem } from '@/types';

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Sundarbans Coastal Mangrove Reforestation",
    title_bn: "সুন্দরবন উপকূলীয় ম্যানগ্রোভ বনায়ন",
    slug: "sundarbans-mangrove-reforestation",
    category: "tree_plantation",
    location: "Satkhira, Sundarbans Region",
    location_bn: "সাতক্ষীরা, সুন্দরবন অঞ্চল",
    status: "ongoing",
    description: "The Sundarbans, the world's largest mangrove forest, acts as Bangladesh's natural shield against devastating cyclones. However, deforestation and rising salinity have degraded this barrier. Our Mangrove Reforestation initiative engages Satkhira's local coastal communities—particularly women and traditional honey collectors (Mawalis)—to nursery-grow and plant native Keora, Gewa, and Sundari saplings. This project not only helps store massive amounts of carbon but also revives the natural habitats of endangered local wildlife while offering sustainable livelihood opportunities for local guardians.",
    description_bn: "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবন বাংলাদেশের জন্য ভয়াবহ ঘূর্ণিঝড়ের বিরুদ্ধে প্রাকৃতিক ঢাল হিসেবে কাজ করে। তবে বন উজাড় ও ক্রমবর্ধমান লবণাক্ততা এই প্রাকৃতিক ঢালটিকে ক্ষতিগ্রস্ত করেছে। আমাদের ম্যানগ্রোভ বনায়ন উদ্যোগ সাতক্ষীরার স্থানীয় উপকূলীয় জনগোষ্ঠীকে—বিশেষ করে নারী এবং ঐতিহ্যবাহী মৌয়ালদের—দেশীয় কেওড়া, গেওয়া এবং সুন্দরী চারা নার্সারিতে তৈরি ও রোপণে যুক্ত করে। এই প্রকল্পটি কেবল কার্বন জমা করতেই সাহায্য করছে না, বরং স্থানীয় বন্যপ্রাণীর প্রাকৃতিক আবাসস্থল পুনরুদ্ধার করছে এবং স্থানীয় অভিভাবকদের জন্য টেকসই জীবিকার সুযোগ সৃষ্টি করছে।",
    impact_summary: "25,000+ Saplings Planted & Monitored",
    impact_summary_bn: "২৫,০০০+ চারা রোপণ ও পর্যবেক্ষণ করা হয়েছে",
    cover_image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8c5d8?w=800&auto=format&fit=crop&q=80"
    ],
    created_at: new Date().toISOString()
  },
  {
    id: "proj-2",
    title: "Solar Electrification for Off-Grid Schools",
    title_bn: "অফ-গ্রিড বিদ্যালয়ে সৌর বিদ্যুতায়ন",
    slug: "solar-electrification-char-schools",
    category: "renewable_energy",
    location: "Kurigram Char Lands",
    location_bn: "কুড়িগ্রামের চর অঞ্চল",
    status: "completed",
    description: "In northern Bangladesh's river island churs, electricity grids are non-existent, leaving classrooms dark and shutting students out of modern learning tools. Green Earth has successfully engineered and installed custom solar micro-grids on 15 schools. Each school is now equipped with bright, energy-efficient LED lights, wall fans, and low-power smart tablets. The project has doubled daily school attendance, reduced heat stress during hot summer months, and allowed schools to host community-led night literacy classes for adults, brightening whole village futures.",
    description_bn: "বাংলাদেশের উত্তরাঞ্চলের চরাঞ্চলগুলোতে কোনো বিদ্যুৎ গ্রিড নেই, যার ফলে ক্লাসরুমগুলো অন্ধকারে থাকত এবং শিক্ষার্থীরা আধুনিক শিক্ষার সুযোগ থেকে বঞ্চিত হতো। গ্রিন আর্থ সফলভাবে ১৫টি বিদ্যালয়ে কাস্টম সৌর মাইক্রো-গ্রিড স্থাপন করেছে। প্রতিটি বিদ্যালয় এখন উজ্জ্বল এলইডি লাইট, দেয়াল ফ্যান এবং স্বল্প-শক্তির স্মার্ট ট্যাবলেটে সজ্জিত। এই প্রকল্পটি দৈনিক শিক্ষার্থীদের উপস্থিতি দ্বিগুণ করেছে, গ্রীষ্মকালে গরমের কষ্ট কমিয়েছে এবং বিদ্যালয়গুলোতে বয়স্কদের জন্য রাতে সাক্ষরতা ক্লাস আয়োজনের সুযোগ করে দিয়েছে, যা পুরো গ্রামের ভবিষ্যৎ উজ্জ্বল করছে।",
    impact_summary: "15 Primary Schools Fully Powered",
    impact_summary_bn: "১৫টি প্রাথমিক বিদ্যালয় সম্পূর্ণ সৌরশক্তিতে চালিত",
    cover_image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80"
    ],
    created_at: new Date().toISOString()
  },
  {
    id: "proj-3",
    title: "Safe Drinking Water Solutions & Arsenic Mitigation",
    title_bn: "নিরাপদ খাবার পানি ও আর্সেনিকমুক্তকরণ প্রকল্প",
    slug: "safe-water-arsenic-mitigation",
    category: "water_sanitation",
    location: "Chandpur District",
    location_bn: "চাঁদপুর জেলা",
    status: "ongoing",
    description: "Arsenic toxicity in groundwater remains one of Bangladesh's most silent yet deadliest ecological crises. Chandpur has experienced high levels of contaminated water, causing chronic skin diseases and organ failures. Green Earth is working tirelessly to deploy deep-aquifer tube wells (drilled past 300 meters to reach arsenic-free pure water layers) and gravity-fed filtration columns. Alongside, we build rainwater harvesting structures for household rain catchments. Every installation is community-managed, with transparent water testing records posted publicly to guarantee continuous safety.",
    description_bn: "ভূগর্ভস্থ পানিতে আর্সেনিকের বিষাক্ততা বাংলাদেশের সবচেয়ে নীরব অথচ মারাত্মক পরিবেশগত সংকটগুলোর একটি। চাঁদপুর জেলায় আর্সেনিক দূষণের মাত্রা অত্যন্ত বেশি, যার কারণে চর্মরোগ এবং অঙ্গহানি ঘটে। গ্রিন আর্থ গভীর নলকূপ (আর্সেনিকমুক্ত বিশুদ্ধ পানি পেতে ৩০০ মিটারের বেশি গভীর) এবং গ্র্যাভিটি ফিল্টার স্থাপন করতে নিরলসভাবে কাজ করছে। পাশাপাশি আমরা বাসাবাড়ির জন্য বৃষ্টির পানি সংগ্রহের কাঠামো তৈরি করছি। প্রতিটি ইনস্টলেশন স্থানীয়দের দ্বারা পরিচালিত হয় এবং পানির গুণগত মানের রেকর্ড জনসমক্ষে প্রকাশ করা হয়।",
    impact_summary: "8,000+ Residents Served Pure Safe Water",
    impact_summary_bn: "৮,০০০+ অধিবাসীকে বিশুদ্ধ নিরাপদ পানি সরবরাহ",
    cover_image_url: "https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=800&auto=format&fit=crop&q=80",
    gallery_image_urls: [
      "https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=800&auto=format&fit=crop&q=80"
    ],
    created_at: new Date().toISOString()
  }
];

export const FALLBACK_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Mangroves: Our Strongest Natural Shield Against Cyclones",
    title_bn: "ম্যানগ্রোভ: ঘূর্ণিঝড়ের বিরুদ্ধে আমাদের সবচেয়ে শক্তিশালী প্রাকৃতিক ঢাল",
    slug: "mangroves-strongest-natural-shield",
    category: "Ecology",
    category_bn: "পরিবেশবিদ্যা",
    excerpt: "Analyzing how the root structures of coastal mangrove trees protect the shoreline from devastating floods, saving thousands of lives and homes in Bangladesh.",
    excerpt_bn: "ম্যানগ্রোভ গাছের জটিল মূল কাঠামো কীভাবে উপকূলরেখাকে জলোচ্ছ্বাস থেকে রক্ষা করে এবং বাংলাদেশে হাজার হাজার জীবন বাঁচায় তা বিশ্লেষণ।",
    content: "Bangladesh is on the frontlines of global climate change. Every year, powerful tropical storms brew in the Bay of Bengal and roll onto our vulnerable coastlines. But there lies a natural, highly efficient engineering solution at the mouth of the delta—the Sundarbans Mangrove forest. The intricate, interlocking root structures of mangrove trees like Sundari and Keora function as solid energy dissipators. They absorb the massive physical energy of incoming tidal waves, reducing wind velocities and mitigating high surge depths. Our reforestation projects in Satkhira and Dacope are actively restoring these shields. Working side-by-side with local residents, we are not just planting trees—we are building live coastal walls.",
    content_bn: "বাংলাদেশ বৈশ্বিক জলবায়ু পরিবর্তনের অগ্রভাগে রয়েছে। প্রতি বছর বঙ্গোপসাগরে শক্তিশালী ক্রান্তীয় ঝড় তৈরি হয় এবং আমাদের উপকূলীয় অঞ্চলে আঘাত হানে। কিন্তু এই বদ্বীপে রয়েছে সুন্দরবনের ম্যানগ্রোভ বনের মতো একটি প্রাকৃতিক ও অত্যন্ত কার্যকর ইঞ্জিনিয়ারিং সমাধান। সুন্দরী ও কেওড়া গাছের জটিল মূল কাঠামো জলোচ্ছ্বাসের গতি কমিয়ে দেয় এবং তরঙ্গের উচ্চতা হ্রাস করে। সাতক্ষীরা ও দাকোপে আমাদের বনায়ন প্রকল্পগুলো এই প্রাকৃতিক ঢালগুলোকে পুনরুদ্ধার করছে। স্থানীয়দের সাথে কাঁধে কাঁধ মিলিয়ে আমরা কেবল গাছ রোপণ করছি না—আমরা জীবন্ত প্রাচীর তৈরি করছি।",
    cover_image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    published_at: "2026-06-18T00:00:00.000Z",
    created_at: "2026-06-18T00:00:00.000Z"
  },
  {
    id: "blog-2",
    title: "How Char Islands are Embracing Clean Solar Micro-Grids",
    title_bn: "চরাঞ্চল যেভাবে সৌর মাইক্রো-গ্রিড গ্রহণ করছে",
    slug: "char-islands-solar-microgrids",
    category: "Energy",
    category_bn: "জ্বালানি",
    excerpt: "A deep look into how off-grid solar electricity is transforming education, health, and night literacy in Kurigram's isolated river islands.",
    excerpt_bn: "কুড়িগ্রামের বিচ্ছিন্ন চরাঞ্চলগুলোতে অফ-গ্রিড সৌর বিদ্যুৎ কীভাবে শিক্ষা, স্বাস্থ্য এবং নৈশ শিক্ষা পরিবর্তন করছে তার গভীর বিশ্লেষণ।",
    content: "Char islands are dynamically shifting masses of sand in the middle of Bangladesh's giant rivers. Constantly eroding and re-forming, they are physically cut off from the main electricity grid. Until recently, when night fell, education stopped completely. Families burned costly and hazardous kerosene lamps for light, inhaling toxic smoke. Green Earth's solar initiative replaced this with clean, stable solar microgrids. In 15 primary schools, bright LED lightbulbs now hang under tin roofs, and smart tablets are charged cleanly. Adult night literacy groups are flourishing, and critical vaccine cooling fridges run without interruption. Clean energy isn't just lighting bulbs; it's lifting communities out of darkness.",
    content_bn: "চরাঞ্চলগুলো বাংলাদেশের বিশাল নদীগুলোর মধ্যে বালির গতিশীল দ্বীপ। এগুলো সর্বদা নদীভাঙন ও পুনর্গঠনের মধ্য দিয়ে যায় এবং গ্রিডের বিদ্যুৎ থেকে বিচ্ছিন্ন। কিছুদিন আগেও রাত নামলেই শিক্ষা পুরোপুরি বন্ধ হয়ে যেত। পরিবারগুলো কেরোসিনের বাতি জ্বালাত, যা বিষাক্ত ধোঁয়ার সৃষ্টি করত। গ্রিন আর্থের সৌর উদ্যোগ এটিকে পরিচ্ছন্ন, স্থিতিশীল সোলার মাইক্রো-গ্রিডে রূপান্তর করেছে। ১৫টি প্রাথমিক বিদ্যালয়ের টিনের চালের নিচে এখন জ্বলছে এলইডি বাল্ব এবং স্মার্ট ট্যাবলেট চার্জ করা হচ্ছে। বয়স্কদের নৈশ সাক্ষরতা ক্লাস চালু হয়েছে এবং প্রতিষেধক সংরক্ষণের ফ্রিজ চলছে কোনো বাধা ছাড়াই। পরিচ্ছন্ন জ্বালানি কেবল বাতি জ্বালাচ্ছে না; এটি পুরো সমাজকে অন্ধকার থেকে আলোয় আনছে।",
    cover_image_url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80",
    published_at: "2026-05-04T00:00:00.000Z",
    created_at: "2026-05-04T00:00:00.000Z"
  },
  {
    id: "blog-3",
    title: "Simple Household Guide to Reduce Plastic Waste in Dhaka",
    title_bn: "ঢাকা শহরে প্লাস্টিক বর্জ্য হ্রাসের সহজ গৃহস্থালি নির্দেশিকা",
    slug: "household-guide-reduce-plastic-dhaka",
    category: "Waste Management",
    category_bn: "বর্জ্য ব্যবস্থাপনা",
    excerpt: "Practical and actionable steps to reduce single-use plastic, manage home recycling, and keep Bangladesh's streets and canals clean.",
    excerpt_bn: "একবার ব্যবহারযোগ্য প্লাস্টিক হ্রাস, বাসাবাড়ির রিসাইক্লিং ব্যবস্থাপনা এবং ঢাকা শহরের রাস্তা ও খাল পরিষ্কার রাখার ব্যবহারিক পদক্ষেপ।",
    content: "Dhaka produces over 600 metric tons of plastic waste every single day, much of which clogs our vital storm drainage systems and ends up in the Buriganga river, poisoning water and fish. While systemic solutions are critical, behavioral shifts at home make a profound difference. First, separate wet food scraps from dry plastics. Clean and bag dry plastics separately so informal recycling collectors (Tokais) can easily gather them safely. Second, swap single-use grocery bags for reusable organic jute bags—Bengal's golden fiber is the ultimate eco-friendly alternative! Small daily actions create massive cumulative wave of positive environmental change across the capital.",
    content_bn: "ঢাকা শহরে প্রতিদিন ৬০০ মেট্রিক টনেরও বেশি প্লাস্টিক বর্জ্য তৈরি হয়, যার বেশিরভাগই আমাদের নিষ্কাশন ড্রেন আটকে দেয় এবং বুড়িগঙ্গা নদীতে পড়ে পানি ও মাছকে বিষাক্ত করে। যদিও পদ্ধতিগত সমাধান জরুরি, বাসাবাড়িতে আচরণের পরিবর্তন অনেক বড় ভূমিকা রাখে। প্রথমত, ভেজা খাবারের অংশ শুকনো প্লাস্টিক থেকে আলাদা করুন। শুকনো প্লাস্টিকগুলো পরিষ্কার করে আলাদা ব্যাগে রাখুন যাতে রিসাইকেল করা সহজ হয়। দ্বিতীয়ত, প্লাস্টিকের ব্যাগের বদলে পাটের ব্যাগ ব্যবহার করুন—বাংলার সোনালী আঁশই সেরা পরিবেশবান্ধব বিকল্প! ছোট ছোট দৈনন্দিন পদক্ষেপ রাজধানীর পরিবেশে বিশাল ইতিবাচক পরিবর্তন আনতে পারে।",
    cover_image_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
    published_at: "2026-04-22T00:00:00.000Z",
    created_at: "2026-04-22T00:00:00.000Z"
  }
];

export const FALLBACK_TEAM: TeamMember[] = [
  {
    id: "team-1",
    name: "Dr. Anisur Rahman",
    name_bn: "ড. আনিসুর রহমান",
    role: "Founder & Executive Director",
    role_bn: "প্রতিষ্ঠাতা ও নির্বাহী পরিচালক",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    bio: "Ph.D. in Environmental Science from Dhaka University. Deeply passionate about coastal mangrove restoration, ecosystem survival, and sustainable community climate resilience across Bangladesh.",
    bio_bn: "ঢাকা বিশ্ববিদ্যালয় থেকে পরিবেশ বিজ্ঞানে পিএইচডি। উপকূলীয় ম্যানগ্রোভ পুনরুদ্ধার এবং বাংলাদেশে টেকসই জলবায়ু কার্যক্রম সম্পর্কে অত্যন্ত উত্সাহী।",
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: "team-2",
    name: "Sumaiya Chowdhury",
    name_bn: "সুরাইয়া চৌধুরী",
    role: "Lead Climate Engineer & Hydrologist",
    role_bn: "প্রধান জলবায়ু প্রকৌশলী ও জলবিদ",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    bio: "Specialist in groundwater mapping, solar irrigation, and pumping grids. Keeps remote filtration units and water tube wells clean and running.",
    bio_bn: "ভূগর্ভস্থ পানি ম্যাপিং এবং সৌর পাম্পিং গ্রিডের বিশেষজ্ঞ। প্রত্যন্ত অঞ্চলের ফিল্টার এবং নলকূপ সচল রাখতে কাজ করেন।",
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: "team-3",
    name: "Faisal Ahmed Tanvir",
    name_bn: "ফয়সাল আহমেদ তানভীর",
    role: "Director of Community Engagement",
    role_bn: "স্থানীয় অংশীদারিত্ব বিষয়ক পরিচালক",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    bio: "An activist working on grassroots environmental campaigns. Unites schools, village elders, and youth student groups for green action drives.",
    bio_bn: "তৃণমূল অভিযানের একজন কর্মী। পরিবেশবান্ধব কার্যক্রমের জন্য বিদ্যালয়, গ্রামের মুরুব্বি ও ছাত্রদলকে একত্রিত করেন।",
    display_order: 3,
    created_at: new Date().toISOString()
  }
];

export const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Coastal Mangrove Plantation Satkhira",
    title_bn: "উপকূলীয় ম্যানগ্রোভ রোপণ, সাতক্ষীরা",
    event_name: "Mangrove Drive 2025",
    event_name_bn: "ম্যানগ্রোভ অভিযান ২০২৫",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    media_type: "image",
    created_at: new Date().toISOString()
  },
  {
    id: "gal-2",
    title: "Solar Panel System on Char Primary School",
    title_bn: "চরাঞ্চল প্রাথমিক বিদ্যালয়ে সৌরবিদ্যুৎ সিস্টেম",
    event_name: "Off-Grid School Electrification",
    event_name_bn: "অফ-গ্রিড বিদ্যালয় বিদ্যুৎ প্রকল্প",
    image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80",
    media_type: "image",
    created_at: new Date().toISOString()
  },
  {
    id: "gal-3",
    title: "Deep Tube Well Installation",
    title_bn: "গভীর নলকূপ স্থাপন কার্যক্রম",
    event_name: "Pure Water Chandpur",
    event_name_bn: "চাঁদপুর বিশুদ্ধ পানি প্ল্যান্ট",
    image_url: "https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=800&auto=format&fit=crop&q=80",
    media_type: "image",
    created_at: new Date().toISOString()
  },
  {
    id: "gal-4",
    title: "Youth Environment Training Workshop",
    title_bn: "তরুণ পরিবেশ সচেতনতা কর্মশালা",
    event_name: "Green Leadership Training",
    event_name_bn: "সবুজ নেতৃত্ব কর্মশালা",
    image_url: "https://images.unsplash.com/photo-1544531516-a5e857b2a590?w=800&auto=format&fit=crop&q=80",
    media_type: "image",
    created_at: new Date().toISOString()
  }
];

export const FALLBACK_STATS = {
  planted_saplings: '25,000+',
  schools_powered: '15',
  clean_water_users: '8,000+',
  active_volunteers: '1,200+'
};
