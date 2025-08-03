import type { MockMedicationData, MedicationCategoryData, CategoryInfo, Medication, MedicationGroup } from '@/types/medication';
import { LucideIcon, Pill, Syringe, ShieldAlert, Package, Brain, Microscope, HeartPulse, Eye } from 'lucide-react';
import { slugify } from '@/lib/utils';

// Importar todos os arquivos de categoria estáticos
import antibioticos from '@/medications/Categorias/antibioticos_fixed.json';
import anticonvulsivantes from '@/medications/Categorias/anticonvulsivantes_fixed.json';
import antiemeticos from '@/medications/Categorias/antiemeticos_fixed.json';
import antimicrobianos from '@/medications/Categorias/antimicrobianos_fixed.json';
import antivirais from '@/medications/Categorias/antivirais_fixed.json';
import bloqueadorNeuromuscular from '@/medications/Categorias/bloqueador_neuromuscular_fixed.json';
import carvaoAtivado from '@/medications/Categorias/carvao_ativado_fixed.json';
import corticoidesEv from '@/medications/Categorias/corticoides_ev_fixed.json';
import medicacaoBradicardia from '@/medications/Categorias/medicacao_bradicardia_fixed.json';
import nasais from '@/medications/Categorias/nasais_fixed.json';
import oftalmologicosOtologicos from '@/medications/Categorias/oftalmologicos_otologicos_fixed.json';
import pcr from '@/medications/Categorias/pcr_fixed.json';
import sedativos from '@/medications/Categorias/sedativos_fixed.json';
import xaropesTosse from '@/medications/Categorias/xaropes_tosse_fixed.json';

// categoria 'diureticos' removida (não existe JSON correspondente)

// Arquivo estático de cada categoria
const categoryFiles: Record<string, Medication[]> = {
  'antibioticos': antibioticos,
  'anticonvulsivantes': anticonvulsivantes,
  'antiemeticos': antiemeticos,
  'antimicrobianos': antimicrobianos,
  'antivirais': antivirais,
  'bloqueador-neuromuscular': bloqueadorNeuromuscular,
  'carvao-ativado': carvaoAtivado,
  'corticoides-ev': corticoidesEv,
  'medicacao-bradicardia': medicacaoBradicardia,
  'nasais': nasais,
  'oftalmologicos-otologicos': oftalmologicosOtologicos,
  'pcr': pcr,
  'sedativos': sedativos,
  'xaropes-tosse': xaropesTosse,
};

const categoryIconMap: Record<string, { icon: LucideIcon; iconColorClass: string; bgColorClass: string }> = {
  'antibioticos': { icon: Pill, iconColorClass: 'text-blue-500', bgColorClass: 'bg-blue-100' },
  'antivirais': { icon: ShieldAlert, iconColorClass: 'text-green-500', bgColorClass: 'bg-green-100' },
  'antiemeticos': { icon: Package, iconColorClass: 'text-purple-500', bgColorClass: 'bg-purple-100' },
  'anticonvulsivantes': { icon: Brain, iconColorClass: 'text-indigo-600', bgColorClass: 'bg-indigo-100' },
  'antimicrobianos': { icon: Microscope, iconColorClass: 'text-green-600', bgColorClass: 'bg-green-100' },
  'bloqueador-neuromuscular': { icon: Brain, iconColorClass: 'text-gray-600', bgColorClass: 'bg-gray-100' },
  'corticoides-ev': { icon: Syringe, iconColorClass: 'text-red-500', bgColorClass: 'bg-red-100' },
  'medicacao-bradicardia': { icon: HeartPulse, iconColorClass: 'text-yellow-600', bgColorClass: 'bg-yellow-100' },
  'nasais': { icon: Package, iconColorClass: 'text-green-400', bgColorClass: 'bg-green-50' },
  'oftalmologicos-otologicos': { icon: Eye, iconColorClass: 'text-blue-500', bgColorClass: 'bg-blue-100' },
  'pcr': { icon: HeartPulse, iconColorClass: 'text-red-700', bgColorClass: 'bg-red-200' },
  'sedativos': { icon: Brain, iconColorClass: 'text-purple-600', bgColorClass: 'bg-purple-100' },
  'xaropes-tosse': { icon: Package, iconColorClass: 'text-amber-500', bgColorClass: 'bg-amber-100' },
};

