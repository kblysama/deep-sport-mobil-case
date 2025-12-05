import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';

interface CameraPreviewProps {
    type: any;
    onCameraReady?: () => void;
}

const CameraPreview = forwardRef<any, CameraPreviewProps>(({ type, onCameraReady }, ref) => {
    return (
        <CameraView
            ref={ref}
            style={styles.camera}
            facing={type}
            onCameraReady={onCameraReady}
        />
    );
});

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
});

export default CameraPreview;
