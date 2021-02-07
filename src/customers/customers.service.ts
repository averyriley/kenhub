import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from 'src/shared/data-models/customer.model';
import { UpdateCustomerDto } from 'src/shared/mappings/customer.mappings';
import { CreateCustomerDto } from 'src/shared/models/create-customer.dto';
import { PaginationQueryDto } from 'src/shared/models/pagination.dto';

@Injectable()
export class CustomersService {
    constructor(
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
      ) {}
    
    public async findAll(
        paginationQuery: PaginationQueryDto,
      ): Promise<Customer[]> {
        const { limit, offset } = paginationQuery;
    
        return await this.customerModel
          .find()
          .skip(offset)
          .limit(limit)
          .exec();
      }
    
      public async findOne(customerId: string): Promise<Customer> {
        const customer = await this.customerModel
          .findById({ _id: customerId })
          .exec();
    
        if (!customer) {
          throw new NotFoundException(`Customer #${customerId} not found`);
        }
    
        return customer;
      }
    
      public async create(
        createCustomerDto: CreateCustomerDto,
      ): Promise<Customer> {
        const newCustomer = await new this.customerModel(createCustomerDto);
        return newCustomer.save();
      }
    
      public async update(
        customerId: string,
        updateCustomerDto: UpdateCustomerDto,
      ): Promise<Customer> {
        const existingCustomer = await this.customerModel.findByIdAndUpdate(
          { _id: customerId },
          updateCustomerDto,
        );
    
        if (!existingCustomer) {
          throw new NotFoundException(`Customer #${customerId} not found`);
        }
    
        return existingCustomer;
      }
    
      public async remove(customerId: string): Promise<any> {
        const deletedCustomer = await this.customerModel.findByIdAndRemove(
          customerId,
        );
        return deletedCustomer;
      }
}
