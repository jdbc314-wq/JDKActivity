# 📱 JDKActivity — Obtenir l'APK en 5 minutes

## ✅ Méthode simple : GitHub Actions (gratuit, sans rien installer)

### Étape 1 — Créer un compte GitHub
👉 Va sur https://github.com → Sign up → compte gratuit

### Étape 2 — Créer un nouveau dépôt
1. Clique + en haut à droite → New repository
2. Nom : JDKActivity
3. Visibilité : Public
4. Clic Create repository

### Étape 3 — Uploader les fichiers
1. Dans le dépôt vide → "uploading an existing file"
2. Décompresse le ZIP et glisse TOUS les fichiers/dossiers
3. Clic Commit changes

### Étape 4 — Attendre la compilation (~3 min)
1. Onglet Actions → workflow "Build APK JDKActivity" tourne (jaune)
2. Attends le vert ✅

### Étape 5 — Télécharger l'APK
1. Clique sur le workflow vert
2. Rubrique Artifacts → clique JDKActivity-APK
3. Un ZIP se télécharge → dedans : app-debug.apk ← TON APK !

### Étape 6 — Installer sur le téléphone
1. Transfère app-debug.apk sur ton téléphone
2. Paramètres → Sécurité → Sources inconnues → Autoriser
3. Ouvre le fichier APK → Installer ✅
