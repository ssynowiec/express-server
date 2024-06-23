import type { Request, Response } from 'express';
import { db } from '../../db.config';
import { answersSchema } from './answers.schema';
import { eq } from 'drizzle-orm';
import { user } from '../users/users.schema';
import { io } from '../../server';
import { checkEventExists } from '../events/checkEventExists';

export const getAllAnswers = async (req: Request, res: Response) => {
  const allAnswers = await db.select().from(answersSchema);

  res.json(allAnswers);
};

export const getAnswerByEventId = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const allAnswers = await db
    .select()
    .from(answersSchema)
    .where(eq(answersSchema.event_id, eventId));

  res.json(allAnswers);
};

export const addNewAnswer = async (req: Request, res: Response) => {
  const { event_id, user_id, answers } = req.body;

  const event = await checkEventExists(event_id, res);

  const newAnswer = await db
    .insert(answersSchema)
    .values({
      event_id,
      answers,
    })
    .returning();

  const userAnswers = await db
    .update(user)
    .set({ answers_id: newAnswer[0].id })
    .where(eq(user.id, user_id));

  io.to(event[0].eventCode).emit('newAnswer', newAnswer[0]);

  res.json(newAnswer);
};
