const express = require("express");
const router = express.Router();
const Bcrypt = require("bcryptjs");
const User = require("../model/userSchema");


//signup route
router.post("/signup",async (req,res) => {
    let { username, gender, email, password, confirmPassword, selectedFile } = req.body;
    if (!username || !gender || !email || !password || !confirmPassword || !selectedFile) {
        
        return res.status(420).json({ error: "plz filled the field properly" });
      }
      if(password!==confirmPassword){
        return res.status(420).json({ error: "plz check your password" });
     }
     else{
        password = Bcrypt.hashSync(password, 10);
      }
      const userExist = await User.findOne({ email: email });     
      
    try{
        
        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" });
          }
          
          const user = new User({ username, gender, email, password, selectedFile });
          const userRegister = await user.save();
          res.status(201).json({ message: "user registered successfully" });
          console.log(userRegister);
    }catch(err){
        console.log(err);
    }
})

//login router
router.post("/login", async (req,res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Plz Filled the data" });
      }
      const userLogin = await User.findOne({ email: email });
      if (userLogin) {
        const isMatch = await Bcrypt.compare(password, userLogin.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid Credientials pass" });
          } else {
            res.status(200).json({
              message: "user Signin Successfully",
              result: userLogin              
            });
          }
        } else {
            res.status(400).json({ error: "Invalid Credientials  " });
          }
 })
 

 //get user info
   router.get("/loginuser/:email", async (req,res) => {
   try{
       loginuseremail = req.params.email;
       const response = await User.findOne({email:loginuseremail});
       res.status(200).json({ result: response });
       console.log(response);
   }catch(err){
    res.status(402).json({ message: err.message });
   }
   })
   
  
   
   
   module.exports = router;