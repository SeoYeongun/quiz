import { useEffect, useState } from 'react';
import axios from 'axios';

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access');

      const response = await axios.get(
        'http://localhost:8000/api/users/me/',
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('access')}`
          },
        }
      );

      setUser(response.data);
    };

    fetchUser();
  }, []);

  return (
    <div>
      {user ? (
        <h1>{user.username}</h1>
      ) : (
        <p>로딩중...</p>
      )}
    </div>
  );
}

export default ProfilePage;