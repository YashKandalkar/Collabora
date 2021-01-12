import {useState} from "react";

import {Form, Input, Button, Alert} from 'antd';


const AuthComponent = ({setLogin, supabase}) => {
    const [register, setRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [promptText, setPromptText] = useState({type: '', message: ''});

    const toggleRegister = () => {
        setRegister(!register)
    }

    const onFinish = async (values) => {
        setLoading(true);
        const {email, password} = values;
        const response =
            register
                ? await supabase.auth.signUp({email, password})
                : await supabase.auth.signIn({email, password});

        const {error, user} = response;
        setLoading(false);
        if (!error && !user) {
            setPromptText({type: "success", message: "An email has been sent to you for verification!"});
            setLogin(false);
        } else if (!error && user) {
            setLogin(true);
        }
        if (error) {
            setPromptText({type: "error", message: error.message});
            setLogin(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setLogin(false);
    };
    return (
        <div style={{maxWidth: 400, justifyContent: "center", height: "100%", display: "flex", alignItems: "center"}}>
            <Form
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                {register && <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email address!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                {Boolean(promptText.message) &&
                <Alert message={promptText.message} type={promptText.type} style={{marginBottom: "24px"}}/>}

                <div style={{display: "flex", justifyContent: "space-evenly"}}>
                    <Form.Item>
                        <Button type="secondary" onClick={toggleRegister}>
                            {register ? "Login" : "Register"}
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {register ? "Register" : "Login"}
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    )
}

export default AuthComponent;