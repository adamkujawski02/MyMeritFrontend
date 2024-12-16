import { Client } from '@stomp/stompjs';
import { useState, useEffect, useCallback } from 'react';
import UserTaskDTO from '../../models/dtos/UserTaskDTO.ts';
import {useAuth} from "../../hooks/useAuth.tsx";
import {User} from "@types";
import Ide from "../../components/editor_workspace/components/ide/Ide.tsx";
import MyFile from "../../models/MyFile.ts";
import {ContentType} from "../../components/editor_workspace/utils/fileUtils.ts";
import {httpCall} from "../../api/HttpClient.ts";

interface LobbyDetails {
    id: string;
    recipient: User;
    sender: User;
    task: UserTaskDTO;
}

const Lobby = () => {
    const [queueStatus, setQueueStatus] = useState<string | null>(null);
    const [lobbyDetails, setLobbyDetails] = useState<LobbyDetails | null>(null);
    const [isInQueue, setIsInQueue] = useState<boolean>(false);
    const [client, setClient] = useState<Client | null>(null);
    const {accessToken, userData} = useAuth();

    useEffect(() => {
        if (!accessToken) return;


        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: { Authorization: `Bearer ${accessToken}` },
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


        return () => {
            if (stompClient.connected) stompClient.deactivate();
        };
    }, []);

    const joinQueue = useCallback(() => {
        if (accessToken && client && client.connected) {
            client.publish({destination: '/app/findMatch', headers: { Authorization: `Bearer ${accessToken}` },
                body:    JSON.stringify({ id: userData!.id}) }
            );
            setQueueStatus('Joined the queue. Waiting...');
            setIsInQueue(true);
        }
    }, [client, userData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(userData && userData.id){

                    const URL = import.meta.env.VITE_API_URL + "/maintainLobby?id=" + userData!.id
                    const response = await httpCall<LobbyDetails>({
                        url: URL,
                        method: "GET",
                    }); console.log(response);
                    if(Object.values(response).length > 0){setLobbyDetails(response)}

                }



            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, [userData]);
   console.log(lobbyDetails)
    return (
        <div>
            <h1>Lobby</h1>
            {queueStatus && <p>Status: {queueStatus}</p>}

            {!isInQueue && <button onClick={joinQueue}>Join Queue</button>}

            {lobbyDetails && (
                <div>

                    <Ide
                        files={[
                            new MyFile("main.js",ContentType.TXT, btoa("console.log('Hello World');")),
                        ]}
                        currentFileIndex={0}
                        setFiles={(updatedFiles: MyFile[]) => {
                            console.log("Updated files:", updatedFiles);
                        }}
                        currentLanguage= {"JAVASCRIPT"}
                        setAsMain={(index: string) => {
                            console.log(`File ${index} set as main`);
                        }}
                        mainFileIndex={0}
                        isEditable={true}
                        isFeedbackView={false}
                        originalFiles={[
                            new MyFile("main.js", "text/javascript", btoa("console.log('Original Code');")),
                        ]}
                        submitComponent={<button onClick={() => console.log("Solution submitted!")}>Submit</button>}
                        task={
                            new UserTaskDTO(
                                "task1",
                                "Sample Task",
                                "Implement the function to solve the task.",
                                new Date(),
                                new Date(Date.now() + 86400000),
                                100,
                                ["javascript", "python"],
                                200000,
                                15.0,
                                "OPEN",
                                null,
                                [],
                                "job-123",
                                null
                            )
                        }
                        submitSolution={() => console.log("Solution submitted")}
                    />)

                </div>
            )}
        </div>
    );
};

export default Lobby;