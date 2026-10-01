export interface CHOIX_COULEUR {
    numero: number,
    valeur: string,
}

export const ChoixCouleurs: CHOIX_COULEUR[]  = [
    {numero: 0 ,valeur:'ROUGE'},
    {numero: 1 ,valeur: 'ORANGE'},
    {numero: 2 ,valeur: 'JAUNE'},
    {numero: 3 ,valeur: 'VERT'},
    {numero: 4 ,valeur: 'EMERAUDE'},
    {numero: 5 ,valeur: 'CYAN'},
    {numero: 6 ,valeur:'BLEU'},
    {numero: 7 ,valeur: 'INDIGO'},
    {numero: 8 ,valeur: 'VIOLET'},
    {numero: 9 ,valeur: 'FUCHSIA'},
    {numero: 10 ,valeur: 'ROSE'},
    {numero: 11 ,valeur: 'GRIS'},
    {numero: 12 ,valeur: 'MARRON'},
    {numero: 13 ,valeur: 'TURQUOISE'}
];

export function afficherCouleurDossier(couleur: string | null): string{
    if(couleur!) return 'bg-gray-200 text-white';
    switch(couleur) {
    case 'ROUGE': return 'bg-red-600 text-white';
case 'ORANGE': return 'bg-orange-600 text-white';
case 'JAUNE': return 'bg-yellow-600 text-white';
case 'VERT': return 'bg-green-600 text-white';
case 'EMERAUDE': return 'bg-emerald-600 text-white';
case 'CYAN': return 'bg-cyan-600 text-white';
case 'BLEU': return 'bg-blue-600 text-white';
case 'INDIGO': return 'bg-indigo-600 text-white';
case 'VIOLET': return 'bg-violet-600 text-white';
case 'FUCHSIA': return 'bg-fuchsia-600 text-white';
case 'ROSE': return 'bg-pink-600 text-white';
case 'GRIS': return 'bg-gray-600 text-white';
case 'MARRON': return 'bg-amber-700 text-white';
case 'TURQUOISE': return 'bg-teal-600 text-white';
    default: return 'bg-gray-200 text-white';
}
    }