import { Check } from "lucide-react";

const prizes = [
  {
    title: "First Place",
    rewards: [
      "Cash prize of $1,000",
      "Exclusive trophy",
      "Certificate of Excellence",
      "Premium Swag Kit",
    ],
  },
  {
    title: "Second Place",
    rewards: [
      "Cash prize of $500",
      "Certificate of Achievement",
      "Deluxe Swag Kit",
    ],
  },
  {
    title: "Special Mentions",
    rewards: [
      "Certificate of Appreciation",
      "Event Swag Kit",
      "Recognition on Website and Social Media",
    ],
  },
];

export default function Prizes() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Prizes</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {prizes.map((prize, index) => (
            <div
              key={index}
              className="border-2 border-black rounded-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <h3 className="text-2xl font-bold mb-4">{prize.title}</h3>
              <ul className="space-y-2 mb-8">
                {prize.rewards.map((reward, rewardIndex) => (
                  <li key={rewardIndex} className="flex items-center">
                    <Check size={20} className="mr-2 text-green-600" />
                    <span>{reward}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

