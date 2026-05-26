import React, { useEffect, useState } from 'react';
import type { PetalsStatus } from '@/lib/models/userDashboardData';
import { FiPower, FiRefreshCw } from 'react-icons/fi';
import { BiTargetLock } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';

type Props = {
  panelId?: string;
  panelLabel?: string;
  azimuthDeg?: number;
  elevationDeg?: number;
  petalsStatus?: PetalsStatus;
};

export default function PanelRight({ panelId, panelLabel, azimuthDeg, elevationDeg, petalsStatus }: Props) {
  const [followMode, setFollowMode] = useState(true);
  const [busy, setBusy] = useState(false);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    if (!moving) return;
    const t = setTimeout(() => setMoving(false), 1800);
    return () => clearTimeout(t);
  }, [moving]);

  function dispatchAction(action: string, payload: Record<string, unknown> = {}) {
    const detail = { panelId, action, ...(payload as Record<string, unknown>) };
    window.dispatchEvent(new CustomEvent('panel-control', { detail }));
  }

  async function handleRealign() {
    setBusy(true);
    dispatchAction('realign');
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
  }

  async function handleClosePetals() {
    setBusy(true);
    dispatchAction('closePetals');
    await new Promise((r) => setTimeout(r, 500));
    setBusy(false);
  }

  function toggleFollowMode() {
    const next = !followMode;
    setFollowMode(next);
    dispatchAction('setFollowMode', { enabled: next });
  }

  function highlightPanel() {
    dispatchAction('highlight');
    setMoving(true);
  }

  return (
    <aside
      className="rounded-2xl border border-foreground/10 bg-white/5 p-4 lg:col-span-1 lg:row-span-2"
      style={{ background: 'var(--color-helio-bg-tertiary)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: 'var(--helio-glow-green)', color: 'var(--helio-green-forest)' }}
        >
          <FiPower />
        </div>
        <div>
            <div className="text-xs text-muted">Controle Remoto</div>
            <div className="font-semibold">{panelLabel ?? 'Placa'}</div>
            <div className="text-xs text-muted mt-1">
              Az: {Number(azimuthDeg ?? 0).toFixed(1)}° • El: {Number(elevationDeg ?? 0).toFixed(1)}° • Pétalas: {petalsStatus ?? 'unknown'}
            </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-foreground/5 bg-white/6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: 'var(--helio-glow-green)', color: 'var(--helio-green-forest)' }}
            >
              <FiRefreshCw />
            </div>
            <div>
              <div className="text-sm font-medium">Auto-Rastreio</div>
              <div className="text-xs text-muted">Seguir posição solar</div>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center" aria-label="Ativar Follow Mode">
            <input
              aria-label="Ativar Follow Mode"
              type="checkbox"
              className="peer sr-only cursor-pointer"
              checked={followMode}
              onChange={toggleFollowMode}
            />
            <span
              className="h-6 w-11 rounded-full transition-all duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-helio-focus"
              style={{ background: followMode ? 'var(--helio-green-forest)' : 'var(--color-muted)' }}
            />
            <span
              className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                followMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </label>
        </div>

        <div className="mt-4">
            <button
            type="button"
            onClick={highlightPanel}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl px-4 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.99]"
            style={{ background: 'var(--helio-green-forest)', boxShadow: '0 8px 20px -12px var(--helio-green-forest)' }}
          >
            <BiTargetLock />
            Identificar no Campo
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={handleRealign}
            disabled={busy}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-white/3 px-4 py-2 text-primary font-medium hover:bg-white/6 disabled:opacity-60"
          >
            <FiRefreshCw />
            Re-alinhar
          </button>

          <div>
            <button
              type="button"
              disabled={busy}
              onClick={handleClosePetals}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border bg-transparent px-4 py-3 text-helio-rose font-medium hover:bg-white/6 disabled:opacity-60"
              style={{ borderColor: 'var(--helio-rose)' }}
            >
              <IoIosClose />
              Fechar Pétalas
            </button>
            <p className="mt-3 text-xs text-muted">O fechamento de emergência protege os painéis contra ventos fortes e chuvas de granizo</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
