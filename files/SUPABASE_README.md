# Configuration Supabase pour le RP Tracker

## 📋 Étapes de configuration

### 1. Créer les tables dans Supabase

Connectez-vous à votre projet Supabase et exécutez ces requêtes SQL :

```sql
-- Table des personnages
CREATE TABLE personnages (
    id BIGSERIAL PRIMARY KEY,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    avatar TEXT NOT NULL,
    illustration_url TEXT NOT NULL,
    gif_url TEXT,
    joue_sur TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des RP
CREATE TABLE rps (
    id BIGSERIAL PRIMARY KEY,
    personnage_id BIGINT REFERENCES personnages(id) ON DELETE CASCADE,
    nom_rp TEXT NOT NULL,
    partenaire TEXT NOT NULL,
    a_jour BOOLEAN DEFAULT false,
    url_rp TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des liens
CREATE TABLE liens (
    id BIGSERIAL PRIMARY KEY,
    personnage_id BIGINT REFERENCES personnages(id) ON DELETE CASCADE,
    illustration_url TEXT NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT,
    nature_lien TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Activer RLS (Row Level Security) - optionnel mais recommandé
ALTER TABLE personnages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rps ENABLE ROW LEVEL SECURITY;
ALTER TABLE liens ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique (pour consultation)
CREATE POLICY "Permettre lecture publique personnages" ON personnages FOR SELECT USING (true);
CREATE POLICY "Permettre lecture publique rps" ON rps FOR SELECT USING (true);
CREATE POLICY "Permettre lecture publique liens" ON liens FOR SELECT USING (true);
```

### 2. Importer les données

Dans l'interface Supabase :
1. Allez dans "Table Editor"
2. Sélectionnez chaque table
3. Cliquez sur "Insert" → "Import data from CSV"
4. Importez les fichiers CSV dans cet ordre :
   - `personnages.csv` → table `personnages`
   - `rps.csv` → table `rps` (APRÈS avoir importé personnages)
   - `liens.csv` → table `liens` (APRÈS avoir importé personnages)

### 3. Configuration de la page HTML

Dans le fichier `rp-tracker.html`, remplacez ces lignes :

```javascript
const SUPABASE_URL = 'https://VOTRE-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANONYME';
```

Par vos vraies valeurs que vous trouverez dans :
- Supabase Dashboard → Settings → API
- `SUPABASE_URL` = Project URL
- `SUPABASE_ANON_KEY` = anon/public key

### 4. Modifier l'index.html

Changez la ligne de l'application Portfolio pour pointer vers le RP Tracker :

```html
<div class="app" data-page="rp-tracker.html">
    <div class="app-icon app-purple">
        <span>📝</span>
    </div>
    <div class="app-name">Mes RP</div>
    <div class="tooltip">Gestion de mes roleplay</div>
</div>
```

## 📊 Structure des données

### Table `personnages`
- `id` : Clé primaire auto-incrémentée
- `nom` : Nom de famille
- `prenom` : Prénom
- `avatar` : Nom de l'acteur/actrice
- `illustration_url` : URL de l'illustration (350x480px recommandé)
- `gif_url` : URL du GIF (350x480px recommandé)
- `joue_sur` : Nom du forum
- `description` : Description du personnage (100-200 mots)

### Table `rps`
- `id` : Clé primaire auto-incrémentée
- `personnage_id` : ID du personnage (référence vers `personnages.id`)
- `nom_rp` : Titre du RP
- `partenaire` : Nom du partenaire
- `a_jour` : Boolean (true = à jour, false = en attente)
- `url_rp` : Lien vers le RP sur le forum

### Table `liens`
- `id` : Clé primaire auto-incrémentée
- `personnage_id` : ID du personnage (référence vers `personnages.id`)
- `illustration_url` : URL de l'illustration carrée du personnage lié
- `nom` : Nom de famille du lien
- `prenom` : Prénom du lien
- `nature_lien` : Type de relation (Ami, Ennemi, Famille, etc.)
- `description` : Description courte de la relation

## 🎨 Hébergement des images

Pour vos illustrations, vous pouvez utiliser :
- **Imgur** : https://imgur.com (gratuit, facile)
- **Cloudinary** : https://cloudinary.com (gratuit jusqu'à 25GB)
- **Supabase Storage** : Votre propre bucket Supabase
- **GitHub** : Pour des images statiques dans votre repo

Format recommandé :
- Illustrations personnages : 350x480px (portrait)
- Illustrations liens : 200x200px (carré)
- Format : JPG ou PNG

## 🔧 Personnalisation

Vous pouvez modifier les couleurs et styles dans les variables CSS en haut du fichier :

```css
:root {
    --accent: #7eb8b0;      /* Couleur principale */
    --accent2: #c4a882;     /* Couleur secondaire */
    /* ... */
}
```

## 🚀 Pour ajouter de nouveaux personnages

Via l'interface Supabase ou en SQL :

```sql
INSERT INTO personnages (nom, prenom, avatar, illustration_url, gif_url, joue_sur, description)
VALUES ('Nom', 'Prénom', 'Acteur', 'URL illustration', 'URL gif', 'Forum', 'Description...');
```

Ensuite ajoutez les RP et liens avec le `personnage_id` correspondant.
