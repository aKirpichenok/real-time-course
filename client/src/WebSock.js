import React, { useRef, useState } from 'react';
import axios from "axios";

const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef()
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState('')

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
        }

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }

        socket.current.onoclose = () => {
            console.log('SOcket closed')
        }

        socket.current.onerror = () => {
            console.log('Socket has Error')
        }
    }


    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }

        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected) {
        return (
            <div className='center'>
                <div className='form'>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder='Enter your name'
                    />
                    <button onClick={connect}>Enter</button>
                </div>

            </div>
        )
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text" />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className="connection_message">
                                    User {mess.username} connected
                                </div>
                                : <div className="message">
                                    {mess.username}: {mess.message}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSock;