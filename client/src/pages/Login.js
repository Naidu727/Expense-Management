import React, { useState, useEffect } from 'react';
import { Form, Input, message, Button, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Password from 'antd/es/input/Password';
import "../styles/LoginPage.css";
import axios from 'axios';

const Login = () => {
  const img = "https://juntrax.com/blog/wp-content/uploads/2020/10/Expenses-Management-System-Featured-Juntrax.jpg";
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/users/login', values);
      setLoading(false);
      message.success('Login successful');
      localStorage.setItem("user", JSON.stringify({ ...data.user, password: "" }));
      navigate('/');
    } catch (error) {
      setLoading(false);
      message.error('Something went wrong');
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
        {Loading && <Spin />}
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
                <Password required />
              </Form.Item>
              <div className="d-flex justify-content-between">
                <Link to="/register">
                  Not a user? Click Here to register!
                </Link>
                <Button type="primary" htmlType="submit">Login</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
