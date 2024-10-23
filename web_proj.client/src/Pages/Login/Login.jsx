import styles from "./Login.module.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CloseWindowButton from "../../components/Buttons/CloseWindowButton/CloseWindowButton";
import ProcessingEffect from "../../components/ProcessingEffect/ProcessingEffect";
import { signIn } from "../../api/login";
import { useAuth } from "../../context/Auth.Context"; 

import { Button, Form, Input, message } from "antd";




const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const SignUp = () => {
    const [form] = Form.useForm();
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [username, setNickname] = useState("");
    const { login } = useAuth();

    const handleSubmit = async () => {
        const userData = {
            username,
            password,
        };
        try {
            setProcessing(true);
            const response = await signIn(userData)
            console.log("Response from login:", response);
            if (response.data.success) {
                const accessToken = response?.data?.token;
                login(accessToken)
                message.success("Registration successfull")
                navigate('/');
            }else{
                message.error( response.data.message || "Registration failed")
            }
            
        } catch (err) {
            if (!err.response) {
                console.log("Error occurred:", err); 
                message.error("No server response");
            } else {
                const status = err.response.status;
                const errorMessage = err.response.data.message || "An error occurred";
                message.error(`Error ${status}: ${errorMessage}`);
            }
        } finally {
            setProcessing(false);
        }
    };
    return (
        <>
            {processing && <ProcessingEffect />}
            <div className={styles.outerContainer}>
                <div className={styles.container}>
                    <div className={styles.Buttons}>
                        <CloseWindowButton onClick={() => navigate("/")} />
                    </div>
                    <Form
                        className={styles.SignUpForm}
                        labelCol={{ span: 24 }} // Лейбл займає всю ширину
                        wrapperCol={{ span: 24 }} // Поле вводу також займає всю ширину
                        form={form}
                        name="register"
                        onFinish={handleSubmit}
                        initialValues={{}}
                        style={{
                            maxWidth: 600,
                        }}
                        scrollToFirstError
                    >
                        <h1 style={{ margin: "15px 0px" }}>Login</h1>

                       

                        <Form.Item
                            name="nickname"
                            label="Nickname"
                            tooltip="What do you want others to call you?"
                            className={styles.Item}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your nickname!",
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input
                                className={styles.Input}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Your Nick Name"
                            />
                        </Form.Item>
                        <Form.Item
                            className={styles.Item}
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    //validator: checkPassword,
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                className={styles.Input}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout} className={styles.Item}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={styles.customButton}
                            >
                                Login
                            </Button>
                            <span style={{ marginTop: "10px" }}>
                                Do not have an account yet <Link to="/signup">Regiter</Link>
                            </span>
                        </Form.Item>
                    </Form>

                </div>
            </div>
        </>
    );
};

export default SignUp;
