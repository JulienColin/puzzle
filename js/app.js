define(["jquery","hbs!templates/piece","puzzle-click","puzzle-dragdrop","hbsCustomHelpers"],
    function ($,pieceTemplate,PuzzleClick,PuzzleDragDrop) {

        // Référence sur le tableau à deux dimensions
        var table = [];
        var emptyPiece,gridWidth,gridHeight,nbColumns,nbRows,pieceSize = null;

        /* 
        * Fonction d'initialisation du plateau
        */
        var init = function(config,rootEl){
            // Mode de fonctionnement du jeu (peut etre "click" ou "dragdrop"). Fallback dans le cas ou le navigateur ne supporte pas le drag&drop html5
            var mode = config.mode;
            if(mode !== "dragdrop" || !Modernizr.draganddrop)mode = "click";

            // Url de l'image à utiliser
            var imageUrl = config.image;
            // Dimension d'une pièce de la grille
            pieceSize = config.pieceSize;
            // Nombre de colonnes de la grille
            nbColumns = config.columns;
            // Nombre de rangées de la grille
            nbRows = config.rows;
            // Dimensions de la grille
            gridWidth = nbColumns * pieceSize;
            gridHeight = nbRows * pieceSize;

            // Création des pièces du puzzle
            for(var i=0; i < nbRows; i++) {
                table[i] = [];
                for(var j=0; j < nbColumns; j++){
                    // Templating de la pièce
                    var piece = $(pieceTemplate({ "top": i * pieceSize, "left" : j * pieceSize, "pieceSize": pieceSize, "imageUrl": imageUrl, "gridWidth": gridWidth, "gridHeight": gridHeight, empty: "false", draggable: (mode === "dragdrop" ? "true" : "false"), "mode" : mode}));
                    table[i].push(piece);
                }
            }

            // Initialisation de la partie en fonction du mode
            if(mode === "click") {
                new PuzzleClick(config,rootEl,table);
            } else {
                new PuzzleDragDrop(config,rootEl,table);
            }
        }
        
        //Vérification si l'id du puzzle existe dans le DOM
        if($("#puzzle").length > 0) {
            var rootEl = $("#puzzle");
            // Chargement de la configuration et initialisation du plateau
            $.getJSON(puzzleConf, function(config) {
                init(config,rootEl);
            });
        }
    }
);