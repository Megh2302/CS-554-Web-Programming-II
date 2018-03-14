const bluebird = require('bluebird');
const express = require('express');
const redis = require('redis');
const client = redis.createClient();
const app = express();
const data = require('./data.js');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let ul = [];
app.get("/api/people/history", async function (req, res)
{
    let history = [];
    const len = await client.llenAsync('history');
    ul = await client.lrangeAsync('history',0,len);
    if (len != 0)
    {
        for (let i = 0; i < len && i < 20; i++)
        {
            history.push(JSON.parse(ul[i]));
        }
        res.json(history);
    }
    else
    {
        res.status(404).json("No recent users found!!!");
    }
});

app.get("/api/people/:id", async function (req, res)
{
    const id = req.params.id;
    let result = await client.existsAsync(id);
    if (result)
    {
        res.json(JSON.parse(await client.getAsync(id)));
        await client.lpush('history', await client.getAsync(id));
    }
    else
    {
        try
        {
            let person = await data.getById(id);
            await client.setAsync(id, JSON.stringify(person));
            await client.lpush('history', JSON.stringify(person));
            res.json(person)
        }
        catch (err)
        {
            res.status(400).json(err);
        }
    }
});

app.use("*", function (req, res) {
    res.status(404).json("Route is not found");
});

app.listen(3000, function() {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000.....");
});
