import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebaseClient';

/**
 * 上传文件到 Firebase Storage 指定路径，并返回可公开访问的下载链接
 * @param file 要上传的 File 对象
 * @param path 上传到 Firebase Storage 的路径，例如 'cv-resume/en.pdf'
 * @returns 返回下载 URL
 */
export const uploadCVToFirebase = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ Upload success:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Firebase upload error:', error);
    throw error;
  }
};
