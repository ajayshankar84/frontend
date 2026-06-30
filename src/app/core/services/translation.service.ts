import { Injectable, signal, computed } from '@angular/core';

type LangCode = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'ur';

const translations: Record<string, Record<string, string>> = {
  en: {
    'objective.title': 'Objective Exam',
    'objective.subtitle': 'Test your knowledge with multiple choice questions',
    'objective.topic_label': 'Topic',
    'objective.topic_placeholder': 'e.g., Angular, React, Python',
    'objective.questions_label': 'Number of Questions',
    'objective.questions_10': '10 Questions',
    'objective.questions_20': '20 Questions',
    'objective.questions_30': '30 Questions',
    'objective.start_exam': 'Start Exam',
    'objective.generating': 'Generating...',
    'objective.header': 'Objective Exam - {topic}',
    'objective.progress': 'Question {current} / {total}',
    'objective.previous': 'Previous',
    'objective.next': 'Next',
    'objective.submit_exam': 'Submit Exam',
    'objective.grading': 'Grading...',
    'objective.complete_title': 'Exam Complete!',
    'objective.correct_count': '{correct} / {total} correct',
    'objective.score_pct': '{score}%',
    'objective.take_another': 'Take Another Exam',
    'objective.your_answer': 'Your answer: {answer}',
    'objective.correct_answer': 'Correct: {answer}',
    'objective.not_answered': 'Not answered',
    'subjective.title': 'Subjective Exam',
    'subjective.subtitle': 'Write detailed answers and get AI-graded feedback',
    'subjective.topic_label': 'Topic',
    'subjective.topic_placeholder': 'e.g., System Design, Algorithms',
    'subjective.questions_label': 'Number of Questions',
    'subjective.questions_5': '5 Questions',
    'subjective.questions_10': '10 Questions',
    'subjective.questions_15': '15 Questions',
    'subjective.start_exam': 'Start Exam',
    'subjective.generating': 'Generating...',
    'subjective.header': 'Subjective Exam - {topic}',
    'subjective.progress': 'Question {current} / {total}',
    'subjective.your_answer_label': 'Your Answer',
    'subjective.answer_placeholder': 'Write your detailed answer here...',
    'subjective.previous': 'Previous',
    'subjective.next': 'Next',
    'subjective.submit_exam': 'Submit Exam',
    'subjective.grading': 'Grading...',
    'subjective.complete_title': 'Exam Complete!',
    'subjective.points': '{score} / {max} points',
    'subjective.score': 'Score: {score}/10',
    'subjective.feedback': 'Feedback: {text}',
    'subjective.take_another': 'Take Another Exam',
  },
  hi: {
    'objective.title': 'वस्तुनिष्ठ परीक्षा',
    'objective.subtitle': 'बहुविकल्पीय प्रश्नों के साथ अपने ज्ञान का परीक्षण करें',
    'objective.topic_label': 'विषय',
    'objective.topic_placeholder': 'जैसे, Angular, React, Python',
    'objective.questions_label': 'प्रश्नों की संख्या',
    'objective.questions_10': '10 प्रश्न',
    'objective.questions_20': '20 प्रश्न',
    'objective.questions_30': '30 प्रश्न',
    'objective.start_exam': 'परीक्षा शुरू करें',
    'objective.generating': 'तैयार हो रहा है...',
    'objective.header': 'वस्तुनिष्ठ परीक्षा - {topic}',
    'objective.progress': 'प्रश्न {current} / {total}',
    'objective.previous': 'पिछला',
    'objective.next': 'अगला',
    'objective.submit_exam': 'परीक्षा सबमिट करें',
    'objective.grading': 'मूल्यांकन हो रहा है...',
    'objective.complete_title': 'परीक्षा पूर्ण!',
    'objective.correct_count': '{correct} / {total} सही',
    'objective.score_pct': '{score}%',
    'objective.take_another': 'दूसरी परीक्षा दें',
    'objective.your_answer': 'आपका उत्तर: {answer}',
    'objective.correct_answer': 'सही उत्तर: {answer}',
    'objective.not_answered': 'उत्तर नहीं दिया',
    'subjective.title': 'वर्णनात्मक परीक्षा',
    'subjective.subtitle': 'विस्तृत उत्तर लिखें और AI-मूल्यांकित प्रतिक्रिया प्राप्त करें',
    'subjective.topic_label': 'विषय',
    'subjective.topic_placeholder': 'जैसे, System Design, Algorithms',
    'subjective.questions_label': 'प्रश्नों की संख्या',
    'subjective.questions_5': '5 प्रश्न',
    'subjective.questions_10': '10 प्रश्न',
    'subjective.questions_15': '15 प्रश्न',
    'subjective.start_exam': 'परीक्षा शुरू करें',
    'subjective.generating': 'तैयार हो रहा है...',
    'subjective.header': 'वर्णनात्मक परीक्षा - {topic}',
    'subjective.progress': 'प्रश्न {current} / {total}',
    'subjective.your_answer_label': 'आपका उत्तर',
    'subjective.answer_placeholder': 'यहाँ अपना विस्तृत उत्तर लिखें...',
    'subjective.previous': 'पिछला',
    'subjective.next': 'अगला',
    'subjective.submit_exam': 'परीक्षा सबमिट करें',
    'subjective.grading': 'मूल्यांकन हो रहा है...',
    'subjective.complete_title': 'परीक्षा पूर्ण!',
    'subjective.points': '{score} / {max} अंक',
    'subjective.score': 'स्कोर: {score}/10',
    'subjective.feedback': 'प्रतिक्रिया: {text}',
    'subjective.take_another': 'दूसरी परीक्षा दें',
  },
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly currentLang = signal<LangCode>(
    (localStorage.getItem('preferredLanguage') as LangCode) || 'en'
  );

  readonly data = computed(() => {
    const lang = this.currentLang();
    return translations[lang] || translations['en'];
  });

  t(key: string, params?: Record<string, string | number>): string {
    const lang = this.currentLang();
    let text = translations[lang]?.[key] || translations['en']?.[key] || key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  }

  setLanguage(code: string): void {
    this.currentLang.set(code as LangCode);
    localStorage.setItem('preferredLanguage', code);
  }
}
