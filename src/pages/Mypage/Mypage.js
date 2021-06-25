import React, { useState, useEffect } from 'react';
import { keyframes } from 'styled-components';
import FadeIn from 'react-fade-in';
import LineChart from '../Mypage/Charts/LineChart';
import BarChart from '../Mypage/Charts/BarChart';
import styled from 'styled-components';
import Modal from '../../components/Modal/Modal';
import EditForm from '../Mypage/EditForm';
import API_URLS from '../../config';

export default function Mypage() {
  const [userInformation, setUserInformation] = useState('');
  const [isModalOn, setIsModalOn] = useState(false);

  useEffect(() => {
    fetch(`${API_URLS.MY_PAGE}`, {
      headers: {
        Authorization: sessionStorage.getItem('wrtoken'),
      },
    })
      .then(res => res.json())
      .then(({ result }) => {
        setUserInformation(result);
      });
  }, []);

  const getInformation = (category, data) => {
    return userInformation[`${category}_information`][`${data}`];
  };

  const getAverageTime = type => {
    if (userInformation['record_information'][`average_${type}_time`] === 0) {
      return `0시 0분`;
    } else {
      const hour = Number(
        userInformation['record_information'][`average_${type}_time`].split(
          ':'
        )[0]
      );
      const minute = Number(
        userInformation['record_information'][`average_${type}_time`].split(
          ':'
        )[1]
      );
      if (hour > 12) {
        return `오후 ${hour - 12}시 ${minute}분`;
      } else {
        return `오전 ${hour}시 ${minute}분`;
      }
    }
  };

  const secondToHour = second => Math.round(second / 360) / 10;

  return (
    <FadeIn transitionDuration={1000}>
      {userInformation && (
        <ContentsContainer>
          <article>
            <UserProfile>
              <Img
                alt="profile_image"
                src={getInformation('user', 'user_profile_image_url')}
              />
              <UserInformation>
                <dt>{getInformation('user', 'user_name')}</dt>
                <EditBtn onClick={() => setIsModalOn(true)}>
                  Profile Edit
                </EditBtn>
                {isModalOn && (
                  <Modal setOff={setIsModalOn} height="600px">
                    <EditForm />
                  </Modal>
                )}
              </UserInformation>
            </UserProfile>
            <UserSpendingTime>
              <TotalspendingHour>
                총
                <Hour>
                  {secondToHour(getInformation('user', 'user_total_time'))}
                </Hour>
                시간
              </TotalspendingHour>
              <br />
              &gt; wecode와 <br />
              함께 하셨습니다.
            </UserSpendingTime>
            <TimeContents>
              <ul>
                <AverageTimeContent>
                  <Label>⏳ 내 평균 시작 시간</Label>
                  <Time>{getAverageTime('start')}</Time>
                </AverageTimeContent>
                <AverageTimeContent>
                  <Label>⌛ 내 평균 종료 시간</Label>
                  <Time>{getAverageTime('end')}</Time>
                </AverageTimeContent>
              </ul>
              <AfterDday>
                <Label>&gt; wecode</Label>
                <Date>D+{getInformation('record', 'wecode_d_day')}</Date>
              </AfterDday>
            </TimeContents>
          </article>
          <SecondContents>
            <TimeGraphContents>
              <div>
                <BarChart
                  weeklyRecordsData={getInformation('record', 'weekly_record')}
                />
              </div>
              <LineChart
                totalAccumulateRecordsData={getInformation(
                  'record',
                  'total_accumulate_records'
                )}
              />
            </TimeGraphContents>
          </SecondContents>
        </ContentsContainer>
      )}
    </FadeIn>
  );
}

const ContentsContainer = styled.section`
  ${({ theme }) => theme.flexbox('row', 'space-between')}
  margin: 80px auto 0;
  padding: 50px 65px 0;
  max-width: 1440px;
  transform: scale(1.05);

  article:first-child {
    height: 100%;
  }
`;

const UserProfile = styled.div`
  ${({ theme }) => theme.flexbox('row', 'flex-start')}
  margin-bottom: 35px;
`;

const Img = styled.img`
  margin-right: 25px;
  width: 85px;
  height: 85px;
  border-radius: 50%;
`;

const UserInformation = styled.dl`
  text-align: center;

  dt {
    margin-bottom: 20px;
    position: relative;
    top: 10px;
    font-size: ${({ theme }) => theme.pixelToRem(30)};
    font-weight: 700;
  }
`;

const EditBtn = styled.dd`
  cursor: pointer;
  padding: 10px 15px;

  &:hover {
    text-decoration: underline;
    text-underline-position: under;
  }

  &:active {
    opacity: 0.8;
  }
`;

const UserSpendingTime = styled.div`
  margin-bottom: 75px;
  font-size: ${({ theme }) => theme.pixelToRem(50)};
  font-weight: 700;
  line-height: ${({ theme }) => theme.pixelToRem(75)};
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.pixelToRem(70)};
`;

const TotalspendingHour = styled.div`
  display: inline-block;
  margin: 35px 0 35px;
  padding: 0 10px 0 0;
  font-size: ${({ theme }) => theme.pixelToRem(85)};
`;

const boxAnimation = keyframes`
  from {
    background-color: transparent;
  }
  to{
    background-color: ${({ theme }) => theme.colors.backgroundColor}
  }
`;

const Hour = styled.div`
  display: inline-block;
  margin: 0 15px;
  padding: 10px 10px;
  background-color: ${({ theme }) => theme.colors.blue};
  animation-name: ${boxAnimation};
  animation-delay: 0.3s;
  animation-fill-mode: backwards;
  animation-duration: 1s;
`;

const SecondContents = styled.article`
  width: 500px;
  height: 100%;
`;

const TimeGraphContents = styled.div`
  div:first-child {
    margin-bottom: 80px;
  }
`;

const AverageTimeContent = styled.li`
  margin-bottom: 40px;
  margin-right: 100px;
  font-size: ${({ theme }) => theme.pixelToRem(30)};
`;

const TimeContents = styled.div`
  ${({ theme }) => theme.flexbox('row', 'space-between', 'flex-start')}
`;

const Label = styled.div`
  margin-bottom: 10px;
  font-size: ${({ theme }) => theme.pixelToRem(25)};
  text-align: center;
  font-weight: 700;
`;

const Time = styled(Label.withComponent('div'))`
  font-weight: 400;
`;

const Date = styled.div`
  font-size: ${({ theme }) => theme.pixelToRem(80)};
  font-weight: 700;
`;

const AfterDday = styled.div`
  ${({ theme }) => theme.flexbox('column')}
`;
