# Cybersecurity Portfolio

A modern, responsive portfolio website built with React for showcasing cybersecurity and SOC analyst experience.

## Features

- **Modern React Architecture**: Clean, component-based structure
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Cybersecurity Theme**: Dark mode with neon accents (cyan, purple, green)
- **Smooth Animations**: Intersection Observer API for scroll-based animations
- **Performance Optimized**: Built with Vite for fast development and production builds

## Tech Stack

- **React 18**: Modern functional components with hooks
- **Vite**: Fast build tool and dev server
- **CSS3**: Custom animations and glassmorphism effects
- **Vanilla JavaScript**: No unnecessary dependencies

## Project Structure

```
portfolio/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── BackgroundAnimation.jsx
│   │   ├── Navigation.jsx
│   │   ├── Hero.jsx
│   │   ├── Experience.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Learning.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── data/               # Data layer
│   │   └── portfolioData.js
│   ├── utils/              # Utility functions
│   │   └── helpers.js
│   ├── App.jsx             # Main app component
│   ├── App.css             # Global app styles
│   ├── main.jsx            # React entry point
│   └── index.css           # Global CSS variables
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── README.md
```

## Getting Started

### Installation

1. Install dependencies:
```bash
cd portfolio
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Customization

### Update Personal Information

Edit `src/data/portfolioData.js` to update:
- Personal information (name, email, phone, etc.)
- Work experience
- Skills
- Projects
- Learning goals

### Change Colors

Edit CSS variables in `src/index.css`:
```css
:root {
  --primary-bg: #0a0e27;
  --accent-cyan: #00f0ff;
  --accent-purple: #a855f7;
  --accent-green: #10b981;
  /* ... */
}
```

### Add New Sections

1. Create a new component in `src/components/`
2. Import and add it to `src/App.jsx`
3. Update navigation in `src/components/Navigation.jsx`

## Components Overview

- **BackgroundAnimation**: Animated grid background
- **Navigation**: Fixed top navigation with smooth scrolling
- **Hero**: Landing section with name and CTA buttons
- **Experience**: Work history cards with animations
- **Skills**: Categorized technical skills
- **Projects**: Portfolio projects with links
- **Learning**: Current learning goals with progress bars
- **Contact**: Contact information and social links
- **Footer**: Simple footer with copyright

## Performance Tips

- All animations use CSS transforms (GPU accelerated)
- Intersection Observer for efficient scroll animations
- Minimal dependencies for smaller bundle size
- Vite for optimized production builds

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use this for your own portfolio!

## Author

Abderrahmane Lahrichi
- Email: a.lahrichi224@gmail.com
- Location: Bellevue, WA
