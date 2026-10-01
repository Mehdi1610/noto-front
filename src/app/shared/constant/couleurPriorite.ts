
export function couleurPriorite(priorite: string | null): string{

    if(!priorite) return 'bg-slate-50 border-slate-200 text-slate-800';

    switch (priorite.toUpperCase()) {
        case 'HAUTE':
        // Rose / Rouge pastel doux (urgent mais pas agressif)
        return 'bg-rose-50 border-rose-200 text-rose-900';
        
        case 'MOYENNE':
        // Ambre / Jaune miel chaleureux
        return 'bg-amber-50 border-amber-200 text-amber-900';
        
        case 'BASSE':
        // Émeraude / Vert menthe apaisant
        return 'bg-emerald-50 border-emerald-200 text-emerald-900';
        
        default:
        // Neutre (sans priorité)
        return 'bg-slate-50 border-slate-200 text-slate-800';
    } 
}