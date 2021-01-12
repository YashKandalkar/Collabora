import {useState} from "react";
import 'antd/dist/antd.css';
import {supabase} from './utils/initSupabase';
import {Layout, Button, Tooltip, Typography} from 'antd';
import {LogoutOutlined} from "@ant-design/icons";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import AuthComponent from "./components/Auth";
import './App.css';
import FormSolve from "./pages/FormSolve";
import Home from "./pages/Home";

const {Header, Content, Footer} = Layout;
const {Link} = Typography;

function App() {
    const [login, setLogin] = useState(false);
    const onLogoutClick = async () => {
        await supabase.auth.signOut();
        setLogin(false);
    }
    return (
        <Router>
            <Layout className="layout" style={{minHeight: "100vh"}}>
                <Header style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div className="logo" style={{fontSize: 24, color: "#eee"}}>Collabora</div>
                    {login && <Tooltip title="Logout">
                        <Button type="primary" icon={<LogoutOutlined/>} onClick={onLogoutClick}>Logout</Button>
                    </Tooltip>}
                </Header>
                <Content style={{
                    padding: '0 50px',
                    margin: "32px 0",
                    display: "flex",
                    justifyContent: "center",
                }}>
                    <div className="site-layout-content" style={{justifyContent: "center", display: "flex"}}>
                        <Switch>
                            <Route path="/form:id">
                                {login ? <FormSolve supabase={supabase}/> :
                                    <AuthComponent setLogin={setLogin} supabase={supabase}/>}
                            </Route>
                            <Route path="/">
                                {login ? <Home/> : <AuthComponent setLogin={setLogin} supabase={supabase}/>}
                            </Route>
                        </Switch>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    Collabora ©2021 Created by &nbsp;
                    <Link href="https://www.github.com/YashKandalkar" target="_blank">
                        YashKandalkar
                    </Link>
                </Footer>
            </Layout>
        </Router>
    );
}

export default App;
