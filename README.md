# 2D Dynamical System Visualizer

A comprehensive web-based tool for visualizing flow fields of two-dimensional dynamical systems. Enter your system equations and see the vector field visualization in real-time, complete with particle trajectories, nullclines, and mathematical equation rendering.

## Features

- **Interactive Equation Input**: Enter dx/dt and dy/dt equations using mathematical expressions
- **Real-time Visualization**: See flow field updates as you modify equations or settings
- **Particle System**: Click on the canvas to add particles and watch their trajectories evolve
- **Trajectory Visualization**: See complete particle paths with color-coded trajectories
- **Custom Parameters**: Define custom parameters using JSON for flexible system modeling
- **LaTeX Rendering**: Beautiful mathematical equation display using MathJax
- **Customizable Display**: Adjust grid density, arrow scale, colors, and view range
- **Preset Systems**: Quick access to classic dynamical systems
- **Nullclines**: Optional visualization of dx/dt = 0 and dy/dt = 0 curves
- **Mouse Coordinates**: Real-time coordinate display when hovering over the canvas
- **Advanced Integration**: Uses Runge-Kutta 4th order method for accurate particle simulation

## Usage

1. Open `index.html` in a web browser
2. Enter your system equations in the form:
   - `dx/dt = f(x, y)`
   - `dy/dt = g(x, y)`
3. Optionally define custom parameters in JSON format (e.g., `{"mu": 1, "alpha": 0.5}`)
4. Click "Update System" to visualize the flow field
5. Click anywhere on the canvas to add particles and watch their trajectories
6. Adjust visualization settings as needed
7. Use particle controls to clear particles or trajectories

## Equation Syntax

The equations support standard mathematical expressions:
- Basic operations: `+`, `-`, `*`, `/`, `^` (power)
- Functions: `sin()`, `cos()`, `tan()`, `exp()`, `log()`, `sqrt()`
- Constants: `pi`, `e`
- Variables: `x`, `y`
- Custom parameters: Any parameter defined in the JSON parameters field

## Custom Parameters

The visualizer supports custom parameters that can be used in your equations. Define them as a JSON object in the "Parameters" field:

```json
{
  "mu": 1.0,
  "alpha": 0.5,
  "beta": 2.0,
  "gamma": 0.1
}
```

These parameters can then be used in your equations:
- `dx/dt = mu * x - alpha * y`
- `dy/dt = beta * x + gamma * y`

The parameter field includes real-time validation and will show green for valid JSON or red for invalid syntax.

## Mathematical Rendering

The visualizer automatically renders your equations in beautiful LaTeX format using MathJax. The equations are displayed in a dedicated panel below the canvas, showing:

- Proper mathematical notation with fractions, superscripts, and subscripts
- Greek letters (μ, α, β, γ, etc.) are automatically converted
- Mathematical functions are properly formatted
- Real-time updates as you modify equations

## Particle System

The visualizer includes an interactive particle system for exploring system behavior:

- **Adding Particles**: Click anywhere on the canvas to add a particle at that location
- **Trajectory Visualization**: Each particle leaves a colored trail showing its path
- **Color Coding**: Different particles use different colors for easy identification
- **Particle Controls**:
  - **Clear Particles**: Remove all particles from the simulation
  - **Clear Trajectories**: Keep particles but clear their path history
  - **Reset All**: Remove all particles and reset the view
- **Integration Method**: Uses Runge-Kutta 4th order method for accurate numerical integration
- **Automatic Simulation**: Particles automatically start moving when added

### Example Systems

**Van der Pol Oscillator:**
- `dx/dt = y`
- `dy/dt = mu * (1 - x^2) * y - x`
- Parameters: `{"mu": 1}`

**Damped Pendulum:**
- `dx/dt = y`
- `dy/dt = -sin(x) - gamma * y`
- Parameters: `{"gamma": 0.1}`

**Lotka-Volterra (Predator-Prey):**
- `dx/dt = alpha * x - beta * x * y`
- `dy/dt = delta * x * y - gamma * y`
- Parameters: `{"alpha": 1, "beta": 1, "delta": 1, "gamma": 1}`

**Spiral Sink:**
- `dx/dt = sigma * x - y`
- `dy/dt = x + sigma * y`
- Parameters: `{"sigma": -0.1}`

