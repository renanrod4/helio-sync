"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export type PanelModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PanelFormData) => void;
};

export type PanelFormData = {
  serialId: string;
  label: string;
  latitude: string; // Mantido como string
  longitude: string; // Mantido como string
};

const initialState: PanelFormData = {
  serialId: '',
  label: '',
  latitude: '0',
  longitude: '0',
};

export default function PanelModal({ open, onClose, onSubmit }: PanelModalProps) {
  const [form, setForm] = useState<PanelFormData>(initialState);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    
    // Agora aceita qualquer texto temporariamente (como o "-")
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.serialId) {
      setError('Serial ID do dispositivo é obrigatório');
      return;
    }
    if (!form.label) {
      setError('Nome da placa é obrigatório');
      return;
    }

    // Validação opcional: verificar se são coordenadas válidas antes de enviar
    const latNum = Number(form.latitude);
    const lngNum = Number(form.longitude);

    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Latitude e Longitude precisam ser números válidos');
      return;
    }

    setError(null);
    
    // Envia os dados estruturados como string (ou você pode alterar o 'onSubmit' 
    // na sua aplicação se a API esperar números de verdade)
    onSubmit(form);
    setForm(initialState);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-helio-bg-primary text-white p-4 border-b border-foreground/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-3">Adicionar Placa</h3>
              <p className="text-sm text-muted opacity-90">Insira um nome identificável e as coordenadas da placa.</p>
            </div>
            <button
              aria-label="Fechar"
              onClick={onClose}
              className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-helio-bg-secondary p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Serial ID (ESP32)</label>
            <input
              name="serialId"
              value={form.serialId}
              onChange={handleChange}
              placeholder="Ex.: HS-001-A23"
              className="mt-2 h-13 w-full rounded-2xl border border-foreground/12 bg-white/3 px-5 text-body text-foreground placeholder:text-muted/90 transition-colors focus:border-helio-gold/45 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Nome</label>
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="Ex.: Helio-Alpha"
              className="mt-2 h-13 w-full rounded-2xl border border-foreground/12 bg-white/3 px-5 text-body text-foreground placeholder:text-muted/90 transition-colors focus:border-helio-gold/45 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground">Latitude</label>
              <input
                name="latitude"
                type="number"
                value={form.latitude}
                onChange={handleChange}
                placeholder="-23.499528"
                className="mt-2 h-13 w-full rounded-2xl border border-foreground/12 bg-white/3 px-5 text-body text-foreground placeholder:text-muted/90 transition-colors focus:border-helio-gold/45 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Longitude</label>
              <input
                name="longitude"
                type="number"
                value={form.longitude}
                onChange={handleChange}
                placeholder="-47.400944"
                className="mt-2 h-13 w-full rounded-2xl border border-foreground/12 bg-white/3 px-5 text-body text-foreground placeholder:text-muted/90 transition-colors focus:border-helio-gold/45 focus:outline-none"
              />
            </div>
          </div>

          {error && <div className="text-rose-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="createAccount" onClick={onClose} className="px-4 py-2">Cancelar</Button>
            <Button type="submit" variant="enter" className="px-4 py-2">Adicionar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}