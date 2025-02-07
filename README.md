# Mindcraft 🧠⛏️

Crafting minds for Minecraft with LLMs and Mineflayer!

## This is a repo with a deprecated version of Mindcraft, specifically to allow Andy-3.5 to play safely, and with certain stability.

[Discord Support](https://discord.gg/mp73p35dzC) | [Andy-3.5 Support (developers only)](https://ptb.discord.com/channels/1303399789995626667/1307448366833340508)


#### ‼️Warning‼️

Do not connect this bot to public servers with coding enabled. This project allows an LLM to write/execute code on your computer. While the code is sandboxed, it is still vulnerable to injection attacks on public servers. Code writing is disabled by default, you can enable it by setting `allow_insecure_coding` to `true` in `settings.js`. We strongly recommend running with additional layers of security such as docker containers. Ye be warned.

## Requirements

- [Minecraft Java Edition](https://www.minecraft.net/en-us/store/minecraft-java-bedrock-edition-pc) (up to v1.21.1, recommend v1.20.4)
- [Node.js Installed](https://nodejs.org/) (at least v14)
- Ollama installed (For Andy-3.5)

## Install and Run

1. Make sure you have the requirements above.

2. Clone or download this repository (big green button)

3. Rename `keys.example.json` to `keys.json` and fill in your API keys (you only need one). The desired model is set in `andy.json` or other profiles. For other models refer to the table below.

4. In terminal/command prompt, run `npm install` from the installed directory

5. Start a minecraft world and open it to LAN on localhost port `55916`

6. Run `node main.js` from the installed directory

If you encounter issues, check the [FAQ](https://github.com/kolbytn/mindcraft/blob/main/FAQ.md) or find support on [discord](https://discord.gg/jVxQWVTM). We are currently not very responsive to github issues.

## Customization

You can configure project details in `settings.js`. [See file.](settings.js)

You can configure the agent's name, model, and prompts in their profile like `andy.json`.

| Name | Quantization | Full model name with example quantization | Huggingface Link |
|------|------|------|------|
| Andy-3.5 | `F16, Q8_0, Q4_K_M, Q2_K` | `Andy-3.5.Q4_K_M` | [Model](https://huggingface.co/Sweaterdog/Andy-3.5/tree/main) |
| Andy-3.5-mini | `F16, Q8_0, Q4_K_M, Q2_K` | `Andy-3.5-mini.Q8_0.gguf` | [Model](https://huggingface.co/Sweaterdog/Andy-3.5/tree/main/Mini) |
| Andy-3.5-small | `F16, Q8_0, Q4_K_M, Q2_K` | `Andy-3.5-small.Q8_0.gguf` | [Model](https://huggingface.co/Sweaterdog/Andy-3.5/tree/main/small) |
| Andy-3.5-reasoning-preview | `F16, Q8_0, Q4_K_M, Q2_K` | `Andy-3.5-reasoning-preview.Q4_K_M` | [Model](https://huggingface.co/Sweaterdog/Andy-3.5/tree/main/reasoning) |
| Andy-3.5-small-reasoning-preview | `F16, Q8_0, Q4_K_M, Q2_K` | `Andy-3.5-small-reasoning-preview.Q8_0.gguf` | [Model](https://huggingface.co/Sweaterdog/Andy-3.5/tree/main/small-reasoning) |
| Andy-3.5-teensy | `F16` | `Andy-3.5-teensy.16.gguf` | [Model](https://huggingface.co/Sweaterdog/Andy-3.5/blob/main/Mini/Andy-3.5-teensy.F16.gguf) |

If you use Ollama, you need to specify what Andy-3.5 model you will be using, by default, the model you pull will be Andy-3.5.q4_k_m.gguf:
`ollama pull llama3 && ollama pull nomic-embed-text`
> NOTE
> I recommend using Huggingface over Ollama, as I am able to provide more models on Huggingface, and you are allowed to fully customize Andy-3.5
> If you want an easy install, or want the stock model, you can still go to [huggingface](https://huggingface.co/Sweaterdog/Andy-3.5) and find an installation and setup guide for Andy-3.5

## Online Servers
To connect to online servers your bot will need an official Microsoft/Minecraft account. You can use your own personal one, but will need another account if you want to connect too and play with it. To connect, change these lines in `settings.js`:
```javascript
"host": "111.222.333.444",
"port": 55920,
"auth": "microsoft",

// rest is same...
```
‼️ The bot's name in the profile.json must exactly match the Minecraft profile name! Otherwise the bot will spam talk to itself.

To use different accounts, Mindcraft will connect with the account that the Minecraft launcher is currently using. You can switch accounts in the launcer, then run `node main.js`, then switch to your main account after the bot has connected.

### Docker Container

If you intend to `allow_insecure_coding`, it is a good idea to run the app in a docker container to reduce risks of running unknown code. This is strongly recommended before connecting to remote servers.

```bash
docker run -i -t --rm -v $(pwd):/app -w /app -p 3000-3003:3000-3003 node:latest node main.js
```
or simply
```bash
docker-compose up
```

When running in docker, if you want the bot to join your local minecraft server, you have to use a special host address `host.docker.internal` to call your localhost from inside your docker container. Put this into your [settings.js](settings.js):

```javascript
"host": "host.docker.internal", // instead of "localhost", to join your local minecraft from inside the docker container
```

To connect to an unsupported minecraft version, you can try to use [viaproxy](services/viaproxy/README.md)

## Bot Profiles

Bot profiles are json files (such as `andy.json`) that define:

1. Bot backend LLMs to use for chat and embeddings.
2. Prompts used to influence the bot's behavior.
3. Examples help the bot perform tasks.

### Specifying Profiles via Command Line

By default, the program will use the profiles specified in `settings.js`. You can specify one or more agent profiles using the `--profiles` argument:

```bash
node main.js --profiles ./profiles/andy.json ./profiles/jill.json
```

### Model Specifications

LLM backends can be specified as simply as `"model": "sweaterdog/Andy-3.5-small"`. However, for both the chat model and the embedding model, the bot profile can specify the below attributes:

```json
"model": {
  "model": "sweaterdog/Andy-3.5-small"
  "api": "ollama",
  "url": "http://localhost:11434",
  "embedding": "nomic-embed-text"
}
```

The model parameter accepts either a string or object. If a string, it should specify the model to be used. The api and url will be assumed. If an object, the api field must be specified. Each api has a default model and url, so those fields are optional.

If the embedding field is not specified, then it will use the default embedding method for the chat model's api. The embedding parameter can also be a string or object. If a string, it should specify the embedding api and the default model and url will be used. If a valid embedding is not specified and cannot be assumed, then word overlap will be used to retrieve examples instead.

Thus, all the below specifications are equivalent to the above example:

```json
"model": "sweaterdog/Andy-3.5-reasoning"
```
```json
"model": {
  "api": "openai"
}
```
```json
"model": "gpt-3.5-turbo",
"embedding": "openai"
```

## Patches

Some of the node modules that we depend on have bugs in them. To add a patch, change your local node module file and run `npx patch-package [package-name]`

## Citation:

```
@misc{mindcraft2023,
    Author = {Kolby Nottingham and Max Robinson},
    Title = {MINDcraft: LLM Agents for cooperation, competition, and creativity in Minecraft},
    Year = {2023},
    url={https://github.com/kolbytn/mindcraft}
}
```
```
Edited by Sweaterdog to allow an easy guide for Andy-3.5 models in Mindcraft
```
