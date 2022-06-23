import db from "../prisma/db.js";

export const getAllPosts = async (req, res) => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      notification: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
    take: 10,
  });

  // const output = [];
  // posts.forEach(async (post) => {
  //   const read = await db.postRead.findFirst({
  //     where: {
  //       postId: Number(post.id),
  //       userId: req.auth.userId,
  //     },
  //     include: {
  //       post: true,
  //       user: true,
  //     },
  //   });
  //   output = [...output, { ...post, read: !!read }];
  // });

  res.json(posts);
};

export const createPost = async (req, res) => {
  try {
    // const { text, image } = req.body;
    //console.log({ text, image });

    //if (!text || !image) throw Error("Either image or text is required");

    const post = await db.post.create({
      data: {
        text: req.body.text,
        image: req.body.image,
        userId: req.auth.userId,
        createdAt: new Date(),
      },
      include: {
        user: true,
      },
    });

    const users = await db.user.findMany({
      where: {
        id: {
          notIn: [req.auth.userId],
        },
      },
      select: {
        id: true,
      },
    });

    const userIds = users.map((u) => u.id);

    for (const userId of userIds) {
      await db.notification.create({
        data: {
          postId: post.id,
          userId,
          read: false,
        },
      });
    }

    res.status(201).json(post);
  } catch (ex) {
    console.log(ex);
    res.status(400).json({
      message: ex.message,
    });
  }
};

export const getOnePost = async (req, res) => {
  const post = await db.post.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  res.json(post);
};

export const deletePost = async (req, res) => {
  try {
    const post = await db.post.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    if (post.userId === req.auth.userId) {
      await db.post.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      res.status(200).json({
        message: "Post deleted successfully",
      });
    } else {
      res.status(400).json({
        message: "You are not authorized to delete this post",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await db.post.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    if (post.userId === req.auth.userId) {
      await db.post.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          text: req.body.text,
          image: req.body.image,
        },
      });
      res.status(200).json({
        message: "Post updated successfully",
      });
    } else {
      res.status(400).json({
        message: "You are not authorized to update this post",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
