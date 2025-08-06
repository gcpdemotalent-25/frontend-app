# --- ÉTAPE 1: Construire l'application React ---
FROM node:16-alpine AS build
WORKDIR /app

# 1. Copier d'abord les fichiers de dépendances
COPY package*.json ./

# 2. Installer les dépendances. C'est ici que 'react-scripts' est installé
#    dans le 'node_modules' du conteneur.
RUN npm install

# 3. Copier le reste du code source
COPY . .

# 4. Exécuter le build. 'npm' trouvera 'react-scripts' dans le node_modules
#    installé à l'étape 2.
RUN npm run build

# --- ÉTAPE 2: Servir l'application avec Nginx ---
FROM nginx:1.21-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]