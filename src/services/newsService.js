import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Calculates realistic timestamps for "Whole Day" news
const getPastTime = (hoursAgo) => new Date(Date.now() - hoursAgo * 3600000).toISOString();

const FULL_DAY_NEWS = [
  {
    id: "hist-1",
    title: "10 Indians Rescued, One Missing After Commercial Vessel Attacked Off Oman Coast",
    source: "The Hindu",
    category: "operations",
    timestamp: getPastTime(1),
    originalUrl: "https://www.thehindu.com",
    summary: "Naval forces successfully rescued 10 Indian crew members following an attack on their vessel near the Oman coast. Search and rescue operations remain active for one missing sailor as regional maritime security teams investigate the origin of the strike."
  },
  {
    id: "hist-2",
    title: "Prime Minister Modi Arrives in Auckland for Final Leg of Three-Nation Tour",
    source: "India Today",
    category: "operations",
    timestamp: getPastTime(2),
    originalUrl: "https://www.indiatoday.in",
    summary: "PM Narendra Modi has landed in New Zealand to conclude his three-nation diplomatic tour, following his visits to Indonesia and Australia. He was received by Prime Minister Christopher Luxon, with discussions expected to focus on bilateral trade and the Indian diaspora."
  },
  {
    id: "hist-3",
    title: "Global Markets React as China Announces Temporary Export Ban on Helium",
    source: "Economic Times",
    category: "technology",
    timestamp: getPastTime(4),
    originalUrl: "https://economictimes.indiatimes.com",
    summary: "China has implemented an immediate temporary export ban on helium, a critical gas for semiconductor manufacturing. The move raises concerns over potential global supply chain disruptions for chipmakers and the AI hardware industry."
  },
  {
    id: "hist-4",
    title: "US Central Command Completes Third Round of Strikes on 140 Targets in Iran",
    source: "WION",
    category: "operations",
    timestamp: getPastTime(5),
    originalUrl: "https://www.wionews.com",
    summary: "The U.S. military has concluded its third wave of precision strikes against roughly 140 strategic targets across Iran. The operation primarily focused on degrading missile launch sites, drone facilities, and critical communication infrastructure."
  },
  {
    id: "hist-5",
    title: "World Population Day 2026: UN Highlights Impact of Demographic Shifts",
    source: "Firstpost",
    category: "technology",
    timestamp: getPastTime(7),
    originalUrl: "https://www.firstpost.com",
    summary: "Marking World Population Day, the United Nations has released new data emphasizing how changing birth rates, aging societies, and rapid urbanization are shaping global economies. Policymakers are urging a focus on sustainable resource management and healthcare infrastructure."
  },
  {
    id: "hist-6",
    title: "African Economic Conference 2026 Concludes With Unprecedented Commitments",
    source: "Times Now",
    category: "awards",
    timestamp: getPastTime(10),
    originalUrl: "https://www.timesnownews.com",
    summary: "The three-day African Economic Conference wrapped up with strong pledges from the AfDB, UNDP, and OECD to build continental resilience. Leaders established concrete frameworks to protect African institutions against ongoing global economic volatility."
  },
  {
    id: "hist-7",
    title: "IRGC Targets US Bases in Jordan and Qatar in Swift Retaliation",
    source: "WION",
    category: "operations",
    timestamp: getPastTime(12),
    originalUrl: "https://www.wionews.com",
    summary: "Iran's Islamic Revolution Guard Corps (IRGC) announced it has launched retaliatory strikes against U.S. military positions in Jordan, Qatar, and Oman. The escalation follows heavy American bombardment of southern Iranian provinces earlier in the day."
  },
  {
    id: "hist-8",
    title: "Union Health Ministry Amends Drug Rules Over High Alcohol Content",
    source: "The Hindu",
    category: "technology",
    timestamp: getPastTime(15),
    originalUrl: "https://www.thehindu.com",
    summary: "The Indian government has removed licensing exemptions for medicinal formulations containing ethyl alcohol to prevent widespread misuse. Regulatory oversight will now strictly monitor products like aromatic tinctures under the revised Drugs Rules."
  },
  {
    id: "hist-9",
    title: "Tragidy in Pune: Nine Dead Following Massive Garbage Depot Collapse",
    source: "India Today",
    category: "operations",
    timestamp: getPastTime(18),
    originalUrl: "https://www.indiatoday.in",
    summary: "Rescue operations are underway in Pune's Moshi area after a catastrophic garbage depot collapse claimed nine lives. Emergency response teams are working through the debris as local authorities launch a full investigation into the structural failure."
  },
  {
    id: "hist-10",
    title: "India Lays Out Tariffs for UK Vehicles Ahead of CETA Implementation",
    source: "Economic Times",
    category: "technology",
    timestamp: getPastTime(22),
    originalUrl: "https://economictimes.indiatimes.com",
    summary: "The Indian government has finalized the quota and tariff structures for automobile imports from the United Kingdom. These regulations will officially take effect on July 15 when the Comprehensive Economic and Trade Agreement (CETA) becomes active."
  }
];

// Raw breaking news that Gemini will summarize in real-time
const RAW_REALTIME_POOL = [
  {
    title: "Strait of Hormuz Southern Route Remains Open to Two-Way Traffic, JMIC Confirms",
    source: "Firstpost",
    category: "operations",
    originalUrl: "https://www.firstpost.com"
  },
  {
    title: "Tech Giant Google Appeals Delhi High Court Order on AdWords Trademark Case",
    source: "Times Now",
    category: "technology",
    originalUrl: "https://www.timesnownews.com"
  },
  {
    title: "Climate Activist Sonam Wangchuk Enters Day 13 of Indefinite Fast",
    source: "The Hindu",
    category: "awards",
    originalUrl: "https://www.thehindu.com"
  },
  {
    title: "Ukraine President Proposes Major Government Reshuffle, Prime Minister Replacement Expected",
    source: "WION",
    category: "operations",
    originalUrl: "https://www.wionews.com"
  }
];

export const getInitialNews = () => [...FULL_DAY_NEWS];

async function generateGeminiSummary(title, category) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an expert news analyst. Write a concise, professional, 2-sentence summary for a breaking news headline. 
    Headline: "${title}"
    Category: ${category}.
    Do not use introductory phrases, just output the facts.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Summary unavailable due to network traffic.";
  }
}

export const subscribeToLiveNews = (onNewArticle) => {
  let index = 0;
  
  const processNextArticle = async () => {
    if (index < RAW_REALTIME_POOL.length) {
      const rawArticle = RAW_REALTIME_POOL[index];
      const aiSummary = await generateGeminiSummary(rawArticle.title, rawArticle.category);
      
      const newArticle = {
        ...rawArticle,
        id: `rt-${Date.now()}-${index}`,
        timestamp: new Date().toISOString(),
        summary: aiSummary
      };
      
      onNewArticle(newArticle);
      index++;
    } else {
      clearInterval(interval);
    }
  };

  const interval = setInterval(processNextArticle, 20000); 
  return () => clearInterval(interval);
};