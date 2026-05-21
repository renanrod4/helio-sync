import { mockPanels } from '@/lib/mockData';
import PanelsCard from './panels/PanelCard'

export default function Panels() {
    return (
        <div className="flex flex-col  gap-4">
            <h2 className="text-lg font-semibold text-primary">Placas</h2>
            <div className="flex flex-wrap gap-4 max-w-332">
                {mockPanels.map(panel => (
                    <PanelsCard key={panel.id} panel={panel} />
                ))}
                <button
                    type="button"
                    className="flex min-h-55 max-w-xs w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-foreground/20 text-sm text-secondary transition hover:border-foreground/40 hover:text-primary"
                >
                    <span className="text-5xl font-medium">+</span>
                    <span className="text-xs uppercase tracking-[0.3em]">Adicionar Placa</span>
                </button>
            </div>
        </div>
    );
}