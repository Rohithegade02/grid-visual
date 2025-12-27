import React from 'react';
import { ActivityIndicator } from 'react-native';

interface SkeletonLoaderProps {
    width: number;
    height: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ width, height }) => {
    return (
        <ActivityIndicator size="small" color="#999" />
    );
};

export default React.memo(SkeletonLoader);
