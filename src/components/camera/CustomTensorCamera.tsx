import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';

interface CustomTensorCameraProps {
    style?: any;
    onReady: (images: IterableIterator<tf.Tensor3D>, updatePreview: () => void, gl: any) => void;
    type: 'front' | 'back';
    width: number;
    height: number;
    resizeWidth?: number;
    resizeHeight?: number;
}

const TensorCamera = cameraWithTensors(CameraView as any);

export const CustomTensorCamera = forwardRef<any, CustomTensorCameraProps>(
    ({ style, onReady, type, width, height, resizeWidth = 256, resizeHeight = 256 }, ref) => {
        return (
            <TensorCamera
                // Merge fill style so overlay aligns with preview
                style={[StyleSheet.absoluteFill, style]}
                // TensorCamera types are loose; any ref works for takePictureAsync
                ref={ref as any}
                facing={type}
                cameraTextureHeight={height}
                cameraTextureWidth={width}
                resizeHeight={resizeHeight}
                resizeWidth={resizeWidth}
                resizeDepth={3}
                onReady={onReady}
                autorender={true}
                useCustomShadersToResize={false}
            />
        );
    }
);
