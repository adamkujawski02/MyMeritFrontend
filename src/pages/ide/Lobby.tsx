import { Client } from '@stomp/stompjs';
import { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import UserTaskDTO from '../../models/dtos/UserTaskDTO.ts';

interface LobbyDetails {
    id: string;
    opponentName: string;
    task: UserTaskDTO;
}

const Lobby = () => {
    const [queueStatus, setQueueStatus] = useState<string | null>(null);
    const [lobbyDetails, setLobbyDetails] = useState<LobbyDetails | null>(null);
    const [isInQueue, setIsInQueue] = useState<boolean>(false);
    const [client, setClient] = useState<Client | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);

    const [cookies] = useCookies(['user']);
    const userToken = cookies['user']?.accessToken;

    useEffect(() => {
        if (!userToken) return;

        // Create WebSocket connection
        const socket = new WebSocket('ws://localhost:8080/gs-guide-websocket');

        socket.onopen = () => {
            console.log('WebSocket connection established');
            setWs(socket);
        };

        socket.onerror = (err) => {
            console.error('WebSocket connection error:', err);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // Integrating STOMP client over WebSocket
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/gs-guide-websocket',
            connectHeaders: {
                login: 'user',
                passcode: 'password',
            },
            debug: (msg) => console.log(msg),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('STOMP Connected');
                stompClient.subscribe('/queue/match', (message) => {
                    const lobby: LobbyDetails = JSON.parse(message.body);
                    setLobbyDetails(lobby);
                    setQueueStatus('Match Found!');
                    setIsInQueue(false);
                });
            },
            onStompError: (frame) => console.error('STOMP Error:', frame),
        });

        stompClient.activate();
        setClient(stompClient);

        // Cleanup connection on component unmount
        return () => {
            if (stompClient.connected) stompClient.deactivate();
            if (socket.readyState === WebSocket.OPEN) socket.close();
        };
    }, [userToken]);

    const joinQueue = useCallback(() => {
        if (userToken && client && client.connected) {
            client.send('/app/joinQueue', {}, JSON.stringify({ token: userToken }));
            setQueueStatus('Joined the queue. Waiting...');
            setIsInQueue(true);
        }
    }, [client, userToken]);

    const findOpponent = useCallback(() => {
        if (userToken && client && client.connected) {
            client.send('/app/findOpponent', {}, JSON.stringify({ token: userToken }));
        }
    }, [client, userToken]);

    return (
        <div>
            <h1>Lobby</h1>
            {queueStatus && <p>Status: {queueStatus}</p>}

            {!isInQueue && <button onClick={joinQueue}>Join Queue</button>}
            {isInQueue && <button onClick={findOpponent}>Find Opponent</button>}

            {lobbyDetails && (
                <div>
                    <h2>Details</h2>
                    <p>Lobby ID: {lobbyDetails.id}</p>
                    <p>Opponent: {lobbyDetails.opponentName}</p>
                </div>
            )}
        </div>
    );
};

export default Lobby;