import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  Award, 
  Pencil, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';
import Header from '../components/Layout/Header';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { subjectsApi } from '../api/subjects';
import { testsApi } from '../api/tests';
import type { Test, Subject, Topic, SubTopic, DifficultyLevel } from '../types';
import toast from 'react-hot-toast';
import './PreviewPublish.css';
import './CreateTest.css'; // Reuse form layout styles

const mockSubjects: Subject[] = [
  { _id: '1', name: 'Physics' },
  { _id: '2', name: 'Chemistry' },
  { _id: '3', name: 'Mathematics' },
  { _id: '4', name: 'English' },
  { _id: '5', name: 'Biology' },
];

const mockTopics: Record<string, Topic[]> = {
  '1': [
    { _id: 't1', name: 'Mechanics', subjectId: '1' },
    { _id: 't2', name: 'Thermodynamics', subjectId: '1' },
    { _id: 't3', name: 'Optics', subjectId: '1' },
  ],
  '2': [
    { _id: 't4', name: 'Organic Chemistry', subjectId: '2' },
    { _id: 't5', name: 'Inorganic Chemistry', subjectId: '2' },
  ],
  '3': [
    { _id: 't6', name: 'Calculus', subjectId: '3' },
    { _id: 't7', name: 'Algebra', subjectId: '3' },
  ],
  '4': [
    { _id: 't8', name: 'Grammar', subjectId: '4' },
    { _id: 't9', name: 'Writing', subjectId: '4' },
  ],
  '5': [
    { _id: 't10', name: 'Cell Biology', subjectId: '5' },
    { _id: 't11', name: 'Genetics', subjectId: '5' },
  ],
};

const mockSubTopics: Record<string, SubTopic[]> = {
  't1': [{ _id: 'st1', name: 'Newton Laws', topicId: 't1' }, { _id: 'st2', name: 'Motion', topicId: 't1' }],
  't4': [{ _id: 'st3', name: 'Hydrocarbons', topicId: 't4' }],
  't6': [{ _id: 'st4', name: 'Derivatives', topicId: 't6' }, { _id: 'st5', name: 'Integration', topicId: 't6' }],
  't8': [{ _id: 'st6', name: 'Tenses', topicId: 't8' }, { _id: 'st7', name: 'Application', topicId: 't8' }],
};

// Predefined mock tests lookup
const mockTests: Record<string, Partial<Test>> = {
  '1': {
    _id: '1',
    name: 'Physics Chapter Test',
    testType: 'chapterwise',
    subject: { _id: '1', name: 'Physics' },
    topic: { _id: '1', name: 'Mechanics', subjectId: '1' },
    subTopic: { _id: '1', name: 'Newton Laws', topicId: '1' },
    duration: 60,
    difficultyLevel: 'easy',
    markingScheme: { wrongAnswer: -1, unattempted: 0, correctAnswer: 5 },
    numberOfQuestions: 50,
    totalMarks: 250,
    status: 'draft',
  },
  '2': {
    _id: '2',
    name: 'English Grammar Test',
    testType: 'chapterwise',
    subject: { _id: '2', name: 'English' },
    topic: { _id: '2', name: 'Grammar', subjectId: '2' },
    subTopic: { _id: '2', name: 'Tenses', topicId: '2' },
    duration: 45,
    difficultyLevel: 'medium',
    markingScheme: { wrongAnswer: -1, unattempted: 0, correctAnswer: 4 },
    numberOfQuestions: 30,
    totalMarks: 120,
    status: 'published',
  },
  '3': {
    _id: '3',
    name: 'Mathematics PYQ Set',
    testType: 'pyq',
    subject: { _id: '3', name: 'Mathematics' },
    topic: { _id: '3', name: 'Calculus', subjectId: '3' },
    subTopic: { _id: '3', name: 'Derivatives', topicId: '3' },
    duration: 90,
    difficultyLevel: 'difficult',
    markingScheme: { wrongAnswer: -1, unattempted: 0, correctAnswer: 5 },
    numberOfQuestions: 40,
    totalMarks: 200,
    status: 'draft',
  }
};

