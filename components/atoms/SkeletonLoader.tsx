import { CELL_CONSTANTS } from '@/constants/grid.constants';
import { Canvas, LinearGradient, RoundedRect, vec } from '@shopify/react-native-skia';
import React from 'react';

interface SkeletonLoaderProps {
    width: number;
    height: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ width, height }) => {
    return (
        <Canvas style={{ width, height }}>
            <RoundedRect
                x={2}
                y={2}
                width={width - 4}
                height={height - 4}
                r={4}
            >
                <LinearGradient
                    start={vec(0, 0)}
                    end={vec(width, 0)}
                    colors={[
                        CELL_CONSTANTS.SKELETON_COLOR,
                        CELL_CONSTANTS.SKELETON_HIGHLIGHT_COLOR,
                        CELL_CONSTANTS.SKELETON_COLOR,
                    ]}
                />
            </RoundedRect>
        </Canvas>
    );
};

export default React.memo(SkeletonLoader);
