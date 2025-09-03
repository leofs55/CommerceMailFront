# Dockerfile para aplicação Angular CommerceMail
# Estágio 1: Build da aplicação
FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Copia o código fonte
COPY . .

# Verifica se o Angular CLI está disponível
RUN npx ng version

# Torna o script de build executável
COPY build.sh /app/build.sh
RUN chmod +x /app/build.sh

# Constrói a aplicação para produção
RUN npm run build || (echo "Build failed, trying alternative..." && /app/build.sh)

# Estágio 2: Servidor web para servir a aplicação
FROM nginx:alpine

# Copia os arquivos construídos do estágio anterior
COPY --from=build /app/dist/CommerceMail/browser /usr/share/nginx/html

# Copia a configuração personalizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]
