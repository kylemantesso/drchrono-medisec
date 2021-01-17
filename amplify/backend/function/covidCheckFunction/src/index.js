

const EMERGENCY_RESPONSE =  "As you are suffering emergency symptoms, you should immediately call triple zero and request an ambulance.";
const SYMPTOMATIC_RESPONSE = "Given your symptoms, you should seek a COVID 19 test immediately and self isolate until you get a negative result."
const NO_SYMPTOMS = "Given your symptoms, it is unlikely that you have COVID 19. Please monitor for further symptoms and place call back if your condition changes."

exports.handler = async (event) => {

    const age = event.Details.Parameters.age;
    const emergencySymptoms = event.Details.Parameters.emergencySymptoms.toLowerCase() === "yes";
    const regularSymptomOne = event.Details.Parameters.regularSymptomOne.toLowerCase() === "yes";
    const regularSymptomTwo = event.Details.Parameters.regularSymptomTwo.toLowerCase() === "yes";

    // TODO: Flesh out symptom response logic
    let textResponse = NO_SYMPTOMS;

    if(regularSymptomOne || regularSymptomTwo) {
        textResponse = SYMPTOMATIC_RESPONSE;
    }

    if(emergencySymptoms) {
        textResponse = EMERGENCY_RESPONSE;
    }

    console.log("PARAMS", age, emergencySymptoms, regularSymptomOne, regularSymptomTwo);

    const result = EMERGENCY_RESPONSE;

    const returnResult = {status: 200, textResponse};

    console.log("RETURN RESULT", returnResult);

    return returnResult;

};
