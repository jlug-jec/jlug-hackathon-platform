import { PaymentForm } from "../components/registration/PaymentForm";
import { TeamForm } from "../components/registration/TeamForm";

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

  
export {
    initialData,
    registrationSteps
}