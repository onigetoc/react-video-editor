TITLE: Installing Masonic React Component Library
DESCRIPTION: This command installs the masonic package from npm, making the component library available for use in your project. It is the required first step to integrate masonic into a React application.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/docs/v2.md#_snippet_0

LANGUAGE: shell
CODE:
```
npm i masonic
```

----------------------------------------

TITLE: Basic Masonry Grid React Component Usage
DESCRIPTION: This snippet demonstrates how to create a simple virtualized masonry grid using the <Masonry> component. It imports the component, prepares an array of items, and defines a functional React component that renders the <Masonry> grid using the items and a custom render function for each item. Requires React and the installed masonic library.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/docs/v2.md#_snippet_1

LANGUAGE: jsx
CODE:
```
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
```

----------------------------------------

TITLE: Implementing Basic Masonry Grid in React
DESCRIPTION: This snippet demonstrates the basic usage of the `<Masonry>` component from the `masonic` library. It shows how to import the component, prepare a simple array of items, and define a render function (`MasonryCard`) that receives item data and properties like index and width to display content within each grid cell.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_0

LANGUAGE: jsx
CODE:
```
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
```

----------------------------------------

TITLE: Rendering Masonry Component with Basic Props in JSX
DESCRIPTION: This snippet demonstrates the basic usage of the <Masonry> component from the 'masonic' library. It shows how to import the component, define an array of items, and render the grid using the 'items' prop and a 'render' prop that specifies how each item is displayed. Dependencies include React and the masonic library.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_1

LANGUAGE: jsx
CODE:
```
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
```

----------------------------------------

TITLE: Implementing useMasonry React Hook with Dependencies
DESCRIPTION: This React functional component demonstrates how to use the `useMasonry` hook by integrating it with `useWindowSize`, `useContainerPosition`, and `useScroller`. It sets up the necessary parameters like container reference, window size, scroll position, and positioner to render a dynamic masonry layout.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_4

LANGUAGE: jsx
CODE:
```
import * as React from "react";
import { useWindowSize } from "@react-hook/window-size";
import {
  useMasonry,
  usePositioner,
  useContainerPosition,
  useScroller,
} from "masonic";

const MyMasonry = (props) => {
  const containerRef = React.useRef(null);
  const [windowWidth, height] = useWindowSize();
  const { offset, width } = useContainerPosition(containerRef, [
    windowWidth,
    height,
  ]);
  const { scrollTop, isScrolling } = useScroller(offset);
  const positioner = usePositioner({ width });

  return useMasonry({
    positioner,
    scrollTop,
    isScrolling,
    height,
    containerRef,
    ...props,
  });
};
```

----------------------------------------

TITLE: Implementing MasonryScroller with React Hooks (jsx)
DESCRIPTION: This snippet demonstrates how to use the <MasonryScroller> component in conjunction with React hooks (`usePositioner`, `useContainerPosition`, `useWindowSize`) to create a virtualized masonry layout that responds to window scroll and resize events. It sets up necessary refs and calculates container position and window dimensions to pass to the component.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_2

LANGUAGE: jsx
CODE:
```
import * as React from "react";
import { MasonryScroller, usePositioner, useContainerPosition } from "masonic";
import { useWindowSize } from "@react-hook/window-size";

const MyMasonry = (props) => {
  const containerRef = React.useRef(null);
  const [windowWidth, windowHeight] = useWindowSize();
  const { offset, width } = useContainerPosition(containerRef, [
    windowWidth,
    windowHeight,
  ]);
  const positioner = usePositioner({ width, columnWidth: 320 });

  return (
    <MasonryScroller
      positioner={positioner}
      // The distance in px between the top of the document and the top of the
      // masonry grid container
      offset={offset}
      // The height of the virtualization window
      height={windowHeight}
      // Forwards the ref to the masonry container element
      containerRef={containerRef}
      {...props}
    />
  );
};

```

----------------------------------------

TITLE: Implementing Masonry with Scrolling and Positioning (React/Masonic)
DESCRIPTION: Demonstrates how to integrate the `useScroller` hook with other masonic hooks like `useContainerPosition`, `usePositioner`, and `useMasonry` within a React component. It shows how to use a ref for the container, get container dimensions and offset, track scroll state, and pass these values to the main `useMasonry` hook to render a scrollable, positioned grid.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_7

LANGUAGE: jsx harmony
CODE:
```
import * as React from "react";
import { useMasonry, usePositioner, useScroller } from "masonic";

const MyMasonry = (props) => {
  const containerRef = React.useRef(null);
  const { offset, width } = useContainerPosition(containerRef);
  const positioner = usePositioner({ width });
  const { scrollTop, isScrolling } = useScroller(offset);

  return useMasonry({
    ...props,
    containerRef,
    positioner,
    scrollTop,
    isScrolling,
  });
};
```

