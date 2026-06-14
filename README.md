# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `Yarn`

Install packages

### `Yarn start`

Runs the app in the development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

SO

Page Load
   ↓
dispatch(getSalesOrders())
   ↓
Redux Slice
   ↓
API Call
   ↓
orders state updated
   ↓
DataGrid renders API data

## File Structure

src
│
├── components
│   │
│   ├── lookup
│   │   │
│   │   ├── GenericLookupModal.jsx
│   │   ├── LookupProviderRenderer.jsx
│   │   ├── lookupConfigs.js
│   │   ├── lookupHelpers.js
│   │   └── index.js
│   │
│   └── ...
│
├── context
│   │
│   └── LookupContext.jsx
│
├── store
│   │
│   ├── slices
│   │   │
│   │   ├── customerSlice.js
│   │   ├── itemSlice.js
│   │   ├── taxCodeSlice.js
│   │   ├── projectSlice.js
│   │   ├── warehouseSlice.js
│   │   └── ...
│   │
│   └── index.js
│
├── views
│   │
│   └── sales-order
│       │
│       ├── GeneralTab.jsx
│       ├── ContentTab.jsx
│       ├── AttachmentTab.jsx
│       ├── FreightPopup.jsx
│       └── ...
│
├── routes
│
├── themes
│
├── App.jsx
│
└── main.jsx


## Lookup Models flow

Click Search Icon
      ↓
openLookup({ type: 'item' })
      ↓
LookupProviderRenderer
      ↓
GenericLookupModal
      ↓
dispatch(getItems())
      ↓
itemSlice API call
      ↓
Redux Store (state.item.items)
      ↓
selector()
      ↓
table rows rendered

## Flow of API fetch

      First click Item popup

            data = []
            ↓
            dispatch(getItems())
            ↓
            API called
            ↓
            Redux stores items

      Second click Item popup

            data.length > 0
            ↓
            dispatch skipped
            ↓
            Uses Redux data
            ↓
            No API call

## Color Palettes

    --palette-primary-200: #90caf9;
    --palette-primary-800: #1565c0;
    --palette-primary-light: #e3f2fd;
    --palette-primary-main: #2196f3;
    --palette-primary-dark: #1e88e5;

    --palette-secondary-200: #b39ddb;
    --palette-secondary-800: #4527a0;
    --palette-secondary-light: #ede7f6;
    --palette-secondary-main: #673ab7;
    --palette-secondary-dark: #5e35b1;
