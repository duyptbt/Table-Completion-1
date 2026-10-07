import React, { useState } from 'react';
import { Question, QuestionType, UserAnswers, MatchingQuestion } from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  GripVertical, 
  X, 
  Sparkles, 
  CornerDownLeft, 
  ArrowRight, 
  Check,
  ChevronDown
} from 'lucide-react';

interface QuizPaneProps {
  questions: Question[];
  answers: UserAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>;
  showResults: boolean;
  selectedHeadingId?: string | null;
  onSelectHeading?: (headingId: string | null) => void;
  onAssignHeading?: (targetSectionId: string, headingId: string | null, sourceSectionId?: string) => void;
}

const getQuestionCount = (q: Question): number => {
  switch (q.type) {
    case QuestionType.MATCHING:
      return q.items.length;
    case QuestionType.TABLE_COMPLETION:
      return q.rows.filter(r => r.answerKey).length;
    case QuestionType.TRUE_FALSE:
      return q.items.length;
    default:
      return 0;
  }
};

export const QuizPane: React.FC<QuizPaneProps> = ({ 
  questions, 
  answers, 
  setAnswers, 
  showResults,
  selectedHeadingId = null,
  onSelectHeading,
  onAssignHeading
}) => {

  const handleTableChange = (rowKey: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      table: { ...prev.table, [rowKey]: value }
    }));
  };

  const handleTFChange = (itemId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      tf: { ...prev.tf, [itemId]: value }
    }));
  };

  const isCorrect = (
    qId: string, 
    subId: string, 
    val: string | undefined
  ): boolean | undefined => {
    if (!showResults) return undefined;

    const safeVal = val || '';
    const question = questions.find(q => q.id === qId);
    if (!question) return false;

    if (question.type === QuestionType.MATCHING) {
      return question.correctMapping[subId] === safeVal;
    }
    
    if (question.type === QuestionType.TABLE_COMPLETION) {
      const row = question.rows.find(r => r.answerKey === subId);
      if (!row || !row.correctAnswer) return false;
      return row.correctAnswer.some(ans => ans.toLowerCase() === safeVal.toLowerCase().trim());
    }

    if (question.type === QuestionType.TRUE_FALSE) {
      const item = question.items.find(i => i.id === subId);
      return item?.correctAnswer === safeVal;
    }

    return false;
  };

  const renderFeedback = (isCorrectVal: boolean | undefined, correctText?: string) => {
    if (!showResults || isCorrectVal === undefined) return null;
    return (
      <div className={`ml-2 flex items-center gap-1 text-sm font-medium ${isCorrectVal ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isCorrectVal ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        {!isCorrectVal && correctText && <span>Đáp án đúng: {correctText}</span>}
      </div>
    );
  };

  const renderExplanation = (text?: string) => {
    if (!showResults || !text) return null;
    return (
      <div className="mt-2 text-sm text-slate-600 bg-blue-50 p-2.5 rounded-lg flex items-start gap-2 border border-blue-100">
        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <span>{text}</span>
      </div>
    );
  };

  let questionCursor = 1;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {questions.map((q) => {
          const count = getQuestionCount(q);
          const rangeLabel = `Questions ${questionCursor}–${questionCursor + count - 1}`;
          const currentStartCursor = questionCursor;
          questionCursor += count;

          return (
            <div key={q.id} className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="mb-4">
                <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-bold rounded mb-2">
                  {rangeLabel}
                </span>
                <p className="font-semibold text-base sm:text-lg text-slate-800">{q.instruction}</p>
              </div>

              {/* MATCHING TYPE (QUESTIONS 1-5) */}
              {q.type === QuestionType.MATCHING && (
                <div className="space-y-6">
                  {/* Interactive Headings Bank */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                      <p className="font-bold text-sm text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                        <Sparkles size={16} className="text-blue-600" />
                        List of Headings (Kéo hoặc chạm để làm bài)
                      </p>
                      <span className="text-xs text-slate-500">
                        Kéo thả sang Drop Zone cạnh Section A–E hoặc chạm để chọn
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map(opt => {
                        const isSelected = selectedHeadingId === opt.id;
                        // Check if this heading is currently assigned to a section
                        const assignedSection = Object.entries(answers.matching).find(([_, hId]) => hId === opt.id)?.[0];

                        return (
                          <div
                            key={opt.id}
                            draggable={!showResults}
                            onDragStart={(e) => {
                              if (showResults) return;
                              e.dataTransfer.setData('text/plain', opt.id);
                              e.dataTransfer.setData('application/heading-id', opt.id);
                              if (assignedSection) {
                                e.dataTransfer.setData('application/source-section', assignedSection);
                              }
                            }}
                            onClick={() => {
                              if (showResults) return;
                              onSelectHeading?.(isSelected ? null : opt.id);
                            }}
                            className={`group relative p-2.5 rounded-lg border text-sm transition-all flex items-center justify-between gap-3 select-none ${
                              showResults
                                ? 'bg-white border-slate-200 text-slate-600'
                                : isSelected
                                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300 text-blue-900 shadow-md scale-[1.01]'
                                  : assignedSection
                                    ? 'bg-slate-100/80 border-slate-300 text-slate-700 hover:border-slate-400'
                                    : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm cursor-grab active:cursor-grabbing'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {!showResults && (
                                <GripVertical size={16} className="text-slate-400 flex-shrink-0 group-hover:text-blue-600" />
                              )}
                              <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex-shrink-0">
                                {opt.id}
                              </span>
                              <span className="font-medium truncate text-xs sm:text-sm">
                                {opt.label.replace(/^[ivx]+\s*/i, '')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              {isSelected && !showResults && (
                                <span className="text-xs bg-blue-600 text-white font-semibold px-2 py-0.5 rounded-full animate-pulse">
                                  Đang chọn ➜ Thả vào Section
                                </span>
                              )}
                              {assignedSection && (
                                <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check size={12} />
                                  Section {assignedSection}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TABLE TYPE */}
              {q.type === QuestionType.TABLE_COMPLETION && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-base sm:text-lg border-collapse">
                    <thead>
                      <tr className="bg-orange-400 text-white">
                        {q.headers.map((h, i) => <th key={i} className="p-3 font-semibold border-b-2 border-orange-500">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {q.rows.map((row, i) => {
                        const isInputInCol1 = row.col1.includes('...');
                        const isInputInCol2 = row.col2.includes('...');
                        const rowStatus = row.answerKey ? isCorrect(q.id, row.answerKey, answers.table[row.answerKey]) : undefined;
                        const correctText = row.correctAnswer?.[0];

                        return (
                          <tr key={row.id} className={`border-b border-slate-200 ${i % 2 === 0 ? 'bg-orange-50/60' : 'bg-white'}`}>
                            <td className="p-3 align-top">
                              {isInputInCol1 && row.answerKey ? (
                                <div className="flex flex-col">
                                  <span className="text-orange-800 font-bold mr-1">({row.answerKey})</span>
                                  <input 
                                    type="text"
                                    className={`w-full p-1.5 border rounded-lg text-sm sm:text-base ${showResults && !rowStatus ? 'border-rose-500 bg-rose-50' : 'border-orange-200 bg-white'}`}
                                    placeholder="Type answer..."
                                    value={answers.table[row.answerKey] || ''}
                                    onChange={(e) => handleTableChange(row.answerKey!, e.target.value)}
                                    disabled={showResults}
                                  />
                                  {renderFeedback(rowStatus, correctText)}
                                  {renderExplanation(row.explanation)}
                                </div>
                              ) : row.col1}
                            </td>
                            <td className="p-3 align-top">
                              {isInputInCol2 && row.answerKey ? (
                                <div className="flex flex-col">
                                  <span className="text-orange-800 font-bold mr-1">({row.answerKey})</span>
                                  <input 
                                    type="text"
                                    className={`w-full p-1.5 border rounded-lg text-sm sm:text-base ${showResults && !rowStatus ? 'border-rose-500 bg-rose-50' : 'border-orange-200 bg-white'}`}
                                    placeholder="Type answer..."
                                    value={answers.table[row.answerKey] || ''}
                                    onChange={(e) => handleTableChange(row.answerKey!, e.target.value)}
                                    disabled={showResults}
                                  />
                                  {renderFeedback(rowStatus, correctText)}
                                  {renderExplanation(row.explanation)}
                                </div>
                              ) : row.col2}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TRUE FALSE TYPE */}
              {q.type === QuestionType.TRUE_FALSE && (
                <div className="space-y-4">
                  {q.items.map(item => {
                    const status = isCorrect(q.id, item.id, answers.tf[item.id]);

                    return (
                      <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors">
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-sm sm:text-base text-slate-800 leading-relaxed flex-1 pt-1">{item.statement}</p>
                          <div className="flex items-center gap-1">
                            {renderFeedback(status, item.correctAnswer)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 pl-1 mb-2">
                          {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                              <div className="relative">
                                <input 
                                  type="radio" 
                                  name={`tf-${item.id}`}
                                  value={opt}
                                  checked={answers.tf[item.id] === opt}
                                  onChange={(e) => handleTFChange(item.id, e.target.value)}
                                  disabled={showResults}
                                  className="sr-only peer"
                                />
                                <div className={`w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center
                                  peer-focus:ring-2 peer-focus:ring-blue-300
                                  peer-checked:border-blue-600 peer-checked:bg-blue-600`}>
                                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                                </div>
                              </div>
                              <span className={`text-xs sm:text-sm font-semibold ${answers.tf[item.id] === opt ? 'text-blue-700' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                {opt}
                              </span>
                            </label>
                          ))}
                        </div>
                        {renderExplanation(item.explanation)}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}

        {!showResults && (
           <div className="flex justify-center pb-8">
            <p className="text-slate-400 text-xs sm:text-sm">Hãy hoàn thành tất cả câu trả lời trước khi nộp bài.</p>
           </div>
        )}

      </div>
    </div>
  );
};
