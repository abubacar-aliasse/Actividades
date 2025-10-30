const DESCRIPTION_KEYS = [
  'nome',
  'descricao',
  'numero_chamado',
  'servico_movel',
  'modelo',
  'operadora',
];

export function computeActivityDescription(
  fields: Record<string, string>,
  fallback?: string,
) {
  for (const key of DESCRIPTION_KEYS) {
    const value = fields[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }

  const firstValue = Object.values(fields).find((value) => value && value.trim());
  if (firstValue) {
    return firstValue.trim();
  }

  return fallback || 'Atividade';
}
