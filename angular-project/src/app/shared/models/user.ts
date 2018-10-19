export class User {


  constructor(id: number, name: string, email: string, username: string, password = null as string) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._username = username;
    this._password = password;
  }
  private _id: number;
  private _name: string;
  private _email: string;
  private _username: string;
  private _password: string

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }
}
