import { Keypoint } from '@tensorflow-models/pose-detection';

// Threshold for gesture (75% of screen width)
const THRESHOLD_RATIO = 0.75;

export const calculateHandProgress = (keypoints: Keypoint[], width: number, isMirrored: boolean): number => {
    // Find wrist keypoints (left_wrist: 15, right_wrist: 16)
    const leftWrist = keypoints.find(k => k.name === 'left_wrist');
    const rightWrist = keypoints.find(k => k.name === 'right_wrist');

    let maxX = 0;

    if (leftWrist && (leftWrist.score ?? 0) > 0.3) {
        maxX = Math.max(maxX, leftWrist.x);
    }
    if (rightWrist && (rightWrist.score ?? 0) > 0.3) {
        maxX = Math.max(maxX, rightWrist.x);
    }

    // Normalize X based on screen width
    // If mirrored (front camera), x increases from right to left in camera coordinates usually,
    // but we need to check how MediaPipe returns coordinates.
    // MediaPipe returns x in pixels.

    let normalizedX = maxX / width;

    // If mirrored, we might need to flip the logic depending on how we want the user to interact.
    // Usually for "reaching right" on screen:
    // If mirrored: User moves right hand to their right -> on screen it moves to the right side.
    // So x increases.

    // Ensure normalizedX is between 0 and 1
    normalizedX = Math.min(Math.max(normalizedX, 0), 1);

    // If not mirrored (back camera), we invert the progress so that "reaching left" (subject's right) counts as progress
    // Or simply, we want the threshold to be on the other side.
    if (!isMirrored) {
        return (1 - normalizedX) * 100;
    }

    return normalizedX * 100;
};

export const isThresholdExceeded = (progress: number): boolean => {
    return progress >= THRESHOLD_RATIO * 100;
};
