const sendEmail = async (data) => {
  console.log(`Sending email to ${data.to}`);

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("Email sent successfully 🚀");
};

module.exports = sendEmail;