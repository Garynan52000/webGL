# 初级入门 --- 从一个点开始：掌握 WebGL 的编程要素

## 目标
鼠标点击一次，就会在点击位置处绘制一个随机颜色的点。

## 基本术语

- **图元：** WebGL 能够绘制的基本图形元素，包含三种：点、线段、三角形。
- **片元：** 可以理解为像素，像素着色阶段是在片元着色器中。
- **裁剪坐标系：** 裁剪坐标系是顶点着色器中的 `gl_Position` 内置变量接收到的坐标所在的坐标系。
- **设备坐标系：** 又名 `NDC` 坐标系，是裁剪坐标系各个分量对 `w` 分量相除得到的坐标系，特点是 `x、y、z` 坐标分量的取值范围都在 `【-1，1】`之间，可以将它理解为边长为 `2` 的正方体，坐标系原点在正方体中心。

## 第一步: 绘制一个在屏幕中心，大小为 10，颜色是红色的点。
一个 `WebGL` 程序由两部分组成: `JavaScript程序 ` 和 `着色器程序`(GLSL编写)。

#### 编写着色器源码

- 顶点着色器
顶点着色器的主要任务是告诉 `GPU` 在裁剪坐标系的原点（也就是屏幕中心）画一个大小为 `10` 的点。

```
void main(){
  //声明顶点位置
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  //声明待绘制的点的大小。
  gl_PointSize = 10.0;
}
```

- 片元着色器
顶点着色器中的数据经过 `图元装配` 和 `光栅化` 之后，来到了 `片元着色器`，在本例中，片元着色器的任务是通知 `GPU` 将光栅化后的像素渲染成红色，所以片元着色器要对内置变量 `gl_FragColor` （代表像素要填充的颜色）进行赋值。

```
void main(){
  //设置像素的填充颜色为红色。
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
}
```

###### GLSL 语法解释
- `gl_Position`、`gl_PointSize`、`gl_FragColor` 是 `GLSL` 的内置属性。

  - **`gl_Position：`** 顶点的 `裁剪坐标系坐标`，包含 `X, Y, Z，W` 四个坐标分量，顶点着色器接收到这个坐标之后，对它进行透视除法，即将各个分量同时除以 `W`，转换成 `NDC 坐标`，`NDC 坐标` 每个分量的取值范围都在 `【-1, 1】` 之间，`GPU` 获取这个属性值作为顶点的最终位置进行绘制。

  - **`gl_FragColor：`** 片元（像素）颜色，包含 `R, G, B, A` 四个颜色分量，且每个分量的取值范围在 `【0,1】` 之间，`GPU` 获取这个值作为像素的最终颜色进行着色。

  - **`gl_PointSize:`** 绘制到屏幕的点的大小，需要注意的是， `gl_PointSize` 只有在绘制图元是点的时候才会生效。当我们绘制线段或者三角形的时候，`gl_PointSize` 是不起作用的。

- **`vec4：`** 表示包含 **四个浮点元素的容器类型** ，`vec` 是 vector（向量）的单词简写，`vec4` 代表包含 4 个浮点数的向量。此外，还有 vec2、vec3 等类型，代表包含2个或者3个浮点数的容器。

- `GLSL` 中 `gl_Position` 所接收的坐标所在坐标系是 `裁剪坐标系` ，不同于我们的浏览器窗口坐标系。所以当我们赋予 `gl_Position` 位置信息的时候，**需要对其进行转换才能正确显示。**

- `gl_FragColor`，属于 GLSL 内置属性，用来设置片元颜色，包含 4 个分量 (R, G, B, A)，各个颜色分量的取值范围是【0，1】，也不同于我们常规颜色的【0，255】取值范围，所以当我们给 gl_FragColor 赋值时，也需要对其进行转换。平常我们所采用的颜色值（R, G, B, A），**对应的转换公式为： (R值/255，G值/255，B值/255，A值/1）。** 拿红色举例，在CSS中，红色用 RGBA 形式表示是（255，0，0，1），那么转换成 GLSL 形式就是(255 / 255, 0 / 255, 0 / 255, 1 / 1)，转换后的值为（1.0, 0.0, 0.0, 1.0)。

> 注意，`GLSL` 是强类型语言，定义变量时，数据类型和值一定要匹配正确，比如我们给 `浮点数 a` 赋值 `1`，我们需要这样写：`float a = 1.0; ` 如果用 `float a = 1;` 的话会报错。

#### 编写 JavaSctipt 程序
准备一个 `HTML` 文件至少需要包含一个 `canvas` 标签，另外需要两个存储着色器源码的 `script` 标签。 `WebGL` 程序需要在 `canvas` 上下文中运行：
```
# 获取 WebGL 绘图环境
const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
```

> 在某些浏览器中，我们还需要做下兼容处理，加上实验前缀。

- 创建**顶点着色器**对象：
```
// 获取顶点着色器源码
const vertexShaderSource = document.querySelector('#vertexShader').innerHTML;
// 创建顶点着色器对象
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// 将源码分配给顶点着色器对象
gl.shaderSource(vertexShader, vertexShaderSource);
// 编译顶点着色器程序
gl.compileShader(vertexShader);
```

- 创建**片元着色器**对象，该过程和顶点着色器的创建过程类似，区别在于着色器源码和着色器类型。
```
// 获取片元着色器源码
const fragmentShaderSource = document.querySelector('#fragmentShader').innerHTML;
// 创建片元着色器程序
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// 将源码分配给片元着色器对象
gl.shaderSource(fragmentShader, fragmentShaderSource);
// 编译片元着色器
gl.compileShader(fragmentShader);
```

- 着色器对象创建完毕，接下来我们开始创建着色器程序
```
// 创建着色器程序
const program = gl.createProgram();
// 将顶点着色器挂载在着色器程序上。
gl.attachShader(program, vertexShader); 
// 将片元着色器挂载在着色器程序上。
gl.attachShader(program, fragmentShader);
// 链接着色器程序
gl.linkProgram(program);
```

- 有时候一个 WebGL 应用包含多个 program，所以在使用某个 program 绘制之前，我们要先启用它。
```
gl.useProgram(program);
```

- 接下来开始绘制：
```
// 设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);
// 用上一步设置的清空画布颜色清空画布。
gl.clear(gl.COLOR_BUFFER_BIT);
// 绘制点。
gl.drawArrays(gl.POINTS, 0, 1);
```

> void gl.drawArrays(mode, first, count); <br>
> 参数：<br>
> `mode`，图元类型。 <br>
> `first`，从第几个点开始绘制。 <br>
> `count`，绘制的点的数量。 <br>

至此，着色器部分和 JavaScript 程序都写完了，运行看下效果。

#### 总结
总结一下绘制一个点的步骤，并且**封装公共代码**。

```
// 获取canvas
const canvas = getCanvas(id);

// 获取webgl绘图环境
const gl = getWebGLContext(canvas);

// 创建顶点着色器
const vertexShader = createShaderFromScript(gl, gl.VERTEX_SHADER,'vertexShader');

// 创建片元着色器
const fragmentShader = createShaderFromScript(gl, gl.FRAGMENT_SHADER,'fragmentShader');

// 创建着色器程序
const program = createProgram(gl ,vertexShader, fragmentShader);

// 告诉 WebGL 运行哪个着色器程序
gl.useProgram(program);

// 设置清空画布颜色为黑色。
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// 用上一步设置的清空画布颜色清空画布。
gl.clear(gl.COLOR_BUFFER_BIT);

// 绘制点
gl.drawArrays(gl.POINTS, 0, 1);
```

## 第二步: 点的动态绘制