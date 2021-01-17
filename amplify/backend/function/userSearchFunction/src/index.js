const fetch = require("node-fetch");
const url = require('url')

// TODO: Move to function, store refresh token securely
const fetchAccessToken = () => {
    const urlencoded = new url.URLSearchParams();
    urlencoded.append("refresh_token", "msJpWYJDtRuGviGtJLIwb9ErRy8COc");
    urlencoded.append("grant_type", "refresh_token");
    urlencoded.append("client_secret", "IPZ10fT5pY3Y4tkpxhxNX8nWJV2fHGI8xdlYyoIXE2LFBRiJucDuqm0lvOMwaVNICLyScbPvS4nesedao1AZgblYzcf7pEnHgyretQkgno0UGnaJ2xfY4x0K1P8oJOVB");
    urlencoded.append("client_id", "4C8iKRBGodE1Zif76kNOamlo6rMRQ1VJpGzEvL0N");

    const requestOptions = {
        method: 'POST',
        body: urlencoded,
    };

    return fetch("https://drchrono.com/o/token/", requestOptions)
      .then(response => response.json())
      .then(result => {console.log("fetchAccessToken result", result); return result;})
      .catch(error => console.log('fetchAccessToken error', error));
}

const getToday = () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return `${year}-${month}-${day}`;
}

exports.handler = async (event, context, callback) => {
    console.log("EVENT", event);

    const phone = event.Details.Parameters.CustomerNumber;
    console.log("PHONE", phone);

    const token = await fetchAccessToken();
    console.log("TOKEN", token);

    const patient = await fetch("https://app.drchrono.com/api/patients", {
        headers: {
            "authorization": `Bearer ${token.access_token}`,
        },
        method: "GET"
    }).then(res => res.json()).then(res => {
        console.log("PATIENT LIST RESULT", res);
        return res.results.find(patient => patient.cell_phone.replace(/ /g,'') === phone.replace(/ /g,''))});
    console.log("PATIENT", patient);

    let hasAppointment = 'no';
    let doctorName = '';

    const appointmentRequest = `https://app.drchrono.com/api/appointments?patient=${patient.id}&date=${getToday()}`;
    console.log("APT REQUEST URL", appointmentRequest);

    const appointmentToday = await fetch(appointmentRequest, {
        headers: {
            "authorization": `Bearer ${token.access_token}`,
        },
        method: "GET"
    }).then(res => res.json()).then(res => {
        console.log("APPOINTMENT LIST RESULT", res);
        if(res.results) {
            return res.results[0];
        } else {
            return undefined;
        }}).catch(e => console.log("APPTS ERROR", e));

    if(appointmentToday !== undefined) {
        hasAppointment = 'yes';
        const doctor = await fetch(`https://app.drchrono.com/api/doctors/${appointmentToday.doctor}`, {  headers: {
                "authorization": `Bearer ${token.access_token}`,
            },
            method: "GET"}).then(res => res.json()).catch(e => console.log("DOCTOR ERROR", e));
        doctorName = doctor.first_name + ' ' + doctor.last_name;
        console.log("DOCTOR", doctor);
    }

const returnResult = {status: 200, firstName: patient.first_name, hasAppointment, doctorName};

console.log("RETURN RESULT", returnResult);

    return returnResult;
};
