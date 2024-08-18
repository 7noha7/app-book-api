

const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");


const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async(req, res) =>{ 
try {
  const user =await prisma.user.findUnique({ where: { id: req.userId}});

  if(!user) {
    res.status(400).json({error: "ユーザーが見つかりませんでした。"});
  }

  res.status(200)
  .json({
    user: {id: user.id, email: user.email, username: user.username},
  });

} catch(err){
  res.status(500).json({error: err.message});
}


})

module.exports = router;