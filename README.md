# Pie Charter App

A web application for creating and customizing pie charts with a unique pencil drawing style.

## Features

- Interactive pie chart that visualizes data in real-time
- Editable data table with labels, colors, and values
- Built-in color picker for customizing chart segments
- Pencil/sketch-style UI design
- Responsive layout for desktop and mobile devices

## How to Use

1. Clone the repository:
```bash
git clone https://github.com/Manuchehr10000/pie_charter_app.git
cd pie_charter_app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using the App

- The app displays a pie chart and a data table side by side
- Edit the values in the table to update the pie chart in real-time:
  - **Label**: Enter a name for each segment
  - **Color**: Use the color picker to choose a color
  - **Value**: Enter a numeric value (must be positive)
- Click the "Add Item" button to add new segments
- Click the "✕" button to remove a segment

## Technologies Used

- Next.js - React framework
- TypeScript - Static typing
- Chart.js & react-chartjs-2 - Chart visualization
- RoughJS - For the pencil drawing visual style
- TailwindCSS - Styling and responsive design

## Development

To build the application for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## License

This project is open source and available under the MIT License.