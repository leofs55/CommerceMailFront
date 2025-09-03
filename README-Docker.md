# CommerceMail - Docker Setup

Este documento contém instruções para executar a aplicação CommerceMail usando Docker.

## Pré-requisitos

- Docker instalado
- Docker Compose instalado
- Porta 80 disponível (para produção)

## Estrutura dos Arquivos

- `dockerfile` - Dockerfile para produção
- `dockerfile.dev` - Dockerfile para desenvolvimento
- `docker-compose.yml` - Orquestração dos serviços
- `nginx.conf` - Configuração do servidor web
- `.dockerignore` - Arquivos excluídos do build

## Comandos Disponíveis

### Produção

Para executar a aplicação em modo produção:

```bash
# Construir e executar
docker-compose up --build

# Executar em background
docker-compose up -d --build

# Parar os serviços
docker-compose down
```

A aplicação estará disponível em: http://localhost:80

### Desenvolvimento

Para executar em modo desenvolvimento (com hot-reload):

```bash
# Executar apenas o serviço de desenvolvimento
docker-compose --profile dev up commerce-mail-dev

# Executar em background
docker-compose --profile dev up -d commerce-mail-dev
```

A aplicação de desenvolvimento estará disponível em: http://localhost:4200

## Volumes e Persistência

- `nginx-logs`: Armazena logs do nginx
- Rede personalizada `commerce-mail-network` para comunicação entre serviços

## Configurações

### Nginx

O arquivo `nginx.conf` inclui:
- Configuração para SPA Angular (roteamento)
- Compressão Gzip
- Cache para arquivos estáticos
- Headers de segurança
- Suporte para API backend (configurável)

### Variáveis de Ambiente

- `NODE_ENV`: Define o ambiente (production/development)

## Troubleshooting

### Verificar logs

```bash
# Logs da aplicação
docker-compose logs commerce-mail-app

# Logs do nginx
docker-compose logs commerce-mail-app
```

### Reconstruir containers

```bash
# Remover containers e imagens
docker-compose down --rmi all

# Reconstruir
docker-compose up --build
```

### Verificar status

```bash
docker-compose ps
```

## Personalização

### Adicionar Backend API

Para conectar com uma API backend, descomente e configure as linhas no `nginx.conf`:

```nginx
location /api/ {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### Alterar Portas

Edite o `docker-compose.yml` para alterar as portas:

```yaml
ports:
  - "8080:80"  # Mapeia porta 8080 do host para 80 do container
```

## Limpeza

Para remover todos os recursos Docker:

```bash
docker-compose down -v --rmi all
docker system prune -f
```

