# DACXI Challenge

Challenge made for DACXI front-end position: a UI that shows live and historical bitcoin price (in USD).

## Technologies
- Vue.js 3 (booted up with Vitest)
- Typescript
- Tailwind CSS
## Setup and Run

1. Install projects dependencies with:
```sh
npm install
```

2. Run in development mode to watch changes:
```sh
npm run dev
```
The server will be running and its address available in the console.




> Or if you want to build: 
>```sh
>npm run build
>```


## About the code
It's a very simple structure, consisting in a root `App.vue` file with its reusable components: `ButtonGroup` and `CustomButton` inside the folder `/components`.

The data for supported coins are available on `data.ts` file as well there's some utility functions under `utils.ts`

It's also built Typescript to get type inference, code completion, IntelliSense for better development experience. I've been using SFC because it's more elegant and composable to develop, using `<script setup>`.

Some features I've used throughout the project was for example on `ButtonGroup` where it supports `v-model` out of the component to handle form data binding seamlessly, with a `modelValue` and `update:modelValue`. On this component the id is the value we keep track of for not bloating with unnecessary data and then when we want to retrieve the whole item, we have to search, with a `.find` method for example.

Realtime coin price is controlled with a setInterval which is triggered every 5 seconds. It's loaded when it's mounted. If you want to look for historical prices, you just have to fill out the datetime input and hit 'Search'. The interval will be cleared and the search will be made. To go back to realtime just hit the 'Live' button above the price shown. For changing the coin, just use the button group above, then it'll automatically update whether the realtime price or the historical price, depending what was the last option. 