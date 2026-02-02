import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { ICourse } from 'app/shared/model/course.model';

export interface IEnrollment {
  id?: number;
  enrolledAt?: dayjs.Dayjs;
  completedAt?: dayjs.Dayjs | null;
  status?: string | null;
  user?: IUser | null;
  course?: ICourse | null;
}

export const defaultValue: Readonly<IEnrollment> = {};
