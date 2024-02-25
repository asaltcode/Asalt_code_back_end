const homePage = (req, res) => {
  try {
    res.status(200).send({
      message: "Api working successfully!",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export default { homePage };
