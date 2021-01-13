import {useState, useEffect} from "react";
import {supabase} from './utils/initSupabase';
import {Layout, Button, Tooltip, Typography} from 'antd';
import {LogoutOutlined} from "@ant-design/icons";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import 'antd/dist/antd.css';
import './App.css';
import AuthComponent from "./components/Auth";
import FormSolve from "./pages/FormSolve";
import Home from "./pages/Home";

const {Header, Content, Footer} = Layout;
const {Link} = Typography;

function App() {
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        let mounted = true;
        let authListener;
        if (mounted) {
            const session = supabase.auth.session();
            setUser(session?.user ?? null);

            const {data} = supabase.auth.onAuthStateChange(
                async (event, session) => {
                    const currentUser = session?.user;
                    setUser(currentUser ?? null);
                    if (currentUser) {
                        setLogin(true);
                    }
                }
            )
            authListener = data;
            if (user) {
                setLogin(true);
            }
        }
        return () => {
            mounted = false;
            authListener.unsubscribe()
        }
    }, [user])

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
                                {login ? <FormSolve user={user} supabase={supabase}/> :
                                    <AuthComponent setLogin={setLogin} setUser={setUser} supabase={supabase}/>}
                            </Route>
                            <Route path="/">
                                {login ? <Home user={user}/> :
                                    <AuthComponent setLogin={setLogin} setUser={setUser} supabase={supabase}/>}
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
