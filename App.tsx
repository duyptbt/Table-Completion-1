import React, { useState, useEffect } from 'react';
import { ReadingPane } from './components/ReadingPane';
import { QuizPane } from './components/QuizPane';
import { READING_PASSAGE, QUIZ_DATA } from './constants';
import { UserAnswers, QuestionType, MatchingQuestion } from './types';
import { BookOpen, CheckSquare, RotateCcw, Clock } from 'lucide-react';

export default function App() {
  const [showResults, setShowResults] = useState(false);
  const TIME_LIMIT = 20 * 60; // 20 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [selectedHeadingId, setSelectedHeadingId] = useState<string | null>(null);

  const [answers, setAnswers] = useState<UserAnswers>({
    matching: {},
    table: {},
    tf: {}
  });

  const matchingQuestion = QUIZ_DATA.find(q => q.type === QuestionType.MATCHING) as MatchingQuestion;

  useEffect(() => {
    if (showResults) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResults(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleAssignHeading = (
    targetSectionId: string, 
    headingId: string | null, 
    sourceSectionId?: string
  ) => {
    setAnswers(prev => {
      const nextMatching = { ...prev.matching };

      if (!headingId) {
        delete nextMatching[targetSectionId];
        return { ...prev, matching: nextMatching };
      }

      const previousHeadingInTarget = nextMatching[targetSectionId];

      // Check if headingId was assigned to another section
      let prevOwnerSection = sourceSectionId;
      if (!prevOwnerSection) {
        for (const [sec, hId] of Object.entries(nextMatching)) {
          if (hId === headingId && sec !== targetSectionId) {
            prevOwnerSection = sec;
            break;
          }
        }
      }

      if (prevOwnerSection && prevOwnerSection !== targetSectionId) {
        if (previousHeadingInTarget) {
          // Swap headings between the two sections
          nextMatching[prevOwnerSection] = previousHeadingInTarget;
        } else {
          // Unassign from old section
          delete nextMatching[prevOwnerSection];
        }
      }

      nextMatching[targetSectionId] = headingId;
      return { ...prev, matching: nextMatching };
    });

    setSelectedHeadingId(null);
  };

  const calculateScore = () => {
    let score = 0;
    let total = 0;

    QUIZ_DATA.forEach(q => {
      if (q.type === QuestionType.MATCHING) {
        q.items.forEach(item => {
          total++;
          if (q.correctMapping[item.id] === answers.matching[item.id]) score++;
        });
      } else if (q.type === QuestionType.TABLE_COMPLETION) {
        q.rows.forEach(row => {
          if (row.answerKey && row.correctAnswer) {
            total++;
            const userAns = (answers.table[row.answerKey] || '').toLowerCase().trim();
            if (row.correctAnswer.some(ans => ans.toLowerCase() === userAns)) score++;
          }
        });
      } else if (q.type === QuestionType.TRUE_FALSE) {
        q.items.forEach(item => {
          total++;
          if (item.correctAnswer === answers.tf[item.id]) score++;
        });
      }
    });
    return { score, total };
  };

  const handleFinish = () => {
    setShowResults(true);
    setSelectedHeadingId(null);
  };

  const handleReset = () => {
    setShowResults(false);
    setAnswers({ matching: {}, table: {}, tf: {} });
    setSelectedHeadingId(null);
    setTimeLeft(TIME_LIMIT);
  };

  const { score, total } = calculateScore();

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
            <BookOpen size={22} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">Reading Practice</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">IELTS Academic Style • Drag & Drop</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border transition-colors duration-300 ${
          timeLeft < 60 && !showResults
            ? 'bg-red-50 border-red-200 text-red-600' 
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <Clock size={18} className={timeLeft < 60 && !showResults ? 'animate-pulse' : ''} />
          <span className="font-mono text-lg sm:text-xl font-bold">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Content Split View */}
      <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left Pane: Reading Passage with Section Drop Zones */}
        <section className="flex-1 overflow-hidden border-b md:border-b-0 md:border-r border-slate-200 relative">
          <ReadingPane 
            sections={READING_PASSAGE}
            matchingQuestion={matchingQuestion}
            matchingAnswers={answers.matching}
            onAssignHeading={handleAssignHeading}
            selectedHeadingId={selectedHeadingId}
            onSelectHeading={setSelectedHeadingId}
            showResults={showResults}
          />
        </section>

        {/* Right Pane: Quiz Panel with Draggable Headings & Questions */}
        <section className="flex-1 overflow-hidden bg-slate-50 relative">
          <QuizPane 
            questions={QUIZ_DATA} 
            answers={answers} 
            setAnswers={setAnswers}
            showResults={showResults}
            selectedHeadingId={selectedHeadingId}
            onSelectHeading={setSelectedHeadingId}
            onAssignHeading={handleAssignHeading}
          />
        </section>
      </main>

      {/* Footer Actions */}
      <footer className="flex-none bg-white border-t border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sm:justify-end z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {showResults ? (
           <div className="flex items-center gap-6 w-full justify-between sm:w-auto sm:justify-end">
             <div className="text-right flex items-center gap-3">
               <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase">Điểm số</p>
               <p className="text-xl sm:text-2xl font-bold text-blue-600">{score} <span className="text-slate-400 text-base sm:text-lg">/ {total}</span></p>
             </div>
             <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
             >
               <RotateCcw size={18} />
               Làm lại
             </button>
           </div>
        ) : (
          <button 
            onClick={handleFinish}
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-all transform hover:scale-105 text-sm sm:text-base cursor-pointer"
          >
            <CheckSquare size={18} />
            Nộp bài
          </button>
        )}
      </footer>
    </div>
  );
}
