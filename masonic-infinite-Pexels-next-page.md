### useInfiniteLoader(loadMoreItems, options?)

[](#useinfiniteloaderloadmoreitems-options)

A utility hook for seamlessly adding infinite scroll behavior to the [`useMasonry()`](#usemasonryoptions) hook and the components that use it. This hook invokes a callback each time the last rendered index surpasses the total number of items in your items array or the number defined in the `totalItems` option.

[Check out an example on **CodeSandbox**](https://codesandbox.io/s/useinfiniteloader-example-vn30p?file=/src/index.js)

import \* as React from "react";
import { Masonry, useInfiniteLoader } from "masonic";

const InfiniteMasonry \= (props) \=> {
  const \[items, setItems\] \= useState(\[
    /\* initial items \*/
  \]);
  const fetchMoreItems \= async (startIndex, stopIndex, currentItems) \=> {
    const nextItems \= await fetch(
      \`/api/get-more?after=${startIndex}&limit=${startIndex + stopIndex}\`
    );

    setItems((current) \=> \[...current, ...nextItems\]);
  };
  const maybeLoadMore \= useInfiniteLoader(fetchMoreItems, {
    isItemLoaded: (index, items) \=> !!items\[index\],
  });

  return <Masonry {...props} items\={items} onRender\={maybeLoadMore} />;
};

#### Arguments

[](#arguments-6)

Argument

Type

Description

loadMoreItems

`(startIndex: number, stopIndex: number, items: any[]) => any`

This callback is invoked when more rows must be loaded. It will be used to determine when to refresh the list with the newly-loaded data.

options

[`UseInfiniteLoaderOptions`](#useinfiniteloaderoptions)

Configuration object for your loader, see [`UseInfiniteLoaderOptions`](#useinfiniteloaderoptions) below.

#### UseInfiniteLoaderOptions

[](#useinfiniteloaderoptions)

Property

Type

Default

Description

isItemLoaded

`(index: number, items: any[]) => boolean`

`(index, items) => items[index] !== undefined`

A callback responsible for determining the loaded state of each item. Should return `true` if the item has already been loaded and `false` if not.

minimumBatchSize

`number`

`16`

The minimum number of new items to be loaded at a time. This property can be used to batch requests and reduce HTTP requests.

threshold

`number`

`16`

The threshold at which to pre-fetch data. A threshold X means that new data should start loading when a user scrolls within X cells of the end of your `items` array.

totalItems

`number`

`9E9`

The total number of items you'll need to eventually load (if known). This can be arbitrarily high if not known.

#### Returns `(startIndex: number, stopIndex: number, items: any[]) => any`

[](#returns-startindex-number-stopindex-number-items-any--any)

* * *

### createPositioner(columnCount, columnWidth, columnGutter, rowGutter)

[](#createpositionercolumncount-columnwidth-columngutter-rowgutter)

Creates a cell positioner for the `useMasonry()` hook. The `usePositioner()` hook uses this utility under the hood.

#### Arguments

[](#arguments-7)

Argument

Type

Description

columnCount

`number`

The number of columns in the grid

columnWidth

`number`

The width of each column in the grid

columnGutter

`number`

The amount of horizontal space between columns in pixels.

rowGutter

`number`

The amount of vertical space between cells within a column in pixels (falls back to `columnGutter`).

maxColumnCount

`number`

The upper bound of column count.

#### Returns [`Positioner`](#positioner)

[](#returns-positioner)

* * *

### createResizeObserver(positioner, updater)

[](#createresizeobserverpositioner-updater)

Creates a resize observer that forces updates to the grid cell positions when mutations are made to cells affecting their height.

#### Arguments

[](#arguments-8)

Argument

Type

Description

positioner

[`Positioner`](#positioner)

A cell positioner created by the [`usePositioner()`](#usepositioneroptions-deps) hook or the [`createPositioner()`](#createpositionercolumncount-columnwidth-columngutter-rowgutter) utility

updater

`(updates: number[]) => void`

A callback that fires whenever one or many cell heights change. Updates are provided to the callback in the form of a flat array: `[index, height, index, height, index, height, ...]`

#### Returns a [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

[](#returns-a-resizeobserver-1)

* * *

## CodeSandbox example: 

import React from "react";
import ReactDOM from "react-dom";
import useWindowScroll from "@react-hook/window-scroll";
import catNames from "cat-names";
import cats from "./cats";
import { styles } from "./theme";
import { Masonry, useInfiniteLoader } from "masonic";

const App = () => {
  const [items, setItems] = React.useState(getFakeItems);
  const maybeLoadMore = useInfiniteLoader(
    async (startIndex, stopIndex, currentItems) => {
      const nextItems = await getFakeItemsPromise(startIndex, stopIndex);
      setItems((current) => [...current, ...nextItems]);
    },
    {
      isItemLoaded: (index, items) => !!items[index],
      minimumBatchSize: 32,
      threshold: 3
    }
  );

  return (
    <main className={style("container")}>
      <div className={style("masonic")}>
        <Masonry
          onRender={maybeLoadMore}
          items={items}
          columnGutter={8}
          columnWidth={172}
          overscanBy={1.25}
          render={FakeCard}
        />
      </div>
      <Header />
    </main>
  );
};

const FakeCard = ({ data: { name, src } }) => (
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
const getFakeItems = (start = 0, end = 32) => {
  const fakeItems = [];
  for (let i = start; i < end; i++)
    fakeItems.push({ id: i, src: randomChoice(cats), name: catNames.random() });
  return fakeItems;
};

const getFakeItemsPromise = (start, end) =>
  Promise.resolve(getFakeItems(start, end));

ReactDOM.createRoot(document.getElementById("root")).render(<App />);


# Pexels Next page

# 📄 Pagination with Pexels API

This guide provides all necessary information to paginate through results when using the Pexels API.

---

## 🔗 Supported Endpoints with Pagination

The following Pexels API endpoints support pagination:

| Resource Type        | Endpoint URL Format                              |
| -------------------- | ------------------------------------------------ |
| Photo Search         | `https://api.pexels.com/v1/search`               |
| Curated Photos       | `https://api.pexels.com/v1/curated`              |
| Video Search         | `https://api.pexels.com/videos/search`           |
| Popular Videos       | `https://api.pexels.com/videos/popular`          |
| Featured Collections | `https://api.pexels.com/v1/collections/featured` |
| My Collections       | `https://api.pexels.com/v1/collections`          |
| Collection Media     | `https://api.pexels.com/v1/collections/:id`      |

Each of these endpoints returns pagination-related fields in the response.

---

## 📥 Response Fields for Pagination

Every paginated response from the Pexels API includes fields such as:

```json
{
  "page": 1,
  "per_page": 15,
  "total_results": 10000,
  "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=15",
  "prev_page": "https://api.pexels.com/v1/search/?page=1&per_page=15",
  "photos": [ ... ]
}
```

### Explanation:

* **page**: current page number
* **per\_page**: number of results per page (default 15, max 80)
* **total\_results**: total number of matching items
* **next\_page**: URL to the next page of results
* **prev\_page**: URL to the previous page (if applicable)

---

## 🚀 Making a Paginated API Call

### Basic Fetch Example in JavaScript:

```js
fetch('https://api.pexels.com/v1/search?query=nature&per_page=15', {
  headers: {
    Authorization: 'YOUR_API_KEY'
  }
})
.then(res => res.json())
.then(data => {
  console.log('Current Page:', data.page);
  console.log('Next Page URL:', data.next_page);

  if (data.next_page) {
    fetch(data.next_page, {
      headers: {
        Authorization: 'YOUR_API_KEY'
      }
    })
    .then(res => res.json())
    .then(nextData => {
      console.log('Next Page Results:', nextData.photos);
    });
  }
});
```

> 📌 You must replace `'YOUR_API_KEY'` with your actual Pexels API key.

---

## 🔁 Full Loop Example (Paginate All Pages)

```js
import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

async function fetchAllPages(query) {
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await client.photos.search({ query, page, per_page: 15 });
    console.log(`Page ${page} Results:`, response.photos);

    if (response.next_page) {
      page += 1;
    } else {
      hasNext = false;
    }
  }
}

fetchAllPages('nature');
```

---

## 📘 Notes & Best Practices

* Use the `next_page` value provided instead of manually building URLs.
* Set `per_page` between 1 and 80 to control result size.
* Check your rate limit headers (`X-Ratelimit-Remaining`).
* Always handle the last page case where `next_page` is `null` or missing.

---

## ✅ Summary

1. Request the first page using any paginated endpoint.
2. Use `next_page` from the response to get the following page.
3. Repeat until `next_page` is no longer returned.

This strategy allows you to dynamically load and append results to your interface or database as needed.
