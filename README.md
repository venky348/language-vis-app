# Multi-Language Visualization Web App

This project is a language-agnostic web application that allows users to write and execute custom Python or R code to generate and view static, interactive, and even 3D visualizations — all in the browser.

## Features

- Supports both Python and R
- Handles static plots (matplotlib, ggplot2)
- Renders interactive visualizations (Plotly)
- Dynamic code execution on backend
- Built-in dark/light mode toggle
- Clean and responsive UI

## Tech Stack

| Layer       | Tools                        |
|-------------|------------------------------|
| Frontend    | React (with inline styling)  |
| Backend     | Flask                        |
| Languages   | Python, R                    |
| Viz Libs    | Matplotlib, Plotly, ggplot2  |

## How to Run

### Backend (Flask)

```bash
cd backend
python app.py
```

Make sure you have matplotlib, plotly, and Rscript available in your PATH. Also install ggplot2 and plotly inside R. For R interactive plots, install pandoc.

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

Then open: http://localhost:3000

## Test Examples

### Python Static Plot

```python
import matplotlib.pyplot as plt
plt.plot([1, 2, 3], [4, 6, 5])
plt.title("Simple Line Plot")
```

### Python Interactive Plot

```python
import plotly.express as px
df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
```

### R Static Plot

```r
library(ggplot2)
df <- data.frame(x=c("A", "B", "C"), y=c(10, 15, 12))
ggplot(df, aes(x, y)) + geom_col(fill="tomato") + ggtitle("Bar Plot in R")
```

### R Interactive Plot

```r
library(plotly)
fig <- plot_ly(data = iris, x = ~Sepal.Length, y = ~Petal.Length, color = ~Species, type = 'scatter', mode = 'markers')
```

### Python 3D Plot

```python
import plotly.graph_objects as go
import numpy as np
x, y = np.meshgrid(np.linspace(-2, 2, 50), np.linspace(-2, 2, 50))
z = np.sin(x ** 2 + y ** 2)
fig = go.Figure(data=[go.Surface(z=z)])
```

## Demo Recording

Watch the full demo here: [https://youtu.be/Y3XCqwzFXg0](https://youtu.be/Y3XCqwzFXg0)

The video demonstrates:
- Python static and interactive
- R static and interactive
- Python 3D visualization
- (Optional) R 3D visualization using Plotly


## Repo Notes

- Output files (.py, .R, .png, .html) are temporarily saved and used for rendering
- Visualization logic is isolated per language
- Sandbox execution is implemented securely

## Status: COMPLETE

- All core features
- All required chart types
- Fully responsive and styled
- Clean repo and ready to share

## Overview of Design and Tools Used

This web application was designed to support language-agnostic visualization generation by executing user-submitted code written in either Python or R.

- Frontend: Built using React with custom inline styling. The UI includes a language selector, code editor, generate button, and an embedded output area. A dark/light mode toggle is also included.
- Backend: Developed using Flask (Python). It exposes a single `/run` endpoint that receives the code and language, dynamically executes it, and returns either an image or an HTML plot depending on the visualization type.
- Visualization Libraries:
  - Python: matplotlib for static visualizations and plotly for interactive/3D charts.
  - R: ggplot2 for static plots and plotly (via htmlwidgets) for interactive charts.
- Execution Handling: Scripts are written to temporary files, executed using subprocess, and rendered securely. Plot outputs are returned as image files or embedded HTML content.
- Output Types: Supports both .png and .html renderings inside the frontend iframe or image container.

## Issues Encountered and Resolutions

1. Plotly HTML Response Not Displaying  
   - Problem: Interactive plots (Python/R) returned HTML, but the React frontend showed “Unsupported response type.”  
   - Fix: Explicitly checked Content-Type and rendered HTML using `srcDoc` in an iframe.

2. Rscript Not Using Correct Library Path  
   - Problem: Installed R packages (like `ggplot2`) weren’t found during backend execution.  
   - Fix: Used `shutil.which("Rscript")` to debug the active path and hardcoded the correct Rscript path in subprocess.

3. Missing Pandoc for R Plotly Export  
   - Problem: R's `htmlwidgets::saveWidget(..., selfcontained=TRUE)` failed without Pandoc.  
   - Fix: Installed Pandoc via Homebrew and verified it was accessible in shell.

4. Tailwind Conflicts with React Scripts  
   - Problem: Tailwind v4 conflicted with `react-scripts` v5, breaking the layout.  
   - Fix: Downgraded to Tailwind v3 and eventually reverted to plain React + inline styles for better control and simplicity.

5. File Management During Debugging  
   - Problem: Visualization scripts and images cluttered the working directory during testing.  
   - Fix: Organized outputs into `scripts/`, `images/`, and `html/` folders with UUID-based filenames. Cleanup was disabled during dev for debugging and re-enabled later.
