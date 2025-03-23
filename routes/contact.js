const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// Define the POST /identify route
router.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;
  console.log("Received request:", req.body);

  try {
    // Use optimized query with lean()
    let contacts = await Contact.find({
      $or: [{ email }, { phoneNumber }]
    }).lean();

    if (contacts.length === 0) {
      // Create a new primary contact if none exists
      const newContact = new Contact({ email, phoneNumber, linkPrecedence: "primary" });
      await newContact.save();
      return res.status(200).json({
        primaryContactId: newContact._id,
        emails: [newContact.email],
        phoneNumbers: [newContact.phoneNumber],
        secondaryContactIds: []
      });
    }

    let primaryContact = contacts.find(c => c.linkPrecedence === "primary") || contacts[0];

    // Create a secondary contact if necessary
    const newSecondary = new Contact({ email, phoneNumber, linkPrecedence: "secondary", linkedId: primaryContact._id });
    await newSecondary.save();

    contacts.push(newSecondary);

    return res.status(200).json({
      primaryContactId: primaryContact._id,
      emails: [...new Set(contacts.map(c => c.email).filter(Boolean))],
      phoneNumbers: [...new Set(contacts.map(c => c.phoneNumber).filter(Boolean))],
      secondaryContactIds: contacts.filter(c => c.linkPrecedence === "secondary").map(c => c._id)
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
