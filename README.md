# TaskFlow — Sistema de Gestão de Férias

Sistema full-stack para gestão de colaboradores e pedidos de férias, com autenticação via Keycloak e controlo de acesso baseado em roles.

---

## Índice

- [Arquitetura](#arquitetura)
- [Stack Tecnológico](#stack-tecnológico)
- [Pré-requisitos](#pré-requisitos)
- [Arranque Rápido](#arranque-rápido)
- [Configuração do Frontend](#configuração-do-frontend)
- [Utilizadores de Teste](#utilizadores-de-teste)
- [Funcionalidades por Role](#funcionalidades-por-role)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API do Backend](#api-do-backend)
- [Limitações Conhecidas](#limitações-conhecidas)

---

## Arquitetura

```
┌──────────────────────────────────────────────────────┐
│                     Browser                          │
│              localhost:3000 (Next.js)                │
└───────────────────────┬──────────────────────────────┘
                        │ HTTPS / cookies de sessão
                        ▼
┌──────────────────────────────────────────────────────┐
│            Next.js 16 (App Router)                   │
│  ┌─────────────────┐   ┌──────────────────────────┐  │
│  │ Server Components│   │    Server Actions        │  │
│  │  (fetch + auth) │   │ (mutations + revalidate) │  │
│  └────────┬────────┘   └────────────┬─────────────┘  │
└───────────┼─────────────────────────┼────────────────┘
            │ Bearer JWT              │ Bearer JWT
            ▼                         ▼
┌──────────────────────────────────────────────────────┐
│         Spring Boot 4 (REST API)  :8081              │
│              @PreAuthorize por role                  │
└───────────────────────┬──────────────────────────────┘
                        │ JDBC
                        ▼
┌──────────────────────────────────────────────────────┐
│              PostgreSQL 16  :5432                    │
└──────────────────────────────────────────────────────┘

         Keycloak 26 (OAuth2 / OpenID Connect) :8080
         Realm: lbc  |  Client: vacations (público)
```

---

## Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16.2 · React 19 · TypeScript 5 · Tailwind CSS 4 |
| Autenticação UI | NextAuth 5 (beta) com provider Keycloak |
| Backend | Spring Boot 4 · Java 25 · Spring Data JPA · Spring Security OAuth2 |
| Base de dados | PostgreSQL 16 |
| Identity Provider | Keycloak 26.1.4 |
| Infraestrutura | Docker · Docker Compose |
| Documentação API | Springdoc OpenAPI 3 (Swagger UI) |

---

## Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- [Node.js](https://nodejs.org/) 20+ (apenas para desenvolvimento local do frontend)
- Java 25 e Maven (apenas para desenvolvimento local do backend)

---

## Arranque Rápido

### Opção A — Docker Compose (stack completa)

```bash
# 1. Clonar o repositório
git clone <repo-url>
cd vacations

# 2. Configurar variáveis de ambiente do frontend
cp front-end/.env.example front-end/.env.local
# Editar .env.local e preencher AUTH_SECRET

# 3. Iniciar todos os serviços
docker-compose up --build
```

Serviços disponíveis:

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8081 |
| Keycloak | http://localhost:8080 |
| Swagger UI | http://localhost:8081/swagger-ui.html |
| PostgreSQL | localhost:5432 |

### Opção B — Desenvolvimento local

```bash
# Terminal 1 — Infraestrutura (Keycloak + PostgreSQL)
docker-compose up postgres keycloak

# Terminal 2 — Backend
cd back-end
mvn spring-boot:run

# Terminal 3 — Frontend
cd front-end
cp .env.example .env.local   # preencher variáveis
npm install
npm run dev
```

---

## Configuração do Frontend

Criar o ficheiro `front-end/.env.local` com base em `front-end/.env.example`:

```env
# URL base do frontend
AUTH_URL=http://localhost:3000

# Keycloak — realm "lbc", client público "vacations"
AUTH_KEYCLOAK_ID=vacations
AUTH_KEYCLOAK_SECRET=not-required
AUTH_KEYCLOAK_ISSUER=http://localhost:8080/realms/lbc

# Segredo para assinar cookies de sessão (gerar com: openssl rand -base64 32)
AUTH_SECRET=<gerar-com-openssl>

# URL do backend Spring Boot
BACKEND_URL=http://localhost:8081
```

> **Nota:** O client Keycloak `vacations` é público — o `AUTH_KEYCLOAK_SECRET` não é validado pelo Keycloak, mas o NextAuth requer um valor não vazio.

---

## Utilizadores de Teste

Os utilizadores são importados automaticamente pelo Keycloak no arranque via `keycloak/realm-export.json`.

| Username | Password | Role | Permissões |
|----------|----------|------|-----------|
| `admin` | `qwerty` | Admin | CRUD completo de colaboradores; gestão de todos os pedidos |
| `manager` | `qwerty` | Manager | Aprovar/rejeitar pedidos dos seus colaboradores |
| `collaborator` | `qwerty` | Collaborator | Criar e cancelar os seus próprios pedidos de férias |

---

## Funcionalidades por Role

### Admin
- Criar, listar, editar e remover colaboradores
- Visualizar todos os pedidos de férias
- Aprovar e rejeitar qualquer pedido
- Dashboard com estatísticas globais

### Manager
- Visualizar pedidos de férias dos colaboradores da sua equipa
- Aprovar e rejeitar pedidos pendentes
- Dashboard com estatísticas da sua equipa

### Collaborator
- Criar novos pedidos de férias (requer o UUID do registo criado pelo admin)
- Cancelar pedidos pendentes próprios
- Dashboard pessoal

---

## Estrutura do Projeto

```
vacations/
├── back-end/                      # Spring Boot REST API
│   └── src/main/java/com/lbc/vacations/
│       ├── employee/              # CRUD de colaboradores
│       │   ├── controller/
│       │   ├── dto/               # EmployeeRequest, EmployeeResponse
│       │   ├── domain/            # Entidade Employee (JPA)
│       │   ├── service/
│       │   └── repository/
│       ├── vacation/              # Gestão de pedidos de férias
│       │   ├── controller/
│       │   ├── dto/               # CreateVacationRequest, VacationResponse
│       │   ├── domain/            # Entidade VacationRequest (JPA)
│       │   └── service/
│       ├── configs/               # SecurityConfig, JwtConverter
│       └── exceptions/            # GlobalExceptionHandler, ApiError
│
├── front-end/                     # Next.js 16 App Router
│   └── src/
│       ├── app/
│       │   ├── (app)/             # Páginas autenticadas (layout com sidebar)
│       │   │   ├── dashboard/
│       │   │   ├── collaborators/
│       │   │   └── vacations/
│       │   ├── auth/              # Configuração NextAuth + middleware
│       │   └── api/auth/          # Route handler NextAuth
│       ├── components/
│       │   ├── ui/                # Avatar, Badge, Button, Field, Modal, StatCard
│       │   ├── layout/            # Sidebar, NavItem
│       │   ├── dashboard/         # StatsGrid, RecentRequests
│       │   ├── collaborators/     # CollaboratorsTable, CollaboratorForm, CollaboratorDetail
│       │   └── vacations/         # VacationsTable, VacationForm, VacationDetail
│       ├── lib/
│       │   ├── api/               # Camada de acesso ao backend
│       │   │   ├── client.ts      # HTTP client com Bearer token automático
│       │   │   ├── types.ts       # DTOs exactos do backend
│       │   │   ├── employees.ts   # Funções de acesso à API de colaboradores
│       │   │   └── vacations.ts   # Funções de acesso à API de férias
│       │   ├── constants.ts
│       │   └── utils.ts
│       ├── actions/               # Next.js Server Actions (mutations)
│       │   ├── employees.ts
│       │   └── vacations.ts
│       └── types/                 # Tipos TypeScript partilhados
│           ├── index.ts
│           └── next-auth.d.ts
│
├── keycloak/
│   └── realm-export.json          # Realm "lbc" com utilizadores e roles pré-configurados
│
└── docker-compose.yml             # Orquestração: postgres, keycloak, back, nextjs
```

---

## API do Backend

Documentação interativa disponível em **http://localhost:8081/swagger-ui.html** após arranque.

### Colaboradores — `/api/employees` (role: ADMIN)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/employees` | Criar colaborador |
| `GET` | `/api/employees` | Listar colaboradores (paginado) |
| `GET` | `/api/employees/{id}` | Obter colaborador por ID |
| `PUT` | `/api/employees/{id}` | Atualizar colaborador |
| `DELETE` | `/api/employees/{id}` | Remover colaborador |

**Corpo do pedido (criar/atualizar):**
```json
{
  "name": "string",
  "email": "string",
  "managerId": "uuid (opcional)",
  "sub": "uuid Keycloak do utilizador (opcional)"
}
```

### Pedidos de Férias — `/api/vacations`

| Método | Endpoint | Role | Descrição |
|--------|----------|------|-----------|
| `POST` | `/api/vacations/employee/{employeeId}` | COLLABORATOR | Criar pedido |
| `GET` | `/api/vacations` | ADMIN, MANAGER | Listar todos os pedidos |
| `PATCH` | `/api/vacations/{id}/approve` | ADMIN, MANAGER | Aprovar pedido |
| `PATCH` | `/api/vacations/{id}/reject` | ADMIN, MANAGER | Rejeitar pedido |
| `PATCH` | `/api/vacations/{id}/cancel` | COLLABORATOR | Cancelar pedido |

**Corpo do pedido (criar):**
```json
{
  "startDate": "2025-08-01",
  "endDate": "2025-08-05"
}
```

**Formato de erro (ApiError):**
```json
{
  "timestamp": "2025-08-01T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Descrição do erro",
  "path": "/api/vacations/..."
}
```

### Autenticação

Todos os endpoints (excepto Swagger) requerem o header:
```
Authorization: Bearer <access_token_keycloak>
```

---

## Limitações Conhecidas

| Limitação | Contexto |
|-----------|----------|
| `GET /api/vacations` requer ADMIN ou MANAGER | Colaboradores não conseguem listar os seus próprios pedidos via API |
| Sem endpoint `/api/employees/me` | Colaborador precisa que o admin crie o seu registo e comunique o UUID |
| Token refresh não implementado | O access token expira ao fim de ~5 minutos; novo login necessário |
| `GET /api/employees` requer ADMIN | Managers não conseguem listar colaboradores directamente |

### Fluxo de Setup para Colaborador

Para que um colaborador possa criar pedidos de férias:

1. **Admin** acede a `/collaborators` → cria o registo do colaborador
2. No campo **"Keycloak Subject (sub)"** introduz o `sub` do token JWT do utilizador
3. O backend devolve um UUID — o admin comunica-o ao colaborador
4. **Colaborador** acede a `/vacations` → clica em **"+ Novo Pedido"** → introduz o UUID no formulário
