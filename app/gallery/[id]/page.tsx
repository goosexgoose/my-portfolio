import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebaseAdmin';
import Link from 'next/link';
import GalleryLightbox from '@/components/gallery/GalleryLightbox';
import RichContentViewer from '@/components/editor/RichContentViewer';

interface Props {
  params: { id: string };
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = params;

  const docRef = adminDb.collection('projects').doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists || snapshot.data()?.status !== 'published') {
    return notFound();
  }

  const project = snapshot.data()!;
  const layout = project.layout?.en || project.layout?.zh || null;
  const images = extractImagesFromLayout(layout);
  const filteredLayout = layout ? removeImagesFromLayout(layout) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
    
      <div className="text-sm text-gray-500">
        <Link href="/gallery" className="hover:underline">← Back to Gallery</Link>
      </div>

    
      {images.length > 0 && (
        <GalleryLightbox images={images} singleMode />
      )}

  
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        {project.description && (
          <p className="text-gray-600">{project.description}</p>
        )}
        {project.deviceTags?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {project.deviceTags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="text-xs border rounded-full px-2 py-0.5 bg-gray-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

    
      {filteredLayout && (
        <div className="pt-8">
          <RichContentViewer content={filteredLayout} />
        </div>
      )}
    </div>
  );
}


function extractImagesFromLayout(layout: any): { src: string; title?: string }[] {
  const result: { src: string; title?: string }[] = [];
  const doc = layout?.en || layout?.zh || layout;
  if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) return [];

  function traverse(nodes: any[]) {
    nodes.forEach((node) => {
      if (node.type === 'image' && node.attrs?.src) {
        result.push({
          src: node.attrs.src,
          title: node.attrs.alt || undefined,
        });
      }
      if (Array.isArray(node.content)) {
        traverse(node.content);
      }
    });
  }

  traverse(doc.content);
  return result;
}

// ------- 过滤图片节点，保留文字 -------
function removeImagesFromLayout(layout: any): any {
  const doc = layout?.en || layout?.zh || layout;
  if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) return null;

  // 深拷贝一份，避免改原始数据
  const filteredDoc = JSON.parse(JSON.stringify(doc));

  function filter(nodes: any[]): any[] {
    return nodes
      .filter((node) => node.type !== 'image')
      .map((node) => ({
        ...node,
        content: node.content ? filter(node.content) : undefined,
      }));
  }

  filteredDoc.content = filter(filteredDoc.content);
  return filteredDoc;
}
