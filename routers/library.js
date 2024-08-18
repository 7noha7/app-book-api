const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");


const prisma = new PrismaClient();



// 書籍投稿用
router.post("/book", isAuthenticated,async(req, res) => {
  const { booktitle ,bookauthor, genru,content } = req.body;

  if( !booktitle) {
    return res.status(400).json({message:"項目を埋めてください"});
  }

  try {
    const newBook = await prisma.book.create({
     data: {
       booktitle,
       bookauthor,
       genru,
       content,
       userId: req.userId,
     },
     include: {
      user: true,
     }
    })
    return res.json({newBook});
    

  } catch(error)  {
console.error(error);
res.status(500).json({ error:"書籍の保存に失敗しました。"})
  }


});





router.get("/myBook", isAuthenticated,async(req, res) => {
  try {
    // デバッグ
// console.log("User ID: ", req.userId);

    const user =await prisma.user.findUnique({ where: { id: req.userId}});
    if(!user) {
      res.status(400).json({error: "ユーザーが見つかりませんでした。"});
    }

    const MyBookList = await prisma.book.findMany({
      where: {
        userId: req.userId,
      },
      orderBy :{ 
        createdAt: "desc",
       },
       include: {
        user: true,
       },
    });
    return res.status(200).json({
      books: MyBookList,
      user: {id: user.id, email: user.email, username: user.username},
    });

  }catch(err){
    console.error("Failed to fetch books",err);
    res.status(500).json({ message: "サーバーエラーです。"});
  }
})


// 書籍削除用
router.delete("/book/:id", isAuthenticated, async(req,res)=> {
  const bookId = parseInt(req.params.id,10);

  try {
     await prisma.book.delete({
      where: { id:bookId },
    });
    res.status(200).json({ message: "書籍が削除されました"})
  } catch(error) {
    console.error("削除エラー：", error);
    res.status(500).json({message: "書籍の削除に失敗しました"})
  }
})

// 編集用
router.put("/book/:id", isAuthenticated, async(req,res)=> {
  const bookId =parseInt(req.params.id, 10);
  const {booktitle, bookauthor, genru, content } = req.body;

  try {
    const updateBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        booktitle,
        bookauthor,
        genru,
        content,
      },
    });
    return res.json({updateBook});
  } catch(error){
    console.error("編集エラー：", error);
    res.status(500).json({ message: "書籍の編集に失敗しました。"})
  }
})


module.exports = router;