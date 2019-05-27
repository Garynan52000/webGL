var _WebglContext = class {
    
    constructor({
        id,
    }) {
        this.canvas = document.getElementById(id);
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl')
    }

    /**
     * 创建定点着色器对象
     */
    createVertexShader() {
        return this.gl.createShader(this.gl.VERTEX_SHADER);
    }

    /**
     * 创建片元着色器对象
     */
    createFragmentShader() {
        return this.gl.createShader(this.gl.FRAGMENT_SHADER);
    }

    /**
     * 分配着色器程序源码给着色器对象
     */
    shaderSource(shader, shaderSource) {
        this.gl.shaderSource(shader, shaderSource);
    }

    /**
     * 编译着色器程序
     */
    compileShader(shader) {
        this.gl.compileShader(shader);
    }

    /**
     * 创建着色器程序
     */
    createProgram() {
        return this.gl.createProgram();
    }

    /**
     * 将着色器挂载在着色器程序上。
     */
    programAttachShader(program, shader) {
        this.gl.attachShader(program, shader); 
    }

    /**
     * 链接着色器程序
     */
    linkProgram(program) {
        this.gl.linkProgram(program);
    }

    /**
     * 先启用着色器程序
     */
    useProgram(program) {
        this.gl.useProgram(program);
    }

    /**
     * 用上一步设置的清空画布颜色清空画布。 
     */
    clearImmediately([r,g,b,a]) {
        this.gl.clearColor(r || 0.0, g || 0.0, b || 0.0, a || 0.0);
        this.gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * 绘制
     */
    drawArrays() {
        this.gl.drawArrays(gl.POINTS, 0, 1);
    }
}