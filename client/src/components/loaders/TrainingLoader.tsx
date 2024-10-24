import React from 'react';

const TrainingLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-3xl mb-4">
                We are currently retraining our prediction model. Please wait until we finish it. Thank you!
            </p>
            <div className="robot-animation">
                <div className="robot-body">
                    <div className="robot-head"></div>
                    <div className="robot-arm left-arm"></div>
                    <div className="robot-arm right-arm"></div>
                </div>
                <div className="wrench"></div>
            </div>
            <style jsx>{`
                p {
                    color: #333;
                    text-align: center;
                }
                .robot-animation {
                    position: relative;
                    width: 100px;
                    height: 160px;
                }
                .robot-body {
                    position: relative;
                    width: 60px;
                    height: 100px;
                    background-color: #B22222;
                    border-radius: 10px;
                    margin: 0 auto;
                    animation: bob 1s infinite;
                }
                .robot-head {
                    width: 60px;
                    height: 60px;
                    background-color: #333;
                    border-radius: 50%;
                    position: absolute;
                    top: -30px; /* Position head */
                    left: 0;
                    animation: shake 1s infinite alternate;
                }
                .robot-arm {
                    position: absolute;
                    width: 20px;
                    height: 40px;
                    background-color: #555;
                    bottom: 0;
                }
                .left-arm {
                    left: -20px; /* Left arm */
                    animation: swing-left 1s infinite alternate;
                }
                .right-arm {
                    right: -20px; /* Right arm */
                    animation: swing-right 1s infinite alternate;
                }
                .wrench {
                    position: absolute;
                    width: 10px;
                    height: 30px;
                    background-color: #FFD700;
                    left: 60px; /* Position to the right */
                    bottom: 40px;
                    transform-origin: top;
                    animation: fix 1s infinite;
                }
                @keyframes bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes shake {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(10deg); }
                }
                @keyframes swing-left {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-20deg); }
                }
                @keyframes swing-right {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(20deg); }
                }
                @keyframes fix {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(15deg); }
                }
            `}</style>
        </div>
    );
};

export default TrainingLoader;
