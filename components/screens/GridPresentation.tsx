import VirtualizedGrid from '@/components/molecules/VirtualizedGrid';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { GridPresentationProps } from './types';



const GridPresentation: React.FC<GridPresentationProps> = ({ config }) => {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.gridWrapper}>
                <VirtualizedGrid config={config} />
            </View>
        </SafeAreaView>
    );
};



export default GridPresentation;
