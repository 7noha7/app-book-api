const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");


const prisma = new PrismaClient();


router.leave("/leave",isAuthenticated, async(req,res)=>{

  const userId =req.userId;

  if(!userId){
    return res.status(400).json({error: "ユーザーが見つかりませんでした。"});

  }

  try{
await prisma.book.delete({ where: { id:userId}});

await prisma.user.delete({ where: { id:userId}});
return res.status(200).json({ message: "アカウントが削除されました"})

  }catch(err){
    console.error("削除エラー",err);
    res.status(500).json({ message: "アカウントの削除に失敗しました"});
  }
})

module.exports = router;