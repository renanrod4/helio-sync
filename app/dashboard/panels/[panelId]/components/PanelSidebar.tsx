"use client";

import React from "react";

type Props = {
  panelStatus: "online" | "offline" | "maintenance";
  efficiency: number;
  energyKwh: number;
  monthlyEnergyKwh: number;
  lastSyncLabel: string;
  latestVoltage: number;
  latestPowerW: number;
  currentA: number;
  azimuthDeg: number;
  elevationDeg: number;
  co2AvoidedKg: number;
};

export default function PanelSidebar({
  panelStatus,
  efficiency,
  energyKwh,
  monthlyEnergyKwh,
  lastSyncLabel,
  latestVoltage,
  latestPowerW,
  currentA,
  azimuthDeg,
  elevationDeg,
  co2AvoidedKg,
}: Props) {
  const powerFill = Math.min((latestPowerW / 500) * 100, 100);
  const statusBadgeStyles = {
    online: "border-helio-green/40 bg-helio-green/10 text-helio-green-light",
    offline: "border-helio-rose/40 bg-helio-rose/10 text-helio-rose",
    maintenance: "border-helio-gold/40 bg-helio-gold/10 text-helio-gold",
  } as const;
  const statusLabel =
    panelStatus === "online" ? "Rastreando Sol" : panelStatus === "maintenance" ? "Em manutenção" : "Offline";

  return (
    <div className="flex h-full flex-col  rounded-2xl border border-foreground/10 bg-[linear-gradient(180deg,rgba(6,14,6,0.92),rgba(6,14,6,0.6))] p-4 col-span-1 row-span-2">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`w-full rounded-lg border p-2 text-center text-xs uppercase tracking-[0.2em] ${statusBadgeStyles[panelStatus]}`}
        >
          {statusLabel}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-8">
        <div className="flex flex-col gap-1 rounded-xl border border-foreground/10 bg-white/4 p-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Eficiência</span>
          <span className="text-xl font-semibold text-primary">{efficiency.toFixed(0)}%</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-foreground/10 bg-white/4 p-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Voltagem</span>
          <span className="text-xl font-semibold text-primary">{latestVoltage.toFixed(1)} V</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-foreground/10 bg-white/4 p-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Corrente</span>
          <span className="text-xl font-semibold text-primary">{currentA.toFixed(1)} A</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-sky-400/20 bg-white/4 p-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">CO2 evitado</span>
          <span className="text-xl font-semibold text-sky-300">{co2AvoidedKg ? `${co2AvoidedKg.toFixed(2)} kg` : "--"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3">
        <div className="flex flex-col gap-1 rounded-xl border border-foreground/10 bg-white/4 p-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Azimute</span>
          <span className="text-xl font-semibold text-primary">{azimuthDeg.toFixed(1)}°</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-foreground/10 bg-white/4 p-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Elevação</span>
          <span className="text-xl font-semibold text-primary">{elevationDeg.toFixed(1)}°</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-8">
        <div className="flex items-center justify-between rounded-xl border border-helio-green/30 bg-helio-green/10 px-3 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Hoje</span>
            <span className="text-lg font-semibold text-helio-green-light">{energyKwh ? `${energyKwh.toFixed(1)} kWh` : "--"}</span>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-helio-green/30 bg-helio-green/10 px-3 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Mês</span>
            <span className="text-lg font-semibold text-helio-green-light">{monthlyEnergyKwh ? `${monthlyEnergyKwh.toFixed(0)} kWh` : "--"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex items-baseline justify-between text-xs text-muted">
          <span>Potência instantânea</span>
          <span className="text-sm font-semibold text-primary">{latestPowerW.toFixed(0)} W</span>
        </div>
        <div className="h-2 w-full rounded-full border border-foreground/10 bg-white/5">
          <div className="h-full rounded-full bg-helio-green-light/70" style={{ width: `${powerFill}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Última sincronização: {lastSyncLabel}</span>
          <span className="h-2 w-2 rounded-full bg-helio-green-light" />
        </div>
      </div>
    </div>
  );
}
