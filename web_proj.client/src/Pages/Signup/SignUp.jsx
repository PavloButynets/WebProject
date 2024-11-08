import styles from "./SignUp.module.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CloseWindowButton from "../../components/Buttons/CloseWindowButton/CloseWindowButton";
import ProcessingEffect from "../../components/ProcessingEffect/ProcessingEffect";
import { register } from "../../api/signUp";
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
        console.log(userData)
        try {
            setProcessing(true);
            const response = await register(userData)
            console.log("Response from register:", response);
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
                        <h1 style={{ margin: "15px 0px" }}>Register</h1>

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

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={["password"]}
                            hasFeedback
                            className={styles.Item}
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your password!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("The new password do not match!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

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


                        <Form.Item {...tailFormItemLayout} className={styles.Item}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className={styles.customButton}
                            >
                                Register
                            </Button>
                            <span style={{ marginTop: "10px" }}>
                                Already have an account? <Link to="/login">Login</Link>
                            </span>
                        </Form.Item>
                    </Form>

                </div>
            </div>
        </>
    );
};

export default SignUp;
