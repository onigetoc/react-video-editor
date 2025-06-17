  <Player> | Remotion | Make videos programmatically

[Skip to main content](#__docusaurus_skipToContent_fallback)

[

![Remotion Logo](/img/new-logo.png)

](/)[Docs](/docs/)[API](/docs/api)

[Products](#)

*   [Player](/player)
*   [Lambda](/lambda)
*   [Media Parser](/docs/media-parser)
*   [WebCodecs](/docs/webcodecs)
*   [Recorder](/docs/recorder)
*   [Timeline](/docs/timeline)

[Resources](#)

*   [Learn](/learn)
*   [Resources](/docs/resources)
*   [Blog](/blog)
*   [Showcase](/showcase)
*   [Convert a video](https://convert.remotion.dev)
*   [Support](/docs/support)

[Commercial](#)

*   [License + Pricing](https://remotion.pro/license)
*   [Store](https://remotion.pro/store)
*   [Success Stories](/success-stories)
*   [Experts](/experts)
*   [About us](/about)
*   [Investors](/docs/investors)
*   [Contact us](/contact)

[](https://github.com/remotion-dev/remotion)[](https://remotion.dev/discord)[](https://x.com/remotion)

SearchK

*   [API overview](/docs/api)
*   [Command line](/docs/cli/)
    
*   [Configuration file](/docs/config)
*   * * *
    
*   [remotion](/docs/remotion)
    
*   [@remotion/bundler](/docs/bundler)
    
*   [@remotion/renderer](/docs/renderer)
    
*   [@remotion/player](/docs/player/installation)
    
    *   [Guide + Examples](/docs/player)
    *   [<Player>](/docs/player/player)
    *   [<Thumbnail>](/docs/player/thumbnail)
*   [@remotion/gif](/docs/gif/)
    
*   [@remotion/media-utils](/docs/media-utils/)
    
*   [@remotion/media-parser](/docs/media-parser/)
    
*   [@remotion/motion-blur](/docs/motion-blur/)
    
*   [@remotion/lambda](/docs/lambda/api)
    
*   [@remotion/cloudrun](/docs/cloudrun/api)
    
*   [@remotion/tailwind](/docs/tailwind/tailwind)
    
*   [@remotion/tailwind-v4](/docs/tailwind-v4/overview)
    
*   [@remotion/enable-scss](/docs/enable-scss/overview)
    
*   [@remotion/three](/docs/three)
    
*   [@remotion/skia](/docs/skia/)
    
*   [@remotion/lottie](/docs/lottie/)
    
*   [@remotion/preload](/docs/preload/)
    
*   [@remotion/paths](/docs/paths/)
    
*   [@remotion/noise](/docs/noise/)
    
*   [@remotion/google-fonts](/docs/google-fonts/)
    
*   [@remotion/shapes](/docs/shapes/)
    
*   [@remotion/rive](/docs/rive/)
    
*   [@remotion/studio](/docs/studio/api)
    
*   [@remotion/transitions](/docs/transitions/)
    
*   [@remotion/zod-types](/docs/zod-types/)
    
*   [@remotion/layout-utils](/docs/layout-utils/)
    
*   [@remotion/animation-utils](/docs/animation-utils/)
    
*   [@remotion/animated-emoji](/docs/animated-emoji/)
    
*   [@remotion/webcodecs](/docs/webcodecs/)
    
*   [@remotion/captions](/docs/captions/)
    
*   [@remotion/install-whisper-cpp](/docs/install-whisper-cpp/)
    
*   [@remotion/whisper-web](/docs/whisper-web/)
    
*   [@remotion/openai-whisper](/docs/openai-whisper/)
    
*   [@remotion/fonts](/docs/fonts-api/)
    
*   [@remotion/licensing](/docs/licensing/)
    

*   [](/)
*   [@remotion/player](/docs/player/installation)
*   <Player>

On this page

<Player>
========

A component which can be rendered in a regular React App (for example: [Next.JS](https://nextjs.org), [Vite.js](https://vitejs.dev), [Create React App](https://create-react-app.dev/)) to display a Remotion video.

MyApp.tsx

tsx

`   import {Player} from '@remotion/player';  import {MyVideo} from './remotion/MyVideo';  export const App: React.FC = () => {    return <Player component={MyVideo} durationInFrames={120} compositionWidth={1920} compositionHeight={1080} fps={30} />;  };   `

[See more usage examples](/docs/player/examples)

API[​](#api "Direct link to API")
---------------------------------

### `component` or `lazyComponent`[​](#component-or-lazycomponent "Direct link to component-or-lazycomponent")

Pass a React component in directly **or** pass a function that returns a dynamic import. Passing neither or both of the props is an error.

If you use `lazyComponent`, wrap it in a `useCallback()` to avoid constant rendering. [See here for an example.](/docs/player/examples#loading-a-component-lazily)

note

The Player does not use [`<Composition>`](/docs/composition)'s. Pass your component directly and do not wrap it in a `<Composition>` component.

### `durationInFrames`[​](#durationinframes "Direct link to durationinframes")

The duration of the video in frames. Must be an integer and greater than 0.

### `fps`[​](#fps "Direct link to fps")

The frame rate of the video. Must be a number.

### `compositionWidth`[​](#compositionwidth "Direct link to compositionwidth")

The width you would like the video to have when rendered as an MP4. Use `style={{width: <width>}}` to define a width to be assumed in the browser.

note

**Example**: If you want to render a Full HD video, set `compositionWidth` to `1920` and `compositionHeight` to `1080`. By default, the Player will also assume these dimensions. To make it smaller, pass a `style` prop to give the player a different width: `{"style={{width: 400}}"}`. See [Player Scaling](/docs/player/scaling) to learn more.

### `compositionHeight`[​](#compositionheight "Direct link to compositionheight")

The height you would like the video to have when rendered as an MP4. Use `style={{height: <height>}}` to define a height to be assumed in the browser.

### `inputProps`[​](#inputprops "Direct link to inputprops")

Pass props to the component that you have specified using the `component` prop. The Typescript definition takes the shape of the props that you have given to your `component`.

### `loop`[​](#loop "Direct link to loop")

_optional_

Whether the video should restart when it ends. Default `false`.

### `autoPlay`[​](#autoplay "Direct link to autoplay")

_optional_

Whether the video should start immediately after loaded. Default `false`.

### `controls`[​](#controls "Direct link to controls")

_optional_

Whether the video should display a seek bar and a play/pause button. Default `false.`

### `showVolumeControls`[​](#showvolumecontrols "Direct link to showvolumecontrols")

_optional_

Whether the video should display a volume slider and a mute button. Only has an effect if `controls` is also set to true. Default `true`.

### `allowFullscreen`[​](#allowfullscreen "Direct link to allowfullscreen")

_optional_

Whether the video can go fullscreen. By default `true`.

### `clickToPlay`[​](#clicktoplay "Direct link to clicktoplay")

_optional_

A boolean property defining whether you can play, pause or resume the video with a single click into the player. Default `true` if `controls` are true, otherwise `false`.

### `doubleClickToFullscreen`[​](#doubleclicktofullscreen "Direct link to doubleclicktofullscreen")

_optional_

A boolean property defining whether you can go fullscreen and exit fullscreen in the video with double click into the player. If enabled, clicking on the video once will delay pausing the video for 200ms to wait for a possible second click. Default `false`.

note

This option is not supported on mobile. You do not double-tap on mobile to go to fullscreen.

### `spaceKeyToPlayOrPause`[​](#spacekeytoplayorpause "Direct link to spacekeytoplayorpause")

_optional_

A boolean property defining whether you can play or pause a video using space key. If enabled, playing the video and subsequently pressing the space key pauses and resumes the video. Only works if `controls` is true. Default `true`.

### `moveToBeginningWhenEnded`[v3.1.3](https://github.com/remotion-dev/remotion/releases/v3.1.3)[​](#movetobeginningwhenended "Direct link to movetobeginningwhenended")

_optional_

A boolean property defining whether the video position should go back to zero once the video has ended. Only works if `loop` is disabled. Default `true`.

### `style`[​](#style "Direct link to style")

_optional_

A regular `style` prop for a HTMLDivElement. You can pass a different height and width if you would like different dimensions for the player than the original composition dimensions.

### `className`[v3.1.3](https://github.com/remotion-dev/remotion/releases/v3.1.3)[​](#classname "Direct link to classname")

_optional_

A HTML class name to be applied to the container.

### `initialFrame`[v3.1.14](https://github.com/remotion-dev/remotion/releases/v3.1.14)[​](#initialframe "Direct link to initialframe")

_optional_

Start the playback from a specific frame. Default `0`. Once the player is mounted, this property cannot be changed.

### `numberOfSharedAudioTags`[v2.3.1](https://github.com/remotion-dev/remotion/releases/v2.3.1)[​](#numberofsharedaudiotags "Direct link to numberofsharedaudiotags")

_optional_

If you use an [`<Audio />`](/docs/audio) tag, it might not play in some browsers (specifically iOS Safari) due to browser autoplay policies. This is why the Remotion Player pre-mounts a set of audio tags with silent audio that get played upon user interaction. These audio tags can then be used to play real audio later and will not be subject to the autoplay policy of the browser.

This option controls how many audio tags are being rendered, the default is `5`. If you mount more audio tags than shared audio tags are available, then an error will be thrown.

If you'd like to opt out of this behavior, you can pass `0` to mount native audio tags simultaneously as you mount Remotion's [`<Audio />`](/docs/audio) tags.

Once you have set this prop, you cannot change it anymore or an error will be thrown.

### `playbackRate`[​](#playbackrate "Direct link to playbackrate")

_optional_

A number between -4 and 4 (excluding 0) for the speed that the Player will run the media.

A `playbackRate` of `2` means the video plays twice as fast. A playbackRate of `0.5` means the video plays twice as slow. A playbackRate of `-1` means the video plays in reverse. Note that [`<Audio/>`](/docs/audio) and [`<Video/>`](/docs/video) tags cannot be played in reverse, this is a browser limitation.

Default `1`.

### `errorFallback`[​](#errorfallback "Direct link to errorfallback")

_optional_

A callback for rendering a custom error message. See [Handling errors](#handling-errors) section for an example.

### `renderLoading`[​](#renderloading "Direct link to renderloading")

_optional_

A callback function that allows you to return a custom UI that gets displayed while the player is loading.

The first parameter of the callback function contains the `height` and `width` of the player as it gets rendered.

tsx

``   const MyApp: React.FC = () => {    // `RenderLoading` type can be imported from "@remotion/player"    const renderLoading: RenderLoading = useCallback(({height, width}) => {      return (        <AbsoluteFill style={{backgroundColor: 'gray'}}>          Loading player ({height}x{width})        </AbsoluteFill>      );    }, []);    return <Player fps={30} component={Component} durationInFrames={100} compositionWidth={1080} compositionHeight={1080} renderLoading={renderLoading} />;  };   ``

info

A player needs to be loaded if it contains elements that use React Suspense, or if the `lazyComponent` prop is being used.

### `renderPoster`[v3.2.14](https://github.com/remotion-dev/remotion/releases/v3.2.14)[​](#renderposter "Direct link to renderposter")

_optional_

A callback function that allows you to return a custom UI that gets overlayed over the Player.

You can control when the poster gets rendered using the props [`showPosterWhenUnplayed`](#showposterwhenunplayed), [`showPosterWhenPaused`](#showposterwhenpaused), [`showPosterWhenEnded`](#showposterwhenended), [`showPosterWhenBuffering`](#showposterwhenbuffering) and [`showPosterWhenBufferingAndPaused`](#showposterwhenbufferingandpaused). By default, they are all disabled.

The first parameter contains the `height` and `width` of the Player as it gets rendered.

tsx

`   import type {RenderPoster} from '@remotion/player';  import {Player} from '@remotion/player';  const MyApp: React.FC = () => {    const renderPoster: RenderPoster = useCallback(({height, width, isBuffering}) => {      if (isBuffering) {        return (          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>            <Spinner />          </AbsoluteFill>        );      }      return (        <AbsoluteFill style={{backgroundColor: 'gray'}}>          Click to play! ({height}x{width})        </AbsoluteFill>      );    }, []);    return <Player fps={30} component={Component} durationInFrames={100} compositionWidth={1080} compositionHeight={1080} renderPoster={renderPoster} showPosterWhenUnplayed />;  };   `

### `showPosterWhenUnplayed`[v3.2.14](https://github.com/remotion-dev/remotion/releases/v3.2.14)[​](#showposterwhenunplayed "Direct link to showposterwhenunplayed")

_optional_

Render the poster when the video is in its initial state and has not been played yet. Requires [`renderPoster()`](#renderposter) to be set. Default: `false`.

### `showPosterWhenPaused`[v3.2.14](https://github.com/remotion-dev/remotion/releases/v3.2.14)[​](#showposterwhenpaused "Direct link to showposterwhenpaused")

_optional_

Render the poster when the video is paused. Although considered a paused state, the poster will not render while the user is scrubbing through the video. Requires [`renderPoster()`](#renderposter) to be set. Default: `false`.

### `showPosterWhenEnded`[v3.2.14](https://github.com/remotion-dev/remotion/releases/v3.2.14)[​](#showposterwhenended "Direct link to showposterwhenended")

_optional_

Render the poster when the video has ended. Requires [`moveToBeginning`](#movetobeginningwhenended) to be set to `false`. [`renderPoster()`](#renderposter) to be set. Default: `false`.

### `showPosterWhenBuffering`[v4.0.111](https://github.com/remotion-dev/remotion/releases/v4.0.111)[​](#showposterwhenbuffering "Direct link to showposterwhenbuffering")

_optional_

Render a poster when the `<Player>` is in the [buffering state](/docs/player/buffer-state) and [playing](/docs/player/buffer-state#possible-states). You may for example show a spinner in the center of the video.

### `showPosterWhenBufferingAndPaused`[v4.0.290](https://github.com/remotion-dev/remotion/releases/v4.0.290)[​](#showposterwhenbufferingandpaused "Direct link to showposterwhenbufferingandpaused")

_optional_

Render a poster when the `<Player>` is in the [buffering state](/docs/player/buffer-state) and [paused](/docs/player/buffer-state#possible-states). You may for example show a spinner in the center of the video.

### `inFrame`[v3.2.15](https://github.com/remotion-dev/remotion/releases/v3.2.15)[​](#inframe "Direct link to inframe")

_optional_

Limit playback to only play after a certain frame. The video will start from this frame and move to this position once it has ended. Must be an integer, not smaller than `0`, not bigger than [`outFrame`](#outframe) and not bigger than `durationInFrames - 1`. Default `null`, which means the beginning of the video.

### `outFrame`[v3.2.15](https://github.com/remotion-dev/remotion/releases/v3.2.15)[​](#outframe "Direct link to outframe")

_optional_

Limit playback to only play before a certain frame. The video will end at this frame and move to the beginning once it has ended. Must be an integer, not smaller than `1`, not smaller than [`inFrame`](#inframe) and not bigger than `durationInFrames - 1`. Default `null`, which means the end of the video.

### `initiallyShowControls`[v3.2.24](https://github.com/remotion-dev/remotion/releases/v3.2.24)[​](#initiallyshowcontrols "Direct link to initiallyshowcontrols")

_optional_

If true, the controls flash when the player enters the scene. After 2 seconds without hover, the controls fade out. This is similar to how YouTube does it, and signals to the user that the player is in fact controllable. You can also pass a `number`, with which you can customize the duration in milliseconds. Default `true` since `v3.2.24`, before that unsupported.

### `initiallyMuted`[v3.3.81](https://github.com/remotion-dev/remotion/releases/v3.3.81)[​](#initiallymuted "Direct link to initiallymuted")

_optional_

If true, the player is muted in its initial state. This is useful if the video must autoplay regardless of the [autoplay](/docs/player/autoplay) policy of the browser.

### `renderPlayPauseButton`[v3.2.32](https://github.com/remotion-dev/remotion/releases/v3.2.32)[​](#renderplaypausebutton "Direct link to renderplaypausebutton")

_optional_

Allows you to customize the Play/Pause button of the controls.  
Must be a callback function that returns a valid React element.

App.tsx

tsx

`   import {Player, RenderPlayPauseButton} from '@remotion/player';  import {useCallback} from 'react';  export const App: React.FC = () => {    const renderPlayPauseButton: RenderPlayPauseButton = useCallback(({playing, isBuffering}) => {      // Since v4.0.111, isBuffering is available      if (playing && isBuffering) {        return <MySpinner />;      }      if (playing) {        return <MyPlayButton />;      }      return <MyPauseButton />;    }, []);    return <Player component={MyVideo} durationInFrames={120} compositionWidth={1920} compositionHeight={1080} fps={30} renderPlayPauseButton={renderPlayPauseButton} />;  };   `

Since v4.0.111, a `isBuffering` parameter is being passed in the callback which is `true` if the Player is in a [buffer state](/docs/player/buffer-state). [Learn more](/docs/player/buffer-state#possible-states) about the playback states a Player can be in.

Since v4.0.111, You can return `null` in the callback to fall back to the default UI.

### `renderFullscreenButton`[v3.2.32](https://github.com/remotion-dev/remotion/releases/v3.2.32)[​](#renderfullscreenbutton "Direct link to renderfullscreenbutton")

_optional_

Allows you to customise the fullscreen button of the player controls, must return a valid React element. If fullscreen is disabled or not available in a browser, it will not be rendered.

tsx

`   import {Player, RenderFullscreenButton} from '@remotion/player';  import {useCallback} from 'react';  export const App: React.FC = () => {    const renderFullscreenButton: RenderFullscreenButton = useCallback(({isFullscreen}) => {      if (isFullscreen) {        return <MinimiseButton />;      }      return <FullScreenButton />;    }, []);    return <Player component={MyVideo} durationInFrames={120} compositionWidth={1920} compositionHeight={1080} fps={30} renderFullscreenButton={renderFullscreenButton} />;  };   `

### `renderMuteButton`[v4.0.188](https://github.com/remotion-dev/remotion/releases/v4.0.188)[​](#rendermutebutton "Direct link to rendermutebutton")

_optional_

Allows you to customize the Mute button of the controls, must return a valid React element.  
Action is disabled, you must attach click handlers yourself using the [`PlayerRef`](#playerref).  
If unmuting a video, we recommend setting both [`.setVolume(1)`](#setvolume) and [`.setMuted(false)`](/docs/config#setmuted).

tsx

`   import {Player, RenderMuteButton} from '@remotion/player';  import {useCallback} from 'react';  export const App: React.FC = () => {    const renderMuteButton: RenderMuteButton = useCallback(({muted, volume}) => {      const isMutedOrVolumeZero = muted || volume === 0;      if (isMutedOrVolumeZero) {        return <VolumeOffIcon />;      }      return <VolumeOnIcon />;    }, []);    return <Player fps={30} component={MyVideo} durationInFrames={120} compositionWidth={1920} compositionHeight={1080} renderMuteButton={renderMuteButton} />;  };   `

### `renderVolumeSlider`[v4.0.188](https://github.com/remotion-dev/remotion/releases/v4.0.188)[​](#rendervolumeslider "Direct link to rendervolumeslider")

Allows for a custom implementation of the volume slider, must return a valid React element.  
See the default implementation [here](https://github.com/remotion-dev/remotion/blob/main/packages/player/src/render-volume-slider.tsx).  
The default implementation makes the volume slider vertical (`isVertical`) and is keyboard navigateable using the Tab key (`onBlur`, `inputRef`).

App.tsx

tsx

`   import {useCallback} from 'react';  import {Player, type RenderVolumeSlider} from '@remotion/player';  export const App: React.FC = () => {    const renderVolumeSlider: RenderVolumeSlider = useCallback(({isVertical, volume, onBlur, inputRef, setVolume}) => {      return null; // Your volume slider implementation    }, []);    return <Player fps={30} component={MyVideo} durationInFrames={120} compositionWidth={1920} compositionHeight={1080} renderVolumeSlider={renderVolumeSlider} />;  };   `

### `alwaysShowControls`[v3.3.55](https://github.com/remotion-dev/remotion/releases/v3.3.55)[​](#alwaysshowcontrols "Direct link to alwaysshowcontrols")

_optional_

If true, displays the player controls at all times even if the mouse is outside the player area. This settings override the default behavior, which automatically hides the controls after a period of mouse inactivity over the player area. Default `false`.

### `hideControlsWhenPointerDoesntMove`[v4.0.124](https://github.com/remotion-dev/remotion/releases/v4.0.124)[​](#hidecontrolswhenpointerdoesntmove "Direct link to hidecontrolswhenpointerdoesntmove")

_optional_

Hides the player controls after 3 seconds of mouse inactivity while the mouse is over the player. By default, this behavior is enabled (`true`). The [`alwaysShowControls`](#alwaysshowcontrols) prop is respected, meaning, if it is set to `true`, then the controls will never hide.

You may also pass in a number to customize the hide delay in milliseconds, by default `3000`.

### `showPlaybackRateControl`[v3.3.98](https://github.com/remotion-dev/remotion/releases/v3.3.98)[​](#showplaybackratecontrol "Direct link to showplaybackratecontrol")

_optional_

If `true`, displays a gear icon allowing the user to change the playback rate.

You may pass an array with the available playback rates for selection, however, updating the list dynamically is not supported. `true` is an alias for `[0.5, 0.8, 1, 1.2, 1.5, 1.8, 2, 2.5, 3]`.

Default `false`.

### `posterFillMode`[v4.0.78](https://github.com/remotion-dev/remotion/releases/v4.0.78)[​](#posterfillmode "Direct link to posterfillmode")

Either `player-size` (default) or `composition-size`:

*   `player-size`: The poster will be rendered in the size of the player. This is useful if you want to render for example a Play button with constant size.
*   `composition-size`: The poster will be rendered in the size of the composition and scaled to the size of the Player. This is useful if you want to render a freeze frame of the video as a poster.

### `bufferStateDelayInMilliseconds`[v4.0.111](https://github.com/remotion-dev/remotion/releases/v4.0.111)[​](#bufferstatedelayinmilliseconds "Direct link to bufferstatedelayinmilliseconds")

After the Player has entered a [buffer state](/docs/player/buffer-state), it will wait for this amount of time before showing the buffering UI.  
This prevents jank when the Player is only in a buffering state for a short time. Default `300`.

Note:

*   [`renderPoster()`](#renderposter) and [`renderPlayPauseButton()`](#renderplaypausebutton) will only report `isBuffering` as `true` **after** this delay has passed.
*   The [`waiting`](/docs/player/player#waiting) and [`resume`](/docs/player/player#resume) events will **fire immediately** when the Player enters and exits the buffer state.

This allows you to flexibly implement custom UI for the buffer state.

### `overflowVisible`[v4.0.173](https://github.com/remotion-dev/remotion/releases/v4.0.173)[​](#overflowvisible "Direct link to overflowvisible")

Makes the Player render things outside of the canvas. Useful if you have interactive elements in the video such as draggable elements.

### `browserMediaControlsBehavior`[v4.0.221](https://github.com/remotion-dev/remotion/releases/v4.0.221)[​](#browsermediacontrolsbehavior "Direct link to browsermediacontrolsbehavior")

Controls what happens when the user presses the Play/Pause button on their keyboard or uses other controls such as Chromes built-in controls.  
See [Media Keys Behavior](/docs/player/media-keys) for more information.

### `overrideInternalClassName`[v4.0.233](https://github.com/remotion-dev/remotion/releases/v4.0.233)[​](#overrideinternalclassname "Direct link to overrideinternalclassname")

_optional_

A HTML class name to be used in place of the default `__remotion-player`.

### `logLevel?`[v4.0.250](https://github.com/remotion-dev/remotion/releases/v4.0.250)[​](#loglevel "Direct link to loglevel")

One of `trace`, `verbose`, `info`, `warn`, `error`.  
Determines how much info is being logged to the console.  
  
Default `info`.

### `noSuspense`[v4.0.271](https://github.com/remotion-dev/remotion/releases/v4.0.271)[​](#nosuspense "Direct link to nosuspense")

Disables React Suspense, which is [useful for writing tests](/docs/player/thumbnail).

### `acknowledgeRemotionLicense?`[v4.0.253](https://github.com/remotion-dev/remotion/releases/v4.0.253)[​](#acknowledgeremotionlicense "Direct link to acknowledgeremotionlicense")

Acknowledge the [Remotion License](/docs/license) to make the console message disappear.

### `volumePersistenceKey?`[v4.0.305](https://github.com/remotion-dev/remotion/releases/v4.0.305)[​](#volumepersistencekey "Direct link to volumepersistencekey")

A string that allows you to customize the `localStorage` key used for saving and retrieving the user's volume preference.

By default, Remotion uses the key `"remotion.volumePreference"`.

This prop is useful if you would like to scope the volume preference to a specific Player instance.

**Example:**

tsx

`   <Player    component={MyVideo}    // ... other props    volumePersistenceKey="my-app-volume-preference"  />   `

`PlayerRef`[​](#playerref "Direct link to playerref")
-----------------------------------------------------

You may attach a ref to the player and control it in an imperative manner.

tsx

`   import {Player, PlayerRef} from '@remotion/player';  import {useEffect, useRef} from 'react';  import {MyComposition} from './MyComposition';  const MyComp: React.FC = () => {    const playerRef = useRef<PlayerRef>(null);    useEffect(() => {      if (playerRef.current) {        console.log(playerRef.current.getCurrentFrame());      }    }, []);    return (      <Player        ref={playerRef}        durationInFrames={30}        compositionWidth={1080}        compositionHeight={1080}        fps={30}        component={MyComposition}        // Many other optional props are available.      />    );  };   `

The following methods are available on the player ref:

### `pause()`[​](#pause "Direct link to pause")

Pause the video. Nothing happens if the video is already paused.

### `pauseAndReturnToPlayStart()`[v4.0.67](https://github.com/remotion-dev/remotion/releases/v4.0.67)[​](#pauseandreturntoplaystart "Direct link to pauseandreturntoplaystart")

If the video is playing, pause it and return to the playback position where the video has last been played.

### `play()`[​](#play "Direct link to play")

Play the video. Nothing happens if the video is already playing.

If you play the video from a user gesture, pass the `SyntheticEvent` in as an argument so [browser autoplay restrictions do not apply](/docs/player/autoplay).

### `toggle()`[​](#toggle "Direct link to toggle")

Pauses the video if it's playing. Plays the video if it's paused.

If you play the video from a user gesture, pass the `SyntheticEvent` in as an argument so [browser autoplay restrictions do not apply](/docs/player/autoplay).

### `getCurrentFrame()`[​](#getcurrentframe "Direct link to getcurrentframe")

Gets the current position expressed as the current frame. Divide by the `fps` you passed to get the time in seconds.

[Special considerations must be made](https://www.remotion.dev/docs/player/current-time) if you want to display a component that synchronizes with the time of the player.

### `isPlaying()`[v2.5.7](https://github.com/remotion-dev/remotion/releases/v2.5.7)[​](#isplaying "Direct link to isplaying")

Returns a boolean indicating whether the video is playing.

### `getContainerNode()`[v2.4.2](https://github.com/remotion-dev/remotion/releases/v2.4.2)[​](#getcontainernode "Direct link to getcontainernode")

Gets the container `HTMLDivElement` of the player. Useful if you'd like to manually attach listeners to the player element.

tsx

`   const playerRef = useRef<PlayerRef>(null);  useEffect(() => {    if (!playerRef.current) {      return;    }    const container = playerRef.current.getContainerNode();    if (!container) {      return;    }    const onClick = () => {      console.log('player got clicked');    };    container.addEventListener('click', onClick);    return () => {      container.removeEventListener('click', onClick);    };  }, []);   `

### `mute()`[​](#mute "Direct link to mute")

Mutes the video.

### `unmute()`[​](#unmute "Direct link to unmute")

Unmutes the video.

### `getVolume()`[​](#getvolume "Direct link to getvolume")

Gets the volume of the video. The volume is a value between 0 and 1 and is initially 1.

### `setVolume()`[​](#setvolume "Direct link to setvolume")

#### Arguments[​](#arguments "Direct link to Arguments")

*   `volume`: `number`

Set the volume of the video. Must be a value between 0 and 1, otherwise an exception will be thrown.

### `isMuted()`[​](#ismuted "Direct link to ismuted")

Returns a boolean specifying whether the video is muted.

### `seekTo()`[​](#seekto "Direct link to seekto")

#### Arguments[​](#arguments-1 "Direct link to Arguments")

*   `frame`: `number`

Move the position in the video to a specific frame. If the video is playing, it will pause for a brief moment, then start playing again after the seek is completed.

### `isFullscreen()`[​](#isfullscreen "Direct link to isfullscreen")

Returns a boolean whether the video is currently playing in fullscreen.

_To observe the fullscreen state and react to changes, listen to the [`fullscreenchange`](https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenchange_event) event on the global document._

### `requestFullscreen()`[​](#requestfullscreen "Direct link to requestfullscreen")

Requests the video to go to fullscreen. This method throws if the `allowFullscreen` prop is false or the browser doesn't support allow the player to go into fullscreen.

In Mobile Safari, Fullscreen is supported from iOS 17.

### `exitFullscreen()`[​](#exitfullscreen "Direct link to exitfullscreen")

Exit fullscreen mode.

### `getScale()`[v3.2.24](https://github.com/remotion-dev/remotion/releases/v3.2.24)[​](#getscale "Direct link to getscale")

Returns a number which says how much the content is scaled down compared to the natural composition size. For example, if the composition is `1920x1080`, but the player is 960px in width, this method would return `0.5`.

### `addEventListener()`[​](#addeventlistener "Direct link to addeventlistener")

Start listening to an event. See the [Events](#events) section to see the function signature and the available events.

### `removeEventListener()`[​](#removeeventlistener "Direct link to removeeventlistener")

Stop listening to an event. See the [Events](#events) section to see the function signature and the available events.

Events[​](#events "Direct link to Events")
------------------------------------------

Using a [player ref](#playerref), you can bind event listeners to get notified of certain events of the player.

tsx

``   import {CallbackListener} from '@remotion/player';  const playerRef = useRef<PlayerRef>(null);  useEffect(() => {    if (!playerRef.current) {      return;    }    const onPlay: CallbackListener<'play'> = () => {      console.log('play');    };    const onRateChange: CallbackListener<'ratechange'> = (e) => {      console.log('ratechange', e.detail.playbackRate);    };    const onVolumeChange: CallbackListener<'volumechange'> = (e) => {      console.log('new volume', e.detail.volume);    };    const onPause: CallbackListener<'pause'> = () => {      console.log('pausing');    };    const onSeeked: CallbackListener<'seeked'> = (e) => {      console.log('seeked to ' + e.detail.frame);    };    const onTimeupdate: CallbackListener<'timeupdate'> = (e) => {      console.log('time has updated to ' + e.detail.frame);    };    const onEnded: CallbackListener<'ended'> = () => {      console.log('ended');    };    const onError: CallbackListener<'error'> = (e) => {      console.log('error', e.detail.error);    };    const onFullscreenChange: CallbackListener<'fullscreenchange'> = (e) => {      console.log('fullscreenchange', e.detail.isFullscreen);    };    const onScaleChange: CallbackListener<'scalechange'> = (e) => {      console.log('scalechange', e.detail.scale);    };    const onMuteChange: CallbackListener<'mutechange'> = (e) => {      console.log('mutechange', e.detail.isMuted);    };    playerRef.current.addEventListener('play', onPlay);    playerRef.current.addEventListener('ratechange', onRateChange);    playerRef.current.addEventListener('volumechange', onVolumeChange);    playerRef.current.addEventListener('pause', onPause);    playerRef.current.addEventListener('ended', onEnded);    playerRef.current.addEventListener('error', onError);    playerRef.current.addEventListener('fullscreenchange', onFullscreenChange);    playerRef.current.addEventListener('scalechange', onScaleChange);    playerRef.current.addEventListener('mutechange', onMuteChange);    // See below for difference between `seeked` and `timeupdate`    playerRef.current.addEventListener('seeked', onSeeked);    playerRef.current.addEventListener('timeupdate', onTimeupdate);    return () => {      // Make sure to clean up event listeners      if (playerRef.current) {        playerRef.current.removeEventListener('play', onPlay);        playerRef.current.removeEventListener('ratechange', onRateChange);        playerRef.current.removeEventListener('volumechange', onVolumeChange);        playerRef.current.removeEventListener('pause', onPause);        playerRef.current.removeEventListener('ended', onEnded);        playerRef.current.removeEventListener('error', onError);        playerRef.current.removeEventListener('fullscreenchange', onFullscreenChange);        playerRef.current.removeEventListener('scalechange', onScaleChange);        playerRef.current.removeEventListener('mutechange', onMuteChange);        playerRef.current.removeEventListener('seeked', onSeeked);        playerRef.current.removeEventListener('timeupdate', onTimeupdate);      }    };  }, []);   ``

### `seeked`[​](#seeked "Direct link to seeked")

Fired when the time position is changed by the user using the playback bar or using [`seek()`](#seeked). You may get the current frame by reading it from `e.detail.frame`.

tsx

`   playerRef.current.addEventListener('seeked', (e) => {    console.log('seeked to ' + e.detail.frame); // seeked to 120  });   `

This event fires on every single frame update. Prefer the [`timeupdate`](#timeupdate) event instead if the excessive rerenders cause slowdown.

This event is only fired during seeking. Use [`frameupdate`](#frameupdate) instead if you also want to get time updates during playback.

### `ended`[​](#ended "Direct link to ended")

Fires when the video has ended and looping is disabled.

### `play`[​](#play-1 "Direct link to play-1")

Fires when the video has started playing or has resumed from a pause.

### `ratechange`[​](#ratechange "Direct link to ratechange")

Fires when the [`playbackRate`](#playbackrate) has changed.

### `scalechange`[v3.3.86](https://github.com/remotion-dev/remotion/releases/v3.3.86)[​](#scalechange "Direct link to scalechange")

Fires when the `scale` has changed. Also returned by [`getScale()`](#getscale).

### `volumechange`[v3.3.86](https://github.com/remotion-dev/remotion/releases/v3.3.86)[​](#volumechange "Direct link to volumechange")

Fires when the volume has changed. Also returned by [`getVolume()`](#getvolume).

### `pause`[​](#pause-1 "Direct link to pause-1")

Fires when the video has paused or ended.

### `timeupdate`[​](#timeupdate "Direct link to timeupdate")

Fires periodic time updates when the video is playing. Unlike the [`seeked`](#seeked) event, frames are skipped, and the event is throttled to only fire a few times a second at most every 250ms.

tsx

`   playerRef.current.addEventListener('timeupdate', (e) => {    console.log('current frame is ' + e.detail.frame); // current frame is 120  });   `

Prefer the [`seeked`](#seeked) event if you only want to get time updates during seeking.

Prefer the [`frameupdate`](#frameupdate) event if you need an update for every single frame.

### `frameupdate`[v3.2.27](https://github.com/remotion-dev/remotion/releases/v3.2.27)[​](#frameupdate "Direct link to frameupdate")

Fires whenever the current time has changed, during both playback and seeking.

tsx

`   playerRef.current.addEventListener('frameupdate', (e) => {    console.log('current frame is ' + e.detail.frame); // current frame is 120  });   `

Prefer the [`seeked`](#seeked) event if you only want to get time updates during seeking.

Prefer the [`timeupdate`](#timeupdate) event if you only need periodical updates (at most every 250ms).

### `fullscreenchange`[v3.2.0](https://github.com/remotion-dev/remotion/releases/v3.2.0)[​](#fullscreenchange "Direct link to fullscreenchange")

Fires when the player enters or exits fullscreen. By reading `e.detail.isFullscreen` or calling `playerRef.isFullscreen()` you can determine if the player is currently in fullscreen or not.

tsx

`   playerRef.current.addEventListener('fullscreenchange', (e) => {    console.log('is fullscreen' + e.detail.isFullscreen); // is fullscreen true  });   `

### `mutechange`[v3.3.98](https://github.com/remotion-dev/remotion/releases/v3.3.98)[​](#mutechange "Direct link to mutechange")

Fires when the player's audio is muted or not. Also returned by [`isMuted()`](#ismuted).

tsx

`   playerRef.current.addEventListener('mutechange', (e) => {    console.log('is mute' + e.detail.isMuted); // is mute true  });   `

### `error`[​](#error "Direct link to error")

Fires when an error or uncaught exception has happened in the React component.

You may get the error by reading the `e.detail.error` value:

tsx

`   ref.current?.addEventListener('error', (e) => {    console.log('error ', e.detail.error); // error [Error: undefined is not a function]  });   `

### `waiting`[v4.0.111](https://github.com/remotion-dev/remotion/releases/v4.0.111)[​](#waiting "Direct link to waiting")

Fires when the Player has entered into the [native buffering state](/docs/player/buffer-state).

Read here [how to best implement state management](/docs/player/buffer-state#possible-states).

### `resume`[v4.0.111](https://github.com/remotion-dev/remotion/releases/v4.0.111)[​](#resume "Direct link to resume")

Fires when the Player has exited the [native buffering state](/docs/player/buffer-state).

Read here [how to best implement state management](/docs/player/buffer-state#possible-states).

Handling errors[​](#handling-errors "Direct link to Handling errors")
---------------------------------------------------------------------

Since videos are written in React, they are prone to crashing. When a video throws an exception, you may handle the error using the [`error` event](#error). The video will unmount and show an error UI, but the host application (The React app which is embedding the player) will not crash. It is up to you to handle the error and to re-mount the video (for example by changing the `key` prop in React).

This feature is implemented using an [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary), so only errors in the render function will be caught. Errors in event handlers and asynchronous code will not be reported and will not cause the video to unmount.

You can customize the error message that is shown if a video crashes:

tsx

``   const MyApp: React.FC = () => {    // `ErrorFallback` type can be imported from "@remotion/player"    const errorFallback: ErrorFallback = useCallback(({error}) => {      return (        <AbsoluteFill          style={{            backgroundColor: 'yellow',            justifyContent: 'center',            alignItems: 'center',          }}        >          Sorry about this! An error occurred: {error.message}        </AbsoluteFill>      );    }, []);    return <Player fps={30} component={Component} durationInFrames={100} compositionWidth={1080} compositionHeight={1080} errorFallback={errorFallback} />;  };   ``

See also[​](#see-also "Direct link to See also")
------------------------------------------------

*   [Source code for this component](https://github.com/remotion-dev/remotion/blob/main/packages/player/src/Player.tsx)
*   [`<Composition>`](/docs/composition)
*   [`<Thumbnail>`](/docs/player/thumbnail)

[Improve this page](https://github.com/remotion-dev/remotion/edit/main/packages/docs/docs/player/api.mdx)

[Ask on Discord](https://remotion.dev/discord)

[Get help](/docs/get-help)

Last updated on **Jun 15, 2025**

[

Previous

Installation

](/docs/player/installation)[

Next

<Thumbnail>

](/docs/player/thumbnail)

*   [API](#api)
    *   [`component` or `lazyComponent`](#component-or-lazycomponent)
    *   [`durationInFrames`](#durationinframes)
    *   [`fps`](#fps)
    *   [`compositionWidth`](#compositionwidth)
    *   [`compositionHeight`](#compositionheight)
    *   [`inputProps`](#inputprops)
    *   [`loop`](#loop)
    *   [`autoPlay`](#autoplay)
    *   [`controls`](#controls)
    *   [`showVolumeControls`](#showvolumecontrols)
    *   [`allowFullscreen`](#allowfullscreen)
    *   [`clickToPlay`](#clicktoplay)
    *   [`doubleClickToFullscreen`](#doubleclicktofullscreen)
    *   [`spaceKeyToPlayOrPause`](#spacekeytoplayorpause)
    *   [`moveToBeginningWhenEnded`](#movetobeginningwhenended)
    *   [`style`](#style)
    *   [`className`](#classname)
    *   [`initialFrame`](#initialframe)
    *   [`numberOfSharedAudioTags`](#numberofsharedaudiotags)
    *   [`playbackRate`](#playbackrate)
    *   [`errorFallback`](#errorfallback)
    *   [`renderLoading`](#renderloading)
    *   [`renderPoster`](#renderposter)
    *   [`showPosterWhenUnplayed`](#showposterwhenunplayed)
    *   [`showPosterWhenPaused`](#showposterwhenpaused)
    *   [`showPosterWhenEnded`](#showposterwhenended)
    *   [`showPosterWhenBuffering`](#showposterwhenbuffering)
    *   [`showPosterWhenBufferingAndPaused`](#showposterwhenbufferingandpaused)
    *   [`inFrame`](#inframe)
    *   [`outFrame`](#outframe)
    *   [`initiallyShowControls`](#initiallyshowcontrols)
    *   [`initiallyMuted`](#initiallymuted)
    *   [`renderPlayPauseButton`](#renderplaypausebutton)
    *   [`renderFullscreenButton`](#renderfullscreenbutton)
    *   [`renderMuteButton`](#rendermutebutton)
    *   [`renderVolumeSlider`](#rendervolumeslider)
    *   [`alwaysShowControls`](#alwaysshowcontrols)
    *   [`hideControlsWhenPointerDoesntMove`](#hidecontrolswhenpointerdoesntmove)
    *   [`showPlaybackRateControl`](#showplaybackratecontrol)
    *   [`posterFillMode`](#posterfillmode)
    *   [`bufferStateDelayInMilliseconds`](#bufferstatedelayinmilliseconds)
    *   [`overflowVisible`](#overflowvisible)
    *   [`browserMediaControlsBehavior`](#browsermediacontrolsbehavior)
    *   [`overrideInternalClassName`](#overrideinternalclassname)
    *   [`logLevel?`](#loglevel)
    *   [`noSuspense`](#nosuspense)
    *   [`acknowledgeRemotionLicense?`](#acknowledgeremotionlicense)
    *   [`volumePersistenceKey?`](#volumepersistencekey)
*   [`PlayerRef`](#playerref)
    *   [`pause()`](#pause)
    *   [`pauseAndReturnToPlayStart()`](#pauseandreturntoplaystart)
    *   [`play()`](#play)
    *   [`toggle()`](#toggle)
    *   [`getCurrentFrame()`](#getcurrentframe)
    *   [`isPlaying()`](#isplaying)
    *   [`getContainerNode()`](#getcontainernode)
    *   [`mute()`](#mute)
    *   [`unmute()`](#unmute)
    *   [`getVolume()`](#getvolume)
    *   [`setVolume()`](#setvolume)
    *   [`isMuted()`](#ismuted)
    *   [`seekTo()`](#seekto)
    *   [`isFullscreen()`](#isfullscreen)
    *   [`requestFullscreen()`](#requestfullscreen)
    *   [`exitFullscreen()`](#exitfullscreen)
    *   [`getScale()`](#getscale)
    *   [`addEventListener()`](#addeventlistener)
    *   [`removeEventListener()`](#removeeventlistener)
*   [Events](#events)
    *   [`seeked`](#seeked)
    *   [`ended`](#ended)
    *   [`play`](#play-1)
    *   [`ratechange`](#ratechange)
    *   [`scalechange`](#scalechange)
    *   [`volumechange`](#volumechange)
    *   [`pause`](#pause-1)
    *   [`timeupdate`](#timeupdate)
    *   [`frameupdate`](#frameupdate)
    *   [`fullscreenchange`](#fullscreenchange)
    *   [`mutechange`](#mutechange)
    *   [`error`](#error)
    *   [`waiting`](#waiting)
    *   [`resume`](#resume)
*   [Handling errors](#handling-errors)
*   [See also](#see-also)

![](/img/new-logo.png)

© Copyright 2025 Remotion AG.  
Website created with Docusaurus.

Remotion

*   [Getting started](/docs/)
*   [API Reference](/docs/api)
*   [Player](/player)
*   [Lambda](/lambda)
*   [Learn](/learn)
*   [Convert a video](https://convert.remotion.dev)
*   [Store](https://remotion.pro/store)
*   [GitHub](https://github.com/remotion-dev/remotion)
*   [Remotion Pro](https://remotion.pro)

Community

*   [Showcase](/showcase)
*   [Experts](/experts)
*   [Discord](https://remotion.dev/discord)
*   [X](https://x.com/remotion)
*   [YouTube](https://youtube.com/@remotion_dev)
*   [LinkedIn](https://www.linkedin.com/company/remotion-dev/)
*   [Instagram](https://instagram.com/remotion)
*   [TikTok](https://www.tiktok.com/@remotion)
*   [Threads](https://www.threads.net/@remotion)

More

*   [About us](/about)
*   [Contact us](/contact)
*   [Blog](/blog)
*   [Success Stories](/success-stories)
*   [Support](/docs/support)
*   [Changelog](https://remotion.dev/changelog)
*   [Acknowledgements](https://remotion.dev/acknowledgements)
*   [License](https://remotion.dev/license)
*   [Brand](https://remotion.dev/brand)

Ask AI

Demander

Expliquez ceciContinuer à écrireInvite personnaliséeTraduireRésumerAméliorer l'écritureCorriger l'orthographe et la grammaireRépondre à cette questionExpliquez les codesTrouver des éléments d'actionRendre plus courtRendre plus longSimplifier la langueChanger le ton - ProfessionnelChanger le ton - DécontractéChanger de ton - DirectChanger de ton - ConfiantChanger de ton - AmicalBrainstorm sur...Aperçu...Article de blog...Paragraphe sur...Post sur les médias sociaux...Communiqué de presseHistoire créativeListe de choses à faire...Ordre du jour de la réunion...Email de vente...Plus persuasifAjouter des détailsAjouter des statistiquesAjouter de l'humourPlus d'excusesPlus engageant

አማርኛالعربيةБългарскиবাংলাCatalàČeštinaDanskDeutschΕλληνικάEnglishEspañolEestiفارسیSuomiFilipinoFrançaisગુજરાતીעבריתहिन्दीHrvatskiMagyarBahasa IndonesiaItaliano日本語ಕನ್ನಡ한국어LietuviųLatviešuമലയാളംमराठीBahasa MelayuNederlandsNorskPolskiPortuguêsRomânăРусскийSlovenčinaSlovenščinaСрпскиSvenskaKiswahiliதமிழ்తెలుగుไทยTürkçeУкраїнськаاردوTiếng Việt简体中文繁體中文

*   GPT-4o Mini
    
    Très rapide, idéal pour la plupart des tâches quotidiennes.
    
    Coût 1 requête rapide.
    
*   GPT-4o
    
    Le modèle phare le plus récent et le plus avancé d'OpenAI qui peut raisonner en temps réel à travers l'audio, la vision et le texte.
    
    Coûte 1 requête avancée.
    
*   o1
    
    Le modèle avancé de raisonnement d'OpenAI pour les tâches complexes en science, mathématiques et programmation. Prend plus de temps pour réfléchir, offrant des réponses bien réfléchies aux problèmes difficiles.
    
    Coût 15 Requête avancée
    
*   o1 Mini
    
    Le modèle de raisonnement de base d'OpenAI pour le raisonnement en STEM, en particulier en mathématiques et en codage. Idéal pour les tâches nécessitant une logique solide sans connaissances étendues.
    
    Coût 5 Requête avancée
    
*   o3 Mini
    
    Le modèle de raisonnement de base d'OpenAI pour le raisonnement en STEM, en particulier en mathématiques et en codage. Idéal pour les tâches nécessitant une logique solide sans connaissances étendues.
    
    Coût 5 Requête avancée
    
*   Claude 3.5 Haiku
    
    Le modèle le plus compact d'Anthropic, conçu pour une réactivité quasi instantanée et des expériences IA fluides qui imitent les interactions humaines.
    
    Coût 1 requête rapide.
    
*   Claude 3.5 Sonnet
    
    Très rapide, idéal pour la plupart des tâches quotidiennes.
    
    Coûte 1 requête avancée.
    
*   Claude 3.5 Opus
    
    Le modèle le plus puissant d'Anthropic, offrant des performances de pointe sur des tâches extrêmement complexes et démontrant une aisance et une compréhension semblables à celles d'un humain.
    
    Coût de 2 requêtes avancées.
    
*   Gemini 1.5 Pro
    
    Le modèle léger de Google, optimisé pour la vitesse et l'efficacité.
    
    Coûte 1 requête avancée.
    
*   Gemini 2.0 Flash
    
    Modèle le plus équilibré de Google, alliant parfaitement capacité et efficacité.
    
    Coût 1 requête rapide.
    
*   Llama 3.3 70B
    
    Le modèle polyvalent de Meta, excellent dans la synthèse de textes longs, les conversations multilingues et l'assistance au codage.
    
    Coût 1 requête rapide.
    
*   Llama 3.1 405B
    
    Le modèle open-source le plus puissant de Meta, rivalisant avec les meilleurs assistants IA en termes de connaissances générales, de mathématiques et de capacités multilingues.
    
    Coûte 1 requête avancée.
    
*   DeepSeek R1
    
    Le modèle phare de raisonnement de DeepSeek, spécialisé dans les mathématiques, la programmation et les tâches de raisonnement en plusieurs étapes, égale ou dépasse OpenAI o1 dans de nombreux benchmarks.
    
    Coût 2 Requête avancée
    

Soumettre (enter)

Faire une critique & gagner du crédit ❤

Chat

Demander

Recherche

Écrire

Image

Fichier de discussion

Vision

Page Entière

Invitez &Gagnez

Se connecter en tant qu'utilisateur

Retour d'information

### Invitez des amis et gagnez des crédits

Close modal

Gagnez 0 Fast credits & 1 crédit Avancé1 pour vous et votre ami.Gagnez plus lorsque vous parrainez davantage!

Invitez votre ami avec un lien d'invitation

Vos amis s'inscrivent

Ils installent l'extension et se connectent. Vous gagnez tous les deux des crédits!

Copier le lien d'invitation

Vérifier les registres d'invitation

*   « Résumer la page »
    

ChatGPT Sidebar

Demander à ChatGPT