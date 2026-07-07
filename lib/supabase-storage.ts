import { createClient } from '@supabase/supabase-js'

// Server-side client — pakai service key agar bisa upload ke Storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url-for-build.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "placeholder-key-for-build";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Upload file ke Supabase Storage.
 * @param bucket  Nama bucket (menus, packages, galleries, hero, logo)
 * @param file    File object dari FormData
 * @returns       Public URL file yang di-upload
 */
export async function uploadToStorage(bucket: string, file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

  if (error) throw new Error(`Upload gagal: ${error.message}`)

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filename)
  return data.publicUrl
}

/**
 * Hapus file dari Supabase Storage berdasarkan public URL.
 * @param bucket  Nama bucket
 * @param url     Public URL file yang akan dihapus
 */
export async function deleteFromStorage(bucket: string, url: string): Promise<void> {
  // Ambil nama file dari URL
  const urlObj = new URL(url)
  const pathParts = urlObj.pathname.split('/')
  const filename = pathParts[pathParts.length - 1]

  if (!filename) return

  await supabaseAdmin.storage.from(bucket).remove([filename])
}
