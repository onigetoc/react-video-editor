At the place where the video thumbnails appear, I want to use a Reac Masonry library. To start, I want to test it in the video section on the left in import. And I want to see if it works when you add and remove elements and if the scroll adapts.

We must install via NPM and also an example code but this code is only an example because in import The list is not imported like this, the code is already done. :
code example: 

import * as React from "react";
import { Masonry } from "masonic";

let i = 0;
const items = Array.from(Array(5000), () => ({ id: i++ }));

const EasyMasonryComponent = (props) => (
  <Masonry items={items} render={MasonryCard} />
);

const MasonryCard = ({ index, data: { id }, width }) => (
  <div>
    <div>Index: {index}</div>
    <pre>ID: {id}</pre>
    <div>Column width: {width}</div>
  </div>
);

For the moment, in terms of the width of the thumbnails, I only want two wide. And I know that by default it would probably be one in relation to the code, but I want two  thumb wide. Like at this moment.

Here comes an example on Dropbox. And what I like is that I would like to display the name of the file below, a little in the same way. And we have to make an ellipse, like three little dots, because the text or the name of the media will often be too long. I want it on one line only.

import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  // Constructs the data for our grid items
  const [items] = React.useState(() =>
    Array.from(Array(5000), () => ({
      id: i++,
      name: catNames.random(),
      src: randomChoice(cats)
    }))
  );

  return (
    <main className={style("container")}>
      <div className={style("masonic")}>
        <Masonry
          // Provides the data for our grid items
          items={items}
          // Adds 8px of space between the grid cells
          columnGutter={8}
          // Sets the minimum column width to 172px
          columnWidth={172}
          // Pre-renders 5 windows worth of content
          overscanBy={5}
          // This is the grid item component
          render={FakeCard}
        />
      </div>
      <Header />
    </main>
  );
};

const FakeCard = ({ data: { id, name, src } }) => (
  <div className={style("card")}>
    <img className={style("img")} alt="kitty" src={src} />
    <span children={name} />
  </div>
);

const Header = () => {
  const scrollY = useWindowScroll(5);
  return (
    <h1 className={style("header", scrollY > 64 && "minify")}>
      <span role="img" aria-label="bricks">
        🧱
      </span>{" "}
      MASONIC
    </h1>
  );
};


const randomChoice = (items) => items[Math.floor(Math.random() * items.length)];
let i = 0;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

I absolutely want to keep the style that I already have and that I like very much. The goal is just to add masonry paintings so that it is perfectly imbricated But I want the style to be similar to what I already had, with the little right icon and all. Whether it's audio, video or anything else.



I want all of this to be very simple. That it has the same appearance, the style that there was before. Except that it becomes very well embedded in each other because of the script. As I said, I repeat, I only want it in import for the moment to test before inserting it into other windows of images and audio etc. and video but for the moment just import tag from the left panel 
There are possibly other files associated with my code and you absolutely must not add other codes that already exist somewhere in my project.

tu as commencer le projet ici mais le AI a planter sans finir le travail et masonic a déjà été installer, donc demande pas de l'installer a nouveau.

tu avais déjà écrit un plan d'intégration @/plan-integration-masonic.md