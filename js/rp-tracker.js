// ⚠️ CONFIGURATION SUPABASE
const SUPABASE_URL = 'https://dbcrncfyvullrtyfsmqh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiY3JuY2Z5dnVsbHJ0eWZzbXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTA1MzUsImV4cCI6MjA5MDAyNjUzNX0.ATxml9DjJWBqJWhxwMWRSiyjrsSKmztyYm28kjjgtS0';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentCharacter = null;

// Charger les personnages
async function loadCharacters() {
    try {
        const { data, error } = await supabase
            .from('personnages')
            .select('*')
            .order('nom', { ascending: true });

        if (error) throw error;

        document.getElementById('loading').style.display = 'none';
        displayCharacters(data);
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('loading').innerHTML = `
            <p style="color: var(--err);">Erreur de chargement. Vérifiez votre configuration Supabase.</p>
            <p style="font-size: 13px; margin-top: 10px;">${error.message}</p>
        `;
    }
}

// Afficher les personnages
function displayCharacters(characters) {
    const grid = document.getElementById('characters-grid');
    grid.innerHTML = characters.map(char => `
        <div class="character-card" onclick="showDetail(${char.id})">
            <img src="${char.illustration_url}" alt="${char.prenom} ${char.nom}" class="character-illustration" onerror="this.src='https://via.placeholder.com/350x480?text=${char.prenom}+${char.nom}'">
            <div class="character-info">
                <div class="character-name">${char.prenom} ${char.nom}</div>
                <div class="character-avatar">${char.avatar}</div>
                <div class="character-forum">${char.joue_sur}</div>
            </div>
        </div>
    `).join('');
}

// Afficher le détail d'un personnage
async function showDetail(characterId) {
    try {
        // Charger le personnage
        const { data: character, error: charError } = await supabase
            .from('personnages')
            .select('*')
            .eq('id', characterId)
            .single();

        if (charError) throw charError;

        currentCharacter = character;

        // Charger les RP
        const { data: rps, error: rpsError } = await supabase
            .from('rps')
            .select('*')
            .eq('personnage_id', characterId)
            .order('nom_rp', { ascending: true });

        if (rpsError) throw rpsError;

        // Charger les liens
        const { data: liens, error: liensError } = await supabase
            .from('liens')
            .select('*')
            .eq('personnage_id', characterId);

        if (liensError) throw liensError;

        // Afficher le détail
        displayDetail(character, rps, liens);

        // Changer d'écran
        document.getElementById('selection-screen').style.display = 'none';
        document.getElementById('detail-screen').style.display = 'block';
        window.scrollTo(0, 0);

    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de chargement des détails');
    }
}

// Afficher les détails
function displayDetail(character, rps, liens) {
    // Header
    document.getElementById('detail-header').innerHTML = `
        <img src="${character.gif_url || character.illustration_url}" alt="${character.prenom} ${character.nom}" class="detail-illustration" onerror="this.src='https://via.placeholder.com/350x480?text=${character.prenom}+${character.nom}'">
        <div class="detail-info">
            <h2>${character.prenom} ${character.nom}</h2>
            <div class="detail-meta">
                <div class="detail-meta-item">
                    <span class="detail-meta-label">Avatar</span>
                    <span>${character.avatar}</span>
                </div>
                <div class="detail-meta-item">
                    <span class="detail-meta-label">Forum</span>
                    <span>${character.joue_sur}</span>
                </div>
            </div>
            <div class="detail-description">${character.description}</div>
        </div>
    `;

    // RP List
    document.getElementById('rp-list').innerHTML = rps.length > 0 ? rps.map(rp => `
        <div class="rp-item">
            <div class="rp-info">
                <div class="rp-name">${rp.nom_rp}</div>
                <div class="rp-partner">avec ${rp.partenaire}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
                <div class="rp-status ${rp.a_jour ? 'ok' : 'pending'}">
                    ${rp.a_jour ? '✓ À jour' : '⏳ En attente'}
                </div>
                ${rp.url_rp ? `<a href="${rp.url_rp}" target="_blank" class="rp-link">Voir RP →</a>` : ''}
            </div>
        </div>
    `).join('') : '<p style="color: var(--muted); font-style: italic; text-align: center; padding: 20px;">Aucun RP en cours</p>';

    // Liens
    document.getElementById('liens-grid').innerHTML = liens.length > 0 ? liens.map(lien => `
        <div class="lien-card">
            <img src="${lien.illustration_url}" alt="${lien.prenom} ${lien.nom}" class="lien-illustration" onerror="this.src='https://via.placeholder.com/200x200?text=${lien.prenom || ''}+${lien.nom || ''}'">
            <div class="lien-info">
                <div class="lien-name">${lien.prenom ? lien.prenom + ' ' : ''}${lien.nom}</div>
                <div class="lien-nature">${lien.nature_lien}</div>
                <div class="lien-description">${lien.description}</div>
            </div>
        </div>
    `).join('') : '<p style="color: var(--muted); font-style: italic; text-align: center; padding: 20px;">Aucun lien défini</p>';
}

// Retour à la sélection
function showSelection() {
    document.getElementById('selection-screen').style.display = 'block';
    document.getElementById('detail-screen').style.display = 'none';
    window.scrollTo(0, 0);
}

// Initialisation
loadCharacters();
