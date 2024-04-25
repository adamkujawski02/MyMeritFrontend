import React, {useEffect, useState} from "react";
import {errorToast} from "../../../../../main";
import {testAll, testSingle} from "../../../../../services/JobOfferService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import Test from "../../../../../models/Test";
import UserTaskDTO from "../../../../../models/dtos/UserTaskDTO";
import TestOutput from "../../../../../models/TestOutput";

const TestInterface: React.FC<{task:UserTaskDTO}>= ({files, setTestOutput, setLoading, task, mainFileIndex}) => {
    const [currentLanguage, setCurrentLanguage] = useState<string>("c++");
    const [currentLanguageTests, setCurrentLanguageTests] = useState<Test>(null);

    const runAllTests = async () => {
        setLoading(true);
        try {
            const response = await testAll(files, currentLanguageTests.testFileBase64, task.id, currentLanguage, mainFileIndex);
            setTestOutput(response as TestOutput[]);
        } catch (error) {
            errorToast("Error compiling code");
        } finally {
            setLoading(false);
        }
    }

    const runSingleTest = async (testId) => {
        setLoading(true);
        try {
            const response = await testSingle(files, currentLanguageTests.testFileBase64, task.id, currentLanguage, mainFileIndex, testId);
            setTestOutput(response as TestOutput[]);
        } catch (error) {
            errorToast("Error compiling code");
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        setCurrentLanguageTests(task.tests.find(test => test.language === currentLanguage));
    }, [currentLanguage])

    return (
        <div className="flex w-full gap-5 flex-col h-full pt-3 text-task-lighter font-medium text-xs">
            <div className="flex justify-between">
                <button
                    className="flex gap-2 justify-center text-xs font-semibold items-center text-emerald-300 p-2 px-5 font-medium text-sm border-[3px] border-emerald-400 bg-transparent rounded hover:bg-emerald-450 hover:text-white hover:border-emerald-450"
                    onClick={runAllTests}
                >
                    <FontAwesomeIcon icon={faPlay}/> RUN ALL TESTS
                </button>
                <select className="text-black px-3 rounded bg-transparent font-semibold border-[2px] border-main-border text-xs text-task-lighter outline-none" onChange={e => setCurrentLanguage(e.currentTarget.value)}>
                    {task.tests && task.tests.map((test)=>{
                            return <option key={test.language} value={test.language}>{test.language.toUpperCase()}</option>
                        }
                    )}
                </select>

            </div>

            {currentLanguageTests ?
                <div className="flex flex-col gap-3 w-full justify-start items-start">
                    {currentLanguageTests.testCases.map((test, index)=>{
                        return (
                            <button
                                key={index}
                                className="hover:text-emerald-400"
                                onClick={()=>runSingleTest(index)}
                            >
                                <FontAwesomeIcon icon={faPlay} className="mr-2"/>{test.name.toUpperCase()}
                            </button>
                        )
                    })
                    }
                </div>
                :
                <p>No tests for this language</p>
            }
        </div>

    );
};

export default TestInterface;