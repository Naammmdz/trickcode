import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { ILesson } from 'app/shared/model/lesson.model';
import { IEnrollment } from 'app/shared/model/enrollment.model';

export interface ILessonProgress {
  id?: number;
  completedAt?: dayjs.Dayjs | null;
  isCompleted?: boolean | null;
  user?: IUser | null;
  lesson?: ILesson | null;
  enrollment?: IEnrollment | null;
}

export const defaultValue: Readonly<ILessonProgress> = {
  isCompleted: false,
};
