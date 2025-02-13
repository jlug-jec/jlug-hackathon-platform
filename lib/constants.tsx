import { PaymentForm } from "../components/registration/PaymentForm";
import { TeamForm } from "../components/registration/TeamForm";
import { Wifi, Lightbulb, Users, Layout, Coffee, Gift } from "lucide-react"

const initialData = {
    teamName: "",
    teamLeader: { name: "", email: "" },
    teamMembers: [{ name: "", email: "" }],
    paymentScreenshot: null,
  };
  
  const registrationSteps = [
    {
      id: "team",
      label: "Team Information",
      component: TeamForm,
    },
    {
      id: "payment",
      label: "Payment Verification",
      component: PaymentForm,
    },
  ];

  

  const faqItems = [
    {
      question: "What is CodeKumbh?",
      answer:
        "CodeKumbh is an exciting 24-hour-long hackathon exclusively for JEC students, where participants collaborate to develop innovative solutions to real-world challenges.",
    },
    {
      question: "Who can participate?",
      answer:
        "CodeKumbh is open only to students of JEC. Participants must be passionate about coding, teamwork, and innovation.",
    },
    {
      question: "Do I need to have a team?",
      answer: "Yes, participation is only allowed in teams of 4 to 5 members, with a minimum of 1 female member.",
    },
    {
      question: "What should I bring?",
      answer:
        "Bring your laptop, charger, and any other necessary development tools. A comfortable hacking space will be provided.",
    },
    {
      question: "Will food and refreshments be provided?",
      answer:
        "Yes, food and refreshments will be available during the event. However, additional charges may apply for certain meals.",
    },
  ]

 const facilities = [
    { icon: <Wifi className="w-6 h-6 sm:w-8 sm:h-8" />, title: "High-speed Wi-Fi", desc: "Uninterrupted coding experience" },
    { icon: <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Mentorship", desc: "Support from industry experts" },
    { icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Networking", desc: "Connect with peers and mentors" },
    { icon: <Layout className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Workspaces", desc: "Comfortable areas for teamwork" },
    { icon: <Coffee className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Refreshments", desc: "Keep energized throughout" },
    { icon: <Gift className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Prizes", desc: "Exciting rewards for winners" },
  ]

  const perks = [
    { title: "Learn from industry experts", desc: "Get guidance from seasoned professionals" },
    { title: "Build your portfolio", desc: "Create impressive projects to showcase" },
    { title: "Win exciting prizes", desc: "Compete for valuable rewards" },
    { title: "Network with peers", desc: "Connect with talented developers" },
    { title: "Enhance problem-solving", desc: "Tackle real-world challenges" },
    { title: "Gain experience", desc: "Apply your skills in practical scenarios" },
  ]

  const MainRegistrationSteps=[
    { title: "Form a Team", description: "Gather 4 to 5 members and finalize your team." },
    {
      title: "Fill Out the Registration Form",
      description: "Complete the official registration form with your team details. Form is open from 14th Feb to 19th Feb.",
    },
    {
      title: "Confirmation",
      description: "Once submitted, you'll receive a confirmation email with further instructions.",
    },
  ]
export {
    initialData,
    registrationSteps,
    faqItems,
    facilities,
    perks,
    MainRegistrationSteps
}

