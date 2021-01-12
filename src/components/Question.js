import {useMemo, useState} from "react"
import {Card, Radio} from 'antd';
import {Chart} from 'react-charts';

const Question = ({number, setAnswer, lastVote = null, a = 0, b = 0, c = 0, d = 0}) => {
    const [selected, setSelected] = useState(lastVote);
    const plainOptions = ["A", "B", "C", "D"]
    const chartData = useMemo(() => [
            {
                label: 'Votes',
                data: [['A', a], ['B', b], ['C', c], ['D', d]]
            }
        ], [a, b, c, d]
    )

    const series = useMemo(
        () => ({
            type: 'bar'
        }),
        []
    )

    const axes = useMemo(
        () => [
            {primary: true, type: 'ordinal', position: 'bottom'},
            {position: 'left', type: 'linear', stacked: true, secondary: true}
        ],
        []
    )

    const onRadioChange = ({target: {value}}) => {
        setAnswer(number, value, value.toLowerCase() + "_votes", selected ? selected.toLowerCase() + "_votes" : null, Boolean(selected))
        setSelected(value);
    }

    return (
        <Card title={"Question " + (number + 1)} style={{width: 300, margin: "12px 0"}}>
            <p>Total Votes: {a + b + c + d}</p>
            <div style={{width: "90%", height: 200}}>
                <Chart data={chartData} series={series} axes={axes} tooltip/>
            </div>
            <Radio.Group options={plainOptions} onChange={onRadioChange} value={selected} style={{marginLeft: 32}}/>
        </Card>
    )
}

export default Question;