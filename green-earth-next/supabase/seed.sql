-- Realistic Environmental Seed Data for Green Earth (Bangladesh)

-- Seed Site Settings (Key-Value Content)
INSERT INTO site_settings (key, value, description) VALUES
('org_name', 'Green Earth', 'Organization name'),
('tagline_en', 'Cleaner, Greener & Sustainable Future', 'Tagline in English'),
('tagline_bn', 'পরিচ্ছন্ন, সবুজ ও টেকসই ভবিষ্যৎ', 'Tagline in Bangla'),
('contact_phone', '+880 1712-345678', 'Official phone number'),
('contact_email', 'info@greenearth-bd.org', 'Official email address'),
('contact_address', '42, Road 11, Banani, Dhaka-1213, Bangladesh.', 'Office address'),
('facebook_url', 'https://www.facebook.com/greenearthbd.25/', 'Facebook page link'),
('stat_planted_saplings', '25,000+', 'Number of planted saplings'),
('stat_schools_powered', '15', 'Number of solar powered schools'),
('stat_clean_water_users', '8,000+', 'Number of residents receiving clean water'),
('stat_active_volunteers', '1,200+', 'Number of active volunteers across Bangladesh'),
('admin_username', 'admin', 'Default dashboard username'),
('admin_password', 'greenearth2026', 'Default dashboard password (for local/manual checks if needed)');


