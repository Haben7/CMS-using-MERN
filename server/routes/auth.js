const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  //check all the missing fields.
  if(!name || !email || !password)
    return res
      .status(400)
      .json({error: `please enter all field.`});
  //name validation
  if(name.length > 15){
    return res
      .status(400)
      .json({error: "name can only be less than 15 characters"})

  }
  // email validation
      const emailReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "please enter a valid email address."});

  //validation of password.
  if (password.length < 6)
    return res
       .status(400)
       .json({error: "password must be at least 6 characters"})  
  try {
    const doesUserAlreadyExist = await User.findOne({ email });

    if(doesUserAlreadyExist)
      return res
        .status(400)
        .json({
          error:`a user with [${email}] email adress is already exist`
        })

    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = new User({name, email, password: hashedpassword}); 

    //save the user.
    const result = await newUser.save();
    result._doc.password = undefined;

    return res
      .status(201)
      .json({...result._doc });
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message });
  }
});

router.post("/login", async (req,res) => {
  const {email, password} = req.body;

  if(!email || !password)
    return res
      .status(400)
      .json({error: "please enter all required fields."});
  //email validation.
  const emailReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "please enter a valid email address."});

      try {
        const doesUserExists = await User.findOne({ email });

        if(!doesUserExists)
          return res
            .status(400)
            .json({error: "Invalid email or password!"});
        
        //if there is a user
         const doesPasswordMatch = await bcrypt.compare(
          password,
          doesUserExists.password
         );
         if(!doesPasswordMatch)
          return res
            .status(400)
            .json({error: "Invalid email or password"});

         const payload = { _id: doesUserExists._id };
         const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
         });

         return res
           .status(200)
           .json({ token });
      }  catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message });
      }
});


module.exports = router;