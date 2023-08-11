# Todo Application

## Project Description
This repository contains the code for a Todo Application, which allows users to manage their daily tasks and keep track of their to-do lists.

## Features
1. User Authentication: Users can create accounts and log in to access their todo lists securely.
2. User JWT for Creating Todo: After authentication, users will receive a JSON Web Token (JWT) that will be used to create new todos.
3. Update and Delete Todo: Users have the ability to update or delete existing todos as per their requirements.
4. Sanitization: The application implements sanitization techniques to prevent any malicious inputs and ensure data security.

## How to Log In
For enhanced security, this application uses the RSA algorithm for passing passwords. RSA provides strong encryption and helps prevent password hijacking.
### steps to generate a base64 password

```
const NodeRSA = require("node-rsa");
const base64 = require("base-64");

const password = "Test@123"; // your password

// generate a RSA Private and key
const RSA_PRIVATE_KEY =  " " // have a RSA Key
  

const RSA_PUBLIC_KEY = " " // have a RSA Key
 

// Encrypt the password using the public key
const encrypted = new NodeRSA(RSA_PUBLIC_KEY).encrypt(password, "base64");

// Decrypt the password using the private key
const decrypted = new NodeRSA(RSA_PRIVATE_KEY).decrypt(encrypted, "utf8");

console.log({ decrypted, encrypted });

// sample
{
  decrypted: 'Test@123',
  encrypted: 'JF2I2P35V5BjovO1YwZxdIyr6h+PTpu1hC61Bz8D5u8HgBX6I78M//eUHgEhk8Ad9UUjDzAQFz3Q8+OWmUIglg=='
}
```


## Getting Started
To get started with the Todo Application, follow these steps:

1. Clone this repository to your local machine.
2. Install the required dependencies by running `npm install` in the project root directory.
3. Set up the database and configure the necessary environment variables for the application.
4. Run the application using `npm start` command.
5. Access the application in your web browser by navigating to the appropriate URL.

## Dependencies
The Todo Application relies on the following main dependencies:

- Node.js: The runtime environment for executing JavaScript code on the server.
- Nest.js: A web application framework for Node.js that simplifies server-side development.
- JSON Web Token (JWT): Used for user authentication and securing the routes.
- NODE-RSA: Employed for password encryption to enhance security.

## Contributing
Contributions to the Todo Application are welcome! If you find any issues or want to add new features, feel free to open a pull request.

Before contributing, please make sure to read our [code of conduct](CODE_OF_CONDUCT.md).

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For any inquiries or feedback regarding the project, please contact us at example@example.com.

Happy task managing!
