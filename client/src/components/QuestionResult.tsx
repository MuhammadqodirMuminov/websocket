
interface QuestionResultProps {
    correct: boolean;
    correctAnswer: string;
    onClose: () => void;
}

const QuestionResult = ({ correct, correctAnswer, onClose }: QuestionResultProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                        {correct ? 'Correct!' : 'Incorrect'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="text-center">
                    <div className="text-4xl mb-4">
                        {correct ? (
                            <svg className="text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    {!correct && (
                        <p className="text-gray-700">
                            The correct answer was: {correctAnswer}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionResult;
