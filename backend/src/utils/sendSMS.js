import twilio from "twilio"
import "dotenv/config"


const accountSid = 'AC877908ccf3e7f88a525e4bdbc46fdcdf';
const authToken = process.env.TWILIO_TOKEN;
const client = twilio(accountSid, authToken);
export async function sendSMS({phoneNumber, otp}) {
    try {      
      // Send the OTP message
        await client.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: '+12179844242', // Twilio phone number
        to: phoneNumber
        });
  
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
}
async function createCall() {
    const call = await client.calls.create({
      from: "+12179844242",
      to: "+84975422317",
      twiml: "<Response><Say>Your otp is 000000</Say></Response>",
    });
  
    console.log(call.sid);
  }
  
  sendSMS({phoneNumber: "+84975422317", otp:"000000"})