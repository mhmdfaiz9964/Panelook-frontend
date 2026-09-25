import { API_BASE_URL, getAdminApiUrl } from './config';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('panelook_admin_token');
}

export function setAdminSession(token: string, user: any) {
  localStorage.setItem('panelook_admin_token', token);
  localStorage.setItem('panelook_admin_user', JSON.stringify(user));
}

export function clearAdminSession() {
  localStorage.removeItem('panelook_admin_token');
  localStorage.removeItem('panelook_admin_user');
}

export function getAdminUser(): { name: string; email: string; role: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('panelook_admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function adminFetch(path: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Only set application/json if not uploading multipart form data
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const url = getAdminApiUrl(path);
  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearAdminSession();
  }

  return res;
}

/**
 * Safely parse API response and extract structured error messages
 */
export async function parseApiResponse<T = any>(res: Response): Promise<{
  success: boolean;
  status: number;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}> {
  try {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await res.json();
      if (res.ok) {
        return {
          success: true,
          status: res.status,
          data: json.data !== undefined ? json.data : json,
          message: json.message,
        };
      }

      // Handle 422 Validation Error
      if (res.status === 422 && json.errors) {
        const errorList = Object.entries(json.errors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
          .join('\n');
        return {
          success: false,
          status: 422,
          message: json.message || errorList,
          errors: json.errors,
        };
      }

      return {
        success: false,
        status: res.status,
        message: json.message || `Server returned error (${res.status})`,
        errors: json.errors,
      };
    }

    const text = await res.text();
    return {
      success: false,
      status: res.status,
      message: `Server returned non-JSON response (${res.status}): ${text.slice(0, 120)}...`,
    };
  } catch (err: any) {
    return {
      success: false,
      status: res.status,
      message: err?.message || 'Failed to read response from server.',
    };
  }
}

/**
 * Admin direct image uploader with WebP conversion
 */
export async function adminUploadImage(
  file: File,
  folder: 'products' | 'banners' = 'products'
): Promise<{
  success: boolean;
  url?: string;
  data?: any;
  message?: string;
}> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  try {
    const res = await adminFetch('/admin/upload-image', {
      method: 'POST',
      body: formData,
    });

    const parsed = await parseApiResponse(res);
    if (parsed.success && parsed.data?.url) {
      return {
        success: true,
        url: parsed.data.url,
        data: parsed.data,
        message: parsed.message,
      };
    }

    return {
      success: false,
      message: parsed.message || 'Image upload failed.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network error during upload: ${err.message}`,
    };
  }
}

export async function adminLogin(email: string, password: string) {
  const url = getAdminApiUrl('/login');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseApiResponse(res);
}

/**
 * Trigger `php artisan storage:link --force` via admin API
 */
export async function runStorageLink(): Promise<{
  success: boolean;
  message?: string;
  command?: string;
  output?: string;
  is_linked?: boolean;
  target_path?: string;
  link_destination?: string;
}> {
  try {
    const res = await adminFetch('/system/storage-link', {
      method: 'POST',
    });
    const parsed = await parseApiResponse(res);
    return {
      success: parsed.success,
      message: parsed.message,
      command: parsed.data?.command,
      output: parsed.data?.output,
      is_linked: parsed.data?.is_linked,
      target_path: parsed.data?.target_path,
      link_destination: parsed.data?.link_destination,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network error: ${err.message}`,
    };
  }
}

/**
 * Trigger `php artisan optimize:clear` via admin API
 */
export async function runOptimizeClear(): Promise<{
  success: boolean;
  message?: string;
  command?: string;
  output?: string;
}> {
  try {
    const res = await adminFetch('/system/optimize-clear', {
      method: 'POST',
    });
    const parsed = await parseApiResponse(res);
    return {
      success: parsed.success,
      message: parsed.message,
      command: parsed.data?.command,
      output: parsed.data?.output,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network error: ${err.message}`,
    };
  }
}

/**
 * Fetch system environment, PHP/Laravel version, and storage symlink status
 */
export async function getSystemStatus(): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> {
  try {
    const res = await adminFetch('/system/status', {
      method: 'GET',
    });
    const parsed = await parseApiResponse(res);
    return {
      success: parsed.success,
      data: parsed.data,
      message: parsed.message,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network error: ${err.message}`,
    };
  }
}

