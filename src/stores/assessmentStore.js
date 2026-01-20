import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Assessment Store using Zustand
 * Manages assessment data and state
 */
export const useAssessmentStore = create(
  persist(
    (set, get) => ({
      // State
      assessmentId: null,
      modelId: null,
      modelTitle: null,
      modelDescription: null,
      pillarData: [], // Array of pillar objects from API
      pillarQuestionsMap: {}, // { [pillarId]: { pillar_id, question_data, ... } } from GET /assessment/questions/:pillar_id
      isLoading: false,
      error: null,
      
      // Actions
      setAssessmentData: (data) => {
        set({
          assessmentId: data.assessment_id,
          modelId: data.model_id,
          modelTitle: data.model_title,
          modelDescription: data.model_description,
          pillarData: data.pillar_data || [],
          pillarQuestionsMap: {}, // clear when starting new assessment
        });
      },
      
      setPillarQuestions: (pillarId, data) => {
        set((state) => ({
          pillarQuestionsMap: { ...state.pillarQuestionsMap, [pillarId]: data },
        }));
      },
      
      setAssessmentResults: (data) => {
        set({ assessmentResults: data });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      setError: (error) => {
        set({ error });
      },
      
      // Clear assessment data
      clearAssessment: () => {
        set({
          assessmentId: null,
          modelId: null,
          modelTitle: null,
          modelDescription: null,
          pillarData: [],
          pillarQuestionsMap: {},
          assessmentResults: null,
          error: null,
        });
      },
      
      // Helper: Get pillar by index
      getPillarByIndex: (index) => {
        const { pillarData } = get();
        return pillarData[index] || null;
      },
      
      // Helper: Get pillar by ID
      getPillarById: (pillarId) => {
        const { pillarData } = get();
        return pillarData.find(p => p.pillar_id === pillarId) || null;
      },
    }),
    {
      name: 'assessment-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        assessmentId: state.assessmentId,
        modelId: state.modelId,
        modelTitle: state.modelTitle,
        modelDescription: state.modelDescription,
        pillarData: state.pillarData,
        pillarQuestionsMap: state.pillarQuestionsMap,
        assessmentResults: state.assessmentResults,
      }),
    }
  )
);
