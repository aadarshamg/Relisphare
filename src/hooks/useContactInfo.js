
import { useData } from '@/contexts/DataContext';

export function useContactInfo() {
  const { settings } = useData();
  
  return { 
    contactInfo: settings || {}, 
    loading: !settings, 
    error: null 
  };
}
