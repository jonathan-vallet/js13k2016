var Text = function() {
    this.textList = {
            'home': "Stanley vient de démarrer le jeu. Il s'apprête à cliquer sur jouer.",
            'lvl1-1': "Stanley découvre le nouveau monde qui l'entoure. Tout semble parfait par ici. L'impression de 3d, les couleurs... Les développeurs ont assurés, on dirait qu'aucun bug ne saurait survenir par ici.",
            'lvl1-2': "Stanley se demande ce qu'il fait ici. Il continue à avancer droit devant. Les développeurs n'ont pas laissé d'instructions on dirait.",
            'lvl1-3': "Stanley aperçoit une clé. Il s'en approche afin de la récupérer.",
            '': '',
            '': '',
            '': '',
            '': '',
            '': '',
            '': '',
    };
    
    this.textWrapper = document.getElementById('t');
};

Text.prototype.show = function(id) {
    // Sets new text, clears previous displayed text
    this.currentTextId = id;
    this.currentText = this.textList[id];
    this.textWrapper.textContent = '';
    this.showLetter(0);
};

Text.prototype.showLetter = function(index) {
    this.textWrapper.textContent = this.textWrapper.textContent + this.currentText[index];;
    if(this.currentText.length > ++index) {
        setTimeout(() => {
            this.showLetter(index);
        }, 10);
    }
}

module.exports = Text;