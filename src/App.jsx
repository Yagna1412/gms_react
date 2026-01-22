import { ServiceAdvisorProvider } from "./component/context/Serviceadvisorcontext";
import ServiceAdvisorDashboard from "./component/ServiceAdvisorDashboard"

export default function App() {
  return (
    <ServiceAdvisorProvider>
      <ServiceAdvisorDashboard />
    </ServiceAdvisorProvider>
  );
}
