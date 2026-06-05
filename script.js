// ─── VARIABLES GLOBALES D'ÉTAT ───────────────────────────────────────────
// Permet de savoir si le joueur a rejoint une équipe valide (bloque le timer si false)
let equipeValite = false;
// Permet de savoir si le temps d'attente est écoulé (le joueur a le droit de cliquer)
let timeValite = true;


// ─── FONCTION 1 : RÉCUPÉRATION ET AFFICHAGE DE LA GRILLE ──────────────────
const tab = async () => {
    
    try {
        // Preparation de la requete GET pour recuperer la matrice du dessin
        const request = new Request("https://pixel-api.codenestedu.fr/tableau");
        // Envoi de la requete et attente de la reponse du serveur
        let response = await fetch(request);
        // Conversion de la reponse brute en tableau JavaScript (matrice 2D)
        let resultat = await response.json();

        // Recuperation de l'element HTML conteneur de la grille
        const grille = document.getElementById("grille");
        // Calcul du nombre de colonnes (longueur de la premiere ligne du tableau)
        const colone = resultat[0].length;
        // Calcul du nombre de lignes (nombre total d'elements du tableau)
        const ligne = resultat.length;

        // Definition de l'affichage de la grille en mode CSS Grid
        grille.style.display = "grid";
        // Configuration dynamique des colonnes CSS (ex: repeat(100, 10px))
        grille.style.gridTemplateColumns = `repeat(${colone}, 10px)`;

        // 🔄 PREMIÈRE BOUCLE : Parcours de chaque ligne du tableau
        resultat.forEach((ligne, indexLigne) => {
            // 🔄 DEUXIÈME BOUCLE : Parcours de chaque case (pixel) de la ligne actuelle
            ligne.forEach((couleur, indexCouleur) => {
                
                // Creation d'un identifiant unique textuel pour ce pixel precis (ex: pixel-4-12)
                const idPixel = `pixel-${indexLigne}-${indexCouleur}`;
                // Verification instantanee : est-ce que ce pixel existe deja sur l'ecran ?
                let pixel = document.getElementById(idPixel);
        
                // 🛠️ COMPORTEMENT ANTI-LAG : On ne cree le pixel QUE s'il n'existe pas (vaut null)
                if (!pixel) {
                    // Creation d'une nouvelle balise <div> en memoire
                    pixel = document.createElement("div");
                    // Assignation de son identifiant unique pour pouvoir le retrouver au prochain cycle
                    pixel.id = idPixel;
                    // Fixation de sa taille (10px par 10px)
                    pixel.style.width = "10px";
                    pixel.style.height = "10px";
                    // Modification du curseur au survol pour signaler qu'on peut cliquer
                    pixel.style.cursor = "pointer";
                    
                    // Ajout de l'evenement "clic" sur le pixel
                    pixel.addEventListener('click', () => {
                        // Lecture immediate de la couleur selectionnee dans le Color Picker HTML
                        const couleurChoisie = document.getElementById("colorPicker").value;
                        // Appel de la fonction pour modifier la case sur le serveur distant
                        colorierPixel(couleurChoisie, indexCouleur, indexLigne, pixel);
                    });
                    
                    // Injection finale du pixel tout neuf dans le conteneur HTML principal
                    grille.appendChild(pixel);
                }

                // 🎨 MISE À JOUR : Qu'il soit nouveau ou vieux, on ajuste sa couleur de fond en direct
                pixel.style.background = couleur;
            });
            
        });
    }
    catch(erreur){
        // Gestion des erreurs en cas de coupure de connexion avec l'API
        console.log("Erreur : ", erreur);
        const msgServ = document.getElementById("serverMsg");
        msgServ.innerHTML = `Erreur serveur : ${erreur}`;
    }
}


