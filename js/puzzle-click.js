define(["puzzleproto","jquery","hbs!templates/success","hbs!templates/youtube","helpers","hbsCustomHelpers"],
    function (PuzzleProto,$,SuccessModalTemplate,YoutubeModalTemplate,Helpers) {
        var puzzleClick = PuzzleProto.extend({
            emptyPiece : null,
            init : function(config,rootEl,table) {
                this.config = config;
                this.rootEl = rootEl;
                this.table = table;

                this.userName = config.username;
                this.imageUrl = config.image;
                this.pieceSize = config.pieceSize;
                this.nbColumns = config.columns;
                this.nbRows = config.rows;
                this.gridWidth = this.nbColumns * this.pieceSize;
                this.gridHeight = this.nbRows * this.pieceSize;

                // Update de la taille de la grille
                this.updateGridWidth();

                // Modification de la première pièce pour que celle-ci soit la case "vide"
                this.emptyPiece = this.table[0][0];
                this.emptyPiece.css("background","none").attr("data-empty","true");

                // Ajout des pièces du puzzle au DOM
                for(var i=0; i < table.length; i++) {
                    for(var j=0; j < table[i].length; j++) {
                        this.rootEl.append(table[i][j]);
                    }
                }
                
                // Enregistrement du handler pour le clique sur une pièce
                this.rootEl.find("div.piece").click((function (event) {
                        this.movePiece($(event.currentTarget));
                        if(this.checkSuccess())this.displaySuccessModal();
                        return false;
                }).bind(this));

                // Enregistrement du handler pour le double-clique sur une pièce
                this.registerDoubleClickHandler();

                // Rendu aléatoire des pièces en simulant des mouvements sur le plateau en fonction du nombre de pièces
                for(var i = 0; i < (this.nbColumns * this.nbRows * 5); i++) {
                    // Récupération d'un nombre aléatoire pour le numéro de colonne / ligne
                    var column = Helpers.getRandomInt(0,this.nbColumns - 1);
                    var row = Helpers.getRandomInt(0,this.nbRows - 1);
                    this.movePiece(this.table[row][column]);
                }
            },
            movePiece : function(element) {
                var clickedPiece = $(element);
                // Vérification qu'il ne s'agit pas de la pièce vide
                if(clickedPiece.attr("data-empty") !== "true") {
                    //Détermination de la colonne et de la ligne de la pièce cliquée
                    var clickedPieceColumn = parseInt(clickedPiece.css("left"),10) / this.pieceSize;
                    var clickedPieceRow = parseInt(clickedPiece.css("top"),10) / this.pieceSize;
                    //Détermination de la colonne et de la ligne de la pièce vide
                    var emptyPieceColumn = parseInt(this.emptyPiece.css("left"),10) / this.pieceSize;
                    var emptyPieceRow = parseInt(this.emptyPiece.css("top"),10) / this.pieceSize;

                    // Si la pièce cliquée partage une même colonne/ligne que la pièce vide, alors on peut la déplacer
                    if(clickedPiece.css("top") === this.emptyPiece.css("top")){
                        // Déplacement sur une ligne
                        //Détermination du sens du déplacement
                        if(parseInt(clickedPiece.css("left"),10) > parseInt(this.emptyPiece.css("left"),10)) {
                            // Déplacement vers la gauche de toutes les pieces de numéro de colonne supérieur à celle de la pièce vide et inférieur ou égal à celle de la pièce cliquée
                            for(var i=emptyPieceColumn + 1; i <= clickedPieceColumn; i++){
                                this.table[clickedPieceRow][i].animate({ left: "-=" + this.pieceSize + "px" }, 100);
                                this.table[clickedPieceRow][i-1] = this.table[clickedPieceRow][i];
                            }
                            // Positionnement de la pièce vide en lieu et place de la pièce cliquée
                            this.table[clickedPieceRow][clickedPieceColumn] = this.emptyPiece;
                            this.emptyPiece.css("left","+=" + ((clickedPieceColumn - emptyPieceColumn) * this.pieceSize) + "px").attr("data-empty","true");
                        } else {
                            // Déplacement vers la droite de toutes les pieces de numéro de colonne inférieur à celle de la pièce vide et supérieur ou égal à celle de la pièce cliquée
                            for(var i=emptyPieceColumn - 1; i >= clickedPieceColumn; i--){
                                this.table[clickedPieceRow][i].animate({ left: "+=" + this.pieceSize + "px" }, 100);
                                this.table[clickedPieceRow][i+1] = this.table[clickedPieceRow][i];
                            }
                            // Positionnement de la pièce vide en lieu et place de la pièce cliquée
                            this.table[clickedPieceRow][clickedPieceColumn] = this.emptyPiece;
                            this.emptyPiece.css("left","-=" + ((emptyPieceColumn - clickedPieceColumn) * this.pieceSize) + "px").attr("data-empty","true");
                        }
                    } else if(clickedPiece.css("left") === this.emptyPiece.css("left")) {
                        // Déplacement sur une colonne
                        //Détermination du sens du déplacement
                        if(parseInt(clickedPiece.css("top"),10) < parseInt(this.emptyPiece.css("top"),10)) {
                            // Déplacement vers la bas de toutes les pieces de numéro de ligne inférieure à celle de la pièce vide et supérieure ou égal à celle de la pièce cliquée
                            for(var i=emptyPieceRow - 1; i >= clickedPieceRow; i--){
                                this.table[i][clickedPieceColumn].animate({ top: "+=" + this.pieceSize + "px" }, 100);
                                this.table[i+1][clickedPieceColumn] = this.table[i][clickedPieceColumn] ;
                            }
                            // Positionnement de la pièce vide en lieu et place de la pièce cliquée
                            this.table[clickedPieceRow][clickedPieceColumn] = this.emptyPiece;
                            this.emptyPiece.css("top","-=" + ((emptyPieceRow - clickedPieceRow) * this.pieceSize) + "px").attr("data-empty","true");
                        } else {
                            // Déplacement vers le haut de toutes les pieces de numéro de ligne supérieure à celle de la pièce vide et inférieure ou égal à celle de la pièce cliquée
                            for(var i=emptyPieceRow + 1; i <= clickedPieceRow; i++){
                                this.table[i][clickedPieceColumn].animate({ top: "-=" + this.pieceSize + "px" }, 100);
                                this.table[i-1][clickedPieceColumn] = this.table[i][clickedPieceColumn];
                            }
                            // Positionnement de la pièce vide en lieu et place de la pièce cliquée
                            this.table[clickedPieceRow][clickedPieceColumn] = this.emptyPiece;
                            this.emptyPiece.css("top","+=" + ((clickedPieceRow - emptyPieceRow) * this.pieceSize) + "px").attr("data-empty","true");
                        }
                    }
                }
            },

            // Afficher la pop-up indiquant le succès de la partie
            displaySuccessModal : function(){
                this.rootEl.append(SuccessModalTemplate({"username" : this.config.username}));
                this.rootEl.find("button.reset").click((function (event) {
                        $(event.currentTarget).unbind();
                        this.rootEl.find("div.modal").remove();
                        this.init(this.config,this.rootEl,this.table);
                        return false;
                }).bind(this));
            }
        });

        return puzzleClick;
    }
);