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

    // --- AI INTEGRATION ---
    const isDirectAI = !room.isGroupChat && room.members.some(m => m.toString() === global.cogniBotId);
    const isMentionedAI = room.isGroupChat && content.toLowerCase().includes("@cogni");

    if ((isDirectAI || isMentionedAI) && req.user._id.toString() !== global.cogniBotId) {
      // Process AI response asynchronously
      import("../../utils/aiClient.js").then(async ({ generateAIResponse }) => {
        try {
          let prompt = content;
          if (isMentionedAI) {
            prompt = content.replace(/@cogni/gi, "").trim();
          }

          // Fetch recent chat history for context
          const recentMessages = await Message.find({ room: roomId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("sender", "username");
          
          const history = recentMessages.reverse().map(msg => ({
            role: msg.sender._id.toString() === global.cogniBotId ? 'model' : 'user',
            content: `[${msg.sender.username}]: ${msg.content}`
          }));

          const aiResponseText = await generateAIResponse(prompt, history);

          const aiMessage = await Message.create({
            sender: global.cogniBotId,
            room: roomId,
            content: aiResponseText,
            messageType: "text",
            fileUrl: "",
            filePublicId: "",
          });

          const populatedAIMessage = await aiMessage.populate([
            { path: "sender", select: "username profilePic" },
            { path: "room", select: "name isGroupChat members" }
          ]);

          room.lastMessage = aiMessage._id;
          
          room.members.forEach((memberId) => {
            if (memberId.toString() !== global.cogniBotId) {
              const currentCount = room.unreadCounts.get(memberId.toString()) || 0;
              room.unreadCounts.set(memberId.toString(), currentCount + 1);
            }
          });
          
          await room.save();

          // We don't have direct access to 'io' here, so we might need a global event emitter
          // or we can emit via a socket utility if we export it from socketHandler.js
          // Since we can't emit from here easily without refactoring, we can use a small hack
          // by requiring socket instance or emitting an internal event that socketHandler listens to.
          // For now, let's just create a global emitter.
          if (global.io) {
            if (room.isGroupChat) {
              global.io.in(roomId).emit("message received", populatedAIMessage);
            } else {
              // emit to the user
              global.io.in(req.user._id.toString()).emit("message received", populatedAIMessage);
              global.io.in(global.cogniBotId).emit("message received", populatedAIMessage); // Optional
            }
          }

        } catch (aiError) {
          console.error("Error generating AI response:", aiError);
        }
      });
    }

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error while sending message." });
  }
};

export default sendMessage;
