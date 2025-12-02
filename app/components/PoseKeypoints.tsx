import { useEffect, useRef } from 'react';
import type { Keypoint } from '@tensorflow-models/pose-detection';

interface PoseKeypointsProps {
  keypoints: Keypoint[];
  videoWidth: number;
  videoHeight: number;
  isActive: boolean;
  streamWidth?: number;
  streamHeight?: number;
}

export function PoseKeypoints({
  keypoints,
  videoWidth,
  videoHeight,
  isActive,
  streamWidth = 640,
  streamHeight = 480,
}: PoseKeypointsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || keypoints.length === 0 || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    // Apply mirror transform
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-videoWidth, 0);

    // Calculate scaling factors
    const scaleX = videoWidth / streamWidth;
    const scaleY = videoHeight / streamHeight;

    // Helper to transform coordinates from model space to display space
    const transformX = (x: number) => x * scaleX;
    const transformY = (y: number) => y * scaleY;

    // Filter for arm keypoints (wrists, elbows, shoulders)
    const armKeypoints = keypoints.filter((kp) =>
      [
        'left_wrist',
        'right_wrist',
        'left_elbow',
        'right_elbow',
        'left_shoulder',
        'right_shoulder',
      ].includes(kp.name ?? ''),
    );

    // Get color based on confidence score
    const getColor = (score?: number): string => {
      if (!score) return '#ef4444'; // red
      if (score > 0.5) return '#22c55e'; // green
      if (score > 0.3) return '#eab308'; // yellow
      return '#ef4444'; // red
    };

    // Get radius based on keypoint type
    const getRadius = (name?: string): number => {
      if (name?.includes('wrist')) return 8;
      if (name?.includes('elbow')) return 7;
      if (name?.includes('shoulder')) return 6;
      return 6;
    };

    // Draw connections between keypoints
    const drawConnection = (kp1: Keypoint, kp2: Keypoint) => {
      if (
        !kp1.score ||
        !kp2.score ||
        kp1.score < 0.3 ||
        kp2.score < 0.3
      ) {
        return;
      }

      const x1 = transformX(kp1.x);
      const y1 = transformY(kp1.y);
      const x2 = transformX(kp2.x);
      const y2 = transformY(kp2.y);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#3b82f6'; // blue
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    };

    // Draw arm connections
    const getKeypoint = (name: string) =>
      armKeypoints.find((kp) => kp.name === name);

    // Left arm
    const leftWrist = getKeypoint('left_wrist');
    const leftElbow = getKeypoint('left_elbow');
    const leftShoulder = getKeypoint('left_shoulder');

    if (leftWrist && leftElbow) drawConnection(leftWrist, leftElbow);
    if (leftElbow && leftShoulder)
      drawConnection(leftElbow, leftShoulder);

    // Right arm
    const rightWrist = getKeypoint('right_wrist');
    const rightElbow = getKeypoint('right_elbow');
    const rightShoulder = getKeypoint('right_shoulder');

    if (rightWrist && rightElbow)
      drawConnection(rightWrist, rightElbow);
    if (rightElbow && rightShoulder)
      drawConnection(rightElbow, rightShoulder);

    // Draw keypoints
    armKeypoints.forEach((kp) => {
      const x = transformX(kp.x);
      const y = transformY(kp.y);
      const radius = getRadius(kp.name);
      const color = getColor(kp.score);

      // Draw pulsing outer circle
      ctx.beginPath();
      ctx.arc(x, y, radius + 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Draw main circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.restore();
  }, [
    keypoints,
    videoWidth,
    videoHeight,
    isActive,
    streamWidth,
    streamHeight,
  ]);

  if (!isActive) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
      width={videoWidth}
      height={videoHeight}
    />
  );
}
