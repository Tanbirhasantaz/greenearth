import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

// Define the root folder for data files
const DATA_DIR = path.join(process.cwd(), "data");

// Helper to ensure data files are initialized
function initializeDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // File paths
  const filePaths = {
    projects: path.join(DATA_DIR, "projects.json"),
    blogs: path.join(DATA_DIR, "blogs.json"),
    team: path.join(DATA_DIR, "team.json"),
    gallery: path.join(DATA_DIR, "gallery.json"),
    volunteers: path.join(DATA_DIR, "volunteers.json"),
    donations: path.join(DATA_DIR, "donations.json"),
    subscribers: path.join(DATA_DIR, "subscribers.json"),
    contacts: path.join(DATA_DIR, "contacts.json"),
    settings: path.join(DATA_DIR, "settings.json"),
    testimonials: path.join(DATA_DIR, "testimonials.json"),
    milestones: path.join(DATA_DIR, "milestones.json"),
    corevalues: path.join(DATA_DIR, "corevalues.json"),
    focusareas: path.join(DATA_DIR, "focusareas.json"),
    ge_gh_participants: path.join(DATA_DIR, "ge_gh_participants.json"),
    ge_gh_trees: path.join(DATA_DIR, "ge_gh_trees.json"),
    ge_gh_logs: path.join(DATA_DIR, "ge_gh_logs.json"),
    ge_gh_overview: path.join(DATA_DIR, "ge_gh_overview.json")
  };

  // 1. Initial Projects
  if (!fs.existsSync(filePaths.projects)) {
    const initialProjects = [
      {
        id: "proj-1",
        title: "Sundarbans Coastal Mangrove Reforestation",
        titleBn: "সুন্দরবন উপকূলীয় ম্যানগ্রোভ বনায়ন",
        category: "plantation",
        categoryLabel: "Tree Plantation",
        categoryLabelBn: "বৃক্ষরোপণ",
        location: "Satkhira, Sundarbans Region",
        locationBn: "সাতক্ষীরা, সুন্দরবন অঞ্চল",
        status: "ongoing",
        statusLabel: "Ongoing",
        statusLabelBn: "চলমান",
        shortDescription: "Restoring vulnerable coastal areas of the Sundarbans by planting native mangrove species to combat tidal surges, erosion, and climate change.",
        shortDescriptionBn: "জলোচ্ছ্বাস, নদীভাঙন এবং জলবায়ু পরিবর্তন মোকাবিলায় দেশীয় ম্যানগ্রোভ প্রজাতির গাছ রোপণের মাধ্যমে সুন্দরবনের ঝুঁকিপূর্ণ উপকূলীয় অঞ্চল পুনরুদ্ধার করা।",
        fullDescription: "The Sundarbans, the world's largest mangrove forest, acts as Bangladesh's natural shield against devastating cyclones. However, deforestation and rising salinity have degraded this barrier. Our Mangrove Reforestation initiative engages Satkhira's local coastal communities—particularly women and traditional honey collectors (Mawalis)—to nursery-grow and plant native Keora, Gewa, and Sundari saplings. This project not only helps store massive amounts of carbon but also revives the natural habitats of endangered local wildlife while offering sustainable livelihood opportunities for local guardians.",
        fullDescriptionBn: "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবন বাংলাদেশের জন্য ভয়াবহ ঘূর্ণিঝড়ের বিরুদ্ধে প্রাকৃতিক ঢাল হিসেবে কাজ করে। তবে বন উজাড় ও ক্রমবর্ধমান লবণাক্ততা এই প্রাকৃতিক ঢালটিকে ক্ষতিগ্রস্ত করেছে। আমাদের ম্যানগ্রোভ বনায়ন উদ্যোগ সাতক্ষীরার স্থানীয় উপকূলীয় জনগোষ্ঠীকে—বিশেষ করে নারী এবং ঐতিহ্যবাহী মৌয়ালদের—দেশীয় কেওড়া, গেওয়া এবং সুন্দরী চারা নার্সারিতে তৈরি ও রোপণে যুক্ত করে। এই প্রকল্পটি কেবল কার্বন জমা করতেই সাহায্য করছে না, বরং স্থানীয় বন্যপ্রাণীর প্রাকৃতিক আবাসস্থল পুনরুদ্ধার করছে এবং স্থানীয় অভিভাবকদের জন্য টেকসই জীবিকার সুযোগ সৃষ্টি করছে।",
        impactMetric: "25,000+ Saplings",
        impactMetricBn: "২৫,০০০+ চারা গাছ",
        impactLabel: "Planted & Monitored",
        impactLabelBn: "রোপণ ও পর্যবেক্ষণ করা হয়েছে",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1588880331179-bc9b93a8c5d8?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80"
        ]
      },
      {
        id: "proj-2",
        title: "Solar Electrification for Off-Grid Schools",
        titleBn: "অফ-গ্রিড বিদ্যালয়ে সৌর বিদ্যুতায়ন",
        category: "renewable",
        categoryLabel: "Renewable Energy",
        categoryLabelBn: "নবায়নযোগ্য জ্বালানি",
        location: "Kurigram Char Lands",
        locationBn: "কুড়িগ্রামের চর অঞ্চল",
        status: "completed",
        statusLabel: "Completed",
        statusLabelBn: "সম্পন্ন",
        shortDescription: "Installing reliable off-grid solar energy systems in remote primary schools across northern river island chars, facilitating digital learning.",
        shortDescriptionBn: "উত্তরাঞ্চলের চরাঞ্চলের প্রত্যন্ত প্রাথমিক বিদ্যালয়গুলোতে নির্ভরযোগ্য সৌর বিদ্যুৎ ব্যবস্থা স্থাপন করা হচ্ছে, যা ডিজিটাল শিক্ষার পথ সহজ করছে।",
        fullDescription: "In northern Bangladesh's river island churs, electricity grids are non-existent, leaving classrooms dark and shutting students out of modern learning tools. Green Earth has successfully engineered and installed custom solar micro-grids on 15 schools. Each school is now equipped with bright, energy-efficient LED lights, wall fans, and low-power smart tablets. The project has doubled daily school attendance, reduced heat stress during hot summer months, and allowed schools to host community-led night literacy classes for adults, brightening whole village futures.",
        fullDescriptionBn: "বাংলাদেশের উত্তরাঞ্চলের চরাঞ্চলগুলোতে কোনো বিদ্যুৎ গ্রিড নেই, যার ফলে ক্লাসরুমগুলো অন্ধকারে থাকত এবং শিক্ষার্থীরা আধুনিক শিক্ষার সুযোগ থেকে বঞ্চিত হতো। গ্রিন আর্থ সফলভাবে ১৫টি বিদ্যালয়ে কাস্টম সৌর মাইক্রো-গ্রিড স্থাপন করেছে। প্রতিটি বিদ্যালয় এখন উজ্জ্বল এলইডি লাইট, দেয়াল ফ্যান এবং স্বল্প-শক্তির স্মার্ট ট্যাবলেটে সজ্জিত। এই প্রকল্পটি দৈনিক শিক্ষার্থীদের উপস্থিতি দ্বিগুণ করেছে, গ্রীষ্মকালে গরমের কষ্ট কমিয়েছে এবং বিদ্যালয়গুলোতে বয়স্কদের জন্য রাতে সাক্ষরতা ক্লাস আয়োজনের সুযোগ করে দিয়েছে, যা পুরো গ্রামের ভবিষ্যৎ উজ্জ্বল করছে।",
        impactMetric: "15 Primary Schools",
        impactMetricBn: "১৫টি প্রাথমিক বিদ্যালয়",
        impactLabel: "Fully Powered by Solar",
        impactLabelBn: "সম্পূর্ণ সৌরশক্তিতে চালিত",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80"
        ]
      },
      {
        id: "proj-3",
        title: "Safe Drinking Water Solutions & Arsenic Mitigation",
        titleBn: "নিরাপদ খাবার পানি ও আর্সেনিকমুক্তকরণ প্রকল্প",
        category: "water",
        categoryLabel: "Water Conservation",
        categoryLabelBn: "পানি সংরক্ষণ",
        location: "Chandpur District",
        locationBn: "চাঁদপুর জেলা",
        status: "ongoing",
        statusLabel: "Ongoing",
        statusLabelBn: "চলমান",
        shortDescription: "Deploying high-efficiency deep tube wells and rainwater harvesting units in areas suffering from toxic ground-level arsenic contamination.",
        shortDescriptionBn: "তীব্র ভূগর্ভস্থ আর্সেনিক দূষণে আক্রান্ত এলাকায় উচ্চ ক্ষমতাসম্পন্ন গভীর নলকূপ এবং বৃষ্টির পানি সংগ্রহের প্ল্যান্ট স্থাপন করা হচ্ছে।",
        fullDescription: "Arsenic toxicity in groundwater remains one of Bangladesh's most silent yet deadliest ecological crises. Chandpur has experienced high levels of contaminated water, causing chronic skin diseases and organ failures. Green Earth is working tirelessly to deploy deep-aquifer tube wells (drilled past 300 meters to reach arsenic-free pure water layers) and gravity-fed filtration columns. Alongside, we build rainwater harvesting structures for household rain catchments. Every installation is community-managed, with transparent water testing records posted publicly to guarantee continuous safety.",
        fullDescriptionBn: "ভূগর্ভস্থ পানিতে আর্সেনিকের বিষাক্ততা বাংলাদেশের সবচেয়ে নীরব অথচ মারাত্মক পরিবেশগত সংকটগুলোর একটি। চাঁদপুর জেলায় আর্সেনিক দূষণের মাত্রা অত্যন্ত বেশি, যার কারণে চর্মরোগ এবং অঙ্গহানি ঘটে। গ্রিন আর্থ গভীর নলকূপ (আর্সেনিকমুক্ত বিশুদ্ধ পানি পেতে ৩০০ মিটারের বেশি গভীর) এবং গ্র্যাভিটি ফিল্টার স্থাপন করতে নিরলসভাবে কাজ করছে। পাশাপাশি আমরা বাসাবাড়ির জন্য বৃষ্টির পানি সংগ্রহের কাঠামো তৈরি করছি। প্রতিটি ইনস্টলেশন স্থানীয়দের দ্বারা পরিচালিত হয় এবং পানির গুণগত মানের রেকর্ড জনসমক্ষে প্রকাশ করা হয়।",
        impactMetric: "8,000+ Residents",
        impactMetricBn: "৮,০০০+ অধিবাসী",
        impactLabel: "Provided Clean Safe Water",
        impactLabelBn: "বিশুদ্ধ নিরাপদ পানি সরবরাহ",
        image: "https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=800&auto=format&fit=crop&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=800&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80"
        ]
      }
    ];
    fs.writeFileSync(filePaths.projects, JSON.stringify(initialProjects, null, 2));
  }

  // 2. Initial Blogs
  if (!fs.existsSync(filePaths.blogs)) {
    const initialBlogs = [
      {
        id: "blog-1",
        title: "Mangroves: Our Strongest Natural Shield Against Cyclones",
        titleBn: "ম্যানগ্রোভ: ঘূর্ণিঝড়ের বিরুদ্ধে আমাদের সবচেয়ে শক্তিশালী প্রাকৃতিক ঢাল",
        category: "Ecology",
        categoryBn: "পরিবেশবিদ্যা",
        excerpt: "Analyzing how the root structures of coastal mangrove trees protect the shoreline from devastating floods, saving thousands of lives and homes in Bangladesh.",
        excerptBn: "ম্যানগ্রোভ গাছের জটিল মূল কাঠামো কীভাবে উপকূলরেখাকে জলোচ্ছ্বাস থেকে রক্ষা করে এবং বাংলাদেশে হাজার হাজার জীবন বাঁচায় তা বিশ্লেষণ।",
        content: "Bangladesh is on the frontlines of global climate change. Every year, powerful tropical storms brew in the Bay of Bengal and roll onto our vulnerable coastlines. But there lies a natural, highly efficient engineering solution at the mouth of the delta—the Sundarbans Mangrove forest. The intricate, interlocking root structures of mangrove trees like Sundari and Keora function as solid energy dissipators. They absorb the massive physical energy of incoming tidal waves, reducing wind velocities and mitigating high surge depths. Our reforestation projects in Satkhira and Dacope are actively restoring these shields. Working side-by-side with local residents, we are not just planting trees—we are building live coastal walls.",
        contentBn: "বাংলাদেশ বৈশ্বিক জলবায়ু পরিবর্তনের অগ্রভাগে রয়েছে। প্রতি বছর বঙ্গোপসাগরে শক্তিশালী ক্রান্তীয় ঝড় তৈরি হয় এবং আমাদের উপকূলীয় অঞ্চলে আঘাত হানে। কিন্তু এই বদ্বীপে রয়েছে সুন্দরবনের ম্যানগ্রোভ বনের মতো একটি প্রাকৃতিক ও অত্যন্ত কার্যকর ইঞ্জিনিয়ারিং সমাধান। সুন্দরী ও কেওড়া গাছের জটিল মূল কাঠামো জলোচ্ছ্বাসের গতি কমিয়ে দেয় এবং তরঙ্গের উচ্চতা হ্রাস করে। সাতক্ষীরা ও দাকোপে আমাদের বনায়ন প্রকল্পগুলো এই প্রাকৃতিক ঢালগুলোকে পুনরুদ্ধার করছে। স্থানীয়দের সাথে কাঁধে কাঁধ মিলিয়ে আমরা কেবল গাছ রোপণ করছি না—আমরা জীবন্ত প্রাচীর তৈরি করছি।",
        date: "June 18, 2026",
        dateBn: "১৮ জুন, ২০২৬",
        author: "Dr. Anisur Rahman",
        authorBn: "ড. আনিসুর রহমান",
        readTime: "5 min read",
        readTimeBn: "৫ মিনিট রিড",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: "blog-2",
        title: "How Char Islands are Embracing Clean Solar Micro-Grids",
        titleBn: "চরাঞ্চল যেভাবে সৌর মাইক্রো-গ্রিড গ্রহণ করছে",
        category: "Energy",
        categoryBn: "জ্বালানি",
        excerpt: "A deep look into how off-grid solar electricity is transforming education, health, and night literacy in Kurigram's isolated river islands.",
        excerptBn: "কুড়িগ্রামের বিচ্ছিন্ন চরাঞ্চলগুলোতে অফ-গ্রিড সৌর বিদ্যুৎ কীভাবে শিক্ষা, স্বাস্থ্য এবং নৈশ শিক্ষা পরিবর্তন করছে তার গভীর বিশ্লেষণ।",
        content: "Char islands are dynamically shifting shifting masses of sand in the middle of Bangladesh's giant rivers. Constantly eroding and re-forming, they are physically cut off from the main electricity grid. Until recently, when night fell, education stopped completely. Families burned costly and hazardous kerosene lamps for light, inhaling toxic smoke. Green Earth's solar initiative replaced this with clean, stable solar microgrids. In 15 primary schools, bright LED lightbulbs now hang under tin roofs, and smart tablets are charged cleanly. Adult night literacy groups are flourishing, and critical vaccine cooling fridges run without interruption. Clean energy isn't just lighting bulbs; it's lifting communities out of darkness.",
        contentBn: "চরাঞ্চলগুলো বাংলাদেশের বিশাল নদীগুলোর মধ্যে বালির গতিশীল দ্বীপ। এগুলো সর্বদা নদীভাঙন ও পুনর্গঠনের মধ্য দিয়ে যায় এবং গ্রিডের বিদ্যুৎ থেকে বিচ্ছিন্ন। কিছুদিন আগেও রাত নামলেই শিক্ষা পুরোপুরি বন্ধ হয়ে যেত। পরিবারগুলো কেরোসিনের বাতি জ্বালাত, যা বিষাক্ত ধোঁয়ার সৃষ্টি করত। গ্রিন আর্থের সৌর উদ্যোগ এটিকে পরিচ্ছন্ন, স্থিতিশীল সোলার মাইক্রো-গ্রিডে রূপান্তর করেছে। ১৫টি প্রাথমিক বিদ্যালয়ের টিনের চালের নিচে এখন জ্বলছে এলইডি বাল্ব এবং স্মার্ট ট্যাবলেট চার্জ করা হচ্ছে। বয়স্কদের নৈশ সাক্ষরতা ক্লাস চালু হয়েছে এবং প্রতিষেধক সংরক্ষণের ফ্রিজ চলছে কোনো বাধা ছাড়াই। পরিচ্ছন্ন জ্বালানি কেবল বাতি জ্বালাচ্ছে না; এটি পুরো সমাজকে অন্ধকার থেকে আলোয় আনছে।",
        date: "May 04, 2026",
        dateBn: "৪ মে, ২০২৬",
        author: "Sumaiya Chowdhury",
        authorBn: "সুরাইয়া চৌধুরী",
        readTime: "4 min read",
        readTimeBn: "৪ মিনিট রিড",
        image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: "blog-3",
        title: "Simple Household Guide to Reduce Plastic Waste in Dhaka",
        titleBn: "ঢাকা শহরে প্লাস্টিক বর্জ্য হ্রাসের সহজ গৃহস্থালি নির্দেশিকা",
        category: "Waste",
        categoryBn: "বর্জ্য ব্যবস্থাপনা",
        excerpt: "Practical and actionable steps to reduce single-use plastic, manage home recycling, and keep Bangladesh's streets and canals clean.",
        excerptBn: "একবার ব্যবহারযোগ্য প্লাস্টিক হ্রাস, বাসাবাড়ির রিসাইক্লিং ব্যবস্থাপনা এবং ঢাকা শহরের রাস্তা ও খাল পরিষ্কার রাখার ব্যবহারিক পদক্ষেপ।",
        content: "Dhaka produces over 600 metric tons of plastic waste every single day, much of which clogs our vital storm drainage systems and ends up in the Buriganga river, poisoning water and fish. While systemic solutions are critical, behavioral shifts at home make a profound difference. First, separate wet food scraps from dry plastics. Clean and bag dry plastics separately so informal recycling collectors (Tokais) can easily gather them safely. Second, swap single-use grocery bags for reusable organic jute bags—Bengal's golden fiber is the ultimate eco-friendly alternative! Small daily actions create massive cumulative wave of positive environmental change across the capital.",
        contentBn: "ঢাকা শহরে প্রতিদিন ৬০০ মেট্রিক টনেরও বেশি প্লাস্টিক বর্জ্য তৈরি হয়, যার বেশিরভাগই আমাদের নিষ্কাশন ড্রেন আটকে দেয় এবং বুড়িগঙ্গা নদীতে পড়ে পানি ও মাছকে বিষাক্ত করে। যদিও পদ্ধতিগত সমাধান জরুরি, বাসাবাড়িতে আচরণের পরিবর্তন অনেক বড় ভূমিকা রাখে। প্রথমত, ভেজা খাবারের অংশ শুকনো প্লাস্টিক থেকে আলাদা করুন। শুকনো প্লাস্টিকগুলো পরিষ্কার করে আলাদা ব্যাগে রাখুন যাতে রিসাইকেল করা সহজ হয়। দ্বিতীয়ত, প্লাস্টিকের ব্যাগের বদলে পাটের ব্যাগ ব্যবহার করুন—বাংলার সোনালী আঁশই সেরা পরিবেশবান্ধব বিকল্প! ছোট ছোট দৈনন্দিন পদক্ষেপ রাজধানীর পরিবেশে বিশাল ইতিবাচক পরিবর্তন আনতে পারে।",
        date: "April 22, 2026",
        dateBn: "২২ এপ্রিল, ২০২৬",
        author: "Faisal Ahmed Tanvir",
        authorBn: "ফয়সাল আহমেদ তানভীর",
        readTime: "3 min read",
        readTimeBn: "৩ মিনিট রিড",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80"
      }
    ];
    fs.writeFileSync(filePaths.blogs, JSON.stringify(initialBlogs, null, 2));
  }

  // 3. Initial Team Members
  if (!fs.existsSync(filePaths.team)) {
    const initialTeam = [
      {
        id: "team-1",
        name: "Dr. Anisur Rahman",
        nameBn: "ড. আনিসুর রহমান",
        role: "Founder & Executive Director",
        roleBn: "প্রতিষ্ঠাতা ও নির্বাহী পরিচালক",
        bio: "Ph.D. in Environmental Science from DU, passionate about coastal mangrove restoration and sustainable climate action in Bangladesh.",
        bioBn: "ঢাকা বিশ্ববিদ্যালয় থেকে পরিবেশ বিজ্ঞানে পিএইচডি। উপকূলীয় ম্যানগ্রোভ পুনরুদ্ধার এবং বাংলাদেশে টেকসই জলবায়ু কার্যক্রম সম্পর্কে অত্যন্ত উত্সাহী।",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "team-2",
        name: "Sumaiya Chowdhury",
        nameBn: "সুরাইয়া চৌধুরী",
        role: "Lead Climate Engineer & Hydrologist",
        roleBn: "প্রধান জলবায়ু প্রকৌশলী ও জলবিদ",
        bio: "Specialist in groundwater mapping and solar pumping grids. Keeps remote filtration units and water tube wells clean and running.",
        bioBn: "ভূগর্ভস্থ পানি ম্যাপিং এবং সৌর পাম্পিং গ্রিডের বিশেষজ্ঞ। প্রত্যন্ত অঞ্চলের ফিল্টার এবং নলকূপ সচল রাখতে কাজ করেন।",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "team-3",
        name: "Faisal Ahmed Tanvir",
        nameBn: "ফয়সাল আহমেদ তানভীর",
        role: "Director of Community Engagement",
        roleBn: "স্থানীয় অংশীদারিত্ব বিষয়ক পরিচালক",
        bio: "An activist working on grassroots campaigns. Unites schools, village elders, and student groups for green action drives.",
        bioBn: "তৃণমূল অভিযানের একজন কর্মী। পরিবেশবান্ধব কার্যক্রমের জন্য বিদ্যালয়, গ্রামের মুরুব্বি ও ছাত্রদলকে একত্রিত করেন।",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "team-4",
        name: "Farhana Akter Lila",
        nameBn: "ফারহানা আক্তার লিলা",
        role: "Chief Conservation Biologist",
        roleBn: "প্রধান জীববৈচিত্র্য বিজ্ঞানী",
        bio: "Researches biodiversity in the Sundarbans. Develops native species planting guidelines and tests river ecological health.",
        bioBn: "সুন্দরবনের জীববৈচিত্র্য নিয়ে গবেষণা করেন। দেশীয় গাছ রোপণের গাইডলাইন তৈরি করেন এবং নদীর পরিবেশগত স্বাস্থ্য পরীক্ষা করেন।",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80"
      }
    ];
    fs.writeFileSync(filePaths.team, JSON.stringify(initialTeam, null, 2));
  }

  // 4. Initial Gallery Items
  if (!fs.existsSync(filePaths.gallery)) {
    const initialGallery = [
      {
        id: "gal-1",
        title: "Coastal Mangrove Plantation Satkhira",
        titleBn: "উপকূলীয় ম্যানগ্রোভ রোপণ, সাতক্ষীরা",
        category: "plantation",
        categoryLabel: "Plantation",
        categoryLabelBn: "বৃক্ষরোপণ",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80",
        date: "2025"
      },
      {
        id: "gal-2",
        title: "Solar Panel System on Char Primary School",
        titleBn: "চরাঞ্চল প্রাথমিক বিদ্যালয়ে সৌরবিদ্যুৎ সিস্টেম",
        category: "renewable",
        categoryLabel: "Solar Power",
        categoryLabelBn: "সৌর শক্তি",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80",
        date: "2026"
      },
      {
        id: "gal-3",
        title: "Deep Tube Well Installation",
        titleBn: "গভীর নলকূপ স্থাপন কার্যক্রম",
        category: "water",
        categoryLabel: "Clean Water",
        categoryLabelBn: "বিশুদ্ধ পানি",
        image: "https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=800&auto=format&fit=crop&q=80",
        date: "2026"
      },
      {
        id: "gal-4",
        title: "Youth Environment Training Workshop",
        titleBn: "তরুণ পরিবেশ সচেতনতা কর্মশালা",
        category: "campaign",
        categoryLabel: "Campaigns",
        categoryLabelBn: "সচেতনতা অভিযান",
        image: "https://images.unsplash.com/photo-1544531516-a5e857b2a590?w=800&auto=format&fit=crop&q=80",
        date: "2025"
      },
      {
        id: "gal-5",
        title: "Community Tree Sapling Nursery",
        titleBn: "স্থানীয় চারাগাছ নার্সারি",
        category: "plantation",
        categoryLabel: "Plantation",
        categoryLabelBn: "বৃক্ষরোপণ",
        image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop&q=80",
        date: "2025"
      },
      {
        id: "gal-6",
        title: "Clean Buriganga River Campaign",
        titleBn: "বুড়িগঙ্গা নদী পরিচ্ছন্নতা অভিযান",
        category: "waste",
        categoryLabel: "Waste Cleanups",
        categoryLabelBn: "বর্জ্য অপসারণ",
        image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=80",
        date: "2026"
      }
    ];
    fs.writeFileSync(filePaths.gallery, JSON.stringify(initialGallery, null, 2));
  }

  // 5. Volunteers List
  if (!fs.existsSync(filePaths.volunteers)) {
    const initialVolunteers = [
      {
        id: "vol-1",
        name: "Abir Hasan",
        email: "abir.hasan@gamil.com",
        phone: "01711223344",
        interest: "plantation",
        message: "I want to plant trees in Sundarbans and protect our coastal borders.",
        date: "2026-06-25T14:32:00.000Z"
      },
      {
        id: "vol-2",
        name: "Sadia Rahman",
        email: "sadia.rahman@gmail.com",
        phone: "01822334455",
        interest: "waste",
        message: "Intrigued by the Buriganga cleanup campaigns. Let's make Dhaka green!",
        date: "2026-07-02T09:15:00.000Z"
      }
    ];
    fs.writeFileSync(filePaths.volunteers, JSON.stringify(initialVolunteers, null, 2));
  }

  // 6. Donations List
  if (!fs.existsSync(filePaths.donations)) {
    const initialDonations = [
      {
        id: "don-1",
        name: "Naimur Rahman",
        email: "naimur@example.com",
        amount: 1000,
        paymentMethod: "bkash",
        status: "verified",
        transId: "BKX92841AD",
        date: "2026-06-28T18:40:00.000Z"
      },
      {
        id: "don-2",
        name: "Fariha Alam",
        email: "fariha.alam@example.com",
        amount: 5000,
        paymentMethod: "nagad",
        status: "verified",
        transId: "NGD8239401",
        date: "2026-07-01T11:20:00.000Z"
      }
    ];
    fs.writeFileSync(filePaths.donations, JSON.stringify(initialDonations, null, 2));
  }

  // 7. Subscribers List
  if (!fs.existsSync(filePaths.subscribers)) {
    const initialSubscribers = [
      "green_activist@gmail.com",
      "conservation_student@du.ac.bd",
      "sustainable_living@outlook.com"
    ];
    fs.writeFileSync(filePaths.subscribers, JSON.stringify(initialSubscribers, null, 2));
  }

  // 8. Contact Submissions List
  if (!fs.existsSync(filePaths.contacts)) {
    const initialContacts = [
      {
        id: "cont-1",
        name: "Zamil Uddin",
        email: "zamil@example.com",
        phone: "01912345678",
        subject: "CSR opportunity",
        message: "We are interested in sponsoring a solar panel installation for a char school. Please get back to us.",
        date: "2026-07-04T15:10:00.000Z"
      }
    ];
    fs.writeFileSync(filePaths.contacts, JSON.stringify(initialContacts, null, 2));
  }

  // 9. Admin Settings & Credentials
  if (!fs.existsSync(filePaths.settings)) {
    const initialSettings = {
      username: "admin",
      password: "greenearth2026", // Default secure, simple password
      orgName: "Green Earth",
      tagline: "Cleaner, Greener & Sustainable Future",
      taglineBn: "পরিচ্ছন্ন, সবুজ ও টেকসই ভবিষ্যৎ",
      phone: "+880 1751601039",
      email: "greenearthbd.25@gmail.com",
      address: "Santahar, Adamdighi, Bogura",
      addressBn: "সান্তাহার, আদমদীঘি, বগুড়া",
      footerAboutText: "Green Earth is a grassroots, non-profit environmental organization based in Bangladesh, driving sustainable reforestation, solar transition, and water safety.",
      footerAboutTextBn: "গ্রিন আর্থ হলো বাংলাদেশে জলবায়ু পরিবর্তনের ক্ষতিকর প্রভাব মোকাবিলা ও পরিবেশ সংরক্ষণে নিয়োজিত একটি তৃণমূল সামাজিক সংস্থা।",
      footerFbUrl: "https://www.facebook.com/greenearthbd.25/",
      footerInstaUrl: "https://instagram.com",
      footerLinkedinUrl: "https://linkedin.com",
      footerYoutubeUrl: "https://youtube.com",
      footerNewsletterTitle: "Subscribe to Eco-News",
      footerNewsletterTitleBn: "নিউজলেটার সাবস্ক্রাইব",
      footerNewsletterDesc: "Sign up to receive timely updates on planting drives, solar microgrid operations, and ecological guidelines in Bangladesh.",
      footerNewsletterDescBn: "নতুন প্রকল্প ও বৃক্ষরোপণ অভিযানের খবরাখবর সবার আগে জানতে আপনার ইমেইল দিয়ে সংযুক্ত থাকুন।",
      footerCopyright: "© 2026 Green Earth Bangladesh. All Rights Reserved.",
      footerCopyrightBn: "© ২০২৬ গ্রিন আর্থ বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।",
      membershipFormUrl: "https://forms.gle/51Kt57CfRuAnAGy88"
    };
    fs.writeFileSync(filePaths.settings, JSON.stringify(initialSettings, null, 2));
  }

  // 10. Initial Testimonials
  if (!fs.existsSync(filePaths.testimonials)) {
    const initialTestimonials = [
      {
        id: "test-1",
        quote: "The deep tube well installed by Green Earth has brought pure, arsenic-free water to our doorsteps. Our children no longer suffer from water-borne diseases, and we can lead healthy lives.",
        quoteBn: "গ্রিন আর্থের স্থাপন করা গভীর নলকূপ আমাদের দোরগোড়ায় আর্সেনিকমুক্ত বিশুদ্ধ পানি এনে দিয়েছে। আমাদের বাচ্চারা এখন আর পেটের রোগে ভোগে না, আমরা সুস্থ আছি।",
        author: "Morjina Begum",
        authorBn: "মর্জিনা বেগম",
        role: "Homemaker & Community Lead",
        roleBn: "গৃহিণী ও স্থানীয় নেত্রী",
        location: "Chandpur, Bangladesh",
        locationBn: "চাঁদপুর, বাংলাদেশ"
      },
      {
        id: "test-2",
        quote: "Thanks to the solar panel systems, our school can now run computer tablets and fans during the extreme heat of summer. Attendances have skyrocketed, and students love coming here.",
        quoteBn: "সৌরবিদ্যুৎ সিস্টেমের জন্য আমাদের স্কুলে কম্পিউটার ট্যাবলেট এবং ফ্যান চালানো যায়। গরমের দিনেও বাচ্চাদের উপস্থিতি অনেক বেড়ে গেছে এবং তারা স্কুলে আসতে ভালোবাসে।",
        author: "Anisul Islam Talukder",
        authorBn: "আনিসুল ইসলাম তালুকদার",
        role: "Primary School Headmaster",
        roleBn: "প্রাথমিক বিদ্যালয়ের প্রধান শিক্ষক",
        location: "Kurigram Char, Bangladesh",
        locationBn: "কুড়িগ্রাম চর, বাংলাদেশ"
      },
      {
        id: "test-3",
        quote: "Joining as a volunteer with Green Earth changed my perspective. Planting mangroves in Satkhira taught me how resilient our coastal people are, and how much we can achieve together.",
        quoteBn: "গ্রিন আর্থ-এর একজন স্বেচ্ছাসেবী হিসেবে যোগ দেওয়া আমার জীবনকে বদলে দিয়েছে। সাতক্ষীরায় ম্যানগ্রোভ রোপণ করে আমি উপকূলের মানুষের সহনশীলতা এবং একতাবদ্ধতার জোর দেখেছি।",
        author: "Tanvir Rahman",
        authorBn: "তানভীর রহমান",
        role: "Student, University of Dhaka",
        roleBn: "ছাত্র, ঢাকা বিশ্ববিদ্যালয়",
        location: "Dhaka, Bangladesh",
        locationBn: "ঢাকা, বাংলাদেশ"
      }
    ];
    fs.writeFileSync(filePaths.testimonials, JSON.stringify(initialTestimonials, null, 2));
  }

  // 11. Initial Milestones
  let seedMilestones = false;
  if (!fs.existsSync(filePaths.milestones)) {
    seedMilestones = true;
  } else {
    try {
      const content = fs.readFileSync(filePaths.milestones, "utf-8").trim();
      if (content === "" || content === "[]") {
        seedMilestones = true;
      }
    } catch (e) {
      seedMilestones = true;
    }
  }

  if (seedMilestones) {
    const initialMilestones = [
      {
        id: "mile-1",
        year: "2024",
        yearBn: "২০২৪",
        title: "The Seed is Planted",
        titleBn: "যাত্রার সূচনা",
        description: "Green Earth was founded by a passionate group of environmental scientists and student volunteers in Dhaka to tackle urban pollution and local tree loss.",
        descriptionBn: "শহরের পরিবেশ দূষণ ও সবুজ গাছপালার ঘাটতি মোকাবিলায় ঢাকা বিশ্ববিদ্যালয় থেকে একদল পরিবেশ বিজ্ঞানী ও ছাত্র স্বেচ্ছাসেবীর উদ্যোগে গ্রিন আর্থ প্রতিষ্ঠিত হয়।"
      },
      {
        id: "mile-2",
        year: "2025",
        yearBn: "২০২৫",
        title: "Coastal Shields Project",
        titleBn: "উপকূলীয় সুরক্ষা প্রকল্প",
        description: "Launched our first mega coastal mangrove plantation in Satkhira, placing 10,000+ Keora and Gewa saplings alongside local coastal guardians.",
        descriptionBn: "সাতক্ষীরায় প্রথম বৃহৎ উপকূলীয় ম্যানগ্রোভ রোপণ শুরু হয়, যেখানে স্থানীয়দের অংশীদারিত্বে ১০,০০০টিরও বেশি চারা রোপণ করা হয়।"
      },
      {
        id: "mile-3",
        year: "2026",
        yearBn: "২০২৬",
        title: "Solar Power for Education",
        titleBn: "শিক্ষায় সৌরবিদ্যুৎ",
        description: "Successfully expanded our renewable initiative to power 15 remote char schools with sustainable, off-grid clean solar micro-grids.",
        descriptionBn: "চরাঞ্চলের ১৫টি প্রত্যন্ত প্রাথমিক বিদ্যালয়কে সম্পূর্ণ টেকসই, অফ-গ্রিড সৌর মাইক্রো-গ্রিডের আওতাহীন সফলভাবে আনা হয়েছে।"
      }
    ];
    fs.writeFileSync(filePaths.milestones, JSON.stringify(initialMilestones, null, 2));
  }

  // 12. Initial Core Values
  let seedCoreValues = false;
  if (!fs.existsSync(filePaths.corevalues)) {
    seedCoreValues = true;
  } else {
    try {
      const content = fs.readFileSync(filePaths.corevalues, "utf-8").trim();
      if (content === "" || content === "[]") {
        seedCoreValues = true;
      }
    } catch (e) {
      seedCoreValues = true;
    }
  }

  if (seedCoreValues) {
    const initialCoreValues = [
      {
        id: "val-1",
        title: "Sustainability First",
        titleBn: "স্থায়িত্বই প্রধান",
        description: "Every project we model aims for long-term ecological balance and locally independent operational self-sufficiency.",
        descriptionBn: "আমাদের প্রতিটি প্রকল্পের লক্ষ্য দীর্ঘমেয়াদী পরিবেশগত ভারসাম্য এবং স্থানীয়ভাবে স্বাবলম্বী পরিচালনা নিশ্চিত করা।",
        iconName: "Leaf"
      },
      {
        id: "val-2",
        title: "Community Driven",
        titleBn: "জনগণের অংশীদারিত্ব",
        description: "We believe real change starts bottom-up. Local villagers own, manage, and scale all eco-solutions we launch together.",
        descriptionBn: "আমরা বিশ্বাস করি প্রকৃত পরিবর্তন তৃণমূল থেকে শুরু হয়। স্থানীয় গ্রামবাসীরা আমাদের সমস্ত পরিবেশ-বান্ধব সমাধান পরিচালনা করেন।",
        iconName: "Users"
      },
      {
        id: "val-3",
        title: "Radical Transparency",
        titleBn: "চরম স্বচ্ছতা",
        description: "Every Taka donated is logged, tracked, and visible on demand. Financial files and impact measurements are fully open.",
        descriptionBn: "অনুদানকৃত প্রতিটি টাকার হিসাব রাখা হয় এবং জনসমক্ষে প্রকাশ করা হয়। আর্থিক বিবরণী ও প্রভাব পরিমাপ সকলের জন্য উন্মুক্ত।",
        iconName: "TrendingUp"
      },
      {
        id: "val-4",
        title: "Eco-Innovation",
        titleBn: "পরিবেশগত উদ্ভাবন",
        description: "Blending traditional Bengali soil wisdom with modern scientific monitoring tools, satellite mapping, and clean energy tech.",
        descriptionBn: "ঐতিহ্যবাহী বাঙালি মাটির চাষবাসের জ্ঞানের সাথে আধুনিক বৈজ্ঞানিক পর্যবেক্ষণ, স্যাটেলাইট ম্যাপিং এবং নবায়নযোগ্য জ্বালানির সমন্বয়।",
        iconName: "Award"
      }
    ];
    fs.writeFileSync(filePaths.corevalues, JSON.stringify(initialCoreValues, null, 2));
  }

  // 13. Initial Focus Areas
  let seedFocusAreas = false;
  if (!fs.existsSync(filePaths.focusareas)) {
    seedFocusAreas = true;
  } else {
    try {
      const content = fs.readFileSync(filePaths.focusareas, "utf-8").trim();
      if (content === "" || content === "[]") {
        seedFocusAreas = true;
      }
    } catch (e) {
      seedFocusAreas = true;
    }
  }

  if (seedFocusAreas) {
    const initialFocusAreas = [
      {
        id: "focus-1",
        iconName: "Trees",
        title: "Tree Plantation",
        titleBn: "বৃক্ষরোপণ কর্মসূচি",
        description: "Planting native trees and coastal mangroves in erosion-prone belts of Sundarbans and northern riverbanks.",
        descriptionBn: "সুন্দরবন উপকূল এবং উত্তরাঞ্চলের নদীভাঙন কবলিত এলাকায় দেশীয় চারা রোপণ ও ম্যানগ্রোভ বনায়ন তৈরি করা।",
        color: "emerald"
      },
      {
        id: "focus-2",
        iconName: "Sun",
        title: "Renewable Energy",
        titleBn: "নবায়নযোগ্য জ্বালানি",
        description: "Sponsoring reliable off-grid solar micro-grids for isolated schools and homes in northern river chars.",
        descriptionBn: "চরাঞ্চলের গ্রিডহীন প্রত্যন্ত এলাকায় সৌর প্যানেল ও হোম সিস্টেমের মাধ্যমে বিদ্যুৎ ও আলোর ব্যবস্থা করা।",
        color: "amber"
      },
      {
        id: "focus-3",
        iconName: "Droplet",
        title: "Water Conservation",
        titleBn: "বিশুদ্ধ পানি সরবরাহ",
        description: "Drilling deep, arsenic-free tube wells and setting rainwater purification structures in contaminated hubs.",
        descriptionBn: "আর্সেনিক ও স্যালাইন কবলিত এলাকায় গভীর বিশুদ্ধ নলকূপ এবং বৃষ্টির পানি ফিল্টারিং প্ল্যান্ট স্থাপন করা।",
        color: "sky"
      },
      {
        id: "focus-4",
        iconName: "Trash2",
        title: "Waste & Recycling",
        titleBn: "বর্জ্য ও রিসাইক্লিং",
        description: "Organizing riverbank plastic cleanups and teaching households smart eco-friendly recycling habits.",
        descriptionBn: "বুড়িগঙ্গাসহ বিভিন্ন নদী তীরবর্তী প্লাস্টিক অপসারণ এবং বাসাবাড়ির রিসাইক্লিং অভ্যাসের প্রশিক্ষণ দেওয়া।",
        color: "purple"
      }
    ];
    fs.writeFileSync(filePaths.focusareas, JSON.stringify(initialFocusAreas, null, 2));
  }

  // 14. Initial Green Hero Files
  if (!fs.existsSync(filePaths.ge_gh_participants)) {
    fs.writeFileSync(filePaths.ge_gh_participants, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(filePaths.ge_gh_trees)) {
    fs.writeFileSync(filePaths.ge_gh_trees, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(filePaths.ge_gh_logs)) {
    fs.writeFileSync(filePaths.ge_gh_logs, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(filePaths.ge_gh_overview)) {
    const defaultOverview = {
      titleEn: "Green Hero Initiative (Adapt a Tree)",
      titleBn: "গ্রিন হিরো ইনিশিয়েティブ - একটি গাছ দত্তক নিন",
      subtitleEn: "Plant Trees Today, Protect Tomorrow",
      subtitleBn: "আজই বৃক্ষরোপণ করুন, আগামীকে সুরক্ষিত রাখুন",
      descriptionEn: "Become a proud 'Green Hero' by planting and nurturing trees in your local community. Join our collective movement to combat rising heatwaves, increase urban green canopy, and foster climate resilience across Bangladesh. Register your trees, upload monthly growth logs, and earn your official certificate and badge.",
      descriptionBn: "নিজের এলাকায় গাছ রোপণ ও পরিচর্যা করে একজন গর্বিত 'গ্রিন হিরো' হয়ে উঠুন। ক্রমবর্ধমান দাবদাহ মোকাবিলা, শহরের সবুজ আচ্ছাদন বৃদ্ধি এবং জলবায়ু সহনশীল বাংলাদেশ গড়তে আমাদের সম্মিলিত আন্দোলনে যোগ দিন। আপনার রোপণ করা গাছের নিবন্ধন করুন, প্রতিমাসে বৃদ্ধির ছবি আপলোড করুন এবং অর্জন করুন অফিশিয়াল সার্টিফিকেট ও ব্যাজ।"
    };
    fs.writeFileSync(filePaths.ge_gh_overview, JSON.stringify(defaultOverview, null, 2));
  }
}

// Ensure database files are set up properly
initializeDataFiles();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Set up uploads directory
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve static files from public/uploads
  app.use("/uploads", express.static(uploadsDir));

  // Initialize Supabase client if configured for server-side upload fallback
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  const supabaseBucket = process.env.SUPABASE_BUCKET || process.env.VITE_SUPABASE_BUCKET || "green-earth-images";
  const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

  let isSupabaseDbAvailable = true;

  if (supabase) {
    console.log("Supabase storage is configured server-side. Uploads will be written to:", supabaseBucket);
  } else {
    console.log("Using local filesystem for uploads (fallback).");
  }

  // Helper file paths
  const getFilePath = (filename: string) => path.join(DATA_DIR, filename);

  // Helper read/write methods
  const readData = async <T>(filename: string): Promise<T> => {
    // 1. Read from local filesystem instantly (<1ms)
    try {
      const raw = fs.readFileSync(getFilePath(filename), "utf-8");
      const localData = JSON.parse(raw) as T;
      return localData;
    } catch (localErr) {
      // 2. Fallback if local file read fails or file does not exist
      if (supabase && isSupabaseDbAvailable) {
        try {
          const promise = supabase
            .from("key_value_store")
            .select("value")
            .eq("key", filename)
            .maybeSingle();

          const timeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Supabase read timeout")), 2500)
          );

          const { data, error } = await Promise.race([promise, timeout]) as any;
          if (!error && data && data.value) {
            try {
              fs.writeFileSync(getFilePath(filename), JSON.stringify(data.value, null, 2), "utf-8");
            } catch (e) {}
            return data.value as T;
          }
        } catch (err) {
          isSupabaseDbAvailable = false;
        }
      }
      return [] as unknown as T;
    }
  };

  const writeData = async <T>(filename: string, data: T): Promise<void> => {
    // Always write to local filesystem first to guarantee instant persistence
    try {
      fs.writeFileSync(getFilePath(filename), JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error(`Local write error for ${filename}:`, e);
    }

    // Write to Supabase asynchronously in background so response is non-blocking
    if (supabase && isSupabaseDbAvailable) {
      (async () => {
        try {
          const { error } = await supabase
            .from("key_value_store")
            .upsert({ key: filename, value: data, updated_at: new Date().toISOString() });

          if (error) {
            console.warn(`Supabase write warning for ${filename}:`, error.message || error);
            isSupabaseDbAvailable = false;
          }
        } catch (err) {
          console.warn(`Error writing ${filename} to Supabase:`, err);
          isSupabaseDbAvailable = false;
        }
      })();
    }
  };

  /* ==============================================
     API ROUTES (JSON CRUD)
     ============================================== */

  // Auth: Secure Admin Login validation
  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("LOGIN REQUEST RECEIVED:", { email });
    const settings = await readData<{ username?: string; password?: string }>("settings.json");

    const secureEmail = "greenearthbd.25@gmail.com";
    const dbUsername = (settings.username || "admin").trim().toLowerCase();
    const securePassword = settings.password || "greenearth2026";

    const normalizedEmail = (email || "").trim().toLowerCase();

    if ((normalizedEmail === secureEmail || normalizedEmail === dbUsername || normalizedEmail === "admin") && password === securePassword) {
      console.log("LOGIN SUCCESSFUL");
      res.json({ success: true, token: "green-earth-admin-token-2026" });
    } else {
      console.log("LOGIN FAILED: Invalid credentials");
      res.status(401).json({ success: false, error: "Invalid email or password" });
    }
  });

  // Auth: Secure Admin Registration (Sign Up)
  app.post("/api/admin/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("SIGNUP REQUEST RECEIVED:", { email });
      const secureEmail = "greenearthbd.25@gmail.com";

      if (email !== secureEmail) {
        console.log("SIGNUP FAILED: Unauthorized email");
        return res.status(403).json({ 
          success: false, 
          error: "Only greenearthbd.25@gmail.com is authorized to register as administrator." 
        });
      }

      if (!password || password.length < 6) {
        console.log("SIGNUP FAILED: Password too short");
        return res.status(400).json({ 
          success: false, 
          error: "Password must be at least 6 characters long." 
        });
      }

      const settings = await readData<{ password?: string; registered?: boolean }>("settings.json");

      if (settings.registered) {
        console.log("SIGNUP FAILED: Admin already registered");
        return res.status(400).json({ 
          success: false, 
          error: "Admin is already registered. Please log in with your credentials." 
        });
      }

      // Update password and mark as registered
      const updatedSettings = {
        ...settings,
        password: password,
        registered: true
      };

      await writeData("settings.json", updatedSettings);
      console.log("SIGNUP SUCCESSFUL");

      res.json({ success: true, message: "Admin registration successful! You can now log in." });
    } catch (err: any) {
      console.error("Signup error:", err);
      res.status(500).json({ success: false, error: "Internal server error during registration." });
    }
  });

  // Upload API: handles base64 image uploads from Admin Portal
  app.post("/api/upload", async (req, res) => {
    try {
      const { image, filename } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image data provided" });
      }

      // Check for size limits (e.g. 15MB)
      const sizeInBytes = Buffer.byteLength(image, 'utf8');
      const maxSizeInBytes = 15 * 1024 * 1024; // 15MB
      if (sizeInBytes > maxSizeInBytes) {
        return res.status(400).json({ error: "Image size exceeds 15MB limit" });
      }

      // The image is expected to be a base64 encoded string
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 image data" });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      // Extract extension
      let extension = "png";
      if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
        extension = "jpg";
      } else if (mimeType.includes("gif")) {
        extension = "gif";
      } else if (mimeType.includes("webp")) {
        extension = "webp";
      } else if (mimeType.includes("svg")) {
        extension = "svg";
      }

      // --- SUPABASE STORAGE UPLOAD ---
      if (supabase) {
        try {
          const cleanFilename = (filename || "upload")
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();
          const uniqueFilename = `${cleanFilename}_${Date.now()}.${extension}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(supabaseBucket)
            .upload(uniqueFilename, buffer, {
              contentType: mimeType,
              duplex: 'half'
            } as any);

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from(supabaseBucket)
              .getPublicUrl(uniqueFilename);

            if (urlData?.publicUrl) {
              return res.json({ success: true, url: urlData.publicUrl });
            }
          } else {
            console.warn("Supabase storage upload failed, falling back to local storage:", uploadError.message || uploadError);
          }
        } catch (supaErr) {
          console.warn("Supabase storage upload exception, falling back to local storage:", supaErr);
        }
      }

      // --- FALLBACK LOCAL FILESYSTEM UPLOAD ---
      const cleanFilename = (filename || "upload")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const uniqueFilename = `${cleanFilename}_${Date.now()}.${extension}`;
      const filePath = path.join(uploadsDir, uniqueFilename);

      fs.writeFileSync(filePath, buffer);

      // Return the public URL
      res.json({ success: true, url: `/uploads/${uniqueFilename}` });
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message || "Failed to upload image" });
    }
  });

  // Projects API
  app.get("/api/projects", async (req, res) => {
    res.json(await readData("projects.json"));
  });

  app.post("/api/projects", async (req, res) => {
    const projects = await readData<any[]>("projects.json");
    const newProject = req.body;

    if (!newProject.id) {
      newProject.id = "proj-" + Date.now();
      projects.push(newProject);
    } else {
      const idx = projects.findIndex((p) => p.id === newProject.id);
      if (idx !== -1) {
        projects[idx] = newProject;
      } else {
        projects.push(newProject);
      }
    }

    await writeData("projects.json", projects);
    res.json({ success: true, project: newProject });
  });

  app.delete("/api/projects/:id", async (req, res) => {
    const projects = await readData<any[]>("projects.json");
    const filtered = projects.filter((p) => p.id !== req.params.id);
    await writeData("projects.json", filtered);
    res.json({ success: true });
  });

  // Blogs API
  app.get("/api/blogs", async (req, res) => {
    res.json(await readData("blogs.json"));
  });

  app.post("/api/blogs", async (req, res) => {
    const blogs = await readData<any[]>("blogs.json");
    const newBlog = req.body;

    if (!newBlog.id) {
      newBlog.id = "blog-" + Date.now();
      blogs.push(newBlog);
    } else {
      const idx = blogs.findIndex((b) => b.id === newBlog.id);
      if (idx !== -1) {
        blogs[idx] = newBlog;
      } else {
        blogs.push(newBlog);
      }
    }

    await writeData("blogs.json", blogs);
    res.json({ success: true, blog: newBlog });
  });

  app.delete("/api/blogs/:id", async (req, res) => {
    const blogs = await readData<any[]>("blogs.json");
    const filtered = blogs.filter((b) => b.id !== req.params.id);
    await writeData("blogs.json", filtered);
    res.json({ success: true });
  });

  // Team API
  app.get("/api/team", async (req, res) => {
    res.json(await readData("team.json"));
  });

  app.post("/api/team", async (req, res) => {
    const team = await readData<any[]>("team.json");
    const newMember = req.body;

    if (!newMember.id) {
      newMember.id = "team-" + Date.now();
      team.push(newMember);
    } else {
      const idx = team.findIndex((t) => t.id === newMember.id);
      if (idx !== -1) {
        team[idx] = newMember;
      } else {
        team.push(newMember);
      }
    }

    await writeData("team.json", team);
    res.json({ success: true, teamMember: newMember });
  });

  app.delete("/api/team/:id", async (req, res) => {
    const team = await readData<any[]>("team.json");
    const filtered = team.filter((t) => t.id !== req.params.id);
    await writeData("team.json", filtered);
    res.json({ success: true });
  });

  // Gallery API
  app.get("/api/gallery", async (req, res) => {
    res.json(await readData("gallery.json"));
  });

  app.post("/api/gallery", async (req, res) => {
    const gallery = await readData<any[]>("gallery.json");
    const newItem = req.body;

    if (!newItem.id) {
      newItem.id = "gal-" + Date.now();
      gallery.push(newItem);
    } else {
      const idx = gallery.findIndex((g) => g.id === newItem.id);
      if (idx !== -1) {
        gallery[idx] = newItem;
      } else {
        gallery.push(newItem);
      }
    }

    await writeData("gallery.json", gallery);
    res.json({ success: true, galleryItem: newItem });
  });

  app.delete("/api/gallery/:id", async (req, res) => {
    const gallery = await readData<any[]>("gallery.json");
    const filtered = gallery.filter((g) => g.id !== req.params.id);
    await writeData("gallery.json", filtered);
    res.json({ success: true });
  });

  // Volunteers API (Submissions)
  app.get("/api/volunteers", async (req, res) => {
    res.json(await readData("volunteers.json"));
  });

  app.post("/api/volunteers", async (req, res) => {
    const volunteers = await readData<any[]>("volunteers.json");
    const newVol = req.body;
    newVol.id = "vol-" + Date.now();
    newVol.date = new Date().toISOString();
    volunteers.unshift(newVol); // Newest first

    await writeData("volunteers.json", volunteers);
    res.json({ success: true, volunteer: newVol });
  });

  app.delete("/api/volunteers/:id", async (req, res) => {
    const volunteers = await readData<any[]>("volunteers.json");
    const filtered = volunteers.filter((v) => v.id !== req.params.id);
    await writeData("volunteers.json", filtered);
    res.json({ success: true });
  });

  app.patch("/api/volunteers/:id", async (req, res) => {
    const volunteers = await readData<any[]>("volunteers.json");
    const index = volunteers.findIndex((v) => v.id === req.params.id);
    if (index !== -1) {
      volunteers[index] = { ...volunteers[index], ...req.body };
      await writeData("volunteers.json", volunteers);
      res.json({ success: true, volunteer: volunteers[index] });
    } else {
      res.status(404).json({ error: "Volunteer not found" });
    }
  });

  // --- GREEN HERO ENDPOINTS ---

  // 1. Participants
  app.get("/api/greenhero/participants", async (req, res) => {
    try {
      const raw = await readData<any[]>("ge_gh_participants.json");
      const data = Array.isArray(raw) ? raw : [];
      data.sort((a, b) => {
        const numA = parseInt(String(a.id || '').replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(String(b.id || '').replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/greenhero/participants", async (req, res) => {
    try {
      const rawParticipants = await readData<any[]>("ge_gh_participants.json");
      const participants = Array.isArray(rawParticipants) ? rawParticipants : [];
      const rawPayload = req.body;

      // If single item registration without an existing ID, check for duplicate mobile
      if (!Array.isArray(rawPayload) && rawPayload && !rawPayload.id) {
        const cleanMobile = String(rawPayload.mobile || '').trim();
        const existingMobile = participants.find(p => p && p.mobile && String(p.mobile).trim() === cleanMobile);
        if (cleanMobile && existingMobile) {
          return res.status(400).json({
            success: false,
            error: 'This mobile number is already registered. Please login or use a different number. (এই মোবাইল নম্বরটি দিয়ে ইতোমধ্যে রেজিস্ট্রেশন করা হয়েছে।)'
          });
        }
      }

      const items = Array.isArray(rawPayload) ? rawPayload : [rawPayload];
      const processedParticipants: any[] = [];

      let lastIdNum = participants.reduce((max, p) => {
        if (!p || !p.id) return max;
        const match = String(p.id).match(/GE-AT-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          return num > max ? num : max;
        }
        return max;
      }, 0);

      items.forEach((item) => {
        if (!item || (!item.name && !item.mobile)) return;

        const cleanMobile = String(item.mobile || '').trim();
        const itemId = item.id ? String(item.id).trim().toUpperCase() : null;

        // Check if participant already exists by ID (or by mobile if ID is supplied)
        const existingIndex = participants.findIndex((p) => {
          if (!p) return false;
          if (itemId && p.id && String(p.id).trim().toUpperCase() === itemId) return true;
          return false;
        });

        if (existingIndex !== -1) {
          // Update existing record
          participants[existingIndex] = {
            ...participants[existingIndex],
            ...item,
            id: participants[existingIndex].id || itemId // Preserve original ID
          };
          processedParticipants.push(participants[existingIndex]);
        } else {
          // Add new record
          lastIdNum++;
          const formattedId = item.id && String(item.id).toUpperCase().startsWith('GE-AT-')
            ? item.id
            : `GE-AT-${String(lastIdNum).padStart(6, '0')}`;

          const newParticipant = {
            ...item,
            id: formattedId,
            regDate: item.regDate || new Date().toISOString().split('T')[0],
            status: item.status || 'Approved'
          };
          participants.push(newParticipant);
          processedParticipants.push(newParticipant);
        }
      });

      // Sort sequentially by ID before saving
      participants.sort((a, b) => {
        const numA = parseInt(String(a.id || '').replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(String(b.id || '').replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });

      await writeData("ge_gh_participants.json", participants);

      if (Array.isArray(rawPayload)) {
        res.json({ success: true, participants: processedParticipants });
      } else {
        res.json({ success: true, participant: processedParticipants[0] });
      }
    } catch (e: any) {
      console.error("POST /api/greenhero/participants error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/greenhero/participants/:id", async (req, res) => {
    try {
      const participants = await readData<any[]>("ge_gh_participants.json");
      const targetId = String(req.params.id).trim().toUpperCase();
      const index = participants.findIndex(p => p && String(p.id).trim().toUpperCase() === targetId);
      if (index !== -1) {
        participants[index] = { ...participants[index], ...req.body };
        await writeData("ge_gh_participants.json", participants);
        res.json({ success: true, participant: participants[index] });
      } else {
        res.status(404).json({ error: "Participant not found" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/greenhero/participants/:id", async (req, res) => {
    try {
      const targetId = String(req.params.id).trim().toUpperCase();
      
      // 1. Filter participant
      const participants = await readData<any[]>("ge_gh_participants.json");
      const targetPart = participants.find(p => p && String(p.id).trim().toUpperCase() === targetId);
      const filteredParticipants = participants.filter(p => p && String(p.id).trim().toUpperCase() !== targetId);
      await writeData("ge_gh_participants.json", filteredParticipants);

      // 2. Cascade delete trees
      const trees = await readData<any[]>("ge_gh_trees.json");
      const filteredTrees = trees.filter(t => {
        if (!t) return false;
        if (t.participantId && String(t.participantId).trim().toUpperCase() === targetId) return false;
        if (targetPart && targetPart.mobileNumber && String(t.mobileNumber || '').trim() === String(targetPart.mobileNumber || '').trim()) return false;
        if (targetPart && targetPart.studentName && String(t.studentName || '').trim().toLowerCase() === String(targetPart.studentName || '').trim().toLowerCase() && String(t.schoolName || '').trim().toLowerCase() === String(targetPart.schoolName || '').trim().toLowerCase()) return false;
        return true;
      });
      await writeData("ge_gh_trees.json", filteredTrees);

      // 3. Cascade delete logs
      const logs = await readData<any[]>("ge_gh_logs.json");
      const filteredLogs = logs.filter(l => {
        if (!l) return false;
        if (l.participantId && String(l.participantId).trim().toUpperCase() === targetId) return false;
        return true;
      });
      await writeData("ge_gh_logs.json", filteredLogs);

      res.json({ success: true, message: `Participant ${targetId} and all associated trees and progress logs permanently deleted.` });
    } catch (e: any) {
      console.error("Cascade delete participant error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // 2. Trees
  app.get("/api/greenhero/trees", async (req, res) => {
    try {
      const data = await readData<any[]>("ge_gh_trees.json");
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/greenhero/trees", async (req, res) => {
    try {
      const trees = await readData<any[]>("ge_gh_trees.json");
      const rawPayload = req.body;
      const items = Array.isArray(rawPayload) ? rawPayload : [rawPayload];

      const addedTrees: any[] = [];
      let currentMaxId = trees.length > 0 ? Math.max(...trees.map(t => typeof t.id === 'number' ? t.id : parseInt(t.id, 10) || 0)) : 0;

      items.forEach(t => {
        if (!t) return;
        // Search if already exists on server
        const index = trees.findIndex(st => {
          if (st.id && t.id && String(st.id) === String(t.id)) return true;
          return (
            String(st.participantId || '').toUpperCase() === String(t.participantId || '').toUpperCase() &&
            String(st.treeName || '').toLowerCase() === String(t.treeName || '').toLowerCase() &&
            String(st.plantingDate || '') === String(t.plantingDate || '') &&
            Number(st.quantity || 1) === Number(t.quantity || 1) &&
            String(st.location || '').toLowerCase() === String(t.location || '').toLowerCase()
          );
        });

        if (index !== -1) {
          trees[index] = { ...trees[index], ...t };
          addedTrees.push(trees[index]);
        } else {
          let treeId = t.id;
          if (!treeId) {
            currentMaxId += 1;
            treeId = currentMaxId;
          }
          const newTree = {
            ...t,
            id: treeId,
            status: t.status || 'Approved'
          };
          trees.push(newTree);
          addedTrees.push(newTree);
        }
      });

      await writeData("ge_gh_trees.json", trees);

      if (Array.isArray(rawPayload)) {
        res.json({ success: true, trees: addedTrees });
      } else {
        res.json({ success: true, tree: addedTrees[0] || rawPayload });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/greenhero/trees/:id", async (req, res) => {
    try {
      const trees = await readData<any[]>("ge_gh_trees.json");
      const targetId = parseInt(req.params.id, 10);
      const index = trees.findIndex(t => t.id === targetId || String(t.id) === req.params.id);
      if (index !== -1) {
        trees[index] = { ...trees[index], ...req.body };
        await writeData("ge_gh_trees.json", trees);
        res.json({ success: true, tree: trees[index] });
      } else {
        res.status(404).json({ error: "Tree not found" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/greenhero/trees/:id", async (req, res) => {
    try {
      const trees = await readData<any[]>("ge_gh_trees.json");
      const paramId = String(req.params.id).trim();
      const targetId = parseInt(paramId, 10);
      const filtered = trees.filter(t => {
        if (t.id === paramId || String(t.id) === paramId) return false;
        if (!isNaN(targetId) && (t.id === targetId || Number(t.id) === targetId)) return false;
        return true;
      });
      await writeData("ge_gh_trees.json", filtered);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 3. Logs
  app.get("/api/greenhero/logs", async (req, res) => {
    try {
      const data = await readData<any[]>("ge_gh_logs.json");
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/greenhero/logs", async (req, res) => {
    try {
      const logs = await readData<any[]>("ge_gh_logs.json");
      const incoming = Array.isArray(req.body) ? req.body : [req.body];
      
      incoming.forEach(newLog => {
        if (!newLog) return;
        const targetIdStr = newLog.id ? String(newLog.id).trim().toUpperCase() : '';
        const existingIdx = logs.findIndex(l => {
          if (!l) return false;
          if (l.id && targetIdStr && String(l.id).trim().toUpperCase() === targetIdStr) return true;
          if (l.participantId && newLog.participantId && String(l.participantId).trim().toUpperCase() === String(newLog.participantId).trim().toUpperCase() && Number(l.month) === Number(newLog.month)) return true;
          return false;
        });

        if (existingIdx !== -1) {
          logs[existingIdx] = { ...logs[existingIdx], ...newLog };
        } else {
          if (!newLog.id) {
            const nextId = logs.length > 0 ? Math.max(...logs.map(l => typeof l.id === 'number' ? l.id : parseInt(l.id, 10) || 0)) + 1 : 1;
            newLog.id = nextId;
          }
          newLog.status = newLog.status || 'Pending';
          newLog.date = newLog.date || new Date().toISOString().split('T')[0];
          logs.unshift(newLog);
        }
      });

      await writeData("ge_gh_logs.json", logs);
      res.json({ success: true, logs });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.patch("/api/greenhero/logs/:id", async (req, res) => {
    try {
      const logs = await readData<any[]>("ge_gh_logs.json");
      const paramIdStr = String(req.params.id).trim().toUpperCase();
      const paramIdNum = parseInt(req.params.id, 10);
      const cleanNum = parseInt(paramIdStr.replace(/\D/g, ''), 10);

      let index = logs.findIndex(l => {
        if (!l) return false;
        const logIdStr = String(l.id).trim().toUpperCase();
        if (logIdStr === paramIdStr) return true;
        if (!isNaN(paramIdNum) && (l.id === paramIdNum || Number(l.id) === paramIdNum)) return true;
        if (!isNaN(cleanNum) && cleanNum > 0 && (Number(l.id) === cleanNum || String(l.id).includes(String(cleanNum)))) return true;
        if (req.body.participantId && String(l.participantId).trim().toUpperCase() === String(req.body.participantId).trim().toUpperCase() && Number(l.month) === Number(req.body.month)) return true;
        return false;
      });

      if (index !== -1) {
        logs[index] = { ...logs[index], ...req.body };
      } else {
        // Upsert if not found
        const newLog = { id: req.params.id, status: 'Pending', date: new Date().toISOString().split('T')[0], ...req.body };
        logs.unshift(newLog);
        index = 0;
      }

      await writeData("ge_gh_logs.json", logs);
      res.json({ success: true, log: logs[index] });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/greenhero/logs/:id", async (req, res) => {
    try {
      const logs = await readData<any[]>("ge_gh_logs.json");
      const paramIdStr = String(req.params.id).trim().toUpperCase();
      const paramIdNum = parseInt(req.params.id, 10);
      const cleanNum = parseInt(paramIdStr.replace(/\D/g, ''), 10);

      const filtered = logs.filter(l => {
        if (!l) return false;
        const logIdStr = String(l.id).trim().toUpperCase();
        if (logIdStr === paramIdStr) return false;
        if (!isNaN(paramIdNum) && (l.id === paramIdNum || Number(l.id) === paramIdNum)) return false;
        if (!isNaN(cleanNum) && cleanNum > 0 && Number(l.id) === cleanNum) return false;
        return true;
      });

      await writeData("ge_gh_logs.json", filtered);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // 4. Overview
  app.get("/api/greenhero/overview", async (req, res) => {
    try {
      const data = await readData<any>("ge_gh_overview.json");
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/greenhero/overview", async (req, res) => {
    try {
      await writeData("ge_gh_overview.json", req.body);
      res.json({ success: true, overview: req.body });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Donations API (Submissions)
  app.get("/api/donations", async (req, res) => {
    res.json(await readData("donations.json"));
  });

  app.post("/api/donations", async (req, res) => {
    const donations = await readData<any[]>("donations.json");
    const newDon = req.body;
    newDon.id = "don-" + Date.now();
    newDon.date = new Date().toISOString();
    newDon.status = newDon.status || "verified"; // Auto-verify or wait for transaction verification
    donations.unshift(newDon); // Newest first

    await writeData("donations.json", donations);
    res.json({ success: true, donation: newDon });
  });

  app.delete("/api/donations/:id", async (req, res) => {
    const donations = await readData<any[]>("donations.json");
    const filtered = donations.filter((d) => d.id !== req.params.id);
    await writeData("donations.json", filtered);
    res.json({ success: true });
  });

  app.patch("/api/donations/:id", async (req, res) => {
    const donations = await readData<any[]>("donations.json");
    const index = donations.findIndex((d) => d.id === req.params.id);
    if (index !== -1) {
      donations[index] = { ...donations[index], ...req.body };
      await writeData("donations.json", donations);
      res.json({ success: true, donation: donations[index] });
    } else {
      res.status(404).json({ error: "Donation not found" });
    }
  });

  // Subscribers API
  const extractCleanEmail = (input: any): string => {
    if (!input) return '';
    let curr = input;
    while (curr && typeof curr === 'object') {
      if (curr.email) curr = curr.email;
      else break;
    }
    return typeof curr === 'string' ? curr.trim() : '';
  };

  app.get("/api/subscribers", async (req, res) => {
    const raw = await readData<any[]>("subscribers.json");
    const rawList = Array.isArray(raw) ? raw : [];
    
    // Normalize and deduplicate all records
    const cleanedMap = new Map<string, { email: string; date: string }>();
    for (const item of rawList) {
      const email = extractCleanEmail(item);
      if (email && email.includes('@')) {
        const key = email.toLowerCase();
        if (!cleanedMap.has(key)) {
          let date = '';
          let curr = item;
          while (curr && typeof curr === 'object') {
            if (curr.date && (typeof curr.date === 'string' || typeof curr.date === 'number')) {
              date = String(curr.date);
            }
            curr = curr.email;
          }
          cleanedMap.set(key, { email, date: date || new Date().toISOString().split('T')[0] });
        }
      }
    }

    const cleanedList = Array.from(cleanedMap.values());
    if (cleanedList.length !== rawList.length || JSON.stringify(rawList).includes('"email":{')) {
      await writeData("subscribers.json", cleanedList);
    }

    res.json(cleanedList);
  });

  app.post("/api/subscribers", async (req, res) => {
    const rawSubs = await readData<any[]>("subscribers.json");
    const subscribers = Array.isArray(rawSubs) ? rawSubs : [];
    const email = extractCleanEmail(req.body?.email || req.body);

    if (email && email.includes('@')) {
      const exists = subscribers.some((s) => extractCleanEmail(s).toLowerCase() === email.toLowerCase());
      if (!exists) {
        subscribers.unshift({ email, date: new Date().toISOString().split('T')[0] });
        await writeData("subscribers.json", subscribers);
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/subscribers", async (req, res) => {
    const emailToDelete = extractCleanEmail(req.body?.email || req.body);
    const rawSubs = await readData<any[]>("subscribers.json");
    const subscribers = Array.isArray(rawSubs) ? rawSubs : [];
    if (emailToDelete) {
      const filtered = subscribers.filter((s) => extractCleanEmail(s).toLowerCase() !== emailToDelete.toLowerCase());
      await writeData("subscribers.json", filtered);
    }
    res.json({ success: true });
  });

  // Contacts API (Submissions)
  app.get("/api/contacts", async (req, res) => {
    res.json(await readData("contacts.json"));
  });

  app.post("/api/contacts", async (req, res) => {
    const contacts = await readData<any[]>("contacts.json");
    const newContact = req.body;
    newContact.id = "cont-" + Date.now();
    newContact.date = new Date().toISOString();
    contacts.unshift(newContact); // Newest first

    await writeData("contacts.json", contacts);
    res.json({ success: true, contact: newContact });
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    const contacts = await readData<any[]>("contacts.json");
    const filtered = contacts.filter((c) => c.id !== req.params.id);
    await writeData("contacts.json", filtered);
    res.json({ success: true });
  });

  // Testimonials API
  app.get("/api/testimonials", async (req, res) => {
    res.json(await readData("testimonials.json"));
  });

  app.post("/api/testimonials", async (req, res) => {
    const testimonials = await readData<any[]>("testimonials.json");
    const newTestimonial = req.body;
    if (!newTestimonial.id) {
      newTestimonial.id = "test-" + Date.now();
    }
    testimonials.push(newTestimonial);
    await writeData("testimonials.json", testimonials);
    res.json({ success: true, testimonial: newTestimonial });
  });

  app.put("/api/testimonials/:id", async (req, res) => {
    const testimonials = await readData<any[]>("testimonials.json");
    const updatedTestimonial = req.body;
    const index = testimonials.findIndex((t) => t.id === req.params.id);
    if (index !== -1) {
      testimonials[index] = { ...testimonials[index], ...updatedTestimonial };
      await writeData("testimonials.json", testimonials);
      res.json({ success: true, testimonial: testimonials[index] });
    } else {
      res.status(404).json({ success: false, error: "Testimonial not found" });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    const testimonials = await readData<any[]>("testimonials.json");
    const filtered = testimonials.filter((t) => t.id !== req.params.id);
    await writeData("testimonials.json", filtered);
    res.json({ success: true });
  });

  // Settings API
  app.get("/api/settings", async (req, res) => {
    res.json(await readData("settings.json"));
  });

  app.post("/api/settings", async (req, res) => {
    const current = await readData<any>("settings.json");
    const updated = { ...current, ...req.body };
    await writeData("settings.json", updated);
    res.json({ success: true, settings: updated });
  });

  // Milestones API
  app.get("/api/milestones", async (req, res) => {
    res.json(await readData("milestones.json"));
  });

  app.post("/api/milestones", async (req, res) => {
    const milestones = await readData<any[]>("milestones.json");
    const newMilestone = req.body;

    if (!newMilestone.id) {
      newMilestone.id = "mile-" + Date.now();
      milestones.push(newMilestone);
    } else {
      const idx = milestones.findIndex((m) => m.id === newMilestone.id);
      if (idx !== -1) {
        milestones[idx] = newMilestone;
      } else {
        milestones.push(newMilestone);
      }
    }

    await writeData("milestones.json", milestones);
    res.json({ success: true, milestone: newMilestone });
  });

  app.delete("/api/milestones/:id?", async (req, res) => {
    const id = req.params.id || req.query.id;
    if (!id) return res.status(400).json({ error: "Missing ID" });
    const milestones = await readData<any[]>("milestones.json");
    const filtered = milestones.filter((m) => m.id !== id);
    await writeData("milestones.json", filtered);
    res.json({ success: true });
  });

  // Core Values API
  app.get("/api/corevalues", async (req, res) => {
    res.json(await readData("corevalues.json"));
  });

  app.post("/api/corevalues", async (req, res) => {
    const corevalues = await readData<any[]>("corevalues.json");
    const newValue = req.body;

    if (!newValue.id) {
      newValue.id = "val-" + Date.now();
      corevalues.push(newValue);
    } else {
      const idx = corevalues.findIndex((v) => v.id === newValue.id);
      if (idx !== -1) {
        corevalues[idx] = newValue;
      } else {
        corevalues.push(newValue);
      }
    }

    await writeData("corevalues.json", corevalues);
    res.json({ success: true, coreValue: newValue });
  });

  app.delete("/api/corevalues/:id?", async (req, res) => {
    const id = req.params.id || req.query.id;
    if (!id) return res.status(400).json({ error: "Missing ID" });
    const corevalues = await readData<any[]>("corevalues.json");
    const filtered = corevalues.filter((v) => v.id !== id);
    await writeData("corevalues.json", filtered);
    res.json({ success: true });
  });

  // Focus Areas API
  app.get("/api/focusareas", async (req, res) => {
    res.json(await readData("focusareas.json"));
  });

  app.post("/api/focusareas", async (req, res) => {
    const focusareas = await readData<any[]>("focusareas.json");
    const newFocus = req.body;

    if (!newFocus.id) {
      newFocus.id = "focus-" + Date.now();
      focusareas.push(newFocus);
    } else {
      const idx = focusareas.findIndex((f) => f.id === newFocus.id);
      if (idx !== -1) {
        focusareas[idx] = newFocus;
      } else {
        focusareas.push(newFocus);
      }
    }

    await writeData("focusareas.json", focusareas);
    res.json({ success: true, focusArea: newFocus });
  });

  app.delete("/api/focusareas/:id?", async (req, res) => {
    const id = req.params.id || req.query.id;
    if (!id) return res.status(400).json({ error: "Missing ID" });
    const focusareas = await readData<any[]>("focusareas.json");
    const filtered = focusareas.filter((f) => f.id !== id);
    await writeData("focusareas.json", filtered);
    res.json({ success: true });
  });

  /* ==============================================
     VITE INTEGRATION & ROUTING FALLBACK
     ============================================== */

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
