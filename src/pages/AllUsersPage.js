import React, {useState, useEffect} from 'react';
import SingleUser from "../components/SingleUser";
import http from "../plugins/http.js";
import useStore from "../store/mainStore";

const AllUsersPage = ({setConversationsCount}) => {
    const [users, setUsers] = useState([])
    const [error, setError] = useState(null);

    const currentUser = useStore((state) => state.user?.username);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await http.get("/allUsers");
                if (!res.error) {
                    setUsers(res.data);
                } else {
                    setError(res.message || 'Failed to fetch users');
                }
            } catch (err) {
                setError('Error fetching users: ' + err.message);
            }
        };

        fetchUsers();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className="d-flex flex-wrap">
            {users.length > 0 ? (
                users.map((user, index) =>
                    <SingleUser key={user.user_id || index} user={user}
                                isCurrentUser={user.username === currentUser} />)
            ) : (
                <p>No users yet.</p>
            )}
            </div>
        </div>
    );
};

export default AllUsersPage;