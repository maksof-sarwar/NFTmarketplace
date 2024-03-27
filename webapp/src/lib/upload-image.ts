import { supabase } from "./supabase";
const bucket = 'collection-image';


export type SupabaseFile = {
  path: string;
  url: string;
}
export const uploadCollectionImage = (file: Blob, type: "banner" | "logo" = 'logo') => {
  return new Promise<SupabaseFile>(async (resolve, reject) => {
    const fileName = `${type}_${Date.now().toString()}_${Math.floor(Math.random() * 1000)}`
    const fd = new FormData();
    fd.append('files', file);
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, fd, {
      cacheControl: '3600',
      upsert: false,
    });
    if (!data || error) {
      return reject(error);
    }
    const { data: url } = supabase.storage.from(bucket).getPublicUrl(data.path);
    resolve({
      path: data.path,
      url: url.publicUrl,
    });
  });
};

export const deleteCollectionImage = (path: string) => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      return reject(error);
    }
    resolve(data);
  });
};