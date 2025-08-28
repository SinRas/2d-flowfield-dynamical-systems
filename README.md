# 2D Dynamical System Visualizer

A web-based tool for visualizing flow fields of two-dimensional dynamical systems. Enter your system equations and see the vector field visualization in real-time.

## Features

- **Interactive Equation Input**: Enter dx/dt and dy/dt equations using mathematical expressions
- **Real-time Visualization**: See flow field updates as you modify equations or settings
- **Customizable Display**: Adjust grid density, arrow scale, colors, and view range
- **Preset Systems**: Quick access to classic dynamical systems
- **Nullclines**: Optional visualization of dx/dt = 0 and dy/dt = 0 curves
- **Mouse Coordinates**: Real-time coordinate display when hovering over the canvas

## Usage

1. Open `index.html` in a web browser
2. Enter your system equations in the form:
   - `dx/dt = f(x, y)`
   - `dy/dt = g(x, y)`
3. Click "Update System" to visualize the flow field
4. Adjust visualization settings as needed

## Equation Syntax

The equations support standard mathematical expressions:
- Basic operations: `+`, `-`, `*`, `/`, `^` (power)
- Functions: `sin()`, `cos()`, `tan()`, `exp()`, `log()`, `sqrt()`
- Constants: `pi`, `e`
- Variables: `x`, `y`

### Example Systems

**Van der Pol Oscillator:**
- `dx/dt = y`
- `dy/dt = mu * (1 - x^2) * y - x`

**Damped Pendulum:**
- `dx/dt = y`
- `dy/dt = -sin(x) - 0.1 * y`

**Lotka-Volterra (Predator-Prey):**
- `dx/dt = x * (1 - y)`
- `dy/dt = -y * (1 - x)`

**Spiral Sink:**
- `dx/dt = -0.1 * x - y`
- `dy/dt = x - 0.1 * y`

## Controls

### System Equations
- Enter mathematical expressions for dx/dt and dy/dt
- Use standard mathematical notation
- Click "Update System" to apply changes

### Visualization Settings
- **Grid Density**: Controls the number of arrows in the flow field (10-50)
- **Arrow Scale**: Adjusts the size of the arrows (0.1-2.0)
- **Arrow Color**: Change the color of the flow field arrows
- **Show Grid**: Toggle coordinate grid display
- **Show Nullclines**: Display curves where dx/dt = 0 (red) and dy/dt = 0 (blue)

### View Settings
- **X/Y Range**: Set the viewing window bounds
- **Reset View**: Return to default -3 to 3 range for both axes

### Presets
- Quick selection of classic dynamical systems
- Automatically updates equations and redraws the visualization

## Technical Details

- Built with vanilla JavaScript and HTML5 Canvas
- Uses [math.js](https://mathjs.org/) library for expression parsing and evaluation
- Responsive design works on desktop and mobile devices
- Real-time coordinate tracking and updates

## File Structure

- `index.html` - Main webpage structure
- `styles.css` - Styling and layout
- `script.js` - Dynamical system visualization logic
- `README.md` - Documentation

## Browser Support

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript features
- CSS Grid and Flexbox

## License

Open source - feel free to modify and use for educational purposes.
