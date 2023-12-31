
const clean = async (text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
}

const fs = require('fs');
const path = require("path");

module.exports.run = async (client, message, args) => {
    if(message.author.id != client.config.owner) return message.react('❌');
    try {
        const evaled = eval(args.join(" "));
  
        const cleaned = await clean(evaled);
  
        message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
      } catch (err) {
        clean(err).then((c)=>{

        message.channel.send(`\`ERROR\` \`\`\`xl\n${c}\n\`\`\``);
      });
      }
  
};

module.exports.help = {
    name: "eval",
    description: "Eval.",
    category: "kernel",
    owner: true
};

