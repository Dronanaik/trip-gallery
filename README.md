# Trip Gallery

A modern, responsive trip gallery application with automatic GitHub Pages deployment. Features glassmorphism design, dynamic content loading, and a scalable folder structure for managing multiple trips.

## ✨ Features

- 🎨 **Modern Glassmorphism Design** - Beautiful UI with glass effects and smooth animations
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile devices
- 🖼️ **Dynamic Image Gallery** - Automatically loads trips and images from folder structure
- 🔍 **Lightbox Viewer** - Full-screen image viewing with keyboard navigation
- ⚡ **Lazy Loading** - Optimized performance with lazy image loading
- 🚀 **Auto Deployment** - GitHub Actions workflow for automatic Pages deployment

## 🚀 Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Trip_Gallery.git
cd Trip_Gallery
```

2. Start a local server:
```bash
python3 -m http.server 8000
```

3. Open your browser to `http://localhost:8000`

### Adding a New Trip

1. Create a new folder in the `trips` directory:
```bash
mkdir trips/your-trip-name
```

2. Add your trip images to the folder

3. **Auto-generate meta.json** (Recommended):
```bash
python3 generate_meta.py trips/your-trip-name
```

This will automatically:
- Scan all images in the folder
- Create/update `meta.json` with the images array
- Set the first image as the cover

4. Edit the generated `meta.json` to update trip details:
```json
{
  "trip_name": "Your Trip Name",
  "date": "Month Year",
  "members": ["Name1", "Name2", "Name3"],
  "cover": "your-cover-image.jpg",
  "images": [
    "image1.jpg",
    "image2.jpg"
    // ... automatically generated list
  ]
}
```

5. Update `script.js` to include your new trip in the `TRIPS_CONFIG.trips` array:
```javascript
const TRIPS_CONFIG = {
    tripsFolder: 'trips',
    trips: [
        'goa-2023',
        'chikmagalur-2024',
        'your-trip-name'  // Add your trip here
    ]
};
```

6. Commit and push - the site will automatically deploy!

**Tip:** To update all trip folders at once:
```bash
python3 generate_meta.py --all
```

## 📁 Project Structure

```
trip-gallery/
│
├── index.html              # Main HTML file
├── style.css               # Styles with glassmorphism design
├── script.js               # Dynamic loading and interactions
├── trips/                  # Trip folders
│   ├── goa-2023/
│   │   ├── meta.json      # Trip metadata
│   │   ├── beach1.jpg     # Trip images
│   │   └── ...
│   └── chikmagalur-2024/
│       ├── meta.json
│       └── ...
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions deployment
```

## 🌐 GitHub Pages Deployment

### Setup

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. The workflow will automatically deploy on every push to main/master

### Manual Deployment

You can also trigger deployment manually:
1. Go to the "Actions" tab in your repository
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"

## 🎨 Customization

### Colors

Edit CSS variables in `style.css`:
```css
:root {
    --primary: #6366f1;
    --secondary: #ec4899;
    --accent: #14b8a6;
    /* ... more colors */
}
```

### Fonts

The project uses Inter font from Google Fonts. To change:
1. Update the font link in `index.html`
2. Update `font-family` in `style.css`

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with glassmorphism effects
- **Vanilla JavaScript** - Dynamic functionality
- **GitHub Actions** - CI/CD automation
- **GitHub Pages** - Hosting

## 📝 License

MIT License - feel free to use this project for your own trip galleries!

## 👤 Author

**Drona**

---

Built with ❤️ for preserving travel memories
