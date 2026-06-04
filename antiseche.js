// =======================================================================
// 1. GESTION DES ONGLETS (COURS <-> DICTIONNAIRE)
// =======================================================================
function switchView(viewName) {
    document.getElementById('view-cours').style.display = viewName === 'cours' ? 'flex' : 'none';
    document.getElementById('view-dico').style.display = viewName === 'dico' ? 'flex' : 'none';
    document.getElementById('tab-cours').className = viewName === 'cours' ? 'team-btn active-team' : 'team-btn';
    document.getElementById('tab-dico').className = viewName === 'dico' ? 'team-btn active-team' : 'team-btn';
}

// =======================================================================
// 2. DONNÉES DU DICTIONNAIRE COMPLET (Issu de la Fiche IHM-S2)
// =======================================================================
const dictionnaire = [
    {
        titre: "Types de base & typage faible", categorie: "Bases JS", tag: "tag-js",
        contenu: `<pre><code><span class="kw">let</span> a = <span class="num">3</span>;       <span class="cmt">// number</span>
<span class="kw">let</span> b = <span class="str">"3"</span>;     <span class="cmt">// string</span>
<span class="kw">let</span> c;          <span class="cmt">// undefined</span>
<span class="kw">typeof</span>(a);      <span class="cmt">// "number"</span>

a == b;   <span class="cmt">// true  (valeur seulement)</span>
a === b;  <span class="cmt">// false (valeur ET type) ✓</span>
a != b;   <span class="cmt">// false</span>
a !== b;  <span class="cmt">// true  ✓</span></code></pre>
        <div class="note warn">Toujours utiliser <code>===</code> et <code>!==</code> pour éviter les bugs de typage.</div>
        <ul class="list">
          <li>Types primitifs : <strong>string, boolean, number, undefined, null, symbol, function</strong></li>
          <li>Tout le reste est <strong>object</strong> (Array, Date, …)</li>
        </ul>`
    },
    {
        titre: "var / let / const — portée", categorie: "Bases JS", tag: "tag-js",
        contenu: `<pre><code><span class="kw">var</span> x = <span class="num">10</span>;   <span class="cmt">// portée FONCTIONNELLE (éviter)</span>
<span class="kw">let</span> y = <span class="num">20</span>;   <span class="cmt">// portée de BLOC ✓</span>
<span class="kw">const</span> z = <span class="num">30</span>; <span class="cmt">// portée bloc + non réaffectable ✓</span></code></pre>
        <div class="note tip">Dans ce cours : utiliser <strong>uniquement <code>let</code> et <code>const</code></strong>.</div>`
    },
    {
        titre: "Tableaux (Array)", categorie: "Bases JS", tag: "tag-js",
        contenu: `<pre><code><span class="kw">let</span> fruits = [<span class="str">"Apple"</span>, <span class="str">"Banana"</span>, <span class="num">25</span>];
fruits[<span class="num">0</span>];            <span class="cmt">// "Apple"</span>
fruits.<span class="fn">push</span>(<span class="str">"Mango"</span>); <span class="cmt">// ajoute à la fin</span>
fruits.<span class="fn">pop</span>();          <span class="cmt">// retire le dernier</span>
fruits.<span class="fn">shift</span>();        <span class="cmt">// retire le premier</span>
fruits.<span class="fn">unshift</span>(<span class="str">"X"</span>); <span class="cmt">// ajoute au début</span>
fruits.<span class="fn">indexOf</span>(<span class="str">"Banana"</span>); <span class="cmt">// 1</span></code></pre>`
    },
    {
        titre: "Les 4 types de boucles", categorie: "Bases JS", tag: "tag-js",
        contenu: `<pre><code><span class="cmt">// 1. for classique (avec indice)</span>
<span class="kw">for</span> (<span class="kw">let</span> i = <span class="num">0</span>; i < tab.length; i++) { ... }

<span class="cmt">// 2. for...of  (valeurs, PRÉFÉRÉ sans indice)</span>
<span class="kw">for</span> (<span class="kw">let</span> x <span class="kw">of</span> tab) { console.<span class="fn">log</span>(x); }

<span class="cmt">// 3. forEach (callback, bon pour DOM)</span>
tab.<span class="fn">forEach</span>((val, idx) => { ... });

<span class="cmt">// 4. for...in (clés d'un objet)</span>
<span class="kw">for</span> (<span class="kw">let</span> key <span class="kw">in</span> obj) { ... }</code></pre>
        <table>
          <tr><th>Situation</th><th>Boucle</th></tr>
          <tr><td>Itérer valeurs (array)</td><td><code>for...of</code> ✓</td></tr>
          <tr><td>Éléments du DOM</td><td><code>forEach</code></td></tr>
        </table>`
    },
    {
        titre: "Fonctions fléchées & syntaxe", categorie: "Bases JS", tag: "tag-js",
        contenu: `<pre><code><span class="cmt">// Une instruction → pas de return explicite</span>
<span class="kw">const</span> <span class="fn">add</span> = (a, b) => a + b;

<span class="cmt">// Plusieurs instructions → return obligatoire</span>
<span class="kw">const</span> <span class="fn">min</span> = (a, b) => {
  <span class="kw">if</span> (a < b) <span class="kw">return</span> a;
  <span class="kw">else</span> <span class="kw">return</span> b;
};</code></pre>
        <div class="note warn"><strong>Important :</strong> les fonctions fléchées n'ont pas leur propre <code>this</code> — elles héritent du contexte parent.</div>`
    },
    {
        titre: "Set & Map", categorie: "Bases JS", tag: "tag-js",
        contenu: `<h3>Set (Valeurs uniques)</h3><pre><code><span class="kw">let</span> mySet = <span class="kw">new</span> <span class="cls">Set</span>();
mySet.<span class="fn">add</span>(<span class="num">1</span>); mySet.<span class="fn">add</span>(<span class="num">1</span>); <span class="cmt">// doublon ignoré</span></code></pre>
        <h3>Map (Clé / Valeur)</h3><pre><code><span class="kw">let</span> map = <span class="kw">new</span> <span class="cls">Map</span>();
map.<span class="fn">set</span>(<span class="str">"dog"</span>, <span class="str">"woof"</span>);
map.<span class="fn">get</span>(<span class="str">"dog"</span>); <span class="cmt">// "woof"</span></code></pre>`
    },
    {
        titre: "Déclaration d'une classe", categorie: "Objets", tag: "tag-obj",
        contenu: `<pre><code><span class="kw">class</span> <span class="cls">Personne</span> {
  #secret = <span class="str">"privé"</span>;        <span class="cmt">// attribut PRIVÉ (#)</span>

  constructor(nom, prenom) {
    <span class="kw">this</span>.nom = nom;           <span class="cmt">// attribut PUBLIC</span>
    <span class="kw">this</span>.prenom = prenom;
  }

  <span class="fn">identite</span> = () => {         <span class="cmt">// méthode fléchée</span>
    console.<span class="fn">log</span>(<span class="str">\`\${this.prenom} \${this.nom}\`</span>);
  }
}</code></pre>`
    },
    {
        titre: "Accès aux nœuds", categorie: "DOM", tag: "tag-dom",
        contenu: `<pre><code><span class="cmt">// Un seul élément par id</span>
document.<span class="fn">getElementById</span>(<span class="str">"monId"</span>);

<span class="cmt">// NodeList (sélecteur CSS)</span>
document.<span class="fn">querySelectorAll</span>(<span class="str">".maClasse"</span>);

<span class="cmt">// Navigation dans l'arbre</span>
node.parentNode
node.children             <span class="cmt">// HTMLCollection enfants</span></code></pre>`
    },
    {
        titre: "Lire & modifier le contenu", categorie: "DOM", tag: "tag-dom",
        contenu: `<pre><code><span class="cmt">// textContent : pour div, p, span, h1…</span>
el.textContent = <span class="str">"Nouveau"</span>;

<span class="cmt">// value : pour les champs de formulaire</span>
input.value = <span class="str">"texte"</span>;

<span class="cmt">// Modifier le style / classes CSS</span>
el.style.color = <span class="str">"red"</span>;
el.classList.<span class="fn">add</span>(<span class="str">"active"</span>);
el.classList.<span class="fn">toggle</span>(<span class="str">"active"</span>);</code></pre>`
    },
    {
        titre: "Événements — addEventListener", categorie: "DOM", tag: "tag-dom",
        contenu: `<pre><code><span class="kw">const</span> btn = document.<span class="fn">getElementById</span>(<span class="str">"b1"</span>);

<span class="cmt">// ✅ Approche FLÉCHÉE (à utiliser)</span>
btn.<span class="fn">addEventListener</span>(<span class="str">"click"</span>, (event) => {
  console.<span class="fn">log</span>(event.target);  <span class="cmt">// élément cliqué</span>
});

<span class="cmt">// Empêcher comportement par défaut</span>
form.<span class="fn">addEventListener</span>(<span class="str">"submit"</span>, (e) => {
  e.<span class="fn">preventDefault</span>(); <span class="cmt">// pas de rechargement</span>
});</code></pre>
        <div class="note warn">Avec une fléchée, <code>this</code> n'est PAS l'élément cliqué → utiliser <code>event.target</code> à la place.</div>`
    },
    {
        titre: "JSON : stringify & parse", categorie: "Async", tag: "tag-async",
        contenu: `<pre><code><span class="cmt">// Objet → chaîne JSON</span>
<span class="kw">const</span> obj = { name: <span class="str">"John"</span>, age: <span class="num">30</span> };
<span class="kw">const</span> json = <span class="cls">JSON</span>.<span class="fn">stringify</span>(obj);

<span class="cmt">// Chaîne JSON → objet</span>
<span class="kw">const</span> back = <span class="cls">JSON</span>.<span class="fn">parse</span>(json);</code></pre>`
    },
    {
        titre: "fetch() — async / await", categorie: "Async", tag: "tag-async",
        contenu: `<pre><code><span class="kw">const</span> <span class="fn">getData</span> = <span class="kw">async</span> () => {
  <span class="kw">try</span> {
    <span class="kw">const</span> response = <span class="kw">await</span> <span class="fn">fetch</span>(url);
    <span class="kw">const</span> data = <span class="kw">await</span> response.<span class="fn">json</span>();
    console.<span class="fn">log</span>(data);
  } <span class="kw">catch</span> (error) {
    console.<span class="fn">error</span>(<span class="str">"Erreur :"</span>, error);
  }
};</code></pre>
        <div class="note tip"><code>async/await</code> = syntaxe plus lisible que les chaînes de <code>.then()</code></div>`
    },
    {
        titre: "fetch() — POST & PATCH", categorie: "Async", tag: "tag-async",
        contenu: `<pre><code><span class="cmt">// POST : créer une ressource</span>
<span class="fn">fetch</span>(url, {
  method: <span class="str">'POST'</span>,
  headers: { <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span> },
  body: <span class="cls">JSON</span>.<span class="fn">stringify</span>({ nom: <span class="str">"Alice"</span> })
});</code></pre>`
    },
    {
        titre: "Programmation fonctionnelle (Bonus)", categorie: "Bonus", tag: "tag-bonus",
        contenu: `<pre><code><span class="kw">const</span> nums = [<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>];

<span class="cmt">// filter → filtrer</span>
nums.<span class="fn">filter</span>(n => n % <span class="num">2</span> === <span class="num">0</span>); <span class="cmt">// [2, 4]</span>

<span class="cmt">// map → transformer</span>
nums.<span class="fn">map</span>(n => n * <span class="num">2</span>);          <span class="cmt">// [2, 4, 6, 8, 10]</span></code></pre>`
    }
];

