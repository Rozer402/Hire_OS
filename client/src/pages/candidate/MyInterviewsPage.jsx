import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ChevronRight, CheckCircle2, ChevronLeft, Bot, Loader2 } from 'lucide-react';
import { interviewService } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export function MyInterviewsPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setIsLoadingData(true);
        if (id) {
          const res = await interviewService.getInterviewById(id);
          setInterview(res?.success ? res.data : null);
        } else {
          const res = await interviewService.getMyInterviews();
          const interviews = res?.success ? (res.data || []) : [];
          if (interviews.length > 0) setInterview(interviews[0]);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load interview');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchInterview();
  }, [id]);

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!interview) return (
    <div className="p-8 text-center text-slate-500 font-medium">No interview sessions found.</div>
  );

  const rawQuestions = interview.questions || interview.aiQuestions || [];
  if (rawQuestions.length === 0) {
    return <div className="p-8 text-center text-slate-500 font-medium">This interview does not have any questions yet. Please contact the recruiter.</div>;
  }
  const questions = rawQuestions.map((q) => (typeof q === 'string' ? { question: q } : q));
  const job = interview.job || {};

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) { toast.error('Please type an answer before submitting.'); return; }
    setIsSubmitting(true);
    if (!interview?._id) return;
    try {
      await interviewService.submitAnswer(interview._id, { questionIndex: currentQuestionIndex, answer: currentAnswer });
      setCurrentAnswer('');
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        toast.success('Answer saved! Moving to the next question...');
      } else {
        await interviewService.completeInterview(interview._id);
        const res = await interviewService.getInterviewById(interview._id);
        if (res.success) setInterview(res.data);
        setCompleted(true);
        toast.success('Interview completed! Thank you.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInterviewCompleted = completed || (interview?.status === 'completed');

  // ─── Completed View ───────────────────────────────────────────────────────
  if (isInterviewCompleted) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Submitted Answers</h2>
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const questionText = typeof q === 'string' ? q : q.question;
            const ansObj = (interview?.answers || []).find(a => a.questionIndex === idx);
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0">Q{idx + 1}.</span> {questionText}
                  </h3>
                </div>
                <div className="px-5 py-4">
                  <p className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed text-sm">{ansObj?.answer || <span className="text-slate-400 italic">No answer submitted.</span>}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/candidate/dashboard">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm px-8">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Active Interview View ────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/candidate/dashboard" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 w-fit shadow-sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Link>
          <h1 className="text-xl font-bold text-slate-900">
            {job?.postedBy?.company || job?.company || 'Interview'} <span className="text-slate-300 font-normal mx-2">|</span> Async Interview
          </h1>
        </div>
        {hasStarted && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progress</span>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg ml-1">{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
        )}
      </div>

      {/* ─── Welcome Screen ─── */}
      {!hasStarted ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Bot className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome to your Async Interview</h2>
          <div className="space-y-3 text-left text-slate-600 text-sm mb-8 bg-slate-50 p-5 rounded-xl border border-slate-200 max-w-md w-full">
            <ul className="space-y-3">
              <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/><span className="leading-relaxed">There are <strong className="text-slate-900">{questions.length}</strong> questions in this interview.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5"/><span className="leading-relaxed">Type your answers in the text box provided. Be as detailed as possible.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5"/><span className="leading-relaxed">You cannot return to previous questions once submitted.</span></li>
            </ul>
          </div>
          <Button size="lg" className="w-full max-w-sm text-base h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-sm" onClick={() => setHasStarted(true)}>
            Start Interview <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        /* ─── Question Screen ─── */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Question Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                <Bot className="w-3.5 h-3.5"/> Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {typeof questions[currentQuestionIndex] === 'string' ? questions[currentQuestionIndex] : questions[currentQuestionIndex]?.question || 'Loading question...'}
            </h3>
          </div>

          {/* Answer Area */}
          <div className="p-6">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Your Answer</label>
            <textarea
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here. Be as detailed as possible..."
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y min-h-[280px] text-sm leading-relaxed placeholder-slate-400 shadow-sm"
              disabled={isSubmitting}
            />
            <div className="mt-5 flex justify-end">
              <Button
                size="lg"
                className="px-8 font-bold h-11 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm disabled:opacity-50"
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !currentAnswer.trim()}
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin"/>Submitting...</> : (
                  currentQuestionIndex < questions.length - 1 ? 'Submit Answer' : 'Submit & Finish'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyInterviewsPage;
