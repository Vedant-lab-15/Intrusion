# Data Dashboard Project

This is a data dashboard project built with **React**, **TypeScript**, **Vite**, and **Recharts**. It provides a comprehensive interface for visualizing and analyzing security-related data through various interactive charts and components.

## Technologies Used

- React
- TypeScript
- Vite
- Recharts (for charting)
- Tailwind CSS (for styling)

## Features

- Interactive charts and visualizations using Recharts
- Components for monitoring security alerts, login attempts, blocked IPs, system health, and more
- Responsive and modern UI design with Tailwind CSS
- Modular component structure for easy maintenance and extension

## Project Structure

```
workspace/dashboard/
├── src/
│   ├── components/           # React components including charts and UI elements
│   ├── data/                 # Mock data and data management
│   ├── App.jsx               # Main application component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── public/                   # Static assets (if any)
├── package.json              # Project dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # This file
```

## Installation

Make sure you have [pnpm](https://pnpm.io/) installed. Then run:

```bash
pnpm install
```

## Usage

To start the development server and preview the dashboard locally:

```bash
pnpm run dev
```

This will start the Vite development server and open the app in your default browser.

## Build

To build the project for production:

```bash
pnpm run build
```

The build output will be in the `dist` directory.

## Documentation

- Get started with Recharts by reading the [fundamentals page](https://recharts.org/en-US/api).

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

Specify your project license here (e.g., MIT License).