----------------------------------------

TITLE: Implementing Infinite Scrolling with useInfiniteLoader in JSX
DESCRIPTION: Demonstrates how to integrate infinite scrolling into a Masonry grid using the useInfiniteLoader hook. It shows fetching data via fetchMoreItems and attaching the loader's callback to the <Masonry> component's onRender prop. Requires memoization for the fetch function to prevent duplicate calls.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/docs/v2.md#_snippet_2

LANGUAGE: jsx
CODE:
```
import { Masonry, useInfiniteLoader } from "masonic";
import memoize from "trie-memoize";

const fetchMoreItems = memoize(
  [{}, {}, {}],
  (startIndex, stopIndex, currentItems) =>
    fetch(
      `/api/get-more?after=${startIndex}&limit=${startIndex + stopIndex}`
    ).then((items) => {
      // do something to add the new items to your state
    })
);

const InfiniteMasonry = (props) => {
  const maybeLoadMore = useInfiniteLoader(fetchMoreItems);
  const items = useItemsFromInfiniteLoader();
  return <Masonry {...props} items={items} onRender={maybeLoadMore} />;
};
```

----------------------------------------

TITLE: Integrating Infinite Scroll with Masonry - React JSX
DESCRIPTION: This snippet demonstrates integrating infinite scroll functionality with the `masonic` `Masonry` component using the `useInfiniteLoader` hook. It initializes component state with an empty array, defines an asynchronous function to fetch more items from an API based on index range, and uses `useInfiniteLoader` to manage loading logic, passing the fetched items to the `Masonry` component.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_12

LANGUAGE: jsx harmony
CODE:
```
import * as React from "react";
import { Masonry, useInfiniteLoader } from "masonic";

const InfiniteMasonry = (props) => {
  const [items, setItems] = useState([
    /* initial items */
  ]);
  const fetchMoreItems = async (startIndex, stopIndex, currentItems) => {
    const nextItems = await fetch(
      `/api/get-more?after=${startIndex}&limit=${startIndex + stopIndex}`
    );

    setItems((current) => [...current, ...nextItems]);
  };
  const maybeLoadMore = useInfiniteLoader(fetchMoreItems, {
    isItemLoaded: (index, items) => !!items[index],
  });

  return <Masonry {...props} items={items} onRender={maybeLoadMore} />;
};
```

----------------------------------------

TITLE: Measuring Container Position and Size for Masonry (React/Masonic)
DESCRIPTION: Illustrates the usage of the `useContainerPosition` hook to obtain the width and vertical offset of the grid container element. It demonstrates how to pass a React ref to the hook and provide dependencies (like window size from `useWindowSize`) to trigger recalculations when the container's position or size might change, preparing data for the `MasonryScroller` component.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_8

LANGUAGE: jsx harmony
CODE:
```
import * as React from "react";
import { useWindowSize } from "@react-hook/window-size";
import { useContainerPosition, MasonryScroller } from "masonic";

const MyMasonry = (props) => {
  const containerRef = React.useRef(null);
  const [windowWidth, windowHeight] = useWindowSize();
  const { offset, width } = useContainerPosition(
    containerRef,
    // In this example, we want to recalculate the `offset` and `width`
    // any time the size of the window changes
    [windowWidth, windowHeight]
  );

  return (
    <MasonryScroller
      width={width}
      height={windowHeight}
      containerRef={containerRef}
      {...props}
    />
  );
};
```

----------------------------------------

TITLE: Creating Masonry Grid Positioner using Masonic usePositioner React Hook
DESCRIPTION: This React functional component demonstrates initializing and using the `usePositioner` hook from the `masonic` library. It first obtains the container's width and offset using `useContainerPosition`, then uses these values along with configurable column width and gutter to create a `positioner` object, which is passed to the `MasonryScroller` component to handle rendering the virtualized list.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_5

LANGUAGE: jsx harmony
CODE:
```
import * as React from "react";
import { usePositioner, useContainerPosition, MasonryScroller } from "masonic";

const MyMasonry = ({ columnWidth = 300, columnGutter = 16, ...props }) => {
  const { width, offset } = useContainerPosition();
  const positioner = usePositioner({ width, columnWidth, columnGutter });
  return <MasonryScroller positioner={positioner} offset={offset} {...props} />;
};
```

----------------------------------------

TITLE: Creating Responsive Masonry with useWindowScroller and useContainerRect in JSX
DESCRIPTION: Illustrates building a custom Masonry component that adapts to window size and scroll position using the useWindowScroller and useContainerRect hooks. The retrieved dimensions and scroll values are then passed as props to a <FreeMasonry> component.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/docs/v2.md#_snippet_3