// =======================================================================
// 3. LOGIQUE DU DICTIONNAIRE (RECHERCHE + FILTRES + GÉNÉRATION GRILLE)
// =======================================================================
const dictGridContainer = document.getElementById('dict-grid-container');
const searchInput = document.getElementById('search-dict');

let currentCategoryFilter = 'Tout';
let currentSearchQuery = '';

// Fonction pour mettre à jour la grille de cartes
function updateDicoList() {
    dictGridContainer.innerHTML = '';
    
    // 1. Filtrer les données
    const motsFiltres = dictionnaire.filter(item => {
        const matchCategory = currentCategoryFilter === 'Tout' || item.categorie === currentCategoryFilter;
        const matchSearch = item.titre.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                            item.contenu.toLowerCase().includes(currentSearchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    if (motsFiltres.length === 0) {
        dictGridContainer.innerHTML = '<p style="color:var(--text-muted); text-align:center; margin-top:50px;">Aucun résultat trouvé pour cette recherche...</p>';
        return;
    }

    // 2. Grouper les cartes par catégorie
    const groupes = {};
    motsFiltres.forEach(item => {
        if (!groupes[item.categorie]) groupes[item.categorie] = [];
        groupes[item.categorie].push(item);
    });

    // 3. Générer le HTML (Titre de section + Grille)
    for (const [categorie, items] of Object.entries(groupes)) {
        
        // Création du titre de la section (ex: "BASES JS")
        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'dico-section-title';
        sectionTitle.innerText = categorie;
        dictGridContainer.appendChild(sectionTitle);

        // Création de la grille CSS
        const grid = document.createElement('div');
        grid.className = 'dico-grid';

        // Ajout des cartes dans la grille
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'dico-card';
            card.innerHTML = `
                <div class="dico-card-header">
                    <span class="tag ${item.tag}">${item.categorie}</span>
                    <h3>${item.titre}</h3>
                </div>
                <div>${item.contenu}</div>
            `;
            grid.appendChild(card);
        });

        dictGridContainer.appendChild(grid);
    }
}

// Fonction appelée quand on clique sur un bouton de catégorie
function filterCategory(catName) {
    currentCategoryFilter = catName;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    updateDicoList();
}

// Écouteur sur la barre de recherche
searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    updateDicoList();
});


