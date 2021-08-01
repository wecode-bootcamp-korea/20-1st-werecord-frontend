import React, { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import Styled from 'styled-components';

export default function ShowNowTime() {
  const [time, setTime] = useState({
    hour: 0,
    minutes: 0,
  });

  const memoDate = useMemo(() => getTodayDate(), []);

  useEffect(() => {
    getTimePasses(setTime);
    return () => clearInterval(getTimePasses(setTime));
  }, []);

  return (
    <Container>
      {memoDate}
      <br />
      {getTime(time)}
      <br />
      {showNowTime(time)}
    </Container>
  );
}

const Container = Styled.h1`
  margin-bottom: 40px;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.pixelToRem(60)};
  font-weight: 700;
  line-height: 75px;
`;

const getTimePasses = setTime => {
  setInterval(() => {
    setTime(prev => ({
      ...prev,
      hour: dayjs().hour(),
      minutes: dayjs().minute(),
    }));
  }, 1000);
};

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

const getTodayDate = () => {
  return `지금은 ${dayjs().month() + 1}월 ${dayjs().date()}일`;
};

const getTime = time => {
  const hour = time;
  return hour > 12
    ? `${WEEK[dayjs().day()]}요일 오후`
    : `${WEEK[dayjs().day()]}요일 오전`;
};

const showNowTime = time => {
  return `${time.hour}시 ${time.minutes}분 입니다.`;
};