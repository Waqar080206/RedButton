import type { DocumentPickerAsset } from 'expo-document-picker';
import { Platform } from 'react-native';

import { API_BASE_URL } from '@/services/api';

export type DocumentRecord = {
  id: string;
  filename: string;
  uploaded_by: string | null;
  role: string | null;
  machine_id: string | null;
  upload_time: string;
  chunk_count: number;
  status: string;
};

export async function listDocuments(): Promise<DocumentRecord[]> {
  const res = await fetch(`${API_BASE_URL}/documents`);
  if (!res.ok) throw new Error(`Failed to load documents (${res.status})`);
  return res.json();
}

export async function uploadDocument(
  asset: DocumentPickerAsset,
  meta: { uploadedBy?: string; role?: string } = {},
): Promise<DocumentRecord> {
  const form = new FormData();

  if (Platform.OS === 'web' && asset.file) {
    form.append('file', asset.file, asset.name);
  } else {
    form.append('file', {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType ?? 'application/octet-stream',
    } as unknown as Blob);
  }

  if (meta.uploadedBy) form.append('uploaded_by', meta.uploadedBy);
  if (meta.role) form.append('role', meta.role);

  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(detail || `Upload failed (${res.status})`);
  }

  return res.json();
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/documents/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete document (${res.status})`);
}
