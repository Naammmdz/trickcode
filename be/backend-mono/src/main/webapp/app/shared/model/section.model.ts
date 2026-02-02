import { ICourse } from 'app/shared/model/course.model';

export interface ISection {
  id?: number;
  title?: string;
  orderIndex?: number | null;
  course?: ICourse | null;
}

export const defaultValue: Readonly<ISection> = {};