// =======================================================================
// 4. BASE DE DONNÉES DU COURS (PIXEL WAR)
// =======================================================================
const chapitres = [
    { id: "chap1", title: "1. Le DOM : Sélection & Création", content: "<h3>Sélectionner un élément</h3><pre><code>const grille = document.getElementById('grille');</code></pre><h3>Créer et Injecter</h3><pre><code>let pixel = document.createElement('div');\npixel.style.width = '10px';\ngrille.appendChild(pixel);</code></pre>" },
    { id: "chap2", title: "2. Les Événements", content: "<h3>Écouter un Clic</h3><pre><code>pixel.addEventListener('click', () => {\n  const couleurChoisie = document.getElementById('colorPicker').value;\n  colorierPixel(couleurChoisie, indexCouleur, indexLigne, pixel);\n});</code></pre>" },
    { id: "chap3", title: "3. Requêtes API (Fetch)", content: "<h3>Récupérer (GET)</h3><pre><code>const request = new Request('https://pixel-api.codenestedu.fr/tableau');\nlet response = await fetch(request);\nlet resultat = await response.json();</code></pre><h3>Envoyer (PUT)</h3><pre><code>const response = await fetch(request, {\n  method : 'PUT', \n  headers : { 'Content-Type': 'application/json'},\n  body : JSON.stringify({ color: '#ff0000', uid: 'ton-uid' })\n});</code></pre>" },
    { id: "chap4", title: "4. Les Timers", content: "<h3>Automatisation</h3><p>Pour que la grille se mette à jour toute seule :</p><pre><code>setInterval(tab, 10000);\nsetInterval(tmp, 1000);</code></pre>" }
];

