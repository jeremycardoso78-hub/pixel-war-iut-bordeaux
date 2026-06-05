let equipeValite = false;
let timeValite = true;

const tab = async () => {
    
    try {
        const request =  new Request("https://pixel-api.codenestedu.fr/tableau");
        let response = await fetch(request);
        let resultat = await response.json();

        const grille = document.getElementById("grille");
        const colone = resultat[0].length;
        const ligne = resultat.length;

        grille.style.display = "grid";
        grille.style.gridTemplateColumns = `repeat(${colone}, 10px)`;

        resultat.forEach((ligne, indexLigne) => {
            ligne.forEach((couleur, indexCouleur) => {
                const idPixel = `pixel-${indexLigne}-${indexCouleur}`;
                let pixel = document.getElementById(idPixel);
        
                if (!pixel) {
                pixel = document.createElement("div");
                pixel.id = idPixel;
                pixel.style.width = "10px";
                pixel.style.height = "10px";
                pixel.style.cursor = "pointer";
                pixel.addEventListener('click', () => {
                        const couleurChoisie = document.getElementById("colorPicker").value;
                        colorierPixel(couleurChoisie, indexCouleur, indexLigne, pixel);
                });
                grille.appendChild(pixel);
                }

                pixel.style.background = couleur;
            });
            
        });
    }
    catch(erreur){
        console.log("Erreur : ", erreur);
        const msgServ = document.getElementById("serverMsg");
        msgServ.innerHTML = `Erreur serveur : ${erreur}`;
    }
}

const colorierPixel = async (color, indexColonne, indexLigne, pixel) => {
    const idJoueur = document.getElementById("userId").value;
    const msgServ = document.getElementById("serverMsg");
    const request = new Request("https://pixel-api.codenestedu.fr/modifier-case")
    const formData = {
        color: color,
        uid: idJoueur,
        col: indexColonne,
        row: indexLigne
    }
    const response = await fetch(request, {
        method : 'PUT', 
        headers : { 'Content-Type': 'application/json'},
        body : JSON.stringify(formData)
    });
    const data = await response.json();
    if(response.ok){
        pixel.style.backgroundColor = color;
        msgServ.style.color = "green";
        msgServ.innerHTML = data.msg;
    }
    else {
        msgServ.style.color = "red";
        msgServ.innerHTML = data.msg;
    }
}

const cxn = async (button, equipe) => {
    try {
        const idJoueur = document.getElementById("userId").value;
        
        const msgServ = document.getElementById("serverMsg");
        const request = new Request("https://pixel-api.codenestedu.fr/choisir-equipe")
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
        if(response.ok){
            msgServ.style.color = "green";
            msgServ.innerHTML = data.msg;
            equipeValite = true;
        }
        
        else {
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

const tmp = async () => {
    const idJoueur = document.getElementById("userId").value;
    const msgTime = document.getElementById("waitMsg");
    try{
        if(equipeValite) {
            const request = new Request(`https://pixel-api.codenestedu.fr/temps-attente?uid=${idJoueur}`);
            const response = await fetch(request);
            const data = await response.json();
            const time = Math.ceil(data.tempsAttente/1000);
            if(time > 0) {
                msgTime.innerHTML = `Il reste ${time} secondes`;
                msgTime.style.color = "red";
                timeValite = false;

            }
            else {
                msgTime.innerHTML = "Vous pouvez mettre un pixel"
                msgTime.style.color = "green";
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
tab();
setInterval(tab, 1000);
setInterval(tmp, 1000);
