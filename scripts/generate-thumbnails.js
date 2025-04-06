#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Paths
const videosDir = path.join(process.cwd(), 'public', 'videos');
const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');

// Ensure thumbnails directory exists
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
  console.log(`Created thumbnails directory at ${thumbnailsDir}`);
}

// Get all videos in the videos directory
const videoFiles = fs.readdirSync(videosDir)
  .filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.mp4', '.mov', '.webm', '.avi'].includes(ext);
  });

console.log(`Found ${videoFiles.length} video files to process.`);

// Generate thumbnails for each video
videoFiles.forEach(videoFile => {
  const videoPath = path.join(videosDir, videoFile);
  const thumbnailName = `${path.parse(videoFile).name}.jpg`;
  const thumbnailPath = path.join(thumbnailsDir, thumbnailName);

  console.log(`Generating thumbnail for ${videoFile}...`);

  try {
    // Generate thumbnail at 1 second mark with good quality
    execSync(`ffmpeg -i "${videoPath}" -ss 00:00:01 -vframes 1 -q:v 2 "${thumbnailPath}" -y`);
    console.log(`✅ Created thumbnail: ${thumbnailPath}`);
  } catch (error) {
    console.error(`❌ Error generating thumbnail for ${videoFile}:`, error.message);
  }
});

console.log('Thumbnail generation complete!'); 