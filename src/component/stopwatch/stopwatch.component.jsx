import React from 'react';
import "./stopwatch.style.css"
import {useState, useEffect} from "react";
import {interval, Subject, fromEvent} from "rxjs";
import {takeUntil, map, buffer, filter, debounceTime} from "rxjs/operators";

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const unsubscribe = new Subject();
        interval(10)
            .pipe(takeUntil(unsubscribe))
            .subscribe(() => {
                if (isRunning) {
                    setTime(val => val + 1);
                }
            });
        return () => {
            unsubscribe.next();
            unsubscribe.complete();
        };
    }, [isRunning]);

    let hour = ('0' + Math.floor((time / (1000 * 60 * 60)) % 24)).slice(-2);
    let minute = ('0' + Math.floor(time / 6000)).slice(-2);
    let second = ('0' + Math.floor((time / 100) % 60)).slice(-2);

    const handleStart = () => {
        setIsRunning(true);
    }

    const handleStop = () => {
        setIsRunning(false);
        setTime(0);
    }

    const handleReset = () => {
        setTime(0);
        setIsRunning(true);
    }

    const handleWait = () => {
        setIsRunning(prevState => !prevState);
    }


    return (
        <div className='stopwatch'>
            <div className='title'>
                <h1>Stopwatch</h1>
            </div>
            <div className='main_container'>
                <div className='clock_face_container'>
                    <span className='clock_face'>{hour}:{minute}:{second}</span>
                </div>
                <div className='stopwatch_buttons'>
                    {(isRunning === false) ?
                        <button id='start_stop' type="button" onClick={handleStart}>Start</button> :
                        <button id='start_stop' type="button" onClick={handleStop}>Stop</button>}
                    <button id='wait' type="button" onClick={() => {
                        const waitBtn = document.getElementById('wait')
                        const click$ = fromEvent(waitBtn, 'click');
                        const doubleClick$ = click$.pipe(
                            buffer(click$.pipe(debounceTime(300))),
                            map((clicks) => clicks.length),
                            filter((clicksLength) => clicksLength >= 2)
                        );

                        doubleClick$.subscribe((_) => {
                            handleWait();
                        });
                    }}>Wait
                    </button>
                    <button id='reset' type="button" onClick={handleReset}>Reset</button>
                </div>
            </div>
        </div>
    );
}
export default Stopwatch;