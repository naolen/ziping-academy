import { afterEach, describe, expect, it, vi } from 'vitest';
import { emptyStore } from './storage';
import { newCode, normalizeCode, pullRemote, pushRemote, resolveBackend } from './sync';

const backend = { url: 'https://demo.supabase.co', key: 'anon-key' };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('同步码', () => {
  it('生成 ZP-XXXX-XXXX 格式，且不含易混字符', () => {
    for (let i = 0; i < 200; i++) {
      const code = newCode();
      expect(code).toMatch(/^ZP-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/);
      expect(code).not.toMatch(/[01OIL]/);
    }
  });

  it('容错输入：小写、空格、缺横线都能整理', () => {
    expect(normalizeCode('zp7k3m9qx2')).toBe('ZP-7K3M-9QX2');
    expect(normalizeCode('ZP 7K3M 9QX2')).toBe('ZP-7K3M-9QX2');
    expect(normalizeCode('zp-7k3m-9qx2')).toBe('ZP-7K3M-9QX2');
  });

  it('长度不对或含非法字符时拒绝', () => {
    expect(normalizeCode('ZP-7K3M')).toBeNull();
    expect(normalizeCode('ZP-7K3M-9QX2X')).toBeNull();
    expect(normalizeCode('ZP-0K3M-9QX2')).toBeNull();
  });
});

describe('后端解析', () => {
  it('优先使用本机覆盖配置', () => {
    expect(resolveBackend({ code: null, url: 'https://a.co/', key: 'k', lastSync: null })).toEqual({
      url: 'https://a.co',
      key: 'k',
    });
  });

  it('缺少地址或密钥时返回 null', () => {
    expect(resolveBackend({ code: null, url: '', key: '', lastSync: null })).toBeNull();
    expect(resolveBackend({ code: null, url: 'https://a.co', key: '', lastSync: null })).toBeNull();
  });
});

describe('远端读写', () => {
  it('推送走 RPC，同步码放在请求体里（避免自定义头被跨域拦）', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify('2026-10-21T06:00:00Z'), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const at = await pushRemote(backend, 'ZP-7K3M-9QX2', emptyStore());
    expect(at).toBe('2026-10-21T06:00:00Z');

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://demo.supabase.co/rest/v1/rpc/put_sync_state');
    expect(init.method).toBe('POST');
    const h = init.headers as Record<string, string>;
    expect(h['x-sync-code']).toBeUndefined();
    expect(h.apikey).toBe('anon-key');
    const body = JSON.parse(init.body as string);
    expect(body.p_code).toBe('ZP-7K3M-9QX2');
    expect(body.p_payload.total).toEqual({ right: 0, wrong: 0 });
  });

  it('拉取时解析 payload 并补全缺省字段', async () => {
    const payload = { total: { right: 3, wrong: 1 }, learned: { 'k1-1': true } };
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify([{ payload, updated_at: '2026-10-21T07:00:00Z' }]), { status: 200 })),
    );

    const remote = await pullRemote(backend, 'ZP-7K3M-9QX2');
    const [url, init] = (vi.mocked(fetch).mock.calls[0] as unknown) as [string, RequestInit];
    expect(url).toBe('https://demo.supabase.co/rest/v1/rpc/get_sync_state');
    expect(JSON.parse(init.body as string).p_code).toBe('ZP-7K3M-9QX2');
    expect(remote?.updatedAt).toBe('2026-10-21T07:00:00Z');
    expect(remote?.payload.total).toEqual({ right: 3, wrong: 1 });
    expect(remote?.payload.wrong).toEqual([]);
    expect(remote?.payload.days).toEqual({});
  });

  it('没有数据时返回 null', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('[]', { status: 200 })));
    expect(await pullRemote(backend, 'ZP-7K3M-9QX2')).toBeNull();
  });

  it('HTTP 失败时抛出可读错误', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 401 })));
    await expect(pullRemote(backend, 'ZP-7K3M-9QX2')).rejects.toThrow('密钥无效');
  });
});
