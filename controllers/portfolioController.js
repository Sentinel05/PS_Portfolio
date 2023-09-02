const sendEmailController = (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      message: "Your message sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Send email API error",
      error,
    });
  }
};

module.exports = { sendEmailController };
