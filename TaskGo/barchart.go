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

	barColor := color.RGBA{0, 0, 255, 255}
	bars := []struct {
		Label string
		Value int
	}{
		{"A", 30},
		{"B", 20},
		{"C", 50},
	}

	barWidth := 50
	spacing := 20
	xOffset := 50

	for i, bar := range bars {
		x := xOffset + i*(barWidth+spacing)
		y := height - (bar.Value * 3) // Scaling
		rect := image.Rect(x, y, x+barWidth, height-50)
		draw.Draw(img, rect, &image.Uniform{barColor}, image.Point{}, draw.Src)
	}

	file, err := os.Create("bar_chart.png")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	err = png.Encode(file, img)
	if err != nil {
		panic(err)
	}
}
