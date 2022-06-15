export const uploadFile = async (req, res, next) => {
  try {
    //console.log(req.body);
    res.json(req.file);

    //res.json({ image: req.image });
  } catch ({ message }) {
    res.status(400).json({ message });
  }
};