let progression = JSON.parse(localStorage.getItem('pixelwar-progression')) || [];
let currentChapId = null;

function initMenu() {
    const chapterListEl = document.getElementById('chapter-list');
    chapterListEl.innerHTML = '';
    chapitres.forEach(chap => {
        const btn = document.createElement('button');
        btn.className = progression.includes(chap.id) ? 'team-btn active-team' : 'team-btn';
        btn.innerHTML = progression.includes(chap.id) ? `✅ ${chap.title}` : chap.title;
        btn.onclick = () => loadChapter(chap.id);
        chapterListEl.appendChild(btn);
    });
    updateProgressBar();
}

function loadChapter(id) {
    currentChapId = id;
    const chap = chapitres.find(c => c.id === id);
    document.getElementById('lesson-title').innerText = chap.title;
    document.getElementById('lesson-content').innerHTML = chap.content;
    
    const validateBtn = document.getElementById('validate-btn');
    validateBtn.style.display = 'block';
    if(progression.includes(id)) { validateBtn.innerText = "✅ Déjà compris !"; validateBtn.style.opacity = "0.5"; } 
    else { validateBtn.innerText = "👍 J'ai compris ce concept !"; validateBtn.style.opacity = "1"; }
}

document.getElementById('validate-btn').onclick = () => {
    if(!progression.includes(currentChapId)) {
        progression.push(currentChapId);
        localStorage.setItem('pixelwar-progression', JSON.stringify(progression));
        initMenu(); loadChapter(currentChapId);
    }
};

function updateProgressBar() {
    const percentage = Math.round((progression.length / chapitres.length) * 100);
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-text').innerText = `${percentage}% complété`;
    if(percentage === 100) { document.getElementById('progress-text').innerHTML = `🎉 100% complété !`; document.getElementById('progress-text').style.color = "var(--color-success)"; }
}

// Lancement au chargement de la page
initMenu();
updateDicoList(); // Initialise la grille du dictionnaire avec la mention "Tout"