'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

type Lang = 'en' | 'zh';

export default function AdminCVUploader() {
  const [selectedLang, setSelectedLang] = useState<Lang>('en');
  const [cvData, setCvData] = useState<{ [key in Lang]?: { url: string; updatedAt: string } }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCVs(); }, []);

  const fetchCVs = async () => {
    const langs: Lang[] = ['en', 'zh'];
    const newData: typeof cvData = {};
    for (const lang of langs) {
      const docSnap = await getDoc(doc(db, 'assets', `cv-${lang}`));
      if (docSnap.exists()) {
        const data = docSnap.data();
        newData[lang] = {
          url: data.url,
          updatedAt: data.updatedAt?.toDate()?.toLocaleString() || '—',
        };
      }
    }
    setCvData(newData);
  };

  const handleUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';

    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      try {
        const url = await uploadToCloudinary(file);
        await setDoc(doc(db, 'assets', `cv-${selectedLang}`), {
          type: `cv-${selectedLang}`,
          url,
          updatedAt: serverTimestamp(),
        });
        toast.success(`Uploaded ${selectedLang.toUpperCase()} resume successfully!`);
        fetchCVs();
      } catch (err) {
        console.error(err);
        toast.error('Upload failed.');
      } finally {
        setLoading(false);
      }
    };

    input.click();
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedLang.toUpperCase()} resume?`)) return;
    await deleteDoc(doc(db, 'assets', `cv-${selectedLang}`));
    toast.success(`${selectedLang.toUpperCase()} resume deleted`);
    fetchCVs();
  };

  return (
    <div className="border p-5 rounded shadow bg-white space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
  <div className="flex items-center gap-3">
    <h3 className="text-lg font-semibold">📄 CV PDF Management</h3>
    <select
      value={selectedLang}
      onChange={(e) => setSelectedLang(e.target.value as Lang)}
      className="border px-2 py-1 rounded text-sm"
    >
      <option value="en">English Resume</option>
      <option value="zh">中文简历</option>
    </select>
  </div>

  <div className="flex gap-2">
    <button
      onClick={handleUpload}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      disabled={loading}
    >
      {loading ? 'Uploading...' : 'Upload New CV'}
    </button>
    {cvData[selectedLang]?.url && (
      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Delete
      </button>
    )}
  </div>
</div>

      {/* Display current */}
      {cvData[selectedLang] ? (
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            ✅ <span className="font-medium">Current:</span>{' '}
            <a
              href={cvData[selectedLang]!.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View PDF
            </a>
          </p>
          <p>🕒 Last updated: {cvData[selectedLang]!.updatedAt}</p>
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">No {selectedLang.toUpperCase()} resume uploaded yet.</p>
      )}
    </div>
  );
}
