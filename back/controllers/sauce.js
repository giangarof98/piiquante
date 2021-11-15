const Sauce = require('../models/sauce');
const fs = require('fs')

exports.createSauce = (req,res,next) => {
    req.body.sauce = JSON.parse(req.body.sauce)
    const url = req.protocol + '://' + req.get('host');
    const sauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        userId: req.body.sauce.userId
    });
    console.log(req.body.sauce)
    sauce.save()
        .then(() => {
            res.status(201).json({
                message: 'Sauce created'
            });
        })
        .catch((error) => {
            res.status(400).json({
                error});
        })
};

exports.getOneSauce = (req,res,next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce)
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            })
        }
    )
};

exports.updateSauce = (req,res,next) => {
    let sauce = new Sauce({_id: req.params._id});
    if(req.file){
        Sauce.findOne({ _id: req.params.id})
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                // Sauce.updateOne({_id: req.params.id}).then(
                //     () => {
                //         res.status(200).json({
                //             message: 'Deleted'
                //         })
                //     }
                // ).catch(
                //     (error) => {
                //         res.status(400).json({
                //             error: error
                //         })
                //     }
                // )
                console.log('deleted')
            });
        })

        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce)
        sauce = {
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename,
            heat: req.body.sauce.heat,
            userId: req.body.sauce.userId
        };
    } else {
        sauce = {
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
            userId: req.body.userId
        }
    }

    // Sauce.findOne({ _id: req.params.id})
    //     .then((sauce) => {
    //         const filename = sauce.imageUrl.split('/images/')[1];
    //         fs.unlink('images/' + filename, () => {
    //             Sauce.updateOne({_id: req.params.id}).then(
    //                 () => {
    //                     res.status(200).json({
    //                         message: 'Deleted'
    //                     })
    //                 }
    //             ).catch(
    //                 (error) => {
    //                     res.status(400).json({
    //                         error: error
    //                     })
    //                 }
    //             )
    //         });
    //     })

    Sauce.updateOne({_id: req.params.id}, sauce).then(() => {
            res.status(201).json({
                message: 'updated successfully'
            })
        })
        .catch(
            (error) => 
            res.status(400).json({
                error: error
            })
    )

 };

exports.deleteSauce = (req,res,next) => {
    Sauce.findOne({ _id: req.params.id})
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({_id: req.params.id}).then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted'
                        })
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        })
                    }
                )
            });
        })
};

exports.getAllSauce = (req,res,next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces)
        }
    ).catch((error) => {
            res.status(400).json({
                error: error
            })
        })
};

// exports.rateSauce= (req, res, next) => {
//     Sauce.findOne({
//         _id: req.params.id
//     }).then((sauce) => {
//             const update = {
//                 likes: sauce.likes,
//                 dislikes: sauce.dislikes,
//                 usersLiked: sauce.usersLiked,
//                 usersDisliked: sauce.usersDisliked
//             }
    
//             // conditional to update obj
//             Sauce.findOne({_id: req.params.id}, update)
            
//             }).catch((error) => {res.status(404).json({error: error})
//         }
//     )
// };



exports.rateSauce= (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then((sauce) => {
            const update = {
                likes: sauce.likes,
                dislikes: sauce.dislikes,
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked
            }
    
        // conditional to update obj
            Sauce.findOne({_id: req.params.id})
                .then((sauce) => {
                    if(req.body.like === 1){
                        sauce.usersLiked.push(req.body.userId)
                        sauce.likes += req.body.like
                    } else if (req.body.like === 0 && sauce.usersLiked.includes(req.body.userId)){
                        sauce.usersLiked.remove(req.body.userId);
                        sauce.likes -= 1;
                    } else if(req.body.like === -1){
                        sauce.usersDisliked.push(req.body.userId);
                        sauce.dislikes += 1;
                    } else if(req.body.like === 0 && sauce.usersDisliked.includes(req.body.userId)){
                        sauce.usersDisliked.remove(req.body.userId)
                        sauce.dislikes -= 1
                    }
                    sauce.save().then(() => {
                        res.status(201).json({message: 'ok'})
                    }).catch((error) => {
                        res.status(400).json({
                            error: error
                        })
                    })
                })
            
            }).catch((error) => {res.status(404).json({error: error})
        }
    )
};



