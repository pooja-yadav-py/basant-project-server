const express = require("express");
const router = express.Router();
const Bcrypt = require("bcryptjs");
const User = require("../model/userSchema");


//signup route
router.post("/signup",async (req,res) => {
    let { username, gender,DOB,email, password, confirmPassword, selectedFile } = req.body;
    console.log(req.body)
    if (!username || !gender ||!DOB || !email || !password || !confirmPassword || !selectedFile) {
        
        return res.status(420).json({ error: "plz fill the field properly" });
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
          
          const user = new User({ username, gender, DOB, email, password, selectedFile });
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
 

//  //get user info
//    router.get("/loginuser/:email", async (req,res) => {
//    try{
//        loginuseremail = req.params.email;
//        const response = await User.findOne({ email:email });
//        res.status(200).json({ result: response });
//        console.log(response);
//    }catch(err){
//     res.status(402).json({ message: err.message });
//    }
//    })

 //  forget password 

 router.post("/forgetpassword", async (req,res) => {
   const { email, DOB } = req.body;
   
  //  if (!email || !DOB) {
  //   return res.status(401).json({ error: "Plz Filled the data" });
  // }
    const userforgetPass = await User.findOne({ email: email });
  
    if(userforgetPass){
      if(DOB===userforgetPass.DOB){
        res.status(200).json({ message: "valid 1",_id: userforgetPass._id });        
      }else{
        res.status(422).json({ error: "DOB is not matched" });
      }
    }else{
      res.status(400).json({ error: "user not exist" });
    }
    
   
 })
   
 //change password
 router.patch("/changePassword/:id", async (req, res) => {
 try{
  const _id = req.params.id; 
  newPassword = Bcrypt.hashSync(req.body.password, 10);
  console.log(newPassword)
  
  const updatePassword = await User.findByIdAndUpdate(_id, { password: newPassword });
   res.send(updatePassword);
 }catch(err){
   console.log(err)
   res.status(404).send({ message: err.message })
   
 }

 })
 
  
   
   
   module.exports = router;