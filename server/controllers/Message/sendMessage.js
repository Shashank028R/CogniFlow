import Message from "../../models/Message.js";
import Room from "../../models/Room.js";

const sendMessage = async (req, res) => {
  try {
    const { content, roomId, messageType, fileUrl, filePublicId } = req.body;

    if (!roomId || (!content && !fileUrl)) {
      return res.status(400).json({
        message: "Message must have content or file",
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room Not Found!" });
    }

    if (!room.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const message = await Message.create({
      sender: req.user._id,
      room: roomId,
      content: content || "",
      messageType: messageType || "text",
      fileUrl: fileUrl || "",
      filePublicId: filePublicId || "",
    });

    const populatedMessage = await message.populate([
      { path: "sender", select: "username profilePic" },
      {
        path: "room",
        select: "name isGroupChat members",
        populate: {
          path: "members",
          select: "username profilePic email",
        },
      },
    ]);

    // Increment unread counts for all members except the sender
    room.members.forEach((memberId) => {
      if (memberId.toString() !== req.user._id.toString()) {
        const currentCount = room.unreadCounts.get(memberId.toString()) || 0;
        room.unreadCounts.set(memberId.toString(), currentCount + 1);
      }
    });

    room.lastMessage = message._id;
    await room.save();

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error while sending message." });
  }
};

export default sendMessage;
