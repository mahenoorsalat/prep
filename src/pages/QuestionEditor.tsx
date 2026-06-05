import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link2, Image, ChevronRight, Trash2,
} from 'lucide-react';
import Header from '../components/Layout/Header';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import type { DifficultyLevel } from '../types';
import './QuestionEditor.css';

interface QuestionData {
  id: string;
  questionText: string;
  options: { text: string; isCorrect: boolean }[];
  solution: string;
  difficulty: DifficultyLevel;
  topic: string;
  subTopic: string;
  saved: boolean;
}

const createEmptyQuestion = (num: number): QuestionData => ({
  id: `q-${num}`,
  questionText: '',
  options: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ],
  solution: '',
  difficulty: 'easy',
  topic: '',
  subTopic: '',
  saved: false,
});

export default function QuestionEditor() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeQuestion = questions[activeIndex] || createEmptyQuestion(1);

  // Helper to save all questions to localStorage in API format
  const saveQuestionsToStorage = useCallback((updatedList: QuestionData[]) => {
    const apiQuestions = updatedList.map((q, idx) => ({
      _id: q.id,
      testId: testId || '',
      questionNumber: idx + 1,
      questionText: q.questionText,
      options: q.options.map((o, oIdx) => ({
        id: `opt-${idx + 1}-${oIdx + 1}-${Math.floor(Math.random() * 1000)}`,
        text: o.text,
        isCorrect: o.isCorrect
      })),
      solution: q.solution,
      difficultyLevel: q.difficulty,
      topic: q.topic,
      subTopic: q.subTopic,
      marks: 5
    }));
    localStorage.setItem(`test_${testId}_questions`, JSON.stringify(apiQuestions));
  }, [testId]);

  // Load questions on mount
  useEffect(() => {
    const storedTest = localStorage.getItem(`test_${testId}`);
    const testConfig = storedTest ? JSON.parse(storedTest) : null;
    const requiredCount = testConfig?.numberOfQuestions || 6;

    const storedQuestions = localStorage.getItem(`test_${testId}_questions`);
    if (storedQuestions) {
      try {
        const parsed = JSON.parse(storedQuestions);
        if (parsed && parsed.length > 0) {
          const mapped: QuestionData[] = parsed.map((q: any, idx: number) => ({
            id: q._id || `q-${idx + 1}`,
            questionText: q.questionText || '',
            options: q.options ? q.options.map((o: any) => ({ text: o.text || '', isCorrect: !!o.isCorrect })) : [
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
              { text: '', isCorrect: false },
            ],
            solution: q.solution || '',
            difficulty: q.difficultyLevel || 'easy',
            topic: q.topic || '',
            subTopic: q.subTopic || '',
            saved: true
          }));
          setQuestions(mapped);
          return;
        }
      } catch (e) {
        console.error('Error loading stored questions:', e);
      }
    }

    // Fallback: Init empty list matching configuration count
    const initialQuestions = Array.from({ length: requiredCount }, (_, i) => createEmptyQuestion(i + 1));
    setQuestions(initialQuestions);
    saveQuestionsToStorage(initialQuestions);
  }, [testId, saveQuestionsToStorage]);

  const updateQuestion = useCallback((field: string, value: unknown) => {
    setQuestions((prev) => {
      const updated = prev.map((q, i) =>
        i === activeIndex ? { ...q, [field]: value, saved: true } : q
      );
      saveQuestionsToStorage(updated);
      return updated;
    });
  }, [activeIndex, saveQuestionsToStorage]);

  const updateOption = useCallback((optIndex: number, text: string) => {
    setQuestions((prev) => {
      const updated = prev.map((q, i) =>
        i === activeIndex
          ? {
              ...q,
              options: q.options.map((o, j) =>
                j === optIndex ? { ...o, text } : o
              ),
              saved: true,
            }
          : q
      );
      saveQuestionsToStorage(updated);
      return updated;
    });
  }, [activeIndex, saveQuestionsToStorage]);

  const setCorrectOption = useCallback((optIndex: number) => {
    setQuestions((prev) => {
      const updated = prev.map((q, i) =>
        i === activeIndex
          ? {
              ...q,
              options: q.options.map((o, j) => ({
                ...o,
                isCorrect: j === optIndex,
              })),
              saved: true,
            }
          : q
      );
      saveQuestionsToStorage(updated);
      return updated;
    });
  }, [activeIndex, saveQuestionsToStorage]);

  const addQuestion = () => {
    const newQ = createEmptyQuestion(questions.length + 1);
    const updated = [...questions, newQ];
    setQuestions(updated);
    saveQuestionsToStorage(updated);
    setActiveIndex(questions.length);

    // Update test configuration count in localStorage
    const storedTest = localStorage.getItem(`test_${testId}`);
    if (storedTest) {
      const parsed = JSON.parse(storedTest);
      parsed.numberOfQuestions = updated.length;
      parsed.totalMarks = updated.length * (parsed.markingScheme?.correctAnswer || 5);
      localStorage.setItem(`test_${testId}`, JSON.stringify(parsed));
    }
  };

  const deleteAllEdits = () => {
    if (!confirm('Delete all edits? This cannot be undone.')) return;
    const cleared = questions.map((q) => ({ ...createEmptyQuestion(parseInt(q.id.split('-')[1] || '1')), id: q.id }));
    setQuestions(cleared);
    saveQuestionsToStorage(cleared);
  };

  const handleNext = () => {
    navigate(`/test/${testId}/preview`);
  };

  const toolbarItems = [
    { icon: Bold, title: 'Bold' },
    { icon: Italic, title: 'Italic' },
    { icon: Underline, title: 'Underline' },
    { icon: Strikethrough, title: 'Strikethrough' },
    null,
    { icon: AlignLeft, title: 'Align Left' },
    { icon: AlignCenter, title: 'Align Center' },
    { icon: AlignRight, title: 'Align Right' },
    { icon: AlignJustify, title: 'Justify' },
    null,
    { icon: List, title: 'Bullet List' },
    { icon: ListOrdered, title: 'Numbered List' },
    null,
    { icon: Link2, title: 'Insert Link' },
    { icon: Image, title: 'Insert Image' },
  ];

  return (
    <div className="question-editor">
      <Header
        breadcrumb={[
          { label: 'Test Creation', path: '/dashboard' },
          { label: 'Create Test', path: '/test/create' },
          { label: 'Chapter Wise' },
        ]}
      />

      <div className="question-editor__layout">
        {/* Left sidebar — Question list */}
        <aside className="question-editor__sidebar">
          <div className="question-editor__sidebar-header">
            <div className="question-editor__sidebar-title">
              <span>Question creation</span>
              <button className="question-editor__collapse">
                <ChevronRight size={16} />
              </button>
            </div>
            <p className="question-editor__total">Total Questions : {questions.length}</p>
          </div>

          <div className="question-editor__question-list">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                className={`question-editor__question-item ${idx === activeIndex ? 'question-editor__question-item--active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                <span className={`question-editor__q-dot ${q.saved ? 'question-editor__q-dot--saved' : ''}`} />
                <span>Question {idx + 1}</span>
                <ChevronRight size={14} className="question-editor__q-arrow" />
              </button>
            ))}
            <button className="question-editor__add-btn" onClick={addQuestion}>
              + Add Question
            </button>
          </div>

          <button className="question-editor__delete-all" onClick={deleteAllEdits}>
            <Trash2 size={14} />
            Delete All Edits
          </button>
        </aside>

        {/* Right panel — Editor */}
        <div className="question-editor__main">
          <div className="question-editor__editor animate-fadeIn" key={activeIndex}>
            {/* Question number */}
            <h2 className="question-editor__q-number">
              Question {activeIndex + 1}
              <span className="question-editor__q-total">/{questions.length}</span>
            </h2>

            {/* Rich text toolbar */}
            <div className="question-editor__toolbar">
              {toolbarItems.map((item, i) =>
                item === null ? (
                  <div key={i} className="question-editor__toolbar-sep" />
                ) : (
                  <button key={i} className="question-editor__toolbar-btn" title={item.title}>
                    <item.icon size={16} />
                  </button>
                )
              )}
            </div>

            {/* Question text area */}
            <textarea
              className="question-editor__text-area"
              placeholder="Type here"
              value={activeQuestion.questionText}
              onChange={(e) => updateQuestion('questionText', e.target.value)}
              rows={6}
            />

            {/* Options */}
            <div className="question-editor__options-section">
              <h3 className="question-editor__options-title">Type the options below</h3>
              <div className="question-editor__options">
                {activeQuestion.options.map((opt, idx) => (
                  <div key={idx} className="question-editor__option">
                    <label className="question-editor__option-radio">
                      <input
                        type="radio"
                        name={`option-${activeIndex}`}
                        checked={opt.isCorrect}
                        onChange={() => setCorrectOption(idx)}
                      />
                      <span className="question-editor__option-dot" />
                    </label>
                    <input
                      type="text"
                      className="question-editor__option-input"
                      placeholder="Type Option here"
                      value={opt.text}
                      onChange={(e) => updateOption(idx, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div className="question-editor__solution">
              <h3 className="question-editor__solution-title">Add Solution</h3>
              <textarea
                className="question-editor__solution-area"
                placeholder="Type here"
                value={activeQuestion.solution}
                onChange={(e) => updateQuestion('solution', e.target.value)}
                rows={4}
              />
            </div>

            {/* Question settings */}
            <div className="question-editor__settings">
              <h3 className="question-editor__settings-title">Question settings</h3>
              <div className="question-editor__settings-grid">
                <Select
                  label="Level of Difficulty"
                  options={[
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'difficult', label: 'Difficult' },
                  ]}
                  value={activeQuestion.difficulty}
                  onChange={(e) => updateQuestion('difficulty', e.target.value)}
                />
                <Select
                  label="Topic"
                  options={[
                    { value: 'grammar', label: 'Grammar' },
                    { value: 'writing', label: 'Writing' },
                  ]}
                  value={activeQuestion.topic}
                  onChange={(e) => updateQuestion('topic', e.target.value)}
                />
                <Select
                  label="Sub topic"
                  options={[
                    { value: 'application', label: 'Application' },
                    { value: 'comprehension', label: 'Comprehension' },
                  ]}
                  value={activeQuestion.subTopic}
                  onChange={(e) => updateQuestion('subTopic', e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="question-editor__actions">
              <Button variant="danger" onClick={() => navigate(`/test/create`)}>
                Edit Test Creation
              </Button>
              <Button onClick={handleNext} id="question-editor-next">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
