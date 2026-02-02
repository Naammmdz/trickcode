import { ISection } from 'app/shared/model/section.model';
import { LessonType } from 'app/shared/model/enumerations/lesson-type.model';

export interface ILesson {
  id?: number;
  title?: string;
  type?: keyof typeof LessonType | null;
  orderIndex?: number | null;
  durationSeconds?: number | null;
  isPreview?: boolean | null;
  videoUrl?: string | null;
  captionUrl?: string | null;
  markdownContent?: string | null;
  quizConfig?: string | null;
  codeChallengeConfig?: string | null;
  section?: ISection | null;
}

export const defaultValue: Readonly<ILesson> = {
  isPreview: false,
};
