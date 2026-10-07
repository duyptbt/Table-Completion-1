import React, { useState } from 'react';
import { Section, MatchingQuestion } from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  GripVertical, 
  X, 
  Sparkles, 
  Target, 
  ChevronDown, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface ReadingPaneProps {
  sections: Section[];
  matchingQuestion?: MatchingQuestion;
  matchingAnswers?: Record<string, string>;
  onAssignHeading?: (targetSectionId: string, headingId: string | null, sourceSectionId?: string) => void;
  selectedHeadingId?: string | null;
  onSelectHeading?: (headingId: string | null) => void;
  showResults?: boolean;
}

interface SectionDropZoneProps {
  sectionId: string;
  questionNumber: number;
  assignedHeading?: { id: string; label: string };
  isCorrect?: boolean;
  correctHeading?: { id: string; label: string };
  explanation?: string;
  selectedHeadingId?: string | null;
  onDropHeading: (headingId: string, sourceSectionId?: string) => void;
  onRemoveHeading: () => void;
  allHeadings: { id: string; label: string }[];
  showResults: boolean;
}

const SectionDropZone: React.FC<SectionDropZoneProps> = ({
  sectionId,
  questionNumber,
  assignedHeading,
  isCorrect,
  correctHeading,
  explanation,
  selectedHeadingId,
  onDropHeading,
  onRemoveHeading,
  allHeadings,
  showResults
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (showResults) return;
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (showResults) return;

    const headingId = e.dataTransfer.getData('application/heading-id') || e.dataTransfer.getData('text/plain');
    const sourceSection = e.dataTransfer.getData('application/source-section') || undefined;

    if (headingId) {
      onDropHeading(headingId, sourceSection);
      setIsMenuOpen(false);
    }
  };

  const handleZoneClick = () => {
    if (showResults) return;

    // If user tapped a heading earlier in the question panel, place it here!
    if (selectedHeadingId) {
      onDropHeading(selectedHeadingId);
      setIsMenuOpen(false);
      return;
    }

    // Otherwise, toggle the heading selector menu
    setIsMenuOpen(prev => !prev);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (showResults || !assignedHeading) return;
    e.dataTransfer.setData('text/plain', assignedHeading.id);
    e.dataTransfer.setData('application/heading-id', assignedHeading.id);
    e.dataTransfer.setData('application/source-section', sectionId);
  };

  return (
    <div className="relative flex flex-col items-end">
      {/* Placed Heading State */}
      {assignedHeading ? (
        <div className="flex flex-col items-end gap-1.5 max-w-full">
          <div
            draggable={!showResults}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              if (selectedHeadingId && !showResults) {
                onDropHeading(selectedHeadingId);
              }
            }}
            className={`group/zone flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all shadow-sm max-w-full ${
              showResults
                ? isCorrect
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-200'
                  : 'bg-rose-50 border-rose-400 text-rose-900 ring-1 ring-rose-200'
                : isDragOver
                  ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300 scale-105'
                  : selectedHeadingId
                    ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-200 cursor-pointer animate-pulse'
                    : 'bg-white border-blue-200 text-slate-800 hover:border-blue-400 cursor-grab active:cursor-grabbing'
            }`}
          >
            {!showResults && (
              <GripVertical size={14} className="text-slate-400 flex-shrink-0" />
            )}

            {showResults && (
              isCorrect ? (
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
              )
            )}

            <span className="font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 flex-shrink-0">
              {assignedHeading.id}
            </span>

            <span className="truncate max-w-[200px] sm:max-w-[280px] font-semibold text-xs sm:text-sm">
              {assignedHeading.label.replace(/^[ivx]+\s*/i, '')}
            </span>

            {!showResults && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveHeading();
                }}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors ml-1"
                title="Gỡ tiêu đề này"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Result details if incorrect or explanation */}
          {showResults && (
            <div className="text-xs space-y-1">
              {!isCorrect && correctHeading && (
                <div className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200 font-medium">
                  <span>Đáp án đúng:</span>
                  <strong className="underline">{correctHeading.label}</strong>
                </div>
              )}
              {explanation && (
                <button
                  type="button"
                  onClick={() => setShowExplanation(prev => !prev)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium ml-auto"
                >
                  <Info size={12} />
                  <span>{showExplanation ? 'Ẩn giải thích' : 'Xem giải thích'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Empty Drop Zone State */
        <div className="flex flex-col items-end gap-1.5">
          <button
            type="button"
            onClick={handleZoneClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 border-dashed transition-all text-xs sm:text-sm font-medium ${
              showResults
                ? 'border-rose-300 bg-rose-50/60 text-rose-700'
                : isDragOver
                  ? 'border-blue-600 bg-blue-100 text-blue-900 scale-105 shadow-md'
                  : selectedHeadingId
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-300 animate-pulse hover:bg-blue-100'
                    : 'border-slate-300 bg-slate-50/80 text-slate-600 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700'
            }`}
          >
            <Target size={16} className={selectedHeadingId ? 'text-blue-600 animate-spin-slow' : 'text-slate-400'} />
            
            <span>
              {showResults ? (
                'Chưa điền đáp án'
              ) : selectedHeadingId ? (
                `Chạm để gắn vào Section ${sectionId}`
              ) : (
                `Thả tiêu đề vào đây (Q${questionNumber})`
              )}
            </span>

            {!showResults && !selectedHeadingId && (
              <ChevronDown size={14} className="text-slate-400 ml-0.5" />
            )}
          </button>

          {showResults && correctHeading && (
            <div className="text-xs text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200 font-medium">
              Đáp án: <strong>{correctHeading.label}</strong>
            </div>
          )}
        </div>
      )}

      {/* Popover Menu when tapping empty drop zone without a pre-selected heading */}
      {isMenuOpen && !showResults && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsMenuOpen(false)} 
          />
          <div className="absolute top-full mt-2 right-0 z-50 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-2.5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 px-1">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Chọn tiêu đề cho Section {sectionId} (Q{questionNumber})
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X size={14} />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {allHeadings.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onDropHeading(opt.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-50 hover:text-blue-800 text-slate-700 flex items-start gap-2 border border-transparent hover:border-blue-200 transition-colors"
                >
                  <span className="font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded text-xs mt-0.5 flex-shrink-0">
                    {opt.id}
                  </span>
                  <span className="flex-1 font-medium">{opt.label.replace(/^[ivx]+\s*/i, '')}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Explanation drawer when toggled */}
      {showResults && showExplanation && explanation && (
        <div className="mt-2 text-xs text-slate-700 bg-blue-50 border border-blue-200 p-2.5 rounded-lg flex items-start gap-2 max-w-sm text-left">
          <Info size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <span>{explanation}</span>
        </div>
      )}
    </div>
  );
};

export const ReadingPane: React.FC<ReadingPaneProps> = ({
  sections,
  matchingQuestion,
  matchingAnswers = {},
  onAssignHeading,
  selectedHeadingId = null,
  onSelectHeading,
  showResults = false
}) => {
  const selectedHeading = matchingQuestion?.options.find(o => o.id === selectedHeadingId);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 bg-white relative">
      {/* Active selection banner for intuitive tap-to-place */}
      {selectedHeading && !showResults && (
        <div className="sticky top-0 z-30 mb-6 p-3 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2 text-sm font-medium min-w-0">
            <span className="bg-white text-blue-700 px-2 py-0.5 rounded font-bold text-xs uppercase flex-shrink-0">
              {selectedHeading.id}
            </span>
            <span className="truncate">
              Đang chọn: <strong>{selectedHeading.label}</strong> ➜ Chạm vào ô Drop Zone của Section A–E để gắn!
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSelectHeading?.(null)}
            className="text-xs bg-blue-700 hover:bg-blue-800 text-white px-2.5 py-1 rounded-lg border border-blue-400 font-semibold transition-colors flex-shrink-0"
          >
            Hủy chọn
          </button>
        </div>
      )}

      {/* Cover Image */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-md">
        <img 
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2000" 
          alt="Megacity skyline" 
          className="w-full h-48 sm:h-60 object-cover transform hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Megacities: <span className="font-light text-slate-600">a new kind of city</span>
        </h2>
        <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-blue-800 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
          <Sparkles size={16} className="text-blue-600 flex-shrink-0" />
          <span>
            <strong>Hướng dẫn:</strong> Kéo hoặc chạm các tiêu đề ở Questions 1–5 vào các ô <strong>Drop Zone</strong> cạnh từng Section A–E dưới đây.
          </span>
        </div>
      </div>
      
      {/* Sections with Drop Zones */}
      <div className="space-y-8">
        {sections.map((section, index) => {
          const questionNumber = index + 1; // Section A is Q1, Section B is Q2, etc.
          const assignedHeadingId = matchingAnswers[section.id];
          const assignedHeading = matchingQuestion?.options.find(o => o.id === assignedHeadingId);
          const correctHeadingId = matchingQuestion?.correctMapping[section.id];
          const correctHeading = matchingQuestion?.options.find(o => o.id === correctHeadingId);
          const isCorrect = showResults ? assignedHeadingId === correctHeadingId : undefined;
          const questionItem = matchingQuestion?.items.find(i => i.id === section.id);

          return (
            <div key={section.id} id={`reading-section-${section.id}`} className="group">
              {/* Section Header with Section Letter & Drop Zone */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 p-3 bg-slate-50/90 rounded-xl border border-slate-200 transition-colors hover:bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-base shadow-sm ring-2 ring-blue-100 flex-shrink-0">
                    {section.id}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-bold text-slate-800">{section.title}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        Câu {questionNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Drop Zone beside the Section Letter */}
                {matchingQuestion && (
                  <SectionDropZone
                    sectionId={section.id}
                    questionNumber={questionNumber}
                    assignedHeading={assignedHeading}
                    isCorrect={isCorrect}
                    correctHeading={correctHeading}
                    explanation={questionItem?.explanation}
                    selectedHeadingId={selectedHeadingId}
                    onDropHeading={(hId, srcSec) => onAssignHeading?.(section.id, hId, srcSec)}
                    onRemoveHeading={() => onAssignHeading?.(section.id, null)}
                    allHeadings={matchingQuestion.options}
                    showResults={showResults}
                  />
                )}
              </div>

              {/* Section Paragraph Text */}
              <p className="text-slate-700 leading-relaxed text-base sm:text-lg text-justify px-1">
                {section.content}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 p-4 bg-slate-50 rounded-lg text-sm text-slate-500 text-center">
        End of passage
      </div>
    </div>
  );
};
