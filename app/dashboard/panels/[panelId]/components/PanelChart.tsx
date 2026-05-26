"use client";

import React from 'react';
import { TelemetryChartCard } from '@/lib/TelemetryChartCard';
import type { TelemetryEntry } from '@/lib/models/userDashboardData';

type Props = {
  panelTelemetry: TelemetryEntry[];
  panelLabel: string;
};

export default function PanelChart({ panelTelemetry, panelLabel }: Props) {
  return (
    <div className="lg:col-span-3 lg:row-span-2">
      <TelemetryChartCard telemetry={panelTelemetry} subjectLabel={`Placa ${panelLabel}`} chartHeightClassName="h-90" />
    </div>
  );
}
