import Message from "../../models/Message.js";

const fetchMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ room: roomId })
      .populate("sender", "username profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error while fetching messages." });
  }
};

export default fetchMessages;
