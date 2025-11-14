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

    // Filter for wrists only (what we actually use for gesture detection)
    const wristKeypoints = keypoints.filter((kp) =>
      ['left_wrist', 'right_wrist'].includes(kp.name ?? ''),
    );

    // Get color based on confidence score
    const getColor = (score?: number): string => {
      if (!score) return '#ef4444'; // red
      if (score > 0.5) return '#22c55e'; // green
      if (score > 0.3) return '#eab308'; // yellow
      return '#ef4444'; // red
    };

    // Draw wrist keypoints
    wristKeypoints.forEach((kp) => {
      const x = transformX(kp.x);
      const y = transformY(kp.y);
      const radius = 8;
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