LANGUAGE: jsx
CODE:
```
import React from "react";
import { FreeMasonry, useWindowScroller, useContainerRect } from "masonic";

const MyCustomMasonry = (props) => {
  const { width, height, scrollY, isScrolling } = useWindowScroller(),
    [rect, containerRef] = useContainerRect(width, height);

  return React.createElement(
    FreeMasonry,
    Object.assign(
      {
        width: rect.width,
        height,
        scrollTop: Math.max(0, scrollY - (rect.top + scrollY)),
        isScrolling,
        containerRef,
      },
      props
    )
  );
};
```

----------------------------------------

TITLE: Implementing Custom Masonry with Hooks (JSX Harmony)
DESCRIPTION: Demonstrates how to create a custom React component that wraps the `FreeMasonry` component, utilizing the `useWindowScroller` and `useContainerRect` hooks. It retrieves window and container dimensions/scroll state to correctly configure the `FreeMasonry` instance.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/docs/v2.md#_snippet_6

LANGUAGE: jsx harmony
CODE:
```
import React from "react";
import { FreeMasonry, useWindowScroller, useContainerRect } from "masonic";

const MyCustomMasonry = (props) => {
  const { width, height, scrollY, isScrolling } = useWindowScroller(),
    [rect, containerRef] = useContainerRect(width, height);

  return React.createElement(
    FreeMasonry,
    Object.assign(
      {
        width: rect.width,
        height,
        scrollTop: Math.max(0, scrollY - (rect.top + scrollY)),
        isScrolling,
        containerRef,
      },
      props
    )
  );
};
```

----------------------------------------

TITLE: Scrolling to Index in Masonry Grid (React/Masonic)
DESCRIPTION: Shows how to use the `useScrollToIndex` hook, which provides a callback function to programmatically scroll the masonry grid to a specific item index. The example integrates this hook with others (`useMasonry`, `usePositioner`, etc.) and uses `React.useEffect` to trigger the scroll action when a hypothetical `scrollToIndex` prop changes.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_10

LANGUAGE: jsx harmony
CODE:
```
import * as React from "react";
import {
  useMasonry,
  usePositioner,
  useContainerPosition,
  useScroller,
  useScrollToIndex,
} from "masonic";

const MyMasonry = (props) => {
  const containerRef = React.useRef(null);
  const { offset, width } = useContainerPosition(containerRef);
  const { scrollTop, isScrolling } = useScroller(offset);
  const positioner = usePositioner({ width });
  const scrollToIndex = useScrollToIndex(positioner);

  React.useEffect(() => {
    if (props.scrollToIndex) {
      scrollToIndex(props.scrollToIndex);
    }
  }, [props.scrollToIndex, scrollToIndex]);

  return useMasonry({
    ...props,
    containerRef,
    positioner,
    scrollTop,
    isScrolling,
  });
};
```

----------------------------------------

TITLE: Observing Cell Resizes in Masonry Grid (React/Masonic)
DESCRIPTION: Demonstrates the usage of the `useResizeObserver` hook to detect changes in the dimensions of individual grid cells. This hook is provided with the `positioner` instance and helps ensure that the masonry layout updates correctly when the content within cells causes them to resize, maintaining the grid's integrity.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_11

LANGUAGE: jsx harmony
CODE:
```
import * as React from "react";
import { useMasonry, usePositioner, useResizeObserver } from "masonic";

const MyMasonry = (props) => {
  const positioner = usePositioner({ width: 1024 });
  const resizeObserver = useResizeObserver(positioner);

  return useMasonry({
    positioner,
    resizeObserver,
    scrollTop,
    isScrolling,
    height,
    ...props,
  });
};
```

----------------------------------------

TITLE: Implementing List Component with Render Prop (jsx)
DESCRIPTION: This example illustrates how to use the <List> component, which is a single-column virtualized list built on top of <Masonry>. It shows how to provide an array of items and define a render prop component (`ListCard`) that receives item data, index, and width to render each list item.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_3

LANGUAGE: jsx
CODE:
```
import * as React from "react";
import { List } from "masonic";

let i = 0;
const items = Array.from(Array(5000), () => ({ id: i++ }));

const EasyListComponent = (props) => (
  <List items={items} rowGutter={32} render={ListCard} />
);

const ListCard = ({ index, data: { id }, width }) => (
  <div>
    <div>Index: {index}</div>
    <pre>ID: {id}</pre>
    <div>Column width: {width}</div>
  </div>
);

```

----------------------------------------

