# Endpoint da API

## GET /tasks
- Descrição: Obtém todas as tarefas
- Exemplo de Requisição:
`GET/task HTTP/1.1`
- Exemplo de Resposta:
```[
    {
        "id": "1",
        "tittle":"Tarefa 1",
        "description":"Descrição de tarefa 1",
        "status":"pendente",
        "created_at":"2023-01-01T00:00:00Z",
        "updated_at":"2023-01-01T00:00:00Z"
    },
    ...
]
```
## POST /tasks
- Descrição: Cria uma nova tarefa
- Exemplo de Requisição:
```
POST/task HTTP/1.1
Content-Type: application/json
{
    "tittle":"Nova Tarefa",
    "description":"Descrição da nova tarefa",
    "status":"pendente"
}

```
- Exemplo de Resposta:
```[
    {
        "id": "2",
        "tittle":"Nova Tarefa",
        "description":"Descrição da nova tarefa",
        "status":"pendente",
        "created_at":"2023-01-01T00:00:00Z",
        "updated_at":"2023-01-01T00:00:00Z"
    },
]
```
## GET /tasks/:id
- Descrição: Obtém todas as tarefas específica
- Exemplo de Requisição:
`GET/task/1 HTTP/1.1`
- Exemplo de Resposta:
```[
    {
        "id": "1",
        "tittle":"Tarefa 1",
        "description":"Descrição de tarefa 1",
        "status":"pendente",
        "created_at":"2023-01-01T00:00:00Z",
        "updated_at":"2023-01-01T00:00:00Z"
    },
]
```
## PUT /task/:id
- Descrição: Atualiza uma nova tarefa
- Exemplo de Requisição:
```
PUT/task/1 HTTP/1.1
Content-Type: application/json
{
    "tittle":"Tarefa Atualizada",
    "description":"Descrição da nova tarefa",
    "status":"concluída"
}
```
- Exemplo de Resposta:
```[
    {
        "id": "1",
        "tittle":"Tarefa Atualizada",
        "description":"Descrição atualizada",
        "status":"concluída",
        "created_at":"2023-01-01T00:00:00Z",
        "updated_at":"2023-01-01T00:00:00Z"
    },
]
```
## DELETE
- Descrição: Deleta uma nova tarefa
- Exemplo de Requisição:
`DELETE/task/1 HTTP/1.1`
- Exemplo de Resposta:
```
{
    "message":"Tarefa Deletada com sucesso"
}
```

# Modelo de Dados
## Modelo de Tarefa("Task")

Campos:
- id: int
- title: string
- description: string
- status: string
- created_at:date
- updated_at:date

Exemplo de modelo
```
    {
        "tittle":"string",
        "description":"string",
        "status":"string",
        "created_at":"date",
        "updated_at":"date"
    },
```