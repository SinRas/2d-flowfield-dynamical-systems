class DynamicalSystemVisualizer {
    constructor() {
        this.canvas = document.getElementById('flow-field-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // System equations
        this.dxdt = null;
        this.dydt = null;
        this.parameters = {};
        
        // View parameters
        this.xMin = -5;
        this.xMax = 5;
        this.yMin = -5;
        this.yMax = 5;
        
        // Visualization parameters
        this.gridDensity = 20;
        this.arrowScale = 0.5;
        this.arrowColor = '#3498db';
        this.showGrid = true;
        this.showNullclines = false;
        
        // Canvas parameters
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        
        this.setupEventListeners();
        // Don't automatically parse equations - wait for user to click update
        // Hide equation display initially
        document.getElementById('equation-display').classList.add('hidden');
        this.draw();
    }
    
    setupEventListeners() {
        // System update
        document.getElementById('update-system').addEventListener('click', () => {
            this.updateSystem();
            this.draw();
        });
        
        // Grid density
        const gridDensitySlider = document.getElementById('grid-density');
        gridDensitySlider.addEventListener('input', (e) => {
            this.gridDensity = parseInt(e.target.value);
            document.getElementById('grid-density-value').textContent = this.gridDensity;
            this.draw();
        });
        
        // Arrow scale
        const arrowScaleSlider = document.getElementById('arrow-scale');
        arrowScaleSlider.addEventListener('input', (e) => {
            this.arrowScale = parseFloat(e.target.value);
            document.getElementById('arrow-scale-value').textContent = this.arrowScale;
            this.draw();
        });
        
        // Arrow color
        document.getElementById('arrow-color').addEventListener('change', (e) => {
            this.arrowColor = e.target.value;
            this.draw();
        });
        
        // Show grid
        document.getElementById('show-grid').addEventListener('change', (e) => {
            this.showGrid = e.target.checked;
            this.draw();
        });
        
        // Show nullclines
        document.getElementById('show-nullclines').addEventListener('change', (e) => {
            this.showNullclines = e.target.checked;
            this.draw();
        });
        
        // View range controls
        ['x-min', 'x-max', 'y-min', 'y-max'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.updateViewRange();
                this.draw();
            });
        });
        
        // Reset view
        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetView();
        });
        
        // Presets
        document.getElementById('preset-select').addEventListener('change', (e) => {
            this.loadPreset(e.target.value);
        });
        
        // Parameter validation on input
        document.getElementById('parameters').addEventListener('input', (e) => {
            this.validateParameters(e.target.value);
        });
        
        // Mouse coordinates
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const canvasX = e.clientX - rect.left;
            const canvasY = e.clientY - rect.top;
            const worldX = this.canvasToWorldX(canvasX);
            const worldY = this.canvasToWorldY(canvasY);
            
            document.getElementById('mouse-coordinates').textContent = 
                `x: ${worldX.toFixed(3)}, y: ${worldY.toFixed(3)}`;
        });
    }
    
    updateSystem() {
        const dxdtInput = document.getElementById('dx-dt').value;
        const dydtInput = document.getElementById('dy-dt').value;
        const parametersInput = document.getElementById('parameters').value;
        
        // Check if math.js is loaded
        if (typeof math === 'undefined') {
            console.error('math.js library not loaded');
            alert('Math library not loaded. Please refresh the page.');
            return;
        }
        
        try {
            // Parse parameters JSON
            this.parameters = parametersInput.trim() ? JSON.parse(parametersInput) : {};
            console.log('Parameters loaded:', this.parameters);
            
            // Parse equations using math.js
            this.dxdt = math.parse(dxdtInput).compile();
            this.dydt = math.parse(dydtInput).compile();
            console.log('Equations parsed successfully');
            
            // Update parameter display
            this.updateParameterDisplay();
            
            // Render equations as LaTeX
            this.renderEquations();
        } catch (error) {
            console.error('Error parsing system:', error);
            if (error instanceof SyntaxError) {
                alert('Error parsing parameters JSON. Please check your JSON syntax.\nError: ' + error.message);
            } else {
                alert('Error parsing equations. Please check your syntax.\nError: ' + error.message);
            }
        }
    }
    
    updateViewRange() {
        this.xMin = parseFloat(document.getElementById('x-min').value);
        this.xMax = parseFloat(document.getElementById('x-max').value);
        this.yMin = parseFloat(document.getElementById('y-min').value);
        this.yMax = parseFloat(document.getElementById('y-max').value);
    }
    
    resetView() {
        this.xMin = -3;
        this.xMax = 3;
        this.yMin = -3;
        this.yMax = 3;
        
        document.getElementById('x-min').value = this.xMin;
        document.getElementById('x-max').value = this.xMax;
        document.getElementById('y-min').value = this.yMin;
        document.getElementById('y-max').value = this.yMax;
        
        this.draw();
    }
    
    loadPreset(preset) {
        if (!preset) return;
        
        const presets = {
            'van-der-pol': {
                dxdt: 'y',
                dydt: 'mu * (1 - x^2) * y - x',
                parameters: { mu: 1 }
            },
            'pendulum': {
                dxdt: 'y',
                dydt: '-sin(x) - gamma * y',
                parameters: { gamma: 0.1 }
            },
            'lotka-volterra': {
                dxdt: 'alpha * x - beta * x * y',
                dydt: 'delta * x * y - gamma * y',
                parameters: { alpha: 1, beta: 1, delta: 1, gamma: 1 }
            },
            'spiral': {
                dxdt: 'sigma * x - y',
                dydt: 'x + sigma * y',
                parameters: { sigma: -0.1 }
            }
        };
        
        if (presets[preset]) {
            document.getElementById('dx-dt').value = presets[preset].dxdt;
            document.getElementById('dy-dt').value = presets[preset].dydt;
            
            // Set parameters if available
            if (presets[preset].parameters) {
                document.getElementById('parameters').value = JSON.stringify(presets[preset].parameters, null, 2);
            } else {
                document.getElementById('parameters').value = '{}';
            }
            
            this.updateSystem();
            this.draw();
        }
    }
    
    validateParameters(parametersInput) {
        const parametersField = document.getElementById('parameters');
        const helpText = parametersField.parentNode.querySelector('.help-text');
        
        if (!parametersInput.trim()) {
            // Empty is valid
            parametersField.style.borderColor = '#e9ecef';
            helpText.textContent = 'Define custom parameters as JSON object';
            helpText.style.color = '#6c757d';
            return;
        }
        
        try {
            const parsed = JSON.parse(parametersInput);
            if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                parametersField.style.borderColor = '#28a745';
                helpText.textContent = 'Valid JSON parameters';
                helpText.style.color = '#28a745';
            } else {
                parametersField.style.borderColor = '#dc3545';
                helpText.textContent = 'Parameters must be a JSON object';
                helpText.style.color = '#dc3545';
            }
        } catch (error) {
            parametersField.style.borderColor = '#dc3545';
            helpText.textContent = 'Invalid JSON syntax';
            helpText.style.color = '#dc3545';
        }
    }
    
    updateParameterDisplay() {
        const display = document.getElementById('current-parameters');
        if (Object.keys(this.parameters).length > 0) {
            const paramStr = Object.entries(this.parameters)
                .map(([key, value]) => `${key}=${value}`)
                .join(', ');
            display.textContent = `Parameters: ${paramStr}`;
        } else {
            display.textContent = '';
        }
    }
    
    convertToLatex(expression) {
        // Convert common mathematical expressions to LaTeX
        let latex = expression;
        
        // Replace power notation (handle more complex cases)
        latex = latex.replace(/\b([a-zA-Z]\w*|\([^)]+\))\s*\^\s*(\d+)/g, '$1^{$2}');
        latex = latex.replace(/\b([a-zA-Z]\w*|\([^)]+\))\s*\^\s*(\([^)]+\))/g, '$1^{$2}');
        latex = latex.replace(/\b([a-zA-Z]\w*|\([^)]+\))\s*\^\s*([a-zA-Z]\w*)/g, '$1^{$2}');
        
        // Handle specific cases like x^2, y^2
        latex = latex.replace(/([xy])\s*\^\s*2/g, '$1^2');
        
        // Replace multiplication signs with \cdot, but be smart about it
        latex = latex.replace(/\*\s*/g, ' \\cdot ');
        
        // Remove unnecessary \cdot before parentheses
        latex = latex.replace(/\\cdot\s*\(/g, '(');
        latex = latex.replace(/\)\s*\\cdot\s*/g, ')');
        
        // Replace common functions
        latex = latex.replace(/\bsin\b/g, '\\sin');
        latex = latex.replace(/\bcos\b/g, '\\cos');
        latex = latex.replace(/\btan\b/g, '\\tan');
        latex = latex.replace(/\bexp\b/g, '\\exp');
        latex = latex.replace(/\blog\b/g, '\\log');
        latex = latex.replace(/\bsqrt\b/g, '\\sqrt');
        
        // Replace Greek letters commonly used as parameters
        latex = latex.replace(/\bmu\b/g, '\\mu');
        latex = latex.replace(/\balpha\b/g, '\\alpha');
        latex = latex.replace(/\bbeta\b/g, '\\beta');
        latex = latex.replace(/\bgamma\b/g, '\\gamma');
        latex = latex.replace(/\bdelta\b/g, '\\delta');
        latex = latex.replace(/\bsigma\b/g, '\\sigma');
        latex = latex.replace(/\bomega\b/g, '\\omega');
        
        // Replace pi and e
        latex = latex.replace(/\bpi\b/g, '\\pi');
        latex = latex.replace(/\be\b/g, 'e');
        
        // Handle parentheses for functions
        latex = latex.replace(/(\\(?:sin|cos|tan|exp|log|sqrt))\s*\(/g, '$1(');
        
        // Clean up spaces around operators
        latex = latex.replace(/\s*([+\-=])\s*/g, ' $1 ');
        latex = latex.replace(/\s+/g, ' ').trim();
        
        return latex;
    }
    
    renderEquations() {
        const dxdtInput = document.getElementById('dx-dt').value;
        const dydtInput = document.getElementById('dy-dt').value;
        const equationDisplay = document.getElementById('equation-display');
        const latexContainer = document.getElementById('latex-equations');
        
        if (!dxdtInput.trim() && !dydtInput.trim()) {
            equationDisplay.classList.add('hidden');
            return;
        }
        
        equationDisplay.classList.remove('hidden');
        
        const dxdtLatex = this.convertToLatex(dxdtInput);
        const dydtLatex = this.convertToLatex(dydtInput);
        
        const latexContent = `
            \\begin{align}
            \\frac{dx}{dt} &= ${dxdtLatex} \\\\
            \\frac{dy}{dt} &= ${dydtLatex}
            \\end{align}
        `;
        
        latexContainer.innerHTML = `$$${latexContent}$$`;
        
        // Re-render MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([latexContainer]).catch((err) => {
                console.log('MathJax rendering error:', err);
            });
        }
    }
    
    evaluateSystem(x, y) {
        // Return zero vector if equations haven't been compiled yet
        if (!this.dxdt || !this.dydt) {
            return { dx: 0, dy: 0 };
        }
        
        try {
            // Create scope with x, y and custom parameters
            const scope = { x: x, y: y, ...this.parameters };
            const dx = this.dxdt.evaluate(scope);
            const dy = this.dydt.evaluate(scope);
            return { dx, dy };
        } catch (error) {
            console.error('Error evaluating system:', error);
            return { dx: 0, dy: 0 };
        }
    }
    
    worldToCanvasX(x) {
        return ((x - this.xMin) / (this.xMax - this.xMin)) * this.canvasWidth;
    }
    
    worldToCanvasY(y) {
        return this.canvasHeight - ((y - this.yMin) / (this.yMax - this.yMin)) * this.canvasHeight;
    }
    
    canvasToWorldX(canvasX) {
        return this.xMin + (canvasX / this.canvasWidth) * (this.xMax - this.xMin);
    }
    
    canvasToWorldY(canvasY) {
        return this.yMin + ((this.canvasHeight - canvasY) / this.canvasHeight) * (this.yMax - this.yMin);
    }
    
    drawGrid() {
        if (!this.showGrid) return;
        
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        const xStep = (this.xMax - this.xMin) / 10;
        for (let x = this.xMin; x <= this.xMax; x += xStep) {
            const canvasX = this.worldToCanvasX(x);
            this.ctx.beginPath();
            this.ctx.moveTo(canvasX, 0);
            this.ctx.lineTo(canvasX, this.canvasHeight);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        const yStep = (this.yMax - this.yMin) / 10;
        for (let y = this.yMin; y <= this.yMax; y += yStep) {
            const canvasY = this.worldToCanvasY(y);
            this.ctx.beginPath();
            this.ctx.moveTo(0, canvasY);
            this.ctx.lineTo(this.canvasWidth, canvasY);
            this.ctx.stroke();
        }
        
        // Axes
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        
        // X-axis
        if (this.yMin <= 0 && this.yMax >= 0) {
            const y0 = this.worldToCanvasY(0);
            this.ctx.beginPath();
            this.ctx.moveTo(0, y0);
            this.ctx.lineTo(this.canvasWidth, y0);
            this.ctx.stroke();
        }
        
        // Y-axis
        if (this.xMin <= 0 && this.xMax >= 0) {
            const x0 = this.worldToCanvasX(0);
            this.ctx.beginPath();
            this.ctx.moveTo(x0, 0);
            this.ctx.lineTo(x0, this.canvasHeight);
            this.ctx.stroke();
        }
    }
    
    drawArrow(x1, y1, x2, y2) {
        const headlen = 8; // Arrow head length
        const angle = Math.atan2(y2 - y1, x2 - x1);
        
        // Draw line
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        // Draw arrow head
        this.ctx.beginPath();
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }
    
    drawFlowField() {
        this.ctx.strokeStyle = this.arrowColor;
        this.ctx.lineWidth = 1.5;
        
        const stepX = (this.xMax - this.xMin) / this.gridDensity;
        const stepY = (this.yMax - this.yMin) / this.gridDensity;
        
        for (let i = 0; i <= this.gridDensity; i++) {
            for (let j = 0; j <= this.gridDensity; j++) {
                const x = this.xMin + i * stepX;
                const y = this.yMin + j * stepY;
                
                const { dx, dy } = this.evaluateSystem(x, y);
                
                // Normalize and scale the vector
                const magnitude = Math.sqrt(dx * dx + dy * dy);
                if (magnitude > 0) {
                    const scale = this.arrowScale * 20; // Base scale factor
                    const normalizedDx = (dx / magnitude) * scale;
                    const normalizedDy = (dy / magnitude) * scale;
                    
                    const startX = this.worldToCanvasX(x);
                    const startY = this.worldToCanvasY(y);
                    const endX = startX + normalizedDx;
                    const endY = startY - normalizedDy; // Flip Y for canvas coordinates
                    
                    this.drawArrow(startX, startY, endX, endY);
                }
            }
        }
    }
    
    drawNullclines() {
        if (!this.showNullclines) return;
        
        this.ctx.lineWidth = 2;
        
        // dx/dt = 0 nullcline (red)
        this.ctx.strokeStyle = '#e74c3c';
        this.drawNullcline(true);
        
        // dy/dt = 0 nullcline (blue)
        this.ctx.strokeStyle = '#3498db';
        this.drawNullcline(false);
    }
    
    drawNullcline(isDxDt) {
        const resolution = 200;
        const stepX = (this.xMax - this.xMin) / resolution;
        
        this.ctx.beginPath();
        let pathStarted = false;
        
        for (let i = 0; i <= resolution; i++) {
            const x = this.xMin + i * stepX;
            
            // Find y where the derivative is approximately zero
            for (let y = this.yMin; y <= this.yMax; y += (this.yMax - this.yMin) / 100) {
                const { dx, dy } = this.evaluateSystem(x, y);
                const value = isDxDt ? dx : dy;
                
                if (Math.abs(value) < 0.05) { // Threshold for "zero"
                    const canvasX = this.worldToCanvasX(x);
                    const canvasY = this.worldToCanvasY(y);
                    
                    if (!pathStarted) {
                        this.ctx.moveTo(canvasX, canvasY);
                        pathStarted = true;
                    } else {
                        this.ctx.lineTo(canvasX, canvasY);
                    }
                    break;
                }
            }
        }
        
        this.ctx.stroke();
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw components
        this.drawGrid();
        
        // Show message if no equations loaded
        if (!this.dxdt || !this.dydt) {
            this.ctx.fillStyle = '#666';
            this.ctx.font = '18px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Click "Update System" to visualize flow field', 
                this.canvasWidth / 2, this.canvasHeight / 2);
        } else {
            this.drawFlowField();
            this.drawNullclines();
        }
    }
}

// Function to initialize when math.js is ready
function initializeVisualizer() {
    if (typeof math === 'undefined') {
        console.error('Math.js library not available');
        alert('Math library not loaded. Please check your internet connection and refresh the page.');
        return;
    }
    
    // Test math.js functionality
    try {
        console.log('Testing math.js...');
        const testExpr = math.parse('x + y').compile();
        const testResult = testExpr.evaluate({x: 1, y: 2});
        console.log('Math.js test successful, result:', testResult);
        
        // Test power operator
        const testPower = math.parse('x^2').compile();
        const powerResult = testPower.evaluate({x: 3});
        console.log('Power test successful, result:', powerResult);
        
    } catch (error) {
        console.error('Math.js test failed:', error);
        alert('Math library test failed: ' + error.message);
        return;
    }
    
    new DynamicalSystemVisualizer();
}

// Initialize the visualizer when everything is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Give a small delay to ensure external scripts are loaded
        setTimeout(initializeVisualizer, 100);
    });
} else {
    // DOM is already ready
    initializeVisualizer();
}
