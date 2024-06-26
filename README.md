# Account-Discord-Bot

## What does it do?
This Discord bot, built on discord.js v14, facilitates sending account details to users upon request.

## How are the accounts processed?
Accounts should be entered into the `.txt` file using the format `mail : password`.

## Features:
- **Slash Command:** `/gen type: Minecraft` to request an account. **Types: Minecraft, Netflix, Steam**
- **Events and Error Handling:** Implemented to ensure smooth operation.
- **No Repeated Accounts:** Each account is removed from `.txt` after redemption.
- **Vouch Button:** Included in DMs for user feedback.
- **Gift/Give/Top Credits** - Credits system to redeem accounts.
- **Role for status** - Have something in your status and get a role.
- **Webhook logging** - Log every command bot event through a webhook.

---

### Setup Instructions:
1. **Clone the Repository:**
   ```
   git clone https://github.com/krushna06/Minecraft-Discord-Bot
   ```
   
2. **Install Dependencies:**
   ```
   npm install
   ```
   
3. **Add your accounts in `.txt`**
   Add accounts in the format `mail : password`.

4. **Rename** `example.config.json` to `config.json` and fill it.

5. **Start the Bot:**
   ```
   node index.js
   ```
   
6. **Usage:**
   - Invite the bot to your Discord server.
   - Use `/generate type: Minecraft` to receive a Minecraft account.


### REST API Usage:
This includes a REST API that provides account information through HTTP endpoints. The REST API allows external applications to retrieve the number of accounts available for each type (Minecraft, Netflix, Steam) by making GET requests.

To use the REST API, follow these steps:

1. Start the Discord bot by running the command `node index.js` in your terminal.

2. The REST API will automatically start along with the bot. It listens on port 3000.

3. To retrieve the account counts, make a GET request to the following endpoint:
   ```
   GET http://localhost:3000/api/v1/stock
   ```

4. The API will respond with a JSON object containing the account counts for each type. For example:
   ```json
   {
     "minecraft": 2,
     "netflix": 0,
     "steam": 0
   }
   ```
   This means there are currently 2 Minecraft accounts available, and 0 accounts for Netflix and Steam.


I hope this explanation helps clarify how the REST API works within the context of the Discord bot. Let me know if you have any further questions or need additional assistance.

---

### Contributing:
Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes.

### Issues:
If you encounter any issues or have suggestions, please open an issue on the GitHub repository.

### License:
This project is licensed under the MIT License - see the LICENSE file for details.
