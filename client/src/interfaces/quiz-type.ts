export interface Question {
    _id: string;
    type: 'TRUE_FALSE' | 'MULTIPLE_CHOICE' ;
    correctAnswer: boolean | string;
    options?: string[];
    question: string;
}

export interface StartQuizResponse {
    sessionId: string;
    question: Question;
    index: number;
    finished: boolean;
}

