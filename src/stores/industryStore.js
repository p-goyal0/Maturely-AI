import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { updateOnboardingDetails } from '../utils/onboardingStorage';

/**
 * Industry Store using Zustand
 * Manages selected industry and sub-industry state
 */
export const useIndustryStore = create(
  persist(
    (set, get) => ({
      // State
      selectedIndustry: null, // { id, name, description }
      selectedSubIndustry: null, // string
      industries: [], // List of all industries from API
      subIndustries: {}, // Map of industry id to sub-industries array
      isLoading: false,
      error: null,
      
      // Actions
      setSelectedIndustry: (industry) => {
        set({
          selectedIndustry: industry,
          selectedSubIndustry: null, // Reset sub-industry when industry changes
        });
        
        // Update sessionStorage
        if (industry) {
          updateOnboardingDetails({
            industry: industry.name || industry,
            sub_industry: null, // Reset sub-industry when industry changes
          });
        }
      },
      
      setSelectedSubIndustry: (subIndustry) => {
        set({
          selectedSubIndustry: subIndustry,
        });
        
        // Update sessionStorage
        const { selectedIndustry } = get();
        if (subIndustry && selectedIndustry) {
          updateOnboardingDetails({
            industry: selectedIndustry.name || selectedIndustry,
            sub_industry: subIndustry,
          });
        }
      },
      
      setIndustries: (industries) => {
        set({ industries });
      },
      
      setSubIndustries: (subIndustries) => {
        set({ subIndustries });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      setError: (error) => {
        set({ error });
      },
      
      // Clear all selections
      clearSelection: () => {
        set({
          selectedIndustry: null,
          selectedSubIndustry: null,
        });
      },
      
      // Helper: Get available sub-industries for selected industry
      getAvailableSubIndustries: () => {
        const { selectedIndustry, subIndustries } = get();
        if (!selectedIndustry || selectedIndustry.id === 'other') {
          return [];
        }
        return subIndustries[selectedIndustry.id] || [];
      },
      
      // Helper: Check if sub-industry is required
      requiresSubIndustry: () => {
        const { selectedIndustry, subIndustries } = get();
        if (!selectedIndustry || selectedIndustry.id === 'other') {
          return false;
        }
        return subIndustries[selectedIndustry.id] && subIndustries[selectedIndustry.id].length > 0;
      },
      
      // Helper: Check if can continue (industry selected and sub-industry if required)
      canContinue: () => {
        const { selectedIndustry, selectedSubIndustry, subIndustries } = get();
        if (!selectedIndustry) return false;
        
        if (selectedIndustry.id === 'other') {
          return true; // "Other" doesn't require sub-industry
        }
        
        const requiresSub = subIndustries[selectedIndustry.id] && subIndustries[selectedIndustry.id].length > 0;
        return !requiresSub || selectedSubIndustry;
      },
    }),
    {
      name: 'industry-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedIndustry: state.selectedIndustry,
        selectedSubIndustry: state.selectedSubIndustry,
        industries: state.industries,
        subIndustries: state.subIndustries,
      }),
    }
  )
);