-- Seed Projects
INSERT INTO projects (title, title_bn, slug, category, location, location_bn, status, description, description_bn, impact_summary, impact_summary_bn, cover_image_url, gallery_image_urls) VALUES
(
  'Sundarbans Coastal Mangrove Reforestation',
  'সুন্দরবন উপকূলীয় ম্যানগ্রোভ বনায়ন',
  'sundarbans-mangrove-reforestation',
  'tree_plantation',
  'Satkhira, Sundarbans Region',
  'সাতক্ষীরা, সুন্দরবন অঞ্চল',
  'ongoing',
  'The Sundarbans, the world''s largest mangrove forest, acts as Bangladesh''s natural shield against devastating cyclones. However, deforestation and rising salinity have degraded this barrier. Our Mangrove Reforestation initiative engages Satkhira''s local coastal communities—particularly women and traditional honey collectors (Mawalis)—to nursery-grow and plant native Keora, Gewa, and Sundari saplings. This project not only helps store massive amounts of carbon but also revives the natural habitats of endangered local wildlife while offering sustainable livelihood opportunities for local guardians.',
  'বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবন বাংলাদেশের জন্য ভয়াবহ ঘূর্ণিঝড়ের বিরুদ্ধে প্রাকৃতিক ঢাল হিসেবে কাজ করে। তবে বন উজাড় ও ক্রমবর্ধমান লবণাক্ততা এই প্রাকৃতিক ঢালটিকে ক্ষতিগ্রস্ত করেছে। আমাদের ম্যানগ্রোভ বনায়ন উদ্যোগ সাতক্ষীরার স্থানীয় উপকূলীয় জনগোষ্ঠীকে—বিশেষ করে নারী এবং ঐতিহ্যবাহী মৌয়ালদের—দেশীয় কেওড়া, গেওয়া এবং সুন্দরী চারা নার্সারিতে তৈরি ও রোপণে যুক্ত করে। এই প্রকল্পটি কেবল কার্বন জমা করতেই সাহায্য করছে না, বরং স্থানীয় বন্যপ্রাণীর প্রাকৃতিক আবাসস্থল পুনরুদ্ধার করছে এবং স্থানীয় অভিভাবকদের জন্য টেকসই জীবিকার সুযোগ সৃষ্টি করছে।',
  '25,000+ Saplings Planted & Monitored',
  '২৫,০০০+ চারা রোপণ ও পর্যবেক্ষণ করা হয়েছে',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588880331179-bc9b93a8c5d8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80'
  ]
),
(
  'Solar Electrification for Off-Grid Schools',
  'অফ-গ্রিড বিদ্যালয়ে সৌর বিদ্যুতায়ন',
  'solar-electrification-char-schools',
  'renewable_energy',
  'Kurigram Char Lands',
  'কুড়িগ্রামের চর অঞ্চল',
  'completed',
  'In northern Bangladesh''s river island churs, electricity grids are non-existent, leaving classrooms dark and shutting students out of modern learning tools. Green Earth has successfully engineered and installed custom solar micro-grids on 15 schools. Each school is now equipped with bright, energy-efficient LED lights, wall fans, and low-power smart tablets. The project has doubled daily school attendance, reduced heat stress during hot summer months, and allowed schools to host community-led night literacy classes for adults, brightening whole village futures.',
  'বাংলাদেশের উত্তরাঞ্চলের চরাঞ্চলগুলোতে কোনো বিদ্যুৎ গ্রিড নেই, যার ফলে ক্লাসরুমগুলো অন্ধকারে থাকত এবং শিক্ষার্থীরা আধুনিক শিক্ষার সুযোগ থেকে বঞ্চিত হতো। গ্রিন আর্থ সফলভাবে ১৫টি বিদ্যালয়ে কাস্টম সৌর মাইক্রো-গ্রিড স্থাপন করেছে। প্রতিটি বিদ্যালয় এখন উজ্জ্বল এলইডি লাইট, দেয়াল ফ্যান এবং স্বল্প-শক্তির স্মার্ট ট্যাবলেটে সজ্জিত। এই প্রকল্পটি দৈনিক শিক্ষার্থীদের উপস্থিতি দ্বিগুণ করেছে, গ্রীষ্মকালে গরমের কষ্ট কমিয়েছে এবং বিদ্যালয়গুলোতে বয়স্কদের জন্য রাতে সাক্ষরতা ক্লাস আয়োজনের সুযোগ করে দিয়েছে, যা পুরো গ্রামের ভবিষ্যৎ উজ্জ্বল করছে।',
  '15 Primary Schools Fully Powered',
  '১৫টি প্রাথমিক বিদ্যালয় সম্পূর্ণ সৌরশক্তিতে চালিত',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80'
  ]
),
(
  'Safe Drinking Water Solutions & Arsenic Mitigation',
  'নিরাপদ খাবার পানি ও আর্সেনিকমুক্তকরণ প্রকল্প',
  'safe-water-arsenic-mitigation',
  'water_sanitation',
  'Chandpur District',
  'চাঁদপুর জেলা',
  'ongoing',
  'Arsenic toxicity in groundwater remains one of Bangladesh''s most silent yet deadliest ecological crises. Chandpur has experienced high levels of contaminated water, causing chronic skin diseases and organ failures. Green Earth is working tirelessly to deploy deep-aquifer tube wells (drilled past 300 meters to reach arsenic-free pure water layers) and gravity-fed filtration columns. Alongside, we build rainwater harvesting structures for household rain catchments. Every installation is community-managed, with transparent water testing records posted publicly to guarantee continuous safety.',
  'ভূগর্ভস্থ পানিতে আর্সেনিকের বিষাক্ততা বাংলাদেশের সবচেয়ে নীরব অথচ মারাত্মক পরিবেশগত সংকটগুলোর একটি। চাঁদপুর জেলায় আর্সেনিক দূষণের মাত্রা অত্যন্ত বেশি, যার কারণে চর্মরোগ এবং অঙ্গহানি ঘটে। গ্রিন আর্থ গভীর নলকূপ (আর্সেনিকমুক্ত বিশুদ্ধ পানি পেতে ৩০০ মিটারের বেশি গভীর) এবং গ্র্যাভিটি ফিল্টার স্থাপন করতে নিরলসভাবে কাজ করছে। পাশাপাশি আমরা বাসাবাড়ির জন্য বৃষ্টির পানি সংগ্রহের কাঠামো তৈরি করছি। প্রতিটি ইনস্টলেশন স্থানীয়দের দ্বারা পরিচালিত হয় এবং পানির গুণগত মানের রেকর্ড জনসমক্ষে প্রকাশ করা হয়।',
  '8,000+ Residents Served Pure Safe Water',
  '৮,০০০+ অধিবাসীকে বিশুদ্ধ নিরাপদ পানি সরবরাহ',
  'https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=1200&auto=format&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80'
  ]
),
(
  'Clean River & Canal Drive: Reclaiming Buriganga',
  'নদী ও খাল পরিচ্ছন্নতা অভিযান: বুড়িগঙ্গা উদ্ধার',
  'clean-river-drive-buriganga',
  'waste_management',
  'Dhaka (Sadarghat & Kamrangirchar)',
  'ঢাকা (সদরঘাট ও কামরাঙ্গীরচর)',
  'ongoing',
  'Dhaka''s lifeline rivers, notably the Buriganga, have suffered immensely from industrial dumping and household solid plastic waste accumulation. Green Earth organizes bi-weekly waste collection drives utilizing customized water barriers, nets, and manual cleanup squads formed of university students and local youth. We extract tons of floating polythene, bottles, and discarded plastics, routing them to certified recycling plants. Our goal is to combined cleanup action with severe policy advocacy for plastic-free cities.',
  'ঢাকার প্রাণ বুড়িগঙ্গা নদী শিল্প বর্জ্য এবং গৃহস্থালি শক্ত প্লাস্টিক জমার কারণে মারাত্মকভাবে ক্ষতিগ্রস্ত হয়েছে। গ্রিন আর্থ বিশ্ববিদ্যালয়ের শিক্ষার্থী ও স্থানীয় তরুণদের নিয়ে গঠিত কাস্টমাইজড ওয়াটার ব্যারিয়ার, জাল এবং ম্যানুয়াল পরিচ্ছন্নতা স্কোয়াড ব্যবহার করে পাক্ষিক বর্জ্য সংগ্রহ অভিযান পরিচালনা করে। আমরা টন টন ভাসমান পলিথিন, বোতল এবং পরিত্যক্ত প্লাস্টিক অপসারণ করি এবং প্রত্যয়িত পুনর্ব্যবহারযোগ্য উদ্ভিদে প্রেরণ করি। আমাদের লক্ষ্য প্লাস্টিকমুক্ত শহরগুলোর জন্য কঠিন নীতি নির্ধারণের সাথে পরিচ্ছন্নতা অভিযানের সমন্বয় করা।',
  '12+ Tons of Floating Plastics Extracted',
  '১২+ টন ভাসমান প্লাস্টিক অপসারণ করা হয়েছে',
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&auto=format&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=80'
  ]
);


