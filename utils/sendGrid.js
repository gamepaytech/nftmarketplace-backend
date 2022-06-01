const axios = require("axios");

const sendGridApi=(email, username)=>{
    var data = JSON.stringify({
        "contacts": [{
            "email": email,
            "first_name": username,
            "list_ids": [
                "9e178209-a846-48ea-812b-054e25f24b67"
            ]
        }],
        "list_ids": [
            "9e178209-a846-48ea-812b-054e25f24b67"
        ]
    });
    const headers = {
        'Authorization': 'Bearer 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',
        "Content-Type": "application/json"
    };
    axios.put("https://api.sendgrid.com/v3/marketing/contacts", data, { headers })
        .then(res => {
            //TODO-HANDLE SUCCESS
        })
        .catch(err => {
            //TODO-HANDLE ERROR
        });
}

module.exports =  sendGridApi 