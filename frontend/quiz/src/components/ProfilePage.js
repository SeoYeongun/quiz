import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [myQuestions, setMyQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("access");

            try {
                // 사용자 정보
                const userRes = await axios.get(
                    "http://127.0.0.1:8000/api/users/me/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser(userRes.data);

                // 내가 작성한 게시글
                const questionRes = await axios.get(
                    "http://127.0.0.1:8000/api/quizzes/questions/my_questions/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setMyQuestions(questionRes.data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <h2>불러오는 중...</h2>;
    }

    return (
        <div className="container mt-4">

            <h2>마이페이지</h2>

            {user && (
                <div className="mb-4">
                    <h4>👤 이름: {user.username}</h4>
                </div>
            )}

            <h3>내가 작성한 게시글</h3>

            {myQuestions.length === 0 ? (
                <p>작성한 게시글이 없습니다.</p>
            ) : (
                myQuestions.map((question) => (
                    <div
                        key={question.id}
                        className="card mb-3"
                        style={{
                            cursor: "pointer",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            marginBottom: "10px",
                        }}
                        onClick={() => navigate(`/solve/${question.id}`)}
                    >
                        <div className="card-body">
                            <h5>{question.title}</h5>
                            <p>{question.question_text}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Profile;