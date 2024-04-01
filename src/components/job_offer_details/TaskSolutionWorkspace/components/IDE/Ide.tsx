import MyEditor from "./components/MyEditor";
import TerminalOutput from "./components/TerminalOutput";
import React, {useState} from "react";
import MyFile from "../../../../../models/MyFile";
import TerminalInput from "./components/TerminalInput";
import CodeExecutionOutput from "../../../../../models/CodeExecutionOutput";
import RunButton from "./components/RunButton";
import Timer from "./components/Timer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpRightAndDownLeftFromCenter} from "@fortawesome/free-solid-svg-icons/faUpRightAndDownLeftFromCenter";
import {faDownLeftAndUpRightToCenter} from "@fortawesome/free-solid-svg-icons/faDownLeftAndUpRightToCenter";
import {faShield} from "@fortawesome/free-solid-svg-icons";
import {ContentType} from "../../utils/fileUtils";

interface IdeProps {
    files: MyFile[];
    currentFileIndex: number;
    setFiles: (files: MyFile[]) => void;
}

const Ide: React.FC<IdeProps>= ({files, currentFileIndex, setFiles, submitSolution, taskClosesAt, taskMemoryLimit, taskTimeLimit, setAsMain, mainFileIndex}) => {
    const [output, setCodeOutput] = useState<CodeExecutionOutput>(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isMaxSize, setIsMaxSize] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const currentFile = files[currentFileIndex];

    return (
        <div className="flex flex-col md:flex-col flex-grow flex-1 gap-3 h-full max-h-[calc(100%-40px)] ">
                <div className={"min-h-[40vh] flex-1"}>
                    <MyEditor
                        files={files}
                        currentFileIndex={currentFileIndex}
                        setFiles={setFiles}
                        isMaxSize={isMaxSize}
                    />

                    <div className="relative">
                        <button
                            className="hidden lg:block absolute bg-task-bck top-[-2.5rem] left-[calc(100%-2.5rem)]  p-2 rounded shadow-md hover:bg-main-lighter-2"
                            onClick={() => setIsMaxSize(!isMaxSize)}
                        >
                            <FontAwesomeIcon
                                icon={isMaxSize ? faDownLeftAndUpRightToCenter : faUpRightAndDownLeftFromCenter}
                            />
                        </button>
                        {currentFile.type == ContentType.TXT &&
                            <button
                                disabled={(currentFileIndex === mainFileIndex)}
                                className={"absolute left-[calc(100%-2.5rem)] bg-task-bck top-[-2.5rem] lg:left-[calc(100%-5rem)] p-2 rounded shadow-md hover:bg-main-lighter-2 " + ((currentFileIndex === mainFileIndex) ? " text-emerald-400" : "")}
                                onClick={() => setAsMain(currentFile.name)}
                            >
                                <FontAwesomeIcon
                                    icon={faShield}
                                />
                            </button>
                        }
                    </div>
                </div>
                <div className={"flex w-full gap-3 h-[40%] flex-col md:flex-row " + (isMaxSize ? " flex lg:hidden " : " flex")}>
                    <TerminalOutput
                        output={output}
                        loading={loading}
                        setOutput={setCodeOutput}
                    />
                    <div className="flex md:flex-col flex-col-reverse w-full md:w-1/2 gap-3 h-full">
                        <div className="flex gap-3 flex-1">
                            <div className="flex w-[60%] items-center gap-3 h-full text-sm  justify-center rounded border-task-lighter">
                                <div className="flex w-[2.5rem] h-full rounded ">
                                    <RunButton
                                        file={currentFile}
                                        setCodeOutput={setCodeOutput}
                                        setLoading={setLoading}
                                        files={files}
                                        userInput={input}
                                        timeLimit={taskTimeLimit}
                                        memoryLimit={taskMemoryLimit}
                                        mainFileIndex={mainFileIndex}
                                    />
                                </div>
                                <div className="flex bg-terminal-color h-full flex-1 py-2.5 ">
                                    <Timer
                                        taskClosesAt={taskClosesAt}
                                        setIsClosed={setIsClosed}
                                    />
                                </div>

                            </div>
                            <button
                                className="bg-blue-450 text-xs font-semibold rounded w-1/2 text-white hover:bg-blue-500 disabled:bg-terminal-color"
                                onClick={submitSolution}
                                disabled={isClosed}
                            >
                                SUBMIT SOLUTION
                            </button>
                        </div>
                        <div className="flex h-full">
                            <TerminalInput
                                setInput={setInput}
                                input={input}
                            />
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Ide;