define(["underscore", "jquery","hbs!templates/youtube"],
    function (_, $,YoutubeModalTemplate) {
        // function Extend  - tirée du framework Backbone
        var extend = function (protoProps, staticProps) {
            var parent = this;
            var child;

            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && protoProps.hasOwnProperty('constructor')) {
                child = protoProps.constructor;
            } else {
                child = function () {
                    return parent.apply(this, arguments);
                };
            }

            // Add static properties to the constructor function, if supplied.
            _.extend(child, parent, staticProps);

            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function () {
                this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;

            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps) _.extend(child.prototype, protoProps);

            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype;

            return child;
        };

        /*
         * Puzzle prototype
         */
        var PuzzleProto  = function () {
            this.init.apply(this, arguments);
        };
        _.extend(PuzzleProto.prototype, {
            rootEl : null,
            config : null,
            table : null,
            gridWidth : null,
            gridHeight : null,
            init: function () {
                // Fonction d'initialisation écrasée par chaque implémentation
            },
            // Update de la taille de la grille
            updateGridWidth : function() {
                this.rootEl.css("width", this.gridWidth);
                this.rootEl.css("height", this.gridHeight);
            },
            // Enregistrement du handler pour le double-clique sur une pièce
            registerDoubleClickHandler : function() {
                if(this.config.doubleclick.mode === "link") {
                    this.rootEl.find("div.piece").dblclick((function (event) {
                            window.open(this.config.doubleclick.url,'_blank');
                            return false;
                    }).bind(this));
                } else if (this.config.doubleclick.mode === "youtube") {
                    this.rootEl.find("div.piece").dblclick((function (event) {
                        this.displayYoutubeModal(this.config.doubleclick.id);
                        return false;
                    }).bind(this));
                }
            },
            // Vérification du succès de la partie
            checkSuccess : function() {
                var success = true;
                var checkTop = 0;
                // On parcoure chacune des pièces du puzzle et on s'arrete dès que l'on trouve une pièce mal positionnée
                for(var i=0; i < this.nbRows; i++) {
                    if(!success)break;
                    var checkLeft = 0;
                    for(var j=0; j < this.nbColumns; j++) {
                        if(this.table[i][j].attr("data-empty") == "false") {
                            var positions = this.table[i][j].css("background-position").split(" ");
                            if(Math.abs(parseInt(positions[0])) !== checkLeft || Math.abs(parseInt(positions[1])) !== checkTop) {
                                success = false;
                                break;
                            }
                        }
                        checkLeft += parseInt(this.pieceSize);
                    }
                    checkTop += parseInt(this.pieceSize);
                }
                return success;
            },
            // Afficher la pop-up contenant une vidéo
            displayYoutubeModal : function(id){
                if(typeof id !== "undefined" && id.length > 0) {
                    var height  = (this.gridWidth / 16) * 9;
                    this.rootEl.append(YoutubeModalTemplate({"id" : id, "width" : this.gridWidth, "height" : height, "margin" : height / 3}));
                    this.rootEl.find("button.close").click((function (event) {
                        this.rootEl.find("div.modal").remove();
                        return false;
                    }).bind(this));
                }
            }
        });
        // Attachement de la fonction d'extension au prototype
        PuzzleProto.extend = extend;

        return PuzzleProto;
    }
);