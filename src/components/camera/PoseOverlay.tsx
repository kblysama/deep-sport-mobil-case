import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Keypoint } from '@tensorflow-models/pose-detection';

interface PoseOverlayProps {
    keypoints: Keypoint[];
    width: number;
    height: number;
    camWidth: number;
    camHeight: number;
    isMirrored?: boolean;
}

const CONNECTIONS = [
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'],
    ['left_elbow', 'left_wrist'],
    ['right_shoulder', 'right_elbow'],
    ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'],
    ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'],
    ['left_knee', 'left_ankle'],
    ['right_hip', 'right_knee'],
    ['right_knee', 'right_ankle'],
];

export default function PoseOverlay({ keypoints, width, height, camWidth, camHeight, isMirrored = false }: PoseOverlayProps) {
    if (!keypoints || keypoints.length === 0) return null;

    const scaleX = width / camWidth;
    const scaleY = height / camHeight;

    const getKeypoint = (name: string) => keypoints.find((k) => k.name === name);

    return (
        <View style={[styles.container, { width, height }]} pointerEvents="none">
            <Svg height={height} width={width}>
                {/* Draw Connections */}
                {CONNECTIONS.map(([start, end], index) => {
                    const startPt = getKeypoint(start);
                    const endPt = getKeypoint(end);

                    if (startPt && endPt && (startPt.score ?? 0) > 0.3 && (endPt.score ?? 0) > 0.3) {
                        return (
                            <Line
                                key={`line-${index}`}
                                x1={(isMirrored ? camWidth - startPt.x : startPt.x) * scaleX}
                                y1={startPt.y * scaleY}
                                x2={(isMirrored ? camWidth - endPt.x : endPt.x) * scaleX}
                                y2={endPt.y * scaleY}
                                stroke="#2563EB"
                                strokeWidth="2"
                            />
                        );
                    }
                    return null;
                })}

                {/* Draw Keypoints */}
                {keypoints.map((k, index) => {
                    if ((k.score ?? 0) > 0.3) {
                        return (
                            <Circle
                                key={`circle-${index}`}
                                cx={(isMirrored ? camWidth - k.x : k.x) * scaleX}
                                cy={k.y * scaleY}
                                r="4"
                                fill="#FFFFFF"
                                stroke="#2563EB"
                                strokeWidth="2"
                            />
                        );
                    }
                    return null;
                })}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
    },
});
