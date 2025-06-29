const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
// mongoose.connect("mongodb+srv://magdoom:12345@cluster0.njegtar.mongodb.net/Passkeyapp?retryWrites=true&w=majority&appName=Cluster0")
mongoose.connect(process.env.MONGO_URI)
    .then(function () {
        console.log("Connected to DB");
    })
    .catch(function () {
        console.log("Failed to connect");
    });

const credential = mongoose.model("credential", {}, "bulkmailapp");

app.post("/sendemail", function (req, res) {
    var msg = req.body.msg
    var emailList = req.body.emailList
credential.find().then(function (data) {
    console.log("Credentials loaded from DB:", data); 

   const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: data[0].toJSON().user,
    pass: data[0].toJSON().pass,
  },
  tls: {
    rejectUnauthorized: false, 
  },
});


    new Promise(async function (resolve, reject) {
        try {
            for (var i = 0; i < emailList.length; i++) {
                console.log("Sending to:", emailList[i]); 
                await transporter.sendMail({
                    from: data[0].toJSON().user,
                    to: emailList[i],
                    subject: "A message from Bulk Mail App",
                    text: msg
                });
                console.log("Email sent to:", emailList[i]);
            }
            resolve("Success");
        } catch (error) {
            console.log("Caught inside try-catch:", error); 
            reject(error); 
        }
    })
    .then(function () {
        console.log("All emails sent successfully"); 
        res.send(true);
    })
    .catch(function (err) {
        console.log("Email sending error:", err); 
        res.send(false);
    });
})
.catch(function (err) {
    console.log("MongoDB find error:", err); 
    res.send(false);
});

})

app.listen(5000, function () {
    console.log("Server Started...")
})


