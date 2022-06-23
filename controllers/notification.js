import db from "../prisma/db.js";

export const readNotification = async (req, res) => {
  try {
    const notification = await db.notification.findFirst({
      where: {
        postId: Number(req.params.id),
        userId: req.auth.userId,
      },
    });
    const read = await db.notification.update({
      where: {
        id: notification.id,
      },
      data: {
        read: true,
      },
    });

    res.status(201).json(read);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await db.notification.findMany({
      where: {
        userId: req.auth.userId,
      },
      include: {
        post: true,
        post: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
