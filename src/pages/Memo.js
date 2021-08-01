import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiPlus, FiDelete } from "react-icons/fi";
import WeatherIcon from "react-open-weather-icons";
import axios from "axios";
import styled from "styled-components";
import { getConcatStorage, getFindStorage, getRemoveStorage } from "../hooks/getStorage";

const MEMOS = "memos";

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 6fr 1fr;
    height: 100%;
`;
const SideContainer = styled.div`
    margin-top: 10px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const TitleText = styled.h1`
    font-size: 20px;
`;
const ClockText = styled.h1`
    margin-top: 10px;
`;
const MemoArea = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
`;
const TopBox = styled.div`
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100px;
`;
const ShownBtn = styled.button`
    width: 90%;
    height: 40px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.1s ease-out;
    &:hover {
        border-radius: 12px;
    }
    &:active {
        border-radius: 16px;
        transform: rotateZ(1deg);
    }
`;
const Form = styled.form`
    width: 90%;
    margin-top: 10px;
    display: none;
    &.shown {
        display: flex;
        align-items: center;
    }
`;
const Input = styled.input`
    width: 50%;
    height: 26px;
    border: 0;
    background-color: #eeeeee;
    border-radius: 10px;
    margin-right: 10px;
    padding-top: 3px;
    padding-left: 10px;
    outline: none;
`;
const SubmitBtn = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 52px;
    height: 30px;
    border: none;
    margin-left: 10px;
    border-radius: 10px;
    border-bottom-right-radius: 0;
    padding-top: 2px;
    cursor: pointer;
    transition: border-radius 0.1s ease-out;
    &:hover {
        border-radius: 6px;
        border-bottom-right-radius: 0;
    }
`;
const BottomBox = styled.div`
    background-color: #f6f6f6;
    padding: 20px;
    border-radius: 4px;
    width: 90%;
    height: 500px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 12px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        background-color: transparent;
        width: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #eeeeee;
        border-radius: 4px;
    }
`;
const MemoContainer = styled.div`
    position: relative;
    padding: 10px;
    height: 180px;
    background-color: #ededed;
    border-radius: 10px;
`;
const MemoContent = styled.div`
    width: 100%;
`;
const MemoTitle = styled.h1`
    margin: 0;
    font-size: 20px;
    width: 100%;
`;
const MemoDesc = styled.h3`
    font-size: 12px;
    width: 100%;
`;
const MemoDate = styled.small`
    position: absolute;
    bottom: 10px;
    left: 10px;
`;
const MemoAct = styled.button`
    position: absolute;
    bottom: 5px;
    right: 5px;
    border: 0;
    cursor: pointer;
    outline: none;
`;
const SmallText = styled.small`
    font-size: 16px;
    font-weight: 600;
`;
const Weather = styled.div`
    margin-top: -10px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const WeatherText = styled.small`
    font-size: 16px;
    font-weight: 600;
`;
const WeatherIcons = styled(WeatherIcon)`
    width: 40px;
    margin-left: 4px;
`;

function Memo() {
    const [ memos, setMemos ] = useState(JSON.parse(getFindStorage(MEMOS)));
    const [ weather, setWeather ] = useState();
    const { register, handleSubmit, setValue } = useForm({
        mode: "onChange"
    });
    const createMemo = data => {
        const { title, desc } = data;
        getConcatStorage(MEMOS, [ { title, desc, date: new Date(), id: `${Date.now()}${Math.round(Math.random() * 10)}` } ]);
        setMemos(JSON.parse(getFindStorage(MEMOS)));
        setValue("title", "");
        setValue("desc", "");
    };
    const getWeather = () => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { coords: { latitude, longitude } } = position;
            const data = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=c98729267aa0bd716b7c315fe06a6353`);
            setWeather(data);
        });
    };
    useEffect(() => {
        getWeather();
    }, []);
    return (
        <Container>
            <SideContainer>
                <TitleText>제모 Zemo</TitleText>
                <ClockText>{new Date().getHours() >= 13 ? new Date().getHours() - 12 : new Date().getHours()}:{new Date().getMinutes()}</ClockText>
            </SideContainer>
            <MemoArea>
                <TopBox>
                    <ShownBtn onClick={() => document.querySelector("form.create-memo").classList.toggle("shown")}>
                        <FiPlus size={20} />
                    </ShownBtn>
                    <Form className="create-memo" onSubmit={handleSubmit(createMemo)}>
                        <Input {...register("title", {
                            required: "메모 제목은 필수 입니다", 
                            maxLength: 40
                        })} name="title" type="text" placeholder="메모 제목" />
                        <Input {...register("desc", {
                            maxLength: 100
                        })} name="desc" type="text" placeholder="자세히 메모" />
                        <SubmitBtn>
                            <FiPlus size={20} />
                        </SubmitBtn>
                    </Form>
                </TopBox>
                <BottomBox>
                    {memos && memos[0] ? memos.map((item, index) => (
                        <MemoContainer key={index}>
                            <MemoContent>
                                <MemoTitle>{item.title}</MemoTitle>
                                <MemoDesc>{item.desc}</MemoDesc>
                                <MemoDate>{item.date.slice(0, 10).split("-").join(".")}</MemoDate>
                            </MemoContent>
                            <MemoAct onClick={() => {
                                getRemoveStorage(MEMOS, item.id);
                                setMemos(JSON.parse(getFindStorage(MEMOS)));
                            }}>
                                <FiDelete size={16} />
                            </MemoAct>
                        </MemoContainer>
                    )) : (
                        <SmallText>메모가 없네요 :(</SmallText>
                    )}
                </BottomBox>
            </MemoArea>
            <Weather>
                {weather ? (
                    <>
                        <WeatherText>{weather?.data?.name}</WeatherText>
                        <WeatherIcons name={weather?.data?.weather[0]?.icon} />
                    </>
                ) : (
                    <WeatherText>로드 중...</WeatherText>
                )}
            </Weather>
        </Container>
    );
};

export default Memo;