# 📝 To-Do List

Aplicação Full Stack para gerenciamento de tarefas, desenvolvida com boas práticas de engenharia de software, organização de código e facilidade de manutenção.

---

## 🧱 Stack

| Camada          | Tecnologia                     |
| --------------- | ------------------------------ |
| Backend         | Django + Django REST Framework |
| Frontend        | React + Vite                   |
| Banco de dados  | PostgreSQL                     |
| Containerização | Docker                         |

---

## 📋 Sumário

- [Visão geral](#visão-geral)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Portas da aplicação](#portas-da-aplicação)
- [Arquitetura do projeto](#arquitetura-do-projeto)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Decisões de design](#decisões-de-design)
- [Banco de dados](#banco-de-dados)
- [Autenticação](#autenticação)
- [Documentação da API](#documentação-da-api)
- [Otimização de performance](#otimização-de-performance)
- [Tratamento de erros](#tratamento-de-erros)
- [Logs](#logs)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Qualidade de código](#qualidade-de-código)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Commits](#commits)
- [API externa](#api-externa)

---

## 👁️ Visão geral

O sistema permite:

- Cadastro de usuários
- Autenticação via token
- Criação de tarefas e categorias
- Atualização de tarefas e categorias
- Remoção de tarefas e categorias
- Filtragem e busca de tarefas e categorias

Toda a lógica de negócio é exposta através de uma API REST, consumida pelo frontend.

#### Monorepo?

Foi utilizado um monorepo para facilitar a organização do projeto, mantendo frontend e backend no mesmo repositório.
No entanto, essa abordagem não é a mais recomendada para projetos grandes. Em cenários mais complexos, o ideal é utilizar `microserviços`, separando os serviços em aplicações independentes.

##### 📁 Estrutura root

```
root/
│
├── backend/
│   └── ...
├── frontend/
│   └── ...
├── docker-compose.yml
├── README.md
```

---

## 🛠️ Tecnologias utilizadas

**Backend**

- Python
- Django
- Django REST Framework
- PostgreSQL
- drf-spectacular
- django-filter

**Infraestrutura**

- Docker
- Docker Compose

**Servidor de aplicação**

- Gunicorn
- Uvicorn

**Qualidade de código**

- uv
- ruff
- mypy

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Executando o projeto

```bash
git clone <repo>

cd project

docker compose up -d
```

O Docker irá iniciar automaticamente:

- Banco de dados PostgreSQL
- Backend Django
- Frontend React

---

## 🌐 Portas da aplicação

| Serviço    | URL                            |
| ---------- | ------------------------------ |
| Frontend   | http://localhost:5173          |
| Backend    | http://localhost:8000          |
| Swagger UI | http://localhost:8000/api/docs |

---

## 📚 Documentação da API

A documentação é gerada automaticamente com **drf-spectacular**, seguindo o padrão OpenAPI.

Acesse o Swagger UI em:

```
http://localhost:8000/api/docs
```

Isso facilita testes da API, integração com outros serviços e entendimento dos endpoints.

---

## 🏛️ Arquitetura do projeto

O backend segue uma arquitetura em camadas:

```
Models → Serializers → Views / ViewSets → Services -> repositories
```

| Camada           | Responsabilidade                                           |
| ---------------- | ---------------------------------------------------------- |
| Models           | Definição das entidades do banco de dados                  |
| Serializers      | Transformação de dados entre JSON e objetos Python         |
| Views / ViewSets | Definição dos endpoints da API                             |
| Services         | Lógica de negócio e processamento                          |
| Repositories     | Responsável por interagir diretamente com o banco de dados |

Essa separação garante baixo acoplamento e maior facilidade de testes.

---

## 📁 Estrutura de pastas

```
backend/
│
├── apps/
│   └── tasks/
│       │
│       ├── domain/
│       │   └── services/
│       │       ├── category_rules.py
│       │       └── task_rules.py
│       │
│       ├── migrations/
│       │   ├── __init__.py
│       │
│       ├── model/
│       │   ├── __init__.py
│       │   ├── category_model.py
│       │   └── task_model.py
│       │
│       ├── presentation/
│       │   ├── serializers/
│       │   └── views/
│       │
│       ├── repository/
│       │   ├── category_repository.py
│       │   └── task_repository.py
│       │
│       ├── services/
│       │   ├── category_service.py
│       │   └── task_service.py
│       │
│       ├── tests/
│       │   └── presentation/
│       │       └── views/
│       │           ├── __init__.py
│       │           ├── test_category_view.py
│       │           └── test_task_view.py
│       │
│       ├── __init__.py
│       ├── apps.py
│       ├── models.py
│       └── urls.py
│
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── settings_test.py
│   ├── urls.py
│   └── wsgi.py
│
├── core/
│   │
│   ├── exceptions/
│   │   └── handler.py
│   │
│   ├── middleware/
│   │   ├── renderers.py
│   │   └── request_logging.py
│   │
│   ├── pagination.py
│   └── spectacular_hooks.py
│
├── __pycache__/
│
├── manage.py
├── pyproject.toml
└── uv.lock
```

---

## 🎨 Decisões de design

### SOLID

**Single Responsibility Principle**
Cada componente possui uma única responsabilidade: models cuidam da estrutura do banco, serializers da transformação de dados, views dos endpoints e services da lógica de negócio.

**Open/Closed Principle**
O código permite extensão sem necessidade de modificar implementações existentes.

### DRY (Don't Repeat Yourself)

Duplicação de código evitada através de serializers reutilizáveis, handlers de erro padronizados e abstrações reutilizáveis.

### KISS (Keep It Simple)

Foram utilizadas funcionalidades nativas do Django REST Framework sempre que possível, como `ModelViewSet` e `GenericAPIView`, reduzindo código repetitivo e melhorando a manutenção.

---

## 🗄️ Banco de dados

**PostgreSQL** foi escolhido por sua robustez, confiabilidade, suporte a consultas complexas e excelente performance em aplicações web.

### Customização do modelo de usuário

O modelo `User` utiliza **UUID v4** como identificador primário, o que traz:

- Maior segurança
- Proteção contra enumeração de usuários
- Maior adequação para APIs públicas

---

## 🔐 Autenticação

A autenticação é implementada com `rest_framework.authtoken`. Cada usuário autenticado recebe um token que deve ser enviado no header das requisições:

```
Authorization: Token <token>
```

---

## ⚡ Otimização de performance

### Otimização de queries

Para melhorar a performance das consultas foram utilizados:

- `select_related`
- `prefetch_related`
- `Q objects`

```python
from django.db.models import Q

from apps.tasks.model.task_model import Task

def get_queryset(...):
    return (
        Task.objects.filter(Q(owner=user) | Q(collaborators=user))
        .select_related("owner")
        .prefetch_related("collaborators")
        .distinct()
        )
```

### Filtros e buscas

A API suporta filtros avançados com **django-filter**, permitindo filtragem e buscas dinâmicas nas tarefas.

### Transações atômicas

Operações críticas utilizam transações atômicas para garantir consistência dos dados:

```python
from django.db import transaction

class TaskService:
    def __init__(self):
        self.repository = TaskRepository()

    @transaction.atomic
    def create(self, data: dict):
        ...
```

---

## ⚠️ Tratamento de erros

Handlers customizados de exceções garantem respostas padronizadas e maior previsibilidade na API.

### Padrão de resposta

##### -> OK

```json
{
  "result": {} | []
}
```

##### -> Error

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed",
    "details": {
      "name": ["Este campo é obrigatório."]
    }
  }
}
```

---

## 📊 Logs

O projeto possui loggers padronizados para:

- Rastreamento de erros
- Auditoria de eventos
- Monitoramento da aplicação

---

## 🧪 Testes

Os testes foram escritos com **pytest** e **pytest-django**, cobrindo os principais fluxos da aplicação.

### Executando os testes

```bash
# Rodar todos os testes
uv run pytest

# Rodar com relatório de cobertura
uv run pytest --cov=apps --cov-report=term-missing
```

### Cobertura de código

A cobertura é gerada com **pytest-cov**, permitindo identificar trechos de código não cobertos pelos testes e garantir maior confiabilidade nas entregas.

---

## 🔄 CI/CD

O projeto conta com um workflow de **GitHub Actions** configurado para rodar automaticamente a cada push ou pull request. O pipeline executa:

- Instalação das dependências
- Verificação de lint com **ruff**
- Execução da suíte de testes com **pytest**
- Geração do relatório de cobertura com **pytest-cov**

Isso garante que nenhuma alteração quebre o comportamento esperado da aplicação antes de ser integrada à branch principal.

---

## 🖥️ Servidor de produção

O backend utiliza **Gunicorn** como gerenciador de workers e **Uvicorn** como ASGI server, melhorando performance, concorrência e escalabilidade.

---

## ✅ Qualidade de código

| Ferramenta     | Função                                                |
| -------------- | ----------------------------------------------------- |
| **uv**         | Gerenciamento rápido e moderno de dependências Python |
| **ruff**       | Lint e formatação extremamente rápidos                |
| **mypy**       | Verificação estática de tipos                         |
| **pytest**     | Framework de testes                                   |
| **pytest-cov** | Cobertura de código                                   |

---

## 🔧 Variáveis de ambiente

> ⚠️ **Atenção:** as configurações abaixo são apenas para desenvolvimento local e **não devem ser usadas em produção**.

| Variável                 | Descrição                         |
| ------------------------ | --------------------------------- |
| `ALLOWED_HOSTS`          | Hosts permitidos                  |
| `CORS_ALLOW_ALL_ORIGINS` | Libera CORS para todas as origens |
| `CORS_ALLOW_CREDENTIALS` | Permite credenciais no CORS       |
| `DEBUG`                  | Modo de debug                     |
| `SECRET_KEY`             | Chave secreta para segurança      |

---

## 📝 Commits

O desenvolvimento foi dividido em pequenos commits para:

- Facilitar revisão de código
- Manter histórico claro de alterações
- Melhorar rastreabilidade das implementações

---

### API externa

Foi utilizada a API pública do Banco Central do Brasil (BCB) para obter a cotação do dólar. Essa integração permite buscar os valores atualizados diretamente da fonte oficial.

---

## 🏁 Considerações finais

O projeto foi desenvolvido priorizando boas práticas de desenvolvimento, código limpo, arquitetura escalável e facilidade de manutenção, com ferramentas modernas para garantir qualidade, segurança e performance.
