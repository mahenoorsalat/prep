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
import type { Test } from '../types';
import toast from 'react-hot-toast';
import './PreviewPublish.css';

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
                  onClick={() => navigate(`/test/create`)}
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
    </div>
  );
}
