# Deliveroo Frontend

A modern, responsive React-based frontend for the Deliveroo parcel delivery platform. Built with Vite and Tailwind CSS, it offers a seamless experience for Customers, Couriers, and Admins.

## Features

- **User Interface**: Clean, responsive design using Tailwind CSS and Lucide icons.
- **Roles**: distinct dashboards and views for Customers, Couriers, and Admins.
- **Order Creation**: Intuitive form with map integration for creating delivery requests.
- **Interactive Maps**: Real-time tracking, route visualization, and location pinning using Mapbox GL JS.
- **Real-time Updates**: Order status updates and notifications.
- **Courier Dashboard**: optimize delivery routes and manage assigned orders.
- **Admin Panel**: Comprehensive management of users, orders, and couriers with data visualization.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Maps**: Mapbox GL JS
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (local or production)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory:

    ```env
    VITE_API_URL=http://localhost:5000/api  # Or your production backend URL
    VITE_MAPBOX_TOKEN=pk.eyJ...
    ```

## Running the Application

**Development Mode:**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

**Build for Production:**
```bash
npm run build
```
This generates static files in the `dist` directory.

**Preview Production Build:**
```bash
npm run preview
```

## Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # Reusable UI components (Navbar, PrivateRoute, etc.)
├── context/         # React Context (AuthContext)
├── layouts/         # Layout wrappers (AdminLayout, etc.)
├── pages/           # Page components (Home, Login, OrderDetail, etc.)
├── services/        # API integration (api.js)
├── App.jsx          # Main application component with routing
├── index.css        # Global styles and Tailwind directives
└── main.jsx         # Entry point
```

## Deployment

This app is configured for deployment on **Vercel**.

1.  Connect your repo to Vercel.
2.  Set `Build Command` to `npm run build`.
3.  Set `Output Directory` to `dist`.
4.  Add environment variables in the Vercel Dashboard (`VITE_API_URL`, `VITE_MAPBOX_TOKEN`).
5.  **Important**: Ensure your backend handles CORS for your Vercel domain.

## License

MIT
