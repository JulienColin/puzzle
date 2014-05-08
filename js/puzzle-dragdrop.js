define(["puzzleproto","jquery","underscore","hbs!templates/success","hbs!templates/youtube","helpers","hbsCustomHelpers"],
    function (PuzzleProto,$,_,SuccessModalTemplate,YoutubeModalTemplate,Helpers) {
        var puzzleDragDrop = PuzzleProto.extend({
            init : function(config,rootEl,table) {
                this.config = config;
                this.rootEl = rootEl;
                this.table = table;

                this.mode = config.mode;
                this.imageUrl = config.image;
                this.pieceSize = config.pieceSize;
                this.nbColumns = config.columns;
                this.nbRows = config.rows;
                this.gridWidth = this.nbColumns * this.pieceSize;
                this.gridHeight = this.nbRows * this.pieceSize;
                this.draggedElement = null;

                // Update de la taille de la grille
                this.updateGridWidth();

                /*
                 * Rendu aléatoire du puzzle
                 *
                 * Pour cela on décompose le tableau en un tableau d'une seule dimension sur lequel on execute l'algorithme de Fisher-Yates.
                 * Ensuite on recompose un objet en deux dimensions et on met à jour les valeur de top et left de chaque pièce
                 * 
                 */
                var oneDimensionTable = [];
                for(var i=0; i < this.table.length; i++) {
                    for(var j=0; j < this.table[i].length; j++) {
                        oneDimensionTable.push(this.table[i][j]);
                    }
                }
                Helpers.shuffleArray(oneDimensionTable);
                var i = 0;
                for(var j=0; j < this.table.length; j++) {
                    for(var k=0; k < this.table[j].length; k++) {
                        this.table[j][k] = oneDimensionTable[i];
                        this.table[j][k].css("left", k * this.pieceSize).css("top", j * this.pieceSize);
                        // Ajout de la pièce du puzzle au DOM
                        this.rootEl.append(this.table[j][k]);
                        i++;
                    }
                }

                // Enregistrement du handler pour le double-clique sur une pièce
                this.registerDoubleClickHandler();

                // Enregistrement des évenements pour le drag&drop
                // Garder une réference sur les fonctions "bindées" est le seul moyen de pouvoir désenregistrer les évenements ensuite
                this.bindedHandleDragStart = this.handleDragStart.bind(this);
                this.bindedHandleDrop = this.handleDrop.bind(this);
                _.each(this.rootEl.find("div.piece"),function(piece) {
                    piece.addEventListener('dragstart', this.bindedHandleDragStart, false);
                    piece.addEventListener('dragover', this.handleDragOver, false);
                    piece.addEventListener('dragenter', this.handleDragEnter, false);
                    piece.addEventListener('dragleave', this.handleDragLeave, false);
                    piece.addEventListener('dragend', this.handleDragEnd, false);
                    piece.addEventListener('drop', this.bindedHandleDrop, false);
                },this);
            },
            handleDragStart: function(event) {
                event.dataTransfer.setData('text', event.currentTarget.innerHTML);
                this.draggedElement = $(event.currentTarget);
                this.draggedElement.addClass('dragged');
            },
            handleDragOver: function(event) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
            },
            handleDragEnter: function(event) {
                if(!$(this).hasClass("dragged"))$(this).addClass("over");
            },
            handleDragLeave: function(event) {
                $(this).removeClass("over");
            },
            handleDragEnd: function(event) {
                $(this).removeClass("dragged");
            },
            handleDrop: function(event) {
                if (event.stopPropagation) {
                    event.stopPropagation();
                }
                // On ne fais rien si la colonne de drop est la meme que celle de drag
                if (this.draggedElement[0].outerHTML != $(event.currentTarget)[0].outerHTML) {
                    
                    var droppedPiece = $(event.currentTarget);

                    // Mise à jour du tableau
                    var draggedPieceColumn = parseInt(this.draggedElement.css("left"),10) / this.pieceSize;
                    var draggedPieceRow = parseInt(this.draggedElement.css("top"),10) / this.pieceSize;
                    var droppedPieceColumn = parseInt(droppedPiece.css("left"),10) / this.pieceSize;
                    var droppedPieceRow = parseInt(droppedPiece.css("top"),10) / this.pieceSize;

                    this.table[draggedPieceRow][draggedPieceColumn] = droppedPiece;
                    this.table[droppedPieceRow][droppedPieceColumn] = this.draggedElement;

                    // Mise à jour des propriétés top et left des pièces
                    var draggedLeft = droppedPiece.css("left");
                    var draggedTop = droppedPiece.css("top");
                    droppedPiece.css("left",this.draggedElement.css("left")).css("top",this.draggedElement.css("top"));
                    this.draggedElement.css("left",draggedLeft).css("top",draggedTop);
                    if(this.checkSuccess())this.displaySuccessModal();
                }
                $(event.currentTarget).removeClass("over");
                return false;
            },
            // Afficher la pop-up indiquant le succès de la partie
            displaySuccessModal : function(){
                this.rootEl.append(SuccessModalTemplate({"username" : this.config.username}));
                this.rootEl.find("button.reset").click((function (event) {
                        $(event.currentTarget).unbind();
                        this.rootEl.find("div.modal").remove();
                        // Desenregistrement des évenements pour le drag&drop
                        _.each(this.rootEl.find("div.piece"),function(piece) {
                            piece.removeEventListener('dragstart', this.bindedHandleDragStart, false);
                            piece.removeEventListener('dragover', this.handleDragOver, false);
                            piece.removeEventListener('dragenter', this.handleDragEnter, false);
                            piece.removeEventListener('dragleave', this.handleDragLeave, false);
                            piece.removeEventListener('dragend', this.handleDragEnd, false);
                            piece.removeEventListener('drop', this.bindedHandleDrop, false);
                        },this);
                        // Vidage du tableau
                        this.rootEl.children().remove();
                        this.init(this.config,this.rootEl,this.table);
                        return false;
                }).bind(this));
            }
        });
        return puzzleDragDrop;
    }
);