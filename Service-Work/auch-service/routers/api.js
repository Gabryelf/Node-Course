import express from "express";

const router = express.Router();

router.post('/register', (req, res) => {
  const {login, password} = req.body
  if(login === "12345" && password === "12345"){
    res.json({success: true, message: "Register Success!"});
  }
  else{
    res.json({success: false, error: "Error!"});
  }
});

router.post('/login', (req, res) => {
  const {login, password} = req.body
  if(login === "12345" && password === "12345"){
    res.json({success: true, message: "Welcome!"});
  }
  else{
    res.json({success: false, error: "Error!"});
  }
});

export default router;
