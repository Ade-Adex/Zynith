// /app/store/quizStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface QuizResult {
  score: number
  passed: boolean
}

interface QuizState {
  selectedAnswers: Record<string, string>
  quizResult: QuizResult | null
  quizSubmitted: boolean
  setAnswer: (questionId: string, option: string) => void
  setSelectedAnswers: (answers: Record<string, string>) => void 
  setQuizResult: (result: QuizResult | null) => void
  setQuizSubmitted: (submitted: boolean) => void 
  resetQuizState: () => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      selectedAnswers: {},
      quizResult: null,
      quizSubmitted: false, // Added
      setAnswer: (questionId, option) =>
        set((state) => ({
          selectedAnswers: { ...state.selectedAnswers, [questionId]: option },
        })),
      setSelectedAnswers: (answers) => set({ selectedAnswers: answers }), // Added
      setQuizResult: (result) => set({ quizResult: result }),
      setQuizSubmitted: (submitted) => set({ quizSubmitted: submitted }), // Added
      resetQuizState: () =>
        set({ selectedAnswers: {}, quizResult: null, quizSubmitted: false }), // Updated
    }),
    {
      name: 'quiz-storage',
    },
  ),
)
