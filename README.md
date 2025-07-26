# Gestor de Vendas

Sistema web para gestão de vendas com interface elegante e funcionalidades completas.

## 🚀 Funcionalidades

- **Vender**: Interface dividida para seleção de produtos e comanda atual
- **Produtos**: Gerenciamento completo de produtos (CRUD)
- **Relatórios**: Dashboard com métricas e exportação CSV

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

\`\`\`env
# Banco de Dados Neon
DATABASE_URL=postgresql://username:password@host/database

# Autenticação do Sistema
AUTH_USERNAME=seu_usuario_aqui
AUTH_PASSWORD=sua_senha_aqui

# Configurações Públicas (para validação no cliente)
NEXT_PUBLIC_AUTH_USERNAME=seu_usuario_aqui
NEXT_PUBLIC_AUTH_PASSWORD=sua_senha_aqui
\`\`\`

### 2. Instalação

\`\`\`bash
# Instalar dependências
npm install

# Executar scripts de criação do banco
npm run db:setup

# Iniciar o servidor de desenvolvimento
npm run dev
\`\`\`

### 3. Banco de Dados

O sistema usa Neon PostgreSQL. Execute os scripts SQL na pasta `scripts/` para criar as tabelas necessárias:

1. `001-create-tables.sql` - Cria as tabelas produtos e vendas
2. `002-seed-data.sql` - Insere dados de exemplo

## 🔐 Segurança

- As credenciais de login são configuradas via variáveis de ambiente
- O arquivo `.env` está no `.gitignore` para não ser versionado
- Use o arquivo `.env.example` como referência

## 📱 Uso

1. Faça login com as credenciais configuradas
2. Use a aba "Vender" para processar vendas
3. Gerencie produtos na aba "Produtos"
4. Visualize relatórios e exporte dados na aba "Relatórios"

## 🛠️ Tecnologias

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Neon PostgreSQL

## 📄 Licença

Este projeto é privado e destinado ao uso interno.
