export abstract class CustomerMessageInterface {
  abstract sendCreateUserMessage(
    customer_id: string,
    customer_email: string,
    code: string,
  ): Promise<void>;

  abstract sendUserActivatedMessage(
    customer_name: string,
    customer_email: string,
  ): Promise<void>;
}
