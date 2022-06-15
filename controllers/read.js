import db from "../prisma/db.js";

export const readPost = async (req, res) => {
  try {
    // const post = await db.postRead.findFirst({
    //   where: {
    //     postId: Number(req.params.id),
    //     userId: req.auth.userId,
    //   },
    //   include: {
    //     post: true,
    //     user: true,
    //   },
    // });

    const post = await db.postRead.create({
      data: {
        postId: Number(req.params.id),
        userId: req.auth.userId,
      },
    });
    // console.log(post);
    res.status(201).json({
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unreadPost = async (req, res) => {
  try {
    const post = await db.postRead.delete({
      where: {
        postId: Number(req.params.id),
        userId: req.auth.userId,
      },
    });
    // console.log(post);
    res.status(201).json({
      post,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