TITLE: Defining Masonic Grid Positioner and Item Interfaces in TypeScript
DESCRIPTION: This TypeScript code defines the interfaces for the `Positioner` object returned by `usePositioner` and the `PositionerItem` objects representing individual cell positions. The `Positioner` interface specifies methods for layout management (set, get, update, range, size, estimateHeight, shortestColumn, all) and properties for column dimensions. The `PositionerItem` interface defines the position (top, left), height, and column of a grid cell.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_6

LANGUAGE: typescript
CODE:
```
export interface Positioner {
  /**
   * The number of columns in the grid
   */
  columnCount: number;
  /**
   * The width of each column in the grid
   */
  columnWidth: number;
  /**
   * Sets the position for the cell at `index` based upon the cell's height
   */
  set: (index: number, height: number) => void;
  /**
   * Gets the `PositionerItem` for the cell at `index`
   */
  get: (index: number) => PositionerItem | undefined;
  /**
   * Updates cells based on their indexes and heights
   * positioner.update([index, height, index, height, index, height...])
   */
  update: (updates: number[]) => void;
  /**
   * Searches the interval tree for grid cells with a `top` value in
   * betwen `lo` and `hi` and invokes the callback for each item that
   * is discovered
   */
  range: (
    lo: number,
    hi: number,
    renderCallback: (index: number, left: number, top: number) => void
  ) => void;
  /**
   * Returns the number of grid cells in the cache
   */
  size: () => number;
  /**
   * Estimates the total height of the grid
   */
  estimateHeight: (itemCount: number, defaultItemHeight: number) => number;
  /**
   * Returns the height of the shortest column in the grid
   */
  shortestColumn: () => number;
  /**
   * Returns all `PositionerItem` items
   */
  all: () => PositionerItem[];
}

export interface PositionerItem {
  /**
   * This is how far from the top edge of the grid container in pixels the
   * item is placed
   */
  top: number;
  /**
   * This is how far from the left edge of the grid container in pixels the
   * item is placed
   */
  left: number;
  /**
   * This is the height of the grid cell
   */
  height: number;
  /**
   * This is the column number containing the grid cell
   */
  column: number;
}
```

----------------------------------------

TITLE: Defining ContainerPosition Interface (TypeScript)
DESCRIPTION: Defines the TypeScript interface for the object returned by the `useContainerPosition` hook. It specifies the required properties: `offset`, representing the distance from the top of the document to the container, and `width`, representing the `offsetWidth` of the container element.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/README.md#_snippet_9

LANGUAGE: typescript
CODE:
```
export interface ContainerPosition {
  /**
   * The distance in pixels between the top of the element in `elementRef` and the top of
   * the `document.documentElement`.
   */
  offset: number;
  /**
   * The `offsetWidth` of the element in `elementRef`.
   */
  width: number;
}
```

----------------------------------------

TITLE: Defining WindowScrollerResult Interface (TypeScript)
DESCRIPTION: Defines the TypeScript interface for WindowScrollerResult, outlining the properties returned by a window scroller mechanism. This includes the window's width, height, vertical scroll position (scrollY), and a boolean indicating if the window is currently being scrolled.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/docs/v2.md#_snippet_5

LANGUAGE: typescript
CODE:
```
interface WindowScrollerResult {
  // The width of the browser window
  width: number;
  // The height of the browser window
  height: number;
  // The scroll position of the window on its y-axis
  scrollY: number;
  // Is the window currently being scrolled?
  isScrolling: boolean;
}
```

----------------------------------------

TITLE: Defining WindowScrollerOptions Interface (TypeScript)
DESCRIPTION: Defines the TypeScript interface for WindowScrollerOptions, specifying configuration options for window scrolling behavior. Includes settings for debouncing size updates (`wait`) and controlling the update rate for scroll position (`fps`), along with their default values.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/docs/v2.md#_snippet_4

LANGUAGE: typescript
CODE:
```
interface WindowScrollerOptions {
  size?: {
    // Debounces for this amount of time in ms
    // before updating the size of the window
    // in state
    //
    // Defaults to: 120
    wait?: number;
  };
  scroll?: {
    // The rate in frames per second to update
    // the state of the scroll position
    //
    // Defaults to: 8
    fps?: number;
  };
}
```

----------------------------------------

TITLE: Installing and Starting Masonic Dev Mode (sh)
DESCRIPTION: Provides the necessary shell commands to navigate into the project directory, install dependencies using pnpm, and start the development server in watch mode. This setup is required to begin development on the project. It assumes pnpm is installed and accessible in the system's PATH.
SOURCE: https://github.com/jaredlunde/masonic/blob/main/CONTRIBUTING.md#_snippet_0

LANGUAGE: sh
CODE:
```
# Install the repo using pnpm
cd masonic
pnpm install
# Start dev mode
pnpm dev
```