-- Seed Blog Posts
INSERT INTO blog_posts (title, title_bn, slug, category, category_bn, excerpt, excerpt_bn, content, content_bn, cover_image_url) VALUES
(
  'Mangroves: Our Strongest Natural Shield Against Cyclones',
  'ম্যানগ্রোভ: ঘূর্ণিঝড়ের বিরুদ্ধে আমাদের সবচেয়ে শক্তিশালী प्राकृतिक ঢাল',
  'mangroves-strongest-natural-shield',
  'Ecology',
  'পরিবেশবিদ্যা',
  'Analyzing how the root structures of coastal mangrove trees protect the shoreline from devastating floods, saving thousands of lives and homes in Bangladesh.',
  'ম্যানগ্রোভ গাছের জটিল মূল কাঠামো কীভাবে উপকূলরেখাকে জলোচ্ছ্বাস থেকে রক্ষা করে এবং বাংলাদেশে হাজার হাজার জীবন বাঁচায় তা বিশ্লেষণ।',
  'Bangladesh is on the frontlines of global climate change. Every year, powerful tropical storms brew in the Bay of Bengal and roll onto our vulnerable coastlines. But there lies a natural, highly efficient engineering solution at the mouth of the delta—the Sundarbans Mangrove forest. The intricate, interlocking root structures of mangrove trees like Sundari and Keora function as solid energy dissipators. They absorb the massive physical energy of incoming tidal waves, reducing wind velocities and mitigating high surge depths. Our reforestation projects in Satkhira and Dacope are actively restoring these shields. Working side-by-side with local residents, we are not just planting trees—we are building live coastal walls.',
  'বাংলাদেশ বৈশ্বিক জলবায়ু পরিবর্তনের অগ্রভাগে রয়েছে। প্রতি বছর বঙ্গোপসাগরে শক্তিশালী ক্রান্তীয় ঝড় তৈরি হয় এবং আমাদের উপকূলীয় অঞ্চলে আঘাত হানে। কিন্তু এই বদ্বীপে রয়েছে সুন্দরবনের ম্যানগ্রোভ বনের মতো একটি প্রাকৃতিক ও অত্যন্ত কার্যকর ইঞ্জিনিয়ারিং সমাধান। সুন্দরী ও কেওড়া গাছের জটিল মূল কাঠামো জলোচ্ছ্বাসের গতি কমিয়ে দেয় এবং তরঙ্গের উচ্চতা হ্রাস করে। সাতক্ষীরা ও দাকোপে আমাদের বনায়ন প্রকল্পগুলো এই প্রাকৃতিক ঢালগুলোকে পুনরুদ্ধার করছে। স্থানীয়দের সাথে কাঁধে কাঁধ মিলিয়ে আমরা কেবল গাছ রোপণ করছি না—আমরা জীবন্ত প্রাচীর তৈরি করছি।',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80'
),
(
  'How Char Islands are Embracing Clean Solar Micro-Grids',
  'চরাঞ্চল যেভাবে সৌর মাইক্রো-গ্রিড গ্রহণ করছে',
  'char-islands-solar-microgrids',
  'Energy',
  'জ্বালানি',
  'A deep look into how off-grid solar electricity is transforming education, health, and night literacy in Kurigram''s isolated river islands.',
  'কুড়িগ্রামের বিচ্ছিন্ন চরাঞ্চলগুলোতে অফ-গ্রিড সৌর বিদ্যুৎ কীভাবে শিক্ষা, স্বাস্থ্য এবং নৈশ শিক্ষা পরিবর্তন করছে তার গভীর বিশ্লেষণ।',
  'Char islands are dynamically shifting masses of sand in the middle of Bangladesh''s giant rivers. Constantly eroding and re-forming, they are physically cut off from the main electricity grid. Until recently, when night fell, education stopped completely. Families burned costly and hazardous kerosene lamps for light, inhaling toxic smoke. Green Earth''s solar initiative replaced this with clean, stable solar microgrids. In 15 primary schools, bright LED lightbulbs now hang under tin roofs, and smart tablets are charged cleanly. Adult night literacy groups are flourishing, and critical vaccine cooling fridges run without interruption. Clean energy isn''t just lighting bulbs; it''s lifting communities out of darkness.',
  'চরাঞ্চলগুলো বাংলাদেশের বিশাল নদীগুলোর মধ্যে বালির গতিশীল দ্বীপ। এগুলো সর্বদা নদীভাঙন ও পুনর্গঠনের মধ্য দিয়ে যায় এবং গ্রিডের বিদ্যুৎ থেকে বিচ্ছিন্ন। কিছুদিন আগেও রাত নামলেই শিক্ষা পুরোপুরি বন্ধ হয়ে যেত। পরিবারগুলো কেরোসিনের বাতি জ্বালাত, যা বিষাক্ত ধোঁয়ার সৃষ্টি করত। গ্রিন আর্থের সৌর উদ্যোগ এটিকে পরিচ্ছন্ন, স্থিতিশীল সোলার মাইক্রো-গ্রিডে রূপান্তর করেছে। ১৫টি প্রাথমিক বিদ্যালয়ের টিনের চালের নিচে এখন জ্বলছে এলইডি বাল্ব এবং স্মার্ট ট্যাবলেট চার্জ করা হচ্ছে। বয়স্কদের নৈশ সাক্ষরতা ক্লাস চালু হয়েছে এবং প্রতিষেধক সংরক্ষণের ফ্রিজ চলছে কোনো বাধা ছাড়াই। পরিচ্ছন্ন জ্বালানি কেবল বাতি জ্বালাচ্ছে না; এটি পুরো সমাজকে অন্ধকার থেকে আলোয় আনছে।',
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80'
),
(
  'Simple Household Guide to Reduce Plastic Waste in Dhaka',
  'ঢাকা শহরে প্লাস্টিক বর্জ্য হ্রাসের সহজ গৃহস্থালি নির্দেশিকা',
  'household-guide-reduce-plastic-dhaka',
  'Waste Management',
  'বর্জ্য ব্যবস্থাপনা',
  'Practical and actionable steps to reduce single-use plastic, manage home recycling, and keep Bangladesh''s streets and canals clean.',
  'একবার ব্যবহারযোগ্য প্লাস্টিক হ্রাস, বাসাবাড়ির রিসাইক্লিং ব্যবস্থাপনা এবং ঢাকা শহরের রাস্তা ও খাল পরিষ্কার রাখার ব্যবহারিক পদক্ষেপ।',
  'Dhaka produces over 600 metric tons of plastic waste every single day, much of which clogs our vital storm drainage systems and ends up in the Buriganga river, poisoning water and fish. While systemic solutions are critical, behavioral shifts at home make a profound difference. First, separate wet food scraps from dry plastics. Clean and bag dry plastics separately so informal recycling collectors (Tokais) can easily gather them safely. Second, swap single-use grocery bags for reusable organic jute bags—Bengal''s golden fiber is the ultimate eco-friendly alternative! Small daily actions create massive cumulative wave of positive environmental change across the capital.',
  'ঢাকা শহরে প্রতিদিন ৬০০ মেট্রিক টনেরও বেশি প্লাস্টিক বর্জ্য তৈরি হয়, যার বেশিরভাগই আমাদের নিষ্কাশন ড্রেন আটকে দেয় এবং বুড়িগঙ্গা নদীতে পড়ে পানি ও মাছকে বিষাক্ত করে। যদিও পদ্ধতিগত সমাধান জরুরি, বাসাবাড়িতে আচরণের পরিবর্তন অনেক বড় ভূমিকা রাখে। প্রথমত, ভেজা খাবারের অংশ শুকনো প্লাস্টিক থেকে আলাদা করুন। শুকনো প্লাস্টিকগুলো পরিষ্কার করে আলাদা ব্যাগে রাখুন যাতে রিসাইকেল করা সহজ হয়। দ্বিতীয়ত, প্লাস্টিকের ব্যাগের বদলে পাটের ব্যাগ ব্যবহার করুন—বাংলার সোনালী আঁশই সেরা পরিবেশবান্ধব বিকল্প! ছোট ছোট দৈনন্দিন পদক্ষেপ রাজধানীর পরিবেশে বিশাল ইতিবাচক পরিবর্তন আনতে পারে।',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80'
);


