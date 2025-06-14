import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useGame } from '../contexts/GameContext';
import QuestionResult from '../components/QuestionResult';

import type { Question as ServerQuestion } from '../interfaces/quiz-type';

interface Question extends ServerQuestion {
    type: 'TRUE_FALSE' | 'MULTIPLE_CHOICE';
}

interface QuestionResultData {
    correct: boolean;
    correctAnswer: string;
}

const Question = () => {
    const { socket } = useSocket();
    const { sessionId } = useParams();
    const { users, currentQuestion } = useGame();

    const [showResult, setShowResult] = useState(false);
    const [resultData, setResultData] = useState<QuestionResultData | null>(null);

    useEffect(() => {
        if (socket) {
            socket.on('start-quiz.question-result', (data: QuestionResultData) => {
                setResultData(data);
                setShowResult(true);
            });

            // Cleanup socket listeners
            return () => {
                socket.off('start-quiz.question-result');
            };
        }
    }, [socket]);

    const handleCloseResult = () => {
        setShowResult(false);
        setResultData(null);
    };

    const handleAnswer = (answer: string) => {
        if (socket && currentQuestion) {
            socket.emit('submit_answer', {
                sessionId,
                questionId: currentQuestion._id,
                answer
            });
        }
    };

    return (
        <div className="question-page max-w-4xl mx-auto px-4 py-8">
            {showResult && resultData && (
                <QuestionResult
                    correct={resultData.correct}
                    correctAnswer={resultData.correctAnswer}
                    onClose={handleCloseResult}
                />
            )}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Current Question</h1>
                <p className="text-xl font-semibold mb-8 text-gray-800">{currentQuestion?.question}</p>
                
                {currentQuestion && (
                    <div className="answer-options space-y-6">
                        {currentQuestion.type === 'TRUE_FALSE' && (
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => handleAnswer('true')} 
                                    className="answer-btn bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    True
                                </button>
                                <button 
                                    onClick={() => handleAnswer('false')} 
                                    className="answer-btn bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    False
                                </button>
                            </div>
                        )}
                        {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                            <div className="space-y-4">
                                {currentQuestion?.options?.map((option, index) => (
                                    <label key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                        <input
                                            type="radio"
                                            name="answer"
                                            value={option}
                                            onClick={() => handleAnswer(option)}
                                            className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-800 font-medium">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <p>Active Users: {users.length}</p>
        </div>
    );
};

export default Question;
