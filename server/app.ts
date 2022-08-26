//import express from "express";
//import cors from "cors";                                                  //Import generating unknown error.

const Client = require('pg').Client;
const Pool = require('pg').Pool;
const pool = new Pool(
    {   
        "host": "localhost",
        "user": "postgres",
        "password": "root",
        "port": 5432,
        "database": "postgres"
    }
);

const express = require("express");
const cors = require("cors");                                           

const app = express();
app.use(cors());
app.use(express.json());

let currentDate = new Date();
let date = (currentDate.getDate()).toString() + "/" + (currentDate.getMonth()+1).toString() + "/" + (currentDate.getFullYear()).toString();

app.get('/details', async function (req, res) {
    
    let results;

    try {
        console.log("CONNECTED");
        //results = await(pool.query("select * from users"));
        results = await(pool.query("SELECT u.id, u.firstname, u.middlename, u.lastname, u.email, u.phone, u.address, u.createdon, u.modifiedon, c.name as custname, r.name as role FROM customers as c JOIN users as u ON u.cid=c.cid JOIN role as r ON r.key=u.rid ORDER BY u.id"));
        console.table(results.rows);
    }
    catch(e) {
        console.log(e);
    }
    finally {
        res.send(JSON.stringify(results.rows));
    }
});

app.get('/customers', async function (req, res) {
   
    let results;

    try {
        console.log("CONNECTED");
        results = await(pool.query("SELECT * FROM customers"));
        console.table(results.rows);
    }
    catch(e) {
        console.log(e);
    }
    finally {
        // console.log(JSON.stringify(results.rows))
        res.send(JSON.stringify(results.rows));
    }
});

app.get('/role', async function (req, res) {
   
    let results;

    try {
        console.log("CONNECTED");
        results = await(pool.query("SELECT * FROM role"));
        console.table(results.rows);
    }
    catch(e) {
        console.log(e);
    }
    finally {
        res.send(JSON.stringify(results.rows));
    }
});

app.get('/details/:id', async function (req, res) {
    
    let id = req.params.id;
    let results;
    
    try {
        results = await(pool.query("SELECT * FROM users WHERE id=" + id + ""));
    }
    catch(e) {
        console.log(e)
    }
    finally {
        res.send(JSON.stringify(results.rows));
    }

});

app.post('/details', async function (req, res) {
    try {
        await(pool.query("INSERT INTO users (id, firstname, middlename, lastname, email, phone, address, cid, rid, createdon, modifiedon)" + 
                            "VALUES ('" + req.body.id + "','" + req.body.firstname + "','" + req.body.middlename + "','" + 
                                            req.body.lastname + "','" + req.body.email + "','" + req.body.phone + "','" + 
                                                req.body.address + "','" + req.body.cid + "','" + req.body.rid + "','" + date + "','NA')"));
    }
    catch (e) {
        console.log(e);
    }
});

app.patch('/details/:id', async function (req, res) {

    let id = req.params.id;
    let results;   
    try {
        await(pool.query("UPDATE users SET firstname ='" + req.body.firstname + 
                                        "',lastName ='" + req.body.lastname + 
                                        "',middlename = '" + req.body.middlename + 
                                        "',email = '" + req.body.email + 
                                        "',phone ='" + req.body.phone + 
                                        "',address ='" + req.body.address + 
                                        "',modifiedon='" + date + "'WHERE id=" + id + ""));

        results = await (pool.query("SELECT * FROM users"));
    }
    
    catch(e) {
        console.log(e);
    }
    finally {
        res.send(JSON.stringify(results.rows));
    }
}
);

app.delete('/details/:id', async function (req, res) {

    let id = req.params.id;

    try {
       await(pool.query("DELETE FROM users WHERE id=" + id + ""));
    }
    catch (e) {
        console.log(e);
    }
    finally {
        res.send();
    }
});

var port = process.env.PORT || 3000;
app.listen(port);