import { useState, useEffect } from "react";
import styles from "./Home.module.css"
import LoginRegisterButton from "../Pages/LoginORRegisterButtons/LoginRegisterButton"
import PrimaryButton from "../components/Buttons/PrimaryButton/PrimaryButton"
import { useNavigate } from 'react-router-dom';
import ProcessingEffect from "../components/ProcessingEffect/ProcessingEffect"
import { Card, Pagination } from 'antd';
import { useAuth } from "../context/Auth.Context";
import { getAssets } from "../api/getAssets";

const { Meta } = Card;

const Home = () => {
    const { isLoggedIn, logout } = useAuth();
    const [assets, setAssets] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    const navigate = useNavigate();

    const fetchAssets = async (page) => {
        try {
            const response = await getAssets({page});
            setAssets(response.data)
            console.log(assets.totalPages)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        fetchAssets(currentPage)

    }, [currentPage])


    return (
        <div>
            <h1>Analyze Assets</h1>
            {isLoggedIn ? <PrimaryButton className={styles.LogoutButton} onClick={logout}>Вийти</PrimaryButton> : <LoginRegisterButton />}
            {loading ?
                <ProcessingEffect /> :
                (<div className={styles.container}>
                    {assets.data.map(asset => (
                        <Card
                            key={asset._id}
                            hoverable
                            className={styles.card}
                            cover={<img alt={asset.name} src={asset.image} />}
                            onClick={() => navigate(`/assets/${asset._id}`)
                        }
                        >
                            <Meta title={asset.symbol} description={asset.name} />
                        </Card>
                        
                    ))}
                    

                </div >)
            }
            <Pagination
                align="center"
                defaultCurrent={currentPage}
                pageSize={5}
                total={assets.total}
                onChange={ (page) => setCurrentPage(page)} />
            <br />
        </div>
    )
}

export default Home
