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

Link your screen recording here showing:
- Python static and interactive
- R static and interactive
- Optional: 3D chart

## Repo Notes

- Output files (.py, .R, .png, .html) are temporarily saved and used for rendering
- Visualization logic is isolated per language
- Sandbox execution is implemented securely

