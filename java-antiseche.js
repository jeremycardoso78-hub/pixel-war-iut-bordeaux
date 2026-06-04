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
// 2. BASE DE DONNÉES JAVA (DICTIONNAIRE INTÉGRAL)
// =======================================================================
const dictionnaire = [
    { titre: "Classes et Objets", categorie: "Bases POO", tag: "tag-poo", contenu: `<p>Un objet est une instance d'une classe qui fournit des services (méthodes) et contient des données (attributs).</p>` },
    { titre: "Récursivité", categorie: "Bases POO", tag: "tag-poo", contenu: `<p>Code s'appelant lui-même. Nécessite obligatoirement une condition d'arrêt pour éviter que le programme plante.</p>` },
    { titre: "String et Identité", categorie: "Bases POO", tag: "tag-poo", contenu: `<p>L'opérateur <code>==</code> compare l'adresse mémoire. Il faut obligatoirement utiliser <code>equals</code> pour comparer le contenu textuel.</p>` },
    { titre: "Constructeur de Copie & HashCode", categorie: "Bases POO", tag: "tag-poo", contenu: `<p>Chaque classe doit redéfinir <code>equals</code> et <code>hashCode</code> de façon cohérente, et proposer un constructeur de copie pour dupliquer des objets.</p>` },
    { titre: "ArrayList & HashSet", categorie: "Collections", tag: "tag-collec", contenu: `<p><strong>ArrayList</strong> : Tableau extensible ordonné. <strong>HashSet</strong> : Ensemble sans ordre et composé d'objets uniques sans doublons.</p>` },
    { titre: "HashMap", categorie: "Collections", tag: "tag-collec", contenu: `<p>Associe une clé unique à une valeur via <code>.put(cle, valeur)</code> et <code>.get(cle)</code>.</p>` },
    { titre: "Classe-Association UML", categorie: "UML & Associations", tag: "tag-uml", contenu: `<p>Représente une association générant une donnée unique (ex: une note d'un élève pour un cours).</p>` },
    { titre: "Héritage (extends)", categorie: "Héritage & Poly", tag: "tag-poly", contenu: `<p>Créer un type plus spécifique à partir d'un parent via <code>extends</code> et appel de <code>super()</code>.</p>` },
    { titre: "Abstraction", categorie: "Héritage & Poly", tag: "tag-poly", contenu: `<p>Une classe <code>abstract</code> ne peut pas faire de <code>new</code>. Une méthode abstraite n'a pas de code, forçant les enfants à la définir.</p>` },
    { titre: "Interfaces", categorie: "Héritage & Poly", tag: "tag-poly", contenu: `<p>Contrat pur : que des signatures de méthodes. S'utilise avec <code>implements</code>.</p>` },
    { titre: "Polymorphisme", categorie: "Héritage & Poly", tag: "tag-poly", contenu: `<p>Un objet peut prendre la forme de n'importe quel parent. Le bon code (redéfini via <code>@Override</code>) s'exécute automatiquement.</p>` },
    { titre: "Exceptions (throw / try-catch)", categorie: "Exceptions", tag: "tag-exc", contenu: `<p><code>throw new</code> lève l'erreur. <code>try...catch...finally</code> l'intercepte pour éviter un plantage.</p>` },
    { titre: "Outils IDE", categorie: "Qualité & Tests", tag: "tag-qual", contenu: `<p>Outils essentiels pour réusiner : <strong>Refactor</strong>, <strong>Find Usages</strong>.</p>` },
    { titre: "Tests JUnit", categorie: "Qualité & Tests", tag: "tag-qual", contenu: `<p>Tester unitairement les cas nominaux et d'erreurs (via <code>expected=Exception.class</code>).</p>` },
    { titre: "Flux (Streams)", categorie: "Flux & Avancé", tag: "tag-stream", contenu: `<p>L'interface <code>Stream</code> enchaîne des opérations (filter, forEach) de manière paresseuse.</p>` }
];

const dictGridContainer = document.getElementById('dict-grid-container');
const searchInput = document.getElementById('search-dict');
let currentCategoryFilter = 'Tout';
let currentSearchQuery = '';

