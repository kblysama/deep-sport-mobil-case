import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native'; // Ensure backend is imported
import * as poseDetection from '@tensorflow-models/pose-detection';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '../context/LanguageContext';
import AppText from '../components/common/AppText';
import PoseOverlay from '../components/camera/PoseOverlay';
import ScreenshotList from '../components/gallery/ScreenshotList';
import LanguageToggle from '../components/common/LanguageToggle';
import { CustomTensorCamera } from '../components/camera/CustomTensorCamera';

import { requestCameraPermissions } from '../services/camera.service';
import { initTF, loadPoseModel } from '../services/pose.service';
import { calculateHandProgress, isThresholdExceeded } from '../services/gesture.service';
import { takeScreenshot, saveToGallery, requestMediaLibraryPermissions } from '../services/screenshot.service';

const { width, height: screenHeight } = Dimensions.get('window');
// We will try to determine these dynamically or use a fixed aspect ratio that matches the screen
const CAM_WIDTH = 240;
const CAM_HEIGHT = 320;

export default function MainScreen() {
    const { t } = useLanguage();
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [hasMediaPermission, setHasMediaPermission] = useState<boolean>(false);

    const [type, setType] = useState<any>('front');
    const [model, setModel] = useState<poseDetection.PoseDetector | null>(null);
    const [modelError, setModelError] = useState<boolean>(false);
    const [isTfReady, setIsTfReady] = useState(false);

    const [keypoints, setKeypoints] = useState<poseDetection.Keypoint[]>([]);
    const [progress, setProgress] = useState(0);
    const [screenshots, setScreenshots] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const cameraRef = useRef<any>(null);
    const rafId = useRef<number>(0);

    useEffect(() => {
        checkPermissions();
        initializeTensorFlow();

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, []);

    const checkPermissions = async () => {
        const camStatus = await requestCameraPermissions();
        setHasCameraPermission(camStatus);

        const mediaStatus = await requestMediaLibraryPermissions();
        setHasMediaPermission(mediaStatus);

        if (!mediaStatus) {
            // Optional warning, non-blocking
            console.log('Media permission denied or limited. Screenshots might not be saved to gallery.');
        }
    };

    const initializeTensorFlow = async () => {
        console.log('initializeTensorFlow: Starting...');
        try {
            setModelError(false);
            await initTF();
            console.log('initializeTensorFlow: TF Initialized');
            setIsTfReady(true);
            const loadedModel = await loadPoseModel();
            console.log('initializeTensorFlow: Model Loaded');
            setModel(loadedModel);
        } catch (error) {
            console.error('Failed to initialize TF or load model:', error);
            setModelError(true);
        }
    };

    const handleCameraStream = (images: IterableIterator<tf.Tensor3D>, updatePreview: () => void, gl: any) => {
        console.log('handleCameraStream: Started');
        const loop = async () => {
            if (!model) {
                // console.log('Loop: Model not ready');
                if (!modelError) {
                    rafId.current = requestAnimationFrame(loop);
                }
                return;
            }

            // console.log('Loop: Processing frame');
            const nextImageTensor = images.next().value;

            if (!nextImageTensor) {
                console.log('Loop: No tensor');
                rafId.current = requestAnimationFrame(loop);
                return;
            }

            // Debug: Check if tensor is black
            // const maxVal = nextImageTensor.max().dataSync()[0];
            // console.log(`Loop: Tensor Max Val: ${maxVal}`);

            try {
                const poses = await model.estimatePoses(nextImageTensor, {
                    flipHorizontal: type === 'front',
                });

                console.log(`Loop: Poses detected: ${poses.length}`);

                if (poses.length > 0) {
                    const kp = poses[0].keypoints;
                    console.log(`Loop: Keypoints count: ${kp.length}`);
                    setKeypoints(kp);

                    // Gesture Logic
                    // If mirrored (front), threshold is on the left (or right depending on UX).
                    // Usually "right side of screen" means x > 75%.
                    // If mirrored, the user's right hand appears on the right side of the screen?
                    // Front camera mirror: User raises right hand -> appears on Right side of screen.
                    // So logic x > 75% works for "Right side of screen".

                    const prog = calculateHandProgress(kp, 256, type === 'front'); // Use resize width
                    console.log(`Loop: Hand progress: ${prog}%`);
                    setProgress(prog);

                    if (isThresholdExceeded(prog) && !isProcessing) {
                        console.log('Loop: Threshold exceeded, taking screenshot');
                        setIsProcessing(true);
                        await handleScreenshot();
                    }
                } else {
                    console.log('Loop: No poses detected, clearing keypoints');
                    setKeypoints([]);
                }
            } catch (err) {
                console.error('Pose estimation error:', err);
            } finally {
                tf.dispose([nextImageTensor]);

                // Only update preview if we successfully processed (or at least tried)
                updatePreview();
                gl.endFrameEXP();
                rafId.current = requestAnimationFrame(loop);
            }
        };

        loop();
    };

    const handleScreenshot = async () => {
        console.log('handleScreenshot: Attempting to take screenshot');
        try {
            if (cameraRef.current) {
                console.log('handleScreenshot: Camera ref available');
                const photo = await takeScreenshot(cameraRef);
                if (photo) {
                    console.log('handleScreenshot: Photo captured successfully');
                    setScreenshots(prev => [photo.uri, ...prev]);
                    if (hasMediaPermission) {
                        saveToGallery(photo.uri);
                    }
                } else {
                    console.log('handleScreenshot: No photo returned');
                }
            } else {
                console.log('handleScreenshot: Camera ref not available');
            }
        } catch (error) {
            console.error('Screenshot error:', error);
        } finally {
            // Simple cooldown
            setTimeout(() => setIsProcessing(false), 2000);
        }
    };

    const toggleCameraType = () => {
        setType((current: any) => (current === 'back' ? 'front' : 'back'));
    };

    if (hasCameraPermission === null) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#2563EB" /></View>;
    }
    if (hasCameraPermission === false) {
        return (
            <View style={styles.container}>
                <AppText>{t('permissionDenied')}</AppText>
            </View>
        );
    }

    if (modelError) {
        return (
            <View style={styles.container}>
                <AppText>{t('modelError')}</AppText>
                <TouchableOpacity onPress={initializeTensorFlow} style={styles.retryBtn}>
                    <AppText style={{ color: '#FFF' }}>{t('retry')}</AppText>
                </TouchableOpacity>
            </View>
        );
    }

    // Determine threshold line position based on camera type if needed.
    // Currently fixed to right 25%.
    const thresholdStyle: any = type === 'front'
        ? { right: '25%' } // Front mirrored: Right side of screen
        : { left: '25%' }; // Back: Left side of screen

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View>
                    <AppText variant="h3" style={styles.logoText}>DeepSport</AppText>
                    <View style={styles.liveBadge}>
                        <View style={styles.liveDot} />
                        <AppText variant="caption" style={{ color: '#10B981' }}>{t('live')}</AppText>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <LanguageToggle />
                    <TouchableOpacity onPress={toggleCameraType} style={{ marginLeft: 10 }}>
                        <AppText style={{ fontSize: 24 }}>📷</AppText>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.cameraContainer}>
                {isTfReady ? (
                    <CustomTensorCamera
                        ref={cameraRef}
                        style={styles.camera}
                        type={type}
                        width={CAM_WIDTH}
                        height={CAM_HEIGHT}
                        onReady={handleCameraStream}
                    />
                ) : (
                    <View style={[styles.camera, { justifyContent: 'center', alignItems: 'center' }]}>
                        <ActivityIndicator size="large" color="#2563EB" />
                        <AppText>{t('loadingAI')}</AppText>
                    </View>
                )}
                <PoseOverlay
                    keypoints={keypoints}
                    width={width * 0.8}
                    height={(width * 0.8) * (4 / 3)}
                    camWidth={CAM_WIDTH}
                    camHeight={CAM_HEIGHT}
                    isMirrored={type === 'front'}
                />
                {/* Threshold Line */}
                <View style={[styles.thresholdLine, thresholdStyle]} />
            </View>

            <View style={styles.statusCard}>
                <View style={styles.progressRow}>
                    <AppText>{t('handPosition')}: {Math.round(progress)}%</AppText>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
                    <View style={styles.thresholdMarker} />
                </View>
                <AppText variant="caption" style={{ marginTop: 8 }}>
                    {progress >= 75 ? t('thresholdExceeded') : t('needThreshold')}
                </AppText>
            </View>

            <ScreenshotList screenshots={screenshots} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#0F172A',
        zIndex: 20,
    },
    logoText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 4,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cameraContainer: {
        width: width * 0.8, // 80% of screen width
        height: (width * 0.8) * (4 / 3), // 4:3 Aspect Ratio for smaller camera
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000',
        alignSelf: 'center', // Center the camera
        marginVertical: 10,
    },
    camera: {
        flex: 1,
    },
    thresholdLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: 'rgba(37, 99, 235, 0.5)',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#2563EB',
        zIndex: 5,
    },
    statusCard: {
        margin: 16,
        padding: 16,
        backgroundColor: '#111827',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#374151',
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#374151',
        borderRadius: 4,
        position: 'relative',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2563EB',
        borderRadius: 4,
    },
    thresholdMarker: {
        position: 'absolute',
        right: '25%',
        top: -2,
        bottom: -2,
        width: 2,
        backgroundColor: '#FBBF24', // Yellow
    },
    retryBtn: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#2563EB',
        borderRadius: 8,
    }
});
