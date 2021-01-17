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


// TODO: Dynamically find offices and doctors available for appointment time/date
// Use patient's preferred doctor / office
const DEFAULT_DOCTOR = "287357";
const DEFAULT_OFFICE = "305229";

const DEFAULT_DURATION = "30";
const DEFAULT_EXAM_ROOM = "1";

exports.handler = async (event) => {

    const phone = event.Details.Parameters.CustomerNumber;
    const appointmentType = event.Details.Parameters.AppointmentType;
    const appointmentDate = event.Details.Parameters.Date;
    const appointmentTime = event.Details.Parameters.Time;


    console.log("PARAMS", appointmentDate, appointmentTime, appointmentType)


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




    const doctor = await fetch(`https://app.drchrono.com/api/doctors/${DEFAULT_DOCTOR}`, {  headers: {
            "authorization": `Bearer ${token.access_token}`,
        },
        method: "GET"}).then(res => res.json()).catch(e => console.log("DOCTOR ERROR", e));
    doctorName = doctor.first_name + ' ' + doctor.last_name;
    console.log("DOCTOR", doctor);


    const appointment = {
        "exam_room": DEFAULT_EXAM_ROOM,
        "scheduled_time": `${appointmentDate}T${appointmentTime}:00`,
        "duration": DEFAULT_DURATION,
        "reason": appointmentType,
        "patient": patient.id,
        "office": DEFAULT_OFFICE,
        "doctor": DEFAULT_DOCTOR
    }

    console.log("BOOKING APPOINTMENT", JSON.stringify(appointment));

    const res = await fetch("https://app.drchrono.com/api/appointments", {
        headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(appointment)
    }).then(res => res.json()).catch(e => console.log("BOOK APT ERROR", e))

    console.log("APPT BOOKED", res);


    const returnResult = {status: 200, appointmentType, appointmentDate, appointmentTime, doctorName};

    console.log("RETURN RESULT", returnResult);


    return returnResult;
};