function updateDicoList() {
    dictGridContainer.innerHTML = '';
    const motsFiltres = dictionnaire.filter(item => {
        const matchCategory = currentCategoryFilter === 'Tout' || item.categorie === currentCategoryFilter;
        const matchSearch = item.titre.toLowerCase().includes(currentSearchQuery.toLowerCase()) || item.contenu.toLowerCase().includes(currentSearchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    if (motsFiltres.length === 0) { dictGridContainer.innerHTML = '<p style="color:var(--text-muted); text-align:center; margin-top:50px;">Aucun résultat...</p>'; return; }

    const groupes = {};
    motsFiltres.forEach(item => { if (!groupes[item.categorie]) groupes[item.categorie] = []; groupes[item.categorie].push(item); });

    for (const [categorie, items] of Object.entries(groupes)) {
        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'dico-section-title'; sectionTitle.innerText = categorie;
        dictGridContainer.appendChild(sectionTitle);
        const grid = document.createElement('div'); grid.className = 'dico-grid';
        items.forEach(item => {
            const card = document.createElement('div'); card.className = 'dico-card';
            card.innerHTML = `<div class="dico-card-header"><span class="tag ${item.tag}">${item.categorie}</span><h3>${item.titre}</h3></div><div>${item.contenu}</div>`;
            grid.appendChild(card);
        });
        dictGridContainer.appendChild(grid);
    }
}
function filterCategory(catName) { currentCategoryFilter = catName; document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); event.target.classList.add('active'); updateDicoList(); }
searchInput.addEventListener('input', (e) => { currentSearchQuery = e.target.value; updateDicoList(); });

// =======================================================================
// 3. BASE DE DONNÉES DU COURS + MULTIPLES FLASHCARDS PAR CHAPITRE
// =======================================================================
const chapitres = [
    { 
        id: "chap1", title: "1. Bases & Encapsulation", 
        content: "<h3>Le principe clé</h3><p>Les classes rendent des services (méthodes) sur des données (attributs). L'encapsulation force l'utilisation de méthodes <code>public</code> pour modifier des attributs <code>private</code>.</p>",
        flashcards: [
            { q: "Qu'est-ce qu'un objet en Java ?", a: "Une instance de classe qui fournit des services (méthodes) et contient des données (attributs)." },
            { q: "Quelle visibilité garantit l'encapsulation des données ?", a: "La visibilité 'private'. L'accès se fait ensuite par des méthodes 'public' (get/set)." },
            { q: "Comment compare-t-on le contenu textuel de deux objets String ?", a: "Avec la méthode .equals() (l'opérateur == compare l'adresse mémoire)." }
        ]
    },
    { 
        id: "chap2", title: "2. Les Collections", 
        content: "<h3>Gérer plusieurs objets</h3><p>Java offre des collections dynamiques : <strong>ArrayList</strong> (Tableau extensible) et <strong>HashSet</strong> (Garde les éléments uniques sans doublons).</p>",
        flashcards: [
            { q: "Quelle collection utiliser pour stocker des objets de manière ordonnée avec un accès par indice ?", a: "L'ArrayList." },
            { q: "Quelle particularité possède le HashSet ?", a: "C'est un ensemble mathématique sans ordre qui garantit l'absence de doublons." },
            { q: "Peut-on mettre des types primitifs (int, double) dans une collection ?", a: "Non, uniquement des objets (il faut utiliser Integer, Double...)." }
        ]
    },
    { 
        id: "chap3", title: "3. Associations UML", 
        content: "<h3>Les objets se connaissent</h3><p>Une association se traduit par un attribut dont le type est une autre classe. En UML on trace un trait avec des multiplicités et des rôles.</p>",
        flashcards: [
            { q: "Comment se traduit une association UML dans le code Java ?", a: "Par un attribut dont le type est une autre classe." },
            { q: "Que signifie une navigabilité à sens unique (une flèche) sur un diagramme UML ?", a: "Que la Classe A a accès à la Classe B, mais la Classe B n'a pas connaissance de la Classe A." },
            { q: "Qu'est-ce qu'une Classe-Association ?", a: "Une classe qui modélise une donnée générée uniquement par la rencontre de deux entités (ex: un Billet pour un Passager et un Vol)." }
        ]
    },
    { 
        id: "chap4", title: "4. Les HashMaps", 
        content: "<h3>Dictionnaires (Clé-Valeur)</h3><p>Pour associer des données (ex: Matricule -> Étudiant), on utilise <code>HashMap&lt;K, V&gt;</code>.</p>",
        flashcards: [
            { q: "À quoi sert une HashMap<K, V> ?", a: "C'est un tableau associatif qui associe une clé unique (K) à une valeur (V)." },
            { q: "Quelle méthode permet d'insérer un couple dans une HashMap ?", a: "La méthode .put(cle, valeur)." },
            { q: "Quelle méthode permet de récupérer une valeur grâce à sa clé ?", a: "La méthode .get(cle)." }
        ]
    },
    { 
        id: "chap5", title: "5. Héritage & Abstraction", 
        content: "<h3>Factoriser le code</h3><p>Une classe peut hériter (<code>extends</code>) d'une autre. Elle peut être abstraite (<code>abstract</code>) pour forcer un comportement général.</p>",
        flashcards: [
            { q: "À quoi sert le mot-clé 'extends' ?", a: "Il permet à une classe d'hériter des attributs et méthodes d'une classe parente." },
            { q: "Peut-on instancier (faire un new) une classe abstract ?", a: "Non ! Elle sert uniquement de modèle parent de base." },
            { q: "Quelle est la différence entre surcharger et redéfinir ?", a: "Surcharger = changer les paramètres. Redéfinir (@Override) = remplacer le code de la méthode du parent." }
        ]
    },
    { 
        id: "chap6", title: "6. Interfaces & Polymorphisme", 
        content: "<h3>Interfaces</h3><p>Contrat pur : pas d'attributs, que des signatures.</p><h3>Polymorphisme</h3><p>Le sous-typage comportemental. Un objet peut prendre plusieurs formes.</p>",
        flashcards: [
            { q: "Qu'est-ce qu'une Interface en Java ?", a: "Un contrat contenant uniquement des signatures de méthodes (sans code) et des constantes." },
            { q: "Quel mot-clé lie une classe à une Interface ?", a: "Le mot-clé 'implements'." },
            { q: "Définis le Polymorphisme.", a: "C'est la capacité d'un objet à être traité comme n'importe lequel de ses types parents, tout en exécutant son propre code redéfini." }
        ]
    },
    { 
        id: "chap7", title: "7. Exceptions (throw)", 
        content: "<h3>Gérer l'imprévu</h3><p>Les blocs <code>try...catch...finally</code> évitent le plantage. On utilise <code>throw new</code> pour bloquer l'exécution face à des problèmes.</p>",
        flashcards: [
            { q: "Quelle structure permet d'éviter qu'une exception fasse planter tout le programme ?", a: "Le bloc try { ... } catch (Exception e) { ... }." },
            { q: "À quoi sert le bloc finally ?", a: "Il contient du code qui sera toujours exécuté, qu'il y ait eu un plantage ou non." },
            { q: "Quelle instruction permet de lever manuellement une erreur (ex: argument invalide) ?", a: "throw new IllegalArgumentException();" }
        ]
    },
    { 
        id: "chap8", title: "8. Qualité & Fichiers", 
        content: "<h3>Qualité & Tests</h3><p>Respecter le format et les tests JUnit. <code>try-with-resources</code> ferme automatiquement les fichiers.</p>",
        flashcards: [
            { q: "Comment nomme-t-on les Classes et Interfaces (Convention de nommage) ?", a: "En PascalCase (ex: MaClassePrincipale)." },
            { q: "En JUnit, comment tester si une exception est bien levée ?", a: "Via le paramètre (expected=TypeException.class) de l'annotation @Test, ou avec un try..catch contenant un fail()." },
            { q: "Comment fermer automatiquement un fichier sans appeler .close() ?", a: "Avec la syntaxe try-with-resources : try(FileReader f = new... ) { }" }
        ]
    },
    { 
        id: "chap9", title: "9. Flux & Outils Avancés", 
        content: "<h3>Notation Fonctionnelle</h3><p>Lambdas et Streams pour un code compact.</p><h3>Outils IDE</h3><p>Refactor et Find Usages pour réusiner.</p>",
        flashcards: [
            { q: "Qu'est-ce qu'un Stream en Java ?", a: "C'est un flux de données permettant d'enchaîner des opérations de tri ou de filtre de manière paresseuse et très compacte." },
            { q: "Comment créer un comparateur personnalisé ?", a: "En créant une classe implémentant l'interface Comparator<T> et sa méthode compare()." },
            { q: "Quel outil de NetBeans utiliser pour renommer proprement une variable partout dans un projet ?", a: "L'outil Refactor (Refactor -> Rename)." }
        ]
    }
];

let progression = JSON.parse(localStorage.getItem('java-progression')) || [];
let currentChapId = null;
let currentFlashcardsCount = 0;
let flippedCardsCount = 0;

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
    
    // Génération dynamique des multiples flashcards
    const flashcardSection = document.getElementById('flashcard-section');
    const flashcardsContainer = document.getElementById('flashcards-container');
    flashcardsContainer.innerHTML = ''; // On vide les anciennes cartes
    
    currentFlashcardsCount = chap.flashcards.length;
    flippedCardsCount = 0;

    chap.flashcards.forEach((fc, index) => {
        const cardHtml = `
            <div class="flashcard" id="fc-${index}" onclick="flipCard(this)">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <p style="font-weight: bold; font-size: 13px;">${fc.q}</p>
                        <span class="fc-hint">Clique pour voir la réponse</span>
                    </div>
                    <div class="flashcard-back">
                        <p style="font-weight: bold; font-size: 13px;">${fc.a}</p>
                    </div>
                </div>
            </div>
        `;
        flashcardsContainer.innerHTML += cardHtml;
    });

    flashcardSection.style.display = 'block';

    // Gestion du bouton Valider
    const validateBtn = document.getElementById('validate-btn');
    if(progression.includes(id)) { 
        validateBtn.style.display = 'block';
        validateBtn.innerText = "✅ Chapitre déjà validé !"; 
        validateBtn.style.opacity = "0.5"; 
        validateBtn.disabled = true;
    } else { 
        // Tant que tout n'est pas retourné, on cache le bouton
        validateBtn.style.display = 'none'; 
        validateBtn.innerText = "👍 J'ai tout compris ! (Valider)"; 
        validateBtn.style.opacity = "1"; 
        validateBtn.disabled = false;
    }
}

// Fonction appelée quand on clique sur une carte mémoire
function flipCard(cardElement) {
    // Si la carte n'est pas déjà retournée, on la compte
    if(!cardElement.classList.contains('is-flipped')) {
        flippedCardsCount++;
    }
    
    // Animation de retournement
    cardElement.classList.add('is-flipped');
    
    // Si on a retourné toutes les cartes et que le chapitre n'est pas validé, on affiche le bouton !
    if(flippedCardsCount === currentFlashcardsCount && !progression.includes(currentChapId)) {
        document.getElementById('validate-btn').style.display = 'block';
    }
}

document.getElementById('validate-btn').onclick = () => {
    if(!progression.includes(currentChapId)) {
        progression.push(currentChapId);
        localStorage.setItem('java-progression', JSON.stringify(progression));
        initMenu(); 
        loadChapter(currentChapId);
    }
};

function updateProgressBar() {
    const percentage = Math.round((progression.length / chapitres.length) * 100);
    document.getElementById('progress-bar').style.width = `${percentage}%`;
    document.getElementById('progress-text').innerText = `${percentage}% complété`;
    if(percentage === 100) { 
        document.getElementById('progress-text').innerHTML = `🎉 100% complété !`; 
        document.getElementById('progress-text').style.color = "#ff8a00"; 
    }
}

initMenu();
updateDicoList();