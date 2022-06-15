import db from "../prisma/db.js";

export const likePost = async (req, res) => {
  try {
    const likes = {};
    console.log({ liked: req.body.like });
    if (req.body.like) likes.increment = 1;
    else likes.decrement = 1;

    console.log({ likes });

    const post = await db.post.update({
      where: {
        id: Number(req.params.id),
      },
      data: { likes },
    });
    // console.log(post);
    res.status(201).json({
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
