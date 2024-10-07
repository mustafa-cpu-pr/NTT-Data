package main

import (
	"image"
	"image/color"
	"image/draw"
	"image/png"

	"os"
)

func main() {
	width := 600
	height := 400
	img := image.NewRGBA(image.Rect(0, 0, width, height))
	white := color.RGBA{255, 255, 255, 255}
	draw.Draw(img, img.Bounds(), &image.Uniform{white}, image.Point{}, draw.Src)

	// Line chart data with scaling
	data := []struct {
		X, Y int
	}{
		{50, 300},
		{100, 250},
		{150, 200},
		{200, 180},
		{250, 220},
		{300, 170},
	}

	// Draw the line chart
	lineColor := color.RGBA{0, 0, 255, 255} // Blue
	for i := 0; i < len(data)-1; i++ {
		drawwLine(img, data[i].X, data[i].Y, data[i+1].X, data[i+1].Y, lineColor)
	}

	// Draw axes
	axisColor := color.RGBA{0, 0, 0, 255}                         // Black
	drawwLine(img, 50, height-50, width-50, height-50, axisColor) // X-axis
	drawwLine(img, 50, height-50, 50, 50, axisColor)              // Y-axis

	// Save the image
	file, err := os.Create("line_chart.png")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	err = png.Encode(file, img)
	if err != nil {
		panic(err)
	}
}

func drawwLine(img *image.RGBA, x1, y1, x2, y2 int, col color.Color) {
	dx, dy := abss(x2-x1), abss(y2-y1)
	sx, sy := -1, -1
	if x1 < x2 {
		sx = 1
	}
	if y1 < y2 {
		sy = 1
	}
	err := dx - dy

	for {
		img.Set(x1, y1, col)
		if x1 == x2 && y1 == y2 {
			return
		}
		e2 := 2 * err
		if e2 > -dy {
			err -= dy
			x1 += sx
		}
		if e2 < dx {
			err += dx
			y1 += sy
		}
	}
}

func abss(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
