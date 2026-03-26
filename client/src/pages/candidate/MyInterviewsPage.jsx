import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Video, Mic, MicOff, VideoOff, ChevronRight, PhoneOff, CheckCircle2, ChevronLeft, Bot } from 'lucide-react';
import { interviewService } from '../../services/api';
import { toast } from '../../components/ui/Toast';
import { Loader2 } from 'lucide-react';

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
        console.error(err);
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
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!interview) return <div className="p-8 text-center text-gray-400">No interview sessions found.</div>;

  const rawQuestions = interview.questions || interview.aiQuestions || [];
  if (rawQuestions.length === 0) {
    return <div className="p-8 text-center text-gray-400">This interview does not have any questions yet. Please contact the recruiter.</div>;
  }
  const questions = rawQuestions.map((q) => (typeof q === 'string' ? { question: q } : q));
  const job = interview.job || {};

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast.error('Please type an answer before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    if (!interview?._id) return;
    
    try {
      await interviewService.submitAnswer(interview._id, {
        questionIndex: currentQuestionIndex,
        answer: currentAnswer
      });
      
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

  if (isInterviewCompleted) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-white">Submitted Answers</h2>
        </div>
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const questionText = typeof q === 'string' ? q : q.question;
            const ansObj = (interview?.answers || []).find(a => a.questionIndex === idx);
            return (
              <Card key={idx} className="border-gray-800 bg-gray-950">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2">
                     <span className="text-primary-500">Q{idx + 1}:</span> {questionText}
                  </h3>
                  <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl">
                    <p className="text-gray-300 font-medium whitespace-pre-wrap leading-relaxed">{ansObj?.answer || 'No answer submitted.'}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/candidate/dashboard">
            <Button size="lg" className="px-8 font-bold h-12 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col pt-4 pb-8">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <Link to="/candidate/dashboard" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors mb-2 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800/80 w-fit">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {job?.postedBy?.company || job?.company || 'Interview'} <span className="text-gray-600 font-normal">|</span> Async Interview
          </h1>
        </div>
        {hasStarted && (
           <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-800 rounded-xl shadow-inner">
             <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Progress</span>
             <span className="text-sm font-bold text-white bg-gray-800 px-2 py-0.5 rounded ml-1">{currentQuestionIndex + 1} / {questions.length}</span>
           </div>
        )}
      </div>

      {!hasStarted ? (
        <Card className="flex-1 border-gray-800 bg-gray-950 flex flex-col items-center justify-center p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="max-w-md text-center relative z-10">
            <div className="w-24 h-24 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center mx-auto mb-6 shadow-inner">
               <Bot className="w-12 h-12 text-accent-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Welcome to your Async Interview</h2>
            <div className="space-y-4 text-left text-gray-400 text-sm mb-10 bg-gray-900/60 p-6 rounded-2xl border border-gray-800/80 shadow-sm backdrop-blur-sm">
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5"/> <span className="leading-relaxed">There are <strong className="text-white">{questions.length}</strong> questions in this interview.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0 mt-0.5"/> <span className="leading-relaxed">Type your answers in the text box provided. Provide exactly as much detail as you can.</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5"/> <span className="leading-relaxed">You will not be able to return to previous questions once submitted.</span></li>
              </ul>
            </div>

            <Button size="lg" className="w-full text-lg h-14 bg-primary-600 hover:bg-primary-500 shadow-[0_0_20px_rgba(14,165,233,0.3)] gap-3 font-bold group" onClick={handleStart}>
              Start Interview <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col mt-4 relative">
          <Card className="border-gray-800 bg-gray-950 shadow-2xl overflow-hidden rounded-3xl flex-1 flex flex-col">
            <div className="p-8 border-b border-gray-800/80 bg-gray-900/30 relative z-10 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 text-accent-500 font-bold text-xs uppercase tracking-widest inline-flex px-3 py-1 bg-accent-950/30 border border-accent-900/50 rounded-full"><Bot className="w-3.5 h-3.5"/> Question {currentQuestionIndex + 1} of {questions.length}</div>
              </div>
              <h3 className="text-2xl font-bold text-white leading-tight">
                {typeof questions[currentQuestionIndex] === 'string' ? questions[currentQuestionIndex] : questions[currentQuestionIndex]?.question || 'Loading question...'}
              </h3>
            </div>
            
            <div className="flex-1 p-8 flex flex-col relative z-10 bg-gray-950">
              <label className="text-sm font-semibold text-gray-400 mb-3 block">Your Answer:</label>
              <textarea
                value={currentAnswer}
                onChange={e => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here. Be as detailed as possible..."
                className="w-full flex-1 bg-gray-900 border border-gray-800 text-white rounded-xl p-5 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none min-h-[300px]"
                disabled={isSubmitting}
              />
              <div className="mt-8 flex justify-end gap-3">
                <Button 
                  size="lg" 
                  className="px-8 font-bold h-12 bg-primary-600 hover:bg-primary-500 text-white gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)] disabled:opacity-50"
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !currentAnswer.trim()}
                >
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin"/> Submitting...</> : (
                    currentQuestionIndex < questions.length - 1 ? "Submit Answer" : "Submit & Finish"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default MyInterviewsPage;
