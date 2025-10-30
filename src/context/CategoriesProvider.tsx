import { useCallback, useMemo, type ReactNode } from 'react';
import { CategoriesContext } from './CategoriesContext';
import type { CategoryDefinition, CategoryField } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const STORAGE_KEY = 'registro-atividades@categories';

function slug(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[^\w\s-/]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '_');
}

function createId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const COBRANCA_OPTIONS = (function () {
  return {
    chamados: [
      { value: 'cobranca_por_aprovacao', label: 'Cobranca por aprovacao' },
      { value: 'cobranca_por_atendimento', label: 'Cobranca por atendimento' },
      { value: 'finalizado', label: 'Finalizado' },
    ],
    gerais: [
      { value: 'em_acompanhamento', label: 'Em acompanhamento' },
      { value: 'cobranca', label: 'Cobranca' },
      { value: 'finalizado', label: 'Finalizado' },
    ],
  };
})();

const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'cat_telefonia_movel',
    name: 'Atendimento de Telefonia Movel',
    fields: [
      { id: 'f_ano', key: 'ano', label: 'Ano', type: 'number' },
      { id: 'f_mes', key: 'mes', label: 'Mes', type: 'text' },
      { id: 'f_servico_movel', key: 'servico_movel', label: 'Servico Movel', type: 'text' },
      { id: 'f_data_entrega', key: 'data_entrega', label: 'Data de Entrega', type: 'date' },
      { id: 'f_username', key: 'username', label: 'Username', type: 'text' },
      { id: 'f_nome', key: 'nome', label: 'Nome', type: 'text' },
      { id: 'f_matricula', key: 'matricula', label: 'Matricula', type: 'text' },
      { id: 'f_local', key: 'local', label: 'Local', type: 'text' },
      { id: 'f_nome_gestor', key: 'nome_gestor', label: 'Nome do Gestor', type: 'text' },
      { id: 'f_email', key: 'email', label: 'Email', type: 'email' },
      { id: 'f_operadora', key: 'operadora', label: 'Operadora', type: 'text' },
      { id: 'f_marca', key: 'marca', label: 'Marca/Aparelho', type: 'text' },
      { id: 'f_modelo', key: 'modelo', label: 'Modelo', type: 'text' },
      { id: 'f_imei', key: 'imei', label: 'IMEI', type: 'text' },
      { id: 'f_numero_linha', key: 'numero_linha', label: 'Numero / Linha', type: 'tel' },
      { id: 'f_empresa_titular', key: 'empresa_titular', label: 'Empresa Titular', type: 'text' },
      { id: 'f_numero_chamado', key: 'numero_chamado', label: 'Numero do Chamado', type: 'text' },
    ],
  },
  {
    id: 'cat_atendimento_chamados',
    name: 'Atendimento - Chamados a acompanhar',
    fields: [
      { id: 'f_chamados_nome', key: 'nome', label: 'Nome', type: 'text', required: true },
      {
        id: 'f_chamados_data_criacao',
        key: 'data_criacao',
        label: 'Data de criacao',
        type: 'date',
        readOnly: true,
      },
      {
        id: 'f_chamados_numero',
        key: 'numero_chamado',
        label: 'Numero de chamado',
        type: 'text',
        required: true,
      },
      {
        id: 'f_chamados_descricao',
        key: 'descricao',
        label: 'Descricao',
        type: 'textarea',
        placeholder: 'Detalhe o chamado',
      },
      {
        id: 'f_chamados_status',
        key: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: COBRANCA_OPTIONS.chamados,
      },
      {
        id: 'f_chamados_status_modificado',
        key: 'status_modificado',
        label: 'Data de modificacao de status',
        type: 'date',
        readOnly: true,
      },
      {
        id: 'f_chamados_proxima_cobranca',
        key: 'proxima_cobranca',
        label: 'Proxima cobranca',
        type: 'date',
        dependsOn: {
          fieldKey: 'status',
          values: ['cobranca_por_aprovacao', 'cobranca_por_atendimento'],
        },
      },
    ],
  },
  {
    id: 'cat_atendimento_gerais',
    name: 'Atendimento - Atendimentos gerais',
    fields: [
      { id: 'f_gerais_nome', key: 'nome', label: 'Nome', type: 'text', required: true },
      {
        id: 'f_gerais_data_criacao',
        key: 'data_criacao',
        label: 'Data de criacao',
        type: 'date',
        readOnly: true,
      },
      {
        id: 'f_gerais_descricao',
        key: 'descricao',
        label: 'Descricao',
        type: 'textarea',
        placeholder: 'Detalhe o atendimento',
      },
      {
        id: 'f_gerais_status',
        key: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: COBRANCA_OPTIONS.gerais,
      },
      {
        id: 'f_gerais_status_modificado',
        key: 'status_modificado',
        label: 'Data de modificacao de status',
        type: 'date',
        readOnly: true,
      },
      {
        id: 'f_gerais_proxima_cobranca',
        key: 'proxima_cobranca',
        label: 'Proxima cobranca',
        type: 'date',
        dependsOn: {
          fieldKey: 'status',
          values: ['cobranca'],
        },
      },
    ],
  },
  {
    id: 'cat_atendimento_executivos',
    name: 'Atendimento - Atendimentos executivos',
    fields: [
      { id: 'f_exec_nome', key: 'nome', label: 'Nome', type: 'text', required: true },
      {
        id: 'f_exec_data_criacao',
        key: 'data_criacao',
        label: 'Data de criacao',
        type: 'date',
        readOnly: true,
      },
      {
        id: 'f_exec_descricao',
        key: 'descricao',
        label: 'Descricao',
        type: 'textarea',
        placeholder: 'Detalhe o atendimento',
      },
      {
        id: 'f_exec_status',
        key: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: COBRANCA_OPTIONS.gerais,
      },
      {
        id: 'f_exec_status_modificado',
        key: 'status_modificado',
        label: 'Data de modificacao de status',
        type: 'date',
        readOnly: true,
      },
      {
        id: 'f_exec_proxima_cobranca',
        key: 'proxima_cobranca',
        label: 'Proxima cobranca',
        type: 'date',
        dependsOn: {
          fieldKey: 'status',
          values: ['cobranca'],
        },
      },
    ],
  },
];

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useLocalStorage<CategoryDefinition[]>(
    STORAGE_KEY,
    DEFAULT_CATEGORIES,
  );

  const addCategory = useCallback((name: string) => {
    const id = createId('cat');
    setCategories((prev) => [...prev, { id, name: name.trim(), fields: [] }]);
    return id;
  }, [setCategories]);

  const updateCategory = useCallback((id: string, name: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, name: name.trim() } : category,
      ),
    );
  }, [setCategories]);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  }, [setCategories]);

  const addField = useCallback((categoryId: string, field: Omit<CategoryField, 'id'>) => {
    const id = createId('f');
    setCategories((prev) => prev.map((category) => (
      category.id === categoryId
        ? {
            ...category,
            fields: [
              ...category.fields,
              { ...field, id, key: field.key || slug(field.label) },
            ],
          }
        : category
    )));
    return id;
  }, [setCategories]);

  const updateField = useCallback(
    (
      categoryId: string,
      fieldId: string,
      updates: Partial<Omit<CategoryField, 'id'>>,
    ) => {
      setCategories((prev) =>
        prev.map((category) => {
          if (category.id !== categoryId) {
            return category;
          }

          return {
            ...category,
            fields: category.fields.map((field) =>
              field.id === fieldId
                ? { ...field, ...updates, key: updates.key || field.key }
                : field,
            ),
          };
        }),
      );
    },
    [setCategories],
  );

  const removeField = useCallback((categoryId: string, fieldId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              fields: category.fields.filter((field) => field.id !== fieldId),
            }
          : category,
      ),
    );
  }, [setCategories]);

  const value = useMemo(
    () => ({
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      addField,
      updateField,
      removeField,
    }),
    [categories, addCategory, updateCategory, deleteCategory, addField, updateField, removeField],
  );

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}
