import dayjs from 'dayjs';
import { CourseLevel } from 'app/shared/model/enumerations/course-level.model';
import { CourseStatus } from 'app/shared/model/enumerations/course-status.model';

export interface ICourse {
  id?: number;
  title?: string;
  description?: string | null;
  price?: number | null;
  oldPrice?: number | null;
  level?: keyof typeof CourseLevel | null;
  status?: keyof typeof CourseStatus | null;
  thumbnailUrl?: string | null;
  videoPreviewUrl?: string | null;
  rejectionReason?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  publishedAt?: dayjs.Dayjs | null;
}

export const defaultValue: Readonly<ICourse> = {};
