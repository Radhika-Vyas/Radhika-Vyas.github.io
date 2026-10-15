# radhika-vyas.github.io

Personal site of Radhika Vyas: public health researcher, writer, photographer, and DJ (Kodiak Kortex).

Live at **https://radhika-vyas.github.io**

## What's in here

| File | Page |
| --- | --- |
| `index.html` | Home |
| `research.html` | The Lab Notebook (research) |
| `words-and-pictures.html` | The Field Journal + Faces & Places gallery |
| `crates.html` | The Crates (Kodiak Kortex playlists) |
| `404.html` | "Lost in the woods" page |
| `assets/css/style.css` | All the styling (colors live at the top) |
| `assets/js/main.js` | Evolve button, photo viewer, turntable + Spotify |
| `assets/img/` | Photos and the bear icon |

## Quick edits

- **Add a photo:** drop a JPG (about 1600px wide) into `assets/img/`, then copy one `<figure class="photo">…</figure>` line in `words-and-pictures.html` and change the file name, caption and description. Use `data-kind="portrait"` or `data-kind="place"`.
- **Add a playlist:** in `crates.html`, copy one `<div class="slot">…</div>` block and change `data-id` (the code after `/playlist/` in the Spotify link), the title, tags and Vol. number. `art-1` to `art-4` pick the sleeve pattern.
- **Update "Currently":** edit the four lines near the bottom of `index.html`.
