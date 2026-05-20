"use client";

import * as tf from "@tensorflow/tfjs";

export interface ITfAnalysis {
  rednessScore: number;       // 0 - 100 (Sensitivity, Redness, Irritation indicator)
  luminanceScore: number;     // 0 - 100 (Skin brightness / Glow indicator)
  varianceScore: number;      // 0 - 100 (Pigments, dark spots, acne indication)
  skinHealthEstimate: number; // 0 - 100 (Overall score)
  hydrationEstimate: number;  // 0 - 100 (Moisture / Hydration estimation)
}

/**
 * Executes browser-side TensorFlow.js pixel analysis and mathematical evaluation.
 * Calculates clinical skin health indicators.
 */
export async function analyzeImageWithTf(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<ITfAnalysis> {
  // Initialize TensorFlow.js WebGL/CPU backend
  await tf.ready();

  return tf.tidy(() => {
    // 1. Load image into tensor structure
    const rawTensor = tf.browser.fromPixels(imageElement);
    
    // 2. Resize to clinical standard 224x224 shape
    const resizedTensor = tf.image.resizeBilinear(rawTensor, [224, 224]);
    
    // Normalize pixels from [0, 255] to float [0, 1.0]
    const normalizedTensor = tf.cast(resizedTensor, 'float32').div(255.0);
    
    // 3. Separate RGB channels (Shape: [224, 224, 1] each)
    const channels = tf.split(normalizedTensor, 3, 2);
    const redChannel = channels[0];
    const greenChannel = channels[1];
    const blueChannel = channels[2];
    
    // 4. Calculate redness index
    // Evaluate how prominent Red pixels are relative to blue/green balance
    const averageGb = greenChannel.add(blueChannel).div(2.0);
    const redDiff = redChannel.sub(averageGb);
    const meanRedness = redDiff.mean().arraySync() as number;
    // Normalize score to 0 - 100 range (typical diff yields -0.1 to 0.4)
    const rednessScore = Math.max(0, Math.min(100, Math.round((meanRedness + 0.08) * 180)));

    // 5. Calculate luminance glow index
    // Uses international ITU-R standard BT.601 coefficients for luminance weights
    const luminance = redChannel.mul(0.299)
      .add(greenChannel.mul(0.587))
      .add(blueChannel.mul(0.114));
    const meanLuminance = luminance.mean().arraySync() as number;
    const luminanceScore = Math.max(0, Math.min(100, Math.round(meanLuminance * 100)));

    // 6. Calculate texture variance score (Contrast / Dark spots metric)
    const squaredLuminanceDiff = luminance.sub(meanLuminance).square();
    const varianceLuminance = squaredLuminanceDiff.mean().arraySync() as number;
    const stdDevLuminance = Math.sqrt(varianceLuminance);
    // Normalize texture score to 0 - 100 range (stdDev usually ranges between 0.05 and 0.25)
    const varianceScore = Math.max(0, Math.min(100, Math.round(stdDevLuminance * 380)));

    // 7. Calculate overall health indices
    const skinHealthEstimate = Math.max(30, Math.min(100, 100 - Math.round(rednessScore * 0.35 + varianceScore * 0.45)));
    const hydrationEstimate = Math.max(25, Math.min(100, Math.round(luminanceScore * 0.75 + (100 - rednessScore) * 0.25)));

    return {
      rednessScore,
      luminanceScore,
      varianceScore,
      skinHealthEstimate,
      hydrationEstimate
    };
  });
}
