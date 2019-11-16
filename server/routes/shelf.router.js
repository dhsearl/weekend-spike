const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * Get all of the items on the shelf
 */
router.get('/', (req, res) => {
    const queryText = `SELECT * FROM "item";`
    pool.query(queryText)
        .then((response) => {
            res.send(response.rows);
        }).catch((error) => {
            console.log('Error in item GET route', error);
            res.sendStatus(500)
        })
});


/**
 * Add an item for the logged in user to the shelf
 */
router.post('/', rejectUnauthenticated, (req, res) => {
    console.log("post hit in /shelf");

    const queryText = `INSERT INTO "item"("description","image_url","user_id")VALUES($1,$2,$3)`
    const queryArgs = [req.body.description, req.body.image_url, req.user.id]
    pool.query(queryText, queryArgs)
        .then(() => {
            console.log('POST SUCCESS', req.body);
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log("ERROR IN POST", error);
            res.sendStatus(500);
        })
});



/**
 * Delete an item if it's something the logged in user added
 */
router.delete('/:id', rejectUnauthenticated, (req, res) => {
    pool.query(`SELECT "user_id" from "item" WHERE "id"=$1`,[req.params.id])
    .then((response)=>{
        console.log(response.rows)
        console.log(req.user)
        const owner = response.rows[0].user_id

        if (owner === req.user.id){
        const queryText = `DELETE FROM "item"
        WHERE item.id=$1;`
        pool.query(queryText, [req.params.id])
            .then(() => {
                res.sendStatus(200);
            }).catch((error) => {
                console.log('Error in DELETE shelf', error);
                res.sendStatus(500);
            })}
        else {
            console.log('User not authorized to delete');
        }    
    })

});


/**
 * Update an item if it's something the logged in user added
 */
router.put('/:id', (req, res) => {

});


/**
 * Return all users along with the total number of items 
 * they have added to the shelf
 */
router.get('/count', (req, res) => {

});


/**
 * Return a specific item by id
 */
router.get('/:id', (req, res) => {

});

module.exports = router;