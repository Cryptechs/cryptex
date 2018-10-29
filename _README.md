# Project Name

> Pithy project description

## Team

- **Product Owner**: Micah Weiss
- **Scrum Master**: James Dempsey
- **Development Team Members**: Micah Weiss, James Dempsey, Chris Athanas

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
   1. [Installing Dependencies](#installing-dependencies)
   1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Basic Cryptocurrency tracking, along with portfolio value management;

## Requirements

- axios 0.18.
- babel 6.23.0
- body-parser 1.18.3
- express 4.16.4
- morgan 1.9.1
- mysql 2.16.0
- pg 7.5.0
- react 16.5.2
- react-charts 1.0.10
- react-dom 16.5.2

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

-----------------------------------------------------------------------------------------------ADDED NOTES

# Client

- Gets wallet data from user (wallet coin amounts at each unit of time)
- Gets live coin data from AlphaAdvantage API

- Need config.js with your own API key for Alpha Advantage.co API
- Limit of 5 requests per minute and 500 a month for each email

# file: index.jsx

- auth0Client.handleAuthentication is Async function, which is why when user logs-in which is why the user has to click again to see the page.

# Authentication

- See James Dempsey for auth0 specifications and insights

# Server

- Can have multiple users
- Saves 5 coins for each user
- Server gets current value of coins every 70 seconds

## Advanced Suggestions

- User chooses which coins to track
- would involve converting coin1...coin5 variables to arrays of coins[]
- Add tests
- Coin forms easier
- Make API key rotator to use multiple API keys
- Refactor server to update coin every hour
