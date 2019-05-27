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
     * @param shader 着色器对象
     * @param shaderSource GLSL 着色器源码
     */
    shaderSource(shader, shaderSource) {
        this.gl.shaderSource(shader, shaderSource);
    }

    /**
     * 编译着色器程序
     * @param shader 着色器对象
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
     * @param program 着色器程序
     * @param shader 着色器对象
     */
    programAttachShader(program, shader) {
        this.gl.attachShader(program, shader); 
    }

    /**
     * 链接着色器程序
     * @param program 着色器程序
     */
    linkProgram(program) {
        this.gl.linkProgram(program);
    }

    /**
     * 先启用着色器程序
     * @param program 着色器程序
     */
    useProgram(program) {
        this.gl.useProgram(program);
    }

    /**
     * 用上一步设置的清空画布颜色清空画布。 
     */
    clearImmediately([r,g,b,a]) {
        this.gl.clearColor(r / 255 || 0.0, g / 255 || 0.0, b / 255 || 0.0, a / 1 || 0.0);
        this.gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * 绘制
     */
    drawArrays() {
        this.gl.drawArrays(gl.POINTS, 0, 1);
    }

    /**
     * 获取 attribute 变量
     * @param {*} program 着色器程序
     * @param {*} attrName attribute 变量名
     */
    getAttribLocation(program, attrName) {
        return this.gl.getAttribLocation(program, attrName);
    }

    /**
     * 获取 uniform 变量
     * @param {*} program 着色器程序 
     * @param {*} uniformName uniform 变量名
     */
    getUniformLocation(program, uniformName) {
        return this.gl.getUniformLocation(program, uniformName);
    }

    /**
     * 2 位浮点数 attribute 变量赋值
     * @param {*} attribute  attribute变量
     * @param {*} val0 
     * @param {*} val1 
     */
    vertexAttrib2f(attribute, val0, val1) {
        this.gl.vertexAttrib2f(attribute, val0, val1);
    }

    /**
     * 4 位浮点数 uniform 变量赋值
     * @param {*} uniform uniform 变量
     * @param {*} val0 
     * @param {*} val1 
     * @param {*} val2 
     * @param {*} val3 
     */
    uniform4f(uniform, val0, val1, val2, val3) {
        this.gl.uniform4f(uniform, val0, val1, val2, val3);
    }
}