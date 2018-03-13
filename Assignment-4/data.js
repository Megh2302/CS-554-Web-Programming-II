const fs = require("fs");
let exportedMethods = {
    getById(id) {
        return new Promise((res, rej) =>
        {
            setTimeout(() =>
            {
                fs.readFile("Lab5.json", (err, filedata) => {
                    if(err)
                    {
                        rej(err);
                    }
                    let Data = JSON.parse(filedata);
                    let user = Data.filter(function (person)
                    {
                        return person.id == id;
                    });
                    if (user.length == 1)
                    {
                        res(user[0]);
                    }
                    else
                    {
                        rej("User is Not Found");
                    }
                });
            }, 5000);
        });
    }
}
module.exports = exportedMethods;