-- Seed Team Members
INSERT INTO team_members (name, name_bn, role, role_bn, photo_url, bio, bio_bn, display_order) VALUES
(
  'Dr. Anisur Rahman',
  'ড. আনিসুর রহমান',
  'Founder & Executive Director',
  'প্রতিষ্ঠাতা ও নির্বাহী পরিচালক',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'Ph.D. in Environmental Science from Dhaka University. Deeply passionate about coastal mangrove restoration, ecosystem survival, and sustainable community climate resilience across Bangladesh.',
  'ঢাকা বিশ্ববিদ্যালয় থেকে পরিবেশ বিজ্ঞানে পিএইচডি। উপকূলীয় ম্যানগ্রোভ পুনরুদ্ধার এবং বাংলাদেশে টেকসই জলবায়ু কার্যক্রম সম্পর্কে অত্যন্ত উত্সাহী।',
  1
),
(
  'Sumaiya Chowdhury',
  'সুরাইয়া চৌধুরী',
  'Lead Climate Engineer & Hydrologist',
  'প্রধান জলবায়ু প্রকৌশলী ও জলবিদ',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'Specialist in groundwater mapping, solar irrigation, and pumping grids. Keeps remote filtration units and water tube wells clean and running.',
  'ভূগর্ভস্থ পানি ম্যাপিং এবং সৌর পাম্পিং গ্রিডের বিশেষজ্ঞ। প্রত্যন্ত অঞ্চলের ফিল্টার এবং নলকূপ সচল রাখতে কাজ করেন।',
  2
),
(
  'Faisal Ahmed Tanvir',
  'ফয়সাল আহমেদ তানভীর',
  'Director of Community Engagement',
  'স্থানীয় অংশীদারিত্ব বিষয়ক পরিচালক',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'An activist working on grassroots environmental campaigns. Unites schools, village elders, and youth student groups for green action drives.',
  'তৃণমূল অভিযানের একজন কর্মী। পরিবেশবান্ধব কার্যক্রমের জন্য বিদ্যালয়, গ্রামের মুরুব্বি ও ছাত্রদলকে একত্রিত করেন।',
  3
),
(
  'Farhana Akter Lila',
  'ফারহানা আক্তার লিলা',
  'Chief Conservation Biologist',
  'প্রধান জীববৈচিত্র্য বিজ্ঞানী',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'Researches biodiversity in the Sundarbans. Develops native species planting guidelines, and conducts continuous tests on river ecological health.',
  'সুন্দরবনের জীববৈচিত্র্য নিয়ে গবেষণা করেন। দেশীয় গাছ রোপণের গাইডলাইন তৈরি করেন এবং নদীর পরিবেশগত স্বাস্থ্য পরীক্ষা করেন।',
  4
);


