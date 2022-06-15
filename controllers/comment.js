import db from "../prisma/db.js";

export const createComment = async (req, res) => {
  const id = req.params.id;
  const post = await db.post.findUnique({
    where: {
      id: Number(id),
    },
  });
  const { text } = req.body;
  try {
    const comment = await db.comment.create({
      data: {
        text: text,
        userId: req.auth.userId,
        postId: post.id,
      },

      include: {
        post: true,
        user: true,
      },
    });

    res.status(201).json(comment);
  } catch (ex) {
    console.log(ex);
    res.status(400).json({
      message: ex.message,
    });
  }
};

export const getComments = async (req, res) => {
  const comments = await db.comment.findMany({
    where: {
      postId: Number(req.params.id),
    },
    include: {
      user: true,
    },
  });
  res.json(comments);
};
