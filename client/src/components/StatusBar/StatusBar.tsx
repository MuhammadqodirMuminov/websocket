import React from 'react';
import styles from './StatusBar.module.scss';
import Grid from '@mui/material/Grid';

interface StatusBarProps {
  pin: string | number;
  username: string;
  questionNumber?: number;
  totalNumberOfQuestions?: number;
}

interface QuestionDisplayProps {
  questionNumber?: number;
  totalNumberOfQuestions?: number;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questionNumber, totalNumberOfQuestions }) => {
  if (!questionNumber) {
    return null;
  }

  return (
    <div style={{ textAlign: "left" }}>
      {questionNumber} of {totalNumberOfQuestions}
    </div>
  );
};

const StatusBar: React.FC<StatusBarProps> = ({ pin, username, questionNumber, totalNumberOfQuestions }) => {
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{ minHeight: "10vh" }}
      className={styles.status}
    >
      <div className={styles.left}>
        <div>PIN: {pin}</div>
        <QuestionDisplay questionNumber={questionNumber} totalNumberOfQuestions={totalNumberOfQuestions} />
      </div>
      <div style={{ textAlign: "right" }}>{username}</div>
    </Grid>
  );
};

export default StatusBar;