-- Seed Gallery Items
INSERT INTO gallery_items (title, title_bn, event_name, event_name_bn, image_url, media_type) VALUES
(
  'Coastal Mangrove Plantation Satkhira',
  'উপকূলীয় ম্যানগ্রোভ রোপণ, সাতক্ষীরা',
  'Mangrove Drive 2025',
  'ম্যানগ্রোভ অভিযান ২০২৫',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
  'image'
),
(
  'Solar Panel System on Char Primary School',
  'চরাঞ্চল প্রাথমিক বিদ্যালয়ে সৌরবিদ্যুৎ সিস্টেম',
  'Off-Grid School Electrification',
  'অফ-গ্রিড বিদ্যালয় বিদ্যুৎ প্রকল্প',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80',
  'image'
),
(
  'Deep Tube Well Installation',
  'গভীর নলকূপ স্থাপন কার্যক্রম',
  'Pure Water Chandpur',
  'চাঁদপুর বিশুদ্ধ পানি প্ল্যান্ট',
  'https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?w=800&auto=format&fit=crop&q=80',
  'image'
),
(
  'Youth Environment Training Workshop',
  'তরুণ পরিবেশ সচেতনতা কর্মশালা',
  'Green Leadership Training',
  'সবুজ নেতৃত্ব কর্মশালা',
  'https://images.unsplash.com/photo-1544531516-a5e857b2a590?w=800&auto=format&fit=crop&q=80',
  'image'
),
(
  'Community Tree Sapling Nursery',
  'স্থানীয় চারাগাছ নার্সারি',
  'Community Saplings Nursery',
  'কমিউনিটি নার্সারি ২০২৫',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop&q=80',
  'image'
),
(
  'Clean Buriganga River Campaign',
  'বুড়িগঙ্গা নদী পরিচ্ছন্নতা অভিযান',
  'Buriganga Cleaning Drive',
  'বুড়িগঙ্গা পরিচ্ছন্নতা অভিযান',
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=80',
  'image'
);


