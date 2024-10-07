package main

import (
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"math"
	"os"
)

func main() {
	width := 600
	height := 400
	img := image.NewRGBA(image.Rect(0, 0, width, height))
	white := color.RGBA{255, 255, 255, 255}
	draw.Draw(img, img.Bounds(), &image.Uniform{white}, image.Point{}, draw.Src)

	center := image.Point{X: width / 2, Y: height / 2}
	radius := 150
	slices := []struct {
		Value float64
		Color color.Color
	}{
		{Value: 30, Color: color.RGBA{255, 0, 0, 255}}, // Red
		{Value: 20, Color: color.RGBA{0, 0, 255, 255}}, // Blue
		{Value: 50, Color: color.RGBA{0, 255, 0, 255}}, // Green
	}

	total := 0.0
	for _, slice := range slices {
		total += slice.Value
	}

	startAngle := 0.0
	for _, slice := range slices {
		endAngle := startAngle + (slice.Value / total * 2 * math.Pi)
		drawSlice(img, center, radius, startAngle, endAngle, slice.Color)
		startAngle = endAngle
	}

	file, err := os.Create("pie_chart.png")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	err = png.Encode(file, img)
	if err != nil {
		panic(err)
	}
}

func drawSlice(img *image.RGBA, center image.Point, radius int, startAngle, endAngle float64, col color.Color) {
	// Convert to radians
	radStart := startAngle
	radEnd := endAngle

	// Define the slice center
	//sliceCenter := image.Point{X: center.X, Y: center.Y}
	sliceImg := image.NewRGBA(image.Rect(0, 0, 2*radius, 2*radius))
	draw.Draw(sliceImg, sliceImg.Bounds(), &image.Uniform{color.Transparent}, image.Point{}, draw.Src)

	// Draw the slice
	for angle := radStart; angle < radEnd; angle += 0.01 {
		rad := angle
		nextRad := angle + 0.01

		// Calculate coordinates
		x1 := int(float64(radius) + float64(radius)*math.Cos(rad))
		y1 := int(float64(radius) - float64(radius)*math.Sin(rad))
		x2 := int(float64(radius) + float64(radius)*math.Cos(nextRad))
		y2 := int(float64(radius) - float64(radius)*math.Sin(nextRad))

		// Draw lines to create the slice
		drawLine(sliceImg, radius, radius, x1, y1, col)
		drawLine(sliceImg, radius, radius, x2, y2, col)
		drawLine(sliceImg, x1, y1, x2, y2, col)
	}

	// Paste the slice onto the main image
	draw.Draw(img, image.Rect(center.X-radius, center.Y-radius, center.X+radius, center.Y+radius), sliceImg, image.Point{}, draw.Over)
}

func drawLine(img *image.RGBA, x1, y1, x2, y2 int, col color.Color) {
	dx := abs(x2 - x1)
	dy := abs(y2 - y1)
	sx := -1
	sy := -1
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

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
