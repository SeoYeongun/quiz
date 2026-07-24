import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import "./css/ShortsPage.css";


const ShortsPage = () => {


    const navigate = useNavigate();


    const [questions, setQuestions] = useState([]);

    const [answerResults, setAnswerResults] = useState({});

    const [comments, setComments] = useState([]);

    const [showComments, setShowComments] = useState(false);


    // 터치패드 중복 이동 방지
    const [slideLock, setSlideLock] = useState(false);



    // 유튜브 변환
    const getYoutubeEmbedUrl = (url) => {

        if(!url) return null;


        try{

            if(url.includes("youtube.com/watch")){

                const videoId =
                    new URL(url).searchParams.get("v");


                return `https://www.youtube.com/embed/${videoId}`;

            }


            if(url.includes("youtu.be")){

                const videoId =
                    url.split("youtu.be/")[1];


                return `https://www.youtube.com/embed/${videoId}`;

            }


            return url;


        }catch{

            return null;

        }

    };





    // 숏츠 가져오기
    useEffect(()=>{

        fetchShorts();

    },[]);




    const fetchShorts = async()=>{

        try{


            const res = await axios.get(

                "http://127.0.0.1:8000/api/quizzes/questions/shorts/"

            );


            setQuestions(res.data);



        }catch(err){

            console.error(
                "숏츠 불러오기 실패",
                err
            );

        }

    };







    // 정답 제출
    const submitAnswer = async(question, answer)=>{


        try{


            const token =
                localStorage.getItem("access");



            const res = await axios.post(

                `http://127.0.0.1:8000/api/quizzes/questions/${question.id}/answer/`,

                {
                    selected_answer:answer
                },

                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }

            );



            setAnswerResults(prev=>({

                ...prev,

                [question.id]:
                    res.data.is_correct

            }));



        }catch(err){

            console.error(
                "정답 제출 실패",
                err
            );

        }


    };







    // 좋아요
    const toggleLike = async(question)=>{


        try{


            const token =
                localStorage.getItem("access");



            const res = await axios.post(

                `http://127.0.0.1:8000/api/quizzes/questions/${question.id}/like/`,

                {},

                {

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    }

                }

            );



            setQuestions(prev=>

                prev.map(q=>

                    q.id === question.id

                    ?

                    {

                        ...q,

                        liked:
                        res.data.liked,


                        like_count:

                            res.data.liked

                            ?

                            q.like_count + 1

                            :

                            q.like_count - 1

                    }

                    :

                    q

                )

            );



        }catch(err){

            console.error(
                "좋아요 실패",
                err
            );

        }

    };







    // 댓글
    const fetchComments = async(question)=>{


        try{


            const res = await axios.get(

                `http://127.0.0.1:8000/api/quizzes/questions/${question.id}/comments/`

            );


            setComments(res.data);

            setShowComments(true);



        }catch(err){

            console.error(
                "댓글 불러오기 실패",
                err
            );

        }

    };







    if(questions.length === 0){

        return (

            <div className="shorts-container">

                <h2>
                    문제 불러오는 중...
                </h2>

            </div>

        );

    }






    return (

        <div className="shorts-container">


            {/* 목록 버튼 */}

            <button

                className="shorts-list-button"

                onClick={()=>navigate("/quizzes")}

            >

                ☰ 목록으로

            </button>






            <Swiper


                className="shorts-swiper"


                direction="vertical"


                slidesPerView={1}


                speed={500}



                allowSlideNext={!slideLock}



                mousewheel={{

                    forceToAxis:true,

                    sensitivity:0.1,

                    thresholdDelta:80,

                    thresholdTime:400

                }}



                pagination={{

                    clickable:true

                }}



                modules={[

                    Mousewheel,

                    Pagination

                ]}



                onSlideChangeTransitionStart={()=>{


                    setSlideLock(true);



                    setTimeout(()=>{

                        setSlideLock(false);

                    },350);



                    setShowComments(false);

                    setComments([]);

                }}



            >





            {

            questions.map(question=>(


                <SwiperSlide key={question.id}>


                    <div className="shorts-slide">



                        <div className="shorts-card">





                            <div className="shorts-media">



                                {
                                question.image &&

                                <img

                                    src={question.image}

                                    alt=""

                                />

                                }



                                {
                                question.video &&

                                <video

                                    src={question.video}

                                    controls

                                />

                                }



                                {
                                question.video_url &&

                                <iframe

                                    src={
                                        getYoutubeEmbedUrl(
                                            question.video_url
                                        )
                                    }

                                    title="youtube"

                                    allowFullScreen

                                />

                                }



                            </div>






                            <div className="shorts-content">


                                <h2 className="shorts-title">

                                    {question.title}

                                </h2>



                                <p className="shorts-author">

                                    @{question.author}

                                </p>



                                <p className="shorts-question">

                                    {question.question_text}

                                </p>






                                <button

                                    className="shorts-choice"

                                    onClick={()=>
                                        submitAnswer(question,1)
                                    }

                                >

                                    {question.choice1}

                                </button>



                                <button

                                    className="shorts-choice"

                                    onClick={()=>
                                        submitAnswer(question,2)
                                    }

                                >

                                    {question.choice2}

                                </button>



                                <button

                                    className="shorts-choice"

                                    onClick={()=>
                                        submitAnswer(question,3)
                                    }

                                >

                                    {question.choice3}

                                </button>




                                <button

                                    className="shorts-choice"

                                    onClick={()=>
                                        submitAnswer(question,4)
                                    }

                                >

                                    {question.choice4}

                                </button>






                                {
                                answerResults[question.id] !== undefined &&


                                (

                                answerResults[question.id]

                                ?

                                <div className="correct">

                                    ✅ 정답입니다!

                                </div>


                                :

                                <div className="wrong">

                                    ❌ 오답입니다!

                                </div>

                                )

                                }



                            </div>







                            <div className="shorts-actions">


                                <button

                                    className="shorts-action-button"

                                    onClick={()=>
                                        toggleLike(question)
                                    }

                                >

                                    {question.liked ? "❤️":"🤍"}

                                    <br/>

                                    {question.like_count}

                                </button>




                                <button

                                    className="shorts-action-button"

                                    onClick={()=>
                                        fetchComments(question)
                                    }

                                >

                                    💬

                                    <br/>

                                    {question.comment_count}

                                </button>



                            </div>








                            {
                            showComments &&


                            <div className="comments-box">


                                <h3>
                                    댓글
                                </h3>



                                {
                                comments.map(comment=>(

                                    <div key={comment.id}>

                                        {comment.author}

                                        <p>
                                            {comment.text}
                                        </p>

                                    </div>

                                ))

                                }


                            </div>

                            }




                        </div>


                    </div>


                </SwiperSlide>


            ))

            }




            </Swiper>



        </div>

    );

};


export default ShortsPage;