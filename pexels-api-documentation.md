Title: Free stock photos · Pexels

URL Source: https://www.pexels.com/api/documentation/?language=javascript

Markdown Content:
[Introduction ------------](https://www.pexels.com/api/documentation/?language=javascript#introduction)
The Pexels API enables programmatic access to the full Pexels content library, including photos, videos. All content is available free of charge, and you are welcome to use Pexels content for anything you'd like, as long as it is within our [Title](https://www.pexels.com/api/documentation/?language=javascript#guidelines).

The Pexels API is a RESTful JSON API, and you can interact with it from any language or framework with a HTTP library. Alternately, Pexels maintains some official [Title](https://www.pexels.com/api/documentation/?language=javascript#client_libraries) you can use.

Introduction
The Pexels API enables programmatic access to the full Pexels content library, including photos, videos. All content is available free of charge, and you are welcome to use Pexels content for anything you'd like, as long as it is within our Title.

The Pexels API is a RESTful JSON API, and you can interact with it from any language or framework with a HTTP library. Alternately, Pexels maintains some official Title you can use.

Note: For historical reasons, all endpoints begin with https://api.pexels.com/v1/ except for video endpoints, which begin with https://api.pexels.com/videos/. Please see the individual endpoints listed below for more details about how to call each endpoint.

Example of Rate Limit Headers

X-Ratelimit-Limit: 20000
X-Ratelimit-Remaining: 19684
X-Ratelimit-Reset: 1590529646

[The Photo Resource ------------------](https://www.pexels.com/api/documentation/?language=javascript#photos-overview)
The `Photo` resource is a JSON formatted version of a Pexels photo. The Photo API endpoints respond with the photo data formatted in this shape.

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response)
*   [id _integer_](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response__id)
The id of the photo.

*   [width _integer_](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response__width)
The real width of the photo in pixels.

*   [height _integer_](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response__height)
The real height of the photo in pixels.

*   [url _string_](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response__url)
The Pexels URL where the photo is located.

*   [photographer _string_](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response__photographer)
The name of the photographer who took the photo.

*   [photographer_url _string_](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response__photographer_url)
The URL of the photographer's Pexels profile.

*   [photographer_id _integer_](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response__photographer_id)
The id of the photographer.

*   [avg_color _string_](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response__avg_color)
The average color of the photo. Useful for a placeholder while the image loads.

*   [src _object_](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response__src)
An assortment of different image sizes that can be used to display this `Photo`.

*   [alt _string_](https://www.pexels.com/api/documentation/?language=javascript#photos-overview__response__alt)
Text description of the photo for use in the `alt` attribute.

The Photo Resource
{ "id": 2014422, "width": 3024, "height": 3024, "url": "https://www.pexels.com/photo/brown-rocks-during-golden-hour-2014422/", "photographer": "Joey Farina", "photographer_url": "https://www.pexels.com/@joey", "photographer_id": 680589, "avg_color": "#978E82", "src": { "original": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg", "large2x": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "large": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "medium": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=350", "small": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=130", "portrait": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "landscape": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "tiny": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280" }, "liked": false, "alt": "Brown Rocks During Golden Hour"}

[Search for Photos ----------------- ### `GET https://api.pexels.com/v1/search`](https://www.pexels.com/api/documentation/?language=javascript#photos-search)
This endpoint enables you to search Pexels for any topic that you would like. For example your query could be something broad like `Nature`, `Tigers`, `People`. Or it could be something specific like `Group of people working`.

[#### Parameters](https://www.pexels.com/api/documentation/?language=javascript#photos-search__parameters)
*   [query _string | required_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__parameters__query)
The search query. `Ocean`, `Tigers`, `Pears`, etc.

*   [orientation _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__parameters__orientation)
Desired photo orientation. The current supported orientations are: `landscape`, `portrait` or `square`.

*   [size _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__parameters__size)
Minimum photo size. The current supported sizes are: `large`(24MP), `medium`(12MP) or `small`(4MP).

*   [color _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__parameters__color)
Desired photo color. Supported colors: `red`, `orange`, `yellow`, `green`, `turquoise`, `blue`, `violet`, `pink`, `brown`, `black`, `gray`, `white` or any hexidecimal color code (eg. `#ffffff`).

*   [locale _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__parameters__locale)
The locale of the search you are performing. The current supported locales are: <%= I18n.available_locales.map { |locale| %(`') + locale.to_s + %('`) }.join(' ') %>.

*   [page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__parameters__page)
The page number you are requesting. `Default: 1`

*   [per_page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__parameters__per_page)
The number of results you are requesting per page. `Default: 15``Max: 80`

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#photos-search__response)
*   [photos _array of `Photo`_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__response__photos)
An array of `Photo` objects.

*   [page _integer_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__response__page)
The current page number.

*   [per_page _integer_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__response__per_page)
The number of results returned with each page.

*   [total_results _integer_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__response__total_results)
The total number of results for the request.

*   [prev_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__response__prev_page)
URL for the previous page of results, if applicable.

*   [next_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-search__response__next_page)
URL for the next page of results, if applicable.

Example Request

import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');
const query = 'Nature';

client.photos.search({ query, per_page: 1 }).then(photos => {...});

Example Response

{ "total_results": 10000, "page": 1, "per_page": 1, "photos": [ { "id": 3573351, "width": 3066, "height": 3968, "url": "https://www.pexels.com/photo/trees-during-day-3573351/", "photographer": "Lukas Rodriguez", "photographer_url": "https://www.pexels.com/@lukas-rodriguez-1845331", "photographer_id": 1845331, "avg_color": "#374824", "src": { "original": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png", "large2x": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "large": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940", "medium": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350", "small": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130", "portrait": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "landscape": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "tiny": "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280" }, "liked": false, "alt": "Brown Rocks During Golden Hour" } ], "next_page": "https://api.pexels.com/v1/search/?page=2&per_page=1&query=nature"}

[Curated Photos -------------- ### `GET https://api.pexels.com/v1/curated`](https://www.pexels.com/api/documentation/?language=javascript#photos-curated)
This endpoint enables you to receive real-time photos curated by the Pexels team.

We add at least one new photo per hour to our curated list so that you always get a changing selection of trending photos.

[#### Parameters](https://www.pexels.com/api/documentation/?language=javascript#photos-curated__parameters)
*   [page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-curated__parameters__page)
The page number you are requesting. `Default: 1`

*   [per_page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-curated__parameters__per_page)
The number of results you are requesting per page. `Default: 15``Max: 80`

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#photos-curated__response)
*   [photos _array of `Photo`_](https://www.pexels.com/api/documentation/?language=javascript#photos-curated__response__photos)
An array of `Photo` objects.

*   [page _integer_](https://www.pexels.com/api/documentation/?language=javascript#photos-curated__response__page)
The current page number.

*   [per_page _integer_](https://www.pexels.com/api/documentation/?language=javascript#photos-curated__response__per_page)
The number of results returned with each page.

*   [total_results _integer_](https://www.pexels.com/api/documentation/?language=javascript#photos-curated__response__total_results)
The total number of results for the request.

*   [prev_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-curated__response__prev_page)
URL for the previous page of results, if applicable.

*   [next_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#photos-curated__response__next_page)
URL for the next page of results, if applicable.

Example Request
 import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.photos.curated({ per_page: 1 }).then(photos => {...});

Example Response
{ "page": 1, "per_page": 1, "photos": [ { "id": 2880507, "width": 4000, "height": 6000, "url": "https://www.pexels.com/photo/woman-in-white-long-sleeved-top-and-skirt-standing-on-field-2880507/", "photographer": "Deden Dicky Ramdhani", "photographer_url": "https://www.pexels.com/@drdeden88", "photographer_id": 1378810, "avg_color": "#7E7F7B", "src": { "original": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg", "large2x": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "large": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "medium": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&h=350", "small": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&h=130", "portrait": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "landscape": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "tiny": "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280" }, "liked": false, "alt": "Brown Rocks During Golden Hour" } ], "next_page": "https://api.pexels.com/v1/curated/?page=2&per_page=1"}

[Get a Photo ----------- ### `GET https://api.pexels.com/v1/photos/:id`](https://www.pexels.com/api/documentation/?language=javascript#photos-show)
Retrieve a specific `Photo` from its id.

[#### Parameters](https://www.pexels.com/api/documentation/?language=javascript#photos-show__parameters)
*   [id _integer | required_](https://www.pexels.com/api/documentation/?language=javascript#photos-show__parameters__id)
The id of the photo you are requesting.

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#photos-show__response)
Returns a `Photo` object

Example Request

 import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.photos.show({ id: 2014422 }).then(photo => {...});

Example Response

{ "id": 2014422, "width": 3024, "height": 3024, "url": "https://www.pexels.com/photo/brown-rocks-during-golden-hour-2014422/", "photographer": "Joey Farina", "photographer_url": "https://www.pexels.com/@joey", "photographer_id": 680589, "avg_color": "#978E82", "src": { "original": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg", "large2x": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "large": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "medium": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=350", "small": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&h=130", "portrait": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "landscape": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "tiny": "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280" }, "liked": false, "alt": "Brown Rocks During Golden Hour"}

[The Video Resource ------------------](https://www.pexels.com/api/documentation/?language=javascript#videos-overview)
The `Video` resource is a JSON formatted version of a Pexels video. The Video API endpoints respond with the video data formatted in this shape.

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#videos-overview__response)
*   [id _integer_](https://www.pexels.com/api/documentation/?language=javascript#videos-overview__response__id)
The id of the video.

*   [width _integer_](https://www.pexels.com/api/documentation/?language=javascript#videos-overview__response__width)
The real width of the video in pixels.

*   [height _integer_](https://www.pexels.com/api/documentation/?language=javascript#videos-overview__response__height)
The real height of the video in pixels.

*   [url _string_](https://www.pexels.com/api/documentation/?language=javascript#videos-overview__response__url)
The Pexels URL where the video is located.

*   [image _string_](https://www.pexels.com/api/documentation/?language=javascript#videos-overview__response__image)
URL to a screenshot of the video.

*   [duration _integer_](https://www.pexels.com/api/documentation/?language=javascript#videos-overview__response__duration)
The duration of the video in seconds.

*   [user _object_](https://www.pexels.com/api/documentation/?language=javascript#videos-overview__response__user)
The videographer who shot the video.

*   [video_files _Array of objects_](https://www.pexels.com/api/documentation/?language=javascript#videos-overview__response__video_files)
An array of different sized versions of the video.

*   [video_pictures _Array of objects_](https://www.pexels.com/api/documentation/?language=javascript#videos-overview__response__video_pictures)
An array of preview pictures of the video.

The Video Resource

{ "id": 2499611, "width": 1080, "height": 1920, "url": "https://www.pexels.com/video/2499611/", "image": "https://images.pexels.com/videos/2499611/free-video-2499611.jpg?fit=crop&w=1200&h=630&auto=compress&cs=tinysrgb", "full_res": null, "tags": [], "duration": 22, "user": { "id": 680589, "name": "Joey Farina", "url": "https://www.pexels.com/@joey" }, "video_files": [ { "id": 125004, "quality": "hd", "file_type": "video/mp4", "width": 1080, "height": 1920, "fps": 23.976, "link": "https://player.vimeo.com/external/342571552.hd.mp4?s=6aa6f164de3812abadff3dde86d19f7a074a8a66&profile_id=175&oauth2_token_id=57447761" }, { "id": 125005, "quality": "sd", "file_type": "video/mp4", "width": 540, "height": 960, "fps": 23.976, "link": "https://player.vimeo.com/external/342571552.sd.mp4?s=e0df43853c25598dfd0ec4d3f413bce1e002deef&profile_id=165&oauth2_token_id=57447761" }, { "id": 125006, "quality": "sd", "file_type": "video/mp4", "width": 240, "height": 426, "fps": 23.976, "link": "https://player.vimeo.com/external/342571552.sd.mp4?s=e0df43853c25598dfd0ec4d3f413bce1e002deef&profile_id=139&oauth2_token_id=57447761" } ... ], "video_pictures": [ { "id": 308178, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-0.jpg", "nr": 0 }, { "id": 308179, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-1.jpg", "nr": 1 }, { "id": 308180, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-2.jpg", "nr": 2 }, { "id": 308181, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-3.jpg", "nr": 3 } ... ]}

[Search for Videos ----------------- ### `GET https://api.pexels.com/videos/search`](https://www.pexels.com/api/documentation/?language=javascript#videos-search)
This endpoint enables you to search Pexels for any topic that you would like. For example your query could be something broad like `Nature`, `Tigers`, `People`. Or it could be something specific like `Group of people working`.

[#### Parameters](https://www.pexels.com/api/documentation/?language=javascript#videos-search__parameters)
*   [query _string | required_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__parameters__query)
The search query. `Ocean`, `Tigers`, `Pears`, etc.

*   [orientation _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__parameters__orientation)
Desired video orientation. The current supported orientations are: `landscape`, `portrait` or `square`.

*   [size _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__parameters__size)
Minimum video size. The current supported sizes are: `large`(4K), `medium`(Full HD) or `small`(HD).

*   [locale _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__parameters__locale)
The locale of the search you are performing. The current supported locales are: <%= I18n.available_locales.map { |locale| %(`') + locale.to_s + %('`) }.join(' ') %>.

*   [page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__parameters__page)
The page number you are requesting. `Default: 1`

*   [per_page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__parameters__per_page)
The number of results you are requesting per page. `Default: 15``Max: 80`

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#videos-search__response)
*   [videos _array of `Video`_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__response__videos)
An array of `Video` objects.

*   [url _string_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__response__url)
The Pexels URL for the current search query.

*   [page _integer_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__response__page)
The current page number.

*   [per_page _integer_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__response__per_page)
The number of results returned with each page.

*   [total_results _integer_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__response__total_results)
The total number of results for the request.

*   [prev_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__response__prev_page)
URL for the previous page of results, if applicable.

*   [next_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-search__response__next_page)
URL for the next page of results, if applicable.

Example Request

 import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');
const query = 'Nature';

client.videoes.search({ query, per_page: 1 }).then(videos => {...});

Example Response
{ "page": 1, "per_page": 1, "total_results": 20475, "url": "https://www.pexels.com/videos/", "videos": [ { "id": 1448735, "width": 4096, "height": 2160, "url": "https://www.pexels.com/video/video-of-forest-1448735/", "image": "https://images.pexels.com/videos/1448735/free-video-1448735.jpg?fit=crop&w=1200&h=630&auto=compress&cs=tinysrgb", "duration": 32, "user": { "id": 574687, "name": "Ruvim Miksanskiy", "url": "https://www.pexels.com/@digitech" }, "video_files": [ { "id": 58649, "quality": "sd", "file_type": "video/mp4", "width": 640, "height": 338, "link": "https://player.vimeo.com/external/291648067.sd.mp4?s=7f9ee1f8ec1e5376027e4a6d1d05d5738b2fbb29&profile_id=164&oauth2_token_id=57447761" }, { "id": 58650, "quality": "hd", "file_type": "video/mp4", "width": 2048, "height": 1080, "link": "https://player.vimeo.com/external/291648067.hd.mp4?s=94998971682c6a3267e4cbd19d16a7b6c720f345&profile_id=175&oauth2_token_id=57447761" }, { "id": 58651, "quality": "hd", "file_type": "video/mp4", "width": 4096, "height": 2160, "link": "https://player.vimeo.com/external/291648067.hd.mp4?s=94998971682c6a3267e4cbd19d16a7b6c720f345&profile_id=172&oauth2_token_id=57447761" }, { "id": 58652, "quality": "hd", "file_type": "video/mp4", "width": 1366, "height": 720, "link": "https://player.vimeo.com/external/291648067.hd.mp4?s=94998971682c6a3267e4cbd19d16a7b6c720f345&profile_id=174&oauth2_token_id=57447761" }, { "id": 58653, "quality": "hd", "file_type": "video/mp4", "width": 2732, "height": 1440, "link": "https://player.vimeo.com/external/291648067.hd.mp4?s=94998971682c6a3267e4cbd19d16a7b6c720f345&profile_id=170&oauth2_token_id=57447761" }, { "id": 58654, "quality": "sd", "file_type": "video/mp4", "width": 960, "height": 506, "link": "https://player.vimeo.com/external/291648067.sd.mp4?s=7f9ee1f8ec1e5376027e4a6d1d05d5738b2fbb29&profile_id=165&oauth2_token_id=57447761" }, { "id": 58655, "quality": "hls", "file_type": "video/mp4", "width": null, "height": null, "link": "https://player.vimeo.com/external/291648067.m3u8?s=1210fac9d80f9b74b4a334c4fca327cde08886b2&oauth2_token_id=57447761" } ], "video_pictures": [ { "id": 133236, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-0.jpg", "nr": 0 }, { "id": 133237, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-1.jpg", "nr": 1 }, { "id": 133238, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-2.jpg", "nr": 2 }, { "id": 133239, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-3.jpg", "nr": 3 }, { "id": 133240, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-4.jpg", "nr": 4 }, { "id": 133241, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-5.jpg", "nr": 5 }, { "id": 133242, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-6.jpg", "nr": 6 }, { "id": 133243, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-7.jpg", "nr": 7 }, { "id": 133244, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-8.jpg", "nr": 8 }, { "id": 133245, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-9.jpg", "nr": 9 }, { "id": 133246, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-10.jpg", "nr": 10 }, { "id": 133247, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-11.jpg", "nr": 11 }, { "id": 133248, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-12.jpg", "nr": 12 }, { "id": 133249, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-13.jpg", "nr": 13 }, { "id": 133250, "picture": "https://static-videos.pexels.com/videos/1448735/pictures/preview-14.jpg", "nr": 14 } ] } ]}

[Popular Videos -------------- ### `GET https://api.pexels.com/videos/popular`](https://www.pexels.com/api/documentation/?language=javascript#videos-popular)
This endpoint enables you to receive the current popular Pexels videos.

[#### Parameters](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__parameters)
*   [min_width _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__parameters__min_width)
The minimum width in pixels of the returned videos.

*   [min_height _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__parameters__min_height)
The minimum height in pixels of the returned videos.

*   [min_duration _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__parameters__min_duration)
The minimum duration in seconds of the returned videos.

*   [max_duration _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__parameters__max_duration)
The maximum duration in seconds of the returned videos.

*   [page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__parameters__page)
The page number you are requesting. `Default: 1`

*   [per_page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__parameters__per_page)
The number of results you are requesting per page. `Default: 15``Max: 80`

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__response)
*   [videos _array of `Video`_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__response__videos)
An array of `Video` objects.

*   [url _string_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__response__url)
The Pexels URL for the current page.

*   [page _integer_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__response__page)
The current page number.

*   [per_page _integer_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__response__per_page)
The number of results returned with each page.

*   [total_results _integer_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__response__total_results)
The total number of results for the request.

*   [prev_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__response__prev_page)
URL for the previous page of results, if applicable.

*   [next_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#videos-popular__response__next_page)
URL for the next page of results, if applicable.

Example Request
 import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.videos.popular({ per_page: 1 }).then(videos => {...});

Example Response

{ "page": 1, "per_page": 1, "total_results": 4089, "url": "https://www.pexels.com/search/videos/Nature/", "videos": [ { "id": 1093662, "width": 1920, "height": 1080, "url": "https://www.pexels.com/video/water-crashing-over-the-rocks-1093662/", "image": "https://images.pexels.com/videos/1093662/free-video-1093662.jpg?fit=crop&w=1200&h=630&auto=compress&cs=tinysrgb", "duration": 8, "user": { "id": 417939, "name": "Peter Fowler", "url": "https://www.pexels.com/@peter-fowler-417939" }, "video_files": [ { "id": 37101, "quality": "hd", "file_type": "video/mp4", "width": 1280, "height": 720, "link": "https://player.vimeo.com/external/269971860.hd.mp4?s=eae965838585cc8342bb5d5253d06a52b2415570&profile_id=174&oauth2_token_id=57447761" }, { "id": 37102, "quality": "sd", "file_type": "video/mp4", "width": 640, "height": 360, "link": "https://player.vimeo.com/external/269971860.sd.mp4?s=a3036bd1a9f15c1b31daedad98c06a3b24cdd747&profile_id=164&oauth2_token_id=57447761" }, { "id": 37103, "quality": "hd", "file_type": "video/mp4", "width": 1920, "height": 1080, "link": "https://player.vimeo.com/external/269971860.hd.mp4?s=eae965838585cc8342bb5d5253d06a52b2415570&profile_id=175&oauth2_token_id=57447761" }, { "id": 37104, "quality": "sd", "file_type": "video/mp4", "width": 960, "height": 540, "link": "https://player.vimeo.com/external/269971860.sd.mp4?s=a3036bd1a9f15c1b31daedad98c06a3b24cdd747&profile_id=165&oauth2_token_id=57447761" }, { "id": 37105, "quality": "hls", "file_type": "video/mp4", "width": null, "height": null, "link": "https://player.vimeo.com/external/269971860.m3u8?s=ac08929c597387cc77ae3d88bfe2ad66a9c4d31f&oauth2_token_id=57447761" } ], "video_pictures": [ { "id": 79696, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-0.jpg", "nr": 0 }, { "id": 79697, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-1.jpg", "nr": 1 }, { "id": 79698, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-2.jpg", "nr": 2 }, { "id": 79699, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-3.jpg", "nr": 3 }, { "id": 79700, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-4.jpg", "nr": 4 }, { "id": 79701, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-5.jpg", "nr": 5 }, { "id": 79702, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-6.jpg", "nr": 6 }, { "id": 79703, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-7.jpg", "nr": 7 }, { "id": 79704, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-8.jpg", "nr": 8 }, { "id": 79705, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-9.jpg", "nr": 9 }, { "id": 79706, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-10.jpg", "nr": 10 }, { "id": 79707, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-11.jpg", "nr": 11 }, { "id": 79708, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-12.jpg", "nr": 12 }, { "id": 79709, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-13.jpg", "nr": 13 }, { "id": 79710, "picture": "https://static-videos.pexels.com/videos/1093662/pictures/preview-14.jpg", "nr": 14 } ] } ]}

[Get a Video ----------- ### `GET https://api.pexels.com/videos/videos/:id`](https://www.pexels.com/api/documentation/?language=javascript#videos-show)
Retrieve a specific `Video` from its id.

[#### Parameters](https://www.pexels.com/api/documentation/?language=javascript#videos-show__parameters)
*   [id _integer | required_](https://www.pexels.com/api/documentation/?language=javascript#videos-show__parameters__id)
The id of the video you are requesting.

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#videos-show__response)
Returns a `Video` object

Example Request

1
2
3
4
5
6 import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.photos.show({ id: 2499611 }).then(photo => {...});

Example Response

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140{ "id": 2499611, "width": 1080, "height": 1920, "url": "https://www.pexels.com/video/2499611/", "image": "https://images.pexels.com/videos/2499611/free-video-2499611.jpg?fit=crop&w=1200&h=630&auto=compress&cs=tinysrgb", "duration": 22, "user": { "id": 680589, "name": "Joey Farina", "url": "https://www.pexels.com/@joey" }, "video_files": [ { "id": 125004, "quality": "hd", "file_type": "video/mp4", "width": 1080, "height": 1920, "link": "https://player.vimeo.com/external/342571552.hd.mp4?s=6aa6f164de3812abadff3dde86d19f7a074a8a66&profile_id=175&oauth2_token_id=57447761" }, { "id": 125005, "quality": "sd", "file_type": "video/mp4", "width": 540, "height": 960, "link": "https://player.vimeo.com/external/342571552.sd.mp4?s=e0df43853c25598dfd0ec4d3f413bce1e002deef&profile_id=165&oauth2_token_id=57447761" }, { "id": 125006, "quality": "sd", "file_type": "video/mp4", "width": 240, "height": 426, "link": "https://player.vimeo.com/external/342571552.sd.mp4?s=e0df43853c25598dfd0ec4d3f413bce1e002deef&profile_id=139&oauth2_token_id=57447761" }, { "id": 125007, "quality": "hd", "file_type": "video/mp4", "width": 720, "height": 1280, "link": "https://player.vimeo.com/external/342571552.hd.mp4?s=6aa6f164de3812abadff3dde86d19f7a074a8a66&profile_id=174&oauth2_token_id=57447761" }, { "id": 125008, "quality": "sd", "file_type": "video/mp4", "width": 360, "height": 640, "link": "https://player.vimeo.com/external/342571552.sd.mp4?s=e0df43853c25598dfd0ec4d3f413bce1e002deef&profile_id=164&oauth2_token_id=57447761" }, { "id": 125009, "quality": "hls", "file_type": "video/mp4", "width": null, "height": null, "link": "https://player.vimeo.com/external/342571552.m3u8?s=53433233e4176eead03ddd6fea04d9fb2bce6637&oauth2_token_id=57447761" } ], "video_pictures": [ { "id": 308178, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-0.jpg", "nr": 0 }, { "id": 308179, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-1.jpg", "nr": 1 }, { "id": 308180, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-2.jpg", "nr": 2 }, { "id": 308181, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-3.jpg", "nr": 3 }, { "id": 308182, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-4.jpg", "nr": 4 }, { "id": 308183, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-5.jpg", "nr": 5 }, { "id": 308184, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-6.jpg", "nr": 6 }, { "id": 308185, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-7.jpg", "nr": 7 }, { "id": 308186, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-8.jpg", "nr": 8 }, { "id": 308187, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-9.jpg", "nr": 9 }, { "id": 308188, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-10.jpg", "nr": 10 }, { "id": 308189, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-11.jpg", "nr": 11 }, { "id": 308190, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-12.jpg", "nr": 12 }, { "id": 308191, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-13.jpg", "nr": 13 }, { "id": 308192, "picture": "https://static-videos.pexels.com/videos/2499611/pictures/preview-14.jpg", "nr": 14 } ]}

[Overview --------](https://www.pexels.com/api/documentation/?language=javascript#collections-overview)
Pexels Collections are a way to group specific photos and videos into one unified gallery. This can be useful if, for example, you want to expose a specific subset of Pexels content to your users. You can access all your collections and the media within them via the Pexels API.

**Note:** Collections cannot be created or modified using the Pexels API. Rather, you can manage your collections on the Pexels website, iOS or Android app. API only gives you access to **featured collections** and **your own collections**.

[The Collection Resource -----------------------](https://www.pexels.com/api/documentation/?language=javascript#collections-resource)
The `Collection` resource is a JSON formatted version of a Pexels collection. The Collection list endpoint responds with the collection data formatted in this shape.

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#collections-resource__response)
*   [id _string_](https://www.pexels.com/api/documentation/?language=javascript#collections-resource__response__id)
The id of the collection.

*   [title _string_](https://www.pexels.com/api/documentation/?language=javascript#collections-resource__response__title)
The name of the collection.

*   [description _string_](https://www.pexels.com/api/documentation/?language=javascript#collections-resource__response__description)
The description of the collection.

*   [private _boolean_](https://www.pexels.com/api/documentation/?language=javascript#collections-resource__response__private)
Whether or not the collection is marked as private.

*   [media_count _integer_](https://www.pexels.com/api/documentation/?language=javascript#collections-resource__response__media_count)
The total number of media included in this collection.

*   [photos_count _integer_](https://www.pexels.com/api/documentation/?language=javascript#collections-resource__response__photos_count)
The total number of photos included in this collection.

*   [videos_count _integer_](https://www.pexels.com/api/documentation/?language=javascript#collections-resource__response__videos_count)
The total number of videos included in this collection.

The Collection Resource

{ "id": "8xntbhr", "title": "Hello Spring", "description": "Baby chicks, rabbits & pretty flowers. What's not to love?", "private": false, "media_count": 130, "photos_count": 121, "videos_count": 9}

[Featured Collections -------------------- ### `GET https://api.pexels.com/v1/collections/featured`](https://www.pexels.com/api/documentation/?language=javascript#collections-featured)
This endpoint returns all featured collections on Pexels.

[#### Parameters](https://www.pexels.com/api/documentation/?language=javascript#collections-featured__parameters)
*   [page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#collections-featured__parameters__page)
The page number you are requesting. `Default: 1`

*   [per_page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#collections-featured__parameters__per_page)
The number of results you are requesting per page. `Default: 15``Max: 80`

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#collections-featured__response)
*   [collections _array of `Collection`_](https://www.pexels.com/api/documentation/?language=javascript#collections-featured__response__collections)
An array of `Collection` objects.

*   [page _integer_](https://www.pexels.com/api/documentation/?language=javascript#collections-featured__response__page)
The current page number.

*   [per_page _integer_](https://www.pexels.com/api/documentation/?language=javascript#collections-featured__response__per_page)
The number of results returned with each page.

*   [total_results _integer_](https://www.pexels.com/api/documentation/?language=javascript#collections-featured__response__total_results)
The total number of results for the request.

*   [prev_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#collections-featured__response__prev_page)
URL for the previous page of results, if applicable.

*   [next_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#collections-featured__response__next_page)
URL for the next page of results, if applicable.

Example Request

import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.collections.featured({ per_page: 10 }).then(collections => {...});

Example Response

{ "collections": [ { "id": "9mp14cx", "title": "Cool Cats", "description": null, "private": false, "media_count": 6, "photos_count": 5, "videos_count": 1 } ], "page": 2, "per_page": 1, "total_results": 5, "next_page": "https://api.pexels.com/v1/collections/featured/?page=3&per_page=1", "prev_page": "https://api.pexels.com/v1/collections/featured?page=1&per_page=1"}

[My Collections -------------- ### `GET https://api.pexels.com/v1/collections`](https://www.pexels.com/api/documentation/?language=javascript#collections-all)
This endpoint returns all of your collections.

[#### Parameters](https://www.pexels.com/api/documentation/?language=javascript#collections-all__parameters)
*   [page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#collections-all__parameters__page)
The page number you are requesting. `Default: 1`

*   [per_page _integer | optional_](https://www.pexels.com/api/documentation/?language=javascript#collections-all__parameters__per_page)
The number of results you are requesting per page. `Default: 15``Max: 80`

[#### Response](https://www.pexels.com/api/documentation/?language=javascript#collections-all__response)
*   [collections _array of `Collection`_](https://www.pexels.com/api/documentation/?language=javascript#collections-all__response__collections)
An array of `Collection` objects.

*   [page _integer_](https://www.pexels.com/api/documentation/?language=javascript#collections-all__response__page)
The current page number.

*   [per_page _integer_](https://www.pexels.com/api/documentation/?language=javascript#collections-all__response__per_page)
The number of results returned with each page.

*   [total_results _integer_](https://www.pexels.com/api/documentation/?language=javascript#collections-all__response__total_results)
The total number of results for the request.

*   [prev_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#collections-all__response__prev_page)
URL for the previous page of results, if applicable.

*   [next_page _string | optional_](https://www.pexels.com/api/documentation/?language=javascript#collections-all__response__next_page)
URL for the next page of results, if applicable.

Example Request
import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.collections.all({ per_page: 1 }).then(collections => {...});

Example Response
{ "collections": [ { "id": "9mp14cx", "title": "Cool Cats", "description": null, "private": false, "media_count": 6, "photos_count": 5, "videos_count": 1 } ], "page": 2, "per_page": 1, "total_results": 5, "next_page": "https://api.pexels.com/v1/collections/?page=3&per_page=1", "prev_page": "https://api.pexels.com/v1/collections/?page=1&per_page=1"}

[Collection Media ---------------- ### `GET https://api.pexels.com/v1/collections/:id`](https://www.pexels.com/api/documentation/?language=javascript#collections-media)
This endpoint returns all the media (photos and videos) within a single collection. You can filter to only receive photos or videos using the `type` parameter.

[#### Parameters](https://www.pexels.com/api/documentation/?language=javascript#collections-media__parameters)[#### Response](https://www.pexels.com/api/documentation/?language=javascript#collections-media__response)

Example Request

import { createClient } from 'pexels';

const client = createClient('YOUR_API_KEY');

client.collections.media({ per_page: 1 }).then(media => {...});

Example Response:

{ "id": "9mp14cx", "media": [ { "type": "Photo", "id": 2061057, "width": 4850, "height": 3224, "url": "https://www.pexels.com/photo/gray-and-white-kitten-on-white-bed-2061057/", "photographer": "Tranmautritam", "photographer_url": "https://www.pexels.com/@tranmautritam", "photographer_id": 8509, "avg_color": "#BBBEC3", "src": { "original": "https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg", "large2x": "https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "large": "https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "medium": "https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&h=350", "small": "https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&h=130", "portrait": "https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "landscape": "https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "tiny": "https://images.pexels.com/photos/2061057/pexels-photo-2061057.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280" }, "liked": false }, { "type": "Video", "id": 854982, "width": 1280, "height": 720, "duration": 11, "full_res": null, "tags": [], "url": "https://www.pexels.com/video/video-of-a-tabby-cat-854982/", "image": "https://images.pexels.com/videos/854982/free-video-854982.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", "avg_color": null, "user": { "id": 2659, "name": "Pixabay", "url": "https://www.pexels.com/@pixabay" }, "video_files": [ { "id": 17755, "quality": "hd", "file_type": "video/mp4", "width": 1280, "height": 720, "link": "https://player.vimeo.com/external/199433617.hd.mp4?s=1770018c20604d41d60e4f574e7680a1bd15edb8&profile_id=174&oauth2_token_id=57447761" }, { "id": 17756, "quality": "sd", "file_type": "video/mp4", "width": 640, "height": 360, "link": "https://player.vimeo.com/external/199433617.sd.mp4?s=457abd2452a52548b8c02c503a91035ce8a713f0&profile_id=164&oauth2_token_id=57447761" }, { "id": 17757, "quality": "sd", "file_type": "video/mp4", "width": 960, "height": 540, "link": "https://player.vimeo.com/external/199433617.sd.mp4?s=457abd2452a52548b8c02c503a91035ce8a713f0&profile_id=165&oauth2_token_id=57447761" }, { "id": 17758, "quality": "hls", "file_type": "video/mp4", "width": null, "height": null, "link": "https://player.vimeo.com/external/199433617.m3u8?s=115ec8875069ea6203ddca51dae78cebd934b86e&oauth2_token_id=57447761" } ], "video_pictures": [ { "id": 19591, "nr": 0, "picture": "https://images.pexels.com/videos/854982/pictures/preview-0.jpg" }, { "id": 19592, "nr": 1, "picture": "https://images.pexels.com/videos/854982/pictures/preview-1.jpg" }, { "id": 19593, "nr": 2, "picture": "https://images.pexels.com/videos/854982/pictures/preview-2.jpg" }, { "id": 19594, "nr": 3, "picture": "https://images.pexels.com/videos/854982/pictures/preview-3.jpg" }, { "id": 19595, "nr": 4, "picture": "https://images.pexels.com/videos/854982/pictures/preview-4.jpg" }, { "id": 19596, "nr": 5, "picture": "https://images.pexels.com/videos/854982/pictures/preview-5.jpg" }, { "id": 19597, "nr": 6, "picture": "https://images.pexels.com/videos/854982/pictures/preview-6.jpg" }, { "id": 19598, "nr": 7, "picture": "https://images.pexels.com/videos/854982/pictures/preview-7.jpg" }, { "id": 19599, "nr": 8, "picture": "https://images.pexels.com/videos/854982/pictures/preview-8.jpg" }, { "id": 19600, "nr": 9, "picture": "https://images.pexels.com/videos/854982/pictures/preview-9.jpg" }, { "id": 19601, "nr": 10, "picture": "https://images.pexels.com/videos/854982/pictures/preview-10.jpg" }, { "id": 19602, "nr": 11, "picture": "https://images.pexels.com/videos/854982/pictures/preview-11.jpg" }, { "id": 19603, "nr": 12, "picture": "https://images.pexels.com/videos/854982/pictures/preview-12.jpg" }, { "id": 19604, "nr": 13, "picture": "https://images.pexels.com/videos/854982/pictures/preview-13.jpg" }, { "id": 19605, "nr": 14, "picture": "https://images.pexels.com/videos/854982/pictures/preview-14.jpg" } ] } ], "page": 2, "per_page": 2, "total_results": 6, "next_page": "https://api.pexels.com/v1/collections/9mp14cx/?page=3&per_page=2", "prev_page": "https://api.pexels.com/v1/collections/9mp14cx/?page=1&per_page=2"}