-- Seed Initial Volunteers List
INSERT INTO volunteers (name, email, phone, area_of_interest, message, status) VALUES
('Abir Hasan', 'abir.hasan@gmail.com', '01711223344', 'tree_plantation', 'I want to plant trees in Sundarbans and protect our coastal borders.', 'active'),
('Sadia Rahman', 'sadia.rahman@gmail.com', '01822334455', 'waste_management', 'Intrigued by the Buriganga cleanup campaigns. Let''s make Dhaka green!', 'new');


-- Seed Initial Donations List
INSERT INTO donations (donor_name, email, amount, method, status, transaction_id) VALUES
('Naimur Rahman', 'naimur@example.com', 1000.00, 'bkash', 'confirmed', 'BKX92841AD'),
('Fariha Alam', 'fariha.alam@example.com', 5000.00, 'nagad', 'confirmed', 'NGD8239401');


-- Seed Initial Newsletter Subscribers
INSERT INTO newsletter_subscribers (email) VALUES
('green_activist@gmail.com'),
('conservation_student@du.ac.bd'),
('sustainable_living@outlook.com');


-- Seed Initial Contact Submissions
INSERT INTO contact_messages (name, email, subject, message) VALUES
('Zamil Uddin', 'zamil@example.com', 'CSR opportunity', 'We are interested in sponsoring a solar panel installation for a char school. Please get back to us.');
