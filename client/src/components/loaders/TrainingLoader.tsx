import React from 'react';

const TrainingLoader = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-brightness-50 z-[1500]">
            <div className="ml-[10px] flex flex-col items-center justify-center h-screen">
                <p className="ml-[15px] text-3xl text-center font-black text-white drop-shadow-lg animate-color-pulse-dark2">
                    Prediction model retraining in progress
                    <span className="loading-dots"></span>
                </p>
                <p className="ml-[15px] text-3xl font-medium italic text-center text-white drop-shadow-lg">
                    Please standby while we optimize the system. Thank you!
                </p>
                <div className="ml-[10px] mt-[50px] robot-animation">
                    <div className="table"></div>
                    <div className="robot-body">
                        <div className="robot-head">
                            <div className="robot-eye left-eye"><span className='inside-eye'></span></div>
                            <div className="robot-eye right-eye"><span className='inside-eye'></span></div>
                        </div>
                        <div className="robot-arm left-arm">
                            <div className="robot-hand left-hand">
                                <div className="wrench"></div>
                            </div>
                        </div>
                        <div className="robot-arm right-arm">
                            <div className="robot-hand right-hand">
                                <div className="wrench"></div>
                            </div>
                        </div>
                        <div className="robot-pants"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingLoader;
