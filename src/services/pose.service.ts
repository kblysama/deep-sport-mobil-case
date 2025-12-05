import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native'; // Import backend
import * as poseDetection from '@tensorflow-models/pose-detection';

// Initialize TensorFlow backend
export const initTF = async () => {
    await tf.ready();
    // Try to set WebGL backend, fallback to CPU if needed
    try {
        await tf.setBackend('rn-webgl');
    } catch (e) {
        console.warn('WebGL backend failed, falling back to CPU', e);
        await tf.setBackend('cpu');
    }
    console.log('TensorFlow.js is ready, backend:', tf.getBackend());
};

// Load Pose Detection Model
export const loadPoseModel = async () => {
    try {
        const model = poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
            runtime: 'tfjs',
            modelType: 'lite',
            enableSmoothing: true,
        });
        return model;
    } catch (error) {
        console.error('Error loading pose model:', error);
        throw error;
    }
};
