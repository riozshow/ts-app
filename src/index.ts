const inquirer = require("inquirer");
const consola = require("consola");

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit",
}

type InquirerAnswers = {
  action: Action;
};

const startApp = () => {
  inquirer
    .prompt([
      {
        name: "action",
        type: "input",
        message: "How can I help you?",
      },
    ])
    .then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        case Action.List:
          users.showAll();
          break;
        case Action.Add:
          const user = await inquirer.prompt([
            {
              name: "name",
              type: "input",
              message: "Enter name",
            },
            {
              name: "age",
              type: "number",
              message: "Enter age",
            },
          ]);
          users.add(user);
          break;
        case Action.Remove:
          const name = await inquirer.prompt([
            {
              name: "name",
              type: "input",
              message: "Enter name",
            },
          ]);
          users.remove(name.name);
          break;
        case Action.Quit:
          Message.showColorized(MessageVariant.Info, "Bye bye!");
          return;
        default:
          Message.showColorized(
            MessageVariant.Error,
            `Wrong command "${answers.action}"`
          );
      }

      startApp();
    });
};

enum MessageVariant {
  Success = "success",
  Info = "info",
  Error = "error",
}

class Message {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  public show() {
    console.log(this.content);
  }

  public capitalize() {
    this.content =
      this.content[0].toUpperCase() +
      this.content.substring(1).toLocaleLowerCase();
  }

  public toLowerCase() {
    this.content = this.content.toLowerCase();
  }

  public toUpperCase() {
    this.content = this.content.toUpperCase();
  }

  static showColorized(variant: MessageVariant, text: string) {
    consola[variant](text);
  }
}

type User = {
  name: string;
  age: number;
};

class UsersData {
  public data: Array<User> = [];

  public showAll() {
    Message.showColorized(MessageVariant.Info, "Users data");
    this.data.length ? console.table(this.data) : console.log("No data...");
  }

  public add(user: User) {
    if (user.age > 0 && user.name.length > 0) {
      this.data.push(user);
      return Message.showColorized(
        MessageVariant.Success,
        "User has been successfully added!"
      );
    }
    Message.showColorized(MessageVariant.Error, "Wrong data!");
  }

  public remove(name: string) {
    const user = this.data.find((user) => user.name === name);
    if (!user)
      return Message.showColorized(MessageVariant.Error, "User not found...");
    this.data = this.data.filter((user) => user.name !== name);
    return Message.showColorized(MessageVariant.Success, "User deleted!");
  }
}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

startApp();
