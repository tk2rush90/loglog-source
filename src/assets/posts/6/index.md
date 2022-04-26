This is a post on how to combine several images into one on the client side.
This can be made possible by drawing images one by in the `<canvas>` element.
What you need to know is `CanvasRenderingContext2D` of `<canvas>` element and `Image` class.

# CanvasRenderingContext2D

`CanvasRenderingContext2D` is a part of the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
that allows you to draw 2D images on the `<canvas>` element.
You can get this by using the `getContext()` method in the `<canvas>` element.

```javascript
const cavnas = document.querySelector('canvas');
/**
 * This is the `CanvasRenderingContext2D` of canvas element.
 * @type {CanvasRenderingContext2D}
 */
const context = canvas.getContext('2d');
```

`CanvasRenderingContext2D` has `drawImage()` method that allows you to add an image.
You must pass `CanvasImageSource` to the first parameter of this method.
The `CanvasImageSource` interface includes the followings:

- `HTMLImageElement`
- `SVGImageElement`
- `HTMLVideoElement`
- `HTMLCanvasElement`
- `ImageBitmap`
- `OffscreenCanvas`

From here, I will let you know how to generate `HTMLImageElement` using the `Image` class.

# Image class

Creating `HTMLImageElement` by using `Image` class is simple.

```javascript
/**
 * You can pass the parameters to constructor to set image initial size.
 * @type {HTMLImageElement}
 */
const image = new Image();
```

Since the generated `image` is `HTMLImageElement`, you can set image url to `src` property.
And after the image is loaded, you can add it to the canvas using the `drawImage()` method.

```javascript
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const image = new Image();

image.src = 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg';
image.onload = () => {
  context.drawImage(
    image,
    0, // The image x position in canvas.
    0, // The image y position in canvas.
    567, // Image width to draw in canvas.
    864, // Image height to draw in canvas.
  );
}
```

Don't forget to adjust the size of the image to be drawn on the canvas to the canvas area.
Below is the utilised source code.

# Utilized source code

## Javascript

```javascript
/**
 * Class to draw layer on canvas.
 * @param canvas {HTMLCanvasElement}
 * @constructor
 */
function CanvasLayerDrawer(canvas) {
  /**
   * Set canvas original element.
   * @type {HTMLCanvasElement}
   */
  this._canvas = canvas;
  
  /**
   * Set context.
   * @type {CanvasRenderingContext2D}
   */
  this._context = this._canvas.getContext('2d');
}

/**
 * Add image to canvas by using image url.
 * @param src {string} Image url to draw.
 * @param x {number} The image x position in canvas.
 * @param y {number} The image y position in canvas.
 * @param width {number} Image width to draw in canvas.
 * @param height {number} Image height to draw in canvas.
 */
CanvasLayerDrawer.prototype.addImageLayerByUrl = function (src, x, y, width, height) {
  return new Promise((resolve, reject) => { 
    const image = new Image();
    
    image.onerror = () => {
      reject();
    }
    
    image.onload = () => {
      this.addImageLayer(image, x, y, width, height);
      resolve();
    }
    
    image.src = src;
  });
}

/**
 * Add image source to canvas.
 * @param image {CanvasImageSource} Image source to render.
 * @param x {number} The image x position in canvas.
 * @param y {number} The image y position in canvas.
 * @param width {number} Image width to draw in canvas.
 * @param height {number} Image height to draw in canvas.
 */
CanvasLayerDrawer.prototype.addImageLayer = function (image, x, y, width, height) {
  this._context.drawImage(image, x, y, width, height);
}
```

## Typescript

```typescript
/**
 * Class to draw layer on canvas.
 */
class CanvasLayerDrawer {
  /**
   * The canvas original element.
   */
  private _canvas: HTMLCanvasElement;

  /**
   * The canvas 2D rendering context.
   */
  private _context: CanvasRenderingContext2D;
  
  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
  }

  /**
   * Add image to canvas by using image url.
   * @param src Image url to draw.
   * @param x The image x position in canvas.
   * @param y The image y position in canvas.
   * @param width Image width to draw in canvas.
   * @param height Image height to draw in canvas.
   */
  addImageLayerByUrl(
    src: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onerror = () => {
        reject();
      }

      image.onload = () => {
        this.addImageLayer(image, x, y, width, height);
        resolve();
      }

      image.src = src;
    });
  }

  /**
   * Add image source to canvas.
   * @param image Image source to render.
   * @param x The image x position in canvas.
   * @param y The image y position in canvas.
   * @param width Image width to draw in canvas.
   * @param height Image height to draw in canvas.
   */
  addImageLayer(
    image: CanvasImageSource,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    this._context.drawImage(image, x, y, width, height);
  }
}
```

## Usage

```javascript
const canvas = document.querySelector('canvas');
const canvasLayerDrawer = new canvasLayerDrawer(canvas);

canvasLayerDrawer.addImageLayerByUrl(
  'https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg',
  0,
  0,
  567,
  864,
).then(() => console.log('added')).catch(() => console.log('failed to load image'));
```
