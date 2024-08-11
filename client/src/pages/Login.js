import React, { useState, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/LoginPage.css";

const Login = () => {
    const img = "https://img.freepik.com/free-vector/flat-design-credit-assessment-concept_23-2149154572.jpg?size=626&ext=jpg&ga=GA1.1.1934738218.1723326938&semt=ais_hybrid";
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (values) => {
        try {
            setLoading(true);
            const { data } = await axios.post('https://expense-management-u19n.onrender.com/api/v1/users/login', values);
            setLoading(false);
            message.success('Login successful');
            localStorage.setItem("user", JSON.stringify({ ...data.user, password: "" }));
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.error("Error during login:", error);
            message.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <>
            <div className="login-page">
                {loading && <spinner />}
                <div className="row container">
                    <h1 className='text-exp'>Expense Management System</h1>
                    <div className="col-md-6">
                        <img src={img} alt="login-img" width={"100%"} height="100%" />
                    </div>
                    <div className="col-md-4 login-form">
                        <Form layout="vertical" onFinish={submitHandler}>
                            <h1>Login Form</h1>
                            <Form.Item label="Email" name="email">
                                <Input type="email" required />
                            </Form.Item>
                            <Form.Item label="Password" name="password">
                                <Input type="password" required />
                            </Form.Item>
                            <div className="d-flex justify-content-between">
                                <Link to="/register">Not a user? Click Here to register!</Link>
                                <button className="btn">Login</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
