import { useEffect, useState } from "react";
import { Card, Typography, Spin, Pagination, List } from 'antd';
import { useLocation } from 'react-router-dom';
import PrimaryButton  from '../../components/Buttons/PrimaryButton/PrimaryButton'
import styles from "./AssetDetail.module.css";
import { getNewsByAsset } from "../../api/getNewsByAsset";
import { format } from 'date-fns';

const { Title, Paragraph } = Typography;

const AssetDetail = () => {
    const location = useLocation();
    const asset = location.state?.asset;
    const [loading, setLoading] = useState(true);
    const [assetNews, setAssetNews] = useState([]);
    const [ currentPage, setCurrentPage] = useState(1);

    const fetchAssetDetail = async () => {
        if (!asset) {
            console.error("Актив не знайдено в стані.");
            setLoading(false);
            return;
        }

        try {
            const response = await getNewsByAsset(`asset=${asset.name}&page=${currentPage}`);
            setAssetNews(response.data);
        } catch (error) {
            console.error("Error fetching asset news:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchAssetDetail(currentPage)

    }, [currentPage])

    if (loading) return <Spin size="large" className={styles.loading} />;

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
            <div className={styles.newsPlaceholder}>
                    <Title level={4}>Latest News</Title>
                    {assetNews.articles.length > 0 ? (
                        <List
                            itemLayout="vertical"
                            dataSource={assetNews.articles}
                            renderItem={news => (
                                <List.Item key={news.id}>
                                    <Title level={5}>{news.title}</Title>
                                    <Paragraph>{news.summary}</Paragraph> 
                                    <div className={styles.newsFooter}>
                                        <a href={news.url} target="_blank" rel="noopener noreferrer">Read more</a>
                                        <span className={styles.publishedAt}>
                                            {format(new Date(news.publishedAt), 'dd MMMM yyyy, HH:mm')}
                                        </span>
                                    </div>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Paragraph>No news available for this asset.</Paragraph>
                    )}
                </div>
                {assetNews &&
                <>
                    <Pagination
                        align="center"
                        defaultCurrent={currentPage}
                        pageSize={5}
                        total={assetNews.total}
                        onChange={(page) => setCurrentPage(page)} />
                    <br />
                </>}
            </Card>
            <Card className={styles.card}>
                <img src={asset.image} alt={asset.name} className={styles.image} />
                <Title level={2}>{asset.name} ({asset.symbol})</Title>
                <p><strong>Price:</strong> ${asset.price.toLocaleString()}</p>
                <p><strong>Market Cap:</strong> ${asset.market_cap.toLocaleString()}</p>
                <p><strong>Category:</strong> {asset.category}</p>
                <p><strong>Description:</strong> {asset.description}</p>
                <PrimaryButton className={styles.analyzeButton}>Analyze by news</PrimaryButton>
               
            </Card>
            <Card className={styles.card}>
            <div className={styles.analyseResultPlaceholder}>
            <Title level={4}>History of analyzes</Title>
            </ div>
            </Card>
        </div>
    );
};

export default AssetDetail;
