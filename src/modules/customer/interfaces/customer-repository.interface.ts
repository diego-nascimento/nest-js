import { Customer } from '../entities/customer.entity';

export abstract class CustomerRepositoryInterface {
  abstract createCustomer(customer: Customer): Promise<void>;
  abstract createActivationCode(
    customer_id: string,
    code: string,
  ): Promise<void>;
  abstract userAlreadyExists(customer: Customer): Promise<boolean>;
  abstract findUser(customer_id: string): Promise<Customer>;
  abstract findUserByActivationCode(code: string): Promise<Customer>;
  abstract updateCustomer(customer: Customer): Promise<void>;
  abstract removeCode(code: string): Promise<void>;
}
