import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { testsApi } from '../api/tests';
import { subjectsApi } from '../api/subjects';
import type { Subject, Topic, SubTopic, DifficultyLevel, CreateTestRequest } from '../types';
import './CreateTest.css';

type TabType = 'chapterwise' | 'pyq' | 'mocktest';

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

export default function CreateTest() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('chapterwise');
  const [loading, setLoading] = useState(false);

  // Dropdown data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

  // Form state
  const [subject, setSubject] = useState('');
  const [testName, setTestName] = useState('');
  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [wrongAnswer, setWrongAnswer] = useState(-1);
  const [unattempted, setUnattempted] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(5);
  const [numQuestions, setNumQuestions] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load subjects
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await subjectsApi.getAll();
        setSubjects(data.length ? data : mockSubjects);
      } catch {
        setSubjects(mockSubjects);
      }
    };
    loadSubjects();
  }, []);

  // Load topics when subject changes
  useEffect(() => {
    if (!subject) { setTopics([]); setTopic(''); return; }
    const loadTopics = async () => {
      try {
        const data = await subjectsApi.getTopics(subject);
        setTopics(data.length ? data : (mockTopics[subject] || []));
      } catch {
        setTopics(mockTopics[subject] || []);
      }
    };
    loadTopics();
    setTopic('');
    setSubTopic('');
  }, [subject]);

  // Load subtopics when topic changes
  useEffect(() => {
    if (!topic) { setSubTopics([]); setSubTopic(''); return; }
    const loadSubTopics = async () => {
      try {
        const data = await subjectsApi.getSubTopics(topic);
        setSubTopics(data.length ? data : (mockSubTopics[topic] || []));
      } catch {
        setSubTopics(mockSubTopics[topic] || []);
      }
    };
    loadSubTopics();
    setSubTopic('');
  }, [topic]);

  const totalMarks = Number(numQuestions || 0) * correctAnswer;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!subject) errs.subject = 'Subject is required';
    if (!testName.trim()) errs.testName = 'Test name is required';
    if (!topic) errs.topic = 'Topic is required';
    if (!duration || Number(duration) <= 0) errs.duration = 'Valid duration is required';
    if (!numQuestions || Number(numQuestions) <= 0) errs.numQuestions = 'Valid number of questions is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const data: CreateTestRequest = {
      name: testName,
      testType: activeTab,
      subject,
      topic,
      subTopic,
      duration: Number(duration),
      difficultyLevel: difficulty,
      markingScheme: {
        wrongAnswer,
        unattempted,
        correctAnswer,
      },
      numberOfQuestions: Number(numQuestions),
    };

    try {
      const test = await testsApi.create(data);
      navigate(`/test/${test._id}/questions`);
    } catch {
      // Mock navigation for development
      const mockId = Date.now().toString();
      // Store test data locally for the flow
      localStorage.setItem(`test_${mockId}`, JSON.stringify({ ...data, _id: mockId, totalMarks, status: 'draft' }));
      navigate(`/test/${mockId}/questions`);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'chapterwise', label: 'Chapter Wise' },
    { key: 'pyq', label: 'PYQ' },
    { key: 'mocktest', label: 'Mock Test' },
  ];

  return (
    <div className="create-test">
      <Header
        breadcrumb={[
          { label: 'Test Creation', path: '/dashboard' },
          { label: 'Create Test' },
          { label: tabs.find(t => t.key === activeTab)?.label || 'Chapter Wise' },
        ]}
      />

      <div className="create-test__content animate-slideUp">
        {/* Tabs */}
        <div className="create-test__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`create-test__tab ${activeTab === tab.key ? 'create-test__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="create-test__form">
          <div className="create-test__row">
            <Select
              label="Subject"
              options={subjects.map(s => ({ value: s._id, label: s.name }))}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              error={errors.subject}
              id="create-test-subject"
            />
            <Input
              label="Name of Test"
              placeholder="Enter name of Test"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              error={errors.testName}
              id="create-test-name"
            />
          </div>

          <div className="create-test__row">
            <Select
              label="Topic"
              options={topics.map(t => ({ value: t._id, label: t.name }))}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              error={errors.topic}
              id="create-test-topic"
            />
            <Select
              label="Sub Topic"
              options={subTopics.map(st => ({ value: st._id, label: st.name }))}
              value={subTopic}
              onChange={(e) => setSubTopic(e.target.value)}
              id="create-test-subtopic"
            />
          </div>

          <div className="create-test__row">
            <Input
              label="Duration (Minutes)"
              type="number"
              placeholder="Enter the time"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              error={errors.duration}
              id="create-test-duration"
            />
            <div className="create-test__difficulty">
              <label className="create-test__label">Test Difficulty Level</label>
              <div className="create-test__radio-group">
                {(['easy', 'medium', 'difficult'] as DifficultyLevel[]).map((level) => (
                  <label key={level} className="create-test__radio">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={difficulty === level}
                      onChange={() => setDifficulty(level)}
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

          {/* Marking Scheme */}
          <div className="create-test__section">
            <h3 className="create-test__section-title">Marking Scheme:</h3>
            <div className="create-test__marking">
              <div className="create-test__marking-field">
                <label>Wrong Answer</label>
                <div className="create-test__number-input">
                  <button onClick={() => setWrongAnswer(prev => prev - 1)}>−</button>
                  <span>{wrongAnswer}</span>
                  <button onClick={() => setWrongAnswer(prev => prev + 1)}>+</button>
                </div>
              </div>
              <div className="create-test__marking-field">
                <label>Unattempted</label>
                <div className="create-test__number-input">
                  <button onClick={() => setUnattempted(prev => prev - 1)}>−</button>
                  <span>+{unattempted}</span>
                  <button onClick={() => setUnattempted(prev => prev + 1)}>+</button>
                </div>
              </div>
              <div className="create-test__marking-field">
                <label>Correct Answer</label>
                <div className="create-test__number-input">
                  <button onClick={() => setCorrectAnswer(prev => Math.max(1, prev - 1))}>−</button>
                  <span>+{correctAnswer}</span>
                  <button onClick={() => setCorrectAnswer(prev => prev + 1)}>+</button>
                </div>
              </div>
              <Input
                label="No of Questions"
                type="number"
                placeholder="Ex:250 Marks"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                error={errors.numQuestions}
                id="create-test-questions"
              />
              <Input
                label="Total Marks"
                value={totalMarks ? `${totalMarks}` : ''}
                placeholder="Ex:250 Marks"
                readOnly
                id="create-test-total-marks"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="create-test__actions">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading} id="create-test-next">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
