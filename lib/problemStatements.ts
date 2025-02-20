export type ProblemStatement = {
  id: string;
  problem: string;
  solution: string;
  impact: string;
  optionalFeatures: string[];
};

export const problemStatements: ProblemStatement[] = [
  {
    id: "budget-travel",
    problem: "Rahul, a final-year college student, has always dreamed of traveling across India before starting his first job. However, his limited budget makes planning difficult, as he struggles to balance transportation, accommodation, food, and sightseeing costs. He spends hours browsing different websites to compare prices but still finds it challenging to create an affordable itinerary.",
    solution: "One day, Rahul discovers a travel platform that allows him to plan his trip within his budget. He inputs his destination, preferred travel dates, and maximum spending limit. Within seconds, the system generates a detailed itinerary optimized for cost efficiency. The platform compares flights, trains, and buses to find the cheapest travel option, suggests affordable yet comfortable hostels, and even estimates meal costs based on local food prices. The system also provides real-time deals and discount offers. Rahul is thrilled as he now has a well-structured, budget-friendly travel plan that ensures a fulfilling experience without financial strain.",
    impact: "With confidence, he embarks on his adventure, knowing he won't overspend. Throughout his journey, he uses the app to adjust his itinerary and take advantage of new deals. Thanks to this smart travel planner, Rahul turns his dream trip into reality without breaking the bank.",
    optionalFeatures: [
      "Local Transport Cost Estimator – Suggests the most affordable local transport options like metro, buses, or shared taxis",
      "Customizable Itinerary – Allows users to modify plans based on personal preferences and schedule changes",
      "Group Travel Budget Splitter – Helps friends and family split costs while traveling together",
      "Offline Mode – Stores essential travel details for use without an internet connection",
      "Travel Insurance Recommendation – Suggests affordable insurance plans based on trip duration and activities"
    ]
  },
  {
    id: "smart-ticketing",
    problem: "Priya is a consultant who frequently travels between cities for work. She often finds herself standing in long queues at ticket counters, wasting valuable time. On some occasions, she has encountered fraudulent tickets, leading to stressful situations at transport hubs. Additionally, unpredictable passenger traffic means she sometimes struggles to find last-minute tickets for urgent trips.",
    solution: "Her experience changes when she starts using an advanced ticketing system. With a few clicks, she books her ticket online, which is generated as a QR code on her phone. At the station, she simply scans her digital ticket at an automated checkpoint, which securely records her details and grants her instant entry.",
    impact: "Meanwhile, transport authorities use smart data analysis to study passenger trends and optimize resources. The system detects peak travel times, forecasts ticket demand, and dynamically adjusts pricing and scheduling. This helps reduce overcrowding and ensures smoother operations. Priya also benefits from real-time updates on available seats and future travel predictions.\n\nOn one of her journeys, she receives an alert about an upcoming price surge due to festival season. Thanks to predictive insights, she books her tickets early at a lower price, saving both time and money. With a seamless ticketing process and enhanced security, Priya enjoys stress-free travel like never before.",
    optionalFeatures: [
      "Multi-Modal Ticketing – Supports a single ticket for different modes of transport (bus, train, metro)",
      "Smart Seat Allocation – Automatically assigns seats based on preferences like window seats or extra legroom",
      "Integrated Loyalty Program – Rewards frequent travelers with discounts and perks",
      "Voice Command Booking – Allows users to book tickets using voice assistants",
      "Emergency Rebooking – Suggests and books alternate routes in case of cancellations or delays"
    ]
  },
  {
    id: "fair-ride",
    problem: "Amit, a software engineer, commutes daily using ride-hailing services. However, he often faces issues with unfair pricing—some drivers charge arbitrary fares, while others take longer routes to increase the fare. During peak hours, surge pricing leads to unexpectedly high costs. On the other hand, drivers also struggle with fluctuating fuel prices and demand uncertainty.",
    solution: "Frustrated, Amit starts using a GPS-based fare system, which ensures fair and transparent pricing. As soon as he books a ride, the system starts tracking the journey using GPS. The fare is dynamically calculated based on the exact distance traveled, duration, and real-time traffic conditions.",
    impact: "One evening, Amit is stuck in heavy traffic, but instead of being overcharged, the system applies a smart fare adjustment that considers both congestion and actual travel distance. The app also provides a breakdown of his fare, ensuring complete transparency. Meanwhile, drivers benefit from a pricing model that adapts to demand and fuel costs, ensuring fair earnings.\n\nAt the end of his ride, Amit receives a QR-coded e-receipt, which he can store for future reference. With a newfound sense of confidence in fare transparency, Amit now commutes without worrying about being overcharged or unfairly charged due to unpredictable road conditions.",
    optionalFeatures: [
      "Fare Estimator Before Booking – Allows users to see an estimated fare before confirming a ride",
      "Peak Hour Alerts – Notifies users of upcoming high-demand periods to avoid surge pricing",
      "AI-Powered Route Optimization – Suggests the fastest and most cost-efficient route",
      "Ride History Analytics – Provides insights into spending patterns and cost-saving tips",
      "Driver Earnings Transparency – Shows drivers how fares are calculated, promoting fairness"
    ]
  },
  {
    id: "travel-safety",
    problem: "Sanya, an avid solo traveler from Kolkata, is exploring a remote region in Southeast Asia. While she enjoys discovering new places, safety remains a major concern, as she is unfamiliar with local crime rates, weather conditions, and political situations. She usually relies on social media and news reports for updates, but information is often delayed or inaccurate.",
    solution: "One day, as she is about to visit a famous market, her phone buzzes with a real-time safety alert. The intelligent system has detected a sudden spike in negative social media sentiment about the area—there are reports of protests and petty crime. The system cross-verifies this with government alerts and issues a high-risk warning, advising her to take an alternate route.",
    impact: "The system also provides her with safe zones, nearby emergency contacts, and alternative tourist spots. Relieved, Sanya changes her plan and avoids a potentially dangerous situation. Later, she reports her experience in the app, contributing to the system's user-driven safety database.\n\nOver time, the system learns from user reports and predicts high-risk areas before incidents occur. Thanks to this smart safety assistant, Sanya—and countless other travelers—can explore the world with greater confidence and security, knowing they have a real-time travel guardian keeping them safe.",
    optionalFeatures: [
      "Personalized Safety Alerts – Customizes alerts based on traveler preferences (e.g., solo female traveler, senior citizen)",
      "SOS Button with Location Sharing – Sends emergency distress signals with real-time location",
      "Community-Driven Safety Ratings – Allows travelers to rate areas based on their experiences",
      "Weather and Disaster Alerts – Notifies users about storms, floods, or other natural disasters",
      "Nighttime Safety Guide – Provides safe routes and well-lit pathways for late-night travelers"
    ]
  },
  {
    id: "open-innovation",
    problem: "The travel and transportation industry is vast and constantly evolving. While we've outlined several specific challenges, we recognize that innovators like you might have identified unique problems that deserve attention. Perhaps you've observed a gap in the market, experienced a personal travel-related challenge, or envisioned a revolutionary solution that could transform how people travel.",
    solution: "This is your opportunity to showcase your original idea. Your solution should address a clear problem in the travel/transportation sector, demonstrate innovation, and have the potential for real-world impact. You have the freedom to define both the problem and solution, as long as they align with the hackathon's travel theme.",
    impact: "Successful open innovation projects could range from addressing local transportation challenges to revolutionizing international travel experiences. Your solution might focus on accessibility, sustainability, efficiency, or any other aspect of travel that you believe needs improvement. The key is to demonstrate how your innovation could make a meaningful difference in people's travel experiences.",
    optionalFeatures: [
      "Clear Problem Definition – Clearly articulate the specific travel-related challenge you're addressing",
      "Market Research – Demonstrate the relevance and scope of the problem",
      "Innovative Approach – Show how your solution differs from existing alternatives",
      "Feasibility Analysis – Explain how your solution can be implemented practically",
      "Impact Assessment – Describe the potential benefits and reach of your solution"
    ]
  }
];