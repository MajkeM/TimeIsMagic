import React from 'react';
import LoadingScreen from './LoadingScreen';
import { useLoading } from '../hooks/useLoading';

const PageWrapper = ({ children, loadingSteps = [], pageName = "page" }) => {
    const { isLoading, progress, message } = useLoading(loadingSteps);

    if (isLoading) {
        return <LoadingScreen progress={progress} message={message} />;
    }

    return <>{children}</>;
};

export default PageWrapper;