import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, FileText, Award, Pencil, Trash2, Upload } from 'lucide-react';
import Header from '../components/Layout/Header';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import type { Test } from '../types';
import { testsApi } from '../api/tests';
import './Dashboard.css';

// Mock data for when API is unavailable
const mockTests: Test[] = [
  {
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Dashboard() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const data = await testsApi.getAll();
      setTests(data.length ? data : mockTests);
    } catch {
      setTests(mockTests);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    try {
      await testsApi.delete(id);
      setTests((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setTests((prev) => prev.filter((t) => t._id !== id));
    }
  };

  const getSubjectName = (subject: Test['subject']) =>
    typeof subject === 'string' ? subject : subject.name;

  const getDifficultyVariant = (level: string) => {
    switch (level) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'difficult': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="dashboard">
      <Header
        breadcrumb={[{ label: 'Dashboard' }]}
      />

      <div className="dashboard__content">
        <div className="dashboard__header">
          <div>
            <h1 className="dashboard__title">All Tests</h1>
            <p className="dashboard__subtitle">{tests.length} tests created</p>
          </div>
          <Button
            icon={<Plus size={16} />}
            onClick={() => navigate('/test/create')}
            id="create-test-btn"
          >
            Create Test
          </Button>
        </div>

        {loading ? (
          <div className="dashboard__loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="dashboard__skeleton" />
            ))}
          </div>
        ) : tests.length === 0 ? (
          <div className="dashboard__empty">
            <FileText size={48} strokeWidth={1.2} />
            <h3>No tests created yet</h3>
            <p>Start by creating your first test</p>
            <Button onClick={() => navigate('/test/create')}>Create Test</Button>
          </div>
        ) : (
          <div className="dashboard__grid">
            {tests.map((test, index) => (
              <div
                key={test._id}
                className="test-card animate-slideUp"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="test-card__header">
                  <div className="test-card__badges">
                    <Badge variant={getDifficultyVariant(test.difficultyLevel) as 'success' | 'warning' | 'error'}>
                      {test.difficultyLevel}
                    </Badge>
                    <Badge variant={test.status === 'published' ? 'primary' : 'default'}>
                      {test.status}
                    </Badge>
                  </div>
                  <div className="test-card__actions">
                    <button
                      className="test-card__action"
                      title="Edit test"
                      onClick={() => navigate(`/test/${test._id}/questions`)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="test-card__action test-card__action--danger"
                      title="Delete test"
                      onClick={() => handleDelete(test._id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h3 className="test-card__title">{test.name}</h3>
                <p className="test-card__subject">{getSubjectName(test.subject)}</p>

                <div className="test-card__stats">
                  <span className="test-card__stat">
                    <Clock size={14} />
                    {test.duration} Min
                  </span>
                  <span className="test-card__stat">
                    <FileText size={14} />
                    {test.numberOfQuestions} Q's
                  </span>
                  <span className="test-card__stat">
                    <Award size={14} />
                    {test.totalMarks} Marks
                  </span>
                </div>

                <div className="test-card__footer">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Plus size={14} />}
                    onClick={() => navigate(`/test/${test._id}/questions`)}
                  >
                    MCQ
                  </Button>
                  {test.status === 'draft' && (
                    <Button
                      size="sm"
                      icon={<Upload size={14} />}
                      onClick={() => navigate(`/test/${test._id}/preview`)}
                    >
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
