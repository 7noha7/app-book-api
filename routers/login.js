const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


const prisma = new PrismaClient();



// 新規ユーザー登録API
router.post("/register",async(req, res) => {

  try {

    const { username ,email , password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    
    return res.json({ user })
  } catch (error){
    console.error("登録エラー：", error);}
});


// ユーザーログインAPI
router.post("/login", async(req, res) => {
  const {email, password} = req.body;

  const user = await prisma.user.findUnique({ where: { email }});

  if(!user) {
return res.status(401).json({error: "メールアドレスかパスワードが間違っています。"})
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid) {
    return res.status(401).json({ error: "パスワードが正しくありません。"})
  }

const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {
  expiresIn: "1d",
});

return res.json( { token });
});

module.exports = router;