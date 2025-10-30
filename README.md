# Actividades

Aplicacao web em React + TypeScript para registrar actividades, notas e alertas diarios. Estruturada com boas praticas de componentes, contextos e hooks.

## Como rodar localmente
1. Instale dependencias com 
pm install.
2. Inicie o servidor de desenvolvimento com 
pm run dev.
3. Aplique lint opcionalmente com 
pm run lint.

## Scripts principais
- 
pm run dev: inicia o servidor Vite com HMR.
- 
pm run build: compila TypeScript e gera o bundle de producao.
- 
pm run preview: serve a versao gerada para testes.
- 
pm run lint: executa ESLint com a configuracao do projeto.

## Estrutura resumida
`
src/
  components/
  context/
  hooks/
  types/
  utils/
`

## Deploy no GitHub Pages
- Workflow: .github/workflows/deploy.yml.
- Ao fazer push na branch main, o GitHub Actions constroi o projeto, cria dist/404.html e publica em Pages.
- URL esperada apos o deploy: https://abubacar-aliasse.github.io/Actividades/.

## Requisitos
- Node.js 20+
- npm (usa 
pm ci no pipeline)

## Observacoes
- Dados de actividades e notas sao guardados em localStorage.
- Alertas diarios sao gerados para itens com status cobranca ou em_andamento.
- A interface inclui modo registo, painel de actividades, notas e dashboard com alertas.
