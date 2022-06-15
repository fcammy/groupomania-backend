import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // Get token from header

    if (!req.headers.authorization) throw Error("No token provided");
    const token = req.headers.authorization.split(" ")[1];

    // Verify token
    const decodedToken = jwt.verify(token, "secret");

    // Add user from payload

    const userId = decodedToken.userId;

    // Check if user exists

    req.auth = { userId };

    next();

    // if (req.body.userId && req.body.userId !== userId) {
    //   throw "Invalid User ID";
    // } else {
    //   next();
    // }
  } catch ({ message }) {
    res.status(401).json({
      message,
    });
  }
};

export default auth;
