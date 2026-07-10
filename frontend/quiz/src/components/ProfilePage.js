import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const [myQuestions, setMyQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyQuestions = async () => {
            const token = localStorage.getItem("access");

            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/api/quizzes/questions/my_questions/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setMyQuestions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyQuestions();
    }, []);

    if (loading) {
        return <h2>불러오는 중...</h2>;
    }

    return (
        <div className="container mt-4">
            <h2>내가 작성한 게시글</h2>

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