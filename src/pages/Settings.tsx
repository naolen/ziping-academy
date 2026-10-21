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
    restoreBackup,
    exportData,
    importData,
  } = useApp();

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
            <div className="sync-h">这个站点没有接同步后端</div>
            <p className="sync-p">
              同步需要一处能存数据的地方，而 GitHub Pages 只发静态文件，存不了数据。所以后端在构建时注入，不在页面上填写。
            </p>
            <p className="hint">
              自己部署的话：在项目根目录建 <code>.env.local</code>，写入 <code>VITE_SYNC_URL</code> 与{' '}
              <code>VITE_SYNC_KEY</code> 后重新构建；部署到 GitHub Pages 时改为在仓库 Secrets 里配置同名变量。具体步骤见
              README。
            </p>
            <p className="hint">不开同步也能用：下面的导出 / 导入可以搬进度。</p>
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
