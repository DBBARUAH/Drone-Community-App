# Video Thumbnail Generator

This directory contains utility scripts for the Drone Community App.

## Generate Video Thumbnails

The `generate-thumbnails.js` script creates thumbnail images for all videos in the `public/videos` directory using FFmpeg.

### Prerequisites

- FFmpeg must be installed on your system
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt install ffmpeg`
  - Windows: Download from https://ffmpeg.org/download.html or install via Chocolatey

### Usage

Run the script from the project root:

```bash
node scripts/generate-thumbnails.js
```

Or with executable permission:

```bash
./scripts/generate-thumbnails.js
```

### What it does

1. Scans `public/videos` for video files (mp4, mov, webm, avi)
2. Creates thumbnails in `public/thumbnails` using the same filename with .jpg extension
3. Captures the thumbnail from the 1-second mark of each video
4. Uses high quality settings for clear thumbnails

### Output

Thumbnails will be saved to `public/thumbnails/` and can be referenced in your app like:

```jsx
// Example usage in a video component
<img 
  src={`/thumbnails/${videoFilename.replace(/\.[^/.]+$/, '')}.jpg`} 
  alt="Video thumbnail" 
/>
``` 