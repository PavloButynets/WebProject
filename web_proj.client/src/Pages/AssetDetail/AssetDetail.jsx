import { useEffect, useState } from "react";

import { Card, Typography, Spin, Pagination, List, message, Select } from 'antd';
import { useLocation } from 'react-router-dom';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton';
import styles from "./AssetDetail.module.css";
import { getNewsByAsset } from "../../api/getNewsByAsset";
import { getStatus } from '../../api/getStatus';
import { analyzeByNews } from '../../api/analize';
import { getHistory } from "../../api/getHistory";
import { format } from 'date-fns';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

    const [newsForAnalysis, setNewsForAnalysis] = useState(5); // Default to 5 articles
    const [currentPage, setCurrentPage] = useState(1);
    const [analysisHistory, setAnalysisHistory] = useState([]);


    const [ currentPage, setCurrentPage] = useState(1);

    const fetchAssetDetail = async () => {
        if (!asset) {
            console.error("Актив не знайдено в стані.");

            setLoading(false);
            return;
        }

        try {

            setLoading(true);

            const response = await getNewsByAsset(`asset=${asset.name}&page=${currentPage}`);
            setAssetNews(response.data);
        } catch (error) {
            console.error("Error fetching asset news:", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchAnalysisHistory = async () => {
        if (!asset) {
            console.error("Asset not found in state.");
            return;
        }

        try {
            const response = await getHistory(asset.name);
            setAnalysisHistory(response.data);
        } catch (error) {
            console.error("Error fetching analysis history:", error);
        }
    };

    useEffect(() => {
        fetchAssetDetail();
    }, [currentPage]);

    useEffect(() => {
        fetchAnalysisHistory();
    }, []);

    const handleAnalyzeClick = async () => {
        try {
            const response = await analyzeByNews(asset.name, newsForAnalysis);
            console.log(response.data);
            message.success(response.data.message);

            const newAnalysis = {
                asset: asset.name,
                status: "Start of analysis",
                analyzedAt: new Date(),
                result: null,
            };
            setAnalysisHistory(prev => [newAnalysis, ...prev]);

            await delay(12000);

            await pollAnalysisStatus();
        } catch (error) {
            console.error("Error fetching asset news:", error);
        }
    };

    const pollAnalysisStatus = async () => {
        while (true) {
            try {
                const response = await getStatus(asset.name);
                console.log(response.data);

                setAnalysisHistory(prev => {
                    const lastAnalysis = prev[0];
                    if (lastAnalysis) {
                        return [
                            {
                                ...lastAnalysis,
                                status: response.data.status,
                                analyzedAt: new Date(),
                                result: response.data.result || lastAnalysis.result,
                            },
                            ...prev.slice(1),
                        ];
                    }
                    return prev;
                });

                if (response.data.status === 'completed') {
                    message.success("Analysis completed");
                    const completedAnalysis = {
                        asset: asset.name,
                        status: "Analysis completed",
                        analyzedAt: new Date(),
                        result: response.data.result,
                    };
                    setAnalysisHistory(prev => [...prev, completedAnalysis]);
                    break;
                } else if (response.data.status === 'error') {
                    message.error("Analysis failed");
                    break;
                }

                await delay(10000);
            } catch (error) {
                console.error("Error fetching analysis status:", error);
                break;
            }
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

                {assetNews && (
                    <>
                        <Pagination
                            align="center"
                            defaultCurrent={currentPage}
                            pageSize={5}
                            total={assetNews.total}
                            onChange={(page) => setCurrentPage(page)} />
                        <br />
                    </>
                )}


            </Card>
            <Card className={styles.card}>
                <img src={asset.image} alt={asset.name} className={styles.image} />
                <Title level={2}>{asset.name} ({asset.symbol})</Title>
                <p><strong>Price:</strong> ${asset.price.toLocaleString()}</p>
                <p><strong>Market Cap:</strong> ${asset.market_cap.toLocaleString()}</p>
                <p><strong>Category:</strong> {asset.category}</p>
                <p><strong>Description:</strong> {asset.description}</p>


                <Select
                    defaultValue={5}
                    style={{ width: 120, marginBottom: 16 }}
                    onChange={(value) => setNewsForAnalysis(value)}
                >
                    {[5, 10, 15, 20, 30, 40, 50].map(value => (
                        <Option key={value} value={value}>{value}</Option>
                    ))}
                </Select>

                <PrimaryButton className={styles.analyzeButton} onClick={handleAnalyzeClick}>Analyze by news</PrimaryButton>
            </Card>
            <Card className={styles.card}>
                <div className={styles.analyseResultPlaceholder}>
                    <Title level={4}>History of analyzes</Title>
                    <List
                        itemLayout="vertical"
                        dataSource={analysisHistory}
                        renderItem={analysis => (
                            <List.Item key={analysis.analyzedAt}>
                                <Title level={5}>{analysis.asset}</Title>
                                <Paragraph>{analysis.status}</Paragraph>
                                <span className={styles.publishedAt}>
                                    {format(new Date(analysis.analyzedAt), 'dd MMMM yyyy, HH:mm')}
                                </span>
                                {analysis.result && (
                                    <Paragraph><strong>Result:</strong> {analysis.result}</Paragraph>
                                )}
                            </List.Item>
                        )}
                    />
                </div>

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
