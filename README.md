# P4nth3rDrop!

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

_An interactive panther-based drop game for your stream overlay._

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

# Events

### Raids

On a raid, `n` panthers from the emote selection (where `n` is the number of raiders) will be randomly selected with a random size and will rain down with a multiplier of 1.

### Cheers

On a cheer, `n` panthers from the emote selection (where `n` is the number of bits cheered) will be randomly selected with a random size and will rain down with a multiplier of 1.

---

## P4nth3rDrop receives events from the [p4nth3rb0t-mainframe](https://github.com/whitep4nth3r/p4nth3rb0t-mainframe)

## To use P4nth3rDrop you will also need to use your own application that pushes events from twitch via websockets, or use the mainframe as well

### 1. Fork the repo

### 2. Create a .env file in the root (it has been added to .gitignore so won't show up in version history)

```bash
cd /path/to/repo
touch .env
```

### 3. Add the following to the `.env` file

```javascript
REACT_APP_MAINFRAME_WEBSOCKET: your_websocket_address;
```

### 4. When deploying this application, make sure to add the `REACT_APP_MAINFRAME_WEBSOCKET` environment variable to the production environment.

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
    <td align="center"><a href="https://twitch.tv/rawwwrs"><img src="https://avatars1.githubusercontent.com/u/12928252?v=4" width="100px;" alt=""/><br /><sub><b>isabellabrookes</b></sub></a><br /><a href="#ideas-isabellabrookes" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/whitep4nth3r/p4nth3rdrop/commits?author=isabellabrookes" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/gigili"><img src="https://avatars0.githubusercontent.com/u/2153382?v=4" width="100px;" alt=""/><br /><sub><b>Igor Ilic</b></sub></a><br /><a href="#ideas-gigili" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/whitep4nth3r/p4nth3rdrop/commits?author=gigili" title="Code">💻</a></td>
    <td align="center"><a href="http://www.akr.is"><img src="https://avatars2.githubusercontent.com/u/5489879?v=4" width="100px;" alt=""/><br /><sub><b>Anton Kristensen</b></sub></a><br /><a href="https://github.com/whitep4nth3r/p4nth3rdrop/commits?author=antonedvard" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
