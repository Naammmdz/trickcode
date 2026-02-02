import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { ICourse } from 'app/shared/model/course.model';
import { OrderStatus } from 'app/shared/model/enumerations/order-status.model';

export interface IOrder {
  id?: number;
  totalAmount?: number;
  status?: keyof typeof OrderStatus | null;
  createdAt?: dayjs.Dayjs | null;
  paymentMethod?: string | null;
  transactionId?: string | null;
  user?: IUser | null;
  course?: ICourse | null;
}

export const defaultValue: Readonly<IOrder> = {};
