const bluebird = require('bluebird');
const express = require('express');
const redis = require('redis');
const client = redis.createClient();
const app = express();
const data = require('./data.js');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let rl = [];
app.get("/api/people/history", async function (req, res)
{
    let history = [];
    if (rl.length != 0)
    {
        for (let i = 0; i < rl.length && i < 20; i++)
        {
            history.push(JSON.parse(await client.getAsync(rl[i])));
        }
        res.send(history);
    }
    else
    {
        res.status(404).json("No recent users found!");
    }
});


app.get("/api/people/:id", async function (req, res)
{
    const result = await client.getAsync(req.params.id);
    if (result)
    {
        res.json({ person: JSON.parse(result) });
        rl.unshift(req.params.id);
    }
    else
    {
        try
        {
            person = await data.getById(parseInt(req.params.id, 10));
            res.json({ person });
            rl.unshift(req.params.id);
            let cacheRequest = await client.setAsync(req.params.id,JSON.stringify(person));
        }
        catch (err)
        {
            res.status(400).json(err);
        }
    }
});

app.use("*", function (req, res) {
    res.status(404).json({ error: "Route is not found" });
});

app.listen(3000, function() {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
