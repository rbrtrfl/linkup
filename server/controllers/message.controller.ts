import prisma from '../db';

const createNewMessage = async (userId: any, eventId: any, msg: any) => {
  try {
    const newMessage = await prisma.message.create({
      data: {
        user_id: userId,
        event_id: eventId,
        content: msg,
      },
      include: {
        user: {
          select: {
            id_user: true,
            first_name: true,
            profile_picture: true,
          },
        },
      },
    });
    return newMessage;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getAllMessages = async (eventId: number) => {
  try {
    const allMessages = await prisma.message.findMany({
      where: {
        event_id: eventId,
      },
      include: {
        user: {
          select: {
            id_user: true,
            first_name: true,
            profile_picture: true,
          },
        },
      },
    });
    return allMessages;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export default { createNewMessage, getAllMessages };
