import { Rect, Text as SkiaText, matchFont } from '@shopify/react-native-skia';
import React from 'react';
import { Platform } from 'react-native';

interface SkiaCellProps {
    x: number;
    y: number;
    width: number;
    height: number;
    value: string | null;
    isLoading: boolean;
}

const CELL_HEIGHT = 50;

// Create font for text rendering
const fontFamily = Platform.select({ ios: 'Helvetica', default: 'sans-serif' });
const fontStyle = {
    fontFamily,
    fontSize: 14,
};
const font = matchFont(fontStyle);

/**
 * Skia-based cell renderer for high performance
 */
export const SkiaCell: React.FC<SkiaCellProps> = React.memo(
    ({ x, y, width, height, value, isLoading }) => {
        // For skeleton loader animation
        const shimmerOpacity = isLoading ? 0.3 : 0;

        return (
            <>
                {/* Cell background */}
                <Rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    color="#000000"
                />

                {/* Cell border */}
                <Rect
                    x={x}
                    y={y}
                    width={width}
                    height={1}
                    color="#000000"
                />
                <Rect
                    x={x}
                    y={y}
                    width={1}
                    height={height}
                    color="#000000"
                />

                {/* Skeleton loader or actual text */}
                {isLoading ? (
                    <Rect
                        x={x + 8}
                        y={y + height / 2 - 8}
                        width={width - 16}
                        height={16}
                        color="#000000"
                        opacity={shimmerOpacity}
                    />
                ) : (
                    value && (
                        <SkiaText
                            x={x + 12}
                            y={y + height / 2 + 6}
                            text={value}
                            color="#333333"
                            font={font}
                        />
                    )
                )}
            </>
        );
    }
);

SkiaCell.displayName = 'SkiaCell';
