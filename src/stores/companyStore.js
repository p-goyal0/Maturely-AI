import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Company Store using Zustand
 * Manages company-related state (type, headcount, revenue, etc.)
 */
export const useCompanyStore = create(
  persist(
    (set, get) => ({
      // State
      companyType: null, // 'public' or 'private'
      isListed: false,
      stockTicker: '',
      totalHeadcountRange: '',
      marketCapRange: '',
      annualRevenueRange: '',
      
      // Actions
      setCompanyType: (type) => {
        set({ 
          companyType: type,
          // Reset listed status and ticker if switching to private
          ...(type === 'private' ? { isListed: false, stockTicker: '' } : {})
        });
      },
      
      setIsListed: (isListed) => {
        set({ 
          isListed,
          // Reset ticker if unlisted
          ...(isListed ? {} : { stockTicker: '' })
        });
      },
      
      setStockTicker: (ticker) => {
        set({ stockTicker: ticker });
      },
      
      setTotalHeadcountRange: (range) => {
        set({ totalHeadcountRange: range });
      },
      
      setMarketCapRange: (range) => {
        set({ marketCapRange: range });
      },
      
      setAnnualRevenueRange: (range) => {
        set({ annualRevenueRange: range });
      },
      
      // Clear all company data
      clearCompanyData: () => {
        set({
          companyType: null,
          isListed: false,
          stockTicker: '',
          totalHeadcountRange: '',
          marketCapRange: '',
          annualRevenueRange: '',
        });
      },
      
      // Helper: Check if can continue from company type page
      canContinueFromTypePage: () => {
        const { companyType, isListed, stockTicker } = get();
        if (!companyType) return false;
        if (companyType === 'private') return true;
        // For public, either not listed or has ticker
        return !isListed || stockTicker.trim() !== '';
      },
      
      // Helper: Check if can continue from company info page
      canContinueFromInfoPage: () => {
        const { totalHeadcountRange } = get();
        return totalHeadcountRange !== '';
      },
    }),
    {
      name: 'company-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        companyType: state.companyType,
        isListed: state.isListed,
        stockTicker: state.stockTicker,
        totalHeadcountRange: state.totalHeadcountRange,
        marketCapRange: state.marketCapRange,
        annualRevenueRange: state.annualRevenueRange,
      }),
    }
  )
);