// ─── FONCTION 2 : MODIFICATION D'UN PIXEL SUR LE SERVEUR ─────────────────
const colorierPixel = async (color, indexColonne, indexLigne, pixel) => {
    // Lecture de l'UID de l'utilisateur saisi dans le champ texte
    const idJoueur = document.getElementById("userId").value;
    // Zone de texte pour afficher les retours de reussite ou d'echec
    const msgServ = document.getElementById("serverMsg");
    // Configuration de la requete de modification
    const request = new Request("https://pixel-api.codenestedu.fr/modifier-case")
    // Preparation des donnees structurees au format attendu par l'API
    const formData = {
        color: color,     // La couleur au format #hex
        uid: idJoueur,    // L'UID du joueur
        col: indexColonne,// Coordonnee X
        row: indexLigne   // Coordonnee Y
    }
    // Envoi de la requete avec la methode PUT et transmission des donnees en JSON chaine
    const response = await fetch(request, {
        method : 'PUT', 
        headers : { 'Content-Type': 'application/json'},
        body : JSON.stringify(formData)
    });
    // Recuperation du message de reponse renvoye par le serveur
    const data = await response.json();
    
    // Si le serveur accepte techniquement la requete (Statut HTTP 200)
    if(response.ok){
        // Coloriage visuel immediat du pixel sur l'ecran du joueur
        pixel.style.backgroundColor = color;
        // Affichage du message du serveur en vert (Succes)
        msgServ.style.color = "green";
        msgServ.innerHTML = data.msg;
    }
    else {
        // Affichage du message du serveur en rouge (Echec : timer pas fini, mauvais UID...)
        msgServ.style.color = "red";
        msgServ.innerHTML = data.msg;
    }
}


// ─── FONCTION 3 : CONNEXION ET REJOINDRE UNE ÉQUIPE ──────────────────────
const cxn = async (button, equipe) => {
    try {
        // Extraction de l'UID
        const idJoueur = document.getElementById("userId").value;
        const msgServ = document.getElementById("serverMsg");
        const request = new Request("https://pixel-api.codenestedu.fr/choisir-equipe")
        
        // Preparation de l'envoi de l'UID et du numero de l'equipe choisie
        const formData = {
            uid: idJoueur,
            nouvelleEquipe: equipe
        }
        const response = await fetch(request, {
            method : 'PUT', 
            headers : { 'Content-Type': 'application/json'},
            body : JSON.stringify(formData)
        });
            
        const data = await response.json();
        // Affichage temporaire dans la console pour deboguer la reponse complete
        console.log("Données reçues du serveur :", data);
        
        if(response.ok){
            // Code de succes : vert
            msgServ.style.color = "green";
            msgServ.innerHTML = data.msg;
            // Variable d'etat passee a true : l'utilisateur a desormais le droit de voir le timer s'activer
            equipeValite = true;
        }
        else {
            // Code d'echec : rouge
            msgServ.style.color = "red";
            msgServ.innerHTML = data.msg;
            equipeValite = false;
        }
    }
    catch(erreur){
        console.log("Erreur : ", erreur);
        const msgServ = document.getElementById("serverMsg");
        msgServ.style.color = "red";
        msgServ.innerHTML = `Erreur serveur : ${erreur}`;
    }
}


// ─── FONCTION 4 : GESTIONNAIRE DE COMPTE À REBOURS (TIMER) ───────────────
const tmp = async () => {
    const idJoueur = document.getElementById("userId").value;
    const msgTime = document.getElementById("waitMsg");
    
    try{
        // Securite : On interroge l'API uniquement si l'equipe a ete validee avec succes prealablement
        if(equipeValite) {
            // Requete dynamique incluant l'UID dans les parametres d'URL (?uid=...)
            const request = new Request(`https://pixel-api.codenestedu.fr/temps-attente?uid=${idJoueur}`);
            const response = await fetch(request);
            const data = await response.json();
            
            // Conversion des millisecondes reçues en secondes brutes, puis arrondi au superieur (ex: 4.2s -> 5s)
            const time = Math.ceil(data.tempsAttente/1000);
            
            // S'il reste du temps a attendre avant le prochain clic
            if(time > 0) {
                // Affichage du compte a rebours en rouge
                msgTime.innerHTML = `Il reste ${time} secondes`;
                msgTime.style.color = "red";
                // Interdiction de cliquer
                timeValite = false;
            }
            else {
                // Le temps est ecoule : affichage du message de disponibilite en vert
                msgTime.innerHTML = "Vous pouvez mettre un pixel"
                msgTime.style.color = "green";
                // Autorisation de cliquer passee a true
                timeValite = true;
            }
        }
    }
    catch(erreur){
        console.log("Erreur : ", erreur);
        const msgServ = document.getElementById("serverMsg");
        msgServ.style.color = "red";
        msgServ.innerHTML = `Erreur serveur : ${erreur}`;
    }
}


// ─── DÉMARRAGE ET AUTOMATISATION CADENCÉE ─────────────────────────────────
// Lancement initial immediat de la grille au chargement de la page web
tab();

// Automatisation : Demande de rafraichissement complet des couleurs de la grille toutes les 10 secondes
setInterval(tab, 10000);

// Automatisation : Rafraichissement et calcul du compte a rebours du joueur toutes les 1 seconde
setInterval(tmp, 1000);
