const fetch = require("node-fetch");

const TOKEN_ENDPOINT = "https://drchrono.com/o/token/";

// TODO: Store securely in SSM/env vars
const client_id = "4C8iKRBGodE1Zif76kNOamlo6rMRQ1VJpGzEvL0N";
const client_secret = "IPZ10fT5pY3Y4tkpxhxNX8nWJV2fHGI8xdlYyoIXE2LFBRiJucDuqm0lvOMwaVNICLyScbPvS4nesedao1AZgblYzcf7pEnHgyretQkgno0UGnaJ2xfY4x0K1P8oJOVB";

const redirect_uri =
  "https://zlbmb9svk1.execute-api.ap-southeast-2.amazonaws.com/dev/chrono/redirect";


exports.handler = async (event) => {
    console.log("EVENT", JSON.stringify(event));

    const code = event.queryStringParameters["code"];

    const body = `code=${code}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&grant_type=authorization_code`;

    console.log(body);

    let res;

    try {
        res = await fetch(TOKEN_ENDPOINT, {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log('response', res);
            return res.json()
        }).then(result => {
            console.log(result);
            return result;
        });
    } catch (e) {
        console.log('error', e);
    }

    console.log("res", res);

    return res;
};