**FitzHugh-Nagumo Model:**
- `dx/dt = x - x^3 - y + delta`
- `dy/dt = gamma * x + gamma * alpha - gamma * beta * y`
- Parameters: `{"alpha": 0.7, "beta": 0.8, "gamma": 0.08, "delta": 0.6}`

## Controls

### System Equations
- Enter mathematical expressions for dx/dt and dy/dt
- Use standard mathematical notation
- Define custom parameters in JSON format
- Click "Update System" to apply changes

### Visualization Settings
- **Grid Density**: Controls the number of arrows in the flow field (10-50)
- **Arrow Scale**: Adjusts the size of the arrows (0.1-2.0)
- **Arrow Color**: Change the color of the flow field arrows
- **Show Grid**: Toggle coordinate grid display
- **Show Nullclines**: Display curves where dx/dt = 0 (red) and dy/dt = 0 (blue)

### View Settings
- **X/Y Range**: Set the viewing window bounds
- **Reset View**: Return to default -5 to 5 range for both axes

### Particle Controls
- **Click Canvas**: Add particles at clicked locations
- **Clear Particles**: Remove all particles from simulation
- **Clear Trajectories**: Keep particles but clear their path history
- **Reset All**: Remove all particles and reset the view

### Presets
- Quick selection of classic dynamical systems
- Automatically updates equations, parameters, and redraws the visualization
- Includes Van der Pol, Damped Pendulum, Lotka-Volterra, Spiral Sink, and FitzHugh-Nagumo models

## Technical Details

### Core Technologies
- **Frontend**: Vanilla JavaScript and HTML5 Canvas
- **Mathematical Engine**: [math.js](https://mathjs.org/) library for expression parsing and evaluation
- **Mathematical Rendering**: [MathJax](https://www.mathjax.org/) for LaTeX equation display
- **Styling**: Pure CSS with responsive design

### Performance Features
- **Caching System**: Flow field and nullclines are cached for better performance
- **Efficient Rendering**: Only recalculates when necessary (system changes, view changes)
- **Optimized Integration**: Runge-Kutta 4th order method for accurate particle simulation
- **Real-time Updates**: Smooth particle animation using requestAnimationFrame

### Mathematical Capabilities
- **Expression Parsing**: Full mathematical expression support with math.js
- **Parameter Support**: Custom parameters via JSON with real-time validation
- **Greek Letters**: Automatic conversion of parameter names to Greek letters in LaTeX
- **Function Support**: sin, cos, tan, exp, log, sqrt, and more
- **Constants**: Built-in support for π and e

### User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Feedback**: Live coordinate display and parameter validation
- **Interactive Controls**: Sliders, color pickers, and checkboxes for easy adjustment
- **Visual Feedback**: Color-coded validation and click feedback

## File Structure

- `index.html` - Main webpage structure with UI layout and external library imports
- `styles.css` - Complete styling and responsive layout
- `script.js` - Core visualization logic including:
  - DynamicalSystemVisualizer class
  - Particle system with Runge-Kutta integration
  - Flow field generation and caching
  - Nullcline calculation and rendering
  - LaTeX equation conversion and rendering
  - Event handling and UI interactions
- `README.md` - Comprehensive documentation

## Dependencies

The project uses the following external libraries (loaded via CDN):
- **math.js v14.6.0**: Mathematical expression parsing and evaluation
- **MathJax v3**: LaTeX equation rendering
- **Polyfill.io**: ES6 feature support for older browsers

## Browser Support

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript features
- CSS Grid and Flexbox

## Getting Started

1. **Clone or Download**: Get the project files
2. **Open**: Simply open `index.html` in any modern web browser
3. **No Installation Required**: All dependencies are loaded from CDN
4. **Start Exploring**: Try the preset systems or enter your own equations

## Troubleshooting

### Common Issues

**"Math library not loaded" Error:**
- Check your internet connection (libraries load from CDN)
- Try refreshing the page
- Ensure JavaScript is enabled in your browser

**Equations Not Parsing:**
- Check for syntax errors in your equations
- Ensure all parentheses are properly closed
- Verify parameter names match those in your JSON parameters

**Particles Not Moving:**
- Make sure you've clicked "Update System" first
- Check that your equations are valid
- Try clicking on different areas of the canvas

**Performance Issues:**
- Reduce grid density for faster rendering
- Clear particles if you have too many
- Try a smaller view range

## License

Open source - feel free to modify and use for educational purposes.
