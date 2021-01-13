import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Typography, Spin, Divider, Alert} from "antd";
import Question from "../components/Question";

const {Title, Paragraph} = Typography;

const FormSolve = ({supabase, user}) => {
    const {id} = useParams();
    const [formData, setFormData] = useState(null)
    const [formError, setFormError] = useState(null)
    const [questionsData, setQuestionsData] = useState(null);
    const [lastVotes, setLastVotes] = useState({});

    useEffect(() => {
        let mounted = true;
        let questionsSubscription;

        async function getForm(setFormData, setFormError) {
            const arrToObj = (arr) => {
                if (Array.isArray(arr)) {
                    const obj = {};
                    for (const i of arr) {
                        obj[i.question_number] = i;
                    }
                    return obj;
                } else {
                    return arr;
                }
            }
            if (mounted) {
                const {data, error} = await supabase
                    .from('forms')
                    .select('*')
                    .eq('unique_id', Number(id.substr(1)));
                if (!error) {
                    setFormData(data[0]);
                    const ques = await supabase
                        .from('questions')
                        .select()
                        .eq('form_id', data[0].id)
                    questionsSubscription = supabase
                        .from('questions')
                        .on('UPDATE', payload => {
                            setQuestionsData(state => {
                                if (state) {
                                    let newQues = {...state};
                                    newQues[payload.new.question_number] = payload.new;
                                    return {...state, ...newQues};
                                } else {
                                    console.error("An error occurred.")
                                }
                            });
                        })
                        .subscribe()
                    const votes = await supabase
                        .from('votes')
                        .select("option, question_id, question_number")
                        .match({user_id: user.id, form_id: data[0].id})

                    if (votes.error) {
                        console.log(votes.error)
                    }

                    const votesObj = {};

                    for (const i of votes.data) {
                        votesObj[i.question_number] = i;
                    }
                    setLastVotes(votesObj);
                    setQuestionsData(arrToObj(ques.data))
                } else {
                    setFormError(error);
                }
            }
        }

        getForm(setFormData, setFormError).catch(console.log);

        return () => {
            mounted = false;
            questionsSubscription.unsubscribe();
        };
    }, [id, supabase, user.id]);

    const onAnswerSet = async (qNum, ans, curr_col_name, last_col_name, last_opt_val) => {
        const {data, error} = await supabase
            .from("questions")
            .select()
            .match({form_id: formData.id, question_number: qNum})
        if (error) return;
        if (!last_opt_val) {
            await supabase
                .from("questions")
                .update({
                    [curr_col_name]: data[0][curr_col_name] + 1,
                })
                .match({form_id: formData.id, question_number: qNum})

            const {error} = await supabase
                .from("votes")
                .insert({
                    user_id: user.id,
                    question_id: questionsData[qNum].id,
                    form_id: formData.id,
                    option: ans,
                    question_number: qNum
                })
            error && console.log(error)
        } else {
            await supabase
                .from("questions")
                .update({
                    [curr_col_name]: data[0][curr_col_name] + 1,
                    [last_col_name]: data[0][last_col_name] - 1
                })
                .match({form_id: formData.id, question_number: qNum})
            await supabase
                .from("votes")
                .update({option: ans})
                .match({user_id: user.id, question_id: questionsData[qNum].id, form_id: formData.id})
        }
    }

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Title>{formData ? formData.name : (formError ? "Error fetching form" : "Fetching form...")}</Title>
            {formData && <Paragraph>{formData.description}</Paragraph>}
            <Alert
                message="If you are not able to see the secondary axis properly, just reload the page."
                type="info"
                showIcon
            />
            <Divider/>
            {formData
                ? (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {questionsData && Object.values(questionsData).map((ele, ind) => {
                            return (
                                <Question
                                    setAnswer={onAnswerSet}
                                    number={ind}
                                    key={ind}
                                    a={ele.a_votes}
                                    b={ele.b_votes}
                                    c={ele.c_votes}
                                    d={ele.d_votes}
                                    lastVote={
                                        lastVotes[ele.question_number]
                                            ? lastVotes[ele.question_number].option
                                            : null
                                    }
                                />
                            )
                        })}
                    </div>
                )
                : (
                    <div style={{height: "100%", display: "flex", justifyContent: "center", alignItems: "centers"}}>
                        {formError ? "Error fetching form" : <Spin size={"large"}/>}
                    </div>
                )
            }
        </div>
    )
}
export default FormSolve;