export default function PreviewPublish() {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<Partial<Test> | null>(null);
  const [publishTab, setPublishTab] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('10:00 AM');
  const [liveUntil, setLiveUntil] = useState('always'); // always, 3weeks, 1week, 1month, 2weeks, custom
  const [customEndDate, setCustomEndDate] = useState('');
  const [customEndTime, setCustomEndTime] = useState('11:59 PM');

  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [editSubject, setEditSubject] = useState('');
  const [editTestName, setEditTestName] = useState('');
  const [editTopic, setEditTopic] = useState('');
  const [editSubTopic, setEditSubTopic] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editDifficulty, setEditDifficulty] = useState<DifficultyLevel>('easy');
  const [editWrongAnswer, setEditWrongAnswer] = useState(-1);
  const [editUnattempted, setEditUnattempted] = useState(0);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState(5);
  const [editNumQuestions, setEditNumQuestions] = useState('');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const editTotalMarks = Number(editNumQuestions || 0) * editCorrectAnswer;
  
  useEffect(() => {
    // Attempt to load from localStorage first
    const stored = localStorage.getItem(`test_${testId}`);
    if (stored) {
      try {
        setTest(JSON.parse(stored));
        return;
      } catch (e) {
        console.error('Error parsing stored test:', e);
      }
    }
    
    // Fallback to mockTests
    if (testId && mockTests[testId]) {
      setTest(mockTests[testId]);
    } else {
      // Default fallback
      setTest({
        _id: testId || 'new',
        name: 'Untitled Test Creation',
        testType: 'chapterwise',
        subject: { _id: 'sub-1', name: 'English' },
        topic: { _id: 'top-1', name: 'Grammar/Writing', subjectId: 'sub-1' },
        subTopic: { _id: 'subtop-1', name: 'Application', topicId: 'top-1' },
        duration: 60,
        difficultyLevel: 'easy',
        markingScheme: { wrongAnswer: -1, unattempted: 0, correctAnswer: 5 },
        numberOfQuestions: 50,
        totalMarks: 250,
        status: 'draft',
      });
    }
  }, [testId]);

  // Load edit modal subjects dropdown
  useEffect(() => {
    if (!isEditModalOpen) return;
    const loadSubjects = async () => {
      try {
        const data = await subjectsApi.getAll();
        setSubjects(data.length ? data : mockSubjects);
      } catch {
        setSubjects(mockSubjects);
      }
    };
    loadSubjects();
  }, [isEditModalOpen]);

  // Load edit modal topics when subject changes
  useEffect(() => {
    if (!editSubject) { setTopics([]); return; }
    const loadTopics = async () => {
      try {
        const data = await subjectsApi.getTopics(editSubject);
        setTopics(data.length ? data : (mockTopics[editSubject] || []));
      } catch {
        setTopics(mockTopics[editSubject] || []);
      }
    };
    loadTopics();
  }, [editSubject]);

  // Load edit modal subtopics when topic changes
  useEffect(() => {
    if (!editTopic) { setSubTopics([]); return; }
    const loadSubTopics = async () => {
      try {
        const data = await subjectsApi.getSubTopics(editTopic);
        setSubTopics(data.length ? data : (mockSubTopics[editTopic] || []));
      } catch {
        setSubTopics(mockSubTopics[editTopic] || []);
      }
    };
    loadSubTopics();
  }, [editTopic]);

  // Initialize edit form when opening modal
  const handleOpenEditModal = () => {
    if (!test) return;
    const subjectId = typeof test.subject === 'string' ? test.subject : (test.subject?._id || '');
    const topicId = typeof test.topic === 'string' ? test.topic : (test.topic?._id || '');
    const subTopicId = typeof test.subTopic === 'string' ? test.subTopic : (test.subTopic?._id || '');

    setEditSubject(subjectId);
    setEditTestName(test.name || '');
    setEditTopic(topicId);
    setEditSubTopic(subTopicId);
    setEditDuration(test.duration ? `${test.duration}` : '');
    setEditDifficulty(test.difficultyLevel || 'easy');
    setEditWrongAnswer(test.markingScheme?.wrongAnswer ?? -1);
    setEditUnattempted(test.markingScheme?.unattempted ?? 0);
    setEditCorrectAnswer(test.markingScheme?.correctAnswer ?? 5);
    setEditNumQuestions(test.numberOfQuestions ? `${test.numberOfQuestions}` : '');
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    // Validation
    const errs: Record<string, string> = {};
    if (!editSubject) errs.subject = 'Subject is required';
    if (!editTestName.trim()) errs.testName = 'Test name is required';
    if (!editTopic) errs.topic = 'Topic is required';
    if (!editDuration || Number(editDuration) <= 0) errs.duration = 'Valid duration is required';
    if (!editNumQuestions || Number(editNumQuestions) <= 0) errs.numQuestions = 'Valid question count is required';
    
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }

    const updatedData = {
      name: editTestName,
      subject: editSubject,
      topic: editTopic,
      subTopic: editSubTopic,
      duration: Number(editDuration),
      difficultyLevel: editDifficulty,
      markingScheme: {
        wrongAnswer: editWrongAnswer,
        unattempted: editUnattempted,
        correctAnswer: editCorrectAnswer
      },
      numberOfQuestions: Number(editNumQuestions),
      totalMarks: editTotalMarks
    };

    try {
      if (test?._id) {
        const result = await testsApi.update(test._id, updatedData);
        setTest(result);
      }
      toast.success('Test configuration updated successfully!');
      setIsEditModalOpen(false);
    } catch {
      // Offline / LocalStorage support
      if (test?._id) {
        const stored = localStorage.getItem(`test_${test._id}`);
        const parsed = stored ? JSON.parse(stored) : {};
        const merged = { ...parsed, ...updatedData };
        localStorage.setItem(`test_${test._id}`, JSON.stringify(merged));
        
        // Let's update topic/subject mapping names locally in the page state
        const selectedSubj = mockSubjects.find(s => s._id === editSubject) || { _id: editSubject, name: editSubject };
        const selectedTopic = (mockTopics[editSubject] || []).find(t => t._id === editTopic) || { _id: editTopic, name: editTopic, subjectId: editSubject };
        const selectedSubTopic = (mockSubTopics[editTopic] || []).find(st => st._id === editSubTopic) || { _id: editSubTopic, name: editSubTopic, topicId: editTopic };

        setTest({
          ...test,
          ...merged,
          subject: selectedSubj,
          topic: selectedTopic,
          subTopic: selectedSubTopic
        });
      }
      toast.success('Test configuration saved locally!');
      setIsEditModalOpen(false);
    }
  };

  if (!test) {
    return (
      <div className="preview-publish__loading">
        <div className="preview-publish__spinner" />
      </div>
    );
  }

  const getSubjectName = () => {
    if (!test.subject) return '';
    return typeof test.subject === 'string' ? test.subject : test.subject.name;
  };

  const getTopicName = () => {
    if (!test.topic) return '';
    return typeof test.topic === 'string' ? test.topic : test.topic.name;
  };

  const getSubTopicName = () => {
    if (!test.subTopic) return '';
    return typeof test.subTopic === 'string' ? test.subTopic : test.subTopic.name;
  };

  const handleConfirm = () => {
    // Basic validations
    if (publishTab === 'schedule' && !scheduleDate) {
      toast.error('Please select a date to schedule the publish');
      return;
    }
    if (liveUntil === 'custom' && !customEndDate) {
      toast.error('Please select an end date for the custom duration');
      return;
    }

    // Save status change in localStorage
    const updatedTest = { ...test, status: 'published' };
    localStorage.setItem(`test_${test._id}`, JSON.stringify(updatedTest));
    
    // Also save in the tests list if it exists in dashboard/cache mock
    toast.success(
      publishTab === 'now' 
        ? 'Test published successfully!' 
        : `Test scheduled for ${scheduleDate} at ${scheduleTime}`,
      { className: 'toast-success' }
    );
    
    // Redirect back to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="preview-publish">
      <Header
        breadcrumb={[
          { label: 'Test Creation', path: '/dashboard' },
          { label: 'Create Test', path: '/test/create' },
          { label: 'Chapter Wise' },
        ]}
      />

      <div className="preview-publish__layout">
        {/* Left sidebar — Question Status list (mirroring the figma sidebar style) */}
        <aside className="preview-publish__sidebar">
          <div className="preview-publish__sidebar-header">
            <div className="preview-publish__sidebar-title">
              <span>Question creation</span>
              <button className="preview-publish__collapse">
                <ChevronRight size={16} />
              </button>
            </div>
            <p className="preview-publish__total">Total Questions : {test.numberOfQuestions || 50}</p>
          </div>

          <div className="preview-publish__question-list">
            {Array.from({ length: test.numberOfQuestions || 6 }).map((_, idx) => (
              <div
                key={idx}
                className="preview-publish__question-item"
              >
                <span className="preview-publish__q-dot preview-publish__q-dot--saved" />
                <span>Question {idx + 1}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Right side — Review and Publish panel */}
        <div className="preview-publish__main">
          <div className="preview-publish__content-container animate-slideUp">
            
            {/* Test summary card */}
            <div className="test-summary-card">
              <div className="test-summary-card__header">
                <div>
                  <div className="test-summary-card__status-row">
                    <span className="test-summary-card__status-label">Status :</span>
                    <span className="test-summary-card__status-value">Test created</span>
                    <Badge variant="success" className="test-summary-card__status-badge">
                      <CheckCircle2 size={12} style={{ marginRight: 4 }} />
                      All {test.numberOfQuestions || 50} Questions done
                    </Badge>
                  </div>
                  <div className="test-summary-card__type-row">
                    <Badge variant="primary" className="test-summary-card__type-badge">
                      {test.testType === 'chapterwise' ? 'Chapter Wise' : test.testType?.toUpperCase() || 'CHAPTER WISE'}
                    </Badge>
                    <span className="test-summary-card__chapter-name">Chapter 1</span>
                    <Badge variant={test.difficultyLevel === 'easy' ? 'success' : test.difficultyLevel === 'medium' ? 'warning' : 'error'}>
                      {test.difficultyLevel || 'easy'}
                    </Badge>
                  </div>
                </div>
                <button 
                  className="test-summary-card__edit-btn" 
                  title="Edit test configuration"
                  onClick={handleOpenEditModal}
                >
                  <Pencil size={16} />
                </button>
              </div>

              <div className="test-summary-card__metadata">
                <div className="metadata-item">
                  <span className="metadata-item__label">Subject:</span>
                  <span className="metadata-item__value">{getSubjectName()}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-item__label">Topic:</span>
                  <span className="metadata-item__tag">{getTopicName()}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-item__label">Sub Topic:</span>
                  <span className="metadata-item__tag">{getSubTopicName()}</span>
                </div>
              </div>

              <div className="test-summary-card__stats">
                <div className="stat-pill">
                  <Clock size={15} />
                  <span>{test.duration || 60} Min</span>
                </div>
                <div className="stat-pill">
                  <FileText size={15} />
                  <span>{test.numberOfQuestions || 50} Q's</span>
                </div>
                <div className="stat-pill">
                  <Award size={15} />
                  <span>{test.totalMarks || 250} Marks</span>
                </div>
              </div>
            </div>

            {/* Publish section */}
            <div className="publish-settings-card">
              <h2 className="publish-settings-card__title">Publish Settings</h2>
              
              {/* Publish Tabs */}
              <div className="publish-settings-card__tabs">
                <button
                  className={`publish-settings-card__tab ${publishTab === 'now' ? 'publish-settings-card__tab--active' : ''}`}
                  onClick={() => setPublishTab('now')}
                >
                  Publish Now
                </button>
                <button
                  className={`publish-settings-card__tab ${publishTab === 'schedule' ? 'publish-settings-card__tab--active' : ''}`}
                  onClick={() => setPublishTab('schedule')}
                >
                  Schedule Publish
                </button>
              </div>

              {/* Schedule Form */}
              {publishTab === 'schedule' && (
                <div className="publish-settings-card__schedule-form animate-fadeIn">
                  <div className="form-group">
                    <label className="form-label">Select Date</label>
                    <div className="date-input-wrapper">
                      <CalendarIcon size={16} className="calendar-icon" />
                      <input 
                        type="date" 
                        className="form-control date-picker"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Select Time</label>
                    <select 
                      className="form-control select-time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    >
                      {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'].map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Live Until duration settings */}
              <div className="live-until-section">
                <h3 className="live-until-section__title">Live Until</h3>
                <p className="live-until-section__subtitle">
                  Choose how long this test should remain available on the platform.
                </p>

                <div className="live-until-section__grid">
                  {[
                    { value: 'always', label: 'Always Available' },
                    { value: '3weeks', label: '3 Weeks' },
                    { value: '1week', label: '1 Week' },
                    { value: '1month', label: '1 Month' },
                    { value: '2weeks', label: '2 Weeks' },
                    { value: 'custom', label: 'Custom Duration' },
                  ].map((option) => (
                    <label 
                      key={option.value} 
                      className={`live-until-option ${liveUntil === option.value ? 'live-until-option--active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="liveUntil"
                        value={option.value}
                        checked={liveUntil === option.value}
                        onChange={(e) => setLiveUntil(e.target.value)}
                      />
                      <span className="live-until-option__dot" />
                      <span className="live-until-option__label">{option.label}</span>
                    </label>
                  ))}
                </div>

                {liveUntil === 'custom' && (
                  <div className="live-until-section__custom-inputs animate-fadeIn">
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <div className="date-input-wrapper">
                        <CalendarIcon size={16} className="calendar-icon" />
                        <input 
                          type="date" 
                          className="form-control date-picker"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          min={scheduleDate || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Time</label>
                      <select 
                        className="form-control select-time"
                        value={customEndTime}
                        onChange={(e) => setCustomEndTime(e.target.value)}
                      >
                        {['11:59 PM', '08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM'].map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Page Action Footer */}
            <div className="preview-publish__actions">
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                id="preview-publish-confirm"
              >
                Confirm
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Test Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Test creation"
      >
        <div className="create-test__form" style={{ padding: 0, border: 'none', background: 'none' }}>
          <div className="create-test__row">
            <Select
              label="Subject"
              options={subjects.map(s => ({ value: s._id, label: s.name }))}
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              error={editErrors.subject}
            />
            <Input
              label="Name of Test"
              placeholder="Enter name of Test"
              value={editTestName}
              onChange={(e) => setEditTestName(e.target.value)}
              error={editErrors.testName}
            />
          </div>

          <div className="create-test__row">
            <Select
              label="Topic"
              options={topics.map(t => ({ value: t._id, label: t.name }))}
              value={editTopic}
              onChange={(e) => setEditTopic(e.target.value)}
              error={editErrors.topic}
            />
            <Select
              label="Sub Topic"
              options={subTopics.map(st => ({ value: st._id, label: st.name }))}
              value={editSubTopic}
              onChange={(e) => setEditSubTopic(e.target.value)}
            />
          </div>

          <div className="create-test__row">
            <Input
              label="Duration (Minutes)"
              type="number"
              value={editDuration}
              onChange={(e) => setEditDuration(e.target.value)}
              error={editErrors.duration}
            />
            <div className="create-test__difficulty">
              <label className="create-test__label">Test Difficulty Level</label>
              <div className="create-test__radio-group">
                {(['easy', 'medium', 'difficult'] as DifficultyLevel[]).map((level) => (
                  <label key={level} className="create-test__radio">
                    <input
                      type="radio"
                      name="edit-difficulty"
                      value={level}
                      checked={editDifficulty === level}
                      onChange={() => setEditDifficulty(level)}
                    />
                    <span className="create-test__radio-dot" />
                    <span className="create-test__radio-label">
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="create-test__section">
            <h3 className="create-test__section-title">Marking Scheme:</h3>
            <div className="create-test__marking" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              <div className="create-test__marking-field">
                <label>Wrong Answer</label>
                <div className="create-test__number-input">
                  <button onClick={() => setEditWrongAnswer(prev => prev - 1)}>−</button>
                  <span>{editWrongAnswer}</span>
                  <button onClick={() => setEditWrongAnswer(prev => prev + 1)}>+</button>
                </div>
              </div>
              <div className="create-test__marking-field">
                <label>Unattempted</label>
                <div className="create-test__number-input">
                  <button onClick={() => setEditUnattempted(prev => prev - 1)}>−</button>
                  <span>+{editUnattempted}</span>
                  <button onClick={() => setEditUnattempted(prev => prev + 1)}>+</button>
                </div>
              </div>
              <div className="create-test__marking-field">
                <label>Correct Answer</label>
                <div className="create-test__number-input">
                  <button onClick={() => setEditCorrectAnswer(prev => Math.max(1, prev - 1))}>−</button>
                  <span>+{editCorrectAnswer}</span>
                  <button onClick={() => setEditCorrectAnswer(prev => prev + 1)}>+</button>
                </div>
              </div>
              <Input
                label="No of Questions"
                type="number"
                value={editNumQuestions}
                onChange={(e) => setEditNumQuestions(e.target.value)}
                error={editErrors.numQuestions}
              />
              <Input
                label="Total Marks"
                value={editTotalMarks ? `${editTotalMarks}` : ''}
                readOnly
              />
            </div>
          </div>

          <div className="preview-publish__actions" style={{ marginTop: '24px' }}>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
