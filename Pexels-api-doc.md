     Free stock photos · Pexels                                               

[

Pexels API

](#)

*   [Overview](/api/)
*   [Introduction](#introduction)
*   [Guidelines](#guidelines)
*   [Client Libraries](#client_libraries)
*   [Authorization](#authorization)
*   [Request Statistics](#statistics)
*   [Pagination](#pagination)
*   [Photos](#photos)
    *   [The Photo Resource](#photos-overview)
    *   [Search for Photos](#photos-search)
    *   [Curated Photos](#photos-curated)
    *   [Get a Photo](#photos-show)
*   [Videos](#videos)
    *   [The Video Resource](#videos-overview)
    *   [Search for Videos](#videos-search)
    *   [Popular Videos](#videos-popular)
    *   [Get a Video](#videos-show)
*   [Collections](#collections)
    *   [Overview](#collections-overview)
    *   [The Collection Resource](#collections-resource)
    *   [Featured Collections](#collections-featured)
    *   [My Collections](#collections-all)
    *   [Collection Media](#collections-media)
*   [Changelog](#changelog)

[

Introduction
------------

](#introduction)

The Pexels API enables programmatic access to the full Pexels content library, including photos, videos. All content is available free of charge, and you are welcome to use Pexels content for anything you'd like, as long as it is within our [Title](#guidelines).

The Pexels API is a RESTful JSON API, and you can interact with it from any language or framework with a HTTP library. Alternately, Pexels maintains some official [Title](#client_libraries) you can use.

If you have any questions, feel free to check out our [FAQ](https://help.pexels.com/hc/en-us/categories/900001326143-API) or email us at [api@pexels.com](mailto: api@pexels.com).

**Note:** For historical reasons, all endpoints begin with `https://api.pexels.com/v1/` except for video endpoints, which begin with `https://api.pexels.com/videos/`. Please see the individual endpoints listed below for more details about how to call each endpoint.

[

Guidelines
----------

](#guidelines)

Whenever you are doing an API request make sure to show a **prominent link to Pexels**. You can use a text link (e.g. "Photos provided by Pexels") or a link with our logo.

Always credit our photographers when possible (e.g. "Photo by John Doe on Pexels" with a link to the photo page on Pexels).

You may not copy or replicate core functionality of Pexels (including making Pexels content available as a wallpaper app).

Do not abuse the API. By default, the API is rate-limited to 200 requests per hour and 20,000 requests per month. [You may contact us to request a higher limit](mailto:api@pexels.com), but please include examples, or be prepared to give a demo, that clearly shows your use of the API with attribution. If you meet our API terms, you can get unlimited requests for free.

Abuse of the Pexels API, including but not limited to attempting to work around the rate limit, will lead to termination of your API access.

Pagination
----------

](#pagination)

Most Pexels API requests return multiple records at once. All of these endpoints are paginated, and can return a maximum of **80** requests at one time. Each paginated request accepts the same parameters and returns the same pagination data in the response.

**Note:** The `prev_page` and `next_page` response attributes will only be returned if there is a corresponding page.

Pagination Request Parameters

Copy

1

GET https://api.pexels.com/v1/curated?page=2&per_page=40

Pagination Response Attributes

{
  "page": 2,
  "per_page": 40,
  "total_results": 8000,
  "next_page": "https://api.pexels.com/v1/curated?page=3&per_page=40",
  "prev_page": "https://api.pexels.com/v1/curated?page=1&per_page=40"
}

[

The Photo Resource
------------------

](#photos-overview)

The `Photo` resource is a JSON formatted version of a Pexels photo. The Photo API endpoints respond with the photo data formatted in this shape.

[

#### Response

](#photos-overview__response)

*   [
    
    id_
    
    integer
    
    _
    
    ](#photos-overview__response__id)
    
    The id of the photo.
    
*   [
    
    width_
    
    integer
    
    _
    
    ](#photos-overview__response__width)
    
    The real width of the photo in pixels.
    
*   [
    
    height_
    
    integer
    
    _
    
    ](#photos-overview__response__height)
    
    The real height of the photo in pixels.
    
*   [
    
    url_
    
    string
    
    _
    
    ](#photos-overview__response__url)
    
    The Pexels URL where the photo is located.
    
*   [
    
    photographer_
    
    string
    
    _
    
    ](#photos-overview__response__photographer)
    
    The name of the photographer who took the photo.
    
*   [
    
    photographer_url_
    
    string
    
    _
    
    ](#photos-overview__response__photographer_url)
    
    The URL of the photographer's Pexels profile.
    
*   [
    
    photographer_id_
    
    integer
    
    _
    
    ](#photos-overview__response__photographer_id)
    
    The id of the photographer.
    
*   [
    
    avg_color_
    
    string
    
    _
    
    ](#photos-overview__response__avg_color)
    
    The average color of the photo. Useful for a placeholder while the image loads.
    
*   [
    
    src_
    
    object
    
    _
    
    ](#photos-overview__response__src)
    
    An assortment of different image sizes that can be used to display this `Photo`.
    
    Show Children
    *   [
        
        original_
        
        string
        
        _
        
        ](#photos-overview__response__src____original)
        
        The image without any size changes. It will be the same as the `width` and `height` attributes.
        
    *   [
        
        large_
        
        string
        
        _
        
        ](#photos-overview__response__src____large)
        
        The image resized to `W 940px X H 650px` `DPR 1`.
        
    *   [
        
        large2x_
        
        string
        
        _
        
        ](#photos-overview__response__src____large2x)
        
        The image resized `W 940px X H 650px` `DPR 2`.
        
    *   [
        
        medium_
        
        string
        
        _
        
        ](#photos-overview__response__src____medium)
        
        The image scaled proportionally so that it's new height is `350px`.
        
    *   [
        
        small_
        
        string
        
        _
        
        ](#photos-overview__response__src____small)
        
        The image scaled proportionally so that it's new height is `130px`.
        
    *   [
        
        portrait_
        
        string
        
        _
        
        ](#photos-overview__response__src____portrait)
        
        The image cropped to `W 800px X H 1200px`.
        
    *   [
        
        landscape_
        
        string
        
        _
        
        ](#photos-overview__response__src____landscape)
        
        The image cropped to `W 1200px X H 627px`.
        
    *   [
        
        tiny_
        
        string
        
        _
        
        ](#photos-overview__response__src____tiny)
        
        The image cropped to `W 280px X H 200px`.
        
*   [
    
    alt_
    
    string
    
    _
    
    ](#photos-overview__response__alt)
    
    Text description of the photo for use in the `alt` attribute.
    

The Photo Resource

{
  "id": 2014422,
  "width": 3024,
  "height": 3024,
  "url": "https://www.pexels.com/photo/brown-rocks-during-golden-hour-2014422/",
  "photographer": "Joey Farina",
  "photographer_url": "https://www.pexels.com/@joey",
  "photographer_id": 680589,
  "avg_color": "#978E82",
  "src": {
    "original": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg",
    "large2x": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "large": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "medium": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=350",
    "small": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=130",
    "portrait": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "landscape": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "tiny": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
  },
  "liked": false,
  "alt": "Brown Rocks During Golden Hour"
}

[

Search for Photos
-----------------

### `GET https://api.pexels.com/v1/search`

](#photos-search)

This endpoint enables you to search Pexels for any topic that you would like. For example your query could be something broad like `Nature`, `Tigers`, `People`. Or it could be something specific like `Group of people working`.

[

#### Parameters

](#photos-search__parameters)

*   [
    
    query_
    
    string | required
    
    _
    
    ](#photos-search__parameters__query)
    
    The search query. `Ocean`, `Tigers`, `Pears`, etc.
    
*   [
    
    orientation_
    
    string | optional
    
    _
    
    ](#photos-search__parameters__orientation)
    
    Desired photo orientation. The current supported orientations are: `landscape`, `portrait` or `square`.
    
*   [
    
    size_
    
    string | optional
    
    _
    
    ](#photos-search__parameters__size)
    
    Minimum photo size. The current supported sizes are: `large`(24MP), `medium`(12MP) or `small`(4MP).
    
*   [
    
    color_
    
    string | optional
    
    _
    
    ](#photos-search__parameters__color)
    
    Desired photo color. Supported colors: `red`, `orange`, `yellow`, `green`, `turquoise`, `blue`, `violet`, `pink`, `brown`, `black`, `gray`, `white` or any hexidecimal color code (eg. `#ffffff`).
    
*   [
    
    locale_
    
    string | optional
    
    _
    
    ](#photos-search__parameters__locale)
    
    The locale of the search you are performing. The current supported locales are: <%= I18n.available_locales.map { |locale| %(`') + locale.to_s + %('`) }.join(' ') %>.
    
*   [
    
    page_
    
    integer | optional
    
    _
    
    ](#photos-search__parameters__page)
    
    The page number you are requesting. `Default: 1`
    
*   [
    
    per_page_
    
    integer | optional
    
    _
    
    ](#photos-search__parameters__per_page)
    
    The number of results you are requesting per page. `Default: 15` `Max: 80`
    

[

#### Response

](#photos-search__response)

*   [
    
    photos_
    
    array of `Photo`
    
    _
    
    ](#photos-search__response__photos)
    
    An array of `Photo` objects.
    
*   [
    
    page_
    
    integer
    
    _
    
    ](#photos-search__response__page)
    
    The current page number.
    
*   [
    
    per_page_
    
    integer
    
    _
    
    ](#photos-search__response__per_page)
    
    The number of results returned with each page.
    
*   [
    
    total_results_
    
    integer
    
    _
    
    ](#photos-search__response__total_results)
    
    The total number of results for the request.
    
*   [
    
    prev_page_
    
    string | optional
    
    _
    
    ](#photos-search__response__prev_page)
    
    URL for the previous page of results, if applicable.
    
*   [
    
    next_page_
    
    string | optional
    
    _
    
    ](#photos-search__response__next_page)
    
    URL for the next page of results, if applicable.
    

Example Request

Bash JavaScript Ruby .Net Copy

1
2

curl -H "Authorization: YOUR_API_KEY" 
  "https://api.pexels.com/v1/search?query=nature&per_page=1"


import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');
const query = 'Nature';

client.photos.search({ query, per_page: 1 }).then(photos => {...});


require "pexels"

client = Pexels::Client.new("YOUR_API_KEY")

client.photos.search("Nature", per_page: 1).each do |photo|
  # ...
end


import PexelsDotNetSDK.Api;

var pexelsClient = new PexelsClient("YOUR_API_KEY");
var result = await pexelsClient.SearchPhotosAsync("Nature");

Example Response

{
  "total_results": 10000,
  "page": 1,
  "per_page": 1,
  "photos": [
    {
      "id": 3573351,
      "width": 3066,
      "height": 3968,
      "url": "https://www.pexels.com/photo/trees-during-day-3573351/",
      "photographer": "Lukas Rodriguez",
      "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331",
      "photographer_id": 1845331,
      "avg_color": "#374824",
      "src": {
        "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
        "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
        "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
        "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
        "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
      },
      "liked": false,
      "alt": "Brown Rocks During Golden Hour"
    }
  ],
  "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"
}

[

Curated Photos
--------------

### `GET https://api.pexels.com/v1/curated`

](#photos-curated)

This endpoint enables you to receive real-time photos curated by the Pexels team.

We add at least one new photo per hour to our curated list so that you always get a changing selection of trending photos.

[

#### Parameters

](#photos-curated__parameters)

*   [
    
    page_
    
    integer | optional
    
    _
    
    ](#photos-curated__parameters__page)
    
    The page number you are requesting. `Default: 1`
    
*   [
    
    per_page_
    
    integer | optional
    
    _
    
    ](#photos-curated__parameters__per_page)
    
    The number of results you are requesting per page. `Default: 15` `Max: 80`
    

[

#### Response

](#photos-curated__response)

*   [
    
    photos_
    
    array of `Photo`
    
    _
    
    ](#photos-curated__response__photos)
    
    An array of `Photo` objects.
    
*   [
    
    page_
    
    integer
    
    _
    
    ](#photos-curated__response__page)
    
    The current page number.
    
*   [
    
    per_page_
    
    integer
    
    _
    
    ](#photos-curated__response__per_page)
    
    The number of results returned with each page.
    
*   [
    
    total_results_
    
    integer
    
    _
    
    ](#photos-curated__response__total_results)
    
    The total number of results for the request.
    
*   [
    
    prev_page_
    
    string | optional
    
    _
    
    ](#photos-curated__response__prev_page)
    
    URL for the previous page of results, if applicable.
    
*   [
    
    next_page_
    
    string | optional
    
    _
    
    ](#photos-curated__response__next_page)
    
    URL for the next page of results, if applicable.
    

Example Request

Bash JavaScript Ruby .Net Copy

curl -H "Authorization: YOUR_API_KEY" 
  "https://api.pexels.com/v1/curated?per_page=1"


import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.photos.curated({ per_page: 1 }).then(photos => {...});

require "pexels"

client = Pexels::Client.new("YOUR_API_KEY")

client.photos.curated(per_page: 1).each do |photo|
  # ...
end


import PexelsDotNetSDK.Api;

var pexelsClient = new PexelsClient("YOUR_API_KEY");
var result = await pexelsClient.CuratedPhotosAsync(pageSize: 15);

Example Response

{
  "page": 1,
  "per_page": 1,
  "photos": [
    {
      "id": 2880507,
      "width": 4000,
      "height": 6000,
      "url": "https://www.pexels.com/photo/woman-in-white-long-sleeved-top-and-skirt-standing-on-field-2880507/",
      "photographer": "Deden Dicky Ramdhani",
      "photographer_url": "https://www.pexels.com/@drdeden88",
      "photographer_id": 1378810,
      "avg_color": "#7E7F7B",
      "src": {
        "original": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg",
        "large2x": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "large": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "medium": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&h=350",
        "small": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&h=130",
        "portrait": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
        "landscape": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        "tiny": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
      },
      "liked": false,
      "alt": "Brown Rocks During Golden Hour"
    }
  ],
  "next_page": "https://api.pexels.com/v1/curated/?page=2&per_page=1"
}

[

Get a Photo
-----------

### `GET https://api.pexels.com/v1/photos/:id`

](#photos-show)

Retrieve a specific `Photo` from its id.

[

#### Parameters

](#photos-show__parameters)

*   [
    
    id_
    
    integer | required
    
    _
    
    ](#photos-show__parameters__id)
    
    The id of the photo you are requesting.
    

[

#### Response

](#photos-show__response)

Returns a `Photo` object

Example Request

Bash JavaScript Ruby .Net Copy

1
2

curl -H "Authorization: YOUR_API_KEY" 
  "https://api.pexels.com/v1/photos/2014422"

import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.photos.show({ id: 2014422 }).then(photo => {...});

require "pexels"

client = Pexels::Client.new("YOUR_API_KEY")

client.photos.find(2014422)
# or
client.photos[2014422]

import PexelsDotNetSDK.Api;

var pexelsClient = new PexelsClient("YOUR_API_KEY");
var result = await pexelsClient.GetPhotoAsync(2014422);

Example Response

{
  "id": 2014422,
  "width": 3024,
  "height": 3024,
  "url": "https://www.pexels.com/photo/brown-rocks-during-golden-hour-2014422/",
  "photographer": "Joey Farina",
  "photographer_url": "https://www.pexels.com/@joey",
  "photographer_id": 680589,
  "avg_color": "#978E82",
  "src": {
    "original": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg",
    "large2x": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "large": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    "medium": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=350",
    "small": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=130",
    "portrait": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "landscape": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "tiny": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
  },
  "liked": false,
  "alt": "Brown Rocks During Golden Hour"
}

[

The Video Resource
------------------

](#videos-overview)

The `Video` resource is a JSON formatted version of a Pexels video. The Video API endpoints respond with the video data formatted in this shape.

[

#### Response

](#videos-overview__response)

*   [
    
    id_
    
    integer
    
    _
    
    ](#videos-overview__response__id)
    
    The id of the video.
    
*   [
    
    width_
    
    integer
    
    _
    
    ](#videos-overview__response__width)
    
    The real width of the video in pixels.
    
*   [
    
    height_
    
    integer
    
    _
    
    ](#videos-overview__response__height)
    
    The real height of the video in pixels.
    
*   [
    
    url_
    
    string
    
    _
    
    ](#videos-overview__response__url)
    
    The Pexels URL where the video is located.
    
*   [
    
    image_
    
    string
    
    _
    
    ](#videos-overview__response__image)
    
    URL to a screenshot of the video.
    
*   [
    
    duration_
    
    integer
    
    _
    
    ](#videos-overview__response__duration)
    
    The duration of the video in seconds.
    
*   [
    
    user_
    
    object
    
    _
    
    ](#videos-overview__response__user)
    
    The videographer who shot the video.
    
    Show Children
    *   [
        
        id_
        
        integer
        
        _
        
        ](#videos-overview__response__user____id)
        
        The id of the videographer.
        
    *   [
        
        name_
        
        string
        
        _
        
        ](#videos-overview__response__user____name)
        
        The name of the videographer.
        
    *   [
        
        url_
        
        string
        
        _
        
        ](#videos-overview__response__user____url)
        
        The URL of the videographer's Pexels profile.
        
*   [
    
    video_files_
    
    Array of objects
    
    _
    
    ](#videos-overview__response__video_files)
    
    An array of different sized versions of the video.
    
    Show Children
    *   [
        
        id_
        
        integer
        
        _
        
        ](#videos-overview__response__video_files____id)
        
        The id of the `video_file`.
        
    *   [
        
        quality_
        
        `'hd'` or `'sd'`
        
        _
        
        ](#videos-overview__response__video_files____quality)
        
        The video quality of the `video_file`.
        
    *   [
        
        file_type_
        
        string
        
        _
        
        ](#videos-overview__response__video_files____file_type)
        
        The video format of the `video_file`.
        
    *   [
        
        width_
        
        integer
        
        _
        
        ](#videos-overview__response__video_files____width)
        
        The width of the `video_file` in pixels.
        
    *   [
        
        height_
        
        integer
        
        _
        
        ](#videos-overview__response__video_files____height)
        
        The height of the `video_file` in pixels.
        
    *   [
        
        fps_
        
        number
        
        _
        
        ](#videos-overview__response__video_files____fps)
        
        The number of frames per second of the `video_file`.
        
    *   [
        
        link_
        
        string
        
        _
        
        ](#videos-overview__response__video_files____link)
        
        A link to where the `video_file` is hosted.
        
*   [
    
    video_pictures_
    
    Array of objects
    
    _
    
    ](#videos-overview__response__video_pictures)
    
    An array of preview pictures of the video.
    
    Show Children
    *   [
        
        id_
        
        integer
        
        _
        
        ](#videos-overview__response__video_pictures____id)
        
        The id of the `video_picture`.
        
    *   [
        
        picture_
        
        string
        
        _
        
        ](#videos-overview__response__video_pictures____picture)
        
        A link to the preview image.
        
    *   [
        
        nr_
        
        integer
        
        _
        
        ](#videos-overview__response__video_pictures____nr)
        

The Video Resource

{
  "id": 2499611,
  "width": 1080,
  "height": 1920,
  "url": "https://www.pexels.com/video/2499611/",
  "image": "https://images.pexels.com/videos/2499611/free-video-2499611.jpg?fit=crop&w=1200&h=630&auto=compress&cs=tinysrgb",
  "full_res": null,
  "tags": [],
  "duration": 22,
  "user": {
    "id": 680589,
    "name": "Joey Farina",
    "url": "https://www.pexels.com/@joey"
  },
  "video_files": [
    {
      "id": 125004,
      "quality": "hd",
      "file_type": "video/mp4",
      "width": 1080,
      "height": 1920,
      "fps": 23.976,
      "link": "https://player.vimeo.com/external/342571552.hd.mp4?s=6aa6f164de3812abadff3dde86d19f7a074a8a66&profile_id=175&oauth2_token_id=57447761"
    },
    {
      "id": 125005,
      "quality": "sd",
      "file_type": "video/mp4",
      "width": 540,
      "height": 960,
      "fps": 23.976,
      "link": "https://player.vimeo.com/external/342571552.sd.mp4?s=e0df43853c25598dfd0ec4d3f413bce1e002deef&profile_id=165&oauth2_token_id=57447761"
    },
    {
      "id": 125006,
      "quality": "sd",
      "file_type": "video/mp4",
      "width": 240,
      "height": 426,
      "fps": 23.976,
      "link": "https://player.vimeo.com/external/342571552.sd.mp4?s=e0df43853c25598dfd0ec4d3f413bce1e002deef&profile_id=139&oauth2_token_id=57447761"
    }
    ...
  ],
  "video_pictures": [
    {
      "id": 308178,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-0.jpg",
      "nr": 0
    },
    {
      "id": 308179,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-1.jpg",
      "nr": 1
    },
    {
      "id": 308180,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-2.jpg",
      "nr": 2
    },
    {
      "id": 308181,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-3.jpg",
      "nr": 3
    }
    ...
  ]
}

[

Search for Videos
-----------------

### `GET https://api.pexels.com/videos/search`

](#videos-search)

This endpoint enables you to search Pexels for any topic that you would like. For example your query could be something broad like `Nature`, `Tigers`, `People`. Or it could be something specific like `Group of people working`.

[

#### Parameters

](#videos-search__parameters)

*   [
    
    query_
    
    string | required
    
    _
    
    ](#videos-search__parameters__query)
    
    The search query. `Ocean`, `Tigers`, `Pears`, etc.
    
*   [
    
    orientation_
    
    string | optional
    
    _
    
    ](#videos-search__parameters__orientation)
    
    Desired video orientation. The current supported orientations are: `landscape`, `portrait` or `square`.
    
*   [
    
    size_
    
    string | optional
    
    _
    
    ](#videos-search__parameters__size)
    
    Minimum video size. The current supported sizes are: `large`(4K), `medium`(Full HD) or `small`(HD).
    
*   [
    
    locale_
    
    string | optional
    
    _
    
    ](#videos-search__parameters__locale)
    
    The locale of the search you are performing. The current supported locales are: <%= I18n.available_locales.map { |locale| %(`') + locale.to_s + %('`) }.join(' ') %>.
    
*   [
    
    page_
    
    integer | optional
    
    _
    
    ](#videos-search__parameters__page)
    
    The page number you are requesting. `Default: 1`
    
*   [
    
    per_page_
    
    integer | optional
    
    _
    
    ](#videos-search__parameters__per_page)
    
    The number of results you are requesting per page. `Default: 15` `Max: 80`
    

[

#### Response

](#videos-search__response)

*   [
    
    videos_
    
    array of `Video`
    
    _
    
    ](#videos-search__response__videos)
    
    An array of `Video` objects.
    
*   [
    
    url_
    
    string
    
    _
    
    ](#videos-search__response__url)
    
    The Pexels URL for the current search query.
    
*   [
    
    page_
    
    integer
    
    _
    
    ](#videos-search__response__page)
    
    The current page number.
    
*   [
    
    per_page_
    
    integer
    
    _
    
    ](#videos-search__response__per_page)
    
    The number of results returned with each page.
    
*   [
    
    total_results_
    
    integer
    
    _
    
    ](#videos-search__response__total_results)
    
    The total number of results for the request.
    
*   [
    
    prev_page_
    
    string | optional
    
    _
    
    ](#videos-search__response__prev_page)
    
    URL for the previous page of results, if applicable.
    
*   [
    
    next_page_
    
    string | optional
    
    _
    
    ](#videos-search__response__next_page)
    
    URL for the next page of results, if applicable.
    

Example Request

Bash JavaScript Ruby .Net Copy


curl -H "Authorization: YOUR_API_KEY" 
  "https://api.pexels.com/videos/search?query=nature&per_page=1"


import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');
const query = 'Nature';

client.videoes.search({ query, per_page: 1 }).then(videos => {...});


require "pexels"

client = Pexels::Client.new("YOUR_API_KEY")

client.videos.search("Nature", per_page: 1).each do |video|
  # ...
end

import PexelsDotNetSDK.Api;

var pexelsClient = new PexelsClient("YOUR_API_KEY");
var result = await pexelsClient.SearchVideosAsync("Nature");

Example Response

{
  "page": 1,
  "per_page": 1,
  "total_results": 20475,
  "url": "https://www.pexels.com/videos/",
  "videos": [
    {
      "id": 1448735,
      "width": 4096,
      "height": 2160,
      "url": "https://www.pexels.com/video/video-of-forest-1448735/",
      "image": "https://images.pexels.com/videos/1448735/free-video-1448735.jpg?fit=crop&w=1200&h=630&auto=compress&cs=tinysrgb",
      "duration": 32,
      "user": {
        "id": 574687,
        "name": "Ruvim Miksanskiy",
        "url": "https://www.pexels.com/@digitech"
      },
      "video_files": [
        {
          "id": 58649,
          "quality": "sd",
          "file_type": "video/mp4",
          "width": 640,
          "height": 338,
          "link": "https://player.vimeo.com/external/291648067.sd.mp4?s=7f9ee1f8ec1e5376027e4a6d1d05d5738b2fbb29&profile_id=164&oauth2_token_id=57447761"
        },
        {
          "id": 58650,
          "quality": "hd",
          "file_type": "video/mp4",
          "width": 2048,
          "height": 1080,
          "link": "https://player.vimeo.com/external/291648067.hd.mp4?s=94998971682c6a3267e4cbd19d16a7b6c720f345&profile_id=175&oauth2_token_id=57447761"
        },
        {
          "id": 58651,
          "quality": "hd",
          "file_type": "video/mp4",
          "width": 4096,
          "height": 2160,
          "link": "https://player.vimeo.com/external/291648067.hd.mp4?s=94998971682c6a3267e4cbd19d16a7b6c720f345&profile_id=172&oauth2_token_id=57447761"
        },
        {
          "id": 58652,
          "quality": "hd",
          "file_type": "video/mp4",
          "width": 1366,
          "height": 720,
          "link": "https://player.vimeo.com/external/291648067.hd.mp4?s=94998971682c6a3267e4cbd19d16a7b6c720f345&profile_id=174&oauth2_token_id=57447761"
        },
        {
          "id": 58653,
          "quality": "hd",
          "file_type": "video/mp4",
          "width": 2732,
          "height": 1440,
          "link": "https://player.vimeo.com/external/291648067.hd.mp4?s=94998971682c6a3267e4cbd19d16a7b6c720f345&profile_id=170&oauth2_token_id=57447761"
        },
        {
          "id": 58654,
          "quality": "sd",
          "file_type": "video/mp4",
          "width": 960,
          "height": 506,
          "link": "https://player.vimeo.com/external/291648067.sd.mp4?s=7f9ee1f8ec1e5376027e4a6d1d05d5738b2fbb29&profile_id=165&oauth2_token_id=57447761"
        },
        {
          "id": 58655,
          "quality": "hls",
          "file_type": "video/mp4",
          "width": null,
          "height": null,
          "link": "https://player.vimeo.com/external/291648067.m3u8?s=1210fac9d80f9b74b4a334c4fca327cde08886b2&oauth2_token_id=57447761"
        }
      ],
      "video_pictures": [
        {
          "id": 133236,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-0.jpg",
          "nr": 0
        },
        {
          "id": 133237,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-1.jpg",
          "nr": 1
        },
        {
          "id": 133238,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-2.jpg",
          "nr": 2
        },
        {
          "id": 133239,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-3.jpg",
          "nr": 3
        },
        {
          "id": 133240,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-4.jpg",
          "nr": 4
        },
        {
          "id": 133241,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-5.jpg",
          "nr": 5
        },
        {
          "id": 133242,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-6.jpg",
          "nr": 6
        },
        {
          "id": 133243,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-7.jpg",
          "nr": 7
        },
        {
          "id": 133244,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-8.jpg",
          "nr": 8
        },
        {
          "id": 133245,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-9.jpg",
          "nr": 9
        },
        {
          "id": 133246,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-10.jpg",
          "nr": 10
        },
        {
          "id": 133247,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-11.jpg",
          "nr": 11
        },
        {
          "id": 133248,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-12.jpg",
          "nr": 12
        },
        {
          "id": 133249,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-13.jpg",
          "nr": 13
        },
        {
          "id": 133250,
          "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-14.jpg",
          "nr": 14
        }
      ]
    }
  ]
}

[

Popular Videos
--------------

### `GET https://api.pexels.com/videos/popular`

](#videos-popular)

This endpoint enables you to receive the current popular Pexels videos.

[

#### Parameters

](#videos-popular__parameters)

*   [
    
    min_width_
    
    integer | optional
    
    _
    
    ](#videos-popular__parameters__min_width)
    
    The minimum width in pixels of the returned videos.
    
*   [
    
    min_height_
    
    integer | optional
    
    _
    
    ](#videos-popular__parameters__min_height)
    
    The minimum height in pixels of the returned videos.
    
*   [
    
    min_duration_
    
    integer | optional
    
    _
    
    ](#videos-popular__parameters__min_duration)
    
    The minimum duration in seconds of the returned videos.
    
*   [
    
    max_duration_
    
    integer | optional
    
    _
    
    ](#videos-popular__parameters__max_duration)
    
    The maximum duration in seconds of the returned videos.
    
*   [
    
    page_
    
    integer | optional
    
    _
    
    ](#videos-popular__parameters__page)
    
    The page number you are requesting. `Default: 1`
    
*   [
    
    per_page_
    
    integer | optional
    
    _
    
    ](#videos-popular__parameters__per_page)
    
    The number of results you are requesting per page. `Default: 15` `Max: 80`
    

[

#### Response

](#videos-popular__response)

*   [
    
    videos_
    
    array of `Video`
    
    _
    
    ](#videos-popular__response__videos)
    
    An array of `Video` objects.
    
*   [
    
    url_
    
    string
    
    _
    
    ](#videos-popular__response__url)
    
    The Pexels URL for the current page.
    
*   [
    
    page_
    
    integer
    
    _
    
    ](#videos-popular__response__page)
    
    The current page number.
    
*   [
    
    per_page_
    
    integer
    
    _
    
    ](#videos-popular__response__per_page)
    
    The number of results returned with each page.
    
*   [
    
    total_results_
    
    integer
    
    _
    
    ](#videos-popular__response__total_results)
    
    The total number of results for the request.
    
*   [
    
    prev_page_
    
    string | optional
    
    _
    
    ](#videos-popular__response__prev_page)
    
    URL for the previous page of results, if applicable.
    
*   [
    
    next_page_
    
    string | optional
    
    _
    
    ](#videos-popular__response__next_page)
    
    URL for the next page of results, if applicable.
    

Example Request

Bash JavaScript Ruby .Net Copy

curl -H "Authorization: YOUR_API_KEY" 
  "https://api.pexels.com/videos/popular?per_page=1"


import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.videos.popular({ per_page: 1 }).then(videos => {...});

require "pexels"

client = Pexels::Client.new("YOUR_API_KEY")

client.videos.popular(per_page: 1).each do |video|
  # ...
end

import PexelsDotNetSDK.Api;

var pexelsClient = new PexelsClient("YOUR_API_KEY");
var result = await pexelsClient.PopularVideosAsync(pageSize: 15);

Example Response

{
  "page": 1,
  "per_page": 1,
  "total_results": 4089,
  "url": "https://www.pexels.com/search/videos/Nature/",
  "videos": [
    {
      "id": 1093662,
      "width": 1920,
      "height": 1080,
      "url": "https://www.pexels.com/video/water-crashing-over-the-rocks-1093662/",
      "image": "https://images.pexels.com/videos/1093662/free-video-1093662.jpg?fit=crop&w=1200&h=630&auto=compress&cs=tinysrgb",
      "duration": 8,
      "user": {
        "id": 417939,
        "name": "Peter Fowler",
        "url": "https://www.pexels.com/@peter-fowler-417939"
      },
      "video_files": [
        {
          "id": 37101,
          "quality": "hd",
          "file_type": "video/mp4",
          "width": 1280,
          "height": 720,
          "link": "https://player.vimeo.com/external/269971860.hd.mp4?s=eae965838585cc8342bb5d5253d06a52b2415570&profile_id=174&oauth2_token_id=57447761"
        },
        {
          "id": 37102,
          "quality": "sd",
          "file_type": "video/mp4",
          "width": 640,
          "height": 360,
          "link": "https://player.vimeo.com/external/269971860.sd.mp4?s=a3036bd1a9f15c1b31daedad98c06a3b24cdd747&profile_id=164&oauth2_token_id=57447761"
        },
        {
          "id": 37103,
          "quality": "hd",
          "file_type": "video/mp4",
          "width": 1920,
          "height": 1080,
          "link": "https://player.vimeo.com/external/269971860.hd.mp4?s=eae965838585cc8342bb5d5253d06a52b2415570&profile_id=175&oauth2_token_id=57447761"
        },
        {
          "id": 37104,
          "quality": "sd",
          "file_type": "video/mp4",
          "width": 960,
          "height": 540,
          "link": "https://player.vimeo.com/external/269971860.sd.mp4?s=a3036bd1a9f15c1b31daedad98c06a3b24cdd747&profile_id=165&oauth2_token_id=57447761"
        },
        {
          "id": 37105,
          "quality": "hls",
          "file_type": "video/mp4",
          "width": null,
          "height": null,
          "link": "https://player.vimeo.com/external/269971860.m3u8?s=ac08929c597387cc77ae3d88bfe2ad66a9c4d31f&oauth2_token_id=57447761"
        }
      ],
      "video_pictures": [
        {
          "id": 79696,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-0.jpg",
          "nr": 0
        },
        {
          "id": 79697,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-1.jpg",
          "nr": 1
        },
        {
          "id": 79698,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-2.jpg",
          "nr": 2
        },
        {
          "id": 79699,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-3.jpg",
          "nr": 3
        },
        {
          "id": 79700,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-4.jpg",
          "nr": 4
        },
        {
          "id": 79701,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-5.jpg",
          "nr": 5
        },
        {
          "id": 79702,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-6.jpg",
          "nr": 6
        },
        {
          "id": 79703,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-7.jpg",
          "nr": 7
        },
        {
          "id": 79704,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-8.jpg",
          "nr": 8
        },
        {
          "id": 79705,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-9.jpg",
          "nr": 9
        },
        {
          "id": 79706,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-10.jpg",
          "nr": 10
        },
        {
          "id": 79707,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-11.jpg",
          "nr": 11
        },
        {
          "id": 79708,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-12.jpg",
          "nr": 12
        },
        {
          "id": 79709,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-13.jpg",
          "nr": 13
        },
        {
          "id": 79710,
          "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-14.jpg",
          "nr": 14
        }
      ]
    }
  ]
}

[

Get a Video
-----------

### `GET https://api.pexels.com/videos/videos/:id`

](#videos-show)

Retrieve a specific `Video` from its id.

[

#### Parameters

](#videos-show__parameters)

*   [
    
    id_
    
    integer | required
    
    _
    
    ](#videos-show__parameters__id)
    
    The id of the video you are requesting.
    

[

#### Response

](#videos-show__response)

Returns a `Video` object

Example Request

Bash JavaScript Ruby .Net Copy


curl -H "Authorization: YOUR_API_KEY" 
  "https://api.pexels.com/videos/videos/2499611"


import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.photos.show({ id: 2499611 }).then(photo => {...});


require "pexels"

client = Pexels::Client.new("YOUR_API_KEY")

client.videos.find(2499611)
# or
client.videos[2499611]

import PexelsDotNetSDK.Api;

var pexelsClient = new PexelsClient("YOUR_API_KEY");
var result = await pexelsClient.GetVideoAsync(2499611);

Example Response

{
  "id": 2499611,
  "width": 1080,
  "height": 1920,
  "url": "https://www.pexels.com/video/2499611/",
  "image": "https://images.pexels.com/videos/2499611/free-video-2499611.jpg?fit=crop&w=1200&h=630&auto=compress&cs=tinysrgb",
  "duration": 22,
  "user": {
    "id": 680589,
    "name": "Joey Farina",
    "url": "https://www.pexels.com/@joey"
  },
  "video_files": [
    {
      "id": 125004,
      "quality": "hd",
      "file_type": "video/mp4",
      "width": 1080,
      "height": 1920,
      "link": "https://player.vimeo.com/external/342571552.hd.mp4?s=6aa6f164de3812abadff3dde86d19f7a074a8a66&profile_id=175&oauth2_token_id=57447761"
    },
    {
      "id": 125005,
      "quality": "sd",
      "file_type": "video/mp4",
      "width": 540,
      "height": 960,
      "link": "https://player.vimeo.com/external/342571552.sd.mp4?s=e0df43853c25598dfd0ec4d3f413bce1e002deef&profile_id=165&oauth2_token_id=57447761"
    },
    {
      "id": 125006,
      "quality": "sd",
      "file_type": "video/mp4",
      "width": 240,
      "height": 426,
      "link": "https://player.vimeo.com/external/342571552.sd.mp4?s=e0df43853c25598dfd0ec4d3f413bce1e002deef&profile_id=139&oauth2_token_id=57447761"
    },
    {
      "id": 125007,
      "quality": "hd",
      "file_type": "video/mp4",
      "width": 720,
      "height": 1280,
      "link": "https://player.vimeo.com/external/342571552.hd.mp4?s=6aa6f164de3812abadff3dde86d19f7a074a8a66&profile_id=174&oauth2_token_id=57447761"
    },
    {
      "id": 125008,
      "quality": "sd",
      "file_type": "video/mp4",
      "width": 360,
      "height": 640,
      "link": "https://player.vimeo.com/external/342571552.sd.mp4?s=e0df43853c25598dfd0ec4d3f413bce1e002deef&profile_id=164&oauth2_token_id=57447761"
    },
    {
      "id": 125009,
      "quality": "hls",
      "file_type": "video/mp4",
      "width": null,
      "height": null,
      "link": "https://player.vimeo.com/external/342571552.m3u8?s=53433233e4176eead03ddd6fea04d9fb2bce6637&oauth2_token_id=57447761"
    }
  ],
  "video_pictures": [
    {
      "id": 308178,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-0.jpg",
      "nr": 0
    },
    {
      "id": 308179,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-1.jpg",
      "nr": 1
    },
    {
      "id": 308180,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-2.jpg",
      "nr": 2
    },
    {
      "id": 308181,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-3.jpg",
      "nr": 3
    },
    {
      "id": 308182,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-4.jpg",
      "nr": 4
    },
    {
      "id": 308183,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-5.jpg",
      "nr": 5
    },
    {
      "id": 308184,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-6.jpg",
      "nr": 6
    },
    {
      "id": 308185,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-7.jpg",
      "nr": 7
    },
    {
      "id": 308186,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-8.jpg",
      "nr": 8
    },
    {
      "id": 308187,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-9.jpg",
      "nr": 9
    },
    {
      "id": 308188,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-10.jpg",
      "nr": 10
    },
    {
      "id": 308189,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-11.jpg",
      "nr": 11
    },
    {
      "id": 308190,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-12.jpg",
      "nr": 12
    },
    {
      "id": 308191,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-13.jpg",
      "nr": 13
    },
    {
      "id": 308192,
      "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-14.jpg",
      "nr": 14
    }
  ]
}

