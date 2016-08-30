var Text = function() {
    this.textList = {
            'home': "Stanley vient de démarrer le jeu. Il s'apprête à cliquer sur jouer.",
            'home1': "Stanley va à nouveau cliquer sur jouer. Il espère qu'il n'y aura plus de bug cette fois.",
            'lvl1-1': "Stanley découvre le nouveau monde qui l'entoure. Tout semble parfait par ici. L'impression de 3d, les couleurs... Les développeurs ont assurés, on dirait qu'aucun bug ne saurait survenir par ici.",
            'lvl1-2': "Stanley se demande ce qu'il fait ici. Il continue à avancer droit devant. Les développeurs n'ont pas laissé d'instructions on dirait.",
            'lvl1-3': "Stanley aperçoit une clé. Il s'en approche afin de la récupérer.",
            'lvl1-4': "Stanley continue son chemin en ignorant la clé sur son chemin. Il se dit qu'il devrait faire demi-tour pour la récupérer.",
            'lvl1-5': "Stanley arrive devant une porte. Il se rappelle de cette clé qu'il a ignoré. Il fait demi-tour pour aller la chercher.",
            'lvl1-6': "Stanley a récupéré la clé. Il continue son chemin afin de trouver la porte que cette clé ouvre",
            'lvl1-7': "Une porte. Stanley commence à comprendre le but du jeu. Il a hâte de découvrir ce qui l'attend derrière",
            'lvl2-1': "Stanley découvre un nouveau niveau. La clé est déjà en vue. Il se dit que les développeurs ne se sont pas foulés.",
            'lvl2-2': "La clé bug. Comment Stanley va-t-il trouver quitter le niveau si rien ne fonctionne?", 
            'lvl2-3': "Stanley se dit que recharger la page résoudra peut-être son problème",
            'lvl3-1': "Stanley connait le chemin maintenant: Toujours tout droit, récupérer la clé, espérer que tout fonctionne",
            'lvl4-1': "Stanley arrive à nouveau face à la clé. Il espère que ça fonctionnera cette fois",
            'lvl4-2': "Stanley a récupéré la clé. Quelle joie de ne pas avoir recommencé pour rien! Stanley se dirige vers la porte pour sortir d'ici",
    };
    
    this.textWrapper = document.getElementById('t');
};

Text.prototype.show = function(id) {
    // Sets new text, clears previous displayed text
    this.currentTextId = id;
    this.currentText = this.textList[id];
    this.textWrapper.textContent = '';
    clearTimeout(this.displayTimeout);
    console.log('show text', this.displayTimeout);
    this.showLetter(0);
};

Text.prototype.showLetter = function(index) {
    this.textWrapper.textContent = this.textWrapper.textContent + this.currentText[index];;
    if(this.currentText.length > ++index) {
        this.displayTimeout = setTimeout(() => {
            this.showLetter(index);
        }, 10);
    }
}

module.exports = Text;