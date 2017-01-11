(function () {
    "use strict";
    var express = require("express");
    var app = express();
    var mongodb = require("mongodb");
    var mongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/todoapp";
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", ['GET', 'POST', 'DELETE', 'PUT']);
        next();
    });
    
    // Returns true if a collection is found
    function checkColls(db, collToFind, callback) {
        db.listCollections().toArray(function (err, colls) {
            var cFound = false;
            for (var i = 0; i < colls.length; i++) {
                if (collToFind == colls[i].name) {
                    cFound = true;
                }
            }
            callback(cFound);
        });
    }
    
    // Gets every document of a collection
    function getDocs(db, sortParams, collectionToFind, callback) {
        var collection = db.collection(collectionToFind);
        collection.find({}).sort(sortParams).toArray(function (err, docs) {
            if (err == null) {
                callback(docs);
            }
        });
    }
    
    // Checks if a doc named 'docName' already exists
    function checkName(db, coll, docName, callback) {
        var collection = db.collection(coll);
        collection.find({}).toArray(function (err, docs) {
            var docFound = false;
            for (var i = 0; i < docs.length; i++) {
                if (docName == docs[i].name) {
                    docFound = true;
                }
            }
            callback(docFound);
        });
    }
    
    // Gets the highest id number of a collection
    function getHighestId(db, coll, callback) {
        var collection = db.collection(coll);
        collection.find({}).toArray(function (err, docs) {
            var highestId = 0;
            for (var i = 0; i < docs.length; i++) {
                if (parseInt(docs[i].id) > highestId) {
                    highestId = parseInt(docs[i].id);
                }
            }
            callback(highestId);
        });
    }

    // Returns all collections
    app.get("/", function (req, res) {
        mongoClient.connect(url, function (err, db) {
            db.listCollections().toArray(function (err, colls) {
                console.log(colls);
                res.json(colls);
                db.close();
            });
        });
    });
    
    // Returns every document of a collection
    app.get("/:collection", function (req, res) {
        mongoClient.connect(url, function (err, db) {
            checkColls(db, req.params.collection, function(cFound) {
                if (cFound == true) {
                    getDocs(db, {}, req.params.collection, function(docs) {
                        console.log(docs);
                        res.json(docs);
                        db.close();
                    });
                } else {
                    console.log("Collection " + req.params.collection + " not found.");
                    // db.close();
                }
            });
        });
    });
    
    // Returns a sorted collection
    app.get("/:collection/:sortBy/:order", function (req, res) {
        var sortParams = {};
        var sortBy = req.params.sortBy.toString();
        var order = parseInt(req.params.order);
        sortParams[sortBy] = order;
        console.log("Key: " + Object.keys(sortParams));
        console.log("Value: " + sortParams[sortBy]);
        mongoClient.connect(url, function (err, db) {
            checkColls(db, req.params.collection, function(cFound) {
                if (cFound == true) {
                    getDocs(db, sortParams, req.params.collection, function(docs) {
                        console.log(docs);
                        res.json(docs);
                        db.close();
                    });
                } else {
                    console.log("Collection " + req.params.collection + " not found.");
                    db.close();
                }
            });
        });
    });
    
    // Creates a new collection
    app.post("/:collection/", function (req, res) {
        mongoClient.connect(url, function (err, db) {
            checkColls(db, req.params.collection, function(cFound) {
                if (cFound == true) {
                    console.log("A collection named " + req.params.collection + " already exists.");
                    db.close();
                } else {
                    db.createCollection(req.params.collection);
                    console.log("Created a collection " + req.params.collection);
                    // db.close();
                }
            });
        });
    });
    
    // Inserts a document to a collection
    app.post("/:collection/:name/:priority/", function (req, res) {
        var id;
        var name = req.params.name;
        var priority = parseInt(req.params.priority);
        mongoClient.connect(url, function (err, db) {
            checkName(db, req.params.collection, req.params.name, function (docFound) {
                if (docFound == false) {
                    var collection = db.collection(req.params.collection);
                    getHighestId(db, req.params.collection, function (highestId) {
                        id = parseInt(highestId + 1);
                        collection.insert({
                            "id": id,
                            "name": name,
                            "priority": priority,
                            "status": false
                        }, function (err, res) {
                            console.log("Insert success!");
                            db.close();
                        });
                    });
                } else if (docFound == true) {
                    console.log("Document named " + req.params.name + " already exists.")
                    db.close();
                }
            });
        });
    });
    
    // Modifies status from false to true or vice versa
    app.put("/:collection/:id", function (req, res) {
        console.log("Testing");
        mongoClient.connect(url, function (err, db) {
            var collection = db.collection(req.params.collection);
            var id = parseInt(req.params.id);
            collection.find({id: id}).toArray(function (err, doc) {
                if (doc[0].status == false) {
                    collection.findAndModify({id: id}, {}, {$set: {status: true}}, {}, function (err, object) {
                        console.log("Doc with id " + id + "set true");
                        db.close();
                    });
                } else if (doc[0].status == true) {
                    collection.findAndModify({id: id}, {}, {$set: {status: false}}, {}, function (err, object) {
                        console.log("Doc with id " + id + "set false");
                        db.close();
                    });
                }
            });
        });
    });
    
    // Deletes a document from a collection
    app.delete("/:collection/:id", function (req, res) {
        mongoClient.connect(url, function (err, db) {
            checkColls(db, req.params.collection, function(cFound) {
                if (cFound == true) {
                    var id = parseInt(req.params.id);
                    var collection = db.collection(req.params.collection);
                    collection.deleteOne({id: id});
                    console.log("Document deleted.")
                    db.close();
                } else {
                    console.log("Collection " + req.params.collection + " not found.");
                    console.log("Could not delete a document.")
                    db.close();
                }
            });
        });
    });
    
    // Drops a collection
    app.delete("/:collection/", function (req, res) {
        mongoClient.connect(url, function (err, db) {
            checkColls(db, req.params.collection, function(cFound) {
                if (cFound == true) {
                    db.collection(req.params.collection).drop();
                    console.log("Dropped collection: " + req.params.collection);
                    db.close();
                } else {
                    console.log("Collection " + req.params.collection + " not found.");
                    db.close();
                }
            });
        });
    });

    var server = app.listen(3000, function () {
        console.log("Server listening");
    });
}());