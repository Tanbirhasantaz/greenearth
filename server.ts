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
    settings: path.join(DATA_DIR, "settings.json")
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
      phone: "+880 1712-345678",
      email: "info@greenearth-bd.org",
      address: "42, Road 11, Banani, Dhaka-1213, Bangladesh."
    };
    fs.writeFileSync(filePaths.settings, JSON.stringify(initialSettings, null, 2));
  }
}

// Ensure database files are set up properly
initializeDataFiles();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "15mb" }));

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

  if (supabase) {
    console.log("Supabase storage is configured server-side. Uploads will be written to:", supabaseBucket);
  } else {
    console.log("Using local filesystem for uploads (fallback).");
  }

  // Helper file paths
  const getFilePath = (filename: string) => path.join(DATA_DIR, filename);

  // Helper read/write methods
  const readData = <T>(filename: string): T => {
    const raw = fs.readFileSync(getFilePath(filename), "utf-8");
    return JSON.parse(raw) as T;
  };

  const writeData = <T>(filename: string, data: T): void => {
    fs.writeFileSync(getFilePath(filename), JSON.stringify(data, null, 2), "utf-8");
  };

  /* ==============================================
     API ROUTES (JSON CRUD)
     ============================================== */

  // Auth: Simple Admin Login validation
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    const settings = readData<{ username: string; password: string }>("settings.json");

    if (username === settings.username && password === settings.password) {
      res.json({ success: true, token: "green-earth-admin-token-2026" });
    } else {
      res.status(401).json({ success: false, error: "Invalid username or password" });
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

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from(supabaseBucket)
          .getPublicUrl(uniqueFilename);

        return res.json({ success: true, url: urlData.publicUrl });
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
  app.get("/api/projects", (req, res) => {
    res.json(readData("projects.json"));
  });

  app.post("/api/projects", (req, res) => {
    const projects = readData<any[]>("projects.json");
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

    writeData("projects.json", projects);
    res.json({ success: true, project: newProject });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const projects = readData<any[]>("projects.json");
    const filtered = projects.filter((p) => p.id !== req.params.id);
    writeData("projects.json", filtered);
    res.json({ success: true });
  });

  // Blogs API
  app.get("/api/blogs", (req, res) => {
    res.json(readData("blogs.json"));
  });

  app.post("/api/blogs", (req, res) => {
    const blogs = readData<any[]>("blogs.json");
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

    writeData("blogs.json", blogs);
    res.json({ success: true, blog: newBlog });
  });

  app.delete("/api/blogs/:id", (req, res) => {
    const blogs = readData<any[]>("blogs.json");
    const filtered = blogs.filter((b) => b.id !== req.params.id);
    writeData("blogs.json", filtered);
    res.json({ success: true });
  });

  // Team API
  app.get("/api/team", (req, res) => {
    res.json(readData("team.json"));
  });

  app.post("/api/team", (req, res) => {
    const team = readData<any[]>("team.json");
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

    writeData("team.json", team);
    res.json({ success: true, teamMember: newMember });
  });

  app.delete("/api/team/:id", (req, res) => {
    const team = readData<any[]>("team.json");
    const filtered = team.filter((t) => t.id !== req.params.id);
    writeData("team.json", filtered);
    res.json({ success: true });
  });

  // Gallery API
  app.get("/api/gallery", (req, res) => {
    res.json(readData("gallery.json"));
  });

  app.post("/api/gallery", (req, res) => {
    const gallery = readData<any[]>("gallery.json");
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

    writeData("gallery.json", gallery);
    res.json({ success: true, galleryItem: newItem });
  });

  app.delete("/api/gallery/:id", (req, res) => {
    const gallery = readData<any[]>("gallery.json");
    const filtered = gallery.filter((g) => g.id !== req.params.id);
    writeData("gallery.json", filtered);
    res.json({ success: true });
  });

  // Volunteers API (Submissions)
  app.get("/api/volunteers", (req, res) => {
    res.json(readData("volunteers.json"));
  });

  app.post("/api/volunteers", (req, res) => {
    const volunteers = readData<any[]>("volunteers.json");
    const newVol = req.body;
    newVol.id = "vol-" + Date.now();
    newVol.date = new Date().toISOString();
    volunteers.unshift(newVol); // Newest first

    writeData("volunteers.json", volunteers);
    res.json({ success: true, volunteer: newVol });
  });

  app.delete("/api/volunteers/:id", (req, res) => {
    const volunteers = readData<any[]>("volunteers.json");
    const filtered = volunteers.filter((v) => v.id !== req.params.id);
    writeData("volunteers.json", filtered);
    res.json({ success: true });
  });

  // Donations API (Submissions)
  app.get("/api/donations", (req, res) => {
    res.json(readData("donations.json"));
  });

  app.post("/api/donations", (req, res) => {
    const donations = readData<any[]>("donations.json");
    const newDon = req.body;
    newDon.id = "don-" + Date.now();
    newDon.date = new Date().toISOString();
    newDon.status = newDon.status || "verified"; // Auto-verify or wait for transaction verification
    donations.unshift(newDon); // Newest first

    writeData("donations.json", donations);
    res.json({ success: true, donation: newDon });
  });

  app.delete("/api/donations/:id", (req, res) => {
    const donations = readData<any[]>("donations.json");
    const filtered = donations.filter((d) => d.id !== req.params.id);
    writeData("donations.json", filtered);
    res.json({ success: true });
  });

  // Subscribers API
  app.get("/api/subscribers", (req, res) => {
    res.json(readData("subscribers.json"));
  });

  app.post("/api/subscribers", (req, res) => {
    const subscribers = readData<string[]>("subscribers.json");
    const { email } = req.body;

    if (email && !subscribers.includes(email)) {
      subscribers.unshift(email);
      writeData("subscribers.json", subscribers);
    }
    res.json({ success: true });
  });

  app.delete("/api/subscribers", (req, res) => {
    const { email } = req.body;
    const subscribers = readData<string[]>("subscribers.json");
    const filtered = subscribers.filter((e) => e !== email);
    writeData("subscribers.json", filtered);
    res.json({ success: true });
  });

  // Contacts API (Submissions)
  app.get("/api/contacts", (req, res) => {
    res.json(readData("contacts.json"));
  });

  app.post("/api/contacts", (req, res) => {
    const contacts = readData<any[]>("contacts.json");
    const newContact = req.body;
    newContact.id = "cont-" + Date.now();
    newContact.date = new Date().toISOString();
    contacts.unshift(newContact); // Newest first

    writeData("contacts.json", contacts);
    res.json({ success: true, contact: newContact });
  });

  app.delete("/api/contacts/:id", (req, res) => {
    const contacts = readData<any[]>("contacts.json");
    const filtered = contacts.filter((c) => c.id !== req.params.id);
    writeData("contacts.json", filtered);
    res.json({ success: true });
  });

  // Settings API
  app.get("/api/settings", (req, res) => {
    res.json(readData("settings.json"));
  });

  app.post("/api/settings", (req, res) => {
    const current = readData<any>("settings.json");
    const updated = { ...current, ...req.body };
    writeData("settings.json", updated);
    res.json({ success: true, settings: updated });
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
