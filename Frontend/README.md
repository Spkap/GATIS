# GA-TIS Project (Generative Adversarial Text-to-Image Synthesis)

## Overview

GA-TIS is a web application that implements text-to-image synthesis using Generative Adversarial Networks (GANs). The project focuses on creating high-quality images from textual descriptions by integrating cutting-edge text embedding methods and optimized GAN architectures.

## Technologies Used

### Frontend

- React 18
- Vite
- React Router DOM
- Tailwind CSS with CSS Variables
- shadcn/ui components

### Development Tools

- ESLint
- Vitest for testing
- PostCSS & Autoprefixer
- Vite for fast development and building

## Prerequisites

- Node.js (v16 or higher)
- pnpm package manager

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/spkap/GA---TIS-website.git
cd GA---TIS-website
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm start
```

4. Open your browser and navigate to:

```
http://localhost:5173
```

## Project Structure

### Key Directories

- `/src` - Main application code
  - `/components` - Reusable UI components including UI components from shadcn
  - `/pages` - Page components (Home, Model, etc.)
  - `/styles` - Global styles and CSS (globals.css, index.css)
  - `/utils` - Utility functions
- `/public` - Static files served directly

### Core Features

- Text-to-image synthesis using GANs
- User authentication
- Image generation history management
- Responsive UI with Tailwind CSS
- Component library built with shadcn/ui

## Environment Setup

The project uses CSS variables for theming, which are defined in the `src/styles/globals.css` file. The Tailwind configuration is in `tailwind.config.ts`, and components configuration is in `components.json`.

## Development

### Available Scripts

- `pnpm start` - Start development server
- `pnpm build` - Build production application
- `pnpm serve` - Preview production build
- `pnpm test` - Run tests with Vitest

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Team

### Mentors

- [Aaryan Patil](https://www.linkedin.com/in/aaryan-patil-ds01/)
- [Vedanth Nanesh](https://www.linkedin.com/in/vedanth-nanesha-0591a42b4)

### Mentees

- [Sourabh Kapure](https://www.linkedin.com/in/sourabh-kapure)
- [Akshaj Polisetty](https://www.linkedin.com/in/akshaj-pvy-030266290)
- [Sarayu Narayanan](https://www.linkedin.com/in/sarayu-narayanan-13ab41324)
- [Sambhav Purohit](https://www.linkedin.com/in/sambhav-purohit)
- [Varshini Pateel](https://www.linkedin.com/in/varshini-reddy-pateel-311460290)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