function formatCategoryName(slug: string): string {
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function getLastUpdatedDate(): string {
  const now = new Date();
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${months[now.getMonth()]}/${now.getFullYear()}`;
}

function extractBaseName(fullName: string): string {
  // Remover informações extras e números
  const cleaned = fullName.replace(/\s*\([^)]*\)/g,'').split(/\d/)[0].trim();
  return cleaned;
}

function groupMedicationsByApplication(medications: Medication[]): MedicationGroup[] {
  // Agrupar medicamentos por via de administração
  const applicationGroups: Record<string, Medication[]> = {};
  
  medications.forEach(med => {
    const app = med.application || 'Outros';
    if (!applicationGroups[app]) applicationGroups[app] = [];
    applicationGroups[app].push(med);
  });
  
  const groups: MedicationGroup[] = [];
  
  // Criar grupos por aplicação
  Object.entries(applicationGroups).forEach(([app, meds]) => {
    // Dentro de cada aplicação, agrupar por nome base
    const baseNameGroups: Record<string, Medication[]> = {};
    
    meds.forEach(med => {
      const baseName = extractBaseName(med.name);
      if (!baseNameGroups[baseName]) baseNameGroups[baseName] = [];
      baseNameGroups[baseName].push(med);
    });
    
    // Criar grupos para cada nome base
    Object.entries(baseNameGroups).forEach(([baseName, variants]) => {
      groups.push({
        baseName: `${baseName} (${app})`,
        baseSlug: `${baseName.replace(/\s+/g, '-').toLowerCase()}-${app.toLowerCase()}`,
        variants
      });
    });
  });
  
  return groups;
}

export function loadMedicationData(): MockMedicationData {
  const data: MockMedicationData = {};
  const seen = new Set<string>();

  for (const [slug, meds] of Object.entries(categoryFiles)) {
    const iconInfo = categoryIconMap[slug] || { icon: Pill, iconColorClass: 'text-gray-500', bgColorClass: 'bg-gray-100' };

    // Remover duplicatas e gerar slugs únicos
    const unique = meds.filter(m => {
      const key = `${m.name}-${m.form||''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(m => {
      // Gerar slug único baseado no nome do medicamento
      const uniqueSlug = slugify(m.name);
      return {
        ...m,
        slug: uniqueSlug
      };
    });

    // Agrupar variantes - tratamento especial para antibióticos
    const groups: MedicationGroup[] = [];
    
    if (slug === 'antibioticos') {
      // Para antibióticos, agrupar primeiro por via de administração, depois por variantes
      groups.push(...groupMedicationsByApplication(unique));
    } else {
      // Para outras categorias, usar o agrupamento padrão
      const map: Record<string, Medication[]> = {};
      unique.forEach(m => {
        const base = extractBaseName(m.name);
        map[base] = map[base] || [];
        map[base].push(m);
      });
      for (const base in map) {
        groups.push({ baseName: base, baseSlug: base.replace(/\s+/g, '-').toLowerCase(), variants: map[base] });
      }
    }

    data[slug] = {
      slug,
      title: formatCategoryName(slug),
      icon: iconInfo.icon,
      iconColorClass: iconInfo.iconColorClass,
      bgColorClass: iconInfo.bgColorClass,
      medicationsCount: unique.length,
      lastUpdated: getLastUpdatedDate(),
      medications: unique,
      medicationGroups: groups,
      showGrouped: true
    };
  }

  return data;
}

export function loadCategories(): CategoryInfo[] {
  return Object.values(loadMedicationData()).map(cat => ({
    title: cat.title,
    slug: cat.slug,
    icon: cat.icon,
    iconColorClass: cat.iconColorClass,
    bgColorClass: cat.bgColorClass,
    medicationsCount: cat.medicationsCount,
    lastUpdated: cat.lastUpdated
  }));
}
