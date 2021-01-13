import {Typography, Empty} from 'antd';

const {Title, Text} = Typography;

const Home = () => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-around",
            textAlign: "center"
        }}>
            <div>
                <Title level={3}>Creating forms is not yet implemented for public!</Title>
                <Text>Ask the admin for a link of an open form!</Text>
            </div>
            <Empty description={""}/>
        </div>
    )
}

export default Home;