import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";

const Vote = () => {
    const { id } = useParams();

    const [voteTitleState, setVoteTitleState] = useState("");
    const [voteAnswersState, setVoteAnswesState] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/api/poll/${id}`)
            .then(response => response.json())
            .then(data => {
                setVoteTitleState(data.poll.name);
                setVoteAnswesState(data.answers);
            })
            .catch(err => console.log(err))

        const socket = io(`http://localhost:3001/?poll_id=${id}`);
        socket.on("vote", message => {
            setVoteAnswesState([...message.answers])
        })
        return () => {
            socket.close()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const vote = (answer_id) => {
        fetch(`http://localhost:3001/api/poll/${id}/${answer_id}`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                //setVoteAnswesState(data.answers);
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="grid place-items-center mt-20">
            <div>
                <span className="text-3xl font-bold">{voteTitleState}</span>
            </div>
            <div className="mt-10">
                <ul>
                    {
                        voteAnswersState.map(answer => {
                            return(
                                <li onClick={() => vote(answer.id)} className="border-2 p-5 shadow-md font-bold mt-5 cursor-pointer hover:scale-110" key={answer.id}>
                                    ({answer.votes}) {answer.name}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="my-10 font-bold">
                <Link to={"/"}>
                    <span>Go back</span>
                </Link>
            </div>
        </div>
    );
}

export default Vote;
