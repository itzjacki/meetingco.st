# Meetingco.st

Ever wondered how much a meeting costs? This site acts as a simple calculator to let you find out. You can also use it to keep a running count of the cost of a meeting. The hourly cost is based on a generally accepted number on the cost of a productive software engineer hour in Norway, considering everything from salary to fees to manager time and office costs.

## Todos:

- Make live counter more resilient by implementing second check using time differences
- Set up database to keep track of total cost of meetings tracked with website
- Ideally params should be parsed in Astro SSR instead of clientside so we can let the html pre-render (client:only -> client:load)
- Use IP location to better estimate hourly cost
- I feel kind of gross for shipping the whole React bundle for such a basic level of funcionality, so maybe I will un-react this at some point in the future. Who knows.
