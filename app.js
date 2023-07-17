// Dependencies
const axios = require('axios');
const mailer = require('nodemailer');
const twilio = require('twilio');
const dotenv = require('dotenv');

// DEBUG MODE
// SET DEBUG = TRUE
var debug = false;

// OPTIONS
var sendSmsMsg = true;

// Twice Shop URL
var twiceShopUrl = "https://twiceshop.com/";
var twiceShopJihyoCollectionUrl = 'https://twiceshop.com/collections/jihyo';
var twiceShopNayeonCollectionUrl = 'https://twiceshop.com/collections/nayeon';
// test website here 
var debugUrl = "";

// SEARCHES/KEYWORDS
//
var keywords = ['KILLIN', 'killin', 'Me Good', 'ME GOOD', 'Good', 'GOOD', 'KILLIN ME GOOD' , 'Killin Me Good', 'killin me good', 'KILLIN` ME GOOD', 'KILLIN\' ME GOOD'];
// 'Killin' found in a comment ~ Killing any Ajax request that's...

var debugKeyword = 'NAYEON';

// time between checks 
var queueTimeInterval = 600000; // 10 min?

// TWILIO TEXTING SERVICES TRIAL ENDS IN 30 DAYS
// 
// START
var twilioTrialStartDate = new Date(2023,7,16); // add twilio trial start date here
var twilioTrialEndDate = twilioTrialStartDate.setDate(twilioTrialStartDate.getDate() + 30);
console.log('Twilio texting services trial ends 30 days after ~ 2023,7,16' );
console.log('To continue Twilio texting services please sign up or create a new trial account.')

// MAKE A TWILIO TRIAL ACCOUNT
var TWILIO_SID = '';
var TWILIO_AUTH_TOKEN = '';
var TWILIO_PHONE_NUMBER = '';
var MY_PHONE_NUMBER = '';


// START
//
if (debug){
  console.log('Running debug functions..');

  debugCheckKeyword();

  checkCollection();

} else {

  setInterval(main, queueTimeInterval);
  setInterval(checkCollection, queueTimeInterval);
  console.log('Starting app');

}

function main(){
  searchUrlForKeywords(twiceShopUrl, keywords);
}

function searchUrlForKeywords(URL, keywords){
  console.log('searching..')

  keywords.forEach((keyword)=>{
    console.log('Checking ' + URL + ' for the keyword ' + keyword)

    try {
      axios.get(URL).then((response) =>{
        if (response.data.includes(keyword)){
          if (sendSmsMsg){
            sendSms('KEYWORD: ' + keyword + ': FOUND WHEN SEARCHING ' + URL, TWILIO_PHONE_NUMBER, MY_PHONE_NUMBER);
          }
          else {
            console.log('KEYWORD: ' + keyword + ': FOUND WHEN SEARCHING ' + URL);
          }
        }
        else {
          console.log('KEYWORD: ' + keyword + ': NOT found');
        }
      })
    }
    catch (ex) {
      console.log(ex);
    }
  })
}

async function checkCollection(){
  var collectionURL = debug ? twiceShopNayeonCollectionUrl : twiceShopJihyoCollectionUrl;
  console.log('Checking collection: ' + collectionURL);

  await axios.get(collectionURL).then((res)=>{
    console.log('found collection')
    if (sendSmsMsg){
      sendSms('collection found', TWILIO_PHONE_NUMBER, MY_PHONE_NUMBER);
    }
    else {
      console.log('Collection found at ' + collectionURL);
    }
  }).catch((err)=>{
    console.log('Collection NOT found: 404');
  })

}

function sendSms(message, fromNumber, toNumber){
  console.log('Sending sms to ' + toNumber + '..');
  const client = new twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);
  return client.messages.create({body: message, from: fromNumber, to: toNumber});
}

// DEBUG FUNCTIONS
//
function debugCheckKeyword(){
  console.log('Checking ' + twiceShopUrl + ' for the keyword ' + debugKeyword);

  axios.get(twiceShopUrl).then((response) =>{
    if (response.data.includes(debugKeyword)){
      if (sendSmsMsg){
        sendSms('keyword found', TWILIO_PHONE_NUMBER, MY_PHONE_NUMBER);
      }
      else {
        console.log('keyword found');
      }
    } else {
      console.log('keyword not found');
    }
  })
}
