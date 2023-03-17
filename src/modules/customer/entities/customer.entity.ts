import { randomUUID } from 'node:crypto';
import { hash, compare } from 'bcrypt';
export class Customer {
  id: string;
  name: string;
  username: string;
  password: string;
  phone: string;
  active: boolean;
  email: string;

  constructor(
    name: string,
    username: string,
    password: string,
    phone: string,
    email: string,
    active?: boolean,
    id?: string,
  ) {
    this.name = name;
    this.username = username;
    this.phone = phone;
    this.email = email;
    if (!id) {
      this.active = false;
      this.id = randomUUID();
      this.password = password;
    } else {
      this.active = active;
      this.id = id;
      this.password = password;
    }
  }

  async hashPassword() {
    await hash(this.password, 10).then((hash) => (this.password = hash));
  }

  async validatePassword(password): Promise<boolean> {
    const isValid = await compare(password, this.password);
    return isValid;
  }

  async activeCustomer() {
    this.active = true;
  }
}
