import { useRef, useState } from 'react';
import { PageHead } from '../components/Bits';
import { useApp } from '../store/app';

function fmtTime(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function Settings() {
  const {
    sync,
    syncStatus,
    backendReady,
    backup,
    createSync,
    joinSync,
    syncNow,
    disconnect,
    setBackend,
    restoreBackup,
    exportData,
    importData,
  } = useApp();

  const [showBackend, setShowBackend] = useState(!backendReady);
  const [url, setUrl] = useState(sync.url);
  const [key, setKey] = useState(sync.key);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinInput, setJoinInput] = useState('');
  const [joinErr, setJoinErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const copy = async () => {
    if (!sync.code) return;
    try {
      await navigator.clipboard.writeText(sync.code);
    } catch {
      window.prompt('复制这段同步码：', sync.code);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const doJoin = async () => {
    setJoinErr(null);
    const err = await joinSync(joinInput);
    if (err) setJoinErr(err);
    else {
      setJoinInput('');
      setJoinOpen(false);
    }
  };

  const onFile = async (file: File) => {
    const text = await file.text();
    setImportMsg(importData(text) ? '已导入，并备份了导入前的进度' : '文件格式不对，导入失败');
  };

  const statusText = (() => {
    if (syncStatus.kind === 'syncing') return { cls: '', text: '正在同步…' };
    if (syncStatus.kind === 'ok') return { cls: 'ok', text: `已同步 · ${fmtTime(syncStatus.at)}` };
    if (syncStatus.kind === 'error') return { cls: 'err', text: `同步失败：${syncStatus.msg}` };
    return { cls: '', text: sync.lastSync ? '已开启，改动会自动推送' : '尚未同步' };
  })();

  return (
    <>
      <PageHead
        kicker="设 置"
        title="同步与数据"
        desc="进度默认只存在这台设备。开启同步后，电脑和手机输入同一个同步码就能共用一份进度。"
      />

      <div className="sync-card">
        {!backendReady ? (
          <>
            <div className="sync-h">先接一个后端</div>
            <p className="sync-p">
              同步需要一处能存数据的地方。GitHub Pages 只发静态文件，存不了数据，所以要单独接一个免费数据库。
              推荐 Supabase：免费额度足够，五分钟能建好。
            </p>
            <details className="setup">
              <summary>怎么建（三步）</summary>
              <ol>
                <li>
                  打开 supabase.com 注册，新建一个项目（区域选 Singapore 或 Tokyo 都行）。
                </li>
                <li>
                  进 SQL Editor，把仓库里的 <code>supabase/schema.sql</code> 整段粘贴执行。它会建表并配好行级权限。
                </li>
                <li>
                  进 Project Settings → API，复制 <b>Project URL</b> 和 <b>anon public key</b>，填到下面。
                </li>
              </ol>
            </details>
          </>
        ) : sync.code ? (
          <>
            <div className="sync-h">已开启同步</div>
            <p className="sync-p">
              在另一台设备打开本页，选择「输入已有同步码」，填下面这串即可。这串码就是钥匙，别公开发出去。
            </p>
            <div className="code-big">{sync.code}</div>
            <div className="sync-row">
              <button className="btn btn-p" onClick={copy}>
                {copied ? '✓ 已复制' : '复制同步码'}
              </button>
              <button className="btn btn-g" onClick={() => void syncNow()}>
                立即同步
              </button>
              <button className="btn btn-g" onClick={disconnect}>
                断开本机
              </button>
            </div>
            <div className={`status-line ${statusText.cls}`}>
              {statusText.text}　·　上次成功：{fmtTime(sync.lastSync)}
            </div>
            <p className="hint">
              断开只影响这台设备，云端数据不会删除。改动会在 1.5 秒后自动推送；打开页面或切回标签页时自动拉取。
            </p>
          </>
        ) : (
          <>
            <div className="sync-h">开启同步</div>
            <p className="sync-p">
              先在常用的那台设备（比如公司电脑）创建同步码，再在手机上输入同一串码。不用注册，也没有密码。
            </p>
            <div className="sync-row">
              <button className="btn btn-p" onClick={() => void createSync()}>
                在这台设备创建同步码
              </button>
              <button className="btn btn-g" onClick={() => setJoinOpen((v) => !v)}>
                输入已有同步码
              </button>
            </div>
            {joinOpen && (
              <div className="join-box">
                <input
                  className="input"
                  placeholder="ZP-XXXX-XXXX"
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void doJoin();
                  }}
                />
                <button className="btn btn-p" onClick={() => void doJoin()}>
                  加入
                </button>
                {joinErr && <div className="status-line err">{joinErr}</div>}
                <p className="hint">
                  加入会用云端进度覆盖本机进度。覆盖前会自动备份，可在下方「恢复同步前的进度」找回。
                </p>
              </div>
            )}
            <div className={`status-line ${statusText.cls}`}>{statusText.text}</div>
          </>
        )}

        <div className="backend-toggle">
          <button className="back-toc" onClick={() => setShowBackend((v) => !v)}>
            {showBackend ? '收起后端配置' : '后端配置'}
          </button>
        </div>

        {showBackend && (
          <div className="backend-box">
            <div className="field">
              <label>Project URL</label>
              <input
                className="input"
                placeholder="https://xxxx.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="field">
              <label>anon public key</label>
              <input
                className="input"
                placeholder="eyJhbGciOi..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
            <button className="btn btn-g btn-sm" onClick={() => setBackend(url, key)}>
              保存后端配置
            </button>
            <p className="hint">
              anon key 是公开密钥，安全性由数据库的行级权限保证：没有同步码的人读不到任何一行。
              这两项只存在本机浏览器，不会提交到仓库。
            </p>
          </div>
        )}
      </div>

      <div className="sec-t">备份与迁移</div>
      <div className="sync-card">
        <p className="sync-p" style={{ marginBottom: 14 }}>
          不开启同步也能用这两个按钮搬进度。导出的文件里是纯 JSON，包含已学标记、答题统计和错题本。
        </p>
        <div className="sync-row">
          <button className="btn btn-g" onClick={exportData}>
            导出进度文件
          </button>
          <button className="btn btn-g" onClick={() => fileRef.current?.click()}>
            导入进度文件
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
              e.target.value = '';
            }}
          />
          {backup && (
            <button className="btn btn-g" onClick={restoreBackup}>
              恢复同步前的进度（{fmtTime(new Date(backup.at).toISOString())}）
            </button>
          )}
        </div>
        {importMsg && <div className="status-line">{importMsg}</div>}
      </div>

      <div className="note note-warn" style={{ marginTop: 26 }}>
        <div className="note-k">隐私边界</div>
        现在同步的只有学习进度、答题统计和错题，<strong>不含生辰</strong>。以后如果做命例库，那部分要不要上云，单独再定——
        生辰属于敏感个人信息，存别人的盘还需要对方同意。
      </div>
    </>
  );
}
