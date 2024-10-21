import LoginRegisterButton from "../Pages/LoginORRegisterButtons/LoginRegisterButton"
import { useAuth } from "../context/Auth.Context";
import { test } from "../api/test";

const Home = () => {
    const { isLoggedIn, logout } = useAuth();

    const handleSubmit = async () => {

        try {
            const response = await test()
            if (response.data.success) {
                const accessToken = response?.data?.token;
            }
            
        } catch (err) {
            if (!err.response) {
                console.log("Error occurred:", err); 
            } else {
                console.log("Error occurred:", err.response);
                const status = err.response.status;
                const errorMessage = err.response.data.message || "An error occurred";
            }
        }
    };

    return (
        <>
            <h1>Home</h1>
            {isLoggedIn ?  <button onClick={logout}>Вийти</button> :<LoginRegisterButton /> }
            <button onClick={handleSubmit}>Вийти</button>
        </>
    )
}

export default Home
