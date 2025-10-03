import { useState, useEffect } from 'react';

export const useLoading = (initialSteps = []) => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Initializing...');
    const [steps, setSteps] = useState(initialSteps);

    // Simulate loading steps
    useEffect(() => {
        if (steps.length === 0) {
            setIsLoading(false);
            return;
        }

        const loadStep = async (stepIndex) => {
            if (stepIndex >= steps.length) {
                setProgress(100);
                setMessage('Complete!');
                setTimeout(() => setIsLoading(false), 500);
                return;
            }

            const step = steps[stepIndex];
            setCurrentStep(stepIndex);
            setMessage(step.message);
            
            // Simulate loading time for each step
            const stepProgress = ((stepIndex) / steps.length) * 100;
            setProgress(stepProgress);
            
            await new Promise(resolve => setTimeout(resolve, step.duration || 800));
            
            // Complete this step
            const completedProgress = ((stepIndex + 1) / steps.length) * 100;
            setProgress(completedProgress);
            
            loadStep(stepIndex + 1);
        };

        loadStep(0);
    }, [steps]);

    const addStep = (step) => {
        setSteps(prev => [...prev, step]);
    };

    const updateMessage = (newMessage) => {
        setMessage(newMessage);
    };

    return {
        isLoading,
        progress,
        message,
        currentStep,
        addStep,
        updateMessage,
        setIsLoading
    };
};

// Pre-defined loading steps for different scenarios
export const loadingSteps = {
    app: [
        { message: 'Loading game data...', duration: 600 },
        { message: 'Initializing abilities...', duration: 400 },
        { message: 'Loading characters...', duration: 400 },
        { message: 'Setting up game world...', duration: 500 },
    ],
    game: [
        { message: 'Loading sprites...', duration: 800 },
        { message: 'Initializing canvas...', duration: 400 },
        { message: 'Setting up physics...', duration: 300 },
        { message: 'Loading abilities...', duration: 400 },
        { message: 'Preparing enemies...', duration: 300 },
        { message: 'Final preparations...', duration: 200 },
    ],
    loadout: [
        { message: 'Loading abilities...', duration: 400 },
        { message: 'Loading characters...', duration: 300 },
        { message: 'Setting up interface...', duration: 300 },
    ]
};