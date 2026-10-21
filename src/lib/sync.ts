import type { Store } from '../types';
import { parseStore } from './storage';

const SETTINGS_KEY = 'ziping-academy-sync-v1';
const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // 去掉 0/O、1/I/L，避免手输歧义

export interface SyncSettings {
  /** 本机是否已加入同步；null 表示纯本地 */
  code: string | null;
  /** 上次同步成功时服务端返回的时间戳 */
  lastSync: string | null;
}

export interface Backend {
  url: string;
  key: string;
}

export const emptySync = (): SyncSettings => ({ code: null, lastSync: null });

export function loadSync(): SyncSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return emptySync();
    const s = JSON.parse(raw) as Partial<SyncSettings>;
    return { code: s.code ?? null, lastSync: s.lastSync ?? null };
  } catch {
    return emptySync();
  }
}

export function saveSync(s: SyncSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* 忽略 */
  }
}

/**
 * 后端只从构建时注入的环境变量读取，不出现在页面上。
 * 维护者在 .env.local 或仓库 Secrets 里配置 VITE_SYNC_URL / VITE_SYNC_KEY。
 */
export function resolveBackend(): Backend | null {
  const url = (import.meta.env.VITE_SYNC_URL || '').replace(/\/+$/, '');
  const key = import.meta.env.VITE_SYNC_KEY || '';
  if (!url || !key) return null;
  return { url, key };
}

export function newCode(): string {
  let out = '';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return `ZP-${out.slice(0, 4)}-${out.slice(4)}`;
}

/** 宽容地把用户输入整理成标准格式；长度不足返回 null。 */
export function normalizeCode(input: string): string | null {
  const raw = input.toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/^ZP/, '');
  if (raw.length !== 8) return null;
  if ([...raw].some((c) => !CODE_ALPHABET.includes(c))) return null;
  return `ZP-${raw.slice(0, 4)}-${raw.slice(4)}`;
}

function headers(b: Backend): Record<string, string> {
  return {
    apikey: b.key,
    Authorization: `Bearer ${b.key}`,
    'Content-Type': 'application/json',
  };
}

async function request(url: string, init: RequestInit, timeout = 10000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new Error('请求超时，检查网络或后端地址');
    throw new Error('连不上后端，检查地址是否正确（或跨域被拦截）');
  } finally {
    clearTimeout(t);
  }
}

function httpError(status: number): Error {
  if (status === 401 || status === 403) return new Error('密钥无效或没有权限，确认 anon key 与建表语句都已配置');
  if (status === 404) return new Error('接口不存在，确认 Project URL 填的是项目地址而非数据库地址');
  return new Error(`同步失败（HTTP ${status}）`);
}

export interface RemoteState {
  payload: Store;
  updatedAt: string;
}

export async function pullRemote(b: Backend, code: string): Promise<RemoteState | null> {
  const res = await request(`${b.url}/rest/v1/rpc/get_sync_state`, {
    method: 'POST',
    headers: headers(b),
    body: JSON.stringify({ p_code: code }),
  });
  if (!res.ok) throw httpError(res.status);
  const rows = (await res.json()) as Array<{ payload: unknown; updated_at: string }>;
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return { payload: parseStore(rows[0].payload), updatedAt: rows[0].updated_at };
}

/** 整体覆盖写入，返回服务端时间戳。 */
export async function pushRemote(b: Backend, code: string, store: Store): Promise<string> {
  const res = await request(`${b.url}/rest/v1/rpc/put_sync_state`, {
    method: 'POST',
    headers: headers(b),
    body: JSON.stringify({ p_code: code, p_payload: store }),
  });
  if (!res.ok) throw httpError(res.status);
  const at = (await res.json()) as unknown;
  return typeof at === 'string' ? at : new Date().toISOString();
}
