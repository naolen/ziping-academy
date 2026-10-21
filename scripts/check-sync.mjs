#!/usr/bin/env node
/**
 * 同步后端自检：验证 schema.sql 是否执行正确、anon key 是否有权限。
 *
 * 用法：
 *   npm run check:sync -- --url https://xxxx.supabase.co --key eyJhbGciOi...
 * 也可以先设置环境变量 VITE_SYNC_URL / VITE_SYNC_KEY 再运行。
 */
const TEST_CODE = 'ZP-TEST-0001';

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const url = (arg('--url') || process.env.VITE_SYNC_URL || '').replace(/\/+$/, '');
const key = arg('--key') || process.env.VITE_SYNC_KEY || '';

if (!url || !key) {
  console.error('缺少参数。用法：npm run check:sync -- --url https://xxx.supabase.co --key eyJ...');
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
};

async function rpc(name, body) {
  let res;
  try {
    res = await fetch(`${url}/rest/v1/rpc/${name}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
    });
  } catch (e) {
    throw new Error(`连不上 ${url}（${e.name === 'TimeoutError' ? '超时' : '网络或地址错误'}）`);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    if (res.status === 404) throw new Error(`找不到接口 ${name}：schema.sql 可能没执行`);
    if (res.status === 401 || res.status === 403) throw new Error(`没有权限（HTTP ${res.status}）：anon key 不对，或函数未授权`);
    throw new Error(`HTTP ${res.status} ${text.slice(0, 160)}`);
  }
  return res.json();
}

const sample = {
  learned: { 'k1-1': true },
  stats: { 'k1-1': { r: 1, w: 0 } },
  total: { right: 1, wrong: 0 },
  wrong: [],
  days: { '2026-01-01': 1 },
};

const steps = [];
try {
  process.stdout.write('1/4 写入测试数据 … ');
  const at = await rpc('put_sync_state', { p_code: TEST_CODE, p_payload: sample });
  if (typeof at !== 'string' || !at) throw new Error('写入没有返回时间戳，检查函数定义');
  steps.push('写入成功');
  console.log(`OK（服务端时间 ${at}）`);

  process.stdout.write('2/4 用同一个码读回 … ');
  const rows = await rpc('get_sync_state', { p_code: TEST_CODE });
  if (!Array.isArray(rows) || rows.length !== 1) throw new Error(`期望 1 行，实际 ${Array.isArray(rows) ? rows.length : typeof rows} 行`);
  if (rows[0].payload?.total?.right !== 1) throw new Error('读回的内容与写入不一致');
  steps.push('读回一致');
  console.log('OK');

  process.stdout.write('3/4 用错误的码读取（应为空）… ');
  const none = await rpc('get_sync_state', { p_code: 'ZP-NONE-0000' });
  if (!Array.isArray(none) || none.length !== 0) throw new Error('错误的码竟然读到了数据，权限配置有问题');
  steps.push('越权读取被拦住');
  console.log('OK');

  process.stdout.write('4/4 检查表是否被匿名列举 … ');
  const list = await fetch(`${url}/rest/v1/sync_state?select=code&limit=5`, { headers, signal: AbortSignal.timeout(12000) });
  if (list.ok) {
    const body = await list.json().catch(() => null);
    if (Array.isArray(body) && body.length > 0) throw new Error('匿名用户能直接列举整张表，必须收回表权限');
  }
  steps.push('表未对外开放');
  console.log('OK');

  console.log('\n全部通过，后端可用。');
} catch (e) {
  console.error(`\n失败：${e.message}`);
  if (steps.length) console.error(`已通过：${steps.join('、')}`);
  process.exit(1);
}
