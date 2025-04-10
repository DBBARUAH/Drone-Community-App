import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload a file to Supabase storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The path within the bucket (e.g., 'profiles/user123')
 * @returns {Promise<{ url: string } | { error: string }>} - The URL of the uploaded file or error
 */
export async function uploadFile(file: File, bucket: string, path: string) {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}/${Date.now()}.${fileExt}`;

    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { error: 'Failed to upload file' };
  }
}

/**
 * Delete a file from Supabase storage
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The full path of the file in the bucket
 * @returns {Promise<{ success: boolean } | { error: string }>}
 */
export async function deleteFile(bucket: string, path: string) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { error: 'Failed to delete file' };
  }
} 