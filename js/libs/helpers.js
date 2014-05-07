define(function () {
    return {
        // Récupération d'un integer aléatoire entre min et max
        getRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        // Remplacement aléatoires des objets d'un tableau
        // Fisher-Yates shuffle algorithm.
        shuffleArray: function(array) {
		    for (var i = array.length - 1; i > 0; i--) {
		        var j = Math.floor(Math.random() * (i + 1));
		        var temp = array[i];
		        array[i] = array[j];
		        array[j] = temp;
		    }
		    return array;
		}
    }
});

