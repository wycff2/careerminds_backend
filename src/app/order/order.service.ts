import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { isValidString } from '@app/utils/string';
import { createOrdersDto, OrdersUpdateDto } from './order.dto';
import { Orders } from '@app/models/order.schema';
import { StripeService } from '../stripe/stripe.service';
import { CartsService } from '../cart/cart.service';
import { User } from '@app/models/user.schema';
import { Course } from '@app/models/course.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name) private readonly ordersModel: Model<Orders>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private jwtService: JwtService,
    private stripeService: StripeService,
    private cartsService: CartsService,
  ) {}

  async build(model: createOrdersDto): Promise<{ order: Orders }> {
    const { userId, description, courseIds } = model;

    const order = new this.ordersModel({
      userId,
      courseIds,
      description,
    });

    await order.save();

    return { order };
  }

  // async createOrders(createOrderDto: createOrdersDto): Promise<Orders> {
  //   const { userId, description, courseIds } = createOrderDto;

  //   const order = new this.ordersModel({
  //     userId,
  //     courseIds,
  //     description,
  //   });

  //   try {
  //     console.log('Trying to create order and payment');
  //     const user = await this.userModel.findById(userId);

  //     console.log('User found:', user);
  //     const customer = await this.stripeService.createCustomer({
  //       userId,
  //       name: user.Name,
  //       email: user.email,
  //       address: user.address,
  //     });

  //     console.log('Customer created:', customer);

  //     // Retrieve courses and calculate the total amount
  //     const courses = await this.courseModel.find({ _id: { $in: courseIds } });
  //     const totalAmount = courses.reduce((sum, course) => sum + parseFloat(course.offerPrice), 0);

  //     console.log('Total amount calculated:', totalAmount);

  //     order.totalAmount = totalAmount;

  //     const savedOrder = await order.save();

  //     console.log('Order saved:', savedOrder);
  //     const payment = await this.stripeService.createPaymentIntent({
  //       customer,
  //       amount: totalAmount,
  //     });

  //     console.log('Payment created:', payment);
  //     return savedOrder;
  //   } catch (error) {
  //     console.error('Error creating order and payment:', error);
  //     await order.deleteOne();
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async createOrders(createOrderDto: createOrdersDto): Promise<Orders> {
    const { userId, description, courseIds } = createOrderDto;

    const order = new this.ordersModel({
      userId,
      courseIds,
      description,
    });

    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      let customerStripeId = user.stripeId;
      if (!customerStripeId) {
        // console.log('Creating stripe customer with email:', user.email, 'and name:', user.fullName);
        customerStripeId = await this.stripeService.createCustomer({
          userId,
          name: user.fullName,
          email: user.email,
          address: user.address,
        });
        user.stripeId = customerStripeId;
        await user.save();
      } else {
        // console.log('User already has a stripe customer, returning stripe customer id:', customerStripeId);
      }

      const courses = await this.cartsService.getCoursesByIds(courseIds);

      const totalAmount = courses.reduce((sum, course) => {
        const offerPrice = parseFloat(course.offerPrice);
        return sum + offerPrice;
      }, 0);

      const minimumAmount = 0.5;

      if (totalAmount < minimumAmount) {
        throw new HttpException(
          `The total amount must be greater than or equal to ${minimumAmount}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      order.totalAmount = totalAmount;
      order.customerId = customerStripeId;

      // Create payment intent and save paymentId to order
      const payment = await this.stripeService.createPaymentIntent({
        customer: customerStripeId,
        amount: totalAmount * 100, // Stripe expects amount in cents
        currency: 'usd', // Replace with your desired currency or fetch dynamically
      });

      order.paymentId = payment.id; // Save payment ID to order

      const savedOrder = await order.save();

      return savedOrder;
    } catch (error) {
      console.error('Error creating order and payment:', error);
      await order.deleteOne();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllOrders(queryParams): Promise<Orders[]> {
    let { page_no = 1, page_size = 50 } = queryParams;

    page_no = Number(page_no);
    page_size = Number(page_size);

    const skip = (page_no - 1) * page_size;

    const all_orders = await this.ordersModel.aggregate([
      {
        $match: {
          is_deleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseIds',
          foreignField: '_id',
          as: 'courseIds',
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: page_size,
      },
    ]);
    return all_orders;
  }

  async getById(id: string): Promise<Orders | null> {
    const orders = await this.ordersModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
          is_deleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      {
        $unwind: {
          path: '$userId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseIds',
          foreignField: '_id',
          as: 'courseIds',
        },
      },
    ]);
    return orders.length > 0 ? orders[0] : null;
  }

  async softDelete(id: string): Promise<Orders | Observable<Orders | any>> {
    const orders = await this.ordersModel.findByIdAndDelete(
      { _id: id },
      {
        $set: {
          is_deleted: true,
        },
      },
    );
    return orders;
  }

  async updateOrders<T>(id: T | string, model: OrdersUpdateDto): Promise<Orders> {
    const orders = await this.ordersModel.findById({ _id: id });

    if (!orders) {
      throw new HttpException('orders not found', HttpStatus.BAD_REQUEST);
    }

    if (
      isValidString(
        model.description !== 'string' &&
          model.description !== '' &&
          model.description !== undefined &&
          model.description,
      )
    ) {
      orders.description = model.description;
    }

    await orders.save();
    return orders;
  }
}
