# P4nth3rDrop!
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

_Because everyone needs an interactive Twitch game, right?_

## Chat Commands

```
- !rain
- !shower
- !snow
- !hail
- !blizzard

- !drop me
- !drop {emotes}
- !bigdrop {emotes}

// broadcaster only
- !start-trail
- !end-trail
```

## Events

### Raids

On a raid, `n` panthers from the emote selection (where `n` is the number of raiders) will be randomly selected with a random size and will rain down with a multiplier of 1.

### Cheers

On a cheer, `n` panthers from the emote selection (where `n` is the number of bits cheered) will be randomly selected with a random size and will rain down with a multiplier of 1.

---

## Want to use P4nth3rDrop?

### 1. Fork the repo

### 2. Change the `broadcaster` property in `config.js` to your own channel name

```javascript
/// config.js

export default {
  broadcaster: 'your_channel_name',
  ...
}
```

### 3. Create a new Twitch application (or use an existing) in the developer console and grab your Client ID

### 4. Create a .env file in the root (it has been added to .gitignore so won't show up in version history)

```bash
cd /path/to/repo
touch .env
```

### 4. Add the following to the `.env` file

```javascript
REACT_APP_CLIENT_ID: your_twitch_client_id;
```

### 5. When deploying this application, make sure to add the `REACT_APP_CLIENT_ID` environment variable to the production environment.

---

Thank you Coding Garden for the inspiration and start up code!

Inspo repo: `https://github.com/CodingGarden/SeedlingDropV2-RevengeOfTheNewts`

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://rhg.dev"><img src="https://avatars1.githubusercontent.com/u/6187256?v=4" width="100px;" alt=""/><br /><sub><b>Ryan Haskell-Glatz</b></sub></a><br /><a href="https://github.com/whitep4nth3r/p4nth3rdrop/commits?author=ryannhg" title="Code">💻</a></td>
    <td align="center"><a href="http://lucecarter.co.uk"><img src="https://avatars2.githubusercontent.com/u/6980734?v=4" width="100px;" alt=""/><br /><sub><b>Luce Carter</b></sub></a><br /><a href="#ideas-LuceCarter" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!