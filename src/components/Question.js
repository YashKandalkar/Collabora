import {useState} from "react"
import {Card, Radio} from 'antd';
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

const Question = ({number, setAnswer, lastVote = null, a = 0, b = 0, c = 0, d = 0}) => {
    const [selected, setSelected] = useState(lastVote);
    const plainOptions = ["A", "B", "C", "D"]
    const chartData = [
        {
            name: 'A', votes: a,
        },
        {
            name: 'B', votes: b,
        },
        {
            name: 'C', votes: c,
        },
        {
            name: 'D', votes: d,
        },

    ];


    const onRadioChange = ({target: {value}}) => {
        setAnswer(number, value, value.toLowerCase() + "_votes", selected ? selected.toLowerCase() + "_votes" : null, Boolean(selected))
        setSelected(value);
    }

    return (
        <Card title={"Question " + (number + 1)} style={{width: 300, margin: "12px 0"}}>
            <p>Total Votes: {a + b + c + d}</p>
            <ResponsiveContainer width={"100%"} height={200}>
                <BarChart
                    data={chartData}
                    barCategoryGap={"20%"}
                    margin={{
                        top: 0, right: 0, left: 0, bottom: 0,
                    }}
                >
                    <XAxis dataKey="name"/>
                    <YAxis allowDecimals={false}/>
                    <Tooltip/>
                    <Bar dataKey="votes" fill="#001529"/>
                </BarChart>
            </ResponsiveContainer>
            <Radio.Group options={plainOptions} onChange={onRadioChange} value={selected} style={{marginLeft: 36}}/>
        </Card>
    )
}

export default Question;