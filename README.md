# Maxence Rault Stage AriMayi Développement NextJS

# 💼 Plateforme de Recrutement – Frontend

Bienvenue sur ce projet de plateforme web et mobile dédiée au recrutement.  
Développée en **Next.js 14** avec l'**App Router**, **TypeScript**, **Ant Design**, **Redux**, **Prisma** et une architecture multilingue grâce à `next-intl`.

---

## 📦 Stack technique

- ⚙️ **Next.js 14 (App Router)**
- 💅 **Ant Design** (UI moderne & accessible)
- 🔄 **Redux Toolkit** (gestion d'état global)
- 🌍 **next-intl** (i18n FR/EN)
- 🛡️ **JWT Auth** (sécurisation des appels API)
- 📚 **Prisma ORM** + MySQL
- ✍️ **TypeScript** (sécurité de typage)

---

## 🧠 Fonctionnalités principales

### 🎯 Côté Candidat :
- Création de compte, connexion sécurisée
- Dashboard personnel avec :
  - Mise à jour d’infos personnelles
  - Upload d’un CV
  - Rédaction d’une lettre de motivation
- Navigation et interface **multilingue (FR/EN)**

### 🕵️‍♂️ Côté Recruteur :
- Affichage de la liste de tous les candidats
- Détail d’un candidat sélectionné :
  - Infos personnelles
  - Lettre de motivation
  - CV (preview ou téléchargement)

---

## 🚀 Lancer le projet en local

### 1. Cloner le dépôt
```bash
git clone https://github.com/<ton-user>/projet-frontend-stage-arimayi.git
cd projet-frontend-stage-arimayi
``` 

### 2. Installer les dépendances 
```bash
npm install
```

### 3.Configurer l'environnement
Créer un fichier .env à la racine :
```env 
DATABASE_URL="mysql://user:password@localhost:3306/nom_base"
JWT_SECRET="secret_ultra_secure"
```

### 4. Init la bdd 
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Lancement serveur de dev 
```bash
npm run dev
```


---

## 🗂️ Internationalisation (FR / EN)
Intégration avec next-intl

Messages dynamiques via messages/fr.json & messages/en.json

URL localisées : /fr/register, /en/dashboard, etc.

---

## 🧩 Authentification

Basée sur JWT (JSON Web Token)

Token stocké dans localStorage

Utilisé pour sécuriser les appels (Authorization: Bearer ...)

---

## 📁 Diagrammes UML

### 🔷 Schéma des classes
![UML Classes](./docs/uml_classes.png)

### 🌐 Schéma de navigation
![Routes](./docs/routes.png)


