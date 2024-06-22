# Minecraft-Discord-Bot

## What does it do?
This Discord bot, built on discord.js v14, facilitates sending Minecraft account details to users upon request.

## How are the accounts processed?
Accounts should be entered into the `accounts.txt` file using the format `mail : password`.

## Features:
- **Slash Command:** `/gen type: Minecraft` to request an account.
- **Events and Error Handling:** Implemented to ensure smooth operation.
- **No Repeated Accounts:** Each account is removed from `accounts.txt` after redemption.
- **Vouch Button:** Included in DMs for user feedback.

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
   
3. **Configure `accounts.txt`:**
   Add Minecraft accounts in the format `mail : password`.

4. **Start the Bot:**
   ```
   node index.js
   ```
   
5. **Usage:**
   - Invite the bot to your Discord server.
   - Use `/generate type: Minecraft` to receive an account.

### Contributing:
Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes.

### Issues:
If you encounter any issues or have suggestions, please open an issue on the GitHub repository.

### License:
This project is licensed under the MIT License - see the LICENSE file for details.
