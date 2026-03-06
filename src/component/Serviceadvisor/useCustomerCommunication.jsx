import { toast } from 'sonner';
import { useServiceAdvisor } from './useServiceAdvisor';

export function useCustomerCommunication() {
  const { jobCards } = useServiceAdvisor();
  const recentJobCards = jobCards.slice(0, 5);

  const handleSendMessage = (channel, jobCard) => {
    toast.success(`Message sent via ${channel} for ${jobCard.id}`);
  };

  return {
    recentJobCards,
    handleSendMessage
  };
}
